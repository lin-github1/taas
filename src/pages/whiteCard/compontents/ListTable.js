import React, {Component, useState} from 'react';
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Divider,
  List,
  Pagination,
  Popconfirm,
  Popover,
  Table,
  Tag,
  notification, Tooltip, Spin, Modal, Form, Checkbox
} from "antd";
import {Link} from "umi";
import config from "@/config/app";
import ListSearchCom from "./ListSearchCom";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import "./ListTable.less"
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import {sdc_sum} from "@/utils";
import AppstoreOutlined from "@ant-design/icons/lib/icons/AppstoreOutlined";
import AimOutlined from "@ant-design/icons/lib/icons/AimOutlined";
import DeploymentUnitOutlined from "@ant-design/icons/lib/icons/DeploymentUnitOutlined";
import OrderedListOutlined from "@ant-design/icons/lib/icons/OrderedListOutlined";
import {useRequest} from "@umijs/hooks";
import {startToRun, deleteJob, getNextRunTime, cancelCron} from "@/services/job";
import ShakeOutlined from "@ant-design/icons/lib/icons/ShakeOutlined";
import FundOutlined from "@ant-design/icons/lib/icons/FundOutlined";
import FolderOpenOutlined from "@ant-design/icons/lib/icons/FolderOpenOutlined";
import TeamOutlined from "@ant-design/icons/lib/icons/TeamOutlined";
import ClockCircleOutlined from "@ant-design/icons/lib/icons/ClockCircleOutlined";
import FormOutlined from "@ant-design/icons/lib/icons/FormOutlined";
import DeleteRowOutlined from "@ant-design/icons/lib/icons/DeleteRowOutlined";

function getPolymorphismMessage(_d) {
  if (_d === "0") {
    return "未配置"
  } else if (_d === "1") {
    return "按多态分类执行"
  } else if (_d === "2") {
    return "按所有支持款型任选一款执行一次"
  } else if (_d === "3") {
    return "按所有支持款型每个款型执行一次"
  } else {
    return "未知配置项"
  }
}

function getTagComponent(source) {
  if (source === "ticc") {
    return <Tooltip title={"TICC任务"}><Tag color="purple"><AppstoreOutlined/></Tag></Tooltip>
  } else if (source === "list") {
    return <Tooltip title={"自定义用例"}><Tag color="cyan"><TeamOutlined /></Tag></Tooltip>
  } else if (source === "folder") {
    return <Tooltip title={"按用例树"}> <Tag color="orange"><FolderOpenOutlined /></Tag></Tooltip>
  } else if (source === "search") {
    return <Tooltip title={"按用例集"}> <Tag color="green"><FundOutlined /></Tag></Tooltip>
  }
}

function getStatusColor(status) {

  if (status === 'executing' || status === 'teardown' || status === 'setup') {
    // return '#1890ff';
    return 'processing';
  } else if (status === 'suspend') {
    // return '#f5222d';
    return 'error';
  } else if (status === 'complete') {
    // return '#52c41a';
    return "success"
  }
  return 'warning';
}


const ListTable = (props)=>{
  const {
    form, requestInstance, reloadData, endTimeValue, startTimeValue
  } = props;
  const deleteRequest = useRequest(deleteJob,
    {
      manual: true,
      onSuccess: (data, params)=>{
        if (data && data.ErrorInfo && data.ErrorInfo.errCode === '0'){
          notification.success({
            message: "任务删除成功",
            description: `[${params[0].task_name}]删除成功`,
          });
        }
        reloadData()
      }
    }
  );
  const startRunRequest = useRequest(startToRun,
    {
      manual: true,
      onSuccess: (data, params)=>{
        if (data && data.ErrorInfo && data.ErrorInfo.errCode === '0'){
          notification.success({
            message: "任务启动成功",
            description: `[${params[0].task_name}]启动成功`,
          });
        }
        reloadData()
      }
    }
  );
  const [runModal, setRunModal] = useState(false);
  const [runTaskInfo, setRunTaskInfo] = useState({});
  const [runTaskCfg, setRunTaskCfg] = useState({upgrade: true});
  const getNextRunTimeRequest = useRequest(getNextRunTime, {manual:true});
  const cancelCronRequest = useRequest(cancelCron, {
    manual:true,
    onSuccess: (data, params)=>{
      if (data && data.ErrorInfo && data.ErrorInfo.errCode === '0'){
        notification.success({
          message: "任务定时删除成功",
          description: `[${params[0].task_name}]任务定时删除成功`,
        });
      }
      reloadData()
    }
  });
  return (
    <div className={'RecordTable'}>
      <ListSearchCom
        form={form}
        reloadData={reloadData}
        endTimeValue={endTimeValue}
        startTimeValue={startTimeValue}
      />
      <List
          className={'cardList'}
          dataSource={requestInstance.data ? requestInstance.data.MsgInfo.items: []}
          grid={{gutter: 8, xxl: 4, xl: 4, lg: 4, md: 3, sm: 2, xs: 1}}
          loading={requestInstance.loading}
          rowKey="id"
          renderItem={item => {
            const actions = [
              <Link
                to={`${config.baseUri}/task/${item.key}/edit`}
                key={'detailResult'}
                target={'_blank'}
              > <Tooltip title={"编辑任务"}><FormOutlined /></Tooltip></Link>,
              <Popconfirm
                key={'delete'}

                onConfirm={()=>deleteRequest.run({key: item.key, task_name: item.name})}
                title={'确定删除吗？'}
              >
                <Tooltip title={"删除任务"}><DeleteOutlined/></Tooltip>
              </Popconfirm>,
              <Tooltip key={"run"} title={"执行任务"}><ShakeOutlined onClick={()=>{
                setRunTaskInfo({key: item.key, task_name: item.name});
                setRunModal(true);
              }}/></Tooltip>
            ];
            // if (item.cron && item.cron.cron) {
            //   actions.splice(1, 0 , <Popconfirm
            //     key={'run'}
            //     onConfirm={()=>startRunRequest.run({key: item.key, task_name: item.name})}
            //     title={'确定发起一次执行？'}
            //   >
            //     <Tooltip title={"刷新下一次执行时间"}><ClockCircleOutlined /> </Tooltip>
            //   </Popconfirm>)
            // }
            let extraInfo = <Button type={"link"} icon={<ClockCircleOutlined />}/>;
            return (
              <List.Item>
                <Card
                  actions={actions}
                  className={'card'}
                  // extra={<span>{extraInfo}</span>}
                  style={{borderBottom: 'none', marginBottom: 10}}
                  title={
                    <span>
                        <span>{getTagComponent(item.category)}</span>
                        <Divider type={'vertical'}/>
                      {
                        <span
                          style={{fontSize: '9px', marginLeft: '3px', marginRight: '3px', color: '#00000066'}}
                          title={getPolymorphismMessage(item.polymorphic)}
                        >
                              {getPolymorphismMessage(item.polymorphic)}
                            </span>
                      }
                      </span>
                  }
                >
                  <Descriptions column={1}>
                    <Descriptions.Item label={'任务名称'}>
                      {item.name}
                    </Descriptions.Item>
                    <Descriptions.Item label={'下次执行时间'}>
                      {
                        item.cron
                        && item.cron.cron
                          ? <span>
                              <span>
                                {
                                  getNextRunTimeRequest.params.length>0
                                  && getNextRunTimeRequest.params[0].key === item.key
                                  && getNextRunTimeRequest.loading
                                    ?
                                    <Spin size={"small"} />
                                    :
                                    getNextRunTimeRequest.params.length>0 && getNextRunTimeRequest.params[0].key === item.key ?
                                      getNextRunTimeRequest.data && getNextRunTimeRequest.data.MsgInfo
                                      || item.next_runtime
                                      || "未获取到"
                                      :
                                      item.next_runtime || "未获取到"
                                }
                              </span>
                              <Divider type={'vertical'}/>
                               <Tooltip title={"刷新执行时间"}>
                                <Button type={"link"} size={"small"} icon={<ClockCircleOutlined />}
                                        onClick={()=>getNextRunTimeRequest.run({key: item.key})}/>
                               </Tooltip>
                              <Divider type={'vertical'}/>
                              <Popconfirm
                                 key={'delete'}
                                 onConfirm={()=>cancelCronRequest.run({key: item.key, task_name: item.name})}
                                 title={'确定删除该任务的定时吗？'}
                              >
                                <Tooltip title={"删除定时"}><DeleteRowOutlined style={{color: "#ff4d4f"}}/></Tooltip>
                              </Popconfirm>
                          </span>
                          : "立即触发"
                      }

                    </Descriptions.Item>
                    <Descriptions.Item label={'创建时间'}>
                      {item.create_time}
                    </Descriptions.Item>
                    <Descriptions.Item label={'发起人'}>
                      {
                        item.creator === item.receive_source ? item.creator : `${item.receive_source ? item.receive_source : ''}${item.receive_source ? '/' : ''}${item.creator}`
                      }
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </List.Item>
            )
          }}
        />
      <Pagination
        {...requestInstance.pagination}
        onChange={requestInstance.pagination.changeCurrent}
        showQuickJumper
        showTotal={
          total => <span>总计 {total} 条目 <Button icon={<ReloadOutlined/>} onClick={requestInstance.refresh}>刷新</Button></span>}
        style={{textAlign: 'center'}}
        total={requestInstance.data ? requestInstance.data.MsgInfo.total: 0}
      />
      {runModal && <Modal
        title="执行任务"
        visible={runModal}
        // width={1200}
        onOk={()=>{
          startRunRequest.run({...runTaskInfo, ...runTaskCfg});
          setRunModal(false)
        }}
        // destroyOnClose={true}
        onCancel={()=>setRunModal(false)}
      >
        <Form initialValues={{upgrade: true}}>
          <Form.Item label="执行配置" style={{marginBottom: "0px"}}>
            <Tooltip title={"如果该任务响"}>
              <Form.Item name={"upgrade"} valuePropName={"checked"}>
                <Checkbox onChange={(e) => {
                  setRunTaskCfg({...setRunTaskCfg, upgrade: e.target.checked})
                }}>是否进行升级(如有)</Checkbox>
              </Form.Item>
            </Tooltip>
          </Form.Item>
        </Form>

      </Modal>}
    </div>
  )
};

export default ListTable;
