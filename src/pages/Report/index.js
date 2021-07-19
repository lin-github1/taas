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
    title: '提示 任务ID异常',
    content: (
      <div>
        <br/>
        <p>尊敬的用户：</p>
        <p style={{textIndent: '2em'}}>
          查看的任务不存在，请联系管理员
        </p>
        <p style={{textIndent: '2em'}}>您点击“知道了”按钮后，系统将会自动跳转到任务列表页面</p>
        <br/>
        <div style={{textAlign: 'right'}}>SDC工具·前端中心</div>
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
      {title: '用例集名称', dataIndex: 'name', key: 'name', align: "center"},
      {title: '用例总数', dataIndex: 'case_num', key: 'case_num', align: "center"},
      {title: '开始执行时间', dataIndex: 'receive_time', key: 'receive_time', align: "center"},
    ];
    return (
      <Table pagination={false} bordered size={"small"} dataSource={data} columns={columns}/>
    );
  }
  renderChildrenByTabKey = (tabKey) => {
    if (tabKey === 'projects') {
      return <Descriptions className={styles.headerList} size="small" column={1}>
        <Descriptions.Item label="发起人">曲丽丽 s30000367</Descriptions.Item>
        {/*<Descriptions.Item label="执行目录">HoloSens SDC 8.0.2.B999（用例维护&开发在这）</Descriptions.Item>*/}
        <Descriptions.Item label="执行时间">2017-07-07 00:00:00 ~ 2017-08-08 15:21:52</Descriptions.Item>
        <Descriptions.Item label="创建时间">2017-07-07</Descriptions.Item>
        <Descriptions.Item label="当前状态">完成</Descriptions.Item>
        <Descriptions.Item label="TDB地址">
          <a href="">TDB地址</a>
        </Descriptions.Item>
      </Descriptions>;
    }
    if (tabKey === 'applications') {
      return <Descriptions className={styles.headerList} size="small" column={1}>
        <Descriptions.Item label="发起人">曲丽丽 s30000367</Descriptions.Item>
        {/*<Descriptions.Item label="执行目录">HoloSens SDC 8.0.2.B999（用例维护&开发在这）</Descriptions.Item>*/}
        <Descriptions.Item label="执行时间">2017-07-07 00:00:00 ~ 2017-08-08 15:21:52</Descriptions.Item>
        <Descriptions.Item label="创建时间">2017-07-07</Descriptions.Item>
        <Descriptions.Item label="当前状态">完成</Descriptions.Item>
        <Descriptions.Item label="TDB地址">
          <a href="">TDB地址</a>
        </Descriptions.Item>
      </Descriptions>;
    }
    if (tabKey === 'articles') {
      return <Descriptions className={styles.headerList} size="small" column={1}>
        <Descriptions.Item label="发起人">曲丽丽 s30000367</Descriptions.Item>
        {/*<Descriptions.Item label="执行目录">HoloSens SDC 8.0.2.B999（用例维护&开发在这）</Descriptions.Item>*/}
        <Descriptions.Item label="执行时间">2017-07-07 00:00:00 ~ 2017-08-08 15:21:52</Descriptions.Item>
        <Descriptions.Item label="创建时间">2017-07-07</Descriptions.Item>
        <Descriptions.Item label="当前状态">完成</Descriptions.Item>
        <Descriptions.Item label="TDB地址">
          <a href="">TDB地址</a>
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
        <Descriptions.Item label="发起人">{taskInfo.author}</Descriptions.Item>
        {/*<Descriptions.Item label="执行目录">HoloSens SDC 8.0.2.B999（用例维护&开发在这）</Descriptions.Item>*/}
        <Descriptions.Item label="执行时间">{taskInfo.run_time}</Descriptions.Item>
        <Descriptions.Item label="执行多态">{taskInfo.policy}</Descriptions.Item>
        <Descriptions.Item label="任务超时时间">{timeFormat(taskInfo.public_time_out)}</Descriptions.Item>
        <Descriptions.Item label="用例执行超时时间">{timeFormat(taskInfo.time_out)}</Descriptions.Item>
        <Descriptions.Item label="状态">{taskInfo.status_display}</Descriptions.Item>
        <Descriptions.Item label="TDB地址">
          <a href={taskInfo.tdb_url} target={'_blank'}>TDB地址</a>
        </Descriptions.Item>
        <Descriptions.Item label="日志地址">
          <a href={taskInfo.ftp_path} target={'_blank'}>FTP日志地址</a>
        </Descriptions.Item>
        {taskInfo.fail_msg && <Descriptions.Item label="备注">{taskInfo.fail_msg}</Descriptions.Item>}
      </Descriptions>
    );
    const extra = (
      <div className={styles.moreInfo}>
        <Pie
          hasLegend
          subTitle={"执行结果"}
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
          <Button>任务日志</Button>
          <Button>操作二</Button>
          <Button>操作二</Button>
        </Button.Group>
        <Button type="primary">返回列表</Button>
      </Fragment>
    );
    return (<>
        {detailLoading ? <Loader loadTxt="任务数据加载中" spinning={true} fullScreen={false}/> :
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
                      title={'用例结果'}
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
                    <Card title={"用例执行详情"} style={{marginBottom: "8px"}}>
                      {!currentSelectCase.name ? <Result title="请选中左侧用例查看详情"/> :
                        <Descriptions className={styles.headerList} size="small" column={1} bordered>
                          <Descriptions.Item label="用例名称">
                            <span style={{overflowWrap: "break-word", display: "inline-block", width: "95%"}}>
                              {currentSelectCase.name}
                            </span>
                          </Descriptions.Item>
                          {/*<Descriptions.Item label="用例所在脚本">*/}
                          {/*  <span style={{overflowWrap: "break-word", display: "inline-block", width: "95%"}}>*/}
                          {/*    {currentSelectCase.case_script_path}*/}
                          {/*  </span>*/}
                          {/*</Descriptions.Item>*/}
                          <Descriptions.Item label="用例执行结果">{CaseNodeIcon[currentSelectCase.result]} {currentSelectCase.result_display}</Descriptions.Item>
                          <Descriptions.Item label="用例编号(执行态)">
                            {/*{taskInfo.ftp_path}/{currentSelectCase.main_ip}*/}
                            <a href={currentSelectCase.download_path} target={'_blank'}>
                              {currentSelectCase.tcid}
                            </a>
                          </Descriptions.Item>
                          <Descriptions.Item label="执行时间">{currentSelectCase.run_time}({currentSelectCase.cost_time}s)</Descriptions.Item>
                          <Descriptions.Item label="执行历史(成功/总数)">{currentSelectCase.situation}</Descriptions.Item>
                          <Descriptions.Item label="测试的功能">
                            <span style={{overflowWrap: "break-word", display: "inline-block", width: "95%"}}>
                              {currentSelectCase.test_feature}
                            </span>
                          </Descriptions.Item>
                          <Descriptions.Item label="测试床">{currentSelectCase.test_bed}</Descriptions.Item>
                          <Descriptions.Item label="环境ID">{currentSelectCase.test_env_id}</Descriptions.Item>
                          <Descriptions.Item label="环境使用的IP">{currentSelectCase.main_ip}</Descriptions.Item>
                          {/*<Descriptions.Item label="日志地址">{taskInfo.ftp_path}/{currentSelectCase.main_ip}</Descriptions.Item>*/}
                          {currentSelectCase.fail_msg &&
                            <Descriptions.Item label="失败信息">
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
