import React, { Component } from 'react'
import AnimeDetails from '../../features/anime/containers/index'
import AppLayout from './app-layout';

export default class RecentScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('anime', {name: 'Anime'}).name
    }
  }

  render(){
    return (
    <AppLayout>
      <AnimeDetails/>
    </AppLayout>
    )
  }
}