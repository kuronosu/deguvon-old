import React, { Component } from 'react'
import Recent from '../../features/recent/containers'
import AppLayout from './app-layout';

export default class RecentScreen extends Component {
  render(){
    return (
    <AppLayout>
      <Recent/>
    </AppLayout>
    )
  }
}