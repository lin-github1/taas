import React, {Component, useState} from "react";
import {Collapse, Descriptions, Modal, Spin, Tooltip} from "antd";
import {connect} from "umi";
import GlobalVariableForm from "@/pages/Runner/components/GlobalVariableForm";
import TestBed from "@/pages/Runner/components/TestBed";
import InfoCircleOutlined from "@ant-design/icons/lib/icons/InfoCircleOutlined";
import {useMount, useRequest} from "@umijs/hooks";
import {getNextRunTime} from "@/services/status";

const {Panel} = Collapse;

const polymorphicDisplay = {
  0: "不配置",
  1: "按多态分类执行",
  2: "按所有支持款型任选一款执行一次",
  3: "按所有支持款型每个款型执行一次",
};
const envDisplay = {
  "by_bed": "按测试床",
  "by_env": "按环境",
};


const StartRunConfirm = (props)=>{
  const {
    currentCaseData, fromData={}
  } = props;
  const [nextRunTime, setNextRunTime] = useState();
  const nextTimeRequest = useRequest(getNextRunTime, {
    manual: true,
    onSuccess: (data, params) => {
      setNextRunTime(data.MsgInfo.next || data.MsgInfo.msg)
    }
  });
  useMount(()=>{
    if (fromData.cron) {
      nextTimeRequest.run({cron: [
        fromData.second, fromData.minute, fromData.hour,
          fromData.day, fromData.month,
          fromData.day_of_week, fromData.year
        ].join(" ")})
    }
  });
  return(
    <Collapse defaultActiveKey={['1']}>
        <Panel header="基本信息" key="1">
          <Descriptions size={"small"} bordered column={2}>
            <Descriptions.Item key={"已选用例总数"} label={"已选用例总数"} span={1}>
              {currentCaseData.Summary.total}
            </Descriptions.Item>
            <Descriptions.Item key={"可执行用例数"} label={"可执行用例数"} span={1}>
              <span style={{color: "#ff4d4f"}}>{currentCaseData.Summary.auto}</span>
            </Descriptions.Item>
            <Descriptions.Item key={"执行时间"} label={"执行时间"} span={2}>
                {fromData.cron
                  ? !nextRunTime
                    ?
                    <Spin size={"small"}>计算中</Spin>
                    :
                    <span style={{color: "#40a9ff"}}>{nextRunTime}</span>
                  :<span style={{color: "#40a9ff"}}>立即执行</span>
                }
            </Descriptions.Item>
          </Descriptions>
        </Panel>
        <Panel header="执行参数" key="2">
          <Descriptions size={"small"} bordered column={2}>
            <Descriptions.Item key="polymorphic" label="多态配置" span={2}>
              [{fromData.polymorphic}]{polymorphicDisplay[fromData.polymorphic]}
            </Descriptions.Item>
            <Descriptions.Item key="timeout" label="任务超时(h)" span={1}>
              {fromData.public_timeout}h
            </Descriptions.Item>
            <Descriptions.Item key="timeout" label="超时时间(s)" span={1}>
              {fromData.case_timeout}s
            </Descriptions.Item>
            <Descriptions.Item key="timeout" label="脚本版本号" span={1}>
              {fromData.script_no}
            </Descriptions.Item>
            <Descriptions.Item key="timeout" label="测试后产品日志异常扫描（TRAS）" span={1}>
              {fromData.tras?"True":"False"}
            </Descriptions.Item>
            <Descriptions.Item key="version" label="测试版本" span={2}>
              {
                fromData.version_define
                  ?
                  <>
                    <span title={fromData.version}>{fromData.version}</span><br/>
                    <span title={fromData.version_time}>{fromData.version_time}</span><br/>
                  </>
                  :
                  <div style={{maxHeight: "100px", overflow: "scroll"}}>
                    {fromData.version_list.map(item => <><span title={item}>{item}</span><br/></>)}
                  </div>
              }
            </Descriptions.Item>
          </Descriptions>
        </Panel>
        <Panel header="测试环境" key="3">
          {
            <Descriptions size={"small"} bordered column={1}>
              <Descriptions.Item key="env_type" label="环境类型">{envDisplay[fromData.topo]}</Descriptions.Item>
              {fromData.topo === "by_env" && <Descriptions.Item key="amount" label="环境数量">
                <><span style={{color: "#40a9ff"}}>共选择环境{fromData.env[0].list.length}套:</span><br/></>
                <div style={{maxHeight: "100px", overflow: "scroll"}}>
                  {fromData.env[0].list.map(item => <div key={item.env_id}>
                      <span title={item.env_id}>{item.env_id}[{item.main_type}]</span><br/>
                    </div>
                  )}
                </div>
              </Descriptions.Item>}
              {fromData.topo === "by_bed" && <Descriptions.Item key="amount" label="测试床信息">
                <><span style={{color: "#40a9ff"}}>共选择{fromData.env.length}个床:</span><br/></>
                <div style={{maxHeight: "100px", overflow: "scroll"}}>
                  {fromData.env.map(item => <div key={item.key}>
                      <span title={item.testbedName}>{item.testbedName}</span>&nbsp;&nbsp;
                    {item.combo? <span>按<span style={{color: "#40a9ff"}}>&nbsp;{item.combo}&nbsp;</span>构建</span>:"不进行构建"}<br/>
                    </div>
                  )}
                </div>
              </Descriptions.Item>}
            </Descriptions>
          }
        </Panel>
      </Collapse>
  )
};
export default StartRunConfirm
