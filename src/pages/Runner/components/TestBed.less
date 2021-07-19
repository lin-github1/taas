import React, {Component} from "react";
import {Button, Card, Col, Input, Row, Skeleton, Table} from 'antd';
import PlusCircleTwoTone from "@ant-design/icons/lib/icons/PlusCircleTwoTone";
import MinusCircleTwoTone from "@ant-design/icons/lib/icons/MinusCircleTwoTone";

import "./TestBed.less"
import {connect} from "umi";
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";
import UpOutlined from "@ant-design/icons/lib/icons/UpOutlined";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import SyncOutlined from "@ant-design/icons/lib/icons/SyncOutlined";


const tableColumns = {
  by_bed: [
    {dataIndex: 'testbedName', title: '名称'},
    {
      dataIndex: 'overview', title: '环境概况', render: (text, record) => {
        return <span title="可用/总数">{record.idleQuantity}/{record.totalQuantity}</span>;
      }
    },
    {
      dataIndex: 'testbedDesc', title: '描述', ellipsis: true, render: (text, record) => {
        return <span title={`${record.testbedDesc}`}>{record.testbedDesc}</span>;
      }
    },
  ],
  by_env: [
    {dataIndex: 'main_ip', title: '主设备IP', width: 100, fixed: 'left'},
    {dataIndex: 'main_type', title: '主设备款型', width: 100, fixed: 'left'},
    {dataIndex: 'version', title: '主设备版本', width: 150},
    {dataIndex: 'name', title: '环境名称', width: 100},
    {dataIndex: 'topo_name', title: '环境TOPO名称', width: 100},
    {dataIndex: 'env_id', title: '环境ID', width: 100},
    {dataIndex: 'status', title: '状态', fixed: 'right', width: 50,},
  ]
};

@connect((state) => {
  const {eiicoDevice} = state;
  return {
    tableType: eiicoDevice.envType,
    listSelectedKeys: eiicoDevice.selectedData,
    currentLeftKeys: eiicoDevice.leftCurrentSelectedData,
    loadEnvData: eiicoDevice.loadEnvData,
  }
})
class SourceDeviceTable extends Component {
  columSearch = (dataIndex)=> ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
  });
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  handleReset = clearFilters => {
    clearFilters();
  };
  render() {
    const {dataSource = [], pageSize = 8, tableType, listSelectedKeys} = this.props;
    const columns =  [
      {dataIndex: 'main_ip', title: '主设备IP', width: 60, fixed: 'left', ...this.columSearch("main_ip")},
      {dataIndex: 'main_type', title: '主设备款型', width: 100, fixed: 'left', ...this.columSearch("main_type")},
      {dataIndex: 'version', title: '主设备版本', width: 80, ...this.columSearch("version")},
      {dataIndex: 'name', title: '环境名称', width: 100},
      {dataIndex: 'topo_name', title: '环境TOPO名称', width: 100},
      {dataIndex: 'env_id', title: '环境ID', width: 100},
      {dataIndex: 'status', title: '状态', fixed: 'right', width: 50,},
    ];
    const rowSelection = {
      columnWidth: "30px",
      getCheckboxProps: item => {
        return {disabled: listSelectedKeys.indexOf(item) >= 0}
      },
      onSelectAll: (selected, selectedRows) => {
        const {dispatch} = this.props;
        if (dispatch) {
          dispatch({
            type: "eiicoDevice/setLeftCurrentSelected",
            payload: {
              selectedData: selectedRows
            },
            callback: () => {
              // this.setState({selectedRowKeys: selectedRows.map(x=>x.key)})
            }
          })
        }
      },
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        const {dispatch} = this.props;
        if (dispatch) {
          dispatch({
            type: "eiicoDevice/setLeftCurrentSelected",
            payload: {
              selectedData: selectedRows
            },
            callback: () => {
              // this.setState({expandedRowKeys: []})
            }
          })
        }
      },
      selectedRowKeys: this.props.currentLeftKeys.map(x => x.key),
    };
    return <Skeleton loading={this.props.loadEnvData}>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowSelection={tableType === "by_env" ? rowSelection : false}
        size="small"
        pagination={{pageSize: pageSize}}
        scroll={{
          x: 900, y: 300
        }}
      />
    </Skeleton>
  }
}

const expandedRowRenders = record => <p>{record.key}</p>;

@connect((state) => {
  const {eiicoDevice} = state;
  return {
    tableType: eiicoDevice.envType,
    listSelectedKeys: eiicoDevice.selectedData,
    deviceData: eiicoDevice.deviceData,
    bedTotal: eiicoDevice.testBedData.total,
    bedData: eiicoDevice.testBedData.data,
    currentRightKeys: eiicoDevice.rightCurrentSelectedData,
    currentLeftKeys: eiicoDevice.leftCurrentSelectedData,
    loadBed: eiicoDevice.loadBed
  }
})
class SourceDataTable extends Component {
  state = {
    expandedRowKeys: [],
    expandVisible: {},
    expandedRowRenders,
    expandedData: {},
  };
  onExpandedRowRender = (expanded, record) => {
    const {dispatch} = this.props;
    if (expanded) {

      if (dispatch) {
        dispatch({
          type: "eiicoDevice/setEiicoData",
          payload: {
            loadEnvData: true
          }
        });
        dispatch({
          type: "eiicoDevice/getDeviceByBed",
          payload: {
            key: record.testbedName
          },
          callback: (res) => {
            this.setState({
              expandVisible: {
                ...this.state.expandVisible,
                [record.key]: true,
              },
              expandedRowRenders: {
                ...this.state.expandedRowRenders,
                [record.key]: <SourceDeviceTable total={res ? res.total : 0} dataSource={res ? res.data : []}
                                                 pageSize={8}/>
              },
              expandedRowKeys: [record.key]
            })
          },
        })
      }
    } else {
      this.setState({
        expandVisible: {
          ...this.state.expandVisible, [record.key]: false
        },
        expandedRowKeys: []
      })
    }
  };
  columSearch = (dataIndex)=> ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
  });
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  handleReset = clearFilters => {
    clearFilters();
  };
  render() {
    const {
      tableType = "by_bed", listSelectedKeys = [], filteredItems = [], loadBed
    } = this.props;
    const rowSelection = {
      columnWidth: "30px",
      getCheckboxProps: item => {
        return {disabled: tableType === "by_env" ? true : item.idleQuantity>0?listSelectedKeys.indexOf(item) >= 0:true}
      },
      onSelectAll: (selected, selectedRows) => {
        const {dispatch} = this.props;
        if (dispatch) {
          dispatch({
            type: "eiicoDevice/setLeftCurrentSelected",
            payload: {
              selectedData: selectedRows
            },
            callback: () => {
              // this.setState({selectedRowKeys: selectedRows.map(x=>x.key)})
            }
          })
        }
      },
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        const {dispatch} = this.props;
        if (dispatch) {
          dispatch({
            type: "eiicoDevice/setLeftCurrentSelected",
            payload: {
              selectedData: selectedRows
            },
            callback: () => {
              // this.setState({expandedRowKeys: []})
            }
          })
        }
      },
      selectedRowKeys: this.props.currentLeftKeys.map(x => x.key),
    };
    const columns = [
      {dataIndex: 'testbedName', title: '名称', ...this.columSearch("testbedName")},
      {
        dataIndex: 'overview', title: '环境概况', render: (text, record) => {
          return <span title="可用/总数">{record.idleQuantity}/{record.totalQuantity}</span>;
        }
      },
      {
        dataIndex: 'testbedDesc', title: '描述', ellipsis: true, render: (text, record) => {
          return <span title={`${record.testbedDesc}`}>{record.testbedDesc}</span>;
        }
      },
    ];
    return (
      <Skeleton loading={loadBed}>
      <Table
        rowSelection={tableType === "by_env" ? false : rowSelection}
        columns={columns}
        dataSource={filteredItems}
        expandable={{
          expandedRowRender: (record) => {
            return this.state.expandVisible[record.key] === true ? this.state.expandedRowRenders[record.key] : true
          },
          expandedRowKeys: this.state.expandedRowKeys,
          // expandRowByClick: true,
          expandIcon: ({expanded, onExpand, record}) =>
            expanded ? (
              <MinusCircleTwoTone onClick={e => onExpand(record, e)}/>
            ) : (
              <PlusCircleTwoTone onClick={e => onExpand(record, e)}/>
            ),
          onExpand: this.onExpandedRowRender.bind(this)
        }}
        scroll={{y: 450}}
        size="small"
        pagination={false}
        style={{minHeight: "350px"}}
      />
      </Skeleton>
    )
  }
}

@connect((state) => {
  const {eiicoDevice} = state;
  return {
    tableType: eiicoDevice.envType,
    listSelectedKeys: eiicoDevice.selectedData,
    currentRightKeys: eiicoDevice.rightCurrentSelectedData,
  }
})
class SelectedTable extends Component {
  render() {
    const {tableType = "by_bed", listSelectedKeys = []} = this.props;
    const columns = tableColumns[tableType];
    const rowSelection = {
      columnWidth: "30px",
      onSelectAll: (selected, selectedRows) => {
        const {dispatch} = this.props;
        if (dispatch) {
          dispatch({
            type: "eiicoDevice/setRightCurrentSelected",
            payload: {
              selectedData: selectedRows
            }
          })
        }
      },
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        const {dispatch} = this.props;
        if (dispatch) {
          dispatch({
            type: "eiicoDevice/setRightCurrentSelected",
            payload: {
              selectedData: selectedRows
            }
          })
        }
      },
      selectedRowKeys: this.props.currentRightKeys.map(x => x.key),
    };

    return (
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={listSelectedKeys}
        scroll={{
          y: 250
        }}
        size="small"
        style={{minHeight: "350px"}}
        pagination={{pageSize: 8}}
      />
    )
  }
}


class TestBed extends Component {
  componentDidMount() {
    this.loadTestBedData()
  }

  loadTestBedData = ()=>{
    const {dispatch, user} = this.props;
    if (dispatch) {
      dispatch({
        type: "eiicoDevice/setEiicoData",
        payload: {
          loadBed: true
        }
      });
      dispatch({
        type: "eiicoDevice/getTestBed",
        payload: {
          userShortName: user.short_name,
          version: this.props.version
        }
      })
    }
  };

  onSelect = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: "eiicoDevice/setListSelected",
        payload: {
          operation: "add",
          selectedData: this.props.currentLeftKeys
        }
      })
    }
  };
  onUnSelect = () => {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: "eiicoDevice/setListSelected",
        payload: {
          operation: "remove",
          selectedData: this.props.currentRightKeys
        }
      })
    }
  };

  render() {
    const {
      bedData, tableType, currentRightKeys = [], currentLeftKeys = []
    } = this.props;
    const rightButtonStyle = {
      type: currentRightKeys.length === 0 ? "-" : "primary",
      disabled: currentRightKeys.length === 0
    };
    const leftButtonStyle = {
      type: currentLeftKeys.length === 0 ? "-" : "primary",
      disabled: currentLeftKeys.length === 0
    };
    return (
      <>
        <Card extra={
          <Button
            type="primary" shape="circle" title={"重新加载测试床数据"}
            icon={<SyncOutlined />} size={"small"}
            onClick={this.loadTestBedData}
          />
        }>
          <SourceDataTable filteredItems={bedData} tableType={tableType}/>
        </Card>

        <Row justify="center" align="middle">
          <Col span={2}>
            <Button.Group style={{verticalAlign: "center", margin: "8px 0"}}>
              <Button icon={<DownOutlined style={{fontSize: "12px"}}/>} {...leftButtonStyle} onClick={this.onSelect}/>
              <Button icon={<UpOutlined style={{fontSize: "12px"}}/>} {...rightButtonStyle} onClick={this.onUnSelect} style={{marginLeft: "1px"}}/>
            </Button.Group>
          </Col>
        </Row>
        <Card>
          <SelectedTable/>
        </Card>
      </>
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
    currentRightKeys: eiicoDevice.rightCurrentSelectedData,
    currentLeftKeys: eiicoDevice.leftCurrentSelectedData,
    version: eiicoDevice.Variable.GlobalVariable.version
  }
})(TestBed);
