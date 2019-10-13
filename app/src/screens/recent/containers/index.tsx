import React from "react"
import { DispatchProp } from "react-redux"
import { FlatList, Dimensions } from "react-native"
import { NavigationActions } from 'react-navigation'

import { StoreState, RecentEpisode, AnimeModel, RecentStore } from "../../../"
import Card from "../../../utils/components/card"
import Empty from "../../../utils/components/empty"
import { getEpisodeData, getRecent } from '../../../api'
import { setAnimeData, setRecentData } from "../../../store/actions"
import DropDownHolder from "../../../utils/dropdownholder"
import updateDirectory from "../../../api/update-directory"
import VerticalSeparator from "../../../utils/components/separator"
import GeneralLayout from "../../../utils/components/general-layout"
import withHandlePressBack from "../../../navigation/handle-press-back"
import { getNatsukiVideo } from '../../../api/video-servers'

type State = {
  refreshing: boolean
}

type Props = {
  list: RecentEpisode[]
  last: RecentStore["last"]
  mode: boolean
  screenWidth: number
  directoryUpdating: boolean
  directoryData: AnimeModel[]
}

class Recent extends React.PureComponent<Props & DispatchProp, State> {

  state = {
    refreshing: false
  }

  componentDidMount() {
    this._fetchData()
  }

  async _fetchData() {
    try {
      this.setState({ refreshing: true })
      let recentList = await getRecent()
      if (this.props.last != recentList[0].animeflv_url && !this.props.directoryUpdating) {
        updateDirectory()
      }
      this.props.dispatch(setRecentData(recentList))
      this.setState({ refreshing: false })
    } catch (error) {
      this.setState({ refreshing: false })
      DropDownHolder.alert('error', 'Error', error.message)
    }
  }

  _onRefresh = () => { this._fetchData() }

  _onPressRecentCard = ({ number, anime }: RecentEpisode) => {
    (async () => {
      // const server = await getServers(anime.aid, number)
      // const availableServers = getAvailableServers(server)
      const natsukiData = await getNatsukiVideo(anime.aid, number)
      this.props.dispatch(NavigationActions.navigate({
        routeName: 'Player',
        params: {
          video: natsukiData.videos.length > 0 ? natsukiData.videos[0].file : '',
          title: `${anime.name} ${number}`
        }
      }))
    })()
  }

  _onLongPressRecentCard = (episode: RecentEpisode) => {
    let anime: AnimeModel | RecentEpisode['anime'] | undefined = this.props.directoryData.find(anime => anime.aid == episode.anime.aid)
    let executeFetch = false
    if (!anime) {
      DropDownHolder.alert('warn', 'El anime no esta en el directorio', 'Intenta actualizar el directorio')
      anime = episode.anime
      executeFetch = true
    }
    this.props.dispatch(setAnimeData(anime))
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'Anime',
      params: { executeFetch, title: anime.name }
    }))
  }

  _renderEmtpy = () => <Empty text='Sin animes recientes' />

  _itemSeparator = () => <VerticalSeparator numCards={this.props.mode ? 2 : 4} />

  _renderItem = ({ item, index }: {item: RecentEpisode, index: number}) => <Card
    pressData={item}
    mode={this.props.mode}
    screenWidth={this.props.screenWidth}
    index={index}
    onPressCard={this._onPressRecentCard}
    onLongPressCard={this._onLongPressRecentCard}
    image={item.anime.cover}
    primaryText={item.anime.name}
    secondaryText={`Episodio ${item.number}`}
    cardsPerRowPortrait={2}
    cardsPerRowLandscape={4}
    primaryOverlay={true}
  />

  _keyExtractor = (item: RecentEpisode) => `${item.anime.aid}:${item.number}`

  render() {
    return (
      <GeneralLayout>
        <FlatList
          data={this.props.list}
          ListEmptyComponent={this._renderEmtpy}
          ItemSeparatorComponent={this._itemSeparator}
          numColumns={this.props.mode ? 2 : 4}
          key={this.props.mode ? 'v' : 'h'}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          contentContainerStyle={{ padding: this.props.mode ? this.props.screenWidth * 1 / 30 : this.props.screenWidth * 1 / 50 }}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
        />
      </GeneralLayout>
    )
  }
}

function mapStateToProps(state: StoreState): Props {
  return {
    list: state.recent.list,
    last: state.recent.last,
    mode: state.app && state.app.device? state.app.device.screenMode: true,
    screenWidth: state.app && state.app.device? state.app.device.screenSize.width: Dimensions.get("screen").width,
    directoryUpdating: state.directory.updating,
    directoryData: state.directory.data
  }
}

const RecentScreen = withHandlePressBack<Props>(mapStateToProps)(Recent)
export default RecentScreen