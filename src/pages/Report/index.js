import React, {Component, Fragment} from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Modal, Result,
  Row,
  Table,
  Tree
} from "antd";
import {GridContent, PageHeaderWrapper, RouteContext} from '@ant-design/pro-layout';
import config from "../../../src/config/app"
import styles from './index.less';
import Pie from "./components/Pie";
import {connect} from "umi";
import {Loader} from "@/components";
import moment from "moment";
import FolderOutlined from "@ant-design/icons/lib/icons/FolderOutlined";
import FolderOpenOutlined from "@ant-design/icons/lib/icons/FolderOpenOutlined";
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import CheckCircleOutlined from "@ant-design/icons/lib/icons/CheckCircleOutlined";
import ExclamationCircleOutlined from "@ant-design/icons/lib/icons/ExclamationCircleOutlined";
import WarningOutlined from "@ant-design/icons/lib/icons/WarningOutlined";
import IssuesCloseOutlined from "@ant-design/icons/lib/icons/IssuesCloseOutlined";
import ClockCircleOutlined from "@ant-design/icons/lib/icons/ClockCircleOutlined";
import QuestionCircleOutlined from "@ant-design/icons/lib/icons/QuestionCircleOutlined";


const resultColor = {
  pass: "#52c41a",
  failed: "#f5222d",
  investigated: "#fa8c16",
  error: "#f5222d",
  block: "#fa8c16",
  executing: "#1890ff",
  setup: "#1890ff",
  queue_up: "#1890ff",
  waiting: "#1890ff",
};


const timeFormat = (num) => {
  const ss = moment.duration(num, "seconds");
  return ss.hours() + "h " + ss.minutes() + "m " + ss.seconds() + "s";
};

const CaseNodeIcon = {
  pass: <CheckCircleOutlined style={{color: "#52c41a"}}/>,
  failed: <CloseCircleOutlined style={{color: "#f5222d"}}/>,
  investigated: <ExclamationCircleOutlined style={{color: "#fa8c16"}}/>,
  error: <WarningOutlined style={{color: "#f5222d"}}/>,
  block: <IssuesCloseOutlined style={{color: "#fa8c16"}}/>,
  executing: <ClockCircleOutlined style={{color: "#1890ff"}}/>,
  setup: <ClockCircleOutlined style={{color: "#1890ff"}}/>,
  queue_up: <ClockCircleOutlined style={{color: "#1890ff"}}/>,
  waiting: <ClockCircleOutlined style={{color: "#1890ff"}}/>,
};

const TaskNotExists = () => {
  return Modal.error({
    title: '?????? ??????ID??????',
    content: (
      <div>
        <br/>
        <p>??????????????????</p>
        <p style={{textIndent: '2em'}}>
          ?????????????????????????????????????????????
        </p>
        <p style={{textIndent: '2em'}}>?????????????????????????????????????????????????????????????????????????????????</p>
        <br/>
        <div style={{textAlign: 'right'}}>SDC????????????????????</div>
      </div>
    ),
    onOk() {
      window.location.href=`${config.baseUri}/task`;
    },
    width: "500px"
  })
};

class TaskDetail extends Component {
  state = {
    currentSelectCase: {},
  };
  componentDidMount() {
    const { match, dispatch } = this.props;
    const task_id = match ? match.params ? match.params.id ? match.params.id: null: null: null;
    if ( task_id === undefined ) {
      TaskNotExists()
    } else {
      if (dispatch) {
        dispatch({
          type: "task/getTaskDetail",
          payload: {task_id: task_id},
          callback: (res)=>{
            console.log(res)
          }
        })
      }
    }
  }
  renderTreeNode = (data) => {
    return data.map(node_data => {
      // const showTitle = node_data.name.length > 10 ? node_data.name.substring(0, 10) + "..." : node_data.name;
      // const titleCom = node_data.is_leaf ? <span title={node_data.name}>{showTitle}</span> : node_data.name;
      // const canbeTest = node_data.can_run;
      // const canbeCheck = node_data.is_leaf ? canbeTest : true;
      return <Tree.TreeNode
        key={node_data.key} title={node_data.title}
        // disableCheckbox={!canbeCheck}
        isLeaf={node_data.is_leaf}
        dataRef={node_data}
        icon={(props) => {
          if (!props.isLeaf){
            return props.selected || props.expanded ? <FolderOpenOutlined style={{color: resultColor[props.data.key]}} />: <FolderOutlined style={{color: resultColor[props.data.key]}} />;
          } else {
            return  CaseNodeIcon[props.dataRef.result] ? CaseNodeIcon[props.dataRef.result]:<QuestionCircleOutlined style={{color: "#fa8c16"}}/>
          }
        }}
      >
        {node_data.children && this.renderTreeNode(node_data.children)}
      </Tree.TreeNode>
    });
  };
  getTestCaseSummary(data) {
    const columns = [
      {title: '???????????????', dataIndex: 'name', key: 'name', align: "center"},
      {title: '????????????', dataIndex: 'case_num', key: 'case_num', align: "center"},
      {title: '??????????????????', dataIndex: 'receive_time', key: 'receive_time', align: "center"},
    ];
    return (
      <Table pagination={false} bordered size={"small"} dataSource={data} columns={columns}/>
    );
  }
  renderChildrenByTabKey = (tabKey) => {
    if (tabKey === 'projects') {
      return <Descriptions className={styles.headerList} size="small" column={1}>
        <Descriptions.Item label="?????????">????????? s30000367</Descriptions.Item>
        {/*<Descriptions.Item label="????????????">HoloSens SDC 8.0.2.B999???????????????&???????????????</Descriptions.Item>*/}
        <Descriptions.Item label="????????????">2017-07-07 00:00:00 ~ 2017-08-08 15:21:52</Descriptions.Item>
        <Descriptions.Item label="????????????">2017-07-07</Descriptions.Item>
        <Descriptions.Item label="????????????">??????</Descriptions.Item>
        <Descriptions.Item label="TDB??????">
          <a href="">TDB??????</a>
        </Descriptions.Item>
      </Descriptions>;
    }
    if (tabKey === 'applications') {
      return <Descriptions className={styles.headerList} size="small" column={1}>
        <Descriptions.Item label="?????????">????????? s30000367</Descriptions.Item>
        {/*<Descriptions.Item label="????????????">HoloSens SDC 8.0.2.B999???????????????&???????????????</Descriptions.Item>*/}
        <Descriptions.Item label="????????????">2017-07-07 00:00:00 ~ 2017-08-08 15:21:52</Descriptions.Item>
        <Descriptions.Item label="????????????">2017-07-07</Descriptions.Item>
        <Descriptions.Item label="????????????">??????</Descriptions.Item>
        <Descriptions.Item label="TDB??????">
          <a href="">TDB??????</a>
        </Descriptions.Item>
      </Descriptions>;
    }
    if (tabKey === 'articles') {
      return <Descriptions className={styles.headerList} size="small" column={1}>
        <Descriptions.Item label="?????????">????????? s30000367</Descriptions.Item>
        {/*<Descriptions.Item label="????????????">HoloSens SDC 8.0.2.B999???????????????&???????????????</Descriptions.Item>*/}
        <Descriptions.Item label="????????????">2017-07-07 00:00:00 ~ 2017-08-08 15:21:52</Descriptions.Item>
        <Descriptions.Item label="????????????">2017-07-07</Descriptions.Item>
        <Descriptions.Item label="????????????">??????</Descriptions.Item>
        <Descriptions.Item label="TDB??????">
          <a href="">TDB??????</a>
        </Descriptions.Item>
      </Descriptions>;
    }
    return null;
  };
  selectCase = (key, e)=>{
    if (e.node.isLeaf && !e.node.selected){
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: "task/getCaseDetail",
          payload: {case_id: key},
          callback: (res)=>{
            this.setState({currentSelectCase: res})
          }
        })
      }
    }
  };
  render() {
    // const salesPieData = [
    //   {"x": "Fail", "y": 0},
    //   {"x": "Pass", "y": 1},
    //   {"x": "Block", "y": 0},
    //   {"x": "Error", "y": 4},
    //   {"x": "Investigated", "y": 0},
    //   {"x": "Unknown", "y": 0}
    // ];
    const {executeResult, taskInfo, CaseResultList, detailLoading} = this.props;
    const {currentSelectCase} = this.state;

    const description = (
      <Descriptions className={styles.headerList} size="small" column={3}>
        <Descriptions.Item label="?????????">{taskInfo.author}</Descriptions.Item>
        {/*<Descriptions.Item label="????????????">HoloSens SDC 8.0.2.B999???????????????&???????????????</Descriptions.Item>*/}
        <Descriptions.Item label="????????????">{taskInfo.run_time}</Descriptions.Item>
        <Descriptions.Item label="????????????">{taskInfo.policy}</Descriptions.Item>
        <Descriptions.Item label="??????????????????">{timeFormat(taskInfo.public_time_out)}</Descriptions.Item>
        <Descriptions.Item label="????????????????????????">{timeFormat(taskInfo.time_out)}</Descriptions.Item>
        <Descriptions.Item label="??????">{taskInfo.status_display}</Descriptions.Item>
        <Descriptions.Item label="TDB??????">
          <a href={taskInfo.tdb_url} target={'_blank'}>TDB??????</a>
        </Descriptions.Item>
        <Descriptions.Item label="????????????">
          <a href={taskInfo.ftp_path} target={'_blank'}>FTP????????????</a>
        </Descriptions.Item>
        {taskInfo.fail_msg && <Descriptions.Item label="??????">{taskInfo.fail_msg}</Descriptions.Item>}
      </Descriptions>
    );
    const extra = (
      <div className={styles.moreInfo}>
        <Pie
          hasLegend
          subTitle={"????????????"}
          total={(data) => {
            return data.reduce((pre, now) => now.y + pre, 0)
          }}
          data={executeResult}
          height={120}
          lineWidth={1}
        />
      </div>
    );
    const action = (
      <Fragment>
        <Button.Group>
          <Button>????????????</Button>
          <Button>?????????</Button>
          <Button>?????????</Button>
        </Button.Group>
        <Button type="primary">????????????</Button>
      </Fragment>
    );
    return (<>
        {detailLoading ? <Loader loadTxt="?????????????????????" spinning={true} fullScreen={false}/> :
          <PageHeaderWrapper
            title={taskInfo.task_index}
            extra={action}
            className={styles.pageHeader}
            content={description}
            extraContent={extra}
          >
            <div className={styles.main}>
              <GridContent>
                <Row gutter={24}>
                  <Col lg={7} md={24}>
                    <Card
                      bordered
                      title={'????????????'}
                      bodyStyle={{maxHeight: "calc(100vh - 400px)", overflow: "scroll", whiteSpace: "nowrap", minHeight: "350px"}}
                    >
                        <Tree
                          onCheck={this.onCheck}
                          onSelect={this.selectCase}
                          showIcon
                          autoExpandParent
                          defaultExpandAll={true}
                        >
                          {this.renderTreeNode(CaseResultList)}
                        </Tree>
                    </Card>
                  </Col>
                  <Col lg={17} md={24}>
                    <Card title={"??????????????????"} style={{marginBottom: "8px"}}>
                      {!currentSelectCase.name ? <Result title="?????????????????????????????????"/> :
                        <Descriptions className={styles.headerList} size="small" column={1} bordered>
                          <Descriptions.Item label="????????????">
                            <span style={{overflowWrap: "break-word", display: "inline-block", width: "95%"}}>
                              {currentSelectCase.name}
                            </span>
                          </Descriptions.Item>
                          {/*<Descriptions.Item label="??????????????????">*/}
                          {/*  <span style={{overflowWrap: "break-word", display: "inline-block", width: "95%"}}>*/}
                          {/*    {currentSelectCase.case_script_path}*/}
                          {/*  </span>*/}
                          {/*</Descriptions.Item>*/}
                          <Descriptions.Item label="??????????????????">{CaseNodeIcon[currentSelectCase.result]} {currentSelectCase.result_display}</Descriptions.Item>
                          <Descriptions.Item label="????????????(?????????)">
                            {/*{taskInfo.ftp_path}/{currentSelectCase.main_ip}*/}
                            <a href={currentSelectCase.download_path} target={'_blank'}>
                              {currentSelectCase.tcid}
                            </a>
                          </Descriptions.Item>
                          <Descriptions.Item label="????????????">{currentSelectCase.run_time}({currentSelectCase.cost_time}s)</Descriptions.Item>
                          <Descriptions.Item label="????????????(??????/??????)">{currentSelectCase.situation}</Descriptions.Item>
                          <Descriptions.Item label="???????????????">
                            <span style={{overflowWrap: "break-word", display: "inline-block", width: "95%"}}>
                              {currentSelectCase.test_feature}
                            </span>
                          </Descriptions.Item>
                          <Descriptions.Item label="?????????">{currentSelectCase.test_bed}</Descriptions.Item>
                          <Descriptions.Item label="??????ID">{currentSelectCase.test_env_id}</Descriptions.Item>
                          <Descriptions.Item label="???????????????IP">{currentSelectCase.main_ip}</Descriptions.Item>
                          {/*<Descriptions.Item label="????????????">{taskInfo.ftp_path}/{currentSelectCase.main_ip}</Descriptions.Item>*/}
                          {currentSelectCase.fail_msg &&
                            <Descriptions.Item label="????????????">
                            <span style={{overflowWrap: "break-word", display: "inline-block", width: "95%"}}>
                              {currentSelectCase.fail_msg}
                            </span>
                            </Descriptions.Item>
                          }
                        </Descriptions>
                      }
                    </Card>
                      {/*<Card*/}
                      {/*  // className={styles.tabsCard}*/}
                      {/*  bordered={false}*/}
                      {/*  tabList={operationTabList}*/}
                      {/*  activeTabKey={"articles"}*/}
                      {/*  // onTabChange={this.onTabChange}*/}
                      {/*>*/}
                      {/*  {this.renderChildrenByTabKey("articles")}*/}
                      {/*</Card>*/}
                  </Col>
                </Row>
              </GridContent>
            </div>
          </PageHeaderWrapper>
        }
    </>
    )
  }
}

export default connect((state) => {
  const {task} = state;
  return {
    detailLoading: task.taskDetailInfo.loadingData,
    taskInfo: task.taskDetailInfo.taskInfo,
    executeResult: task.taskDetailInfo.executeResult,
    CaseResultList: task.taskDetailInfo.CaseResultList,
  }
})(TaskDetail);

// export default TaskDetail
