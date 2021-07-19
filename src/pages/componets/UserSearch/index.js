import React, {Component} from 'react';
import {Input, Button, Modal, Tree, Row, Col, Tabs, Table, Select, Spin, message} from 'antd';
import PropTypes from 'prop-types';

import './UserSelect.less';
import uuid from 'uuid';
import {getChildrenDepartment, getDepartmentUserList, searchUserList} from '../../../api/rmc';
class DepartmentUserSelect extends Component {
  state = {
    owmGroupTreeData: [],
    ownGroupTreeExpandedKeys:[],
    canSelectUsers:[],
    selectUserKeys: [],
    tableLoading: false
  };
  async componentWillMount(){
    const [owmGroupTreeData, ownGroupTreeExpandedKeys] = this.splitDepartment(this.props.userDepartment);


    this.setState({owmGroupTreeData,  ownGroupTreeExpandedKeys});
  }

  async componentDidMount(){
    let optionDepartments = [];
    if(!this.props.isOwnGroup){
      optionDepartments = await this.getDepartments();

    }
    else{
      const userDepartmentLevel0 = (this.props.userDepartment.split('\\')[0]) || '产品研发中心';
      const userDepartmentLevel1 = (this.props.userDepartment.split('\\')[1]);
      optionDepartments = [{
        title: userDepartmentLevel0,
        key:  userDepartmentLevel0,
        value: userDepartmentLevel0,
        children:[
          {
            title: userDepartmentLevel1,
            key:  userDepartmentLevel0 + '\\' + userDepartmentLevel1,
            value: userDepartmentLevel0 + '\\' + userDepartmentLevel1
          }
        ]

      }];
    }
    this.setState({optionDepartments});
    this.onTreeNodeSelect([this.props.userDepartment ]);
  }
  splitDepartment = (str)=>{
    const udArray = str.split('\\');
    let ownGroupTreeExpandedKeys = [];
    const udNewArray = udArray.map((item,index)=>{
      const value = udArray.slice(0, index+1).join('\\');
      ownGroupTreeExpandedKeys.push(value);
      return {
        title: item,
        key:  value,
        value: value
      };
    });

    return [this.makeOwnGroupTreeData(udNewArray, 0), ownGroupTreeExpandedKeys];

  }
  onTreeNodeSelect = (selectKeys)=>{

    if(selectKeys.length<1){
      return false;
    }
    if(selectKeys[0].split('\\').length<=2){
      message.error('一二级部门不允许选择。');
      return false;
    }

    this.setState({tableLoading:true});
    getDepartmentUserList(selectKeys[0], 'oa').then(({data})=>{
      this.setState({
        canSelectUsers:data.map(item=>({username:item, key:item})), selectUserKeys: data, tableLoading:false
      });
    });
  }
  makeOwnGroupTreeData = (udArray, index)=>{
    if(udArray.length>index+1){
      return [{...udArray[index], children: this.makeOwnGroupTreeData(udArray, index+1)}];
    }
    else{
      return [udArray[index]];
    }
  }
  oneOwnGroupTreeExpand = (ownGroupTreeExpandedKeys) => {

    this.setState({
      ownGroupTreeExpandedKeys,
      autoExpandParent: false
    });
  }
  getDepartments = (department) => new Promise((resolve) => {
    getChildrenDepartment(department)
      .then((res) => {

        const departments = res.data.map(item => {
          return {
            title: item,
            key: department ? `${department}\\${item}` : item,
            value: department ? `${department}\\${item}` : item
          };
        });
        resolve(departments);

      }).catch(() => {
      resolve([]);
    });
  })
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <Tree.TreeNode dataRef={item}
                         key={item.key}
                         title={item.title}
                         value={item.value}
          >
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode {...item} key={item.key}
                            dataRef={item}
      />;
    });
  }
  loadData = (treeNode) => {
    // if(treeNode instanceof  TreeSelect.TreeNode){
    return new Promise((resolve) => {

      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        this.getDepartments(treeNode.props.eventKey).then((optionDepartmentsChildren) => {
          treeNode.props.dataRef.children = optionDepartmentsChildren;


          this.setState({
            optionDepartments: [...this.state.optionDepartments]
          });
          resolve();
        });

      }, 1000);
    });
    // }

  }
  onUserSelectChange = (selectUserKeys) => {

    this.setState({ selectUserKeys });
  }
  getData=()=>{

    return this.state.selectUserKeys;
  }
  render(){
    const {optionDepartments=[], owmGroupTreeData=[], ownGroupTreeExpandedKeys=[], selectUserKeys=[], canSelectUsers=[], tableLoading} = this.state;

    return <div>
      <Row gutter={24}>
        <Col md={16} >
          <Tabs  defaultActiveKey="own">
            <Tabs.TabPane key="own"
                          tab={'我的部门'}
            >
              <Tree
                defaultExpandAll
                expandedKeys={ownGroupTreeExpandedKeys}
                onExpand={this.oneOwnGroupTreeExpand}
                onSelect={this.onTreeNodeSelect}
                showLine
              >
                {this.renderTreeNodes(owmGroupTreeData)}
              </Tree>


            </Tabs.TabPane>
            <Tabs.TabPane key="more"
                          tab={'更多部门'}
            >
              <div style={{maxHeight:'450px', height:'450px', overflowY:'auto'}}>
                <Tree


                  // treeData={optionDepartments}
                  loadData={this.loadData}
                  onSelect={this.onTreeNodeSelect}



                >
                  {this.renderTreeNodes(optionDepartments)}
                </Tree>
              </div>

            </Tabs.TabPane>
          </Tabs>
        </Col>
        <Col md={8}
             style={{maxHeight:'520px', height:'520px', overflowY:'auto'}}
        >
          <p>
            共选择<span style={{color:'#f5222d'}}>{selectUserKeys.length}</span>位用户</p>
          <Table className={'selectUserTable'}
                 columns={[{
                   title: '用户名',
                   dataIndex: 'username'

                 }]}
                 dataSource={canSelectUsers}
                 loading={tableLoading}
                 pagination={false}
                 rowSelection={{
                   selectedRowKeys:selectUserKeys,
                   onChange: this.onUserSelectChange
                 }}
                 scroll={{ y: 430 }}
          />
        </Col>
      </Row>

    </div>;
  }

}


class UserSelect extends Component {
  static propTypes = {

    value: PropTypes.array,
    defaultValue: PropTypes.array,
    isOwnGroup:PropTypes.bool,
    userDepartment: PropTypes.string

  };
  state = {
    modalVisible:false,
    value:[]
  }
  getUser = (value) => {
    const v1= uuid.v1();
    this.requestUUID = v1;
    this.setState({ fetching: true });
    searchUserList(value).then((res)=>{
      if (v1===this.requestUUID){
        this.setState({
          fetching: false,
          users : res.data
        });
      }

      // this.props.form.setFieldsValue({'excel':res.data.items[0].uuid})
    });
  }
  onChange=()=>{
    const {value} = this.state;
    let returnValue = value;
    this.props.onChange(returnValue.length>0?returnValue:undefined);
  }
  onSelect=(username)=>{
    const {value = []} = this.state;
    if(!value.includes(username)){

      value.push(username);
      this.setState({value},   this.onChange);

    }


  }
  render() {
    const {modalVisible, fetching, users=[] } = this.state;
    const {value=[]} = this.props;

    return (<div className={'userSelect'}>
      <Select
        allowClear
        // labelInValue
        filterOption={false}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onSearch={this.getUser}
        onSelect={this.onSelect}
        placeholder="人名查询"
        showSearch
        value={undefined}

      >
        {users&&(users.map(d => {return <Select.Option key={d.username}
                                                       value={d.username}
        >{d.first_name}/{d.username} - {d.department}</Select.Option>;}))}
      </Select>



      <Input.TextArea autosize={{ minRows: 4, maxRows: 6 }}
                      onChange={(e)=>{
                        // 去除空格、去除
                        if(!e.target.value){
                          this.setState({value:[]},this.onChange);
                        }
                        else{
                          const splitValue =  e.target.value.replace(/[\s|;|，|；]/,',').split(',');

                          let value =splitValue.filter((item,index)=>(!!item||(!item&&index===splitValue.length-1)));

                          this.setState({value},this.onChange);
                        }


                      }}
                      placeholder={'输入oa note名，请用逗号分隔'}
                      value={(value||[]).join(',')}
      />




      {/*<Button>检查人名</Button>*/}
      <Button onClick={()=>{
        this.setState({modalVisible:true});
      }}
      >选择部门</Button>
      <Button onClick={()=>{
        this.setState({value:[]}, this.props.onChange);
      }}
      >清空选择</Button>
      <Modal cancelText={'取消'}
             okText={'加入'}
             onCancel={()=>{
               this.setState({modalVisible:false}, this.onChange);
             }}
             onOk={()=>{
               const usernames = this.departmentUserNode.getData();
               let {value=[]} = this.state;

               value.push.apply(value, usernames);

               this.setState({modalVisible:false, value:Array.from(new Set(value))}, this.onChange);

             }}
             title={'选择部门'}
             visible={modalVisible}
             width={1000}
      >
        <DepartmentUserSelect isOwnGroup={this.props.isOwnGroup}
                              ref={node=>this.departmentUserNode = node}
                              userDepartment={this.props.userDepartment}
        />

      </Modal>


    </div>);
  }
}

export default UserSelect;
