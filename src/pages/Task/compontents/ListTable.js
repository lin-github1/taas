import React, { Component, useState } from 'react';
import { getTestCaseList,getJobContainerList,editCaseResult, run_mctc_task } from "@/services/job";
import Zmage from 'react-zmage'
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
  Form,
  Tag,
  Drawer,
  Modal,
  notification, Tooltip, Spin,
  Dropdown,
  Menu,

} from "antd";
import { Link } from "umi";
import config from "@/config/app";
import ListSearchCom from "./ListSearchCom";
import TestCaseSearchCom from "./TestCaseSearchCom";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import "./ListTable.less"
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import { sdc_sum } from "@/utils";
import AppstoreOutlined from "@ant-design/icons/lib/icons/AppstoreOutlined";
import AimOutlined from "@ant-design/icons/lib/icons/AimOutlined";
import DeploymentUnitOutlined from "@ant-design/icons/lib/icons/DeploymentUnitOutlined";
import OrderedListOutlined from "@ant-design/icons/lib/icons/OrderedListOutlined";
import { useRequest } from "@umijs/hooks";
import { startToRun, deleteJob, getNextRunTime, cancelCron } from "@/services/job";
import ShakeOutlined from "@ant-design/icons/lib/icons/ShakeOutlined";
import FundOutlined from "@ant-design/icons/lib/icons/FundOutlined";
import FolderOpenOutlined from "@ant-design/icons/lib/icons/FolderOpenOutlined";
import TeamOutlined from "@ant-design/icons/lib/icons/TeamOutlined";
import ClockCircleOutlined from "@ant-design/icons/lib/icons/ClockCircleOutlined";
import FormOutlined from "@ant-design/icons/lib/icons/FormOutlined";
import { DownloadOutlined } from '@ant-design/icons';
import DeleteRowOutlined from "@ant-design/icons/lib/icons/DeleteRowOutlined";
import { string } from 'prop-types';
import { downDocex} from "@/services/job";
// import MinusCircleTwoTone from "@ant-design/icons/lib/icons/MinusCircleTwoTone";
// import PlusCircleTwoTone from "@ant-design/icons/lib/icons/PlusCircleTwoTone";
import {MinusCircleTwoTone,PlusCircleTwoTone} from '@ant-design/icons';

import {
  Player,
  ControlBar,
  PlayToggle,
  ReplayControl, // ????????????
  ForwardControl,  // ????????????
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,  // ??????????????????
  VolumeMenuButton
 } from 'video-react';
import 'video-react/dist/video-react.css'; // import css

//?????????????????????
// import CodeMirror from 'react-codemirror';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/mode/sql/sql';
// import 'codemirror/addon/hint/show-hint.css';
// import 'codemirror/addon/hint/show-hint.js';
// import 'codemirror/addon/hint/sql-hint.js';
// import 'codemirror/theme/blackboard.css';

import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/cmake/cmake';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';


function getPolymorphismMessage(_d) {
  if (_d === "0") {
    return "?????????"
  } else if (_d === "1") {
    return "?????????????????????"
  } else if (_d === "2") {
    return "?????????????????????????????????????????????"
  } else if (_d === "3") {
    return "?????????????????????????????????????????????"
  } else {
    return "???????????????"
  }
}


function getTagComponent(source) {
  if (source === "ticc") {
    return <Tooltip title={"TICC??????"}><Tag color="purple"><AppstoreOutlined /></Tag></Tooltip>
  } else if (source === "list") {
    return <Tooltip title={"???????????????"}><Tag color="cyan"><TeamOutlined /></Tag></Tooltip>
  } else if (source === "folder") {
    return <Tooltip title={"????????????"}> <Tag color="orange"><FolderOpenOutlined /></Tag></Tooltip>
  } else if (source === "search") {
    return <Tooltip title={"????????????"}> <Tag color="green"><FundOutlined /></Tag></Tooltip>
  }
}
function getStatusDict(status) {
  if (status === true) {
    return {text:'?????????',color:'success'};
  } else if (status === false) {
    return {text:'?????????',color:'warning'};
  }else if (status === 1) {
    return {text:'?????????',color:'warning'};
  }else if (status === 2) {
    return {text:'?????????',color:'success'};
  }else if (status === 3) {
    return {text:'?????????',color:'purple'};
  }else if (status === "manualExcuting") {
    return {text:'????????????',color:'cyan'};
  }else if (status === "waitting") {
    return {text:'?????????',color:'warning'};
  }else if (status === "waiting") {
    return {text:'?????????',color:'warning'};
  }else if (status === "executing") {
    return {text:'?????????',color:'warning'};
  }else if (status === "investigated") {
    return {text:'????????????',color:'warning'};
  }else if (status === "complete") {
    return {text:'????????????',color:'success'};
  }else if (status === "upgrade") {
    return {text:'?????????',color:'lime'};
  }else if (status === "upgrade_fail") {
    return {text:'????????????',color:'#f50'};
  }else if (status === "failed") {
    return {text:'??????',color:'#f50'};
  }else if (status === "pass") {
    return {text:'??????',color:'success'};
  }else if (status == "wait"){
    return {text:'?????????',color:'purple'}
  }else if (status == "taskerror"){
    return {text:'??????????????????',color:'#f50'}
  }else if (status == "setup"){
    return {text:'????????????',color:'warning'}
  }
  return {text:'??????',color:'magenta'};
}
const TaskTable = (props) => {
  const {
     setSelectData, selectData = [], dataSource, BedName, currentBedName,runTask
  ,pk} = props;
  const [currentData, setCurrentData] = useState(selectData);
  const [searchInput, setSearchInput] = useState();
  const [Downloadstate, setDownloadstate] = useState(false);
  const downRequest = useRequest(downDocex, {
    manual: true,
    onSuccess: (data, params) => {
      console.log('????????????docx??????????????????')
      console.log(data)
      console.log(params)
      // console.log(ErrorHandle)
      // console.log(data.ErrorInfo)
      console.log("************")
      setDownloadstate(false)
      if (data.ErrorInfo) {
        if (data.MsgInfo != "None") {
          window.open(data.MsgInfo)
          notification.info({
            description: "????????????",
            message: '????????????',
          });
        }
        else {
          notification.info({
            description: "????????????",
            message: '???????????????',
          });
        }
      }
    }
  });
  const Download = (key) =>{
    setDownloadstate(true)
    console.log(key)
    downRequest.run({
      downPlatFormSeq:key,
      // ...fromData,
      // ...form.getFieldsValue(),
      // user_define: fromData.user_define,
      // category: "search",
    }
    )};
  return (
    <Table
      columns={[
        {dataIndex: 'taskName', title: '???????????????',  fixed: 'left',ellipsis: true,},
        {
          dataIndex: 'key',
          title: '??????ID',
          fixed: 'left',
          ellipsis: true,
        },
        {dataIndex: 'deviceType', title: '????????????', ellipsis: true,},
        {dataIndex: 'deviceIp', title: '??????IP', ellipsis: true,},
        {dataIndex: 'upgradePacket', title: '????????????', ellipsis: true,},
        {
          dataIndex: 'status',
          title: '????????????',
          ellipsis: true,
          fixed: 'right',
          render: (text,record)=>{
            if (text==="wait"){
              console.log("???????????????")
              console.log(pk)
              return(
              <Popconfirm title="???????????????????????????" okText="??????" cancelText="??????" onConfirm={()=>runTask(record.key,true,pk)} ><Tag color={getStatusDict(text)["color"]}>{getStatusDict(text)["text"]}</Tag></Popconfirm>)
            }else{
              return <Tag color={getStatusDict(text)["color"]}>{getStatusDict(text)["text"]}</Tag>
            }
          }
        },
        {
          dataIndex: 'key',
          title: '??????????????????',
          ellipsis: true,
          render: (text, record)=>{
            return(<Button type="primary" shape="circle" icon={<DownloadOutlined />} onClick={() => Download(record.key)} ></Button>)
          }
        },
      ]}
      // key={params[0].pk}
      // rowClassName={(record, index)=>{
      //   return record.status === "0"?"":"unUsed"
      // }}
      dataSource={dataSource}
      size="small"
      pagination={{pageSize: 6}}
      scroll={{x: 900}}
    />
  )
};



const ListTable = (props) => {

  const [drawersData, setDrawersData] = useState({
    //???????????????????????????????????????
    visible: false,
    modalVisible: false,
    drawersDeviceType: [],
    drawersimageUrl: '',
    displayType:'',
    loginfoData:'',
    initModel:"all",
    imageSer:[
      {
        src:"http://10.174.56.96:8088/static/Image/2020-12-02/??????IR-CUT????????????????????????_X6721-Z37_120738/90.85.119.100/2020-12-02_12-06-47-665.jpg"
      },
      {
        src:"http://10.174.56.96:8088/static/Image/2020-12-02/??????IR-CUT????????????????????????_X6721-Z37_120738/90.85.119.100/2020-12-02_12-07-21-98.jpg"
      }
    ]


  });
  const {
    form, requestInstance, reloadData, endTimeValue, startTimeValue
  } = props;

  const [expandedObject, setExpandedObject] = useState({
    expandVisible: {},
    expandedRowRenders: {},
    expandedRowKeys: [],
  });

  const [testCaseForm] = Form.useForm();

  //????????????????????????
  const testCaseRequest = useRequest(
    getTestCaseList,
    {
      manual: true,
      paginated: true,
      debounceInterval: 800,
      defaultParams: [{
        current: 1, pageSize: 10,
        // range: activeTab,
        create_time: [
          startTimeValue.format('YYYY-MM-DD 00:00:00'), endTimeValue.format('YYYY-MM-DD 23:59:59')
        ]
      }]
    },
  );

//?????????????????????
  const testCaseData = (key, extra_params) => {
    const { create_time } = testCaseForm.getFieldsValue();
    console.log("??????????????????")
    console.log(key)
    console.log("??????????????????")
    console.log(extra_params)
    testCaseRequest.run({
      current: 1, pageSize: 10,
      ...testCaseRequest.params[0],
      ...testCaseForm.getFieldsValue(),
      ...extra_params,
      ...key,
      // range: key || activeTab,
      // create_time????????????monet???????????????????????????????????????
      create_time: create_time ?
        [create_time[0].format('YYYY-MM-DD 00:00:00'), create_time[1].format('YYYY-MM-DD 23:59:59')] : null,
    });
  };
  const { Column, ColumnGroup } = Table;
  const deleteRequest = useRequest(deleteJob,
    {
      manual: true,
      onSuccess: (data, params) => {
        if (data && data.ErrorInfo && data.ErrorInfo.errCode === '0') {
          notification.success({
            message: "??????????????????",
            description: `[${params[0].task_name}]????????????`,
          });
        }
        reloadData()
      }
    }
  );
  const startRunRequest = useRequest(startToRun,
    {
      manual: true,
      onSuccess: (data, params) => {
        if (data && data.ErrorInfo && data.ErrorInfo.errCode === '0') {
          notification.success({
            message: "??????????????????",
            description: `[${params[0].task_name}]????????????`,
          });
        }
        reloadData()
      }
    }
  );
  const getNextRunTimeRequest = useRequest(getNextRunTime, { manual: true });
  const cancelCronRequest = useRequest(cancelCron, {
    manual: true,
    onSuccess: (data, params) => {

      if (data && data.ErrorInfo && data.ErrorInfo.errCode === '0') {
        notification.success({
          message: "????????????????????????",
          description: `[${params[0].task_name}]????????????????????????`,
        });
      }
      reloadData()
    }
  });
  //????????????????????????
  function detailingClick(record) {
    console.log('??????????????????')
    testCaseData({ motherTaskSeq: record.platFormSeq })
    console.log(record.platFormSeq)
    setDrawersData({
      ...drawersData, visible: true,
      drawersDeviceType: record.deviceType,
      downPlatFormSeq: record.platFormSeq //??????????????????
    })

    console.log(drawersData)
  }

  //??????????????????
  function onClose() {
    console.log('??????????????????')
    console.log(form)
    setDrawersData({ ...drawersData, visible: false })
    testCaseForm.setFieldsValue({model:"all"})
    testCaseRequest.params[0] = []
    if (testCaseRequest.data) {
      testCaseRequest.data.MsgInfo = []
    }


  };
  const handleOk = (e) => {
    console.log(e);
    setDrawersData({ ...drawersData, modalVisible: false , drawersimageUrl: '',loginfoData:''})
  }

  const handleCancel = (e) => {
    console.log(e);
    setDrawersData({ ...drawersData, modalVisible: false , drawersimageUrl: '' ,loginfoData:''})
  }

  function imageClick(record, values,displayType) {
    console.log(values)
    console.log(displayType)
    if (displayType=="image"){
      console.log(record.imageUrl)
      const imageSer = []
      record.imageUrl.map((values, index) =>{ imageSer.push({src:values})})
      console.log(imageSer)
      // return <Spin size="small" />
      // return <Zmage src={drawersData.drawersimageUrl} set={drawersData.imageSer} width="100%" edge={0}></Zmage>
      // return <Zmage src={drawersData.drawersimageUrl} set={drawersData.imageSer} width="100%" edge={0}></Zmage>
      // return (<Zmage src="http://10.174.56.96:8088/static/Image/2020-12-02/??????IR-CUT????????????????????????_X6721-Z37_120738/90.85.119.100/2020-12-02_12-06-47-665.jpg"></Zmage>)
      // return Zmage.browsing({ src:"http://10.174.56.96:8088/static/Image/2020-12-02/??????IR-CUT????????????????????????_X6721-Z37_120738/90.85.119.100/2020-12-02_12-06-47-665.jpg" })
      // return Zmage.browsing({ src:drawersData.drawersimageUrl,set:drawersData.imageSer })
      return Zmage.browsing({ set:imageSer,width:"100%",edge:0 })
    }else if(displayType=="video"){

      setDrawersData({ ...drawersData, modalVisible: true, drawersimageUrl: values, displayType:displayType})

    }else if(displayType=="loginfo"){
      setDrawersData({ ...drawersData, modalVisible: true, loginfoData: values, displayType:displayType})
    }

  }
  function expandedRowRender1(record, index) {

    // console.log(record.platFormSeq)
    // console.log(index)
    return <span>{record.platFormSeq}</span>

  }
  //???????????????
  const getEnvListRequest = useRequest(getJobContainerList, {
    manual: true,
    onSuccess: (data, params) => {
      console.log(data)
      setExpandedObject({
        ...expandedObject,
        expandVisible: {
          ...expandedObject.expandVisible, [params[0].pk]: true
        },
        expandedRowRenders: {
          ...expandedObject.expandedRowRenders,
          [params[0].pk]: <TaskTable
                                    dataSource={data && data.MsgInfo ? data.MsgInfo.items : []} runTask={runTask} pk={params[0].pk} />
        },
        expandedRowKeys: [params[0].pk]
      })
    }
  });

  //????????????????????????
  const editResultRequest = useRequest(editCaseResult, {
    manual: true,
    onSuccess: (data, params) => {
      console.log(data)
      testCaseData()
    }
  });
  // ???????????????????????????
  const RunMctcTask = useRequest(run_mctc_task, {
    manual: true,
    onSuccess: (data, params) => {
      reloadData()
      console.log("????????????2222222222222222222222XXX2")
      console.log(params)
      const record={platFormSeq:params[0].pk}
      console.log(record.platFormSeq)
      console.log("????????????")
      getEnvListRequest.run({pk: record.platFormSeq});
      // console.log(data)

      // console.log(ErrorHandle)
      // console.log(data.ErrorInfo)
      console.log("************")

      if (data.ErrorInfo) {
        notification.info({
          description: "??????????????????",
          message: '????????????',
        });
      }
    }
  });

  // ?????????????????????
  const onExpandedRowRender = (expanded, record) => {
    console.log(expanded)
    console.log("???????????????22222222222222")
    console.log(record)
    if (expanded) {
      getEnvListRequest.run({pk: record.platFormSeq});
      console.log(expanded)
    } else {
      setExpandedObject({
        ...expandedObject,
        expandVisible: {
          ...expandedObject.expandVisible, [record.platFormSeq]: false
        },
        expandedRowKeys: []
      })
    }
  };
  // ??????????????????
  const menu = (record)=>{
    // console.log(record)
    return(
    <Menu>
      <Menu.Item key="1" onClick={()=>editResult(record,"pass")} >pass</Menu.Item>
      <Menu.Item key="2" onClick={()=>editResult(record,"failed")} >failed</Menu.Item>
    </Menu>
    )
  };
  // ??????????????????
  const editResult = (record,Result) => {
    console.log('????????????????????????')
    console.log(record)
    console.log(Result)
    editResultRequest.run({ pk:record.id, caseResult:Result })
    // saveRequest.run({
    //   ...fromData,
    //   ...form.getFieldsValue(),
    //   user_define: fromData.user_define,
    //   category: "search",
    // });
  };
//??????????????????????????????
  const runTask = (run_id,child_mission,pk) => {
    console.log("??????????????????")
    console.log(props)
    console.log(pk)
    RunMctcTask.run({
      author:props.user,
      run_id:run_id,
      child_mission:child_mission,
      pk:pk
    })

  }

  return (
    <div className={'RecordTable'}>
      <ListSearchCom
        form={form}
        reloadData={reloadData}
        endTimeValue={endTimeValue}
        startTimeValue={startTimeValue}
        user = {props.user}
      />
      <Table

        dataSource={requestInstance.data ? requestInstance.data.MsgInfo.items : []}
        rowKey="platFormSeq"
        pagination={false}
        expandable={{
          expandedRowRender: (record, index) => {
            return expandedObject.expandVisible[record.platFormSeq] === true ? expandedObject.expandedRowRenders[record.platFormSeq] : true},
          expandedRowKeys:expandedObject.expandedRowKeys,
          expandIcon: ({expanded, onExpand, record}) =>
          expanded ? (
            <MinusCircleTwoTone onClick={e => onExpand(record, e)}/>
          ) : (
            <PlusCircleTwoTone onClick={e => onExpand(record, e)}/>
          ),
          onExpand: onExpandedRowRender

          }}  >
        <Column
          // width="10%"
          title="????????????"
          dataIndex="taskName"
          key="taskName"
        />
        <Column
          title="????????????"
          dataIndex="platFormSeq"
          key="platFormSeq"
        />
        <Column
          // width="10%"
          title="????????????"
          dataIndex="create_time"
          key="create_time"
        />
         <Column
          // width="10%"
          title="?????????"
          dataIndex="author"
          key="author"
        />
        <Column
          title="????????????"
          dataIndex="deviceType"
          key="deviceType"
          render={(text, record) => {
            return record.deviceType.map((values, index) => <Tag color="cyan" key={index}  >{values}</Tag>)
          }
          }

        />
        <Column
          title="????????????"
          dataIndex="taskStatus"
          render={(text, record) => {
            if (text===3){
              return(
              <Popconfirm title="??????????????????????????????" okText="??????" cancelText="??????" onConfirm={()=>runTask(record.platFormSeq,false,record.platFormSeq)} ><Tag color={getStatusDict(text)["color"]}>{getStatusDict(text)["text"]}</Tag></Popconfirm>)
            }else{
              return <Tag color={getStatusDict(text)["color"]}>{getStatusDict(text)["text"]}</Tag>
            }


          }
          }
        />
        <Column
          title="????????????"
          render={(text, record) => (
            <Tag color="blue" key={record.platFormSeq} onClick={() => detailingClick(record)} >??????</Tag>
          )
          }
        />
      </Table>
      <Drawer
        title="??????????????????"
        placement="right"
        closable={false}
        onClose={onClose}
        width={"70%"}
        visible={drawersData.visible}
      >
        <Modal
          title="??????"
          visible={drawersData.modalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1200}
          style={{height:"80%" }}

        >
          {
            drawersData.displayType == "image" &&
            <>
              <Zmage src={drawersData.drawersimageUrl} set={drawersData.imageSer} width="100%" edge={0}></Zmage>
            </>
          }
          {
            drawersData.displayType == "video" &&
            <div>
              {/* <Player playsInline src={drawersData.drawersimageUrl} > */}
              {/* <Player> */}
                {/* <source playsInline str={drawersData.drawersimageUrl} type="video/mp4"/> */}
              <Player
              >
                <source
                  src={drawersData.drawersimageUrl}
                  type="video/mp4"
                />
                <ControlBar autoHide={false} disableDefaultControls={false}>
                  <ReplayControl seconds={10} order={1.1} />
                  <ForwardControl seconds={30} order={1.2} />
                  <PlayToggle />
                  <CurrentTimeDisplay order={4.1} />
                  <TimeDivider order={4.2} />
                  <PlaybackRateMenuButton rates={[5, 2, 1.5, 1, 0.5]} order={7.1} />
                  <VolumeMenuButton />
                </ControlBar>
              </Player>
            </div>
          }
          {
            drawersData.displayType == "loginfo" &&
            <>

                <CodeMirror
                  // height="80%"
                  value={drawersData.loginfoData}
                  options={{
                    fullScreen: true,
                    styleActiveLine: true,      //???????????????
                    lineNumbers: true,                      //????????????
                    mode: {name: "text/x-cython"},          //??????mode
                    extraKeys: {"Ctrl": "autocomplete"},   //??????????????????
                    theme: "ambiance"                  //?????????theme
                  }}
                />
            </>
          }


        </Modal>
        <TestCaseSearchCom
          form={testCaseForm}
          drawersData={drawersData}
          reloadData={testCaseData}
          endTimeValue={endTimeValue}
          startTimeValue={startTimeValue}
        />
        <Table dataSource={testCaseRequest.data ? testCaseRequest.data.MsgInfo.items : []} scroll={{ x: 1500 }} rowKey='id' rowClassName={() => 'editable-row' } pagination={false} >
          <Column
            width="10%"
            title="????????????"
            dataIndex="model"
            key="model"
            fixed="left"
          />
          <Column
            width="10%"
            title="??????IP"
            dataIndex="testIp"
            key="testIp"
            fixed="left"
          />
          <Column
            width="10%"
            title="????????????"
            dataIndex="version"
            key="version"
          />
          <Column
            title="????????????"
            dataIndex="tcid"
            key="tcid"
          />
          <Column
            title="????????????"
            dataIndex="name"
            key="name"
          />
          <Column
            title="????????????"
            dataIndex="result"
            key="result"
            editable={true}
            render={(text,record)=>{
              return <Dropdown overlay={()=>menu(record)} trigger={['contextMenu']}>
              <Tag color={getStatusDict(text)["color"]} onClick={()=>{console.log(text)}}>{getStatusDict(text)["text"]}</Tag>
              </Dropdown>
            }
            }
          />
          <Column
            title="????????????"
            dataIndex="failMsg"
            key="failMsg"
          />

          <Column
            title="??????"
            dataIndex="imageUrl"
            key="imageUrl"
            render={(text, record) => {
              console.log(text)
              if(text.length!==0){
                return (<Tag color="blue"  onClick={() => imageClick(record, '11','image')} >{"??????"}</Tag>)
              }

                // return record.imageUrl.map((values, index) => <Tag color="blue" key={index} onClick={() => imageClick(record, values,'image')} >{"??????" + (index + 1)}</Tag>)
            }}
          />
          <Column
            title="??????"
            dataIndex="videoUrl"
            key="videoUrl"
            render={(text, record) => {
              return record.videoUrl.map((values, index) => <Tag color="blue" key={index} onClick={() => imageClick(record, values, 'video')} >{"??????" + (index + 1)}</Tag>)
            }}
          />
          <Column
            title="??????"
            dataIndex="logInfo"
            key="logInfo"
            render={(text, record) => {
              return text!=""&&<Tag color="blue" onClick={() => imageClick(record, text, 'loginfo')} >{"????????????"}</Tag>

            }}
          />
          <Column
            title="???????????????"
            dataIndex="lastMender"
            key="lastMender"
          />

          {/* <Column
          title="Tags"
          dataIndex="tags"
          key="tags"
          render={tags => (
            <span>
              {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
            </span>
          )}
        />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <span>
              <a href="javascript:;">Invite {record.lastName}</a>
              <Divider type="vertical" />
              <a href="javascript:;">Delete</a>
            </span>
          )}
        /> */}
        </Table>
        <Pagination
          {...testCaseRequest.pagination}
          onChange={testCaseRequest.pagination.changeCurrent}
          showQuickJumper
          showSizeChanger={false}
          showTotal={
            total => <span>?????? {total} ?????? <Button icon={<ReloadOutlined />} onClick={testCaseRequest.refresh }>??????</Button></span>}
          style={{ textAlign: 'center' }}
          total={testCaseRequest.data ? testCaseRequest.data.MsgInfo.total : 0}
        />
      </Drawer>
      <Pagination
        // {...requestInstance.pagination}
        onChange={requestInstance.pagination.changeCurrent}
        showQuickJumper
        showSizeChanger={false}
        showTotal={
          total => <span>?????? {total} ?????? <Button icon={<ReloadOutlined />} onClick={requestInstance.refresh}>??????</Button></span>}
        style={{ textAlign: 'center' }}
        total={requestInstance.data ? requestInstance.data.MsgInfo.total : 0}
      />
    </div>
  )
};

export default ListTable;
