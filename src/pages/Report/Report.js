import React, {Fragment, useEffect, useState} from 'react';
import {useMount, useRequest, useUpdateEffect} from '@umijs/hooks';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Typography,
  Progress,
  Row,
  Space,
  Tag,
  Tooltip, Popover, Input, Pagination, Tabs, Divider, Select, Dropdown, Menu, Drawer, Skeleton, Badge, Form
} from "antd";
import './Report.less'
import PieChart from "@/components/Chart/Pie/pie";
import moment from "moment";
import {getExeCaseList, recordDetail} from "@/services/record";
import {getAnalysisList} from "@/services/analysis"
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import {Loader} from "@/components";
import DownCircleOutlined from "@ant-design/icons/lib/icons/DownCircleOutlined";
import FundOutlined from "@ant-design/icons/lib/icons/FundOutlined";
import CaseResultTable from "./components/CaseTable"
import TaskLog from "./components/TaskLog"
import ToDoAnalysis from "./components/toDoAnalysis"
import {getStatusColor, timeFormat, tagRender, CaseStatus, CaseSearchFields} from "./utils"
import Icon from "@ant-design/icons/lib";
import FilterOutlined from "@ant-design/icons/lib/icons/FilterOutlined";
import AppstoreAddOutlined from "@ant-design/icons/lib/icons/AppstoreAddOutlined";
import {history} from "umi";
import config from "@/config/app";
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import ThunderboltOutlined from "@ant-design/icons/lib/icons/ThunderboltOutlined";
import FileExcelOutlined from "@ant-design/icons/lib/icons/FileExcelOutlined";
import ClusterOutlined from "@ant-design/icons/lib/icons/ClusterOutlined";
import BankOutlined from "@ant-design/icons/lib/icons/BankOutlined";
import PullRequestOutlined from "@ant-design/icons/lib/icons/PullRequestOutlined";
import VideoCameraAddOutlined from "@ant-design/icons/lib/icons/VideoCameraAddOutlined";
import AlertOutlined from "@ant-design/icons/lib/icons/AlertOutlined";
import RobotOutlined from "@ant-design/icons/lib/icons/RobotOutlined";
import DounRingPieChart from "@/components/Chart/DoubRinPie/double_ring_pie";
import SearchForm from "@/pages/Report/components/searchForm";
import ResultListCard from "@/pages/Report/components/resultListCard";

const {TabPane} = Tabs;

const Report = (props) => {
  const {id} = props.match.params;
  const {case_id} = props.location.query;
  const [taskInfo, setTaskInfo] = useState({});
  // ??????????????????
  const [searchEnable, setSearchEnable] = useState(false);
  const [pieData, setPieData] = useState([]);
  const [activeKey, setActiveKey] = useState("exe");
  const [recordData, setRecordData] = useState([]);
  const [failCaseResult, setFailCaseResult] = useState({});
  const [causeSummary, setCauseSummary] = useState([]);
  const [taskLogVisible, setTaskLogVisible] = useState(false);
  const analysisRequest = useRequest(getAnalysisList, {
    manual: true,
    paginated: true,
    debounceInterval: 600,
    defaultParams: [{current: 1, pageSize: 10}],
    onSuccess: (data, params) => {
      const resData = data.MsgInfo ? data.MsgInfo : {};
      setTaskInfo(resData.task_info ? resData.task_info: {});
      setPieData(resData.general_result ? resData.general_result: []);
      setRecordData(resData);
      setFailCaseResult(resData.case_status ? resData.case_status: {});
      if (!searchEnable) {
        setCauseSummary(resData.cause_summary ? resData.cause_summary: []);
      }
    }
  });
  const [searchField, setSearchField] = useState(CaseSearchFields[0].value);
  const [searchDict, setSearchDict] = useState({
    result: [], content: ""
  });
  // const reportRequest = useRequest(
  //   recordDetail,
  //   {
  //     manual: true,
  //     onSuccess: (data, params) => {
  //       setTaskInfo(data.MsgInfo ? data.MsgInfo.task_info : {});
  //       setPieData(data.MsgInfo ? data.MsgInfo.general_result : []);
  //     }
  //   },
  // );

  // useMount(
  //   () => {
  //     if (id) {
  //       // reportRequest.run({task_id: id});
  //       // caseListRequest.run({task_id: id});
  //       analysisRequest.run({task_id: id});
  //
  //     }
  //   }
  // );
  // const caseListRequest = useRequest(
  //   getExeCaseList,
  //   {
  //     manual: true,
  //     paginated: true,
  //     debounceInterval: 600,
  //     defaultParams: [{
  //       current: 1, pageSize: 10,
  //     }],
  //   },
  // );
  useEffect(() => {
    const updateCaseList = () => {
      analysisRequest.run({
        task_id: id,
        group: activeKey,
        search: searchEnable,
        field: searchField,
        ...searchDict
      })
      // caseListRequest.run({
      //   task_id: id,
      //   // group: activeKey,
      //   // search: searchEnable,
      //   field: searchField,
      //   ...searchDict
      // })
    };
    updateCaseList();
  }, [searchDict, activeKey]);
  const onSearchValueChange = (field, value) => {
    const tempDict = searchDict;
    tempDict[field] = value;
    setSearchDict({...searchDict, ...tempDict});
    setSearchEnable(true);
  };
  const tabOnChange =(key)=>{
    // setSearchDict({result: [], content: ""});
    setSearchEnable(false);
    setActiveKey(key)
  };

  return (
    <Fragment>
      <Skeleton loading={false} active={true}>
        <Card
          className={"amt-report-card"}
          title={
            <span style={{margin: "3px"}}>
                    <span style={{
                      display: "inline-block",
                      maxWidth: "33%",
                    }}>
                      <Typography.Paragraph
                        ellipsis={true}
                        title={taskInfo ? taskInfo.task_index : "-"}
                        style={{margin: 0, color: taskInfo && taskInfo.status !== "suspend" ? "#1890ff" : "#f5222d"}}
                      >
                        {taskInfo ? taskInfo.task_index : "-"}
                      </Typography.Paragraph>
                    </span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 'bolder',
                      marginLeft: '8px'
                    }}>
                      <span style={{marginLeft: '9px'}}>
                        ???????????????
                        <span style={{
                          fontSize: '9px',
                          color: taskInfo && taskInfo.status !== "suspend" ? "#1890ff" : "#f5222d"
                        }}>
                          {taskInfo ? taskInfo.status_display : "-"}
                        </span>
                      </span>
                      <span style={{marginLeft: '9px'}}>
                        ???????????????
                        <span style={{fontSize: '9px', color: '#00000066'}}>
                          <Tooltip title={taskInfo ? taskInfo.run_time : "-"}>
                            {taskInfo ? taskInfo.run_time : "-"}
                          </Tooltip>
                        </span>
                      </span>
                      <span style={{marginLeft: '9px'}}>
                        ????????????
                        <span style={{fontSize: '9px', color: '#00000066'}}>
                          {taskInfo ? taskInfo.author : "-"}
                        </span>
                      </span>
                      <span style={{marginLeft: '9px'}}>
                        ???????????????
                        <span style={{fontSize: '9px', color: '#00000066'}}>
                          {taskInfo ? taskInfo.index : "-"}
                        </span>
                      </span>
                    </span>
                  </span>
          }
          extra={
            <div style={{margin: "3px"}}>
              <Space>
                <Tooltip title={`?????????????????????${taskInfo ? taskInfo.progress : 0}`}>
                  <Progress
                    strokeColor={{'0%': '#108ee9', '100%': '#87d068'}}
                    trailColor={"#bfbfbf"}
                    percent={taskInfo ? taskInfo.progress : 0}
                    type="line"
                    size="small"
                    status={taskInfo && taskInfo.status === "suspend" ? "exception" : "active"}
                    style={{width: 140}}
                  />
                </Tooltip>
                <Button.Group>
                  <Button onClick={() => setTaskLogVisible(true)}>????????????</Button>
                  <Dropdown key={"report"} overlay={<Menu>
                    <Menu.Item
                      key="upgrade"
                      icon={<PullRequestOutlined/>}
                      onClick={() => window.open(taskInfo ? taskInfo.upgrade_url : "#")}
                    >
                      ????????????
                    </Menu.Item>
                    <Menu.Item
                      key="excel"
                      icon={<FileExcelOutlined/>}
                      onClick={() => window.open(taskInfo ? taskInfo.excel_report : "#")}
                    >
                      Excel??????
                    </Menu.Item>
                    <Menu.Item
                      key="env"
                      icon={<ClusterOutlined/>}
                      onClick={() => window.open(taskInfo ? taskInfo.evn_use_path : "#")}
                    >
                      ??????????????????
                    </Menu.Item>
                    <Menu.Item
                      key="monitor"
                      icon={<VideoCameraAddOutlined/>}
                      onClick={() => window.open(taskInfo ? taskInfo.monitor_path : "#")}
                    >
                      ????????????
                    </Menu.Item>
                  </Menu>}>
                    <Button>
                      ?????? <DownOutlined/>
                    </Button>
                  </Dropdown>
                  <Dropdown key={"operator"} overlay={
                    <Menu>
                      <Menu.Item
                        key="restart" icon={<ThunderboltOutlined/>}>
                        ????????????
                      </Menu.Item>
                    </Menu>
                  }>
                    <Button>
                      ?????? <DownOutlined/>
                    </Button>
                  </Dropdown>
                </Button.Group>
                <Button type="primary" onClick={() => history.push(`${config.baseUri}/task/execution`)}>????????????</Button>
              </Space>
            </div>
          }
          style={{padding: "12px"}}
          bodyStyle={{padding: "12px"}}
        >
          <Tabs
            activeKey={activeKey}
            // defaultActiveKey="ana"
            type="card" size={"small"}
            tabPosition={"left"}
            onChange={tabOnChange}
            // tabBarStyle={{writingMode: "tb-rl"}}
          >
            <TabPane
              tab={<span><RobotOutlined/>????????????</span>}
              key="exe">
              <Row>
                <Col span={8}>
                  <Space direction={"vertical"}>
                    <Descriptions size="small" column={2} bordered>
                      <Descriptions.Item label="????????????">{taskInfo ? taskInfo.policy : "-"}</Descriptions.Item>
                      <Descriptions.Item label="???????????????">{taskInfo ? taskInfo.set_case_count : "-"}</Descriptions.Item>
                      <Descriptions.Item
                        label="??????????????????">{timeFormat(taskInfo ? taskInfo.public_time_out : "-")}</Descriptions.Item>
                      <Descriptions.Item
                        label="????????????????????????">{timeFormat(taskInfo ? taskInfo.time_out : "-")}</Descriptions.Item>
                      <Descriptions.Item label="??????????????????" span={2}>
                        <Popover
                          content={
                            <div style={{maxHeight: "200px", overflow: "scroll"}}>
                              {
                                taskInfo &&
                                taskInfo.test_bed &&
                                taskInfo.test_bed.length > 0 &&
                                taskInfo.test_bed.map(item => <p key={item}>{item}</p>)
                              }
                            </div>
                          }
                          title={`?????????(???${taskInfo && taskInfo.test_bed ? taskInfo.test_bed.length : 0})`}
                          trigger="hover"
                        >
                          {
                            taskInfo && taskInfo.test_bed && taskInfo.test_bed.slice(0, 2).map(item => <Tag
                              key={item}>{item}</Tag>)
                          }
                          {
                            taskInfo && taskInfo.test_bed && taskInfo.test_bed.length > 2 &&
                            <Tag>+{taskInfo.test_bed.length - 2}..</Tag>
                          }
                        </Popover>
                      </Descriptions.Item>
                      {
                        taskInfo && taskInfo.fail_msg &&
                        <Descriptions.Item label="??????" span={2}>{taskInfo.fail_msg}</Descriptions.Item>
                      }
                    </Descriptions>
                    <Descriptions
                      size="small" column={5} colon={false}
                    >
                      <Descriptions.Item label={
                        taskInfo && taskInfo.tdb_url
                          ? <Tooltip title={"????????????tdb??????"}><a href={taskInfo ? taskInfo.tdb_url : "#"}
                                                            target={'_blank'}>TDB??????</a></Tooltip>
                          : <Tooltip title={"???????????????"}>TDB??????</Tooltip>
                      }/>
                      <Descriptions.Item label={
                        taskInfo && taskInfo.upgrade_url
                          ? <Tooltip title={"????????????????????????"}><a href={taskInfo ? taskInfo.upgrade_url : "#"}
                                                           target={'_blank'}>????????????</a></Tooltip>
                          : <Tooltip title={"?????????????????????"}>????????????</Tooltip>
                      }/>
                      <Descriptions.Item label={
                        taskInfo && taskInfo.evn_use_path
                          ? <Tooltip title={"??????????????????????????????"}><a href={taskInfo ? taskInfo.evn_use_path : "#"}
                                                             target={'_blank'}>??????????????????</a></Tooltip>
                          : <Tooltip title={"???????????????????????????"}>??????????????????</Tooltip>
                      }/>
                      <Descriptions.Item label={
                        taskInfo && taskInfo.monitor_path
                          ? <Tooltip title={"????????????????????????"}><a href={taskInfo ? taskInfo.monitor_path : "#"}
                                                           target={'_blank'}>????????????</a></Tooltip>
                          : <Tooltip title={"?????????????????????"}>????????????</Tooltip>
                      }/>
                      <Descriptions.Item label={
                        taskInfo && taskInfo.ftp_path
                          ? <Tooltip title={"????????????FTP??????"}><a href={taskInfo ? taskInfo.ftp_path : "#"}
                                                            target={'_blank'}>FTP??????</a></Tooltip>
                          : <Tooltip title={"FTP???????????????"}>FTP??????</Tooltip>
                      }/>
                    </Descriptions>
                  </Space>
                </Col>
                <Col span={9} offset={1}>
                  <Tabs
                    defaultActiveKey="1"
                    // centered={true}
                    tabPosition={"left"}
                    style={{height: 180}}
                  >
                    {
                      taskInfo &&
                      taskInfo.sub_content &&
                      Object.keys(taskInfo.sub_content).map((order) => {
                        return (
                          <Tabs.TabPane
                            tab={
                              <img
                                width={"20"}
                                height={"20"}
                                src={`http://10.162.233.190:9000/accounts-prod/img/num_solid/${order}_round_solid.png`}
                              />
                            }
                            key={order}
                          >
                            <Descriptions size="small" column={2} bordered>
                              <Descriptions.Item label="????????????" span={2}>
                                <Popover
                                  content={
                                    <div style={{maxHeight: "200px", overflow: "scroll"}}>
                                      {
                                        taskInfo &&
                                        taskInfo.sub_content &&
                                        taskInfo.sub_content[order].scope.length > 0 &&
                                        taskInfo.sub_content[order].scope.map(item => <p key={item}>{item}</p>)
                                      }
                                    </div>
                                  }
                                  title={`????????????(???${taskInfo.sub_content[order].scope.length})`}
                                  trigger="hover"
                                >
                                  {
                                    taskInfo.sub_content[order].scope.slice(0, 2).map(item => <Tag
                                      key={item}>{item}</Tag>)
                                  }
                                  {
                                    taskInfo.sub_content[order].scope.length > 2 &&
                                    <Tag>+{taskInfo.sub_content[order].scope.length - 2}..</Tag>
                                  }
                                </Popover>
                              </Descriptions.Item>
                              <Descriptions.Item label="???????????????" span={2}>
                                <div className={"amt-rcs"} style={{maxHeight: "120px", overflowY: "scroll"}}>
                                  {
                                    taskInfo.sub_content[order].rcs.map(item => {
                                      return <div key={item}>
                                        <Tag style={{marginBottom: "4px"}} color="#55acee">{item}</Tag><br/>
                                      </div>
                                    })
                                  }
                                </div>
                              </Descriptions.Item>
                            </Descriptions>
                          </Tabs.TabPane>
                        )
                      })
                    }
                  </Tabs>
                </Col>
                <Col span={5} offset={1}>
                  <PieChart
                    data={pieData ? pieData : []}
                    chartTitle={
                      <Tooltip title={"?????????: Pass + Investigated/??????Unavailable?????????????????????"}>
                        <span style={{fontSize: 12}}>????????????</span>
                        <span
                          style={{
                            color: taskInfo ? taskInfo.rate >= 80.0 ? "#1890ff" : "#f5222d" : "#bfbfbf",
                            fontSize: 20
                          }}
                        >
                          {taskInfo ? taskInfo.rate : "-"}
                        </span> %
                      </Tooltip>
                    }
                    title={"????????????"}
                    // title={
                    //   <Tooltip title={"?????????: Pass + Investigated/??????Unavailable?????????????????????"}>
                    //     <span>????????????{taskInfo ? taskInfo.rate : "-"}</span>
                    //   </Tooltip>
                    // }
                    colors={(d) => getStatusColor(d)}
                    tooltip={true}
                    autoTotal={true}
                    height={155}
                    innerRadius={0.65}
                    hasLegend={true}
                  />
                </Col>
              </Row>
              <ResultListCard
                optionKey={activeKey}
                setFromValue={setSearchDict}
                tableInstance={analysisRequest}
                selectCase={case_id}
                cardTitle={"????????????"}
              />
            </TabPane>
            <TabPane
              // forceRender={}
              tab={
                <Tooltip placement="bottomRight" title={`??????${recordData.todo || 0}????????????`}>
                  <span><AlertOutlined/>????????????</span>
                  <Badge overflowCount={99} count={recordData.todo || 0} offset={[10, -20]} style={{position: "absolute"}}/>
                </Tooltip>}
              key="ana"
            >
              <ToDoAnalysis
                dtsData={taskInfo.dts || []}
                snData={taskInfo.sn || []}
                toDoSum={recordData.todo || 0}
                toDoAll={recordData.todo_all || 0}
                summaryData={causeSummary}
                causeData={failCaseResult}
                tableInstance={analysisRequest}
                selectCase={case_id}
                fieldCallback={setSearchDict}
              />
            </TabPane>
          </Tabs>
        </Card>
      </Skeleton>
      <TaskLog
        visible={taskLogVisible}
        taskID={id}
        status={taskInfo ? taskInfo.status : ""}
        onClose={() => {
          setTaskLogVisible(false)
        }}
      />
    </Fragment>
  )
};

export default Report
