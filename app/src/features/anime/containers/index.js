import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { getAnimeDetails, getServers } from '../../../api'
import { getAvailableServers, getNatsukiVideo } from '../../../api/video-servers'
import DropDownHolder from '../../../utils/dropdownholder'
import Episode from '../components/episode'

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

  componentDidMount() {
    this.getData()
  }

  playEpisode = (id, number, name ) => {
    (async () => {
      const server = await getServers(id)
      const availableServers = getAvailableServers(server)
      const natsukiVideoList = await getNatsukiVideo(id, availableServers)
      this.props.dispatch(NavigationActions.navigate({
        routeName: 'Player',
        params: {
          video: natsukiVideoList.length > 0 ? natsukiVideoList[0].file : '',
          title: `${name} ${number}`
        }
      }))
    })()
  }

  renderEpisode = ({ item: e }) => (
    <Episode
      episode={e}
      playHandle={() => this.playEpisode(e.url.split('/')[2], e.number, this.state.anime.name)}
    />
  )

  _keyExtractor = item => `episode_${item.number}_${item.url}`

  renderSeparator = () => <View
    style={{
      height: 1,
      width: "75%",
      backgroundColor: "#CED0CE",
      marginLeft: "25%",
      marginVertical: 1
    }}
  />

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
            <FlatList
              data={this.state.anime.episodeList}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderEpisode}
              ItemSeparatorComponent={this.renderSeparator}
            />
          </View>
          <Text>{this.state.anime.synopsis}</Text>
          <Text>{this.state.anime.typea}</Text>
        </ScrollView>
      )
    }
    return <View><Text>Cargando</Text></View>
  }
}

export default connect(null)(AnimeDetail)