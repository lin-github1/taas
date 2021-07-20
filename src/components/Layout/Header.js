import React, {Component} from 'react'
import TweenOne from 'rc-tween-one';
import {Alert, Menu} from 'antd'
import config from "@/config/app"
import headerMenu from "@/config/headerMenu"
import { history } from 'umi';
import './Header.less'

const Item = Menu.Item;
const SubMenu = Menu.SubMenu;


class Header extends Component {
  state = {
    // phoneOpen: false,
    selectedMenuKeys: []
  };
  componentDidMount() {
    this.loadMenu()
  };

  loadMenu = () => {
    const pathname = window.location.pathname;
    const selectedMenuKeys = [];
    headerMenu.map((subMenu) => {
      const keys = [];
      if (pathname.indexOf(`${config.apiPrefix}${subMenu.url}`) === 0) {
        selectedMenuKeys.push(subMenu.url)
      }
      if (subMenu.children && subMenu.children.length) {
        keys.push.apply(keys, subMenu.children.map(menu => {
          if (pathname.indexOf(`${config.apiPrefix}${menu.url}`) === 0) {
            selectedMenuKeys.push(menu.url);
            return menu.url
          } else return null
        }))
      }
      return keys
    });
    this.setState({selectedMenuKeys});
  };

  render() {
    const {user={}, className="sdc-header"} = this.props;
    const checkMenuPermission = (item) => {
      let flag = true;
      if (item.permissions && Array.isArray(item.permissions)) {
        flag = item.permissions.every(p => {
          if (p.rule === 'user') {
            if (this.props.user[p.field] && p.field === 'permissions' && this.props.user[p.field][item.url] === p.value) {
              return true
            } else if (this.props.user[p.field] && this.props.user[p.field] === p.value) {
              return true
            }
          }
          return false

        })
      }
      return flag
    };
    const navChildren = headerMenu.map((subMenu) => {
      if (subMenu.children && subMenu.children.length) {
        if (!checkMenuPermission(subMenu)) {
          return undefined
        }
        return (
          <SubMenu
            key={subMenu.url}
            name={subMenu.name}
            title={<span>{subMenu.icon}<span>{subMenu.name}</span></span>}>
            {
              subMenu.children.map(menu => (
                checkMenuPermission(menu)
                  ? <Menu.Item key={menu.url} name={menu.name}>{menu.name}</Menu.Item> : undefined
              ))
            }
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={subMenu.url} name={subMenu.name}>
          {subMenu.icon}<span className="nav-text">{subMenu.name}</span>
        </Menu.Item>
      )
    });
    const userTitle = (<div>
      <span className="img">
        <img
          src={`${user.avatar || "http://10.162.233.190:9000/accounts-prod/public/images/sdc.png?token="}`}
          width="30"
          height="30"
          alt={`${user&&user.short_name}头像`}
        />
      </span>
      <span>{(user&&user.first_name)||'未登录'}</span>
    </div>);
    return (
      <div>
        {/* {
          process.env.DEPLOY_ENV !== "prod" && <Alert
            message="您正在使用测试环境，如有需要，请移步到正式环境：http://icc.rnd.huawei.com/app/mctc/"
            type="warning"
            className={`${className}-banner`}
          />
        } */}
        <TweenOne
          component="header"
          animation={{ opacity: 0, type: 'from' }}
          id={this.props.id}
          className={ className }
        >
          <TweenOne
            className={`${className}-logo`}
            animation={{ x: -30, delay: 100, type: 'from', ease: 'easeOutQuad' }}
            id={`${this.props.id}-logo`}
          >
          <span className='logo'>
              <img src="http://10.162.233.190:9000/accounts-prod/public/images/sdc.png?token="
                   alt={`SDC-LOGO`}/>
          </span>
            <span className={'app-info'}>
               <span className="organization-name">
             SDC·
             </span>
              <span className="app-name">
                  {config.appName}
             </span>
          </span>
          </TweenOne>
          <TweenOne
            animation={{ x: 30, delay: 100, opacity: 0, type: 'from', ease: 'easeOutQuad' }}
            className={`${className}-nav`}
          >
            <Menu style={{float:'right'}} mode="horizontal" className={`${this.props.id}-menu`} selectedKeys={[]}>
              <SubMenu className="user" title={userTitle} key="user">
                {/*<Item key="cavatar" ><Upload accept="image/jpg,image/jpeg,image/png,image/gif" beforeUpload={this.onChangeAvatar}><div className={'changeAvatar'}>更换头像</div></Upload></Item>*/}
                <Item key="cp">
                  <div onClick={
                    ()=>{
                      window.location.href='https://his.huawei.com/me/#/Account/Pwd/ChangeHuaweiId'}
                  }>修改密码</div>
                </Item>
                <Item key="logout">
                  <div onClick={
                    ()=>{
                      window.location.href=`/accounts/logout/?next=${window.location.pathname}`}
                  }>登出系统</div></Item>
              </SubMenu>
            </Menu>
            <Menu
              mode="horizontal"
              style={{float:'right'}}
              className={`${this.props.id}-menu`}
              defaultSelectedKeys={this.state.selectedMenuKeys}
              selectedKeys={this.state.selectedMenuKeys}
              onSelect={({keyPath})=>{
                this.setState({selectedMenuKeys:keyPath})
              }}
              onClick={({key})=>{
                history.push(`${config.baseUri}${key}`)
              }}
            >
              {navChildren}
            </Menu>
          </TweenOne>
        </TweenOne>
      </div>

    )
  }
}

export default Header;
