import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withNavigation, NavigationActions } from 'react-navigation'
import { FlatList } from 'react-native';
import Empty from '../../../utils/components/empty';
import VerticalSeparator from '../../../utils/components/separator';
import Card from '../../../utils/components/card';
import GeneralLayout from '../../../utils/components/general-layout';

class Search extends Component {

  _onPressAnimeCard = anime => {
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'Anime',
      params: {anime}
    }))
  }

  _renderEmtpy = () => <Empty text='Sin resultados' color='white'/>

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

  render(){
    return(
      <GeneralLayout>
        <FlatList
          data={this.props.data}
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
      </GeneralLayout>
    )
  }
}

const mapStateToProps = state => ({
  searchText: state.search.text,
  data: state.search.data,
  mode: state.app.device.screenMode,
  screenWidth: state.app.device.screenSize.width,
})

export default withNavigation(connect(mapStateToProps)(Search))