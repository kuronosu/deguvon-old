import React, { Component } from 'react'
import AppLayout from './app-layout';
import Settings from '../../features/settings/containers'

export default class SettingsScreen extends Component {
  render(){
    return (
    <AppLayout>
      <Settings/>
    </AppLayout>
    )
  }
}