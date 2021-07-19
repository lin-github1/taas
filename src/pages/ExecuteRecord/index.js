import React, {useState} from 'react';
import {Button, Card, Form, Tabs} from 'antd';
import {useLocalStorageState, useMount, useRequest} from '@umijs/hooks';
import RecordTable from "./compontents/RecordTable"
import BankOutlined from "@ant-design/icons/lib/icons/BankOutlined";
import ShareAltOutlined from "@ant-design/icons/lib/icons/ShareAltOutlined";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import AppstoreAddOutlined from "@ant-design/icons/lib/icons/AppstoreAddOutlined";
import BarsOutlined from "@ant-design/icons/lib/icons/BarsOutlined";
import "./index.less"
import BuildOutlined from "@ant-design/icons/lib/icons/BuildOutlined";
import moment from "moment";
import {getRecordList} from "@/services/record";


const endTimeValue = moment();
const startTimeValue = moment().subtract(1, 'months');

const ExecuteRecord = (props)=>{
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('own');
  const [viewType, setViewType] = useLocalStorageState('AMT_recordTableViewType', 'card');
  useMount(()=>{
    form.setFieldsValue({create_time: [startTimeValue, endTimeValue]})
  });
  const recordRequest = useRequest(
    getRecordList,
    {
      paginated: true,
      debounceInterval: 800,
      defaultParams: [{
          current: 1, pageSize: 8,
          range: activeTab,
          create_time: [
            startTimeValue.format('YYYY-MM-DD 00:00:00'),
            endTimeValue.format('YYYY-MM-DD 23:59:59')
          ]
      }]
    },
  );
  const reloadData = (key, extra_params) => {
    const {create_time} = form.getFieldsValue();
    recordRequest.run({
      ...recordRequest.params[0],
      ...form.getFieldsValue(),
      ...extra_params,
      range: key || activeTab,
      // create_time返回的是monet对象，需要转换一下时间格式
      create_time: create_time ?
        [create_time[0].format('YYYY-MM-DD 00:00:00'), create_time[1].format('YYYY-MM-DD 23:59:59')]: null,
    });
  };
  const tabChangeCallback = (key)=>{
    form.resetFields();
    reloadData(key, {current: 1, pageSize: 8});
    setActiveTab(key)
  };

  return (
    <Card className={'recordList'}>
      <Tabs
        activeKey={activeTab}
        tabBarExtraContent={
          <div className={'recordTableViewType'}>
            <Button
              className={viewType === 'card' ? 'active' : ''}
              icon={<AppstoreAddOutlined/>}
              onClick={()=>setViewType("card")}
              style={{marginRight: '10px'}}
            />
            <Button
              className={viewType === 'table' ? 'active' : ''}
              icon={<BarsOutlined/>}
              onClick={()=>setViewType("table")}
            />
          </div>
        }
        onTabClick={tabChangeCallback}
      >
        <Tabs.TabPane
          key="own"
          tab={<span><UserOutlined/>我创建的</span>}
        >
          <RecordTable
            form={form}
            range={"own"}
            reloadData={reloadData}
            requestInstance={recordRequest}
            viewType={viewType}
            endTimeValue={endTimeValue}
            startTimeValue={startTimeValue}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          key="share"
          tab={<span><ShareAltOutlined/>共享给我的</span>}
        >
          <RecordTable
            form={form}
            range={"share"}
            reloadData={reloadData}
            requestInstance={recordRequest}
            viewType={viewType}
            endTimeValue={endTimeValue}
            startTimeValue={startTimeValue}
          />
        </Tabs.TabPane>
        {
          props.user.developer && <Tabs.TabPane
            key="ticc"
            tab={<span><BuildOutlined/>工厂任务</span>}
          >
            <RecordTable
              form={form}
              range={"ticc"}
              reloadData={reloadData}
              requestInstance={recordRequest}
              viewType={viewType}
              endTimeValue={endTimeValue}
              startTimeValue={startTimeValue}
            />
          </Tabs.TabPane>
        }
        {
          props.user.is_superuser && <Tabs.TabPane
            key="all"
            tab={<span><BankOutlined/>系统所有的</span>}
          >
            <RecordTable
              form={form}
              range={"all"}
              reloadData={reloadData}
              requestInstance={recordRequest}
              viewType={viewType}
              endTimeValue={endTimeValue}
              startTimeValue={startTimeValue}
            />
          </Tabs.TabPane>
        }

      </Tabs>
    </Card>
   )
};

export default ExecuteRecord
