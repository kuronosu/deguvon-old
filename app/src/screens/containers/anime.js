import React, { Component } from 'react'
import { connect } from 'react-redux'
import AnimeDetails from '../../features/anime/containers/index'
import AppLayout from './app-layout';

class RecentScreen extends Component {
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
export default connect(null)(RecentScreen)