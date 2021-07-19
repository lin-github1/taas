import React, {Fragment, useState} from 'react';
import {useMount, useRequest, useUpdateEffect} from '@umijs/hooks';
import {
  Drawer
} from "antd";
import {getRecordLogStr} from "@/services/record"


const TaskLog = (props)=> {
  const {visible, status, taskID, onClose} = props;
  const [taskStatus, setTaskStatus] = useState(status);
  const [logData, setLogData] = useState("");
  const { data, loading, run, cancel } = useRequest(getRecordLogStr, {
    // manual: true,
    pollingInterval: 5000,
    pollingWhenHidden: true,
    defaultParams: [{task_id: taskID}],
    onSuccess: (data, params)=>{
      setLogData(data.MsgInfo.content);
      setTaskStatus(data.MsgInfo.status)
    }
  });

  useUpdateEffect(()=>{
    const clearInstance = ()=>{
      if(['complete', 'suspend'].includes(taskStatus)){
        cancel();
      }
    };
    clearInstance()
  }, [taskStatus]);
  // useMount(()=>{run({task_id: taskID})});

  return (
    <Drawer
      title="任务执行日志"
      // placement={placement}
      closable={false}
      width={700}
      onClose={onClose}
      visible={visible}
      destroyOnClose={true}
      bodyStyle={{padding: "12px"}}
      // key={placement}
    >
      <pre style={{backgroundColor:"#bfbfbf"}}>
        {
          logData||'暂无相关日志信息'
        }
      </pre>
    </Drawer>
  )
};

export default TaskLog
