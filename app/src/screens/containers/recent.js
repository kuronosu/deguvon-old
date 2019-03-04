import React, { Component } from 'react'
import { connect } from 'react-redux'
import Recent from '../../features/recent/containers'
import AppLayout from './app-layout';

class RecentScreen extends Component {
  render(){
    return (
    <AppLayout>
      <Recent/>
    </AppLayout>
    )
  }
}
export default connect()(RecentScreen)