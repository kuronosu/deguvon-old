import React, { Component } from 'react'
import {
  Image,
  Dimensions,
  View,
  Text,
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { getAnimeDetails, getServers } from '../../../api'
import { getAvailableServers, getNatsukiVideo } from '../../../api/video-servers'
import DropDownHolder from '../../../utils/dropdownholder'
import Icon from '../../../utils/components/icon'
import { FlatList } from 'react-native-gesture-handler';

const p = 135 / 240

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

  showEpisode = (id, number, name ) => {
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

  renderEpisode = ({ item: episode, index }) => (
    <View style={{
      flexDirection: 'row',
      height: (Dimensions.get('window').width * 0.25) * p
    }}>
      <Image
        source={{uri: "https://kuronosu.dev" + episode.image}}
        style={{
          width: Dimensions.get('window').width * 0.25,
        }}
        resizeMode='contain'
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <Text style={{fontSize: 20}}>{`Episodio ${episode.number}`}</Text>
        <View
          style={{
            paddingHorizontal: 20,
            alignItems: 'flex-end',
            flex: 1
          }}
        >
          <Icon
            onPress={() => this.showEpisode(episode.url.split('/')[2], episode.number, this.state.anime.name)}
            iconSet='Entypo'
            name='controller-play'
            size={40}
            color='black'
          />
        </View>
      </View>
    </View>
  )
  _keyExtractor = item => `episode_${item.number}_${item.url}`
  itemSeparator = () => <View style={{borderColor: 'black', borderBottomWidth: 1}}/>

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
              ItemSeparatorComponent={this.itemSeparator}
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