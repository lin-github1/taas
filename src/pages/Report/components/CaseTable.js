import React, {useState} from "react";
import {history} from "umi";
import {Button, Descriptions, Pagination, Popover, Space, Table, Tag, Tooltip} from "antd";
import FundOutlined from "@ant-design/icons/lib/icons/FundOutlined";
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import {getStatusColor, timeFormat} from "../utils"
import CaseDetail from './CaseDetail'
import ReadOutlined from "@ant-design/icons/lib/icons/ReadOutlined";


const CaseResultTable = (props) => {

  const {selectCaseID, dataRequest} = props;
  const [caseID, setCaseID] = useState(selectCaseID);
  const [visibleDetail, setVisibleDetail] = useState(!!caseID);

  const columns = [
    {
      title: '用例名称', dataIndex: 'name', ellipsis: {showTitle: false},
      render: (name, record) => (
        <Tooltip placement="topLeft" title={name}>
          <a onClick={() => {
            setCaseID(record.key);
            setVisibleDetail(true);
            history.push(`?case_id=${record.key}`)
          }}>{name}</a>
        </Tooltip>
      ),
    },
    {title: '用例编号', dataIndex: 'tcid', ellipsis: true},
    {
      title: '执行结果', dataIndex: 'result', width: 100, render: (text, record, index) => {
        return (<Tag color={getStatusColor(record.result)}>{record.result_display}</Tag>)
      }
    },
    {
      title: '用例耗时', dataIndex: 'cost_time', width: 100, render: (text, record) => {
        return (
          <Tooltip title={record.run_time} className={"amt-report-table-tooltip"}>
            <span>{timeFormat(text)}</span>
          </Tooltip>
        )
      }
    },
    // {title: '用例执行时间', dataIndex: 'run_time'},
    // 分析结果
    // {title: '分析结果', dataIndex: 'ai_result'},
    {title: '问题归类', width: 200, ellipsis: true, dataIndex: 'cause', render: (text, record) => {
        return [record.major_cause || "", record.minor_cause || ""].join("-")
      }},
    // 执行环境
    {
      title: '测试环境', dataIndex: 'test_bed', width: 200, ellipsis: true, render: (text, record) => {
        return (
          record.env_info.model ?
            <Popover title={"环境信息"} content={
              <Descriptions size="small" column={1} bordered>
                <Descriptions.Item label="测试床">{record.env_info.test_bed}</Descriptions.Item>
                <Descriptions.Item label="环境ID">{record.env_info.test_env_id}</Descriptions.Item>
                <Descriptions.Item label="环境IP">{record.env_info.main_ip}</Descriptions.Item>
                <Descriptions.Item label="主节点款型">{record.env_info.model}</Descriptions.Item>
                <Descriptions.Item label="主节点版本">{record.env_info.version}</Descriptions.Item>
                <Descriptions.Item label="主节点版本时间">{record.env_info.version_time}</Descriptions.Item>
                {/*<Descriptions.Item label="主节点芯片">{record.env_info.test_bed}</Descriptions.Item>*/}
              </Descriptions>
            }>
              <span>{record.env_info.model || "-"}</span>
            </Popover> : "-"
        )
      }
    },
    // {title: '测试环境', dataIndex: 'env.info'},
    // 执行机信息
    {title: '测试机', width: 200, ellipsis: true, dataIndex: 'agent'},

    {title: '特性', width: 200, ellipsis: true, dataIndex: 'test_feature'},
    {
      title: '操作', width: 100, render: (text, record) => {
        return (
          <Space>
            <Tooltip title={"查看用例详情"}>
            <Button type={"link"} size={"small"} onClick={() => {
              setCaseID(record.key);
              setVisibleDetail(true);
              history.push(`?case_id=${record.key}`)
            }} icon={<FundOutlined/>}/>
            </Tooltip>
            <Tooltip title={record.tras_url ? "日志采集结果" : "该用例没有进行采集或者采集失败"}>
              <Button
                href={record.tras_url}
                target={'_blank'}
                type={"link"}
                size={"small"}
                icon={<ReadOutlined/>}/>
            </Tooltip>
          </Space>
        )
      }
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        size={"small"}
        dataSource={dataRequest.data ? dataRequest.data.MsgInfo.items : []}
        bordered
        loading={dataRequest.loading}
        pagination={false}
        style={{marginBottom: '20px'}}
      />
      <Pagination
        {...dataRequest.pagination}
        onChange={dataRequest.pagination.changeCurrent}
        showQuickJumper
        showTotal={
          total => <span>总计 {total} 条目 <Button icon={<ReloadOutlined/>}
                                               onClick={dataRequest.refresh}>刷新</Button></span>}
        style={{textAlign: 'center'}}
        total={dataRequest.data ? dataRequest.data.MsgInfo.total : 0}
      />
      <CaseDetail
        // data={caseData}
        visible={visibleDetail}
        caseID={caseID}
        onClose={setVisibleDetail}
      />
    </>
  )
};

export default CaseResultTable
