import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import logo from "@/assets/image/sdc.png"
import config from "@/config/app"
import CopyrightOutlined from "@ant-design/icons";

class HomeFooter extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
  };
  static defaultProps = {
    className: 'footer1',
  };
  getLiChildren = (data, i) => {
    const links = data.contentLink.split(/\n/).filter(item => item);
    const content = data.content.split(/\n/).filter(item => item)
      .map((item, ii) => {
        const cItem = item.trim();
        const isImg = cItem.match(/\.(jpg|png|svg|bmp|jpeg)$/i);
        return (<li className={isImg ? 'icon' : ''} key={ii}>
          <a href={(links[ii]!=='#'&&links[ii])||undefined} target={links[ii]&&links[ii].indexOf('mailto://')===0?'':'_blank'}>
            {isImg ? <img src={cItem} width="100%" alt={''}/> : cItem}
          </a>
        </li>);
      });
    return (<li className={data.className} key={i} id={`${this.props.id}-block${i}`}>
      <h2>{data.title}</h2>
      <ul>
        {content}
      </ul>
    </li>);
  };
  render() {
    const props = { ...this.props };
    const logoContent = { img: { logo }, content: 'Simple Test，让测试更简单。' };
    const linkEmails = (obj)=>{
      let content='', contentLink = '';
      obj.forEach((item)=>{
        content+=`${item.username}(${item.telephone})\n`;
        contentLink+=`mailto://${item.email}\n`
      });
      return {content , contentLink}
    };
    const linkUrls = (obj)=>{
      let content='', contentLink = '';
      obj.forEach((item)=>{
        content+=`${item.name}\n`;
        contentLink+=`${item.url}\n`
      });
      return {content , contentLink}
    };
    const dataSource = [
      { title: '更多产品', ...linkUrls(config.pageFooter.products) },
      { title: '友情链接', ...linkUrls(config.pageFooter.friendlyLink) },
      { title: '联系我们', ...linkEmails(config.pageFooter.contactUs) },
      { title: '版本信息', content: `
      用户手册\n
      此平台由华为-机器世界-智能安防-测试工具团队负责开发和维护。`,
        contentLink: `#\n#\n${config.appHelpLink}\n#` },
    ];
    const liChildrenToRender = dataSource.map(this.getLiChildren);
    return (<OverPack
      {...props}
      playScale={isMode ? 0.5 : 0.2}
    >
      <QueueAnim type="bottom" component="ul" key="ul" leaveReverse id={`${props.id}-ul`}>
        <li key="logo" id={`${props.id}-logo`}>
          <p className="logo">
            <img src={logoContent.img} style={{height:'32px'}} alt={''}/>
          </p>
          <p>{logoContent.content}</p>
        </li>
        {liChildrenToRender}
      </QueueAnim>
      <TweenOne
        animation={{ y: '+=30', opacity: 0, type: 'from' }}
        key="copyright"
        className="copyright"
        id={`${props.id}-content`}
      >
        <span>
            Copyright <CopyrightOutlined /> 2017-2018 <span style={{fontStyle:'italic',color:'#c4261d',fontWeight:800}}>HIK</span><span style={{fontStyle:'italic',color:'#5f5e5c',fontWeight:800}}>VISION </span>测试部出品
        </span>
      </TweenOne>
    </OverPack>);
  }
}

export default HomeFooter;
