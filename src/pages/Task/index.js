import React from 'react';
import {Button, Card, Form} from 'antd';
import {useMount, useRequest} from '@umijs/hooks';
import moment from "moment";

import {getGeneralTaskList} from "@/services/job";
import ListTable from "./compontents/ListTable";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import config from "@/config/app";
const endTimeValue = moment();
const startTimeValue = moment().subtract(1, 'months');


const TaskList = (props) => {
  const {user} = props
  const [form] = Form.useForm();
  useMount(()=>{
    form.setFieldsValue({create_time: [startTimeValue, endTimeValue],author:user.short_name})
  });
  const taskRequest = useRequest(
    getGeneralTaskList,
    {
      paginated: true,
      debounceInterval: 800,
      defaultParams: [{
        current: 1, pageSize: 10,
        // range: activeTab,
        create_time: [
          startTimeValue.format('YYYY-MM-DD 00:00:00'), endTimeValue.format('YYYY-MM-DD 23:59:59')
        ],
        author: user.short_name
      }],
      onSuccess:(data,params)=>{
        console.log(data)
        console.log("************22")
        console.log(params[0])
        // console.log(ErrorHandle)
        // console.log(data.ErrorInfo)
        console.log("************22")
      }
    },
  );
  console.log(taskRequest.data)

  const reloadData = (key, extra_params) => {
    console.log("这是测试")
    console.log(key)
    console.log(taskRequest.params[0])
    console.log(extra_params)
    console.log("这是测试结束")
    const {create_time} = form.getFieldsValue();
    taskRequest.run({
      ...taskRequest.params[0],
      ...form.getFieldsValue(),
      ...extra_params,
      // range: key || activeTab,
      // create_time返回的是monet对象，需要转换一下时间格式
      create_time: create_time ?
        [create_time[0].format('YYYY-MM-DD 00:00:00'), create_time[1].format('YYYY-MM-DD 23:59:59')]: null,
    });
  };
  return (
    <div>
      <Card
        className={'recordList'}
        title={"任务列表"}
        extra={
          <Button
            ghost
            icon={<PlusOutlined/>}
            onClick={() => {
              props.history.push(`${config.baseUri}/wtecard/config`);
            }}
            // style={{marginRight: '10px'}}
            type={'primary'}
          >新建任务</Button>
      }>
        <ListTable
          form={form}
          // range={"own"}
          reloadData={reloadData}
          requestInstance={taskRequest}
          // viewType={viewType}
          endTimeValue={endTimeValue}
          startTimeValue={startTimeValue}
        />
      </Card>
    </div>

  )
};

export default TaskList
