import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Form, Input, Popconfirm, Table} from "antd";
// import EditableRow from "@/pages/componets/EditableTable/EditableRow";
// import EditableCell from "@/pages/componets/EditableTable/EditableCell";
import "./index.less"

const EditableContext = React.createContext();
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({title, editable, children, dataIndex, record, handleSave, ...restProps}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async e => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({...record, ...values});
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};


class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      dataSource: props.dataSource
    }
  }
  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter(item => item.key !== key),
    });
  };

  // handleAdd = (data) => {
  //   const { count, dataSource } = this.props;
  //   this.setState({
  //     dataSource: [...dataSource, data],
  //     count: count + 1,
  //   });
  // };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };

  render() {
    const { dataSource } = this.state;
    const { title, columns } = this.props;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const _columns = columns.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        {/*<Button*/}
        {/*  onClick={this.handleAdd}*/}
        {/*  type="primary"*/}
        {/*  style={{*/}
        {/*    marginBottom: 16,*/}
        {/*  }}*/}
        {/*>*/}
        {/*  Add a row*/}
        {/*</Button>*/}
        <Table
          title={title}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={_columns}
          pagination={false}
          size={"small"}
          showHeader={false}
        />
      </div>
    );
  }
}

export default EditableTable
