import React from "react"
import { DispatchProp } from "react-redux"
import { FlatList, Dimensions } from "react-native"
import { NavigationActions } from 'react-navigation'

import Card from "../../../utils/components/card"
import Empty from "../../../utils/components/empty"
import { getServers, getRecent } from '../../../api'
import { setAnimeData, setRecentData } from "../../../store/actions"
import DropDownHolder from "../../../utils/dropdownholder"
import updateDirectory from "../../../api/update-directory"
import { StoreState, recent, anime } from "../../../store/types"
import VerticalSeparator from "../../../utils/components/separator"
import GeneralLayout from "../../../utils/components/general-layout"
import withHandlePressBack from "../../../navigation/handle-press-back"
import { getAvailableServers, getNatsukiVideo } from '../../../api/video-servers'

type State = {
  refreshing: boolean
}

type Props = {
  list: recent.recentEpisode[]
  last: recent.last
  mode: boolean
  screenWidth: number
  directoryUpdating: boolean
  directoryData: anime.AnimeModel[]
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
      if (this.props.last.id != recentList[0].id && !this.props.directoryUpdating) {
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

  _onPressRecentCard = ({ id, number, anime }: recent.recentEpisode) => {
    (async () => {
      const server = await getServers(parseInt(id))
      const availableServers = getAvailableServers(server)
      const natsukiVideoList = await getNatsukiVideo(parseInt(id), availableServers)
      this.props.dispatch(NavigationActions.navigate({
        routeName: 'Player',
        params: {
          video: natsukiVideoList.length > 0 ? natsukiVideoList[0].file : '',
          title: `${anime.name} ${number}`
        }
      }))
    })()
  }

  _onLongPressRecentCard = (episode: recent.recentEpisode) => {
    let anime: anime.AnimeModel | recent.recentEpisode['anime'] | undefined = this.props.directoryData.find(anime => anime.aid == episode.anime.aid)
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

  _renderItem = ({ item, index }: {item: recent.recentEpisode, index: number}) => <Card
    pressData={item}
    mode={this.props.mode}
    screenWidth={this.props.screenWidth}
    index={index}
    onPressCard={this._onPressRecentCard}
    onLongPressCard={this._onLongPressRecentCard}
    image={item.anime.image}
    primaryText={item.anime.name}
    secondaryText={`Episodio ${item.number}`}
    cardsPerRowPortrait={2}
    cardsPerRowLandscape={4}
    primaryOverlay={true}
  />

  _keyExtractor = (item: recent.recentEpisode) => item.id.toString()

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