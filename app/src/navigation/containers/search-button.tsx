import React, { Component } from 'react'
import { connect, DispatchProp } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import Icon from '../../utils/components/icon'

class SearchButton extends Component<DispatchProp> {
  _onPressSearchButton = () => {
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'Search'
    }))
  }

  render() {
    return <Icon set='Ionicons' name="ios-search" size={25} color='white' onPress={this._onPressSearchButton} />
  }
}

export default connect(null)(SearchButton)