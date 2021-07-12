import React,{useState}from 'react';
import { Form, Input, Col, DatePicker, Row,Select ,Button, notification, } from 'antd';
import "./ListSearchCom.less"
import { DownloadOutlined } from '@ant-design/icons';
import { downDocex} from "@/services/job";
import { useMount, useRequest } from '@umijs/hooks';
const { RangePicker } = DatePicker;

const TestCaseSearchCom = (props) => {
  const { form, reloadData, endTimeValue, startTimeValue,drawersData } = props;
  const statusList = [
    { key: 'setup', label: '前置准备' },
    { key: 'executing', label: '执行中' },
    { key: 'suspend', label: '执行中断' },
    { key: 'teardown', label: '后置处理' },
    { key: 'complete', label: '执行完成' }
  ];
  const [Downloadstate, setDownloadstate] = useState(false);
  const lg = 6, md = 12, sm = 12, xs = 24;
  const formItemLayout = {
    labelCol: {
      xs: { span: 4 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 18 }
    }
  };
  const downRequest = useRequest(downDocex, {
    manual: true,
    onSuccess: (data, params) => {
      console.log('这是下载docx文件成功响应')
      console.log(data)
      console.log(params)
      // console.log(ErrorHandle)
      // console.log(data.ErrorInfo)
      console.log("************")
      setDownloadstate(false)
      if (data.ErrorInfo) {
        window.open("http://10.174.58.103:8088/static/test/MySqlredis安装.docx")
        notification.info({
          description: "下载成功",
          message: '下载成功',
        });
      }


    }
  });
  const Download = () =>{
    setDownloadstate(true)
    downRequest.run({
      downPlatFormSeq:drawersData.downPlatFormSeq,
      // ...fromData,
      // ...form.getFieldsValue(),
      // user_define: fromData.user_define,
      // category: "search",
    });



  }
  return (
    <div style={{ marginBottom: 12, paddingRight: 24, paddingTop: 12 }}>
      <Form
        form={form}
        className={'recordListSearch'}
        onValuesChange={reloadData}
        {...formItemLayout}
        initialValues={{ create_time: [startTimeValue, endTimeValue], model:"all"}}
      >
        <Row justify="space-between">
          <Col lg={lg} md={md} sm={sm} xs={xs} className="gutter-row">
            <Form.Item name={"model"} label="设备款型" >
              <Select  >
                <Option value="all" >全部</Option>
                {
                  // console.log(drawersData.drawersDeviceType)
                  drawersData.drawersDeviceType.map((values,index)=>{return <Option value={values} key={index} >{values}</Option>})
                }
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
};

export default TestCaseSearchCom
