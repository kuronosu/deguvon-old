import React, { Component } from 'react'
import { DispatchProp } from 'react-redux'
import { FlatList, Dimensions } from 'react-native'
import { NavigationActions } from 'react-navigation'

import Card from '../../../utils/components/card'
import Empty from '../../../utils/components/empty'
import { setAnimeData } from '../../../store/actions'
import { StoreState, AnimeModel } from '../../../'
import FilterMaganer from '../../../utils/filter-maganer'
import VerticalSeparator from '../../../utils/components/separator'
import GeneralLayout from '../../../utils/components/general-layout'
import withHandlePressBack from '../../../navigation/handle-press-back'
import DirectoryFloatActionButton from '../components/float-action-button'

type Props = {
  data: AnimeModel[],
  updated: boolean
  mode: boolean
  screenWidth: number,
  updating: boolean
}

type State = {
  data: AnimeModel[]
}

class Directory extends Component<Props & DispatchProp, State> {
  filterObject: FilterMaganer
  state: State

  constructor(props: Props & DispatchProp) {
    super(props);
    this.state = { data: props.data }
    this.filterObject = new FilterMaganer(props.data)
  }

  _onPressAnimeCard = (anime: AnimeModel) => {
    this.props.dispatch(setAnimeData(anime))
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'Anime',
      params: { title: anime.name }
    }))
  }

  _renderEmtpy = () => <Empty text='Directorio vacio' />

  _itemSeparator = () => <VerticalSeparator numCards={this.props.mode ? 3 : 4} />

  _keyExtractor = (item: AnimeModel) => `anime_${item.aid}`

  _renderItem = ({ item, index }: { item: AnimeModel, index: number }) => <Card
    pressData={item}
    mode={this.props.mode}
    screenWidth={this.props.screenWidth}
    index={index}
    onPressCard={this._onPressAnimeCard}
    image={item.cover}
    primaryText={item.name}
    secondaryText={item.typea.name}
    cardsPerRowPortrait={3}
    cardsPerRowLandscape={4}
  />

  _filter = () => {
    this.setState({ data: this.filterObject.next().data })
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
        <DirectoryFloatActionButton filterType={this.filterObject.getText()} onPressFilter={this._filter} />
      </GeneralLayout>
    )
  }
}

const mapStateToProps = (state: StoreState): Props => {
  // console.log(state.directory.data)
  return {
    data: Object.values(state.directory.data),
    updated: state.directory.updated,
    mode: state.app && state.app.device ? state.app.device.screenMode : true,
    screenWidth: state.app && state.app.device ? state.app.device.screenSize.width : Dimensions.get('screen').width,
    updating: state.directory.updating
  }
}

const DirectoryScreen = withHandlePressBack(mapStateToProps)(Directory)

export default DirectoryScreen