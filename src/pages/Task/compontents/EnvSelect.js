import React, {useState} from 'react';
import {useMount, useRequest} from "@umijs/hooks";
import {
  Button,
  Card, Checkbox, Col, Divider,
  Drawer, Form, Input, Popconfirm, Radio, Row, Skeleton, Space, Table, Tag, Tooltip, TreeSelect
} from "antd";
import {getDeviceListByBed, getTestBedList, getVersionList} from "@/services/topo";
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";
import UpOutlined from "@ant-design/icons/lib/icons/UpOutlined";
import LeftOutlined from "@ant-design/icons/lib/icons/LeftOutlined";
import RightOutlined from "@ant-design/icons/lib/icons/RightOutlined";
import MinusCircleTwoTone from "@ant-design/icons/lib/icons/MinusCircleTwoTone";
import PlusCircleTwoTone from "@ant-design/icons/lib/icons/PlusCircleTwoTone";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import QuestionCircleOutlined from "@ant-design/icons/lib/icons/QuestionCircleOutlined";
import InfoCircleOutlined from "@ant-design/icons/lib/icons/InfoCircleOutlined";
import FooterToolbar from "@/components/FooterToolbar";
import RollbackOutlined from "@ant-design/icons/lib/icons/RollbackOutlined";
import "./EnvSelect.less"

const tableColumns = {
  by_bed: [
    {dataIndex: 'testbedName', title: '名称'},
    {
      dataIndex: 'overview', width: 100, title: '环境概况', render: (text, record) => {
        return <span title="可用/总数">{record.idleQuantity}/{record.totalQuantity}</span>;
      }
    },
    // {
    //   dataIndex: 'testbedDesc', title: '描述', ellipsis: true, render: (text, record) => {
    //     return <span title={`${record.testbedDesc}`}>{record.testbedDesc}</span>;
    //   }
    // },
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


const EnvTable = (props) => {
  const {
    topo, setSelectData, selectData = [], dataSource, BedName, currentBedName
  } = props;
  const [currentData, setCurrentData] = useState(selectData);
  const [searchInput, setSearchInput] = useState();
  const columSearch = (dataIndex) => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
      <div style={{padding: 8}}>
        <Input
          ref={node => {
            setSearchInput(node);
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{width: 188, marginBottom: 8, display: 'block'}}
        />
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined/>}
          size="small"
          style={{width: 90, marginRight: 8}}
        >
          Search
        </Button>
        <Button onClick={() => clearFilters()} size="small" style={{width: 90}}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput && searchInput.select());
      }
    },
  });
  return (
    <Table
      columns={[
        {dataIndex: 'main_ip', title: '主设备IP', width: 100, fixed: 'left', ...columSearch('main_ip')},
        {
          dataIndex: 'main_type',
          title: '主设备款型',
          width: 100,
          fixed: 'left',
          ellipsis: true, ...columSearch('main_type')
        },
        {dataIndex: 'version', title: '主设备版本', ellipsis: true, ...columSearch('version')},
        {dataIndex: 'name', title: '环境名称', ellipsis: true, ...columSearch('name')},
        {dataIndex: 'topo_name', title: '环境TOPO名称', ellipsis: true, ...columSearch('topo_name')},
        {dataIndex: 'env_id', title: '环境ID', ellipsis: true, ...columSearch('env_id')},
        {
          dataIndex: 'status', title: '状态', fixed: 'right', width: 50, render: (text, record) => {
            return record.status === "0"
              ? <Tag color={"#40a9ff"}>可用</Tag>
              : <Tag color={"#ff4d4f"}>异常</Tag>
          }
        },
      ]}
      // key={params[0].pk}
      // rowClassName={(record, index)=>{
      //   return record.status === "0"?"":"unUsed"
      // }}
      dataSource={dataSource}
      rowSelection={topo === "by_env" ? {
        selectedRowKeys: currentData.map(x => x.key),
        // selectedRowKeys: selectData,
        getCheckboxProps: item => {
          // console.log(item.idleQuantity <= 0, item.idleQuantity);
          return {disabled: item.status === "1"}
        },
        // renderCell: (checked, record, index, originNode) => {
        //   return <Checkbox />
        // },
        columnWidth: "30px",
        onSelectAll: (selected, selectedRows) => {
          setCurrentData(selectedRows.filter(x => x));
          setSelectData({List: selectedRows.filter(x => x), Name: BedName})
        },
        onSelect: (record, selected, selectedRows, nativeEvent) => {
          setCurrentData(selectedRows.filter(x => x));
          setSelectData({List: selectedRows.filter(x => x), Name: BedName})
        },
      } : false}
      size="small"
      pagination={{pageSize: 6}}
      scroll={{x: 900}}
    />
  )
};


const LeftEnvDataSelect = (props) => {
  const {
    topo = "by_bed", BedName,
    currentKeys = [], filteredItems = [],
    requestInstance, selectInstance
  } = props;
  const [expandedObject, setExpandedObject] = useState({
    expandVisible: {},
    expandedRowRenders: {},
    expandedRowKeys: [],
  });

  // const setCurrentData = (data) => {
  //   const _data = data.filter(x => x);
  //   selectInstance(_data)
  // };

  const getEnvListRequest = useRequest(getDeviceListByBed, {
    manual: true,
    onSuccess: (data, params) => {
      setExpandedObject({
        ...expandedObject,
        expandVisible: {
          ...expandedObject.expandVisible, [params[0].pk]: true
        },
        expandedRowRenders: {
          ...expandedObject.expandedRowRenders,
          [params[0].pk]: <EnvTable topo={topo}
                                    currentBedName={BedName}
                                    BedName={params[0].key}
            // setSelectData={setSelectData}
                                    selectData={currentKeys}
                                    setSelectData={selectInstance}
                                    dataSource={data && data.MsgInfo ? data.MsgInfo.data : []}/>
        },
        expandedRowKeys: [params[0].pk]
      })
    }
  });
  const onExpandedRowRender = (expanded, record) => {
    if (expanded) {
      getEnvListRequest.run({key: record.testbedName, pk: record.key});
    } else {
      setExpandedObject({
        ...expandedObject,
        expandVisible: {
          ...expandedObject.expandVisible, [record.key]: false
        },
        expandedRowKeys: []
      })
    }
  };
  const rowSelection = {
    columnWidth: "30px",
    getCheckboxProps: item => {
      // console.log(item.idleQuantity <= 0, item.idleQuantity);
      return {disabled: topo === "by_env"}
    },
    onSelectAll: (selected, selectedRows) => {
      selectInstance({List: selectedRows.filter(x => x)})
    },
    // renderCell: (checked, record, index, originNode) => {
    //   return <Checkbox indeterminate disabled={topo === "by_env" ? true : record.idleQuantity <= 0} />
    // },
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      selectInstance({List: selectedRows.filter(x => x)})
    },
    selectedRowKeys: currentKeys.map(x => x.key),
  };
  return (
    <Skeleton loading={requestInstance.loading}>
      <Table
        // bordered
        rowSelection={topo === "by_env" ? false : rowSelection}
        columns={[
          {dataIndex: 'testbedName', title: '名称'},
          {
            dataIndex: 'overview', width: 100, title: '环境概况', render: (text, record) => {
              return <span title="可用/总数">{record.idleQuantity}/{record.totalQuantity}</span>;
            }
          },
          // {
          //   dataIndex: 'testbedDesc', title: '描述', ellipsis: true, render: (text, record) => {
          //     return <span title={`${record.testbedDesc}`}>{record.testbedDesc}</span>;
          //   }
          // },
        ]}
        // rowClassName={(record, index)=>record.idleQuantity === 0?"unUsed":""}
        dataSource={filteredItems}
        expandable={{
          expandedRowRender: (record) => {
            return expandedObject.expandVisible[record.key] === true ? expandedObject.expandedRowRenders[record.key] : true
          },
          expandedRowKeys: expandedObject.expandedRowKeys,
          // expandRowByClick: true,
          expandIcon: ({expanded, onExpand, record}) =>
            expanded ? (
              <MinusCircleTwoTone onClick={e => onExpand(record, e)}/>
            ) : (
              <PlusCircleTwoTone onClick={e => onExpand(record, e)}/>
            ),
          onExpand: onExpandedRowRender
        }}
        scroll={{y: 400}}
        size="small"
        pagination={false}
        style={{minHeight: "400px"}}
      />
    </Skeleton>
  )
};


const EnvSelect = (props) => {
  const {visible, onClose, topo = "by_bed", okData, setEnvFormData} = props;
  const [currentData, setCurrentData] = useState(
    topo === "by_bed"
      ? {List: okData, Name: ""}
      : okData.length > 0 ? {List: okData[0].list,Name: okData[0].testbedName} : {List: [], Name: ""}
  );
  const setEnvConfig = (data) => {
    setCurrentData({
      ...currentData, ...data
    })
  };
  const [form] = Form.useForm();
  const [bedList, setBedList] = useState([]);
  const getVersionListRequest = useRequest(getVersionList, {
    defaultParams: [{user: props.user.short_name}]
  });
  const getBedListRequest = useRequest(getTestBedList, {
    defaultParams: [{user: props.user.short_name, version: ["all"]}],
    onSuccess: (data, params) => {
      setBedList(data.MsgInfo ? data.MsgInfo.data : [])
    }
  });
  const onValuesChange = (keyWord, e) => {
    const tmpData = getBedListRequest.data ? getBedListRequest.data.MsgInfo.data : [];
    if (!!keyWord) {
      return setBedList(tmpData.filter(item => {
        return item.testbedName
          .toString()
          .toLowerCase()
          .includes(keyWord.toLowerCase())
      }))
    } else {
      return setBedList(tmpData)
    }
  };
  const handleSubmit = () => {
    let envConfig = [];
    if (topo === "by_env") {
      envConfig = [{
        testbedName: currentData.Name,
        list: currentData.List,
        data: currentData.List.map(item => item.env_id),
        source: currentData.List.map(item => {
          return {value: item.env_id}
        })
      }]
    } else {
      envConfig = currentData.List
    }
    setEnvFormData(envConfig);
    onClose(false)
  };
  const onSelect = (value, node, extra) => {
    getBedListRequest.run({user: props.user.short_name, version: value})
  };
  return (
    <Drawer
      title={topo === "by_bed" ? "环境配置-->请选择待测试的测试床" : "环境配置-->请选择待测试的测试环境"}
      placement={"bottom"}
      height={"700"}
      closable={false}
      onClose={() => {
        setEnvConfig({List: [], Name: ""});
        onClose(false)
      }}
      visible={visible}
    >
      <Row gutter={24}>
        <Col md={20} sm={24}>
          <Form form={form}>
            <Form.Item noStyle>
              <Form.Item
                style={{display: 'inline-block', width: 'calc(45% - 8px)'}}
                name={"version"}
                label={"选择测试版本"}
              >
                <Tooltip title="根据测试版本过滤，为空表示all"><TreeSelect
                  treeData={getVersionListRequest.data ? getVersionListRequest.data.MsgInfo : []}
                  treeCheckable={true}
                  showCheckedStrategy={TreeSelect.SHOW_PARENT}
                  placeholder={'选择测试版本'}
                  style={{width: '100%'}}
                  maxTagCount={4}
                  onChange={onSelect}
                  allowClear
                  // treeDefaultExpandAll
                  treeDefaultExpandedKeys={["all"]}
                /></Tooltip>
              </Form.Item>
              <Form.Item
                style={{display: 'inline-block', width: 'calc(40% - 8px)', marginLeft: "16px"}}
                name={"keyWord"}
                label={"测试床名称"}
              >
                <Tooltip title="测试床名称">
                  <Input.Search allowClear placeholder={"根据测试床名称"} onSearch={onValuesChange}/>
                </Tooltip>
              </Form.Item>
              <Form.Item
                colon={false}
                style={{display: 'inline-block', width: 'calc(15% - 8px)'}}
                name={"keyWord"}
                label={"   "}
              >
                <Button
                  style={{position: "relative", left: "30%"}}
                  icon={<RollbackOutlined/>}
                  // ghost
                  type={"dashed"}
                  onClick={() => {
                    getBedListRequest.run({user: props.user.short_name, version: ["all"]});
                    form.resetFields()
                  }}
                > 重载测试床</Button>
              </Form.Item>
            </Form.Item>
          </Form>
          <LeftEnvDataSelect
            key={topo}
            topo={topo}
            okData={okData}
            BedName={currentData.Name}
            currentKeys={currentData.List}
            filteredItems={bedList}
            requestInstance={getBedListRequest}
            selectInstance={setEnvConfig}
          />
          <FooterToolbar>
            <Button
              // disabled={!!errorMsg}
              onClick={handleSubmit}
              type="primary">提交</Button>
          </FooterToolbar>
        </Col>
        <Col md={4} sm={24}>
          <span style={{color: '#40a9ff'}}>说明:</span><br/>
          <Divider style={{margin: 5}}/>
          <ul>
            {topo === "by_env" && <li><span style={{color: 'red'}}>不支持跨测试床选择环境，已最后一次选择为准</span></li>}
            <li>可根据版本或者床名称搜索</li>
            <li>环境搜索功能在表头</li>
          </ul>
          {/*<span style={{color:'#40a9ff'}}>当前选择的数据:</span><br/>*/}
          {/*<Divider style={{margin:5}}/>*/}
          {/*<ul style={{maxHeight: "150px", overflow: "auto"}}>*/}
          {/*  <li>*/}
          {/*    <span style={{color:'red'}}>TD_SDC_SDFASF_3510D</span>*/}
          {/*  </li>*/}
          {/*</ul>*/}
          <br/>
          <Divider style={{margin: 5}}/>
          <ul style={{maxHeight: "150px", overflow: "auto"}}>
            {currentData.List && currentData.List.length > 0 && currentData.List.map(item => {
              return (
                <li key={item.key}>
                  <span style={{color: 'red'}}>{item.testbedName || item.env_id}</span>
                </li>
              )
            })}
          </ul>
        </Col>
      </Row>
    </Drawer>

  )
};

export default EnvSelect
