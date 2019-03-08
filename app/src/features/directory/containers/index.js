import React, { Component } from 'react'
import {
  View,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import Empty from '../../recent/components/empty'
import VerticalSeparator from '../../recent/components/separator';
import AnimeCard from '../components/anime-card';
import Api from '../../../api'

class Directory extends Component{
  state = {
    refreshing: false
  }
  async _fetchData(){
    try {
      this.setState({refreshing: true})
      let directory = await Api.getDirectory();
      console.log(directory)
      this.props.dispatch({
        type: 'SET_DIRECTORY_DATA',
        payload: {
          updated: true,
          data: directory
        }
      })
      this.setState({refreshing: false})
    } catch (error) {
      this.setState({refreshing: false})
      console.log(error)
    }
  }

  _onPressRecentCard = anime => {
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'Anime',
      params: {anime}
    }))
  }

  _renderEmtpy = () => <Empty text='Sin directorio'/>
  _itemSeparator = () => <VerticalSeparator mode={this.props.mode} />
  _keyExtractor = item => `anime_${item.aid.toString()}`
  _renderItem = ({item, index}) =>  <AnimeCard
    onLongPressRecentCard={()=>{}}
    onPressRecentCard={this._onPressRecentCard}
    index={index}
    mode={this.props.mode}
    screenWidth={this.props.screenWidth}
    {...item}
  />

  componentDidMount(){
    console.log(!this.props.updated)
    if (!this.props.updated){
      this._fetchData()
    }
  }

  render(){
    return (
      <View>
        <FlatList
          data={Object.values(this.props.data? this.props.data: {})}
          ListEmptyComponent={this._renderEmtpy}
          ItemSeparatorComponent={this._itemSeparator}
          numColumns={this.props.mode ? 3: 4}
          key={this.props.mode ? 'v' : 'h'}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          contentContainerStyle={{ padding: this.props.mode? this.props.screenWidth * 1/40:  this.props.screenWidth * 1/50  }}
          refreshing={this.state.refreshing}
        />
      </View>
    )
  }
}

const mapStateToProps = state => {
  console.log(state)
  return {
    data: state.directory.data,
    updated: state.directory.updated,
    mode: state.app.device.screenMode,
    screenWidth: state.app.device.screenSize.width
  }
}

export default connect(mapStateToProps)(Directory)