import React, { useState } from 'react';
import {history} from "umi";
import {Loader} from "@/components";
import {useMount, useRequest} from "@umijs/hooks";

import {
  Button,
  Form,
  Col,
  Row,
  Input, Card, Select, notification, Divider, Spin, Tooltip, Table
} from "antd";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import config from "@/config/app";

import FooterToolbar from '../../components/FooterToolbar'
import CidaConditionComponent from "@/pages/CaseSetConfig/compontents/ConfigSet";
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import {
  saveCaseSetConfig, getCaseSetConfig,
  getFixtureList, validateScope, scopeDisplay
} from "../../services/caseSetConfig";

import TreeSelectFolder from "@/pages/CaseSetConfig/compontents/TreeSelectFolder";
import QuestionCircleOutlined from "@ant-design/icons/lib/icons/QuestionCircleOutlined";

const is_quote_brackets = (quote) => {
  let result = [];
  for (let item of quote){
    if (item === "(") {
      result.push(item)
    } else if (item === ")") {
      if (result.length === 0){
        return false
      } else {
        result.pop()
      }
    }
  }
  return result.length === 0
};


const EditCaseSet = (props)=>{
  const [form] = Form.useForm();

  const {id} = props.match.params;
  const [errorMsg, setErrorMsg] = useState();
  const [fixtureList, setFixtureList] = useState([]);
  const [fromData, setFromData] = useState({name: "", fixture: []});
  const fixtureRequest = useRequest(getFixtureList, {
    manual: true,
    onSuccess: (data, params)=>{
      setFixtureList(data.MsgInfo)
    }});
  const [display, setDisplay] = useState({rule: [], scope: []});
  const detailRequest = useRequest(getCaseSetConfig, {
    manual: true,
    onSuccess: (data, params) => {
      setFromData(data.MsgInfo);
      form.setFieldsValue(data.MsgInfo);
      const rule_list = data.MsgInfo.logic.map(item=>{
        if (item) {
          return [
            item.left, item.attr ? item.attr.label: "",
            item.condition,
            item.value ? item.value.label ? item.value.label : item.value : "",
            item.right,
            item.logic
          ].join(" ")
        } else {
          return ""
        }
      });
      // setDisplayRules(rule_list);
      setDisplay({...display, rule: rule_list, scope: data.MsgInfo.scope_display});
    }});
  const saveRequest = useRequest(saveCaseSetConfig, {
    manual: true,
    onSuccess: () => {
      notification.info({
        description: "?????????????????????",
        message: '????????????',
      });
      history.push(`${config.baseUri}/case/config`)
    }
  });
  const validateScopeRequest = useRequest(validateScope, {
    manual:true,
    onSuccess: (data, params) => {
      if (!data.MsgInfo) {
        setErrorMsg("??????????????????????????????")
      } else {
        setErrorMsg("")
      }
    }
  });
  // const getScopeRequest = useRequest(getScope, {
  //   manual: true,
  //   onSuccess: (data, params) => {
  //     setScopeList(data.MsgInfo)
  //   }
  // });
  // const getScopeTreeRequest = useRequest(getScopeList, {
  //   manual: true,
  // });
  const scopeDisplayRequest = useRequest(scopeDisplay, {
    manual: true,
    onSuccess: (data, params)=>{
      setDisplay({...display, scope: data.MsgInfo});
    }
  });
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
  };
  const handleOnClickReturn = () =>{
    history.push(`${config.baseUri}/case/config`)
  };

  useMount(
    () => {
      fixtureRequest.run();
      if (id) {
        detailRequest.run({key: id})
      }
    }
  );
  const onChangeErrorMsg = ()=>{
  };
  const handleSubmit = ()=>{
    form.validateFields()
      .then(values => {
        const {name, logic, fixture, scope} = values;
        if (!logic || (logic && logic.length === 0)) {
          setErrorMsg("???????????????????????????")
        } else {
          saveRequest.run({name, logic, fixture, scope, ...{key: id}});
        }
      });
  };
  const onFieldsChange = (changedFields, allFields)=>{
    if (Object.keys(changedFields).indexOf("logic") >= 0){
      setErrorMsg();
      let quote = [];
      const logicData = form.getFieldValue("logic");
      const rule_list = logicData.map(item=>{
        if (item) {
          if (item.left) {
            quote.push(...item.left.split(""))
          }
          if (item.right) {
            quote.push(...item.right.split(""))
          }
          return [
            item.left, item.attr ? item.attr.label: "",
            item.condition,
            item.value ? item.value.label ? item.value.label : item.value : "",
            item.right,
            item.logic
          ].join(" ")
        } else {
          return ""
        }
      });
      setDisplay({...display, rule: rule_list});
      setErrorMsg(is_quote_brackets(quote) ? "" : "?????????????????????????????????");
    } else if (Object.keys(changedFields).indexOf("scope") >= 0){
      const scope = form.getFieldValue("scope");
      if (scope.length >= 1){
        validateScopeRequest.run({scope: scope});
        scopeDisplayRequest.run({scope: scope});
      } else {
        setErrorMsg("")
      }
    } else {
      setErrorMsg("")
    }
  };
  return (
    <>
    {
      saveRequest.loading || detailRequest.loading || fixtureRequest.loading ?
        <Loader loadTxt={saveRequest.loading ? "????????????????????????": "????????????????????????"} spinning={true} fullScreen={false}/>
        : <Card
        extra={
          <Button
            ghost
            onClick={handleOnClickReturn}
            type="primary"
          >????????????</Button>
        }
        hoverable={false}
        title={id?"???????????????":'???????????????'}
      >
        <Row gutter={24}>
          <Col md={18}
               sm={24}
          >
            <Form
              form={form}
              className="my-form"
              onValuesChange={onFieldsChange}
              {...formItemLayout}
              initialValues={fromData}
            >
              <Form.Item name="name"
                         label="???????????????"
                         rules={[{required: true, max: 60, message: "????????????????????????60?????????"}]}
              >
                <Input placeholder="???????????????" onChange={onChangeErrorMsg}/>

              </Form.Item>
              <Form.Item
                label="????????????"
              >
                <Form.Item
                  name="scope"
                  rules={[
                    {required: !id, message: "???????????????????????????", type: "array"},
                    // {type: 'array', max: 6, message: "????????????6?????????"}
                  ]}
                  style={{display: 'inline-block', width: 'calc(95%)', marginBottom: "6px"}}
                >
                  <TreeSelectFolder placeholder="?????????????????????" />
                </Form.Item>
                <Form.Item style={{display: 'inline-block', width: 'calc(5%)', marginBottom: "6px"}}>
                  <Tooltip title="??????????????????????????????????????????????????????">
                    <QuestionCircleOutlined style={{margin: "0 8px", color: "#fa8c16"}}/>
                  </Tooltip>
                </Form.Item>
              </Form.Item>
              <Form.Item label="??????????????????" rules={[{required: true}]}>
                <Form.List name={"logic"} rules={[{required: true}]}>
                  {(fields, {add, remove, move}) => {
                    /**
                     * `fields` internal fill with `name`, `key`, `fieldKey` props.
                     * You can extends this into sub field to support multiple dynamic fields.
                     */
                    return (
                      <>
                        {fields.map((field, index) => {
                          // console.log(fields.length, field.fieldKey, index)
                          return (
                            <CidaConditionComponent
                              fromLogicData={fromData.logic || []}
                              fromInstance={form}
                              remove={remove}
                              move={move}
                              currentField={field}
                              key={field.key}
                              currentIndex={index}
                              maxIndex={fields.length}
                            />
                          )
                        })}
                        <Form.Item style={{marginBottom: "6px"}}>
                          <Button
                            type="dashed"
                            onClick={() => {
                              add();
                            }}
                            style={{width: "100%"}}
                          >
                            <PlusOutlined/> ????????????
                          </Button>
                        </Form.Item>
                      </>
                    );
                  }}
                </Form.List>
              </Form.Item>
              <Form.Item
                label="??????Fixture"
              >
                <Form.Item
                  name="fixture"
                  style={{display: 'inline-block', width: 'calc(95%)', marginBottom: "6px"}}
                  // rules={[{type: 'array', message: "Fixture???????????????"}]}
                >
                  <Select mode={"multiple"}
                          onChange={onChangeErrorMsg}
                          placeholder="????????????Fixture, ??????????????????fixture????????????">
                    {fixtureList.map(fixture => (
                      <Select.Option value={fixture} key={fixture}>{fixture}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item style={{display: 'inline-block', width: 'calc(5%)', marginBottom: "6px"}}>
                  <Tooltip title="????????????Fixture, ??????????????????fixture????????????">
                    <QuestionCircleOutlined style={{margin: "0 8px", color: "#fa8c16"}}/>
                  </Tooltip>
                </Form.Item>
              </Form.Item>
              <FooterToolbar>
                {errorMsg && <span style={{color: "#ff4d4f", paddingRight: "20px"}}><CloseCircleOutlined
                  style={{color: "#ff4d4f"}}/>{errorMsg}</span>}
                <Button
                  disabled={!!errorMsg}
                  onClick={handleSubmit}
                  type="primary">??????</Button>
              </FooterToolbar>
            </Form>
          </Col>
          <Col md={6}
               sm={24}
          >
            <div>
              <span style={{color: '#40a9ff'}}>????????????:</span><br/>
              {
                scopeDisplayRequest.loading
                  ? <Spin size={"small"}>?????????</Spin>
                  : display.scope.map((item, index) => <p key={index} style={{margin: "0 10px"}}>{item}</p>)
              }
            </div>
            {display.rule.length > 0 && <div><Divider style={{margin:5}}/>
              <span style={{color: '#40a9ff'}}>???????????????:</span><br/>
              <div style={{
                backgroundColor: "#d9d9d9",
                minHeight: "50px",
                maxHeight: "150px",
                overflowY: "scroll"
              }}
              >
                {display.rule.map((item, index) => <p key={index} style={{margin: "0 10px"}}>{item}</p>)}
              </div>
              {/*<Divider style={{margin:5}}/>*/}
            </div>
            }
          </Col>
        </Row>
      </Card>
    }
  </>
  );
};

export default EditCaseSet
