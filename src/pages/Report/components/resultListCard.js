import SearchForm from "@/pages/Report/components/searchForm";
import {Card, Skeleton} from "antd";
import CaseResultTable from "@/pages/Report/components/CaseTable";
import React from "react";


const ResultListCard = (props)=> {
  const {
    optionKey, setFromValue, tableInstance, selectCase,
    cardTitle="分析结果"
  } = props;
  return (
    <Card
      title={cardTitle}
      className={"amt-report-table"}
      extra={<SearchForm optionKey={optionKey} setFromValue={setFromValue}/>}
    >
      <Skeleton loading={tableInstance.loading} active={true}>
        <CaseResultTable
          dataRequest={tableInstance}
          selectCaseID={selectCase}
        />
      </Skeleton>
    </Card>
  )
};
export default ResultListCard
