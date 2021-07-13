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
    spinloading:false,  // 是否加载中
    //测试
    mainIp: [],//设备IP
    envId: [], //环境ID
    deviceType: [],//设备款型
    upgradePacket: [],//版本包路径
    controlpath:[],// 控件安装包目录路径
    resConfig: 1, // 恢复配置 1-恢复 2-不恢复
    upgradeMode: 1,// 升级模式  1：只升到白牌版本 2:升到白牌版本+初始版本
    targetModel: 1,// 设备/目标款型
    TaskType: 3,//任务类型 1-白牌定制 2-款型定制， 3-OQC
    upgradeMethod: 1,//升级方式 1-不升级 2-软件包升级  3-软件包+算法包升级
    controlInstallMode: 2, //控件安装方式  1-不安装 2-共享目录路径 3-控件上传


  });
  //树选择器
  const SHOW_PARENT = TreeSelect.SHOW_PARENT;
  const treeData = [{
    title: '白牌',
    value: 'whiteBox',
    key: 'whiteBox',
    // children: [{
    //   title: '测试，不可用',
    //   value: '0-0-0',
    //   key: '0-0-0',
    // }],
  }, {
    title: 'OQC',
    value: 'OQC',
    key: 'OQC',
    //   children: [{
    //     title: '[0]验证时间设置正确',
    //     value: 'test_toMF_OQC_017',
    //     key: 'test_toMF_OQC_017',
    //   }, {
    //     title: '[0]验证IR-CUT切换功能正常',
    //     value: 'test_toMF_OQC_006',
    //     key: 'test_toMF_OQC_006',
    //   }, {
    //     title: '[0]验证雨刷功能正常',
    //     value: 'test_toMF_OQC_004',
    //     key: 'test_toMF_OQC_004',
    //   },
    //   {
    //     title: '[0]验证最大放大倍率符合规格',
    //     value: 'test_toMF_OQC_018',
    //     key: 'test_toMF_OQC_018',
    //   },

    // ],
  },{
    title: 'AE场景',
    value: 'AE',
    key: 'AE',
  },{
    title: 'MVB场景',
    value: 'MVB',
    key: 'MVB',
  },{
    title: '商超场景',
    value: 'market',
    key: 'market',
  },{
    title: '图卡切换场景',
    value: 'pic',
    key: 'pic',
  },{
    title: '宽动态场景',
    value: 'dynamics',
    key: 'dynamics',
  },{
    title: '移动隔断一场景',
    value: 'Scenario1',
    key: 'Scenario1',
  },{
    title: '移动隔断二场景',
    value: 'Scenario2',
    key: 'Scenario2',
  },{
    title: '绿植AWB场景',
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
          description: "任务提交成功",
          message: '提交成功',
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
          description: "任务提交成功",
          message: '提交成功',
        });
        history.push(`${config.baseUri}/task`)
      }
    }
  });
  // 提交任务
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
        setDataErrorMsg("请配置款型版本包套餐环境")
      } else {
        setDataErrorMsg("")
        fromData.upgradePacket = []
        fromData.deviceType = []
        fromData.mainIp = []
        fromData.envId = []
        fromData.controlpath=[]
        env.map(function (item) {
          console.log('任务提交111111')
          console.log(item)
          console.log('任务提交1111111')
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
      <Spin tip="请求进行中" spinning={fromData.spinloading} size="large">
        {/* <Card title="白牌任务" bordered={false} style={{ width: "50%", marginLeft: "25%" }}> */}
        <Card title="新建任务"
          bordered={false}
          extra={
            <Button
              ghost
              onClick={() => {
                props.history.push(`${config.baseUri}/task`);
              }}
              // style={{marginRight: '10px'}}
              type={'primary'}
            >任务查询</Button>
          }>
          <Form
            form={form}
            initialValues={fromData}
          >

            <Form.Item label="任务模式" {...formItemLayout}>
              <Select defaultValue={String(fromData.TaskType)} style={{ width: 120 }} onChange={handleChange}>
                <Select.Option value="1" >白牌定制</Select.Option>
                <Select.Option value="2" disabled>款型定制</Select.Option>
                <Select.Option value="3">OQC</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="任务名称"
              name={"taskName"}
              {...formItemLayout}
              rules={[{ required: true, message: "任务名称必输" }]}
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item
              label="执行用例"
              name={"caseNumber"}
              rules={[{ required: true, message: "请选择执行用例" }]}
              {...formItemLayout}
            >
              <TreeSelect {...treeProps} />
            </Form.Item>

            <Form.Item
              label="升级方式"
              {...formItemLayout}
            >
              <Radio.Group onChange={onChange} value={fromData.upgradeMethod} name="upgradeMethodClick">
                <Radio value={1}>不升级</Radio>
                <Radio value={2}>软件包升级</Radio>
                <Radio value={3}>软件包+算法包升级</Radio>
              </Radio.Group>
            </Form.Item>

            {fromData.upgradeMethod === 1 && <>
            <Form.Item
              label="控件安装方式"
              {...formItemLayout}
            >
              <Radio.Group onChange={onChange} value={fromData.controlInstallMode} name="controlInstallModeClick">
                <Radio value={1} >相机后台方式</Radio>
                <Radio value={2}>共享目录路径方式</Radio>
                <Radio value={3} disabled>控件安装包上传方式</Radio>
              </Radio.Group>
            </Form.Item>
            </>}

            <Form.Item style={{ marginBottom: "20px" }} {...formItemLayout2}  >
              <Button
                type="dashed"
                onClick={() => setShowEnvSelect(true)}
                style={{ width: "80%" }}
              >
                <PlusOutlined /> 添加环境配置
                              </Button>
            </Form.Item>
            {/* {fromData.upgrade == 1 && <FormItem
            label="设备款型"
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
                            <Tooltip title={`款型:${cData.main_type}`}>
                              <Form.Item
                                label={`环境配套:${index}`}
                                name={[field.name, "main_type",]}
                                fieldKey={[field.key, "key"]}
                              >
                                <Input disabled />
                              </Form.Item>
                            </Tooltip>
                          </Col>
                          <Col span={4}>
                            <Tooltip title={`设备IP: ${cData.main_ip}`}>
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
                            <Tooltip title={`【当前版本号为:${cData.version}。升级操作与eiico一致，支持出包路径和本地目录。】。如:\\10.120.189.197\\sdcEiicoService\\sdcInstallPkg\\存放包的文件夹，本地路径可以共享给域账号pivsautotest,格式如前面一样填入，需要包含version文件和buid_device_list.txt文件`}>
                              <Form.Item
                                name={[field.name, "upgrade_packet"]}
                                fieldKey={[field.fieldKey, "upgrade_packet"]}
                                rules={[{ required: true, message: "版本包必填" }]}
                              >
                                <Input placeholder="版本升级包共享目录" />
                              </Form.Item>
                            </Tooltip>
                          </Col>
                          </>}

                          {fromData.upgradeMethod===1  && fromData.controlInstallMode===2 && <>
                          <Col span={12}>
                            <Tooltip title={`SDCPlayerInstall.exe所在控件包目录，支持出包路径和本地目录。  如:\\10.120.189.197\\sdcEiicoService\\sdcInstallPkg\\控件包存放包的文件夹，本地路径可以共享给域账号pivsautotest,格式如前面一样填入`}>
                              <Form.Item
                                name={[field.name, "controlpath"]}
                                fieldKey={[field.fieldKey, "controlpath"]}
                                rules={[{ required: true, message: "控件包共享路径必填" }]}
                              >
                                <Input placeholder="SDCPlayerInstall.exe实况控件包目录" />
                              </Form.Item>
                            </Tooltip>
                          </Col>
                          </>}
                          {/* <Col flex="none" style={{ margin: "5px 0 0 5px" }}>
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => {
                                console.log("啦啦")
                                console.log(field)
                                console.log("啦啦")
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
                              label="设备款型"
                              name={[field.name, "device_type"]}
                              fieldKey={[field.fieldKey, "device_type"]}
                              rules={[{ required: true, message: "款型必填" }]}

                            >
                              <Select placeholder={"设备款型"}>
                                <Select.Option key={"1"} value="M6621-10-EBIn-Z23">M6621-10-EBIn-Z23</Select.Option>
                                <Select.Option key={"2"} value="M1221-Q">M1221-Q</Select.Option>
                                <Select.Option key={"3"} value="M6721-E-Z31M">M6721-E-Z31M</Select.Option>
                                <Select.Option key={"4"} value="X6721-Z37">X6721-Z37</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="版本包共享路径"
                              name={[field.name, "upgrade_packet"]}
                              fieldKey={[field.fieldKey, "upgrade_packet"]}
                              rules={[{ required: true, message: "版本包必填" }]}

                            >
                              <Input placeholder="白牌版本共享目录" />
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
                        <PlusOutlined /> 添加款型、版本包路径
                              </Button>
                    </Form.Item>
                  </>
                )
              }}
            </Form.List> */}

            {/* {fromData.TaskType == 2 ? <>
              <Row type="flex" justify="start" gutter={24}>
                <Col offset={4}><Form.Item label="设备款型" name={"device_type"} ><Input ></Input></Form.Item></Col>
                <Col ><Form.Item label="目标款型" name={"device_type22"} ><Input></Input></Form.Item></Col>
              </Row>
            </>
              : <Form.Item label="设备款型" {...formItemLayout} name={"device_type"} >
                <Input></Input>
              </Form.Item>
            }
            {fromData.upgradeMode === 2 && <Form.Item
              label="初始版本" name='XXX'
              {...formItemLayout}
            >
              <Input placeholder="初始版本共享目录" />
            </Form.Item>}

            <Form.Item
              label="版本包路径"
              {...formItemLayout}
              name={"upgrade_packet"}
            >
              <Input placeholder="白牌版本共享目录" />
            </Form.Item> */}
            {fromData.TaskType !== 3 &&
              <>
                <Form.Item
                  label="校验代码分支"
                  {...formItemLayout}
                  rules={[{ required: true, message: "当前任务模式必须选择需要校验的代码分支" }]}
                  name={"VAR_BAIPAI_CODED_BRANCH"}
                >
                  <Input placeholder="校验代码分支，例如:release/br_SDC8.0.2_RC201_TR6,默认为master" />
                </Form.Item>

                <Form.Item
                  label="升级模式"
                  {...formItemLayout}
                >

                  <Radio.Group onChange={onChange} value={fromData.upgradeMode} name="upgradeModeClick" key="upgradeModeClick">
                    <Radio value={1}>只升到白牌版本</Radio>
                    <Radio value={2}>升到初始版本+白牌版本</Radio>
                  </Radio.Group>
                </Form.Item>
              </>
            }
            <Form.Item
              label="是否恢复默认配置"
              {...formItemLayout}
            >
              <Radio.Group onChange={onChange} value={fromData.resConfig} name="resConfigClick">
                <Radio value={1}>恢复</Radio>
                <Radio value={2}>不恢复</Radio>
              </Radio.Group>
            </Form.Item>

            {dataErrorMsg && <span style={{ color: "#ff4d4f", paddingRight: "20px" }}><CloseCircleOutlined
              style={{ color: "#ff4d4f" }} />{dataErrorMsg}</span>}
            <Form.Item {...buttonItemLayout} >
              <Row justify="space-between">
              {fromData.upgradeMethod===1&&<>
                <Col span={1}>
                  <Button onClick={() => handleSubmit("save")} type="primary" name="save">保存</Button></Col>
                  </>}
                <Col span={22}>
                  <Button onClick={() => handleSubmit("savaAndExecute")} type="primary" name="savaAndExecute">保存并执行</Button></Col>
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
