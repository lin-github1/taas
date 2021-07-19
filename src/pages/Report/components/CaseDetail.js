import React, {useState, useEffect} from "react";
import {
  Button,
  Cascader,
  Col,
  Collapse, Descriptions,
  Drawer, Form, Input, notification, Row, Tabs, Typography
} from "antd";
import {useMount, useRequest} from "@umijs/hooks";
import {caseDetail} from "@/services/record";
import {saveAnalysisResult} from "@/services/analysis";
import {CauseOptions} from "@/utils";
import {Loader} from "@/components";
import {history} from "umi";
import request from "umi-request";

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16}
};
const formTailLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
    offset: 6,
  },
};

const CaseDetail =(props)=>{
  const [form] = Form.useForm();
  const {visible, onClose, caseID} = props;
  const [caseData, setCaseData] = useState({});
  const caseDetailInstance = useRequest(caseDetail, {
    manual: true,
    onSuccess: (data, params)=>{
      setCaseData(data.MsgInfo);
      form.setFieldsValue({
        cause: data.MsgInfo.major_cause ? [data.MsgInfo.major_cause, data.MsgInfo.minor_cause] : [],
        root_cause: data.MsgInfo.root_cause, dts: data.MsgInfo.dts
      })
    }
  });
  const [causeOptions, setCauseOptions] = useState(CauseOptions);
  useMount(() => {
    request.get("http://10.244.179.0:51010/prod/conf/cause.json")
      .then((res) => setCauseOptions(res))
      .catch(() => {
        setCauseOptions(CauseOptions)
      });
  });
  const saveRequest = useRequest(saveAnalysisResult, {
    manual: true,
    onSuccess: ()=>{
      notification.info({
        description: "分析结果提交成功",
        message: '提交分析结果',
      });
    }
  });
  useEffect(() => {
    const updateCase = ()=> {
      if (caseID) {
        caseDetailInstance.run({case_id: caseID})
      }
    };
    updateCase();
  }, [caseID]);

  const handleSubmit = ()=> {
    form.validateFields()
      .then((da)=> saveRequest.run({...da, key:caseID}))
  };

  return (
    <Drawer
      destroyOnClose={true}
      onClose={()=>{
        onClose(false);
        history.push()
      }}
      visible={visible}
      closable={false}
      placement={"right"}
      width={"900"}
    >
      {/*tabBarExtraContent={}*/}
      <Tabs defaultActiveKey="1" type="card">
        <Tabs.TabPane tab="基本信息" key="1">
          {
            caseDetailInstance.loading
              ? <Loader loadTxt="任务数据加载中" spinning={true} fullScreen={false}/>
              : <Collapse defaultActiveKey={['1', '2', '4']}>

                <Collapse.Panel header="分析" key="1">
                  <Form
                    {...formItemLayout}
                    form={form}
                    name="dynamic_rule"
                  >
                    <Row>
                      <Col span={12} key={"data1"}>
                        <Form.Item
                          // name="analyst"
                          label="分析人员"
                          style={{marginBottom: "6px"}}
                        >
                          {caseData.analysts || "未分析"}
                        </Form.Item>
                      </Col>
                      <Col span={12} key={"data2"}>
                        <Form.Item
                          name="cause"
                          label="问题分类"
                          style={{marginBottom: "6px"}}
                          rules={[{required: true,}]}
                        >
                          <Cascader
                            options={causeOptions}
                            fieldNames={{label: 'title', value: 'id', children: 'items'}}
                            showSearch
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12} key={"data1"}>
                        <Form.Item
                          name="root_cause"
                          label="详细原因"
                          style={{marginBottom: "12px"}}
                        >
                          <Input.TextArea rows={2}/>
                        </Form.Item>
                      </Col>
                      <Col span={12} key={"data2"}>
                        <Form.Item
                          name="dts"
                          label="已提交的单号"
                          style={{marginBottom: "12px"}}
                          rules={[
                            {
                              validator: (_, value) => {
                                if (!!value) {
                                  const _tmp = value.split(";").filter(
                                    (item) => /^DTS\d{13}$/gi.test(item.toUpperCase()) || /^SN\d+$/gi.test(item.toUpperCase()));
                                  if (value.split(";").length === _tmp.length) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject('仅能输入DTS单号(dts开头)或者猎鹰单号(SN开头)，多个按;隔开');
                                }
                                return Promise.resolve();
                              }
                            },
                          ]}
                        >
                          <Input.TextArea rows={2}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12} offset={12} key={"data3"}>
                        <Form.Item  {...formTailLayout} style={{marginBottom: "6px", textAlign: 'right'}}>
                          <Button type="primary" onClick={handleSubmit}>
                            Submit
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                  {/*<AnalysisForm*/}
                  {/*  data={caseData}*/}
                  {/*/>*/}
                  {/*<Descriptions size="small" column={1} bordered colon={false}>*/}
                  {/*  <Descriptions.Item label="问题分类">{"-"}</Descriptions.Item>*/}
                  {/*  <Descriptions.Item label="问题子类">{"-"}</Descriptions.Item>*/}
                  {/*</Descriptions>*/}
                </Collapse.Panel>
                  <Collapse.Panel header="用例信息" key="2">
                    <Descriptions size={"small"} bordered column={2}>
                      <Descriptions.Item label={"用例名称"} span={2}>
                        <Typography.Paragraph
                          // ellipsis={true}
                          // title={taskInfo?taskInfo.task_index: "-"}
                          style={{margin: 0, maxWidth: 680}}
                        >
                          {caseData ? caseData.name: "-"}
                        </Typography.Paragraph>
                      </Descriptions.Item>
                      <Descriptions.Item span={2} label={"所在脚本"}>
                        <Typography.Paragraph
                          // ellipsis={true}
                          // title={taskInfo?taskInfo.task_index: "-"}
                          style={{margin: 0, width: 580}}
                        >
                          {caseData ? caseData.case_script_path: "-"}
                        </Typography.Paragraph>
                      </Descriptions.Item>
                      <Descriptions.Item span={2} label={"用例编号"}>
                        {caseData ? caseData.tcid: "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label={"fixture"}>{caseData ? caseData.fixture: "-"} </Descriptions.Item>
                    </Descriptions>
                  </Collapse.Panel>
                  <Collapse.Panel header="执行环境信息" key="3">
                    <Descriptions size="small" column={1} bordered>
                      <Descriptions.Item label="测试床">{caseData && caseData.env_info ? caseData.env_info.test_bed: "-"}</Descriptions.Item>
                      <Descriptions.Item label="环境ID">{caseData && caseData.env_info ? caseData.env_info.test_env_id: "-"}</Descriptions.Item>
                      <Descriptions.Item label="环境IP">{caseData && caseData.env_info ? caseData.env_info.main_ip: "-"}</Descriptions.Item>
                      <Descriptions.Item label="主节点款型">{caseData && caseData.env_info ? caseData.env_info.model: "-"}</Descriptions.Item>
                      <Descriptions.Item label="主节点版本">{caseData && caseData.env_info ? caseData.env_info.version: "-"}</Descriptions.Item>
                      <Descriptions.Item label="主节点版本时间">{caseData && caseData.env_info ? caseData.env_info.version_time: "-"}</Descriptions.Item>
                      {/*<Descriptions.Item label="主节点芯片">{record.env_info.test_bed}</Descriptions.Item>*/}
                    </Descriptions>
                  </Collapse.Panel>
                  <Collapse.Panel header="执行结果" key="4">
                    <Descriptions size="small" column={1} bordered>
                      <Descriptions.Item label="测试结果">{caseData ? caseData.result_display: "-"}</Descriptions.Item>
                      <Descriptions.Item label="执行时间">{caseData ? caseData.run_time: "-"}({caseData ? caseData.cost_time: 0}s)</Descriptions.Item>
                      <Descriptions.Item label="详细原因">
                        <Typography.Paragraph
                          style={{margin: 0}}
                        >
                          <pre style={{maxWidth: 680, maxHeight: 300, overflow: "auto"}}>
                            {caseData ? caseData.fail_msg: "-"}
                          </pre>
                        </Typography.Paragraph>
                      </Descriptions.Item>
                    </Descriptions>
                  </Collapse.Panel>
                  <Collapse.Panel header="执行机信息" key="5">
                    <Descriptions size="small" column={1} bordered colon={false}>
                      <Descriptions.Item label="Agent">{caseData ? caseData.agent: "-"}</Descriptions.Item>
                      <Descriptions.Item label="当时网络地址">{"-"}</Descriptions.Item>
                    </Descriptions>
                  </Collapse.Panel>
                </Collapse>
          }
        </Tabs.TabPane>
        <Tabs.TabPane tab="执行日志" key="2">
          <pre style={{backgroundColor:"#bfbfbf", maxWidth: 820, maxHeight: 820, overflow: "auto"}}>
            {caseData ? caseData.console: "-"}
          </pre>
        </Tabs.TabPane>
        {/*<Tabs.TabPane tab="历史记录" key="3">*/}
        {/*  Content of Tab Pane 3*/}
        {/*</Tabs.TabPane>*/}
      </Tabs>

    </Drawer>
  )
};

export default CaseDetail
