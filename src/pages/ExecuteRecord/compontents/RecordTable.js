import React, {Component} from 'react';
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
  notification
} from "antd";
import config from "@/config/app";
import TaskSearch from "./SearchCom";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import "./RecordTable.less"
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import {sdc_sum} from "@/utils";
import AppstoreOutlined from "@ant-design/icons/lib/icons/AppstoreOutlined";
import ApiOutlined from "@ant-design/icons/lib/icons/ApiOutlined";
import AimOutlined from "@ant-design/icons/lib/icons/AimOutlined";
import DeploymentUnitOutlined from "@ant-design/icons/lib/icons/DeploymentUnitOutlined";
import OrderedListOutlined from "@ant-design/icons/lib/icons/OrderedListOutlined";
import {useRequest} from "@umijs/hooks";
import {deleteRecord, stopRecord} from "@/services/record";

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
    return <Tag color="purple"><AppstoreOutlined/> Ticc </Tag>
  } else if (source === "amt") {
    return <Tag color="blue"><AimOutlined /> AMT </Tag>
  } else if (source === "ammis") {
    return <Tag color="orange"><DeploymentUnitOutlined /> Ammis </Tag>
  } else if (source === "case") {
    return <Tag color="green"><OrderedListOutlined /> Case </Tag>
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


const RecordTable = (props)=>{
  const {
    form, viewType, requestInstance, reloadData, range, endTimeValue, startTimeValue
  } = props;
  const deleteRequest = useRequest(deleteRecord,
    {
      manual: true,
      onSuccess: (data, params)=>{
        if (data && data.ErrorInfo && data.ErrorInfo.errCode === '0'){
          notification.success({
            message: "任务删除成功",
            description: `[${params[0].task_name}]删除成功`,
          });
        }
        reloadData(range)
      }
    }
  );
  const stopRequest = useRequest(stopRecord,
    {
      manual: true,
      onSuccess: (data, params)=>{
        if (data && data.ErrorInfo && data.ErrorInfo.errCode === '0'){
          notification.success({
            message: "任务停止成功",
            description: `[${params[0].task_name}]停止成功`,
          });
        }
        reloadData(range)
      }
    }
  );
  const getTestCaseSummary = (data)=> {
    const dataSource = [
      {
        key: '1',
        Pass: data['Pass'],
        Failed: data['Failed'],
        Investigated: data['Investigated'],
        Error: data['Error'],
        Block: data['Block'],
        Unknown: data['Unknown']
      }
    ];
    const columns = [
      {title: 'Pass', dataIndex: 'Pass', key: 'Pass', align: "center"},
      {title: 'Failed', dataIndex: 'Failed', key: 'Failed', align: "center"},
      {title: 'Investigated', dataIndex: 'Investigated', key: 'Investigated', align: "center"},
      {title: 'Error', dataIndex: 'Error', key: 'Error', align: "center"},
      {title: 'Block', dataIndex: 'Block', key: 'Block', align: "center"}
    ];
    if (data['Unknown'] !== 0) {
      columns.splice(5, 0,
        {title: 'Unknown', dataIndex: 'Unknown', key: 'Unknown', align: "center"})
    }
    return (
      <Table pagination={false} bordered size={"small"} dataSource={dataSource} columns={columns}/>
    );
  };
  const tableColumns = [
    {
      title: '任务名称',
      dataIndex: 'receive_task_name',
      ellipsis: true
    }, {
      title: '发起人',
      dataIndex: 'creator',
    }, {
      title: '任务状态',
      dataIndex: 'status',
      render: (text, record) => {
        return <Tag color={getStatusColor(text)}>{record.status_display}</Tag>
      }
    }, {
      title: '执行概况',
      dataIndex: 'general_result',
      render: (text, record) => {
        return record.general_result ? <Popover
          placement="topLeft"
          title={
            <span
              style={{fontSize: '9px', marginLeft: '3px', marginRight: '3px', color: '#595959'}}>
                                      待执行用例数: {record.test_case_num}
              <Divider type={'vertical'}/>
                用例总执行次数： {sdc_sum(Object.values(record.general_result))}
              </span>
          }
          content={getTestCaseSummary(record.general_result)}
        >
            <span>
              <Badge status="error" text={`Failed: ${record.general_result['Failed']}`}/>
              <Divider type={'vertical'}/>
              <Badge status="success" text={`Pass: ${record.general_result['Pass']}`} style={{marginLeft: '3px'}}/>
            </span>
        </Popover>: "-"
      }
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
    }, {
      title: '操作',
      key: 'action',
      width: 300,
      render: (text, record) => {
        return <div>
          <a href={`${config.baseUri}/task/execution/${record.task_id}/report`}
          ><EyeOutlined/> 查看详情</a>
          <Divider type={'vertical'}/>
          <Popconfirm
            onConfirm={()=>deleteRequest.run({task_id: item.task_id, task_name: item.receive_task_name})}
            title={'确定删除吗？'}
          >
            <a><DeleteOutlined/> 删除</a>
          </Popconfirm>
          <Divider type={'vertical'}/>
          <Popconfirm
            onConfirm={()=>stopRequest.run({task_id: item.task_id, task_name: item.receive_task_name})}
            title={'确定停止吗？'}
          >
            <a><ApiOutlined /> 停止任务</a>
          </Popconfirm>
        </div>;
      }
    }
  ];
  return (
    <div className={'RecordTable'}>
      <TaskSearch
        form={form}
        reloadData={reloadData}
        endTimeValue={endTimeValue}
        startTimeValue={startTimeValue}
      />
      {
        viewType === 'card' && <List
          className={'cardList'}
          dataSource={requestInstance.data ? requestInstance.data.MsgInfo.items: []}
          grid={{gutter: 8, xxl: 4, xl: 4, lg: 4, md: 3, sm: 2, xs: 1}}
          loading={requestInstance.loading}
          rowKey="id"
          renderItem={item => {
            const actions = [
              <a
                href={`${config.baseUri}/task/execution/${item.task_id}/report`}
                key={'detailResult'}
              > <span><EyeOutlined/> 查看详情</span></a>,
              <Popconfirm
                key={'delete'}
                onConfirm={()=>deleteRequest.run({task_id: item.task_id, task_name: item.receive_task_name})}
                title={'确定删除吗？'}
              >
                <a><span><DeleteOutlined/> 删除</span></a>
              </Popconfirm>,
              <Popconfirm
                key={'delete'}
                onConfirm={()=>stopRequest.run({task_id: item.task_id, task_name: item.receive_task_name})}
                title={'确定停止吗？'}
              >
                <a><span><ApiOutlined/> 停止</span></a>
              </Popconfirm>
            ];
            let extraInfo = <Tag color={getStatusColor(item.status)}>{item.status_display}</Tag>;
            return (
              <List.Item>
                <Card
                  actions={actions}
                  className={'card'}
                  extra={<span>{extraInfo}</span>}
                  style={{borderBottom: 'none', marginBottom: 10}}
                  title={
                    <span>
                        <span>{getTagComponent(item.receive_source)}</span>
                        <Divider type={'vertical'}/>
                      {
                        <span
                          style={{fontSize: '9px', marginLeft: '3px', marginRight: '3px', color: '#00000066'}}
                          title={getPolymorphismMessage(item.polymorphism)}
                        >
                              {item.polymorphism_display}
                            </span>
                      }
                      </span>
                  }
                >
                  <Descriptions column={1}>
                    <Descriptions.Item
                      title={item.receive_task_name} label={'任务名称'}
                      style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        wordBreak: "keep-all",
                        width: "250px"
                      }}
                    >
                      <span title={item.receive_task_name} >
                      {item.receive_task_name.length > 30 ? item.receive_task_name.slice(0,30) + "..." : item.receive_task_name}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item label={'执行概况'}>
                      {
                        item.general_result && Object.keys(item.general_result).length > 0 ?
                          <Popover
                            placement="topLeft"
                            title={
                              <span
                                style={{fontSize: '9px', marginLeft: '3px', marginRight: '3px', color: '#595959'}}>
                                  待执行用例数: {item.test_case_num}
                                <Divider type={'vertical'}/>
                                  用例总执行次数： {sdc_sum(Object.values(item.general_result))}
                                </span>
                            }
                            content={getTestCaseSummary(item.general_result)}
                          >
                              <span>
                                <Badge status="error" text={`Failed ${item.general_result['Failed']}`}/>
                                <Divider type={'vertical'}/>
                                <Badge status="success" text={`Pass: ${item.general_result['Pass']}`}
                                       style={{marginLeft: '3px'}}/>
                              </span>
                          </Popover> : '-'
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
      }
      {
        viewType === 'table' &&
        <div className={'dev_list'} style={{margin: '20px 0'}}>
          <Table
            bordered
            columns={tableColumns}
            dataSource={requestInstance.data ? requestInstance.data.MsgInfo.items: []}
            loading={requestInstance.loading}
            pagination={false}
            style={{backgroundColor: '#ffffff'}}
          />
        </div>
      }
      <Pagination
        {...requestInstance.pagination}
        onChange={requestInstance.pagination.changeCurrent}
        showQuickJumper
        showTotal={
          total => <span>总计 {total} 条目 <Button icon={<ReloadOutlined/>} onClick={requestInstance.refresh}>刷新</Button></span>}
        style={{textAlign: 'center'}}
        total={requestInstance.data ? requestInstance.data.MsgInfo.total: 0}
      />
    </div>
  )
};

export default RecordTable;
