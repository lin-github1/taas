import React from "react";
import {Button, Result} from "antd";


const SubmitResult = (props)=>{
  const {loading, title, extra, failedData} = props;
  const imgUrl = loading ? 'http://10.162.233.190:9000/minio/download/accounts-prod/public/images/busy_amt.gif?token='
    : 'http://10.162.233.190:9000/minio/download/accounts-prod/public/images/submit_success_amt.gif?token=';
  return (
    <Result
      icon={<></>}
      title={<img src={imgUrl} alt={"无图片"}/>}
      subTitle={<span style={{marginTop: "10px"}}>{title}</span>}
      extra={extra}
    />
  )

}

export default SubmitResult
