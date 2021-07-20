import React, {Component} from 'react';
import GlobalFooter from "@/components/GlobalFooter";
import './Footer.less';
import CopyrightCircleOutlined from "@ant-design/icons/lib/icons/CopyrightCircleOutlined";


class Footer extends Component {
  render() {
    return <GlobalFooter
      className={'page-footer'}
      links={[{
        title: 'SDC·工具平台',
        href: 'http://sdc.huawei.com',
        blankTarget: true,
      }, {
        title: 'SDC部门主站',
        href: 'http://sdc.resource.huawei.com/',
        blankTarget: true,
      }, {
        title: '邮件反馈',
        href: 'mailto:sumuzhong@huawei.com?subject=Feedback：SDC工具系统问题反馈',
        blankTarget: false,
      }]}
      copyright={
        <div>
          Copyright <CopyrightCircleOutlined />
          2020-2021
          <span style={{fontStyle:'italic',color:'#c4261d',fontWeight:800}}>华为 · </span>
          <span style={{fontStyle:'italic',color:'#5f5e5c',fontWeight:800}}>机器视觉 · </span>
          <span style={{fontStyle:'italic',color:'#5f5e5c',fontWeight:800}}>SDC-OS · </span>
          工具效率提升团队出品
        </div>
      }
    />
  }
}

export default Footer;
