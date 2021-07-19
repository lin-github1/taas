import React, {Fragment} from "react";
import {Card, Col, Input, Row, Select, Skeleton, Space, Tag, Tooltip} from "antd";
import {tagRender, CaseStatus, CaseSearchFields} from "../utils"
import CaseResultTable from "@/pages/Report/components/CaseTable";
import DounRingPieChart from "@/components/Chart/DoubRinPie/double_ring_pie";
import BarChart from "@/components/Chart/bar"
import {getStatusColor} from "@/pages/Report/utils";
import SearchForm from "@/pages/Report/components/searchForm";
import ResultListCard from "@/pages/Report/components/resultListCard";


const ToDoAnalysis = (props) => {
  const {
    summaryData, tableInstance, causeData,
    toDoSum=0, toDoAll=0,
    dtsData=[], snData=[],
    selectCase, fieldCallback,
    loading=false
  } = props;
  return (
    <Fragment>
      <Skeleton loading={loading} active={true}>
        <Card>
          <Row>
            <Col span={2}>
              <Card bordered={false}
                    title={`提交的DTS单 (${dtsData.length})`} size={"small"}
                    bodyStyle={{maxHeight: "150px", overflowY: "scroll", padding: "0 0 0 6px"}}
                    headStyle={{borderBottom: "0px solid #f0f0f0"}}
              >
                <Space value={0} direction="vertical">
                  {dtsData.length>0 && dtsData.map((item, index)=>
                    <a
                      href={`https://dts.huawei.com/net/dts/DTS/DTSWorkFlowPage.aspx?No=${item.toUpperCase()}`}
                      style={{marginBottom: "2px"}}
                      target={"_blank"}
                      key={item}
                    >{item.toUpperCase()}</a>
                  )}
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <DounRingPieChart
                data={summaryData}
                chartTitle={
                  <Tooltip title={"未分析的数量/失败用例数"}>
                    <span style={{fontSize: 12}}>问题单分类统计：</span>
                    <span style={{color: toDoSum > 0 ? "#f5222d": "#262626", fontSize: 20}}> {toDoSum}</span> /
                    <span style={{color: "#262626", fontSize: 12}}> {toDoAll}</span>个
                  </Tooltip>
                }
                tooltip={true}
                autoTotal={true}
                height={155}
                innerRadius={0.5}
                hasLegend={true}
              />
            </Col>
            <Col span={10} offset={2}>
              <BarChart
                data={causeData}
                title={"用例状态分布"}
                titlePosition={"center"}
                colors={(d) => getStatusColor(d)}
                height={155}
              />
            </Col>
          </Row>
          <br/>
          <ResultListCard
            optionKey={"ana"}
            setFromValue={fieldCallback}
            tableInstance={tableInstance}
            selectCase={selectCase}
            cardTitle={"分析结果"}
          />
          {/*<Card*/}
          {/*  title={"分析结果"}*/}
          {/*  className={"amt-report-table"}*/}
          {/*  extra={<SearchForm optionKey={"ana"} setFromValue={contentCallback}/>}*/}
          {/*>*/}
          {/*  <Skeleton loading={tableInstance.loading} active={true}>*/}
          {/*    <CaseResultTable*/}
          {/*      dataRequest={tableInstance}*/}
          {/*      selectCaseID={selectCase}*/}
          {/*    />*/}
          {/*  </Skeleton>*/}
          {/*</Card>*/}
        </Card>
      </Skeleton>
    </Fragment>
  )
};

export default ToDoAnalysis
