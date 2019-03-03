import React, { Component } from 'react'
import Recent from '../../features/recent/containers'

export default class RecentScreen extends Component {

  handlePress = aid => {
    // this.props.navigation.navigate('Anime', {aid});
  }
  render(){
    return <Recent onShowAnimeDetail={this.handlePress}/>
  }
}
