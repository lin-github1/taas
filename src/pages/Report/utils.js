import moment from "moment";
import {Tag} from "antd";
import React from "react";

export const timeFormat = (num) => {
  const ss = moment.duration(num, "seconds");
  return ss.hours() + "h " + ss.minutes() + "m " + ss.seconds() + "s";
};

export const getStatusColor = (status) => {
  status = status.toLowerCase();
  if (status === "pass") {
    return "#52c41a"
  } else if (status === "failed") {
    return "#f5222d"
  } else if (status === "investigated") {
    return "#1890ff"
  } else if (status === "unavailable") {
    return "#d9d9d9"
  } else if (status === "error") {
    return "#eb2f96"
  } else if (status === "block") {
    return "#faad14"
  } else if (status === "unknown") {
    return "#434343"
  } else {
    return 'blue';
  }
};

export function tagRender(props) {
  const {label, value, closable, onClose} = props;

  return (
    <Tag color={getStatusColor(value)} closable={closable} onClose={onClose} style={{marginRight: 3}}>
      {label}
    </Tag>
  );
}

export const CaseStatus = {
  exe: [
    {value: "pass", label: "Pass"},
    {value: "failed", label: "Failed"},
    {value: "investigated", label: "Investigated"},
    {value: "error", label: "Error"},
    {value: "block", label: "Block"},
    {value: "unavailable", label: "Unavailable"},
    {value: "unknown", label: "Unknown"},
  ],
  ana: [
    {value: "failed", label: "Failed"},
    {value: "error", label: "Error"},
    {value: "block", label: "Block"},
    {value: "unavailable", label: "Unavailable"},
  ]
};

export const CaseSearchFields = [
  {value: "name", label: "用例名称"},
  {value: "tcid", label: "用例编号"},
  {value: "evn_id", label: "环境ID"},
  {value: "agent", label: "执行机IP"},
  {value: "feature", label: "特性"},
  {value: "mode", label: "款型"},
  {value: "cause", label: "问题归类"},
  // {value: "ai_result", label: "智能分析结果"},
];
