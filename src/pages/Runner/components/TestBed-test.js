import React, {Component} from "react";
import {useRequest} from '@umijs/hooks';
import {Button, Card, Col, List, Row, Table, Transfer, Tree} from 'antd';
import {difference} from "lodash";
import RightOutlined from "@ant-design/icons/lib/icons/RightOutlined";
import LeftOutlined from "@ant-design/icons/lib/icons/LeftOutlined";
import PlusCircleTwoTone from "@ant-design/icons/lib/icons/PlusCircleTwoTone";
import MinusCircleTwoTone from "@ant-design/icons/lib/icons/MinusCircleTwoTone";

import "./TestBed.less"
import {connect} from "umi";
import {getDeviceListByBed} from "@/services/topo";

const tableColumns = {
  by_bed: [
    {dataIndex: 'title', title: '名称'},
    {dataIndex: 'description', title: '描述'},
    {dataIndex: 'overview', title: '环境概况'},
  ],
  by_device: [
    {dataIndex: 'ip', title: 'IP'},
    {dataIndex: 'device_type', title: '款型'},
    {dataIndex: 'version', title: '版本'},
    {dataIndex: 'status', title: '状态'},
  ]
};

const testDeviceData = [
  {key: 1, ip: "1.1.1.1", device_type: "X2241-FLI", version: "10/12", status: "online"},
  {key: 2, ip: "1.1.1.2", device_type: "测试使用", version: "10/12", status: "online"},
  {key: 3, ip: "1.1.1.3", device_type: "测试使用", version: "10/12", status: "online"},
  {key: 4, ip: "1.1.1.4", device_type: "测试使用", version: "10/12", status: "online"},
  {key: 5, ip: "1.1.1.5", device_type: "测试使用", version: "10/12", status: "online"},
  {key: 6, ip: "1.1.1.6", device_type: "测试使用", version: "10/12", status: "online"},
];

// async function getDevice(key) {
//   const {data, error, loading} = await useRequest(getDeviceListByBed, {key: record.key});
//   console.log(data);
//   return data
// }
// @connect((state)=>{
//   return {
//     device: state.eiicoDevice.deviceData,
//   }
// })
const expandedRowRender = (record, index, indent, expanded) => {
  const {istDisabled} = record;
  console.log(record, index, indent, expanded);
  const listSelectedKeys = [];
  // const {data, error, loading} = await useRequest(getDeviceListByBed, {key: record.key});
  // console.log(data, loading);
  const columns = tableColumns["by_device"];
  const rowSelection = {
    columnWidth: "30px",
    // getCheckboxProps: item => ({ disabled: direction==="left" && tableTye==="device"?false:listDisabled || item.disabled }),
    getCheckboxProps: item => ({disabled: istDisabled || item.disabled}),
    // onSelectAll(selected, selectedRows) {
    //   const treeSelectedKeys = selectedRows
    //     .filter(item => !item.disabled)
    //     .map(({key}) => key);
    //   const diffKeys = selected
    //     ? difference(treeSelectedKeys, listSelectedKeys)
    //     : difference(listSelectedKeys, treeSelectedKeys);
    //   // onItemSelectAll(diffKeys, selected);
    // },
    // onSelect({key}, selected) {
    //   console.log(key, selected)
    //   // onItemSelect(key, selected);
    // },
    // selectedRowKeys: listSelectedKeys,
  };
  return <Table
    columns={columns}
    dataSource={record.data || []}
    rowSelection={rowSelection}
    size="small"
    // scroll={{
    //   x: 240
    // }}
  />;
};


@connect((state) => {
  return {
    tableType: state.eiicoDevice.envType,
    listSelectedKeys: state.eiicoDevice.selectedData,
  }
})
const SourceDataTable = (props) => {

  const {tableType = "by_bed", listSelectedKeys = [], filteredItems = []} = props;
  const columns = tableColumns["by_bed"];
  // const {data, error, loading } = useRequest(getDeviceListByBed, {key: 1});
  const expandedRowRender = (record, index, indent, expanded) => {
    const {istDisabled} = record;
    console.log(record, index, indent, expanded);
    // const {data, error, loading } = useRequest(getDeviceListByBed, {key: record.key});
    // console.log(data, error, loading);
    // const listSelectedKeys = [];
    // const {data, error, loading} = await useRequest(getDeviceListByBed, {key: record.key});
    // console.log(data, loading);
    const columns = tableColumns["by_device"];
    const rowSelection = {
      columnWidth: "30px",
      // getCheckboxProps: item => ({ disabled: direction==="left" && tableTye==="device"?false:listDisabled || item.disabled }),
      getCheckboxProps: item => {
        console.log(listSelectedKeys.has(item), listSelectedKeys);
        return {disabled: listSelectedKeys.has(item)}
      },
      // onSelectAll(selected, selectedRows) {
      //   const treeSelectedKeys = selectedRows
      //     .filter(item => !item.disabled)
      //     .map(({key}) => key);
      //   const diffKeys = selected
      //     ? difference(treeSelectedKeys, listSelectedKeys)
      //     : difference(listSelectedKeys, treeSelectedKeys);
      //   // onItemSelectAll(diffKeys, selected);
      // },
      // onSelect({key}, selected) {
      //   console.log(key, selected)
      //   // onItemSelect(key, selected);
      // },
      // selectedRowKeys: listSelectedKeys,
    };
    return <Table
      columns={columns}
      dataSource={record.data || []}
      rowSelection={rowSelection}
      size="small"
      // scroll={{
      //   x: 240
      // }}
    />;
  };
  // console.log(props)
  // const getDevice = (record) => {
  //   props.dispatch({
  //     type: "eiicoDevice/getDeviceByBed",
  //     payload: {
  //       key: record.key
  //     }
  //   })
  const rowSelection = {
    columnWidth: "30px",
    // getCheckboxProps: item => ({ disabled: direction==="left" && tableTye==="device"?false:listDisabled || item.disabled }),
    getCheckboxProps: item => ({disabled: tableType === "by_device" ? true : listDisabled.indexOf(item.key) >= 0}),
    // onSelectAll(selected, selectedRows) {
    //   const treeSelectedKeys = selectedRows
    //     .filter(item => !item.disabled)
    //     .map(({key}) => key);
    //   const diffKeys = selected
    //     ? difference(treeSelectedKeys, listSelectedKeys)
    //     : difference(listSelectedKeys, treeSelectedKeys);
    //   // onItemSelectAll(diffKeys, selected);
    // },
    // onSelect(record, selected, selectedRows, nativeEvent) {
    //   console.log(record, selected, selectedRows, nativeEvent);
    //   getDevice(record)
    //   // onItemSelect(key, selected);
    // },
    // selectedRowKeys: listSelectedKeys,
  };

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={filteredItems}
      expandable={{
        expandedRowRender: expandedRowRender,
        expandRowByClick: true,
        expandIcon: ({expanded, onExpand, record}) =>
          expanded ? (
            <MinusCircleTwoTone onClick={e => onExpand(record, e)}/>
          ) : (
            <PlusCircleTwoTone onClick={e => onExpand(record, e)}/>
          ),
        onExpand: (expanded, record) => {
          // console.log(expanded, record)
          // record.data =
          const callback = (res) => {
            console.log(res);
            record.data = res.data || []
          };
          if (expanded) {
            getDevice(record, callback)
          }
          // console.log(deviceData);
          // record.data = deviceData[record.key]
        }
      }}
      scroll={{
        y: 300
      }}
      size="small"
      // style={{ pointerEvents: listDisabled ? 'none' : null }}
      // onRow={({key, disabled: itemDisabled}) => ({
      //   // onClick: () => {
      //   //   if (itemDisabled || listDisabled) return;
      //   //   onItemSelect(key, !listSelectedKeys.includes(key));
      //   // },
      // })}
      pagination={false}
    />
  )
};


const SelectedTable = (props) => {
  const {tableType = "by_bed", listSelectedKeys = [], filteredItems = []} = props;
  const columns = tableColumns[tableType];


  const rowSelection = {
    columnWidth: "30px",
    // getCheckboxProps: item => ({ disabled: direction==="left" && tableTye==="device"?false:listDisabled || item.disabled }),
    // getCheckboxProps: item => ({disabled: tableType === "by_device" ? true : listDisabled.indexOf(item.key) >= 0}),
    // onSelectAll(selected, selectedRows) {
    //   const treeSelectedKeys = selectedRows
    //     .filter(item => !item.disabled)
    //     .map(({key}) => key);
    //   const diffKeys = selected
    //     ? difference(treeSelectedKeys, listSelectedKeys)
    //     : difference(listSelectedKeys, treeSelectedKeys);
    //   // onItemSelectAll(diffKeys, selected);
    // },
    // onSelect(record, selected, selectedRows, nativeEvent) {
    //   // console.log(record, selected, selectedRows, nativeEvent)
    //   getDevice(record)
    //   // onItemSelect(key, selected);
    // },
    // selectedRowKeys: listSelectedKeys,
  };

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={filteredItems}
      // expandable={{
      //   expandedRowRender:expandedRowRender,
      //   expandRowByClick: true,
      //   expandIcon: ({ expanded, onExpand, record }) =>
      //     expanded ? (
      //       <MinusCircleTwoTone onClick={e => onExpand(record, e)} />
      //     ) : (
      //       <PlusCircleTwoTone onClick={e => onExpand(record, e)} />
      //     ),
      //   onExpand: (expanded, record)=>{
      //     console.log(expanded, record)
      //   }
      // }}
      scroll={{
        y: 300
      }}
      size="small"
      // style={{ pointerEvents: listDisabled ? 'none' : null }}
      // onRow={({key, disabled: itemDisabled}) => ({
      //   // onClick: () => {
      //   //   if (itemDisabled || listDisabled) return;
      //   //   onItemSelect(key, !listSelectedKeys.includes(key));
      //   // },
      // })}
      // pagination={false}
    />
  )
};


class TestBed extends Component {
  state = {
    deviceData: {}
  };

  componentDidMount() {
    const {dispatch, user} = this.props;
    if (dispatch) {
      dispatch({
        type: "eiicoDevice/getTestBed",
        payload: {
          userShortName: user.short_name
        }
      })
    }
  }

  getDevice = (record) => {
    // console.log(record.key);
    this.props.dispatch({
      type: "eiicoDevice/getDeviceByBed",
      payload: {
        key: record.key
      },
      // callback: (res)=>{
      //   callback(res)
      // }
    })
  };

  render() {
    // console.log(this.props.deviceData);
    const {bedData, tableType, listSelectedKeys} = this.props;
    return (
      <Row align="middle">
        <Col span={11}>
          <SourceDataTable
            filteredItems={bedData}
            tableType={tableType}
            getDevice={this.getDevice}
            deviceData={this.state.deviceData}
          />
        </Col>
        <Col flex={"30px"}>
          <Button.Group style={{verticalAlign: "center", margin: "0 8px"}}>
            <Button icon={<RightOutlined style={{fontSize: "12px"}}/>} style={{
              display: "block", marginBottom: "4px", width: "24px", height: "24px",
              padding: "0px 0", fontSize: "14PX", borderRadius: "2px"
            }}/>
            <Button icon={<LeftOutlined style={{fontSize: "12px"}}/>} style={{
              display: "block", width: "24px", height: "24px", marginLeft: "0px",
              padding: "0px 0", fontSize: "14PX", borderRadius: "2px"
            }}/>
          </Button.Group>
        </Col>
        <Col span={11}>
          <SelectedTable filteredItems={listSelectedKeys} tableType={tableType}/>
        </Col>
      </Row>
    )
  }

}

export default connect((state) => {
  const {eiicoDevice} = state;
  return {
    tableType: eiicoDevice.envType,
    listSelectedKeys: eiicoDevice.selectedData,
    deviceData: eiicoDevice.deviceData,
    bedTotal: eiicoDevice.testBedData.total,
    bedData: eiicoDevice.testBedData.data,
  }
})(TestBed);


// export default TestBed
