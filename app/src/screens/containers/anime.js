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
  state = {
    aid: this.props.navigation.state.params.anime.aid
  }
  render(){
    return (
    <AppLayout nav={this.props.navigation}>
      <AnimeDetails aid={this.state.aid}/>
    </AppLayout>
    )
  }
}
export default connect(null)(RecentScreen)