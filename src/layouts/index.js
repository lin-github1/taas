import React from 'react'
import { Loader } from "@/components"
import BaseLayout from './BaseLayout'
import { getAppUserInfo } from "@/services/user";
import { useRequest  } from '@umijs/hooks';

export default function Layout(props) {
  // const {data, error, loading} = useRequest(() => getAppUserInfo(), {});
  const {data, error, loading} = useRequest(getAppUserInfo);
  return loading
    ? <Loader fullScreen/>
    : React.Children.map(props.children, child => {
        const userInfo = data ? data.MsgInfo : {};
        return React.cloneElement(<BaseLayout user={userInfo}>{child}</BaseLayout>)
      })
  // if (data && data.MsgInfo) {
  //   return React.Children.map(props.children, child => {
  //     const userInfo = data ? data.MsgInfo : {};
  //     return React.cloneElement(<BaseLayout user={userInfo}>{child}</BaseLayout>)
  //   });
  // } else {
  //   return <Loader fullScreen/>
  // }
}
