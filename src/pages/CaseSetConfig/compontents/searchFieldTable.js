import {Button, Cascader, Col, Form, Input, Row, Select, Space, Table} from "antd";
import React, {useContext, useState, useEffect, useRef, useCallback} from "react";
// import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
// import MenuOutlined from "@ant-design/icons/lib/icons/MenuOutlined";
import {DndProvider, useDrag, useDrop, createDndContext} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import update from 'immutability-helper';
import "./searchFieldTable.less"
import ArrowUpOutlined from "@ant-design/icons/lib/icons/ArrowUpOutlined";
import ArrowDownOutlined from "@ant-design/icons/lib/icons/ArrowDownOutlined";
import DeleteRowOutlined from "@ant-design/icons/lib/icons/DeleteRowOutlined";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";

const EditableContext = React.createContext();

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

const initFieldData = {
  "left": undefined,
  "attr": {"value": "rank", "label": "\u7ea7\u522b", "key": "rank"},
  "condition": undefined,
  "value": undefined,
  "right": undefined,
  "logic": undefined
};

const LikeCondition = [
  {"label": "like", "key": "like"}, {"label": "not like", "key": "not like"}
];

const EqualCondition = [
  {"label": "=", "key": "="}, {"label": "!=", "key": "!="}
];

const SearchCondition = LikeCondition.concat(EqualCondition);

const AttrContentMap = {
  rank: {
    label: "级别", condition: EqualCondition, type: "select",
    value: [
      {key: "6", label: "LEVEL0"},
      {key: "1", label: "LEVEL1"},
      {key: "2", label: "LEVEL2"},
      {key: "3", label: "LEVEL3"},
      {key: "4", label: "LEVEL4"}
    ]
  },
  market: {
    label: "适用市场", condition: LikeCondition, type: "select",
    value: [
      {key: "Smoking_C", label: "Smoking_C",},
      {key: "Smoking_M", label: "Smoking_M",},
      {key: "Smoking_X", label: "Smoking_X",},
      {key: "ME_Smoking", label: "ME_Smoking",},
      {key: "SmokingC_E", label: "SmokingC_E",},
      {key: "smoking", label: "smoking",},
      {key: "Daily", label: "Daily",},
      {key: "全量", label: "全量",},
      {key: "验收", label: "验收",},
      {key: "全量专项", label: "全量专项",},
      {key: "本地执行", label: "本地执行",},
      {key: "开发", label: "开发",},
      {key: "不可自动化", label: "不可自动化",}
    ]
  },
  subFeature: {
    label: "子特性", condition: SearchCondition, type: "select",
    value: [
      {key: "WEB界面自动化", label: "WEB界面自动化"},
      {key: "HWSDK自动化", label: "HWSDK自动化"},
      {key: "SDK离线自动化", label: "SDK离线自动化"},
      {key: "Restful自动化", label: "Restful自动化"},
      {key: "Restful离线自动化", label: "Restful离线自动化"},
      {key: "WEB离线自动化", label: "WEB离线自动化"},
    ]
  },
  exeplatform: {
    label: "执行平台", condition: LikeCondition, type: "select",
    value: [{key: "Python", label: "Python"},]
  },
  creationVersionName: {
    label: "创建版本", condition: LikeCondition, type: "input",
  },
  AutoType: {
    label: "自动化类型", condition: EqualCondition, type: "select",
    value: [{key: "0", label: "False"}, {key: "1", label: "True"},]
  },
  automaticallyExecuted: {
    label: "是否自动化执行过", condition: EqualCondition, type: "select",
    value: [{key: "0", label: "False"}, {key: "1", label: "True"},]
  },
  testSystemOrModule: {
    label: "子系统/模块", condition: SearchCondition, type: "select",
    value: [{key: "offline", label: "offline"},]
  },
  modifyreason: {
    label: "用例修改原因", condition: LikeCondition, type: "select",
    value: [{key: "stable", label: "stable"},]
  },
  applyVersion: {
    label: "适用版本", condition: LikeCondition, type: "cascader",
    value: [
      // {"id": "VCN", "title": "VCN", "open": true,"items": []},
      {
        "id": "ITS800", "title": "ITS800", "open": true, "items": [
          {"id": "ITS800_1", "title": "B001"},
          {"id": "ITS800_2", "title": "B002"},
          {"id": "ITS800_3", "title": "B003"},
          {"id": "ITS800_4", "title": "B004"},
          {"id": "ITS800_5", "title": "B005"},
          {"id": "ITS800_6", "title": "B006"},
          {"id": "ITS800_7", "title": "B007"},
          {"id": "ITS800_8", "title": "B008"},
          {"id": "ITS800_9", "title": "B009"},
          {"id": "ITS800_10", "title": "B0010"},
          {"id": "B100", "title": "B100"}
        ]
      },
      {
        "id": "IPC", "title": "IPC", "open": true, "items": [
          {"id": "IPC_aa", "title": "V500R019C20"},
          {"id": "IPC_ab", "title": "V500R019C30"},
          {"id": "IPC_ac", "title": "V200R003C30"},
          {"id": "IPC_ad", "title": "Only 3516"},
          {"id": "IPC_ae", "title": "V500R019C50"},
          {"id": "IPC_af", "title": "V500R019C60"},
          {"id": "IPC_ag", "title": "SDC 8.0.0"},
          {"id": "IPC_ah", "title": "SDC8.0.1 "},
          {"id": "IPC_ai", "title": "SDC8.0.2"},
          {"id": "SDC8.1.0", "title": "SDC8.1.0"},
          {"id": "SDC8.1.0_D", "title": "SDC8.1.0_D"},
          {"id": "SDC8.2.0_I", "title": "SDC8.2.0_I"},
          {"id": "SDC8.2.0_D", "title": "SDC8.2.0_D"}
        ]
      },
      {
        "id": "微云", "title": "微云", "open": true, "items": [
          {"id": "IPC_aj", "title": "C100R019C50"},
          {"id": "IPC_ak", "title": "V100R019C50B001"},
          {"id": "IPC_al", "title": "V100R019C50B002"},
          {"id": "IPC_an", "title": "V100R019C50B010"},
          {"id": "IPC_aq", "title": "V100R019C50B020"},
          {"id": "IPC_at", "title": "V100R019C50B030"},
          {"id": "IPC_aw", "title": "V100R019C50B050"},
          {"id": "IPC_ax", "title": "V100R019C50B051"},
          {"id": "IPC_ay", "title": "V100R019C50B052"},
          {"id": "IPC_az", "title": "V100R019C50B060"},
          {"id": "IPC_ba", "title": "V100R019C50B070"},
          {"id": "IPC_bb", "title": "V100R019C50B080"},
          {"id": "IPC_bc", "title": "V100R019C50B100"},
          {"id": "IPC_bd", "title": "V100R019C50B081"},
          {"id": "IPC_be", "title": "V100R019C50B082"},
          {"id": "IPC_bf", "title": "V100R019C50B083"},
          {"id": "wy_1", "title": "V100R019C50B085"},
          {"id": "wy_2", "title": "V100R019C50B086"},
          {"id": "wy_3", "title": "V100R019C50B087"},
          {"id": "wy_4", "title": "SPC100B010"},
          {"id": "wy_5", "title": "SPC100B011"},
          {"id": "wy_6", "title": "SPC100B012"},
          {"id": "wy_7", "title": "SPC100B013"},
          {"id": "wy_8", "title": "SPC100B015"},
          {"id": "wy_9", "title": "SPC100B016"},
          {"id": "wy_10", "title": "SPC100B017"},
          {"id": "wy_11", "title": "SPC100B018"},
          {"id": "wy_12", "title": "SPC100B019"}
        ]
      }
    ]
  },
  Memo: {
    label: "描述", condition: LikeCondition, type: "input",
  },
  c_number: {
    label: "用例编号", condition: EqualCondition, type: "input",
  },
};


const getAttrContentByKey = (AttrKey) => {
  const like_condition = [
    {"label": "like", "key": "like"}, {"label": "not like", "key": "not like"}
  ];
  const equal_cond = [
    {"label": "=", "key": "="}, {"label": "!=", "key": "!="}
  ];
  const all_cond = like_condition.concat(equal_cond);
  const data = {
    rank: {
      label: "级别", condition: equal_cond, type: "select",
      value: [
        {key: "6", label: "LEVEL0"},
        {key: "1", label: "LEVEL1"},
        {key: "2", label: "LEVEL2"},
        {key: "3", label: "LEVEL3"},
        {key: "4", label: "LEVEL4"}
      ]
    },
    market: {
      label: "适用市场", condition: like_condition, type: "select",
      value: [
        {key: "Smoking_C", label: "Smoking_C",},
        {key: "Smoking_M", label: "Smoking_M",},
        {key: "Smoking_X", label: "Smoking_X",},
        {key: "ME_Smoking", label: "ME_Smoking",},
        {key: "SmokingC_E", label: "SmokingC_E",},
        {key: "smoking", label: "smoking",},
        {key: "Daily", label: "Daily",},
        {key: "全量", label: "全量",},
        {key: "验收", label: "验收",},
        {key: "全量专项", label: "全量专项",},
        {key: "本地执行", label: "本地执行",},
        {key: "开发", label: "开发",},
        {key: "不可自动化", label: "不可自动化",}
      ]
    },
    subFeature: {
      label: "子特性", condition: all_cond, type: "select",
      value: [
        {key: "WEB界面自动化", label: "WEB界面自动化"},
        {key: "HWSDK自动化", label: "HWSDK自动化"},
        {key: "SDK离线自动化", label: "SDK离线自动化"},
        {key: "Restful自动化", label: "Restful自动化"},
        {key: "Restful离线自动化", label: "Restful离线自动化"},
        {key: "WEB离线自动化", label: "WEB离线自动化"},
      ]
    },
    exeplatform: {
      label: "执行平台", condition: like_condition, type: "select",
      value: [{key: "Python", label: "Python"},]
    },
    creationVersionName: {
      label: "创建版本", condition: like_condition, type: "input",
    },
    AutoType: {
      label: "自动化类型", condition: equal_cond, type: "select",
      value: [{key: "0", label: "False"}, {key: "1", label: "True"},]
    },
    automaticallyExecuted: {
      label: "是否自动化执行过", condition: equal_cond, type: "select",
      value: [{key: "0", label: "False"}, {key: "1", label: "True"},]
    },
    testSystemOrModule: {
      label: "子系统/模块", condition: all_cond, type: "select",
      value: [{key: "offline", label: "offline"},]
    },
    modifyreason: {
      label: "用例修改原因", condition: like_condition, type: "select",
      value: [{key: "stable", label: "stable"},]
    },
    applyVersion: {
      label: "适用版本", condition: like_condition, type: "cascader",
      value: [
        // {"id": "VCN", "title": "VCN", "open": true,"items": []},
        {
          "id": "ITS800", "title": "ITS800", "open": true, "items": [
            {"id": "ITS800_1", "title": "B001"},
            {"id": "ITS800_2", "title": "B002"},
            {"id": "ITS800_3", "title": "B003"},
            {"id": "ITS800_4", "title": "B004"},
            {"id": "ITS800_5", "title": "B005"},
            {"id": "ITS800_6", "title": "B006"},
            {"id": "ITS800_7", "title": "B007"},
            {"id": "ITS800_8", "title": "B008"},
            {"id": "ITS800_9", "title": "B009"},
            {"id": "ITS800_10", "title": "B0010"},
            {"id": "B100", "title": "B100"}
          ]
        },
        {
          "id": "IPC", "title": "IPC", "open": true, "items": [
            {"id": "IPC_aa", "title": "V500R019C20"},
            {"id": "IPC_ab", "title": "V500R019C30"},
            {"id": "IPC_ac", "title": "V200R003C30"},
            {"id": "IPC_ad", "title": "Only 3516"},
            {"id": "IPC_ae", "title": "V500R019C50"},
            {"id": "IPC_af", "title": "V500R019C60"},
            {"id": "IPC_ag", "title": "SDC 8.0.0"},
            {"id": "IPC_ah", "title": "SDC8.0.1 "},
            {"id": "IPC_ai", "title": "SDC8.0.2"},
            {"id": "SDC8.1.0", "title": "SDC8.1.0"},
            {"id": "SDC8.1.0_D", "title": "SDC8.1.0_D"},
            {"id": "SDC8.2.0_I", "title": "SDC8.2.0_I"},
            {"id": "SDC8.2.0_D", "title": "SDC8.2.0_D"}
          ]
        },
        {
          "id": "微云", "title": "微云", "open": true, "items": [
            {"id": "IPC_aj", "title": "C100R019C50"},
            {"id": "IPC_ak", "title": "V100R019C50B001"},
            {"id": "IPC_al", "title": "V100R019C50B002"},
            {"id": "IPC_an", "title": "V100R019C50B010"},
            {"id": "IPC_aq", "title": "V100R019C50B020"},
            {"id": "IPC_at", "title": "V100R019C50B030"},
            {"id": "IPC_aw", "title": "V100R019C50B050"},
            {"id": "IPC_ax", "title": "V100R019C50B051"},
            {"id": "IPC_ay", "title": "V100R019C50B052"},
            {"id": "IPC_az", "title": "V100R019C50B060"},
            {"id": "IPC_ba", "title": "V100R019C50B070"},
            {"id": "IPC_bb", "title": "V100R019C50B080"},
            {"id": "IPC_bc", "title": "V100R019C50B100"},
            {"id": "IPC_bd", "title": "V100R019C50B081"},
            {"id": "IPC_be", "title": "V100R019C50B082"},
            {"id": "IPC_bf", "title": "V100R019C50B083"},
            {"id": "wy_1", "title": "V100R019C50B085"},
            {"id": "wy_2", "title": "V100R019C50B086"},
            {"id": "wy_3", "title": "V100R019C50B087"},
            {"id": "wy_4", "title": "SPC100B010"},
            {"id": "wy_5", "title": "SPC100B011"},
            {"id": "wy_6", "title": "SPC100B012"},
            {"id": "wy_7", "title": "SPC100B013"},
            {"id": "wy_8", "title": "SPC100B015"},
            {"id": "wy_9", "title": "SPC100B016"},
            {"id": "wy_10", "title": "SPC100B017"},
            {"id": "wy_11", "title": "SPC100B018"},
            {"id": "wy_12", "title": "SPC100B019"}
          ]
        }
      ]
    },
    Memo: {
      label: "描述", condition: like_condition, type: "input",
    },
    c_number: {
      label: "用例编号", condition: like_condition, type: "input",
    },
  };
  return data[AttrKey]
};

const tableFormItemStyle = {marginBottom: "2px"}


const EditableRow = ({index, className, style, handleSave, ...restProps}) => {
  // console.log(props)
  const [form] = Form.useForm();
  useEffect(() => {
    const setValue = () => {
      form.setFieldsValue({...initFieldData, ...restProps.record});
    };
    setValue()
  }, [restProps.record]);
  const validateMessages = {
    required: undefined,
    // ...
  };
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...restProps}/>
      </EditableContext.Provider>
    </Form>
  );
};

const FieldFormItem = (props) => {
  const {attrItems, fieldName, fieldIndex, handleSave, data, formInstance} = props;

  const [itemNode, setItemNode] = useState(() => AttrContentMap[data.attr.key]);

  useEffect(() => {
    function f() {
      setItemNode(AttrContentMap[data.attr.key])
    }
    f()
  }, [data.attr]);
  const selectItems = {
    left: [{"label": "(", "key": "("}, {"label": "((", "key": "(("}, {"label": "(((", "key": "((("}],
    attr: attrItems,
    right: [{"label": ")", "key": ")"}, {"label": "))", "key": "))"}, {"label": ")))", "key": ")))"}],
    logic: [{"label": "or", "key": "or"}, {"label": "and", "key": "and"}]
  };
  return <Form.Item
    key={fieldIndex}
    name={fieldName}
    style={tableFormItemStyle}
    // hasFeedback
    // validateStatus="error"
    rules={[{
      required: ["value", "condition"].indexOf(fieldName) >= 0, message: "不允许为空"},
      ]}
  >
    {
      ["left", "attr", "right", "logic", "condition"].indexOf(fieldName) >= 0
        ? <Select
          allowClear={["attr"].indexOf(fieldName) < 0}
          labelInValue={["attr", "value"].indexOf(fieldName) >= 0}
          onChange={(value) => handleSave(fieldIndex, fieldName, value, formInstance)}
        >
          {
            fieldName === "condition"
              ? itemNode.condition.map(item => (
                <Select.Option value={item.key} key={item.key} title={item.label}>{item.label}</Select.Option>
              ))
              : selectItems[fieldName].map(item => (
                <Select.Option value={item.key} key={item.key} title={item.label}>{item.label}</Select.Option>
              ))
          }
        </Select>
        : itemNode.type === "cascader" ? <Cascader
          fieldNames={{label: 'title', value: 'id', children: 'items'}}
          options={itemNode.value}
          onChange={(value) => handleSave(fieldIndex, fieldName, value, formInstance)}
          placeholder={itemNode.label}
        />
        : itemNode.type === "input"
          ? <Input onChange={(value) => handleSave(fieldIndex, fieldName, value.target.value, formInstance)}/>
          : <Select
            allowClear={["attr"].indexOf(fieldName) < 0}
            labelInValue={["attr", "value"].indexOf(fieldName) >= 0}
            onChange={(value) => handleSave(fieldIndex, fieldName, value, formInstance)}
          >
            {
              itemNode.value.map(item => (
                <Select.Option value={item.key} key={item.key} title={item.label}>{item.label}</Select.Option>
              ))
            }
          </Select>
    }
  </Form.Item>;
};

const EditableCell = ({title, children, dataIndex, record, handleSave, ...restProps}) => {
  // const [oldRecord, setOldRecord] = useState(record);
  const form = useContext(EditableContext);
  return <td {...restProps}>
    {!!!record
      ? <div className="editable-cell-value-wrap">{children}</div>
      : <FieldFormItem
        handleSave={handleSave}
        attrItems={selectAttrOption}
        fieldName={dataIndex}
        data={record}
        fieldIndex={restProps.index}
        formInstance={form}
      />
    }
  </td>;
};

const SearchFieldTable = (props) => {
  const {value = [], onChange} = props;
  const tableColumns = [
    {title: '(', dataIndex: 'left', editable: true, width: 80},
    {title: '资源字段名', dataIndex: 'attr', editable: true, width: 200},
    {title: '操作符', dataIndex: 'condition', editable: true, width: 120},
    {title: '资源字段值', dataIndex: 'value', editable: true, width: 240},
    {title: ')', dataIndex: 'right', editable: true, width: 80},
    {title: 'AND/OR', dataIndex: 'logic', editable: true, width: 100},
    {
      title: 'Action',
      dataIndex: 'x',
      key: 'x',
      render: (text, record, index) => {
        return <Space size={"0"}>
          <Button type={"link"} size={"small"} onClick={() => moveRow(index, "up")} disabled={index === 0}
                  icon={<ArrowUpOutlined/>}/>
          <Button type={"link"} size={"small"} onClick={() => moveRow(index, "down")}
                  disabled={index === value.length - 1} icon={<ArrowDownOutlined/>}/>
          <Button type={"link"} size={"small"} onClick={() => deleteRow(index)} icon={<DeleteRowOutlined/>}/>
        </Space>
      },
    },
  ];
  const columns = tableColumns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        index: value.indexOf(record),
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });
  const addCondition = () => {
    onChange(update(value, {$splice: [[value.length, 0, initFieldData]],}))
  };
  const moveRow = (rowIndex, direction) => {
    const dragRow = value[rowIndex];
    onChange(update(value, {$splice: [
        [rowIndex, 1],
        [direction === "up" ? rowIndex - 1 : rowIndex + 1, 0, dragRow],
      ]}))
  };
  const deleteRow = (rowIndex) => {
    onChange(update(value || [], {$splice: [[rowIndex, 1]]}))
  };
  const handleSave = (index, field, itemValue, itemFromInstance) => {
    const indexData = field === "attr"
      ? {...value[index], value: undefined, attr: itemValue, condition: undefined}
      : {...value[index], [field]: itemValue};
    onChange(update(value, {$splice:  [[index, 1, indexData]]}));

    itemFromInstance.validateFields()
      .then(values=>{})
      .catch(error=>{})
    ;
  };
  return <Table
    components={{
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    }}
    onRow={(record, index) => {
      return {
        record: record,
        index: value.indexOf(record),
        handleSave: handleSave,
        ...index
      }
    }}
    footer={
      () => value.length >0 ? <Button
        type="dashed"
        onClick={() => {
          addCondition();
        }}
        style={{width: "100%"}}
      >
        <PlusOutlined/> 添加条件
      </Button>:""
    }
    locale={{emptyText: <Button
        type="dashed"
        onClick={() => {
          addCondition();
        }}
        style={{width: "100%"}}
      >
        <PlusOutlined/> 添加条件
      </Button>}}
    columns={columns}
    dataSource={value}
    size={"small"}
    pagination={false}
  />
};

export default SearchFieldTable
