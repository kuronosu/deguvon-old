import React, { Component } from 'react'
import {
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import Empty from '../../../utils/components/empty'
import VerticalSeparator from '../../../utils/components/separator';
import DirectoryFloatActionButton from '../components/float-action-button';
import FilterMaganer from '../../../utils/filter-maganer';
import Card from '../../../utils/components/card';
import GeneralLayout from '../../../utils/components/general-layout';

class Directory extends Component{

  state = {
    filterIndex: 0,
    data: []
  }

  _onPressAnimeCard = anime => {
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'Anime',
      params: {anime}
    }))
  }

  _renderEmtpy = () => <Empty text='Directorio vacio'/>

  _itemSeparator = () => <VerticalSeparator numCards={this.props.mode? 3: 4} />

  _keyExtractor = item => `anime_${item.aid.toString()}`

  _renderItem = ({item, index}) =>  <Card
    id={item}
    mode={this.props.mode}
    screenWidth={this.props.screenWidth}
    index={index}
    onPressCard={this._onPressAnimeCard}
    image={item.image}
    primaryText={item.name}
    secondaryText={item.typea}
    cardsPerRowPortrait={3}
    cardsPerRowLandscape={4}
  />

  _filter = async () => {
    this.setState(pState => {
      const filterState = FilterMaganer.next(this.props.data, pState.filterIndex)
      return {data: filterState.data, filterIndex: filterState.index}
    })
  }

  // Para futuros usos
  // _getItemLayout = (data, index) => {
  //   const ITEM_HEIGHT = (this.props.screenWidth / (238 / 339)) * ( this.props.mode ? 0.3: 0.225 )
  //   console.log(ITEM_HEIGHT, ITEM_HEIGHT + 43.5)
  //   return {length: ITEM_HEIGHT + 43.5, offset: ITEM_HEIGHT * index, index}
  // }

  componentDidMount(){
    this.setState({data: this.props.data})
  }

  render(){
    return (
      <GeneralLayout>
        <FlatList
          data={this.state.data}
          ListEmptyComponent={this._renderEmtpy}
          ItemSeparatorComponent={this._itemSeparator}
          numColumns={this.props.mode ? 3: 4}
          key={this.props.mode ? 'v' : 'h'}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          contentContainerStyle={{ padding: this.props.mode? this.props.screenWidth * 1/40:  this.props.screenWidth * 1/50  }}
          // getItemLayout={this._getItemLayout} // Posible optimizacion
          initialNumToRender={12}
          removeClippedSubviews
        />
        <DirectoryFloatActionButton filterType={FilterMaganer.getText(this.state.filterIndex)} onPressFilter={this._filter}/>
      </GeneralLayout>
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