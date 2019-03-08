import React, { Component } from 'react'
import AppLayout from './app-layout';
import Directory from '../../features/directory/containers';

export default class DirectoryScreen extends Component {
  render(){
    return (
    <AppLayout>
      <Directory/>
    </AppLayout>
    )
  }
}