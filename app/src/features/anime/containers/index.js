import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'
import { getAnimeDetails } from '../../../api'
import DropDownHolder from '../../../utils/dropdownholder'

class AnimeDetail extends Component {

  state = {
    loadded: false,
    anime: null,
    relations: []
  }

  fetchData = aid => {
    getAnimeDetails(aid)
      .then(data => {
        this.setState({ anime: data.anime, relations: data.relations, loadded: true })
      }).catch(e => {
        this.setState({ loadded: false })
        DropDownHolder.alert('error', "Error", "Error al cargar la informacion del anime")
      })
  }

  getData = () => {
    const anime = this.props.navigation.getParam('anime', null)
    const executeFetch = this.props.navigation.getParam('executeFetch', false)
    if (executeFetch) {
      this.fetchData(anime.aid)
    } else {
      this.setState({ anime, loadded: true })
    }
  }

  UNSAFE_componentWillMount() {
    this.getData()
  }

  render() {
    if (this.state.loadded) {
      return (
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

export default AnimeDetail