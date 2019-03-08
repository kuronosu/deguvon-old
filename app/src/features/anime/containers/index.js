import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import Api from '../../../api/index'

class AnimeDetail extends Component {

  state = {
    loadded: false,
    anime: null
  }

  fetchData = () => {
    Api.getAnimeDetails(this.props.navigation.getParam('anime', {aid: -1}).aid)
    .then(data => {
      this.setState({anime: data.anime, relations: data.relations, loadded: true});
    }).catch(e => this.setState({loadded: false}));
  }

  componentWillMount(){
    this.fetchData()
  }
  render(){
    if (this.state.loadded){
      return(
        <ScrollView>
          <Text>{this.state.anime.name}</Text>
          <View>
            {
              this.state.anime.genres.map(g => (
                <Text key={`genre_${g}_${this.state.anime.aid}`}>{g}</Text>
              ))
            }
            {
              this.state.anime.episodeList.map(e => (
                <Text key={`episode_${e.number}_${e.url}`}>{e.number}</Text>
              ))
            }
          </View>
          <Text>{this.state.anime.synopsis}</Text>
          <Text>{this.state.anime.typea}</Text>
        </ScrollView>
      )
    }
    return <View><Text>Cargando</Text></View>
  }
}

export default withNavigation(connect(null)(AnimeDetail))