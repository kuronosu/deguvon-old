import React, { PureComponent } from "react";
import { FlatList, Alert } from "react-native";
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation'
import Layout from "../components/recent-layout";
import RecentCard from "../components/recent-card";
import Api from '../../../api/index'
import Empty from "../components/empty";
import VerticalSeparator from "../components/separator";

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
      this.props.dispatch({
        type: 'SET_RECENT_DATA',
        payload: {
          recentList
        }
      })
      this.setState({refreshing: false})
    } catch (error) {
      this.setState({refreshing: false})
      Alert.alert(
        "Error",
        "Error al obtener los ultimos episodios, revise la configuracion del api",
        [
          {text: 'OK', onPress: () => {}},
        ],
        {cancelable: false}
      )
    }
  }
  _onRefresh = () => {
    this._fetchData()
  }
  _onPressRecentCard = () => {
  }
  _onLongPressRecentCard = ({anime}) => {
    this.props.dispatch({
      type: 'SET_ANIME_DATA',
      payload: anime
    })
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'Anime',
    }))
  }
  _renderEmtpy = () => <Empty text='Sin animes recientes'/>
  _itemSeparator = () => <VerticalSeparator mode={this.props.mode} />
  _renderItem = ({item, index}) =>  <RecentCard
    onLongPressRecentCard={this._onLongPressRecentCard}
    onPressRecentCard={this._onPressRecentCard}
    index={index}
    mode={this.props.mode}
    screenWidth={this.props.screenWidth}
    {...item}
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
    mode: state.app.device.screenMode,
    screenWidth: state.app.device.screenSize.width
  }
}

export default connect(mapStateToProps)(Recent);