import React, { Component } from 'react'
import { View, Text } from 'react-native'
import AppLayout from './app-layout';

export default class DirectoryScreen extends Component {
  render(){
    return (
    <AppLayout>
      <View><Text>DirectoryScreen</Text></View>
    </AppLayout>
    )
  }
}