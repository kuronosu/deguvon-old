import React, { Component } from 'react'
import Search from '../../features/search/containers'
import withHandleAndroidBackButton from '../../navigation/handle-android-back-button'

class SearchScreen extends Component {

  _onChangeText = text => {
    this.props.dispatch({
      type: 'SET_SEARCH_DATA',
      payload: {
        data: this.props.data.filter(el => el.name.toLowerCase().includes(text.toLowerCase())),
        text,
      }
    })
  }

  componentWillMount() {
    this.props.navigation.setParams({ handleChangeText: text => this._onChangeText(text) })
  }

  render(){
    return <Search />
  }
}

const mapStateToProps = state => ({
  data: state.directory.data
})

export default withHandleAndroidBackButton(SearchScreen, mapStateToProps)