import React, { useState } from 'react';
import { Button, Card, Form, Input, Radio, Select, TreeSelect, Checkbox, Tooltip, Row, Col, notification, Icon,Spin } from 'antd';
import { useMount, useRequest } from '@umijs/hooks';
import moment from "moment";
import { history } from "umi"

import { getJobContainerList, saveJob, saveJobV2 } from "@/services/job";
// import ListTable from "./compontents/ListTable";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import config from "@/config/app";
import { ErrorHandle } from "@/utils/errorHandle"
import MinusCircleOutlined from "@ant-design/icons/lib/icons/MinusCircleOutlined";
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import EnvSelect from "@/pages/whiteCard/compontents/EnvSelect";
const endTimeValue = moment();
const startTimeValue = moment().subtract(1, 'months');

const TaskList2 = (props) => {
  const [showEnvSelect, setShowEnvSelect] = useState(false);
  const [requestdata, setRequestdata] = useState()
  const [formLayout, setFormLayout] = useState('horizontal')
  const [dataErrorMsg, setDataErrorMsg] = useState("");
  const [form] = Form.useForm();
  // const formItemLayout = formLayout === 'horizontal' ? {
  //   labelCol: { span: 8 },
  //   wrapperCol: { span: 5 },
  // } : null;
  // const buttonItemLayout = formLayout === 'horizontal' ? {
  //   wrapperCol: { span: 14, offset: 4 },
  // } : null;
  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 18 },
  };
  const formItemLayout2 = {
    wrapperCol: { offset: 3 },
  };
  const buttonItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { offset: 3 },
  };
  // const state = {
  //   value: ['0-0-0'],
  // }
  const [state, setState] = useState({
    value: []
  })
  const setEnvConfig = (data) => {
    form.setFieldsValue({ env: data });
  };
  const [fromData, setFromData] = useState({
    case_timeout: 1200, public_timeout: 12, polymorphic: 1,
    topo: "by_bed", scope_list: ["all"], scope_black_list: [],
    version_define: false, version_list: ["all"],
    packet_mode: false, install_packet: false,
    upgrade_reset: true, uninstall_app: true, by_ssh: false, to_backup: true, app_pkg_type: "tar",
    cron: false,
    self_define: false, user_define: { user_define_variable: {} }, script_no: "70",
    limit_agents: 10, tags: [],
    include_users: "",
    spinloading:false,  // ???????????????
    //??????
    mainIp: [],//??????IP
    envId: [], //??????ID
    deviceType: [],//????????????
    upgradePacket: [],//???????????????
    controlpath:[],// ???????????????????????????
    resConfig: 1, // ???????????? 1-?????? 2-?????????
    upgradeMode: 1,// ????????????  1???????????????????????? 2:??????????????????+????????????
    targetModel: 1,// ??????/????????????
    TaskType: 3,//???????????? 1-???????????? 2-??????????????? 3-OQC
    upgradeMethod: 1,//???????????? 1-????????? 2-???????????????  3-?????????+???????????????
    controlInstallMode: 2, //??????????????????  1-????????? 2-?????????????????? 3-????????????


  });
  //????????????
  const SHOW_PARENT = TreeSelect.SHOW_PARENT;
  const treeData = [{
    title: '??????',
    value: 'whiteBox',
    key: 'whiteBox',
    // children: [{
    //   title: '??????????????????',
    //   value: '0-0-0',
    //   key: '0-0-0',
    // }],
  }, {
    title: 'OQC',
    value: 'OQC',
    key: 'OQC',
    //   children: [{
    //     title: '[0]????????????????????????',
    //     value: 'test_toMF_OQC_017',
    //     key: 'test_toMF_OQC_017',
    //   }, {
    //     title: '[0]??????IR-CUT??????????????????',
    //     value: 'test_toMF_OQC_006',
    //     key: 'test_toMF_OQC_006',
    //   }, {
    //     title: '[0]????????????????????????',
    //     value: 'test_toMF_OQC_004',
    //     key: 'test_toMF_OQC_004',
    //   },
    //   {
    //     title: '[0]????????????????????????????????????',
    //     value: 'test_toMF_OQC_018',
    //     key: 'test_toMF_OQC_018',
    //   },

    // ],
  },{
    title: 'AE??????',
    value: 'AE',
    key: 'AE',
  },{
    title: 'MVB??????',
    value: 'MVB',
    key: 'MVB',
  },{
    title: '????????????',
    value: 'market',
    key: 'market',
  },{
    title: '??????????????????',
    value: 'pic',
    key: 'pic',
  },{
    title: '???????????????',
    value: 'dynamics',
    key: 'dynamics',
  },{
    title: '?????????????????????',
    value: 'Scenario1',
    key: 'Scenario1',
  },{
    title: '?????????????????????',
    value: 'Scenario2',
    key: 'Scenario2',
  },{
    title: '??????AWB??????',
    value: 'greenery',
    key: 'greenery',
  }
];

  const treeOnChange = (value) => {
    console.log('onChange ', value);
    setState({ value });
  }
  const treeProps = {
    treeData,
    value: state.value,
    onChange: treeOnChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    searchPlaceholder: 'Please select',
    style: {
      width: 300,
    },
  };


  // handleFormLayoutChange = (e) => {
  //     this.setState({ formLayout: e.target.value });
  //   }

  const saveRequest = useRequest(saveJob, {
    manual: true,
    onSuccess: (data, params) => {
      // console.log(data)
      console.log(params)
      // console.log(ErrorHandle)
      // console.log(data.ErrorInfo)
      console.log("************")
      setFromData({ ...fromData, spinloading: false })
      if (data.ErrorInfo) {
        notification.info({
          description: "??????????????????",
          message: '????????????',
        });
        history.push(`${config.baseUri}/task`)
      }
    }
  });

  const saveRequestV2 = useRequest(saveJobV2, {
    manual: true,
    onSuccess: (data, params) => {
      // console.log(data)
      console.log(params)
      // console.log(ErrorHandle)
      // console.log(data.ErrorInfo)
      console.log("************")
      setFromData({ ...fromData, spinloading: false })
      if (data.ErrorInfo) {
        notification.info({
          description: "??????????????????",
          message: '????????????',
        });
        history.push(`${config.baseUri}/task`)
      }
    }
  });
  // ????????????
  const handleSubmit = (id) => {
    console.log('2222')
    console.log(id)
    console.log('1111')
    console.log(fromData)

    form.validateFields().then(values => {
      const { env } = values
      console.log('AAAAAAA')
      console.log(env)
      if (!env || (env && env.length === 0)) {
        setDataErrorMsg("????????????????????????????????????")
      } else {
        setDataErrorMsg("")
        fromData.upgradePacket = []
        fromData.deviceType = []
        fromData.mainIp = []
        fromData.envId = []
        fromData.controlpath=[]
        env.map(function (item) {
          console.log('????????????111111')
          console.log(item)
          console.log('????????????1111111')
          fromData.upgradePacket.push(item["upgrade_packet"])
          fromData.deviceType.push(item["main_type"])
          fromData.mainIp.push(item["main_ip"])
          fromData.envId.push(item["env_id"])
          fromData.controlpath.push(item["controlpath"])
        }
        )
        console.log(fromData)
        setFromData({ ...fromData, spinloading: true })
        if (id == "save") {
          saveRequestV2.run({
            ...fromData,
            ...form.getFieldsValue(),
            user_define: fromData.user_define,
            category: "search",
          });
        } else if (id == "savaAndExecute") {
          saveRequest.run({
            ...fromData,
            ...form.getFieldsValue(),
            user_define: fromData.user_define,
            category: "search",
          });
        }

      }
    })



  };

  function handleChange(value) {
    console.log(`selected ${value}`);
    if (value === "1") {
      setFromData({ ...fromData, TaskType: 1 })
    } else if (value === "2") {
      setFromData({ ...fromData, TaskType: 2 })
    } else if (value === "3") {
      setFromData({ ...fromData, TaskType: 3 })
    }
  }


  const onChange = (e) => {
    console.log('radio checked', e.target);
    if (e.target.name === "resConfigClick") {
      setFromData({ ...fromData, resConfig: e.target.value })
    } else if (e.target.name === "upgradeModeClick") {
      setFromData({ ...fromData, upgradeMode: e.target.value })
    } else if (e.target.name === "upgradeMethodClick") {
      setFromData({ ...fromData, upgradeMethod: e.target.value })
    } else if (e.target.name === "controlInstallModeClick") {
      setFromData({ ...fromData, controlInstallMode: e.target.value })
    }



    // this.setState({
    //   value: e.target.value,
    // });
  }

  return (
    // <span>{ requestdata}</span>
    <Row type="flex" justify="center" >
      <Col span={18}>
      <Spin tip="???????????????" spinning={fromData.spinloading} size="large">
        {/* <Card title="????????????" bordered={false} style={{ width: "50%", marginLeft: "25%" }}> */}
        <Card title="????????????"
          bordered={false}
          extra={
            <Button
              ghost
              onClick={() => {
                props.history.push(`${config.baseUri}/task`);
              }}
              // style={{marginRight: '10px'}}
              type={'primary'}
            >????????????</Button>
          }>
          <Form
            form={form}
            initialValues={fromData}
          >

            <Form.Item label="????????????" {...formItemLayout}>
              <Select defaultValue={String(fromData.TaskType)} style={{ width: 120 }} onChange={handleChange}>
                <Select.Option value="1" >????????????</Select.Option>
                <Select.Option value="2" disabled>????????????</Select.Option>
                <Select.Option value="3">OQC</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="????????????"
              name={"taskName"}
              {...formItemLayout}
              rules={[{ required: true, message: "??????????????????" }]}
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item
              label="????????????"
              name={"caseNumber"}
              rules={[{ required: true, message: "?????????????????????" }]}
              {...formItemLayout}
            >
              <TreeSelect {...treeProps} />
            </Form.Item>

            <Form.Item
              label="????????????"
              {...formItemLayout}
            >
              <Radio.Group onChange={onChange} value={fromData.upgradeMethod} name="upgradeMethodClick">
                <Radio value={1}>?????????</Radio>
                <Radio value={2}>???????????????</Radio>
                <Radio value={3}>?????????+???????????????</Radio>
              </Radio.Group>
            </Form.Item>

            {fromData.upgradeMethod === 1 && <>
            <Form.Item
              label="??????????????????"
              {...formItemLayout}
            >
              <Radio.Group onChange={onChange} value={fromData.controlInstallMode} name="controlInstallModeClick">
                <Radio value={1} >??????????????????</Radio>
                <Radio value={2}>????????????????????????</Radio>
                <Radio value={3} disabled>???????????????????????????</Radio>
              </Radio.Group>
            </Form.Item>
            </>}

            <Form.Item style={{ marginBottom: "20px" }} {...formItemLayout2}  >
              <Button
                type="dashed"
                onClick={() => setShowEnvSelect(true)}
                style={{ width: "80%" }}
              >
                <PlusOutlined /> ??????????????????
                              </Button>
            </Form.Item>
            {/* {fromData.upgrade == 1 && <FormItem
            label="????????????"
            {...formItemLayout}
          >
            <Input placeholder="C2150-10-I-PU(3.6mm)" />
          </FormItem>} */}
            <EnvSelect
              visible={showEnvSelect}
              // topo={fromData.topo}
              onClose={setShowEnvSelect}
              setEnvFormData={setEnvConfig}
              okData={fromData.env}
              user={props.user}
            />
            <Form.List name={"env"}  >
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map((field, index) => {
                      console.log(form.getFieldValue("env"))
                      const cData = form.getFieldValue("env")[index];
                      return (
                        <Row key={field.key} type="flex" justify="start" gutter={30} style={{ margin: "5px 0 0 -30px" }}  >
                          <Col span={4} offset={2}>
                            <Tooltip title={`??????:${cData.main_type}`}>
                              <Form.Item
                                label={`????????????:${index}`}
                                name={[field.name, "main_type",]}
                                fieldKey={[field.key, "key"]}
                              >
                                <Input disabled />
                              </Form.Item>
                            </Tooltip>
                          </Col>
                          <Col span={4}>
                            <Tooltip title={`??????IP: ${cData.main_ip}`}>
                              <Form.Item
                                name={[field.name, "env_id",]}
                                fieldKey={[field.key, "key"]}
                              >
                                <Input disabled />
                              </Form.Item>
                            </Tooltip>
                          </Col>
                          {fromData.upgradeMethod!==1 && <>
                          <Col span={12}>
                            <Tooltip title={`?????????????????????:${cData.version}??????????????????eiico??????????????????????????????????????????????????????:\\10.120.189.197\\sdcEiicoService\\sdcInstallPkg\\????????????????????????????????????????????????????????????pivsautotest,??????????????????????????????????????????version?????????buid_device_list.txt??????`}>
                              <Form.Item
                                name={[field.name, "upgrade_packet"]}
                                fieldKey={[field.fieldKey, "upgrade_packet"]}
                                rules={[{ required: true, message: "???????????????" }]}
                              >
                                <Input placeholder="???????????????????????????" />
                              </Form.Item>
                            </Tooltip>
                          </Col>
                          </>}

                          {fromData.upgradeMethod===1  && fromData.controlInstallMode===2 && <>
                          <Col span={12}>
                            <Tooltip title={`SDCPlayerInstall.exe????????????????????????????????????????????????????????????  ???:\\10.120.189.197\\sdcEiicoService\\sdcInstallPkg\\?????????????????????????????????????????????????????????????????????pivsautotest,???????????????????????????`}>
                              <Form.Item
                                name={[field.name, "controlpath"]}
                                fieldKey={[field.fieldKey, "controlpath"]}
                                rules={[{ required: true, message: "???????????????????????????" }]}
                              >
                                <Input placeholder="SDCPlayerInstall.exe?????????????????????" />
                              </Form.Item>
                            </Tooltip>
                          </Col>
                          </>}
                          {/* <Col flex="none" style={{ margin: "5px 0 0 5px" }}>
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => {
                                console.log("??????")
                                console.log(field)
                                console.log("??????")
                                remove(field.name);

                              }}
                            />
                          </Col> */}
                        </Row>
                      )
                    }
                    )}
                  </>
                )
              }}
            </Form.List>
            {/* <Form.List name={"casecfg"} rules={[{ required: true }]} >
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map((field, index) => {
                      return (
                        <Row key={field.fieldKey} type="flex" justify="start" gutter={30} style={{ margin: "5px 0 0 -40px" }}  >
                          <Col span={5} offset={2} >
                            <Form.Item
                              label="????????????"
                              name={[field.name, "device_type"]}
                              fieldKey={[field.fieldKey, "device_type"]}
                              rules={[{ required: true, message: "????????????" }]}

                            >
                              <Select placeholder={"????????????"}>
                                <Select.Option key={"1"} value="M6621-10-EBIn-Z23">M6621-10-EBIn-Z23</Select.Option>
                                <Select.Option key={"2"} value="M1221-Q">M1221-Q</Select.Option>
                                <Select.Option key={"3"} value="M6721-E-Z31M">M6721-E-Z31M</Select.Option>
                                <Select.Option key={"4"} value="X6721-Z37">X6721-Z37</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="?????????????????????"
                              name={[field.name, "upgrade_packet"]}
                              fieldKey={[field.fieldKey, "upgrade_packet"]}
                              rules={[{ required: true, message: "???????????????" }]}

                            >
                              <Input placeholder="????????????????????????" />
                            </Form.Item>
                          </Col>
                          <Col flex="none" style={{ margin: "5px 0 0 5px" }}>
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => {
                                remove(field.name);
                              }}
                            />
                          </Col>
                        </Row>
                      )
                    }
                    )}
                    <Form.Item style={{ marginBottom: "20px" }} {...formItemLayout2}  >
                      <Button
                        type="dashed"
                        onClick={() => {
                          add();
                        }}
                        style={{ width: "80%" }}
                      >
                        <PlusOutlined /> ??????????????????????????????
                              </Button>
                    </Form.Item>
                  </>
                )
              }}
            </Form.List> */}

            {/* {fromData.TaskType == 2 ? <>
              <Row type="flex" justify="start" gutter={24}>
                <Col offset={4}><Form.Item label="????????????" name={"device_type"} ><Input ></Input></Form.Item></Col>
                <Col ><Form.Item label="????????????" name={"device_type22"} ><Input></Input></Form.Item></Col>
              </Row>
            </>
              : <Form.Item label="????????????" {...formItemLayout} name={"device_type"} >
                <Input></Input>
              </Form.Item>
            }
            {fromData.upgradeMode === 2 && <Form.Item
              label="????????????" name='XXX'
              {...formItemLayout}
            >
              <Input placeholder="????????????????????????" />
            </Form.Item>}

            <Form.Item
              label="???????????????"
              {...formItemLayout}
              name={"upgrade_packet"}
            >
              <Input placeholder="????????????????????????" />
            </Form.Item> */}
            {fromData.TaskType !== 3 &&
              <>
                <Form.Item
                  label="??????????????????"
                  {...formItemLayout}
                  rules={[{ required: true, message: "?????????????????????????????????????????????????????????" }]}
                  name={"VAR_BAIPAI_CODED_BRANCH"}
                >
                  <Input placeholder="???????????????????????????:release/br_SDC8.0.2_RC201_TR6,?????????master" />
                </Form.Item>

                <Form.Item
                  label="????????????"
                  {...formItemLayout}
                >

                  <Radio.Group onChange={onChange} value={fromData.upgradeMode} name="upgradeModeClick" key="upgradeModeClick">
                    <Radio value={1}>?????????????????????</Radio>
                    <Radio value={2}>??????????????????+????????????</Radio>
                  </Radio.Group>
                </Form.Item>
              </>
            }
            <Form.Item
              label="????????????????????????"
              {...formItemLayout}
            >
              <Radio.Group onChange={onChange} value={fromData.resConfig} name="resConfigClick">
                <Radio value={1}>??????</Radio>
                <Radio value={2}>?????????</Radio>
              </Radio.Group>
            </Form.Item>

            {dataErrorMsg && <span style={{ color: "#ff4d4f", paddingRight: "20px" }}><CloseCircleOutlined
              style={{ color: "#ff4d4f" }} />{dataErrorMsg}</span>}
            <Form.Item {...buttonItemLayout} >
              <Row justify="space-between">
              {fromData.upgradeMethod===1&&<>
                <Col span={1}>
                  <Button onClick={() => handleSubmit("save")} type="primary" name="save">??????</Button></Col>
                  </>}
                <Col span={22}>
                  <Button onClick={() => handleSubmit("savaAndExecute")} type="primary" name="savaAndExecute">???????????????</Button></Col>
              </Row>
            </Form.Item>
          </Form>
        </Card>
        </Spin>
      </Col>

    </Row>

  )
};


export default TaskList2
