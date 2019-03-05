import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppLayout from './app-layout';
import Settings from '../../features/settings/containers'

class SettingsScreen extends Component {
  render(){
    return (
    <AppLayout>
      <Settings/>
    </AppLayout>
    )
  }
}
export default connect()(SettingsScreen)