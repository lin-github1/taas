import { EyeOutlined, WindowsOutlined } from "@ant-design/icons";

const headerMenu = [
  // {
  //   name: '开始测试', icon: <EyeOutlined/>, url: '/case/runner',
  //   children: [
  //     {name: '用例执行', url: '/case/runner'},
  //     // {name: '用例集管理', url: '/case/config'}
  //   ],
  // },
  // {
  //   name: '任务中心', icon: <WindowsOutlined/>, url: '/task',
  //   children: [
  //     {name: '用例集管理', url: '/case/config'},
  //     {name: '任务管理', url: '/task'},
  //     {name: '执行记录', url: '/task/execution'},
  //     // {name: '通知公告', url: '/developer/announce'},
  //     // {name: 'APP管理', url: '/developer/application'},
  //   ],
  // },
  {
    name: '半自动化任务', icon: <WindowsOutlined/>, url: '/wtecard',
    children: [
      {name: '新建任务', url: '/wtecard/config'},
      {name: '任务管理', url: '/task'},
      // {name: '任务管理', url: '/task'},
      // {name: '执行记录', url: '/task/execution'},
      // {name: '通知公告', url: '/developer/announce'},
      // {name: 'APP管理', url: '/developer/application'},
    ],
  },
];

export default headerMenu
