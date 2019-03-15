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
import DropDownHolder from '../../../utils/dropdownholder';
import FloatActionButton from '../components/float-action-button';

class FilterMaganer{
  state = 0
  text = ['Todos', 'Anime', 'Película', 'OVA', 'Especial']
  data = []
  filteredData = []

  getText = () => (this.text[this.state])

  setData = data => {
    this.data = data
    this.filteredData = data
  }

  next = () => {
    if (this.state == this.text.length - 1){
      this.state = 0
    } else {
      this.state += 1
    }
    this.filter()
  }

  filter = (typea=null) => {
    if (this.state == 0 ){
      this.filteredData = this.data
    } else {
      this.filteredData = this.data.filter(anime => anime.typea.toUpperCase() == (typea ? typea: this.getText().toUpperCase()))
    }
  }
}

class Directory extends Component{
  state = {
    refreshing: false,
    filter: new FilterMaganer(),
    data: []
  }
  async _fetchData(){
    try {
      this.setState({refreshing: true})
      let directory = await Api.getDirectory();
      this.props.dispatch({
        type: 'SET_DIRECTORY_DATA',
        payload: {
          updated: true,
          data: Object.values(directory)
        }
      })
      this.setState({refreshing: false})
    } catch (error) {
      this.setState({refreshing: false})
      DropDownHolder.alert('error', 'Error', 'Error al actualizar el directorio')
      console.log(error)
    }
  }

  _onPressRecentCard = anime => {
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'Anime',
      params: {anime}
    }))
  }

  _renderEmtpy = () => <Empty text='Directorio vacio'/>
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

  _filter = () => {
    this.state.filter.next()
    this.setState(pState => ({data: pState.filter.filteredData}))
  }

  componentDidMount(){
    this.setState({data: this.props.data})
    this.state.filter.setData(this.props.data)
    if (!this.props.updated && !this.props.updating){
      this._fetchData()
    }
  }

  render(){
    return (
      <View style={{backgroundColor: '#333', flex: 1}}>
        <FlatList
          data={this.state.data}
          ListEmptyComponent={this._renderEmtpy}
          ItemSeparatorComponent={this._itemSeparator}
          numColumns={this.props.mode ? 3: 4}
          key={this.props.mode ? 'v' : 'h'}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          contentContainerStyle={{ padding: this.props.mode? this.props.screenWidth * 1/40:  this.props.screenWidth * 1/50  }}
          refreshing={this.state.refreshing}
        />
        <FloatActionButton filter={this.state.filter} onPressFilter={this._filter}/>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    data: state.directory.data,
    updated: state.directory.updated,
    mode: state.app.device.screenMode,
    screenWidth: state.app.device.screenSize.width,
    updating: state.directory.updating
  }
}

export default connect(mapStateToProps)(Directory)