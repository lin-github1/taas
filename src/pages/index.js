import React, { PureComponent } from 'react'
import { Redirect, connect } from 'umi'
import { withI18n } from '@lingui/react'

// @withI18n()
class Index extends PureComponent {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     userInfo: {}
  //   };
  // }
  // componentWillMount() {
  //   const { dispatch } = this.props;
  //   if (dispatch){
  //     dispatch({
  //       type: "user/getUserInfo"
  //     });
  //   }
  // }
  render() {
    // console.log(this.state.userInfo);
    // const { i18n } = this.props;
    return <Redirect to={`/task`} />
  }
}
export default Index
// export default connect(({ user }) => ({
//   userInfo: user.userInfo
// }))(Index);
