import React, {useState} from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Card,
  Popconfirm,
  List,
  Divider,
  Descriptions, Pagination, notification, Tooltip, Spin
} from 'antd';
import {useMount, useRequest} from '@umijs/hooks'
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import config from "@/config/app";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import {getCaseSetList, getFixtureList, getScope, deleteSet, updateCaseCount} from "../../services/caseSetConfig";
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";

const CaseSetList = (props) => {
  const [form] = Form.useForm();
  const [scopeList, setScopeList] = useState([]);
  useRequest(getScope, {
    onSuccess: (data, params) => {
      setScopeList(data.MsgInfo)
    }
  });
  const [fixtureList, setFixtureList] = useState([]);
  const fixtureRequest = useRequest(getFixtureList, {manual: true, onSuccess: (data, params)=>{setFixtureList(data.MsgInfo)}});
  const { params, run, data, loading, pagination,refresh } = useRequest(
    getCaseSetList,
    {
      paginated: true,
      debounceInterval: 500,
      defaultParams: [
        {current: 1, pageSize: 8}
      ]
    },
  );
  const [caseCount, setCaseCount] = useState({});
  const updateCountRequest = useRequest(updateCaseCount, {
    manual: true,
    onSuccess: (data, params)=>{
      setCaseCount({...caseCount, [params[0].key]: data.MsgInfo})
    }
  });
  // console.log(updateCountRequest.params)
  const submit = ()=>{
    run({...params[0], ...form.getFieldsValue()})
  };
  useMount(
    () => {
      fixtureRequest.run();
    }
  );
  const lg = 6, md = 12, sm = 12, xs = 24;

  const formItemLayout = {
    labelCol: {
      xs: {span: 4},
      sm: {span: 6}
    },
    wrapperCol: {
      xs: {span: 20},
      sm: {span: 18}
    }
  };
  const deleteSetRequest = useRequest(
    deleteSet,
    {
      manual: true,
      onSuccess: ()=>{submit()}
    }
    );
  const deleteCaseSet = (id, creator)=>{
    if (props.user.short_name !== creator) {
      notification.warning({
        description: "您无权限删除该用例集",
        message: '无权限',
      });
    } else {
      deleteSetRequest.run({key: id})
    }
  };
  return (
    <Card
      title={"用例集列表"}
      extra={
        <div>
          <Button
            ghost
            icon={<PlusOutlined/>}
            onClick={() => {
              props.history.push(`${config.baseUri}/case/config/edit`);
            }}
            style={{marginRight: '10px'}}
            type={'primary'}
          >新建用例集</Button>
        </div>
      }
      style={{margin: "24px 24px 0"}}
    >
      <div>
        <Form form={form} {...formItemLayout} style={{marginBottom: "24px"}} onValuesChange={submit}>
          <Row>
            <Col lg={lg} md={md} sm={sm} xs={xs} className="gutter-row">
              <Form.Item name={"name"} label="名称">
                <Input placeholder="请输入名称"/>
              </Form.Item>
            </Col>
            <Col lg={lg} md={md} sm={sm} xs={xs} className="gutter-row">
              <Form.Item name={"creator"} label="创建人">
                <Input placeholder="请输入创建人"/>
              </Form.Item>
            </Col>
            <Col lg={lg} md={md} sm={sm} xs={xs} className="gutter-row">
              <Form.Item name={"current_scope"} label="用例范围">
                <Select allowClear placeholder="请选择用例范围">
                  {scopeList.map(scope => (
                    <Select.Option value={scope.tmss_uri} key={scope.pk}>{scope.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col lg={lg} md={md} sm={sm} xs={xs} className="gutter-row">
              <Form.Item name={"fixture"} label="用例Fixture">
                <Select allowClear mode={"multiple"} placeholder="请选择Fixture">
                  {fixtureList && fixtureList.map((item, index)=><Select.Option value={item} key={index}>{item}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <List
        className={'cardList'}
        dataSource={data ? data.MsgInfo.list: []}
        grid={{gutter: 8, xxl: 4, xl: 4, lg: 4, md: 3, sm: 2, xs: 1}}
        loading={loading}
        rowKey="id"
        renderItem={item => {
          const actions = [
            <a
              href={`${config.baseUri}/case/config/${item.id}/edit`}
              key={'detail'}
            > <span><EyeOutlined/> 查看详情</span></a>,
            <Popconfirm
              key={'delete'}
              onConfirm={()=>deleteCaseSet(item.id, item.creator)}
              title={'确定删除吗？'}
            >
              <a><span><DeleteOutlined/> 删除</span></a>
            </Popconfirm>
          ];
          return (
            <List.Item>
              <Card
                actions={actions}
                className={'card'}
                style={{borderBottom: 'none', marginBottom: 10}}
                title={<span>{item.name}</span>}
              >
                <Descriptions column={1}>
                  <Descriptions.Item label={'用例版本'}>
                    {item.scope}
                  </Descriptions.Item>
                  <Descriptions.Item label={'用例Fixture'}>
                    {item.fixture || "ALL"}
                  </Descriptions.Item>
                  <Descriptions.Item label={'创建时间'}>
                    {item.create_time}
                  </Descriptions.Item>
                  <Descriptions.Item label={'用例数量'}>
                    {updateCountRequest.params.length > 0 && updateCountRequest.params[0].key === item.id && updateCountRequest.loading
                    ? <Spin size={"small"}/>
                    : <span>{caseCount[[item.id]] || item.count || 0}
                      <Divider type={'vertical'}/>
                      <Tooltip title={"刷新用例数量"}>
                        <Button
                          type={"link"} size={"small"}
                          icon={<ReloadOutlined />}
                          onClick={()=>updateCountRequest.run({key: item.id})}
                        />
                      </Tooltip>
                    </span>}
                  </Descriptions.Item>
                  <Descriptions.Item label={'创建人'}>
                    {item.creator}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </List.Item>
          )
        }}
      />
      <Pagination
        {...pagination}
        onChange={pagination.changeCurrent}
        showQuickJumper
        showTotal={
          total => <span>总计 {total} 条目 <Button icon={<ReloadOutlined/>} onClick={refresh}>刷新</Button></span>}
        style={{textAlign: 'center'}}
        total={data ? data.MsgInfo.total: 0}
      />
    </Card>
  );
};

export default CaseSetList;
