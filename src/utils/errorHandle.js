import React from 'react';
import {Modal, notification} from 'antd';
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";

const HTTP_401 = () => {
  Modal.info({
    title: '提示 认证过期·HTTP401',
    content: (
      <div>
        <br/>
        <p>尊敬的用户：</p>
        <p style={{textIndent: '2em'}}>
          您好，为了保证您的数据安全，您的令牌Token已过期，请您
          <span style={{color: '#108ee9'}}>重新登录</span>。
        </p>
        <p style={{textIndent: '2em'}}>您点击“知道了”按钮后，系统将会自动跳转到登录界面，感谢您的配合。</p>
        <br/>
        <div style={{textAlign: 'right'}}>SDC工具·前端中心</div>
      </div>
    ),
    onOk() {
      window.location.reload();
      // window.location.href=`/accounts/login/?next=${window.location.pathname}`;
    }
  });
};
const HTTP_403 = () => {
  Modal.error({
    title: '提示 权限不足·HTTP403',
    content: (
      <div>
        <br/>
        <p>尊敬的用户：</p>
        <p style={{textIndent: '2em'}}>
          您好，您的权限不足，服务器拒绝您的操作。如有需要，请您
          <span style={{color: '#108ee9'}}>联系管理员</span>。
        </p>
        <br/>
        <div style={{textAlign: 'right'}}>SDC工具·前端中心</div>
      </div>
    ),
    onOk() {
      // window.location.reload();
    }
  });
};
const HTTP_404 = () => {
  Modal.error({
    title: '错误 资源未找到·HTTP404',
    content: (
      <div>
        <br/>
        <p>尊敬的用户：</p>
        <p style={{textIndent: '2em'}}>
          您好，您请求的资源无法再服务器中找到，请确认。如有需要，请您
          <span style={{color: '#108ee9'}}>联系管理员</span>。
        </p>
        <br/>
        <div style={{textAlign: 'right'}}>SDC工具·前端中心</div>
      </div>
    ),
    onOk() {
      // window.location.reload();
    }
  });
};
const HTTP_405 = () => {
  Modal.error({
    title: '错误 请求资源方法不允许·HTTP405',
    content: (
      <div>
        <br/>
        <p>尊敬的用户：</p>
        <p style={{textIndent: '2em'}}>
          您好，请求资源方法不允许，请联系管理员。如有需要，请您
          <span style={{color: '#108ee9'}}>联系管理员</span>。
        </p>
        <br/>
        <div style={{textAlign: 'right'}}>SDC工具·前端中心</div>
      </div>
    ),
    onOk() {
      // window.location.reload();
    }
  });
};
const HTTP_500 = () => {
  Modal.error({
    title: '错误 内部服务器错误·HTTP500',
    content: (
      <div>
        <br/>
        <p>尊敬的用户：</p>
        <p style={{textIndent: '2em'}}>
          您好，由于系统的出现了问题，暂时无法为您提供服务，在此表示深深地歉意。如有需要，请您
          <span style={{color: '#108ee9'}}>联系管理员</span>。
        </p>
        <br/>
        <div style={{textAlign: 'right'}}>SDC工具·前端中心</div>
      </div>
    ),
    onOk() {
      // window.location.reload();
    }
  });
};
const HTTP_504 = () => {
  Modal.error({
    title: '错误 服务器超时·HTTP504',
    content: (
      <div>
        <br/>
        <p>尊敬的用户：</p>
        <p style={{textIndent: '2em'}}>
          您好，服务器响应超时，暂时无法为您提供服务，在此表示深深地歉意。如有需要，请您
          <span style={{color: '#108ee9'}}>联系管理员</span>。
        </p>
        <br/>
        <div style={{textAlign: 'right'}}>SDC工具·前端中心</div>
      </div>
    ),
    onOk() {
      // window.location.reload();
    }
  });
};
const GET_TOKEN_FAILED = () => {
  Modal.error({
    title: '错误 Token获取失败',
    content: (
      <div>
        <br/>
        <p>尊敬的用户：</p>
        <p style={{textIndent: '2em'}}>
          您好，系统发生了错误，无法为您获取到访问该应用的令牌Token，请您
          <span style={{color: '#108ee9'}}>联系管理员</span>。
        </p>
        <p style={{textIndent: '2em'}}>
          您点击“知道了”按钮后，系统将会自动帮助您启动邮箱，请您通过邮件反馈您的问题。感谢您的配合。
        </p>
        <br/>
        <div style={{textAlign: 'right'}}>SDC工具·前端中心</div>
      </div>
    ),
    onOk() {
      window.location.href = 'mailto:sumuzhong@huawei.com?subject=反馈：SDC工具 Token无法获取问题';
    }
  });
};

const API_ERROR = (error_code, error_msg) => {
  Modal.confirm({
    title: '操作异常',
    icon: <CloseCircleOutlined style={{color: "#ff4d4f"}} />,
    content: (
      <div>
        <br/>
        <p>尊敬的用户：</p>
        <p style={{textIndent: '2em'}}>
          错误码： <span style={{color: '#ff4d4f'}}>{error_code}</span>。
        </p>
        <p style={{textIndent: '2em'}}>
          错误描述： <span style={{color: '#ffc069'}}>{error_msg}</span>。
        </p>
        <p style={{textIndent: '2em'}}>
          若您对此存在疑惑，请点击“发送报告”按钮，系统将会自动帮助您启动邮箱，请您通过邮件反馈您的问题。感谢您的配合。
        </p>
        <br/>
        <div style={{textAlign: 'right'}}>SDC工具·前端中心</div>
      </div>
    ),
    cancelText: "取消",
    okText: "发送报告",
    onOk() {
      window.location.href = `mailto:sumuzhong@huawei.com?subject=反馈：SDC工具 接口调用失败[${error_code}]`;
    },
    width: "500px"
  });
};

export const ErrorHandle = {
  401: HTTP_401,
  403: HTTP_403,
  404: HTTP_404,
  405: HTTP_405,
  500: HTTP_500,
  504: HTTP_504,
  TOKEN: GET_TOKEN_FAILED,
  APIERROR: API_ERROR,
  // default: function () {
  //   notification.error({
  //     message: "请求错误",
  //     description: "未处理的HTTP请求错误",
  //   });
  // }
};

// export const ErrorHandle={
//   HTTP_401,
//   HTTP_403,
//   HTTP_404,
//   HTTP_500,
//   HTTP_504,
//   HTTP_405,
//   GET_TOKEN_FAILED,
// };
