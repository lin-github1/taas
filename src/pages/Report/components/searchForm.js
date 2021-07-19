import {Form, Input, Select, Space} from "antd";
import {CaseSearchFields, CaseStatus, tagRender} from "@/pages/Report/utils";
import React, {useEffect} from "react";


const SearchForm =(props) => {
  const {optionKey="exe", setFromValue}=props;
  const [form] = Form.useForm();
  useEffect(()=>{
    form.resetFields();
    fromSubmit()
  }, [optionKey]);

  const fromSubmit =()=>{
    setFromValue(form.getFieldsValue())
  };

  return (
    <Form
      form={form}
      initialValues={{
        result: [],
        field: "name",
        content: "",
      }}
    >
      <Space>
        <Form.Item
          name={"result"}
          style={{marginBottom: 0}}
        >
          <Select
            mode="multiple"
            tagRender={tagRender}
            placeholder="请选择用例状态"
            // defaultValue={searchDict.result}
            style={{width: '300px'}}
            options={CaseStatus[optionKey]}
            onChange={fromSubmit}
            allowClear={true}
          />
        </Form.Item>
        <Form.Item name={"field"} style={{marginBottom: 0}}>
          <Select
            placeholder="输入值"
            style={{width: 120}}
            options={CaseSearchFields}
          />
        </Form.Item>
        <Form.Item name={"content"} style={{marginBottom: 0}}>
          <Input.Search
            placeholder="输入关键字"
            // defaultValue={searchDict.content}
            onChange={fromSubmit}
            onSearch={fromSubmit}
            style={{width: 300}}
            allowClear={true}
          />
        </Form.Item>
      </Space>
    </Form>
  )
};

export default SearchForm
