import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input, Modal,
  notification,
  Popover,
  Row,
  Select, Space,
  Spin,
  Tooltip,
  TreeSelect
} from "antd";
import React, {useState} from "react";
import {useMount, useRequest} from "@umijs/hooks";
import {getJobContainerDetail, saveJob, runCase} from "@/services/job";
import {getVariables, getVersionList} from "@/services/topo";
import {getNextRunTime} from "@/services/status";
import {history, Link} from "umi";
import config from "@/config/app";
import {Loader} from "@/components";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import InfoCircleOutlined from "@ant-design/icons/lib/icons/InfoCircleOutlined";
import EnvSelect from "@/pages/Task/compontents/EnvSelect";
import CheckOutlined from "@ant-design/icons/lib/icons/CheckOutlined";
import ReactCodeMirror from "react-cmirror/src/react-cmirror";
import * as jsyaml from "js-yaml";
import 'codemirror/theme/duotone-light.css';
import FooterToolbar from "@/components/FooterToolbar";
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import moment from "moment";
import StartRunConfirm from "@/pages/Runner/components/StartRunConfirm";

const currentTime = moment();

const RunCaseForm = (props) => {
  const {caseData} = props;
  const [form] = Form.useForm();
  const [fromData, setFromData] = useState({
    case_timeout: 1200, public_timeout: 12, topo: "by_bed", polymorphic: 1,
    version_define: false, self_define: false, cron: false, script_no: "70", version_list: ["all"],
    scope_list: ["all"], scope_black_list: [],
    user_define: {
      user_define_variable: {
        ENABLE: false, ITEM_1: {CLASS_NAME: "ipcGlobalVars", YOUR_DEFINE_VARIABLE: "hello world"}}}
  });
  const [showEnvSelect, setShowEnvSelect] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [yamlConfig, setYamlConfig] = useState({isYaml: true, msg: ""});
  const [nextRunTime, setNextRunTime] = useState();
  const [dataErrorMsg, setDataErrorMsg] = useState("");
  const commonSelfVarRequest = useRequest(getVariables,
    {
      onSuccess: (data, params) => {
        setFromData({...fromData, user_define: data.MsgInfo})
      }
    });
  const nextTimeRequest = useRequest(getNextRunTime, {
    manual: true,
    onSuccess: (data, params) => {
      setNextRunTime(data.MsgInfo.next || data.MsgInfo.msg)
    }
  });

  const setEnvConfig = (data) => {
    form.setFieldsValue({env: data});
  };
  const topoChange = (value) => {
    form.setFieldsValue({env: []});
    setFromData({...fromData, topo: value})
  };
  const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 16}
  };
  const saveRequest = useRequest(saveJob, {
    manual: true,
    onSuccess: () => {
      notification.info({
        description: "??????????????????",
        message: '????????????, ???????????????????????????',
      });
      history.push(`${config.baseUri}/task/execution`)
    }
  });
  const caseRunRequest = useRequest(runCase, {
    manual: true,
    onSuccess: () => {
      notification.info({
        description: "??????????????????",
        message: '????????????, ???????????????????????????',
      });
      history.push(`${config.baseUri}/task/execution`)
    }
  });
  const handleSubmit = () => {
    setDataErrorMsg("");
    if (fromData.self_define && !yamlConfig.isYaml) {
      setDataErrorMsg("?????????????????????????????????")
    } else {
      form.validateFields()
        .then(values => {
          const {env} = values;
          if (!env || (env && env.length === 0)) {
            setDataErrorMsg("????????????????????????")
          } else if (caseData.Summary.auto <= 0){
            setDataErrorMsg("????????????????????????0")
          }  else if (caseData.Summary.auto >= 300){
            setDataErrorMsg(
              <span>????????????????????????> 300???,????????????
                <Link to={`${config.baseUri}/task/edit`} >????????????</Link>
                ?????????
              </span>
            )
          } else {
            setConfirmVisible(true)
          }
        });
    }
  };
  useMount(
    () => {
      commonSelfVarRequest.run()
    }
  );
  const getVersionListRequest = useRequest(getVersionList, {
    defaultParams: [{user: props.user.short_name}]
  });
  const upgradeStyle = {
    display: 'inline-block', width: 'calc(20%)', marginBottom: "6px"
  };
  const cronStyle = {
    display: 'inline-block', width: 'calc(13.7%)', marginBottom: "6px"
  };
  const onFieldsChange = (changedFields, allFields) => {
    setDataErrorMsg()
  };
  const StartRun = ()=>{
    caseRunRequest.run({...form.getFieldsValue(), run_case: caseData.data, user_define: fromData.user_define,});
    setConfirmVisible(false)
  };
  return (
    <>
      {
        saveRequest.loading ?
          <Loader loadTxt={saveRequest.loading ? "?????????????????????" : "?????????????????????"} spinning={true} fullScreen={false}/>
          : <Form
            form={form}
            onValuesChange={onFieldsChange}
            {...formItemLayout}
            initialValues={fromData}
          >
            <Form.Item
              label={
                <span>????????????&nbsp;
                  <Tooltip title="??????TOPO???????????????????????????"><InfoCircleOutlined style={{color: "#ffc069"}}/></Tooltip>
                      </span>
              }>
              <Form.Item
                name={"topo"}
                style={{display: 'inline-block', width: 'calc(70% - 8px)', marginBottom: "6px"}}
                rules={[{required: true, message: "??????????????????"}]}
              >
                <Select placeholder="??????????????????" onChange={topoChange}>
                  <Select.Option value={"by_bed"} key={"by_bed"}>????????????</Select.Option>
                  <Select.Option value={"by_env"} key={"by_env"}>?????????</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                style={{display: 'inline-block', width: 'calc(30% - 8px)', marginLeft: "16px", marginBottom: "6px"}}
              >
                <Button type="dashed" onClick={() => setShowEnvSelect(true)} style={{width: "100%"}}>
                  <PlusOutlined/> ??????????????????
                </Button>
              </Form.Item>
              <EnvSelect
                visible={showEnvSelect}
                topo={fromData.topo}
                okData={[]}
                onClose={setShowEnvSelect}
                setEnvFormData={setEnvConfig}
                user={props.user}/>
              <Form.List name={"env"} rules={[{required: true}]}>
                {(fields, {add, remove}) => {
                  return (
                    <div style={{maxHeight: "300px", overflow: "auto"}}>
                      {fields.map((field, index) => {
                          const cData = form.getFieldValue("env")[index];
                          return (
                            <Row key={field.key}>
                              <Col span={8}>
                                <Tooltip title={`????????????:${cData.testbedName}`}>
                                  <Form.Item
                                    name={[field.name, "testbedName"]}
                                    fieldKey={[field.key, "key"]}
                                    style={{marginBottom: "6px"}}
                                  >
                                    <Input disabled/>
                                  </Form.Item>
                                </Tooltip>
                              </Col>
                              <Col span={16}>
                                {fromData.topo === "by_bed" && <Tooltip title="?????????????????????????????????????????????????????????">
                                  <Form.Item
                                    style={{marginLeft: "6px", marginBottom: "6px"}}
                                    name={[field.name, "combo"]}
                                    fieldKey={[field.fieldKey, "combo"]}
                                  >
                                    <Input placeholder={"???????????????????????????????????????????????????"}/>
                                  </Form.Item>
                                </Tooltip>}
                                {fromData.topo === "by_env" && <Popover
                                  title={
                                    <span
                                      style={{
                                        fontSize: '16px',
                                        marginLeft: '3px',
                                        marginRight: '3px',
                                        color: '#595959'
                                      }}>
                                            ?????????????????????: {cData.data ? cData.data.length : 0}
                                          </span>
                                  }
                                  content={() => {
                                    return (
                                      <div>
                                        {cData.data && cData.data.map(item => <p style={{fontSize: '9px'}}
                                                                                 key={item}>{item}</p>)}
                                      </div>
                                    )
                                  }}
                                >
                                  <Form.Item
                                    style={{marginLeft: "6px", marginBottom: "6px"}}
                                    name={[field.name, "data"]}
                                    fieldKey={[field.fieldKey, "data"]}
                                  >
                                    <Select
                                      maxTagCount={3}
                                      mode="multiple"
                                      options={cData.source || []}
                                      disabled
                                    >
                                    </Select>
                                  </Form.Item>
                                </Popover>}

                              </Col>
                            </Row>
                          )
                        }
                      )}
                    </div>
                  )
                }}
              </Form.List>
            </Form.Item>
            <Form.Item
              label={
                <span>????????????&nbsp;
                  <Tooltip title="??????????????????;???????????????????????????;???all???????????????????????????all?????????????????????" >
                          <InfoCircleOutlined style={{color: "#ffc069"}}/></Tooltip>
                      </span>
              }
              name={"scope_list"}
            >
              <Select
                mode="tags"
                placeholder="??????????????????;???????????????????????????;???all???????????????????????????all?????????????????????"
                maxTagCount={6}
                tokenSeparators={";"}
              />
            </Form.Item>
            <Form.Item label="??????????????????">
              <Form.Item noStyle>
                {fromData.version_define
                  ? <>
                    <Tooltip title={"?????????????????????????????????;???????????????????????????all"}>
                      <Form.Item
                        style={{display: 'inline-block', width: 'calc(40%)', marginBottom: "6px"}}
                        name={"version"}
                      >
                        <Input placeholder={"???????????????????????????"}/>
                      </Form.Item>
                    </Tooltip>
                    <Tooltip title={"???????????????????????????????????????;???????????????????????????all"}>
                      <Form.Item style={{
                        display: 'inline-block',
                        width: 'calc(40% - 8px)',
                        marginBottom: "6px",
                        marginLeft: "8px"
                      }} name={"version_time"}>
                        <Input placeholder={"?????????????????????????????????"}/>
                      </Form.Item>
                    </Tooltip>
                  </>
                  : <Form.Item
                    style={{display: 'inline-block', width: 'calc(80%)', marginBottom: "6px"}}
                    rules={[{required: true, type: 'array', min: 1, message: "??????????????????????????????"}]}
                    name={"version_list"}>
                    <TreeSelect
                      treeData={getVersionListRequest.data ? getVersionListRequest.data.MsgInfo : []}
                      treeCheckable={true}
                      showCheckedStrategy={TreeSelect.SHOW_PARENT}
                      placeholder={'????????????????????????????????????'}
                      style={{width: '100%'}}
                      maxTagCount={4}
                      mode="tags"
                      // onChange={onSelect}
                      allowClear
                      // treeDefaultExpandAll
                      treeDefaultExpandedKeys={["all"]}
                    />
                  </Form.Item>
                }

                <Form.Item style={{...upgradeStyle, width: 'calc(20% -16px)', marginLeft: "16px"}}
                           name={"version_define"} valuePropName={"checked"}>
                  <Checkbox
                    onChange={e => setFromData({...fromData, version_define: e.target.checked})}>
                    ?????????
                  </Checkbox>
                </Form.Item>
              </Form.Item>
            </Form.Item>
            {
              fromData.cron && <Form.Item
                label={
                  <span>????????????&nbsp;
                    <Tooltip title="????????????????????????"><InfoCircleOutlined style={{color: "#ffc069"}}/></Tooltip>
                  </span>
                }
                style={{marginBottom: "12px"}}>
                <Form.Item noStyle>
                  <Tooltip title={"???"}>
                    <Form.Item style={cronStyle} name={"second"}
                               rules={[{required: fromData.cron, message: "???????????????"}]}>
                      <Input placeholder={"second"}/>
                    </Form.Item>
                  </Tooltip>
                  <Tooltip title={"??????"}>
                    <Form.Item style={cronStyle} name={"minute"}
                               rules={[{required: fromData.cron, message: "???????????????"}]}>
                      <Input placeholder={"minute"}/>
                    </Form.Item>
                  </Tooltip>
                  <Tooltip title={"??????"}>
                    <Form.Item style={cronStyle} name={"hour"}
                               rules={[{required: fromData.cron, message: "???????????????"}]}>
                      <Input placeholder={"hour"}/>
                    </Form.Item>
                  </Tooltip>
                  <Tooltip title={"???"}>
                    <Form.Item style={cronStyle} name={"day"} rules={[{required: fromData.cron, message: "???????????????"}]}>
                      <Input placeholder={"day"}/>
                    </Form.Item>
                  </Tooltip>
                  <Tooltip title={"???"}>
                    <Form.Item style={cronStyle} name={"month"}
                               rules={[{required: fromData.cron, message: "???????????????"}]}>
                      <Input placeholder={"month"}/>
                    </Form.Item>
                  </Tooltip>
                  <Tooltip title={"??????"}>
                    <Form.Item style={cronStyle} name={"day_of_week"}
                               rules={[{required: fromData.cron, message: "???????????????"}]}>
                      <Input placeholder={"day_of_week"}/>
                    </Form.Item>
                  </Tooltip>
                  <Tooltip title={"???"}>
                    <Form.Item style={cronStyle} name={"year"}
                               rules={[{required: fromData.cron, message: "???????????????"}]}>
                      <Input placeholder={"year"}/>
                    </Form.Item>
                  </Tooltip>
                  <Form.Item style={{
                    display: 'inline-block',
                    width: 'calc(4%-2px)',
                    marginBottom: "6px",
                    marginLeft: "2px",
                    float: "right"
                  }}>
                    <Tooltip title={"?????????????????????????????????"}>
                      <Button onClick={() => {
                        const {second, minute, hour, day, month, day_of_week, year} = form.getFieldsValue();
                        const validate = [second, minute, hour, day, month, day_of_week, year].every(item => item);
                        if (validate) {
                          nextTimeRequest.run({cron: [second, minute, hour, day, month, day_of_week, year].join(" ")})
                        } else {
                          setNextRunTime("????????????????????????")
                        }
                      }} icon={<CheckOutlined/>} shape={'circle'} size={"small"}/>
                    </Tooltip>
                  </Form.Item>
                </Form.Item>
                <Form.Item noStyle>
                  <Form.Item style={{display: 'inline-block', width: 'calc(40%)', marginBottom: "6px"}}>
                    {nextTimeRequest.loading
                      ? <Spin size="small"> ???????????????</Spin>
                      : nextRunTime && <span style={{color: "#ffa940"}}> <InfoCircleOutlined
                      style={{color: "#ffa940"}}/>{nextRunTime}</span>
                    }
                  </Form.Item>
                  <Form.Item
                    style={{display: 'inline-block', width: 'calc(60%)', marginBottom: "6px", float: "right"}}>
                    <Space style={{float: "right"}}>
                      <Button size={"small"} type={"link"} onClick={() => {
                        form.setFieldsValue({
                          second: "0", minute: "0", hour: "20",
                          day: currentTime.date(),
                          month: currentTime.month()+1,
                          day_of_week: "*",
                          year: moment().year(),
                        })
                      }}>??????20???</Button>
                    </Space>
                  </Form.Item>
                </Form.Item>
              </Form.Item>
            }
            <Form.Item name={"polymorphic"} label="????????????" rules={[{required: true, message: "??????????????????"}]}>
              <Select placeholder="??????????????????">
                <Select.Option value={0} title={"?????????"}>?????????</Select.Option>
                <Select.Option value={1} title={"?????????????????????"}>?????????????????????</Select.Option>
                <Select.Option value={2} title={"?????????????????????????????????????????????"}>?????????????????????????????????????????????</Select.Option>
                <Select.Option value={3} title={"?????????????????????????????????????????????"}>?????????????????????????????????????????????</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="????????????" style={{marginBottom: 0}}>
              <Tooltip title="??????????????????">
                <Form.Item
                  name={"public_timeout"}
                  style={{display: 'inline-block', width: 'calc(50% - 8px)'}}
                  rules={[{
                    required: true, type: "number", message: "???????????????????????????", transform: (value) => {
                      return Number(value)
                    }
                  }]}
                >
                  <Input placeholder={"??????????????????(h)"} suffix="??????" type={"number"}/>
                </Form.Item>
              </Tooltip>
              <Tooltip title="?????????????????????">
                <Form.Item
                  name={"case_timeout"}
                  style={{display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: "16px"}}
                  rules={[{
                    required: true, type: "number", message: "???????????????????????????", transform: (value) => {
                      return Number(value)
                    }
                  }]}
                >
                  <Input placeholder={"?????????????????????(s)"} suffix="???" type={"number"}/>
                </Form.Item>
              </Tooltip>
            </Form.Item>
            <Form.Item name="script_no"
                       label="???????????????"
                       rules={[
                         { required: true, message: "?????????????????????" },
                         { max: 10, message: "??????????????????????????????10" }
                         ]}>
              <Select placeholder="????????????????????????">
                <Select.Option value={"00"}>C00</Select.Option>
                <Select.Option value={"10"}>C10</Select.Option>
                <Select.Option value={"15"}>C20</Select.Option>
                <Select.Option value={"20"}>C30</Select.Option>
                <Select.Option value={"25"}>C50</Select.Option>
                <Select.Option value={"30"}>C60</Select.Option>
                <Select.Option value={"40"}>SDC 8.0.0</Select.Option>
                <Select.Option value={"50"}>SDC 8.0.1</Select.Option>
                <Select.Option value={"60"}>SDC 8.0.2</Select.Option>
                <Select.Option value={"70"}>SDC 8.1.0</Select.Option>
                <Select.Option value={"80"}>SDC 8.2.0</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={
                <span>????????????(?????????)&nbsp;
                  <Tooltip title="??????????????????(?????????);???????????????????????????" ><InfoCircleOutlined style={{color: "#ffc069"}}/></Tooltip>
                      </span>
              }
              name={"scope_black_list"}
            >
              <Select
                mode="tags"
                placeholder="??????????????????(?????????);???????????????????????????"
                maxTagCount={6}
                tokenSeparators={";"}
              />
            </Form.Item>
            {
              fromData.self_define && <Form.Item label="???????????????">
                <Form.Item noStyle>
                  {
                    !yamlConfig.isYaml && <Alert
                      message="Yaml ????????????"
                      description={yamlConfig.msg}
                      type="error"
                      showIcon
                    />
                  }
                  <ReactCodeMirror
                    value={jsyaml.safeDump(fromData.user_define.user_define_variable)}
                    options={{
                      mode: 'yaml', theme: 'duotone-light', lineNumbers: true,
                      indentUnit: 1, styleActiveLine: true, matchBrackets: true,
                      lineWrapping: true, tabSize: 2,
                    }}
                    onBeforeChange={(editor, data, value) => {
                    }}
                    onBlur={(editor, data, value) => {
                      let isYaml = false;
                      let errorMessage = '';
                      const strValue = editor.getValue();
                      try {
                        isYaml = !!jsyaml.load(strValue);
                      } catch (e) {
                        errorMessage = e && e.message;
                      }
                      setYamlConfig({isYaml: isYaml, msg: errorMessage});
                      if (isYaml) {
                        setFromData({
                          ...fromData,
                          user_define: {
                            ...fromData.user_define,
                            user_define_variable: jsyaml.load(strValue)
                          }
                        });
                      }
                    }}
                  />
                </Form.Item>
              </Form.Item>
            }
            <FooterToolbar>
              <Form.Item noStyle name={"cron"} valuePropName={"checked"}>
                <Checkbox onChange={(e) => {
                  setFromData({...fromData, cron: e.target.checked})
                }}>????????????</Checkbox>
              </Form.Item>
              <Form.Item noStyle name={"self_define"} valuePropName={"checked"}>
                <Checkbox onChange={(e) => {
                  setFromData({...fromData, self_define: e.target.checked})
                }}>??????????????????</Checkbox>
              </Form.Item>
              <Form.Item noStyle name={"tras"} valuePropName={"checked"}>
                <Checkbox>????????????????????????????????????TRAS???</Checkbox>
              </Form.Item>
              {dataErrorMsg && <span style={{color: "#ff4d4f", paddingRight: "20px"}}><CloseCircleOutlined
                style={{color: "#ff4d4f"}}/>{dataErrorMsg}</span>}
              <Button
                onClick={handleSubmit}
                type="primary">??????</Button>
            </FooterToolbar>
          </Form>
      }
      <Modal
        title="????????????"
        width={700}
        visible={confirmVisible}
        onOk={()=>StartRun()}
        onCancel={()=>setConfirmVisible(false)}
        cancelText={"??????"}
        okText={"????????????"}
        destroyOnClose
      >
        <StartRunConfirm
          currentCaseData={caseData}
          fromData={form.getFieldsValue()}
          user={props.user}
        />
      </Modal>
    </>
  )
};

export default RunCaseForm

