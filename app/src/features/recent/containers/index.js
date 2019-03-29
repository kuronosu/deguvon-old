import React, { PureComponent } from "react";
import { FlatList } from "react-native";
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation'
import Layout from "../components/recent-layout";
import Api from '../../../api/index'
import Empty from "../components/empty";
import VerticalSeparator from "../components/separator";
import DropDownHolder from "../../../utils/dropdownholder";
import updateDirectory from "../../../utils/update-directory";
import Card from "../../../utils/components/card";

class Recent extends PureComponent{

  state = {
    refreshing: false
  }

  componentDidMount(){
    this._fetchData()
  }

  async _fetchData(){
    try {
      this.setState({refreshing: true})
      let recentList = await Api.getRecent();
      if (this.props.last.id != recentList[0].id && !this.props.directoryUpdating){
        updateDirectory()
      }
      this.props.dispatch({
        type: 'SET_RECENT_DATA',
        payload: {
          recentList
        }
      })
      this.setState({refreshing: false})
    } catch (error) {
      this.setState({refreshing: false})
      DropDownHolder.alert('error', 'Error', 'Error obtener los ultimos episodios')
    }
  }

  _onRefresh = () => {this._fetchData()}

  _onPressRecentCard = aid => {}

  _onLongPressRecentCard = aid => {
    const anime = this.props.directoryData.find(anime => anime.aid == aid)
    this.props.dispatch({
      type: 'SET_ANIME_DATA',
      payload: anime
    })
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'Anime',
      params: {anime}
    }))
  }

  _renderEmtpy = () => <Empty text='Sin animes recientes' color='white'/>

  _itemSeparator = () => <VerticalSeparator mode={this.props.mode} />

  _renderItem = ({item, index}) =>  <Card
    id={item.anime.aid}
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

  render(){
    return(
      <Layout>
        <FlatList
          data={this.props.list}
          ListEmptyComponent={this._renderEmtpy}
          ItemSeparatorComponent={this._itemSeparator}
          numColumns={this.props.mode ? 2: 4}
          key={this.props.mode ? 'v' : 'h'}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          contentContainerStyle={{ padding: this.props.mode? this.props.screenWidth * 1/30:  this.props.screenWidth * 1/50  }}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
        />
      </Layout>
    )
  }
}

function mapStateToProps(state) {
  return {
    list: state.recent.recentList,
    last: state.recent.last,
    mode: state.app.device.screenMode,
    screenWidth: state.app.device.screenSize.width,
    directoryUpdating: state.directory.updating,
    directoryData: state.directory.data
  }
}

export default connect(mapStateToProps)(Recent);