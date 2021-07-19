import React from 'react';
import {Form, Input, Select, Col, DatePicker, Row} from 'antd';
import "./Search.less"

const { RangePicker } = DatePicker;

const SearchCom = (props)=>{
  const {form, reloadData, endTimeValue, startTimeValue} = props;
  const statusList = [
    {key: 'setup', label: '前置准备'},
    {key: 'executing', label: '执行中'},
    {key: 'suspend', label: '执行中断'},
    {key: 'teardown', label: '后置处理'},
    {key: 'complete', label: '执行完成'}
  ];
  const lg = 6, md = 12, sm = 12, xs = 24;
  const formItemLayout = {
    labelCol: {
      xs: {span: 4},
      sm: {span: 6}
    },
    wrapperCol: {
      xs: {span: 20},
      sm: {span: 18}
    }
  };
  return (
    <div style={{marginBottom:12, paddingRight:24, paddingTop: 12}}>
      <Form
        form={form}
        className={'recordListSearch'}
        onValuesChange={reloadData}
        {...formItemLayout}
        initialValues={{create_time: [startTimeValue, endTimeValue]}}
      >
        <Row>
          <Col lg={lg} md={md} sm={sm} xs={xs} className="gutter-row">
            <Form.Item name={"name"} label="任务名称">
              <Input placeholder="请输入任务名称"/>
            </Form.Item>
          </Col>
          <Col lg={lg} md={md} sm={sm} xs={xs} className="gutter-row">
            <Form.Item name={"creator"} label="发起人">
              <Input placeholder="请输入w3账号"/>
            </Form.Item>
          </Col>
          <Col lg={lg} md={md} sm={sm} xs={xs} className="gutter-row">
            <Form.Item {...formItemLayout} name={"status"} label="任务状态">
              <Select
                allowClear
                placeholder="请选择任务状态"
              >
                {statusList.map(item => {
                  return (
                    <Select.Option key={item.key} title={item.label} value={item.key}>
                      {item.label}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={lg} md={md} sm={sm} xs={xs} className="gutter-row">
            <Form.Item {...formItemLayout} name={"create_time"} label="创建时间">
              <RangePicker
                format="YYYY-MM-DD"
                placeholder={['开始时间', '结束时间']}
                // defaultPickerValue={[startTimeValue, endTimeValue]}
                // defaultValue={[startTimeValue, endTimeValue]}
                // value={[startTimeValue, endTimeValue]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
};

export default SearchCom
