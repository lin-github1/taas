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
        description: "??????????????????????????????",
        message: '?????????',
      });
    } else {
      deleteSetRequest.run({key: id})
    }
  };
  return (
    <Card
      title={"???????????????"}
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
          >???????????????</Button>
        </div>
      }
      style={{margin: "24px 24px 0"}}
    >
      <div>
        <Form form={form} {...formItemLayout} style={{marginBottom: "24px"}} onValuesChange={submit}>
          <Row>
            <Col lg={lg} md={md} sm={sm} xs={xs} className="gutter-row">
              <Form.Item name={"name"} label="??????">
                <Input placeholder="???????????????"/>
              </Form.Item>
            </Col>
            <Col lg={lg} md={md} sm={sm} xs={xs} className="gutter-row">
              <Form.Item name={"creator"} label="?????????">
                <Input placeholder="??????????????????"/>
              </Form.Item>
            </Col>
            <Col lg={lg} md={md} sm={sm} xs={xs} className="gutter-row">
              <Form.Item name={"current_scope"} label="????????????">
                <Select allowClear placeholder="?????????????????????">
                  {scopeList.map(scope => (
                    <Select.Option value={scope.tmss_uri} key={scope.pk}>{scope.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col lg={lg} md={md} sm={sm} xs={xs} className="gutter-row">
              <Form.Item name={"fixture"} label="??????Fixture">
                <Select allowClear mode={"multiple"} placeholder="?????????Fixture">
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
            > <span><EyeOutlined/> ????????????</span></a>,
            <Popconfirm
              key={'delete'}
              onConfirm={()=>deleteCaseSet(item.id, item.creator)}
              title={'??????????????????'}
            >
              <a><span><DeleteOutlined/> ??????</span></a>
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
                  <Descriptions.Item label={'????????????'}>
                    {item.scope}
                  </Descriptions.Item>
                  <Descriptions.Item label={'??????Fixture'}>
                    {item.fixture || "ALL"}
                  </Descriptions.Item>
                  <Descriptions.Item label={'????????????'}>
                    {item.create_time}
                  </Descriptions.Item>
                  <Descriptions.Item label={'????????????'}>
                    {updateCountRequest.params.length > 0 && updateCountRequest.params[0].key === item.id && updateCountRequest.loading
                    ? <Spin size={"small"}/>
                    : <span>{caseCount[[item.id]] || item.count || 0}
                      <Divider type={'vertical'}/>
                      <Tooltip title={"??????????????????"}>
                        <Button
                          type={"link"} size={"small"}
                          icon={<ReloadOutlined />}
                          onClick={()=>updateCountRequest.run({key: item.id})}
                        />
                      </Tooltip>
                    </span>}
                  </Descriptions.Item>
                  <Descriptions.Item label={'?????????'}>
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
          total => <span>?????? {total} ?????? <Button icon={<ReloadOutlined/>} onClick={refresh}>??????</Button></span>}
        style={{textAlign: 'center'}}
        total={data ? data.MsgInfo.total: 0}
      />
    </Card>
  );
};

export default CaseSetList;
