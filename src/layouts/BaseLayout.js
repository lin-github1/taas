import React, { Component, Fragment } from 'react'
import { withRouter } from "umi"
import Header from "@/components/Layout/Header";
import NProgress from 'nprogress'
import PublicLayout from './PublicLayout'
import './BaseLayout.less'
import Footer from "@/components/Layout/Footer";

const LayoutMap = {
  public: PublicLayout,
};

@withRouter
class BaseLayout extends Component {
  previousPath = '';

  render() {
    const { children, location, user } = this.props;
    const Container = LayoutMap["public"];
    const currentPath = location.pathname + location.search;
    if (currentPath !== this.previousPath) {
      NProgress.start()
    }
    return (
      <Fragment>
        <Header id="nav_1_0" key="nav_1_0" user={user}/>
        <Container style={{margin: "24px 24px 0"}} user={user}>{children}</Container>
        <Footer />
      </Fragment>
    )
  }
}

export default BaseLayout;
