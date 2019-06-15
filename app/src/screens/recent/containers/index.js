import React, { PureComponent } from "react"
import { FlatList } from "react-native"
import { NavigationActions } from 'react-navigation'
import { getServers, getRecent } from '../../../api'
import Empty from "../../../utils/components/empty"
import { getAvailableServers, getNatsukiVideo } from '../../../api/video-servers'
import VerticalSeparator from "../../../utils/components/separator"
import DropDownHolder from "../../../utils/dropdownholder"
import updateDirectory from "../../../api/update-directory"
import Card from "../../../utils/components/card"
import GeneralLayout from "../../../utils/components/general-layout"
import withHandlePressBack from "../../../navigation/handle-press-back"

class Recent extends PureComponent {

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
      this.props.dispatch({
        type: 'SET_RECENT_DATA',
        payload: recentList
      })
      this.setState({ refreshing: false })
    } catch (error) {
      this.setState({ refreshing: false })
      DropDownHolder.alert('error', 'Error', error.message)
    }
  }

  _onRefresh = () => { this._fetchData() }

  _onPressRecentCard = ({ id, number, anime }) => {
    (async () => {
      const server = await getServers(id)
      const availableServers = getAvailableServers(server)
      const natsukiVideoList = await getNatsukiVideo(id, availableServers)
      this.props.dispatch(NavigationActions.navigate({
        routeName: 'Player',
        params: {
          video: natsukiVideoList.length > 0 ? natsukiVideoList[0].file : '',
          title: `${anime.name} ${number}`
        }
      }))
    })()
  }

  _onLongPressRecentCard = episode => {
    let anime = this.props.directoryData.find(anime => anime.aid == episode.anime.aid)
    let executeFetch = false
    if (!anime) {
      DropDownHolder.alert('warn', 'El anime no esta en el directorio', 'Intenta actualizar el directorio')
      anime = episode.anime
      executeFetch = true
    }
    this.props.dispatch({type: 'SET_ANIME_DATA', payload: anime})
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'Anime',
      params: { executeFetch, title: anime.name }
    }))
  }

  _renderEmtpy = () => <Empty text='Sin animes recientes' />

  _itemSeparator = () => <VerticalSeparator numCards={this.props.mode ? 2 : 4} />

  _renderItem = ({ item, index }) => <Card
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

  _keyExtractor = item => item.id.toString()

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

function mapStateToProps(state) {
  return {
    list: state.recent.list,
    last: state.recent.last,
    mode: state.app.device.screenMode,
    screenWidth: state.app.device.screenSize.width,
    directoryUpdating: state.directory.updating,
    directoryData: state.directory.data
  }
}

export default RecentScreen = withHandlePressBack(mapStateToProps)(Recent)