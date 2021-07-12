import React, {useState} from 'react';
import {
  Button,
  Form,
  Col,
  Row,
  Input,
  Card,
  Select,
  notification,
  Tooltip,
  Popover,
  Checkbox,
  TreeSelect,
  Alert,
  Spin,
  Space, Tree
} from "antd";
import FooterToolbar from '../../components/FooterToolbar'
import {useMount, useRequest} from "@umijs/hooks";
import {getCaseSetConfig, getCaseCollection} from "@/services/caseSetConfig";
import {getSoftWarePkg, getVariables, getVersionList} from "@/services/topo";
import {getNextRunTime} from "@/services/status"
import {saveJob, getJobContainerDetail} from "@/services/job";
import {history} from "umi";
import config from "@/config/app";
import {Loader} from "@/components";
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import MinusCircleOutlined from "@ant-design/icons/lib/icons/MinusCircleOutlined";
import EnvSelect from "@/pages/Task/compontents/EnvSelect";
import InfoCircleOutlined from "@ant-design/icons/lib/icons/InfoCircleOutlined";
import * as jsyaml from "js-yaml";
import ReactCodeMirror from "react-cmirror/src/react-cmirror";
import 'codemirror/theme/duotone-light.css';
import CheckOutlined from "@ant-design/icons/lib/icons/CheckOutlined";

const EditTask = (props) => {
  const {id} = props.match.params;
  const [form] = Form.useForm();
  const [fromData, setFromData] = useState({
    case_timeout: 1200, public_timeout: 12, polymorphic: 1,
    topo: "by_bed", env: [],
    scope_version_file: false, scope_list: ["all"], scope_black_list: [],
    version_define: false, version_list: ["all"],
    upgrade: false, packet_mode: false, install_packet: false,
    upgrade_reset: true, uninstall_app: true, by_ssh: false, to_backup: true, app_pkg_type: "tar",
    cron: false,
    self_define: false, user_define: {user_define_variable: {}}, script_no: "70",
    limit_agents: 10, tags: [],
    include_users: "",
  });
  const [showEnvSelect, setShowEnvSelect] = useState(false);
  const [yamlConfig, setYamlConfig] = useState({isYaml: true, msg: ""});
  const [caseCollection, setCaseCollection] = useState([]);
  const [nextRunTime, setNextRunTime] = useState();
  const [softWare, setSoftWare] = useState();
  const detailRequest = useRequest(getJobContainerDetail, {
    manual: true,
    onSuccess: (data, params) => {
      setFromData(data.MsgInfo);
      form.setFieldsValue(data.MsgInfo);
    }
  });
  const [dataErrorMsg, setDataErrorMsg] = useState("");
  const caseSetRequest = useRequest(getCaseCollection, {
    onSuccess: (data, params) => {
      setCaseCollection(data.MsgInfo)
    }
  });
  const commonSelfVarRequest = useRequest(getVariables,
    {
      manual: true,
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
  const softwarePkgRequest = useRequest(getSoftWarePkg, {
    onSuccess: (data, params) => {
      setSoftWare(data.MsgInfo || [])
    }
  });
  const setEnvConfig = (data) => {
    form.setFieldsValue({env: data});
  };
  const topoChange = (value) => {
    form.setFieldsValue({env: []});
    setFromData({...fromData, topo: value})
    // setTopo(value)
  };
  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16}
  };
  const saveRequest = useRequest(saveJob, {
    manual: true,
    onSuccess: () => {
      notification.info({
        description: "任务提交成功",
        message: '提交成功',
      });
      history.push(`${config.baseUri}/task`)
    }
  });
  const handleSubmit = () => {
    if (fromData.self_define && !yamlConfig.isYaml) {
      setDataErrorMsg("请检查自定义参数配置！")
    } else {
      form.validateFields()
        .then(values => {
          const {env, case_cfg} = values;
          if (!env || (env && env.length === 0)) {
            setDataErrorMsg("请配置测试环境！")
          } else if (!case_cfg || (case_cfg && case_cfg.length === 0)) {
            setDataErrorMsg("请配置用例集！")
          } else {
            saveRequest.run({
              ...form.getFieldsValue(),
              user_define: fromData.user_define,
              category: "search",
              job_id: id
            });
            // console.log(form.getFieldsValue());
            // saveRequest.run({name, logic, fixture, scope, ...{key: id}});
          }
        });
    }
  };
  useMount(
    () => {
      if (id) {
        detailRequest.run({key: id})
      } else {
        commonSelfVarRequest.run()
      }
    }
  );
  const getVersionListRequest = useRequest(getVersionList, {
    defaultParams: [{user: props.user.short_name}]
  });
  const upgradeStyle = {
    display: 'inline-block', width: 'calc(16.6%)', marginBottom: "6px"
  };
  const cronStyle = {
    display: 'inline-block', width: 'calc(13.7%)', marginBottom: "6px"
  };
  const upgradeItemLayout = {
    labelCol: {span: 3},
    wrapperCol: {span: 21},
    style: {marginBottom: "6px"}
  };
  const onFieldsChange = (changedFields, allFields) => {
    setDataErrorMsg()
  };
  const renderTreeNode = (data) => {
    return data.map(node_data => {
      return <Tree.TreeNode
        key={node_data.key}
        title={node_data.label}
        value={node_data.value}
        checkable={node_data.selectable}
        selectable={node_data.selectable}
        disableCheckbox={!node_data.isLeaf}
        isLeaf={node_data.isLeaf}
        // dataRef={node_data}
      >
        {node_data.children && renderTreeNode(node_data.children)}
      </Tree.TreeNode>
    })
  };
  const agentLimits = props.user.developer ? 300 : 20;
  return (
    <>
      {
        detailRequest.loading ||
        caseSetRequest.loading ||
        commonSelfVarRequest.loading ||
        softwarePkgRequest.loading ||
        getVersionListRequest.loading ||
        saveRequest.loading ?
          <Loader loadTxt={saveRequest.loading ? "任务数据提交中" : "任务数据加载中"} spinning={true} fullScreen={false}/>
          : <Card
            extra={
              <Button
                ghost
                onClick={() => history.push(`${config.baseUri}/task`)}
                type="primary"
              >返回列表</Button>
            }
            hoverable={false}
            title={id ? "修改任务" : '新增任务'}
          >
            <Row gutter={24}>
              <Col md={18}
                   sm={24}
              >
                <Form
                  form={form}
                  onValuesChange={onFieldsChange}
                  {...formItemLayout}
                  initialValues={fromData}
                >
                  <Form.Item name="name" label="任务名称" rules={[
                    {required: true, max: 60, message: "名称必填或者超过60个字符"}
                  ]}>
                    <Input placeholder="任务名称"/>
                  </Form.Item>
                  <Form.Item label="待执行用例集">
                    <Form.List name={"case_cfg"} rules={[{required: true}]}>
                      {(fields, {add, remove}) => {
                        return (
                          <>
                            {fields.map((field, index) => {
                                return (
                                  <Row key={field.fieldKey}>
                                    <Col span={18}>
                                      <Form.Item
                                        name={[field.name, "case_set"]}
                                        style={{marginBottom: "6px"}}
                                        fieldKey={[field.fieldKey, "case_set"]}
                                        rules={[{required: true, message: "用例集不允许为空"}]}
                                      >
                                        <Select placeholder={"请选择待执行的用例集"}
                                                allowClear
                                          // options={!caseSetRequest.loading && caseSetRequest.data && caseSetRequest.data.MsgInfo || []}
                                        >
                                          {caseCollection && caseCollection.map(item => {
                                            return <Select.OptGroup label={item.label} key={item.key} value={item.value}>
                                              {item.children && item.children.length > 0 && item.children.map(child => {
                                                return <Select.Option key={child.key}
                                                                      value={child.value}>{child.label}</Select.Option>
                                              })}
                                            </Select.OptGroup>
                                          })}
                                          {/*<Select.Option key={"("} value="(">(</Select.Option>*/}
                                          {/*<Select.Option key={"(("} value="((">((</Select.Option>*/}
                                          {/*<Select.Option key={"((("} value="(((">(((</Select.Option>*/}
                                        </Select>
                                      </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                      <Form.Item
                                        name={[field.name, "case_order"]}
                                        fieldKey={[field.fieldKey, "case_order"]}
                                        rules={[{required: true, message: "请执行执行顺序"}]}
                                        style={{marginBottom: "6px"}}
                                      >
                                        <Select placeholder={"执行顺序"}>
                                          <Select.Option key={"1"} value="1">1</Select.Option>
                                          <Select.Option key={"2"} value="2">2</Select.Option>
                                          <Select.Option key={"3"} value="3">3</Select.Option>
                                          <Select.Option key={"4"} value="4">4</Select.Option>
                                          <Select.Option key={"5"} value="5">5</Select.Option>
                                        </Select>
                                      </Form.Item>
                                    </Col>
                                    <Col span={2} flex="none" style={{margin: "5px 0 0 5px"}}>
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
                            <Form.Item style={{marginBottom: "6px"}}>
                              <Button
                                type="dashed"
                                onClick={() => {
                                  add();
                                }}
                                style={{width: "100%"}}
                              >
                                <PlusOutlined/> 添加用例集
                              </Button>
                            </Form.Item>
                          </>
                        )
                      }}
                    </Form.List>
                  </Form.Item>
                  <Form.Item
                    label={
                      <span>环境配置&nbsp;
                        <Tooltip title="切换TOPO会清空已配置的环境"><InfoCircleOutlined style={{color: "#ffc069"}}/></Tooltip>
                      </span>
                    }>
                    <Form.Item
                      name={"topo"}
                      style={{display: 'inline-block', width: 'calc(70% - 8px)', marginBottom: "6px"}}
                      rules={[{required: true, message: "环境类型必填"}]}
                    >
                      <Select placeholder="选择环境类型" onChange={topoChange}>
                        <Select.Option value={"by_bed"} key={"by_bed"}>按测试床</Select.Option>
                        <Select.Option value={"by_env"} key={"by_env"}>按环境</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      style={{display: 'inline-block', width: 'calc(30% - 8px)', marginLeft: "16px", marginBottom: "6px"}}
                    >
                      <Button type="dashed" onClick={() => setShowEnvSelect(true)} style={{width: "100%"}}>
                        <PlusOutlined/> 添加环境配置
                      </Button>
                    </Form.Item>
                    <EnvSelect
                      visible={showEnvSelect}
                      topo={fromData.topo}
                      onClose={setShowEnvSelect}
                      setEnvFormData={setEnvConfig}
                      okData={fromData.env}
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
                                      <Tooltip title={`测试床名:${cData.testbedName}`}>
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
                                      {fromData.topo === "by_bed" && <Tooltip title="请输入环境构建套餐，为空表示不进行构建">
                                        <Form.Item
                                          style={{marginLeft: "6px", marginBottom: "6px"}}
                                          name={[field.name, "combo"]}
                                          fieldKey={[field.fieldKey, "combo"]}
                                        >
                                          <Input placeholder={"请输入环境构建套餐，为空表示不构建"}/>
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
                                            选择的环境套数: {cData.data ? cData.data.length : 0}
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
                  {
                    fromData.upgrade && <Form.Item label="升级配置">
                      <Form.Item style={upgradeStyle} name={"packet_mode"} valuePropName={"checked"}>
                        <Checkbox onChange={(e) => {
                          form.setFieldsValue({upgrade_packet: undefined});
                          setFromData({...fromData, packet_mode: e.target.checked})
                        }}>自定义包地址</Checkbox>
                      </Form.Item>
                      <Form.Item style={upgradeStyle} name={"install_packet"} valuePropName={"checked"}>
                        <Checkbox>安装包装款型</Checkbox>
                      </Form.Item>
                      <Form.Item style={upgradeStyle} name={"upgrade_reset"} valuePropName={"checked"}>
                        <Checkbox>升级后恢复默认</Checkbox>
                      </Form.Item>
                      <Form.Item style={upgradeStyle} name={"uninstall_app"} valuePropName={"checked"}>
                        <Checkbox>卸载原有app和算法</Checkbox>
                      </Form.Item>
                      <Form.Item style={upgradeStyle} name={"by_ssh"} valuePropName={"checked"}>
                        <Checkbox>补充SSH升级</Checkbox>
                      </Form.Item>
                      <Form.Item style={upgradeStyle}>
                        <Form.Item noStyle name={"to_backup"} valuePropName={"checked"}>
                          <Checkbox>备份升级包</Checkbox>
                        </Form.Item>
                        <Tooltip title="涉及到升级用例需要勾选此项"><InfoCircleOutlined style={{color: "#ffc069"}}/></Tooltip>
                      </Form.Item>

                      <Form.Item
                        {...upgradeItemLayout}
                        label={"升级包"}
                        // name={"upgrade_packet"}
                        // rules={[{required: true, message: "升级包不允许为空"}]}
                      >
                        {fromData.packet_mode

                          ? <Tooltip title={"请输入包所在路径，如：\\3.201.0.1\dir, 多个以;分隔"}>
                            <Form.Item
                              noStyle
                              name={"upgrade_packet"}
                              rules={[{required: true, message: "升级包不允许为空"}]}
                            >
                              <Input placeholder="请输入包所在路径，如：\\3.201.0.1\dir, 多个以;分隔"/>
                            </Form.Item>
                          </Tooltip>
                          : <Form.Item noStyle name={"upgrade_packet"}
                                       rules={[{required: true, message: "升级包不允许为空"}]}
                          >
                            <TreeSelect
                              treeCheckable={true}
                              showCheckedStrategy={TreeSelect.SHOW_ALL}
                              placeholder={'选择升级包，支持多个'}
                              style={{width: '100%'}}
                              maxTagCount={4}
                              loading={softwarePkgRequest.loading}
                              mode="tags"
                              // onChange={onSelect}
                              allowClear
                              // treeDefaultExpandAll
                              treeDefaultExpandedKeys={["all"]}
                            >
                              {
                                softwarePkgRequest.data && renderTreeNode(softwarePkgRequest.data.MsgInfo)
                              }
                            </TreeSelect>
                          </Form.Item>
                        }
                      </Form.Item>
                      <Form.Item
                        {...upgradeItemLayout}
                        name={"app_pkg_type"}
                        label={"APP包类型"}
                        rules={[{required: true, message: "包类型必填"}]}
                      >
                        <Input placeholder="请输入APP包类型，如：tar"/>
                      </Form.Item>
                    </Form.Item>
                  }
                  <Form.Item
                    label={
                      <span>测试范围&nbsp;
                        <Tooltip title="输入测试范围;输入多个用分号隔开;有all则所有输入项无效（all不区分大小写）">
                          <InfoCircleOutlined style={{color: "#ffc069"}}/></Tooltip>
                      </span>
                    }
                    // name={"scope_list"}
                  >
                    <Form.Item noStyle>
                      <Form.Item
                        style={{
                          display: 'inline-block',
                          width: fromData.upgrade ? "calc(80%)" : "calc(100%)",
                          marginBottom: "6px"
                        }}
                        name={"scope_list"}
                      >
                        <Select
                          mode="tags"
                          placeholder="输入测试范围;输入多个用分号隔开;有all则所有输入项无效（all不区分大小写）"
                          maxTagCount={6}
                          tokenSeparators={";"}
                          // disabled={!!fromData.scope_version_file}
                        />
                      </Form.Item>
                      {
                        !!fromData.upgrade &&
                        <Form.Item style={{...upgradeStyle, width: 'calc(20%-16px)', marginLeft: "16px"}}
                                   name={"scope_version_file"} valuePropName={"checked"}>
                          <Checkbox
                            onChange={e => setFromData({...fromData, scope_version_file: e.target.checked})}>
                            <Tooltip title={
                              <span>
                                <span>升级: 按配置的范围升级</span><br/>
                                <span>测试: 按升级包的款型文件作为测试范围（包含所有升级包）</span>
                            </span>
                            }>
                              ToGet&nbsp;&nbsp;
                              <InfoCircleOutlined style={{color: "#ffc069"}}/>
                            </Tooltip>
                          </Checkbox>
                        </Form.Item>
                      }

                    </Form.Item>
                  </Form.Item>

                  <Form.Item label="测试版本依赖">
                    <Form.Item noStyle>
                      {fromData.version_define
                        ? <>
                          <Tooltip title={"输入依赖的测试版本，以;分隔，为空或者输入all"}>
                            <Form.Item
                              style={{display: 'inline-block', width: 'calc(40%)', marginBottom: "6px"}}
                              name={"version"}
                            >
                              <Select
                                mode="tags"
                                placeholder="输入依赖的测试版本;输入多个用分号隔开;有all则所有输入项无效（all不区分大小写）"
                                maxTagCount={6}
                                tokenSeparators={";"}
                                notFoundContent={"输入依赖的测试版本时间"}
                              />
                            </Form.Item>
                          </Tooltip>
                          <Tooltip title={"输入依赖的测试版本时间，输入多个以;分隔，为空或者输入all"}>
                            <Form.Item style={{
                              display: 'inline-block',
                              width: 'calc(40% - 8px)',
                              marginBottom: "6px",
                              marginLeft: "8px"
                            }} name={"version_time"}>
                              <Select
                                mode="tags"
                                placeholder="输入依赖的测试版本时间;输入多个用分号隔开;有all则所有输入项无效（all不区分大小写）"
                                maxTagCount={6}
                                tokenSeparators={";"}
                                notFoundContent={"输入依赖的测试版本时间"}
                              />
                            </Form.Item>
                          </Tooltip>
                        </>
                        : <Form.Item
                          style={{display: 'inline-block', width: 'calc(80%)', marginBottom: "6px"}}
                          rules={[{required: true, type: 'array', min: 1, message: "依赖的版本不允许为空"}]}
                          name={"version_list"}>
                          <TreeSelect
                            treeData={getVersionListRequest.data ? getVersionListRequest.data.MsgInfo : []}
                            treeCheckable={true}
                            showCheckedStrategy={TreeSelect.SHOW_PARENT}
                            placeholder={'选择依赖的版本，支持多个'}
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
                          自定义
                        </Checkbox>
                      </Form.Item>
                    </Form.Item>
                  </Form.Item>
                  {
                    fromData.cron && <Form.Item label="定时配置" style={{marginBottom: "12px"}}>
                      <Form.Item noStyle>
                        <Tooltip title={"秒"}>
                          <Form.Item style={cronStyle} name={"second"}
                                     rules={[{required: fromData.cron, message: "不允许为空"}]}>
                            <Input placeholder={"second"}/>
                          </Form.Item>
                        </Tooltip>
                        <Tooltip title={"分钟"}>
                          <Form.Item style={cronStyle} name={"minute"}
                                     rules={[{required: fromData.cron, message: "不允许为空"}]}>
                            <Input placeholder={"minute"}/>
                          </Form.Item>
                        </Tooltip>
                        <Tooltip title={"小时"}>
                          <Form.Item style={cronStyle} name={"hour"}
                                     rules={[{required: fromData.cron, message: "不允许为空"}]}>
                            <Input placeholder={"hour"}/>
                          </Form.Item>
                        </Tooltip>
                        <Tooltip title={"日"}>
                          <Form.Item style={cronStyle} name={"day"} rules={[{required: fromData.cron, message: "不允许为空"}]}>
                            <Input placeholder={"day"}/>
                          </Form.Item>
                        </Tooltip>
                        <Tooltip title={"月"}>
                          <Form.Item style={cronStyle} name={"month"}
                                     rules={[{required: fromData.cron, message: "不允许为空"}]}>
                            <Input placeholder={"month"}/>
                          </Form.Item>
                        </Tooltip>
                        <Tooltip title={"星期"}>
                          <Form.Item style={cronStyle} name={"day_of_week"}
                                     rules={[{required: fromData.cron, message: "不允许为空"}]}>
                            <Input placeholder={"day_of_week"}/>
                          </Form.Item>
                        </Tooltip>
                        <Tooltip title={"年"}>
                          <Form.Item style={cronStyle} name={"year"}
                                     rules={[{required: fromData.cron, message: "不允许为空"}]}>
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
                          <Tooltip title={"点击检查表达式是否正确"}>
                            <Button onClick={() => {
                              const {second, minute, hour, day, month, day_of_week, year} = form.getFieldsValue();
                              const validate = [second, minute, hour, day, month, day_of_week, year].every(item => item);
                              if (validate) {
                                nextTimeRequest.run({cron: [second, minute, hour, day, month, day_of_week, year].join(" ")})
                              } else {
                                setNextRunTime("表达式未填写完整")
                              }
                            }} icon={<CheckOutlined/>} shape={'circle'} size={"small"}/>
                          </Tooltip>
                        </Form.Item>
                      </Form.Item>
                      <Form.Item noStyle>
                        <Form.Item style={{display: 'inline-block', width: 'calc(40%)', marginBottom: "6px"}}>
                          {nextTimeRequest.loading
                            ? <Spin size="small"> 数据计算中</Spin>
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
                                day: "*", month: "*", day_of_week: "*", year: "*",
                              })
                            }}>每天20点</Button>
                            <Button size={"small"} type={"link"} onClick={() => {
                              form.setFieldsValue({
                                second: "0", minute: "0", hour: "22",
                                day: "*", month: "*", day_of_week: "2,4", year: "*",
                              })
                            }}>每周三/五22点</Button>
                          </Space>
                        </Form.Item>
                      </Form.Item>
                    </Form.Item>
                  }
                  <Form.Item name={"polymorphic"} label="多态配置" rules={[{required: true, message: "多态配置必填"}]}>
                    <Select placeholder="选择多态配置">
                      <Select.Option value={0} title={"不配置"}>不配置</Select.Option>
                      <Select.Option value={1} title={"按多态分类执行"}>按多态分类执行</Select.Option>
                      <Select.Option value={2} title={"按所有支持款型任选一款执行一次"}>按所有支持款型任选一款执行一次</Select.Option>
                      <Select.Option value={3} title={"按所有支持款型每个款型执行一次"}>按所有支持款型每个款型执行一次</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="超时配置" style={{marginBottom: 0}}>
                    <Tooltip title="任务超时时间">
                      <Form.Item
                        name={"public_timeout"}
                        style={{display: 'inline-block', width: 'calc(50% - 8px)'}}
                        rules={[{
                          required: true, type: "number", message: "请输入任务超时时间", transform: (value) => {
                            return Number(value)
                          }
                        }]}
                      >
                        <Input placeholder={"任务超时时间(h)"} suffix="小时" type={"number"}/>
                      </Form.Item>
                    </Tooltip>
                    <Tooltip title="单用例超时时间">
                      <Form.Item
                        name={"case_timeout"}
                        style={{display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: "16px"}}
                        rules={[{
                          required: true, type: "number", message: "请输单用例超时时间", transform: (value) => {
                            return Number(value)
                          }
                        }]}
                      >
                        <Input placeholder={"单用例超时时间(s)"} suffix="秒" type={"number"}/>
                      </Form.Item>
                    </Tooltip>
                  </Form.Item>
                  <Form.Item name="script_no"
                             label="脚本版本号"
                             rules={[
                               {required: true, message: "脚本版本号必填"},
                               {max: 10, message: "长度太长，不允许超过10"}
                             ]}>
                    <Select placeholder="请选择脚本版本号">
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
                  {
                    fromData.self_define && <Form.Item label="自定义参数">
                      <Form.Item noStyle>
                        {
                          !yamlConfig.isYaml && <Alert
                            message="Yaml 语法错误"
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
                              // setSelfVariable({...selfVariable, user_define_variable: jsyaml.load(strValue)})
                            }
                            // console.log(jsyaml.load(editor.getValue()));
                          }}
                        />
                      </Form.Item>
                    </Form.Item>
                  }
                  <Form.Item
                    label={
                      <span>测试范围(黑名单)&nbsp;
                        <Tooltip title="输入测试范围(黑名单);输入多个用分号隔开"><InfoCircleOutlined style={{color: "#ffc069"}}/></Tooltip>
                      </span>
                    }
                    name={"scope_black_list"}
                  >
                    <Select
                      mode="tags"
                      placeholder="输入测试范围(黑名单);输入多个用分号隔开"
                      maxTagCount={6}
                      tokenSeparators={";"}
                    />
                  </Form.Item>
                  <Form.Item
                    name="limit_agents"
                    label="执行并发数"
                    rules={[{
                      required: true,
                      type: "number",
                      max: agentLimits,
                      message: `执行并发数不允许为空或者超过限制(${agentLimits})`,
                      transform: (value) => {
                        return Number(value)
                      }
                    }]}>
                    <Input placeholder={"执行并发数"} suffix="台" type={"number"}/>
                  </Form.Item>
                  <Form.Item name="include_users" label="关联人">
                    <Input placeholder="请输入关联人w3账号，多个用分号隔开"/>
                  </Form.Item>
                  <Form.Item name="tags" label="标签">
                    <Select mode="tags" placeholder="请输入标签">
                      <Select.Option value={"防护网"}>防护网</Select.Option>
                      <Select.Option value={"验收"}>验收</Select.Option>
                      <Select.Option value={"定制"}>定制</Select.Option>
                    </Select>
                  </Form.Item>
                  <FooterToolbar>
                    <Form.Item noStyle name={"upgrade"} valuePropName={"checked"}>
                      <Checkbox onChange={(e) => {
                        setFromData({...fromData, upgrade: e.target.checked})
                      }}>升级</Checkbox>
                    </Form.Item>
                    <Form.Item noStyle name={"cron"} valuePropName={"checked"}>
                      <Checkbox onChange={(e) => {
                        setFromData({...fromData, cron: e.target.checked})
                      }}>定时触发</Checkbox>
                    </Form.Item>
                    <Form.Item noStyle name={"self_define"} valuePropName={"checked"}>
                      <Checkbox onChange={(e) => {
                        setFromData({...fromData, self_define: e.target.checked})
                      }}>配置全局变量</Checkbox>
                    </Form.Item>
                    <Form.Item noStyle name={"run"} valuePropName={"checked"}>
                      <Checkbox>是否保存后直接执行</Checkbox>
                    </Form.Item>
                    <Form.Item noStyle name={"tras"} valuePropName={"checked"}>
                      <Checkbox>测试后产品日志异常扫描（TRAS）</Checkbox>
                    </Form.Item>
                    {dataErrorMsg && <span style={{color: "#ff4d4f", paddingRight: "20px"}}><CloseCircleOutlined
                      style={{color: "#ff4d4f"}}/>{dataErrorMsg}</span>}
                    <Button
                      onClick={handleSubmit}
                      type="primary">提交</Button>
                  </FooterToolbar>
                </Form>
              </Col>
            </Row>
          </Card>
      }
    </>
  )
};

export default EditTask
