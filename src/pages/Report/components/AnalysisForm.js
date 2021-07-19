import React, {useState, useEffect, Fragment} from "react";
import {
  Button,
  Cascader, Col,
  Collapse, Descriptions,
  Drawer, Form, Input, Row, Select, Typography
} from "antd";
import {CauseOptions} from "@/utils";
import request from "umi-request";
import {useMount} from "@umijs/hooks";
import FooterToolbar from "@/components/FooterToolbar";

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16}
};
const formTailLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
    offset: 6,
  },
};
const AnalysisForm = (props) => {
  const {data} = props;
  const [form] = Form.useForm();
  const [causeOptions, setCauseOptions] = useState(CauseOptions);
  useMount(() => {
    request.get("http://10.244.179.0:51010/prod/conf/cause.json")
      .then((res) => setCauseOptions(res))
      .catch(() => {
        setCauseOptions(CauseOptions)
      });
  });
  useEffect(() => {
    function f() {
      form.setFieldsValue({
        cause: [data.major_cause, data.minor_cause],
        root_cause: data.root_cause, dts: data.dts
      })
    }
    f()
  }, [data.key]);
  return (
    <Fragment>
      <Form
        {...formItemLayout}
        form={form}
        name="dynamic_rule"
      >
        <Row>
          <Col span={12} key={"data1"}>
            <Form.Item
              // name="analyst"
              label="分析人员"
              style={{marginBottom: "6px"}}
            >
              {data.analyst || "未分析"}
            </Form.Item>
          </Col>
          <Col span={12} key={"data2"}>
            <Form.Item
              name="cause"
              label="问题分类"
              style={{marginBottom: "6px"}}
              rules={[{required: true,}]}
            >
              <Cascader
                options={causeOptions}
                fieldNames={{label: 'title', value: 'id', children: 'items'}}
                showSearch
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12} key={"data1"}>
            <Form.Item
              name="root_cause"
              label="详细原因"
              style={{marginBottom: "12px"}}
            >
              <Input.TextArea rows={2}/>
            </Form.Item>
          </Col>
          <Col span={12} key={"data2"}>
            <Form.Item
              name="dts"
              label="DTS单号"
              style={{marginBottom: "12px"}}
              rules={[
                {
                  validator: (_, value) => {
                    if (!!value) {
                      const _tmp = value.split(";").filter((item) => /^DTS\d{13}$/g.test(item.toUpperCase()));
                      if (value.split(";").length === _tmp.length) {
                        return Promise.resolve();
                      }
                      return Promise.reject('仅能输入DTS单号，多个按;隔开');
                    }
                    return Promise.resolve();
                  }
                },
              ]}
            >
              <Input.TextArea rows={2}/>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12} offset={12} key={"data3"}>
            <Form.Item  {...formTailLayout} style={{marginBottom: "6px", textAlign: 'right'}}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>


      </Form>
    </Fragment>

  )
};

export default AnalysisForm
