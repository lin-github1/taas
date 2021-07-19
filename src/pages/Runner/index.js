import React, {useState} from 'react';
import {useLocalStorageState, useMount, useRequest} from '@umijs/hooks';
import {Card, Col, Row, Spin, Statistic, Button, Tooltip, notification} from "antd";
import CaseSelectTree from "./components/CaseTree"
import CaseDetail from  "./components/CaseDetail"
import {getTreeNodeDetail, getSelectCaseNum, refreshCase} from "@/services/case";
import SyncOutlined from "@ant-design/icons/lib/icons/SyncOutlined";
import FileSearchOutlined from "@ant-design/icons/lib/icons/FileSearchOutlined";

const Runner = (props) =>{
  const [caseCount, setCaseCount] = useState({total:0, auto: 0});
  const [selectedData, setSelectedData] = useState({});
  const [checkedData, setCheckedData] = useState([]);
  const selectNodeRequest = useRequest(getTreeNodeDetail, {
    manual: true,
    onSuccess: (data, params) =>{
      setSelectedData(data.MsgInfo)
    }
  });
  const caseNumRequest = useRequest(getSelectCaseNum, {
    manual: true,
    onSuccess: (data, params) =>{
      setCaseCount({
        total: data.MsgInfo.total, auto: data.MsgInfo.auto
      })
    }
  });
  const refreshRequest = useRequest(refreshCase, {
    manual: true,
    onSuccess: ()=>{
      notification.success({
        message: "数据发送成功",
        description: "后台数据更新中，请稍后刷新查看",
      })
    }
  });
  const onCheck = (selectedKeys) => {
    setCheckedData(selectedKeys);
    caseNumRequest.run({key: selectedKeys})
  };
  const onRefresh = () => {
    console.log("sdfsdf")
    if (caseCount.total > 300) {
      notification.warning({
        message: "无法更新",
        description: "选中用例数过多（> 300）,暂不支持, 请重新选择用例",
      });
    } else if (caseCount.total === 300 || checkedData.length === 0) {
      notification.warning({
        message: "无法更新",
        description: "请选择用例后重试",
      });
    } else {
      refreshRequest.run({key: checkedData})
    }
  };
  return (
    <div style={{margin: "24px 24px 0"}}>
      <Row>
        <Col span={6}>
          <Card
            bodyStyle={{maxHeight: "calc(100vh - 200px)", overflow: "scroll", height:"calc(100vh - 200px)"}}
            title={
              <Statistic
                precision={0}
                // prefix={"已选用例数:"}
                title="已选用例数(自动化用例/总数)"
                value={caseNumRequest.loading?'数据计算中':caseCount.auto}
                suffix={caseNumRequest.loading?<Spin size="small" />:`/ ${caseCount.total}`}
                valueStyle={{
                  color: '#ff4d4f', fontSize: caseNumRequest.loading? "16px": "24px",
                  lineHeight: "24px"
                }}
              />
            }
            extra={
              <Button.Group>
                {/*<Button icon={<ExpandAltOutlined/>}/>*/}
                {/*<Button icon={<CaretRightOutlined/>}/>*/}
                <Tooltip title={"选择用例跟新"}><Button icon={<SyncOutlined/>} onClick={()=>{onRefresh()}}/></Tooltip>
                {/*<Button icon={<FileSearchOutlined/>}/>*/}
              </Button.Group>
            }
          >
            <CaseSelectTree
              user={props.user}
              detailRequest={selectNodeRequest}
              checkCallback={onCheck}
            />
          </Card>
        </Col>
        <Col span={18}>
          <Card
            bodyStyle={{maxHeight: "calc(100vh - 170px)", overflow: "scroll"}}
            title={"用例详情"}
          >
            <CaseDetail
              nodeSelected={selectedData}
              checkedNodes={checkedData}
              runCaseInfo={caseCount}
              user={props.user}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
};

export default Runner
