import React, {useState} from 'react';
import {Collapse, Result, Descriptions} from "antd";
import RunCaseForm from "@/pages/Runner/components/GlobalVariableForm";


const CaseDetail = (props) => {
  const {nodeSelected, checkedNodes, runCaseInfo} = props;
  const caseNode = (data) => {
    const showCase = [
      {title: "Name", show: data.name, span: 1},
      {title: "Uri", show: data.case_uri, span: 1},
      {title: "Number", show: data.case_tcid, span: 1},
      {title: "Automated", show: data.auto ? "Y" : "N", span: 1},
      {title: "状态", show: data.status_display, span: 1},
      {title: "自动化类型", show: data.script_type, span: 1},
    ];
    const showFolder = [
      {title: "Name", show: data.name, span: 1},
      {title: "Uri", show: data.folder_uri, span: 1}
    ];
    return data.case_uri ? showCase : showFolder
  };
  return (
    <div>
    {
      nodeSelected.name || checkedNodes.length > 0
        ?
        <Collapse defaultActiveKey={nodeSelected.name ? checkedNodes.length > 0 ? ['1', "2"]: ['1']: ['2']}>
          {nodeSelected.name && <Collapse.Panel header="基本信息" key="1">
            <Descriptions size={"small"} bordered column={1}>
            {
              caseNode(nodeSelected).map(
                (item) => <Descriptions.Item key={item.title} label={item.title}>
                  <span>{item.show}</span>
                </Descriptions.Item>
              )
            }
            </Descriptions>
          </Collapse.Panel>}
          <Collapse.Panel header="执行配置" key="2">
            <RunCaseForm
              user={props.user}
              caseData={{Summary: runCaseInfo, data: checkedNodes}}
            />
          </Collapse.Panel>
        </Collapse>
        :
        <Result title="请选中左侧用例查看详情"/>
    }
    </div>
  )
};

export default CaseDetail










// import React, {Component} from "react";
// import {
//   Alert,
//   Button,
//   Collapse,
//   Descriptions, Modal, notification, Radio,
//   Result,
// } from "antd";
// import {connect} from "umi";
// import ReactCodeMirror from "react-cmirror/src/react-cmirror";
// import * as jsyaml from "js-yaml";
// import 'codemirror/theme/duotone-light.css';
// import GlobalVariableForm from "@/pages/Runner/components/GlobalVariableForm";
// import TestBed from "@/pages/Runner/components/TestBed";
// import SmileOutlined from "@ant-design/icons/lib/icons/SmileOutlined";
// import FrownOutlined from "@ant-design/icons/lib/icons/FrownOutlined";
// import StartRunConfirm from "@/pages/Runner/components/StartRunConfirm";
//
// const {Panel} = Collapse;
//
// const ResultConfig = {
//   "invalid": {status: "error", subTitle: "当前用例不支持执行，请选择其他用例", icon: <SmileOutlined/>, disabled: true},
//   "notFolder": {status: "warning", subTitle: "暂不支持文件夹执行，请指定用例", icon: <SmileOutlined/>, disabled: true},
//   "notCase": {status: "info", subTitle: "未指定用例，请先指定用例", icon: <SmileOutlined/>, disabled: true},
//   "notEnv": {status: "error", subTitle: "未选择有效的环境，请选择环境", icon: <FrownOutlined/>, disabled: true},
//   "notVersion": {status: "error", subTitle: "未选择测试版本，请选择测试版本", icon: <FrownOutlined/>, disabled: true},
//   "notYaml": {status: "error", subTitle: "自定义参数配置有误，请核查", icon: <FrownOutlined/>, disabled: true},
//   "notRun": {status: "warning", subTitle: "当前用例不支持执行，请选择其他用例", icon: <FrownOutlined/>, disabled: true},
//   "notNone": {status: "info", subTitle: "未指定用例，请先指定用例", icon: <SmileOutlined/>, disabled: true},
//   "valid": {status: "success", subTitle: "点击以下按钮，立即执行", icon: <SmileOutlined/>, disabled: false},
//   "notCanRunCase": {status: "info", subTitle: "无可执行的用例", icon: <SmileOutlined/>, disabled: true},
//   "oversteps": {status: "warning", subTitle: "选中用例数过多（> 300）,暂不支持", icon: <SmileOutlined/>, disabled: true},
//   // "multiCase": {status: "success", subTitle: "点击以下按钮，立即执行", icon: <SmileOutlined/>, disabled: false},
// };
//
// const _getButtonData = (status, selectType) => {
//   const showText = selectType === "multiCase" ? "执行勾选用例" : "执行当前用例";
//   return <Button
//     type="primary"
//     onClick={() => callback(selectType)}
//     title={ResultConfig[status].disabled ? ResultConfig[status].subTitle : ""}
//     disabled={ResultConfig[status].disabled}
//     style={{marginRight: "12px"}}>
//     {showText}
//   </Button>
// };
//
// const getResultComponent = (isSelect, isCheck, hasEnv, hasVersion, yamlValidate, selectData, checkData, callback) => {
//   // isSelect 用例是否选中；isCheck 用例是否有勾选；selectData 选中的用例数据; checkData 勾选的用例数据
//   let status = "notNone";
//   // 判断当前是否可执行
//   const hasToRun = isSelect || isCheck;
//   if (!hasToRun) {
//     status = "notNone";
//   } else if (hasToRun && !hasEnv) {
//     status = "notEnv";
//   } else if (hasToRun && hasEnv && !hasVersion) {
//     status = "notVersion";
//   } else if (hasToRun && hasEnv && hasVersion && !yamlValidate) {
//     status = "notYaml";
//   } else {
//     status = "valid";
//   }
//   // 判断是选中的还是勾选的!!selectTreeNode.folder_uri, !!selectTreeNode.case_uri
//   let selectStatus = status;
//   if (isSelect && selectData.folder_uri) {
//     selectStatus = "notRun"
//   }
//   if (isSelect && !selectData.can_run) {
//     selectStatus = "notRun"
//   }
//   let checkStatus = status;
//   if (isCheck && checkData.caseNum.auto < 0) {
//     checkStatus = "notCanRunCase"
//   } else if (isCheck && checkData.caseNum.auto > 300) {
//     checkStatus = "oversteps"
//   }
//   let extra = <Button
//     type="primary"
//     title={ResultConfig[selectStatus].disabled ? ResultConfig[selectStatus].subTitle : ""}
//     onClick={() => callback("singleCase")}
//     disabled={ResultConfig[selectStatus].disabled}>
//     执行当前用例
//   </Button>;
//   if (isCheck) {
//     extra = <Button.Group>
//       <Button
//         type="primary"
//         onClick={() => callback("multiCase")}
//         title={ResultConfig[checkStatus].disabled ? ResultConfig[checkStatus].subTitle : ""}
//         disabled={ResultConfig[checkStatus].disabled}
//         style={{marginRight: "12px"}}>
//         执行勾选用例
//       </Button>
//       <Button
//         type="primary"
//         title={ResultConfig[selectStatus].disabled ? ResultConfig[selectStatus].subTitle : ""}
//         onClick={() => callback("singleCase")}
//         disabled={ResultConfig[selectStatus].disabled}>
//         执行当前用例
//       </Button>
//     </Button.Group>
//   }
//   const StatusConfig = isCheck ? ResultConfig[checkStatus] : ResultConfig[selectStatus];
//   return <Result
//     status={StatusConfig.status} subTitle={StatusConfig.subTitle} icon={StatusConfig.icon} extra={extra}/>
//
// };
//
// const getResultCompont1 = (runStatus, isFolder, isCase, hasEnv, yamlValidate, hasSelected, callback,) => {
//   // const multi_status = hasSelected.caseNum.auto > 0 ? "multiCase" : "notNone";
//   console.log(runStatus, isFolder, isCase, hasEnv, yamlValidate, hasSelected);
//   let status = "notNone";
//   if (!isFolder && !isCase) {
//     status = "notNone";
//   } else if (isFolder && !isCase) {
//     status = "notFolder";
//   } else if (isCase && !runStatus) {
//     status = "invalid";
//   } else if (isCase && runStatus && !hasEnv) {
//     status = "notEnv";
//   } else if (isCase && runStatus && hasEnv && !yamlValidate) {
//     status = "notYaml";
//   } else {
//     status = "valid";
//   }
//   let multi_status = "valid";
//   if (hasSelected.caseNum.auto < 0) {
//     multi_status = "notCanRunCase";
//   } else if (hasSelected.caseNum.auto >= 300) {
//     multi_status = "oversteps";
//   } else if (!hasEnv) {
//     multi_status = "notEnv";
//   } else if (hasEnv && !yamlValidate) {
//     multi_status = "notYaml";
//   }
//   const singleStatusConfig = ResultConfig[status];
//   const multiStatusConfig = ResultConfig[multi_status];
//   let extra = <Button
//     type="primary"
//     title={singleStatusConfig.disabled ? singleStatusConfig.subTitle : ""}
//     onClick={() => callback("singleCase")}
//     disabled={singleStatusConfig.disabled}>
//     执行当前用例
//   </Button>;
//   if (hasSelected.caseNum.auto > 0) {
//     extra = <Button.Group>
//       <Button
//         type="primary"
//         onClick={() => callback("multiCase")}
//         title={multiStatusConfig.disabled ? multiStatusConfig.subTitle : ""}
//         disabled={multiStatusConfig.disabled}
//         style={{marginRight: "12px"}}>
//         执行勾选用例
//       </Button>
//       <Button
//         type="primary"
//         title={singleStatusConfig.disabled ? singleStatusConfig.subTitle : ""}
//         onClick={() => callback("singleCase")}
//         disabled={singleStatusConfig.disabled}>
//         执行当前用例
//       </Button>
//     </Button.Group>
//   }
//   const StatusConfig = hasSelected.keys.length > 0 ? multiStatusConfig : singleStatusConfig;
//   return <Result
//     status={StatusConfig.status} subTitle={StatusConfig.subTitle} icon={StatusConfig.icon} extra={extra}/>
// };
//
// class CaseDetail extends Component {
//   state = {
//     runType: "singleCase",
//     yamlConfig: {
//       isYaml: true,
//       errorMessage: "",
//       value: this.props.Variable.UserDefine
//     },
//     RunModelVisible: false
//   };
//
//   componentDidMount() {
//     const {dispatch, user} = this.props;
//     if (dispatch) {
//       dispatch({type: "eiicoDevice/fetGetVariables"});
//       dispatch({
//         type: "eiicoDevice/fetGetVersionList",
//         payload: {userShortName: user.short_name,}
//       });
//     }
//   }
//
//   RunConfirm = (runType) => {
//     // this.setState({
//     //   RunModelVisible: true,
//     // });
//     if (this.props.Variable.GlobalVariable.version.length === 0) {
//       notification.warning({
//         message: "无法执行",
//         description: "请指定测试版本",
//       });
//       return
//     }
//     if (runType === "multiCase" && this.props.selectedKeys.caseNum.auto >= 300) {
//       notification.warning({
//         message: "无法执行",
//         description: "选中用例数过多（> 300）,暂不支持, 请重新选择用例",
//       });
//     } else {
//       this.setState({
//         runType: runType,
//         RunModelVisible: true,
//       });
//     }
//
//
//   };
//
//   handleCancel = () => {
//     this.setState({
//       RunModelVisible: false,
//     });
//   };
//
//   StartRun = (CaseToRun) => {
//     const {dispatch} = this.props;
//     if (dispatch) {
//       dispatch({
//         type: "caseTree/fetchRunCase",
//         payload: {
//           run_type: this.state.runType,
//           ready_to_run: CaseToRun,
//           public_variable: this.props.Variable.GlobalVariable,
//           user_define: {
//             set_enable: this.props.UserConfig,
//             data: this.state.yamlConfig.value
//           },
//           env_data: {
//             topo_type: this.props.envType,
//             env_data: this.props.selectedData
//           }
//         },
//         callback: () => {
//           this.setState({
//             RunModelVisible: false,
//           });
//         }
//       });
//     }
//   };
//
//   render() {
//     const {selectTreeNode, Variable, UserConfig} = this.props;
//     const {yamlConfig} = this.state;
//     const caseNode = (data) => {
//       const showCase = [
//         {title: "Name", show: data.name, span: 1},
//         {title: "Uri", show: data.case_uri, span: 1},
//         {title: "Number", show: data.case_tcid, span: 1},
//         {title: "Automated", show: data.auto ? "Y" : "N", span: 1},
//         {title: "状态", show: data.status_display, span: 1},
//         {title: "自动化类型", show: data.script_type, span: 1},
//       ];
//       const showFolder = [
//         {title: "Name", show: data.name, span: 1},
//         {title: "Uri", show: data.folder_uri, span: 1}
//       ];
//       return data.case_uri ? showCase : showFolder
//     };
//     const nodeSelected = Object.keys(selectTreeNode).length > 0;
//     const treeSelected = this.props.selectedKeys.keys.length > 0;
//     const hasVersion = Variable && Variable.GlobalVariable && Variable.GlobalVariable.version && Variable.GlobalVariable.version.length > 0;
//     const hasEnv = this.props.selectedData.length > 0;
//     const readyToRunCase = this.state.runType === "singleCase" ? selectTreeNode : this.props.selectedKeys;
//     return (
//       <div>
//         {
//           selectTreeNode.name &&
//           <Collapse defaultActiveKey={['1']}>
//             <Panel header="基本信息" key="1">
//               <Descriptions size={"small"} bordered column={1}>
//                 {
//                   caseNode(selectTreeNode).map(
//                     (item) => <Descriptions.Item key={item.key} label={item.title}>
//                       <span>{item.show}</span>
//                     </Descriptions.Item>
//                   )
//                 }
//               </Descriptions>
//             </Panel>
//             <Panel header="全局变量" key="2">
//               <GlobalVariableForm user={this.props.user}/>
//             </Panel>
//             <Panel header="环境选择" key="3">
//               <TestBed user={this.props.user}/>
//             </Panel>
//             {UserConfig && <Panel header="自定义变量" key="4">
//               <ReactCodeMirror
//                 value={jsyaml.safeDump(Variable.UserDefine)}
//                 options={{
//                   mode: 'yaml', theme: 'duotone-light', lineNumbers: true,
//                   indentUnit: 1, styleActiveLine: true, matchBrackets: true,
//                   lineWrapping: true, tabSize: 2,
//                 }}
//                 onBeforeChange={(editor, data, value) => {
//                 }}
//                 onBlur={(editor, data, value) => {
//                   let isYaml = false;
//                   let errorMessage = '';
//                   try {
//                     isYaml = !!jsyaml.load(editor.getValue());
//                   } catch (e) {
//                     errorMessage = e && e.message;
//                   }
//                   this.setState({
//                     yamlConfig: {
//                       isYaml: isYaml, errorMessage: errorMessage, value: jsyaml.load(editor.getValue())
//                     }
//                   });
//                 }}
//               />
//               {
//                 yamlConfig && !yamlConfig.isYaml && <Alert
//                   message="Yaml 语法错误"
//                   description={yamlConfig.errorMessage}
//                   type="error"
//                   showIcon
//                 />
//               }
//             </Panel>
//             }
//           </Collapse>
//         }
//         {
//           getResultComponent(
//             nodeSelected, treeSelected, hasEnv, hasVersion, yamlConfig.isYaml,
//             selectTreeNode, this.props.selectedKeys, this.RunConfirm
//           )
//           // getResultCompont(
//           //   canbeRun, !!selectTreeNode.folder_uri, !!selectTreeNode.case_uri,
//           //   this.props.selectedData.length > 0, yamlConfig.isYaml, this.props.selectedKeys, this.RunConfirm
//           // )
//         }
//         <Modal
//           title="参数确认"
//           width={700}
//           visible={this.state.RunModelVisible}
//           onOk={() => this.StartRun(readyToRunCase)}
//           onCancel={this.handleCancel}
//           cancelText={"取消"}
//           okText={"开始执行"}
//         >
//           <StartRunConfirm
//             currentCaseData={readyToRunCase}
//             user={this.props.user}/>
//         </Modal>
//       </div>
//     )
//   }
// }
//
// export default connect((state) => {
//   const {caseTree, eiicoDevice} = state;
//   return {
//     selectedKeys: caseTree.selectedKeys,
//     selectTreeNode: caseTree.selectTreeNode,
//     Variable: eiicoDevice.Variable,
//     envType: eiicoDevice.envType,
//     UserConfig: eiicoDevice.advanceConfig,
//     selectedData: eiicoDevice.selectedData,
//   }
// })(CaseDetail);
