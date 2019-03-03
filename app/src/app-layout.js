import React, { Component } from "react";
import { Dimensions } from "react-native";
import { connect } from 'react-redux'

import Settings from "./features/settings/containers";
import Home from "./screens/containers/home";
import Header from "./features/header/components";
import Recent from "./features/recent/containers";
import Navbar from "./navigation/containers/navbar";

class AppLayout extends Component {
  state = {
    active: 'HOME',
    data: null,
    mode: Dimensions.get('window').width < Dimensions.get('window').height
  }
  _rederActive = () => {
    if (this.state.active == 'HOME'){
      return <Recent onShowAnimeDetail={this._showAnimeDetail}/>
    } else if (this.state.active == 'SETTINGS'){
      return <Settings/>
    } else if (this.state.active == 'ANIME_DETAIL'){
      return <AnimeDetail aid={this.state.data}/>
    }
    return <Recent onShowAnimeDetail={this._showAnimeDetail}/>
  }
  _showAnimeDetail = aid => {
    this.setState({
      active: 'ANIME_DETAIL',
      data: aid
    })
  }
  _updateScreenInfo(){
    const d = Dimensions.get('window')
    this.props.dispatch({
      type: 'SET_DEVICE_DATA',
      payload: {
        screenMode: d.width < d.height,
        screenSize: d
      }
    })
  }
  onPressNavbarButton = active => {
    this.setState({
      active: active
    })
  }
  onLayout = e => {
    this._updateScreenInfo()
  }
  componentWillMount(){
    this._updateScreenInfo()
  }
  render() {
    return (
      <Home onLayout={this.onLayout}>
        <Header/>
        {this._rederActive()}
        <Navbar
          onPressButton={this.onPressNavbarButton}
        />
      </Home>
    );
  }
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(AppLayout)