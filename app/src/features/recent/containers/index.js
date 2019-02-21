import React, { Component } from "react";
import { Text, FlatList, AsyncStorage, Dimensions, Alert } from "react-native";
import Layout from "../components/recent-layout";
import RecentCard from "../components/recent-card";
import Api from '../../../api/index'
import Empty from "../components/empty";
import VerticalSeparator from "../components/separator";
import Storage from '../../../utils/storage';

export default class Recent extends Component{
  state = {
    recentList: [],
    refreshing: false,
  }
  fetchData(){
    this.setState({refreshing: true});
    Api.getRecent()
        .then(recent => {
        this.setState({refreshing: false, recentList: recent});
        Storage.storeData('recentList', recent);
      })
      .catch(e => {
        this.setState({refreshing: false})
      });
  }
  _onRefresh = () => {
    console.log("Recargando")
    this.fetchData()
  }
  _onPressRecentCard = () => {
  }
  _onLongPressRecentCard = ({anime}) => {
    this.props.onShowAnimeDetail(anime.aid)
  }
  renderEmtpy = () => <Empty text='Sin animes recientes'/>
  itemSeparator = () => <VerticalSeparator mode={this.props.mode} />
  renderItem = ({item, index}) =>  <RecentCard onLongPress={this._onLongPressRecentCard} onPress={this._onPressRecentCard} index={index} mode={this.props.mode} {...item} />
  keyExtractor = item => item.id.toString()

  componentWillMount (){
    Storage.retrieveData('recentList', []).then( recent => {
      this.setState({
        recentList: recent,
      })
    })
  }
  componentDidMount(){
    this.fetchData()
  }
  render(){
    return(
      <Layout>
        <FlatList
          data={this.state.recentList}
          ListEmptyComponent={this.renderEmtpy}
          ItemSeparatorComponent={this.itemSeparator}
          numColumns={this.props.mode ? 2: 4}
          key={this.props.mode ? 'v' : 'h'}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          contentContainerStyle={{ padding: this.props.mode? Dimensions.get('window').width * 1/30:  Dimensions.get('window').width * 1/50  }}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
        />
      </Layout>
    )
  }
}