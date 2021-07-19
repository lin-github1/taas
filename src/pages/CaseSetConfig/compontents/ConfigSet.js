import React, {useState, useEffect} from 'react';
import { useMap, useMount, useUnmount } from '@umijs/hooks';
import {Button, Cascader, Col, Form, Input, Row, Select, Space} from "antd";
import MinusCircleOutlined from "@ant-design/icons/lib/icons/MinusCircleOutlined";
import {useDrag} from "react-dnd";
import ArrowUpOutlined from "@ant-design/icons/lib/icons/ArrowUpOutlined";
import ArrowDownOutlined from "@ant-design/icons/lib/icons/ArrowDownOutlined";
import DeleteRowOutlined from "@ant-design/icons/lib/icons/DeleteRowOutlined";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";

const selectAttrOption = [
  {key: "market", label: "适用市场", options: []},
  {key: "rank", label: "级别", options: []},
  {key: "c_number", label: "用例编号", options: []},
  {key: "subFeature", label: "子特性"},
  {key: "exeplatform", label: "执行平台", options: ["Python"]},
  {key: "applyVersion", label: "适用版本", options: []},
  {key: "modifyreason", label: "用例修改原因", options: ["stable"]},
  {key: "testSystemOrModule", label: "子系统/模块", options: ["offline"]},
  {key: "AutoType", label: "自动化类型", options: ["True", "False"]},
  {key: "automaticallyExecuted", label: "是否自动化执行过", options: ["True", "False"]},
  {key: "creationVersionName", label: "创建版本", options: []},
  {key: "Memo", label: "描述", options: []},
];

const createComponent = (comKey)=>{
  const like_condition = [
    {"label": "like","key": "like"}, {"label": "not like","key": "not like"}
  ];
  const equal_cond = [
    {"label": "=","key": "="}, {"label": "!=","key": "!="}
  ];
  const all_cond = like_condition.concat(equal_cond);
  const data = {
    rank: {
      label: "级别", condition: equal_cond, type:"select",
      value: [
        { key: "6", label: "LEVEL0" },
        { key: "1", label: "LEVEL1" },
        { key: "2", label: "LEVEL2" },
        { key: "3", label: "LEVEL3" },
        { key: "4", label: "LEVEL4" }
      ]
    },
    market: {
      label: "适用市场", condition: like_condition, type:"select",
      value: [
        { key: "Smoking_C", label: "Smoking_C", },
        { key: "Smoking_M", label: "Smoking_M", },
        { key: "Smoking_X", label: "Smoking_X", },
        { key: "ME_Smoking", label: "ME_Smoking", },
        { key: "SmokingC_E", label: "SmokingC_E", },
        { key: "smoking", label: "smoking", },
        { key: "Daily", label: "Daily", },
        { key: "全量", label: "全量", },
        { key: "验收", label: "验收", },
        { key: "全量专项", label: "全量专项", },
        { key: "本地执行", label: "本地执行", },
        { key: "开发", label: "开发", },
        { key: "不可自动化", label: "不可自动化", }
      ]
    },
    subFeature: {
      label: "子特性", condition: all_cond, type:"select",
      value: [
        { key: "WEB界面自动化", label: "WEB界面自动化" },
        { key: "HWSDK自动化", label: "HWSDK自动化" },
        { key: "SDK离线自动化", label: "SDK离线自动化" },
        { key: "Restful自动化", label: "Restful自动化" },
        { key: "Restful离线自动化", label: "Restful离线自动化" },
        { key: "WEB离线自动化", label: "WEB离线自动化" },
      ]
    },
    exeplatform: {
      label: "执行平台", condition: like_condition, type:"select",
      value: [{ key: "Python", label: "Python" },]
    },
    creationVersionName: {
      label: "创建版本", condition: like_condition, type:"input",
    },
    AutoType: {
      label: "自动化类型", condition: equal_cond, type:"select",
      value: [{ key: "0", label: "False" }, { key: "1", label: "True" },]
    },
    automaticallyExecuted: {
      label: "是否自动化执行过", condition: equal_cond, type:"select",
      value: [{ key: "0", label: "False" }, { key: "1", label: "True" },]
    },
    testSystemOrModule: {
      label: "子系统/模块", condition: all_cond, type:"select",
      value: [{ key: "offline", label: "offline" },]
    },
    modifyreason: {
      label: "用例修改原因", condition: like_condition, type:"select",
      value: [{ key: "stable", label: "stable" },]
    },
    applyVersion: {
      label: "适用版本", condition: like_condition, type:"cascader",
      value: [
        // {"id": "VCN", "title": "VCN", "open": true,"items": []},
        {"id": "ITS800", "title": "ITS800", "open": true,"items": [
            {"id": "ITS800_1","title": "B001"},
            {"id": "ITS800_2","title": "B002"},
            {"id": "ITS800_3","title": "B003"},
            {"id": "ITS800_4","title": "B004"},
            {"id": "ITS800_5","title": "B005"},
            {"id": "ITS800_6","title": "B006"},
            {"id": "ITS800_7","title": "B007"},
            {"id": "ITS800_8","title": "B008"},
            {"id": "ITS800_9","title": "B009"},
            {"id": "ITS800_10","title": "B0010"},
            {"id": "B100","title": "B100"}
            ]},
        {"id": "IPC", "title": "IPC", "open": true,"items": [
            {"id": "IPC_aa","title": "V500R019C20"},
            {"id": "IPC_ab","title": "V500R019C30"},
            {"id": "IPC_ac","title": "V200R003C30"},
            {"id": "IPC_ad","title": "Only 3516"},
            {"id": "IPC_ae","title": "V500R019C50"},
            {"id": "IPC_af","title": "V500R019C60"},
            {"id": "IPC_ag","title": "SDC 8.0.0"},
            {"id": "IPC_ah","title": "SDC8.0.1 "},
            {"id": "IPC_ai","title": "SDC8.0.2"},
            {"id": "SDC8.1.0","title": "SDC8.1.0"},
            {"id": "SDC8.1.0_D","title": "SDC8.1.0_D"},
            {"id": "SDC8.2.0_I","title": "SDC8.2.0_I"},
            {"id": "SDC8.2.0_D","title": "SDC8.2.0_D"}
          ]},
        {"id": "微云", "title": "微云", "open": true,"items": [
            {"id": "IPC_aj","title": "C100R019C50"},
            {"id": "IPC_ak","title": "V100R019C50B001"},
            {"id": "IPC_al","title": "V100R019C50B002"},
            {"id": "IPC_an","title": "V100R019C50B010"},
            {"id": "IPC_aq","title": "V100R019C50B020"},
            {"id": "IPC_at","title": "V100R019C50B030"},
            {"id": "IPC_aw","title": "V100R019C50B050"},
            {"id": "IPC_ax","title": "V100R019C50B051"},
            {"id": "IPC_ay","title": "V100R019C50B052"},
            {"id": "IPC_az","title": "V100R019C50B060"},
            {"id": "IPC_ba","title": "V100R019C50B070"},
            {"id": "IPC_bb","title": "V100R019C50B080"},
            {"id": "IPC_bc","title": "V100R019C50B100"},
            {"id": "IPC_bd","title": "V100R019C50B081"},
            {"id": "IPC_be","title": "V100R019C50B082"},
            {"id": "IPC_bf","title": "V100R019C50B083"},
            {"id": "wy_1","title": "V100R019C50B085"},
            {"id": "wy_2","title": "V100R019C50B086"},
            {"id": "wy_3","title": "V100R019C50B087"},
            {"id": "wy_4","title": "SPC100B010"},
            {"id": "wy_5","title": "SPC100B011"},
            {"id": "wy_6","title": "SPC100B012"},
            {"id": "wy_7","title": "SPC100B013"},
            {"id": "wy_8","title": "SPC100B015"},
            {"id": "wy_9","title": "SPC100B016"},
            {"id": "wy_10","title": "SPC100B017"},
            {"id": "wy_11","title": "SPC100B018"},
            {"id": "wy_12","title": "SPC100B019"}
          ]}
      ]
    },
    Memo: {
      label: "描述", condition: like_condition, type:"input",
    },
    c_number: {
      label: "用例编号", condition: like_condition, type:"input",
    },
  };
  return data[comKey]
};


const CidaConditionComponent = (props)=>{
  const {
    currentField, remove, maxIndex, move,
    currentIndex, fromLogicData, fromInstance} = props;
  const currentData = fromLogicData.length > 0
    ?
    fromLogicData[currentIndex]
      ? fromLogicData[currentIndex].attr
      : {key: "rank", label: "级别"}
    :
    {key: "rank", label: "级别"};

  const [currentV, setCurrentV] = useState(currentData);
  const [currentVC, setCurrentVC] = useState(createComponent(currentData.key));
  const onChangeCall = (value)=>{
    setCurrentV(value);
    setCurrentVC(createComponent(value.key));
    const locgiData = fromInstance.getFieldValue("logic");
    if (locgiData[currentIndex] && currentV.key !== locgiData[currentIndex].attr.key) {
      locgiData[currentIndex] = {
        ...locgiData[currentIndex], condition: "", value: ""
      };
      fromInstance.setFieldsValue({logic: locgiData});
    }
  };
  useMount(
    () => {
      onChangeCall(currentV);
    }
  );
  // const getLabel = (a, selectedOptions) => {
  //   console.log(selectedOptions)
  // }
  // const [collectedProps, drag] = useDrag({
  //   item: { id }
  // });
  const getValueComponent = (data)=>{
    if (data.type === "input") {
      return <Input placeholder={data.label} />
    } else if (data.type === "select") {
      return <Select showSearch labelInValue>
        {
          data.value.map(item=>(
            <Select.Option value={item.key} key={item.key} title={item.label}>{item.label}</Select.Option>
          ))
        }
      </Select>
    } else if (data.type === "cascader") {
      return <Cascader
        fieldNames={{ label: 'title', value: 'id', children: 'items' }}
        options={data.value}
        placeholder={data.label}
        // onChange={getLabel}
      />
    }
  };
  return (
    <Row>
      <Col span={2}>
        <Form.Item
          name={[currentField.name, "left"]}
          fieldKey={[currentField.fieldKey, "left"]}
        >
          <Select allowClear>
            <Select.Option key={"("} value="(">(</Select.Option>
            <Select.Option key={"(("} value="((">((</Select.Option>
            <Select.Option key={"((("} value="(((">(((</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          name={[currentField.name, "attr"]}
          fieldKey={[currentField.fieldKey, "attr"]}
          rules={[{ required: true, message: '请选择属性'}]}
        >
          <Select showSearch onChange={onChangeCall} labelInValue>
            {
              selectAttrOption.map(item=>(
                <Select.Option value={item.key} key={item.key} title={item.label}>{item.label}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          name={[currentField.name, "condition"]}
          fieldKey={[currentField.fieldKey, "condition"]}
          rules={[{ required: true, message: '请选择条件' }]}
        >
          <Select showSearch>
            {
              currentVC.condition.map(item=>(
                <Select.Option value={item.key} key={item.key} title={item.label}>{item.label}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
      </Col>
      <Col span={7}>
        <Form.Item
          name={[currentField.name, "value"]}
          fieldKey={[currentField.fieldKey, "value"]}
          rules={[{ required: true, message: '请给定值' }]}
        >
          {getValueComponent(currentVC)}
        </Form.Item>
      </Col>
      <Col span={2}>
        <Form.Item
          name={[currentField.name, "right"]}
          fieldKey={[currentField.fieldKey, "right"]}
        >
          <Select allowClear>
            <Select.Option key={")"} value=")">)</Select.Option>
            <Select.Option key={"))"} value="))">))</Select.Option>
            <Select.Option key={")))"} value=")))">)))</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          name={[currentField.name, "logic"]}
          fieldKey={[currentField.fieldKey, "logic"]}
          rules={[{required: currentIndex + 1 !== maxIndex, message: '请给逻辑条件'}]}
        >
          <Select allowClear>
            <Select.Option key={"or"} value="or">or</Select.Option>
            <Select.Option key={"and"} value="and">and</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={4} flex="none" style={{margin: "5px 0 0 5px"}}>
        <Space size={"0"}>
          <Button type={"link"} size={"small"} onClick={() => move(currentIndex, currentIndex-1)} disabled={currentIndex === 0}
                  icon={<ArrowUpOutlined/>}/>
          <Button type={"link"} size={"small"} onClick={() => move(currentIndex, currentIndex+1)}
                  disabled={currentIndex === maxIndex-1} icon={<ArrowDownOutlined/>}/>
          <Button type={"link"} size={"small"} onClick={() => remove(currentField.name)} icon={<DeleteRowOutlined/>}/>
        </Space>
        {/*<MinusCircleOutlined style={{color: "#ff4d4f"}}*/}
        {/*  className="dynamic-delete-button"*/}
        {/*  onClick={() => {*/}
        {/*    remove(currentField.name);*/}
        {/*  }}*/}
        {/*/>*/}
      </Col>
    </Row>
  )
};

export default CidaConditionComponent
