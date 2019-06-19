import React, { Component } from 'react'
import { DispatchProp } from 'react-redux'
import { FlatList, Dimensions } from 'react-native'
import { NavigationActions, NavigationInjectedProps } from 'react-navigation'

import Card from '../../../utils/components/card'
import Empty from '../../../utils/components/empty'
import { setAnimeData, setSearchData } from '../../../store/actions'
import { anime, StoreState } from '../../../store/types'
import VerticalSeparator from '../../../utils/components/separator'
import GeneralLayout from '../../../utils/components/general-layout'
import withHandlePressBack from '../../../navigation/handle-press-back'

type Props = {
  searchText: string
  data: anime.AnimeModel[]
  mode: boolean
  screenWidth: number
  directoryData: anime.AnimeModel[]
}

class Search extends Component<Props & DispatchProp & NavigationInjectedProps> {

  _onChangeText = (text: string) => {
    this.props.dispatch(setSearchData(text, this.props.directoryData.filter(el => el.name.toLowerCase().includes(text.toLowerCase()))))
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleChangeText: (text: string) => this._onChangeText(text) })
  }

  _onPressAnimeCard = (anime: anime.AnimeModel) => {
    this.props.dispatch(setAnimeData(anime))
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'Anime',
      params: { title: anime.name }
    }))
  }

  _renderEmtpy = () => <Empty text='Sin resultados' />

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

  render() {
    return (
      <GeneralLayout>
        <FlatList
          data={this.props.data}
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
      </GeneralLayout>
    )
  }
}

const mapStateToProps = (state: StoreState): Props => ({
  searchText: state.search ? state.search.text : '',
  data: state.search ? state.search.data : [],
  mode: state.app ? state.app.device ? state.app.device.screenMode : true : true,
  screenWidth: state.app ? state.app.device ? state.app.device.screenSize.width : Dimensions.get('screen').width : Dimensions.get('screen').width,
  directoryData: state.directory.data
})

const SearchScreen = withHandlePressBack(mapStateToProps)(Search)
export default SearchScreen