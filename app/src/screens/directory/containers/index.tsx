import React, { Component } from 'react'
import { DispatchProp } from 'react-redux'
import { FlatList, Dimensions } from 'react-native'
import { NavigationActions } from 'react-navigation'

import Card from '../../../utils/components/card'
import Empty from '../../../utils/components/empty'
import { StoreState, anime } from '../../../store/types'
import FilterMaganer from '../../../utils/filter-maganer'
import VerticalSeparator from '../../../utils/components/separator'
import GeneralLayout from '../../../utils/components/general-layout'
import withHandlePressBack from '../../../navigation/handle-press-back'
import DirectoryFloatActionButton from '../components/float-action-button'

type Props = {
  data: anime.AnimeModel[],
  updated: boolean
  mode: boolean
  screenWidth: number,
  updating: boolean
}

type State = {
  filterIndex: number
  data: anime.AnimeModel[]
}

class Directory extends Component<Props & DispatchProp, State> {

  state: State = {
    filterIndex: 0,
    data: []
  }

  _onPressAnimeCard = (anime: anime.AnimeModel) => {
    this.props.dispatch({ type: 'SET_ANIME_DATA', payload: anime })
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'Anime',
      params: { title: anime.name }
    }))
  }

  _renderEmtpy = () => <Empty text='Directorio vacio' />

  _itemSeparator = () => <VerticalSeparator numCards={this.props.mode ? 3 : 4} />

  _keyExtractor = (item: anime.AnimeModel) => `anime_${item.aid.toString()}`

  _renderItem = ({ item, index }: {item: anime.AnimeModel, index: number}) => <Card
    pressData={item}
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

  _filter = () => {
    this.setState(pState => {
      const { data, index } = FilterMaganer.next(this.props.data, pState.filterIndex)
      return { data, filterIndex: index }
    })
  }

  // Para futuros usos
  // _getItemLayout = (data, index) => {
  //   const ITEM_HEIGHT = (this.props.screenWidth / (238 / 339)) * ( this.props.mode ? 0.3: 0.225 )
  //   console.log(ITEM_HEIGHT, ITEM_HEIGHT + 43.5)
  //   return {length: ITEM_HEIGHT + 43.5, offset: ITEM_HEIGHT * index, index}
  // }

  componentDidMount() {
    this.setState({ data: this.props.data })
  }

  render() {
    return (
      <GeneralLayout>
        <FlatList
          data={this.state.data}
          ListEmptyComponent={this._renderEmtpy}
          ItemSeparatorComponent={this._itemSeparator}
          numColumns={this.props.mode ? 3 : 4}
          key={this.props.mode ? 'v' : 'h'}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          contentContainerStyle={{ padding: this.props.mode ? this.props.screenWidth * 1 / 40 : this.props.screenWidth * 1 / 50 }}
          // getItemLayout={this._getItemLayout} // Posible optimizacion
          initialNumToRender={12}
          removeClippedSubviews
        />
        <DirectoryFloatActionButton filterType={FilterMaganer.getText(this.state.filterIndex)} onPressFilter={this._filter} />
      </GeneralLayout>
    )
  }
}

const mapStateToProps = (state: StoreState): Props => {
  return {
    data: state.directory.data,
    updated: state.directory.updated,
    mode: state.app && state.app.device ? state.app.device.screenMode : true,
    screenWidth: state.app && state.app.device ? state.app.device.screenSize.width : Dimensions.get('screen').width,
    updating: state.directory.updating
  }
}

const DirectoryScreen = withHandlePressBack(mapStateToProps)(Directory)

export default DirectoryScreen