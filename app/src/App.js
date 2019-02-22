import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";

import Settings from "./features/settings/containers";
import Home from "./screens/containers/home";
import Header from "./features/header/components";
import Recent from "./features/recent/containers";
import Navbar from "./navigation/containers/navbar";
import Api from './api/index';
import Loading from './screens/components/loading'
import { store, persistor } from './store';

class AnimeDetail extends Component {

  state = {
    loadded: false,
    anime: null
  }

  fetchData = () => {
    Api.getAnimeDetails(this.props.aid).then(data => {
      this.setState({anime: data.anime, relations: data.relations, loadded: true});
    }).catch(e => this.setState({loadded: false}));
  }

  componentWillMount(){
    this.fetchData()
  }
  render(){
    if (this.state.loadded){
      return(
        <View>
          <Text>{this.state.anime.name}</Text>
          <View>
            {
              this.state.anime.genres.map(g => (
                <Text key={`genre_${g}_${this.state.anime.aid}`}>{g}</Text>
              ))
            }
          </View>
          <Text>{this.state.anime.synopsis}</Text>
          <Text>{this.state.anime.typea}</Text>
        </View>
      )
    }
    return <View><Text>Cargando</Text></View>
  }
}

export default class MyApp extends Component {
  state = {
    active: 'HOME',
    data: null,
    mode: Dimensions.get('window').width < Dimensions.get('window').height
  }
  onPressNavbarButton = active => {
    this.setState({
      active: active
    })
  }
  rederActive = () => {
    if (this.state.active == 'HOME'){
      return <Recent onShowAnimeDetail={this.showAnimeDetail}/>
    } else if (this.state.active == 'SETTINGS'){
      return <Settings/>
    } else if (this.state.active == 'ANIME_DETAIL'){
      return <AnimeDetail aid={this.state.data}/>
    }
    return <Recent onShowAnimeDetail={this.showAnimeDetail}/>
  }
  showAnimeDetail = aid => {
    this.setState({
      active: 'ANIME_DETAIL',
      data: aid
    })
  }
  onLayout = e => {
    this.updateScreenInfo()
  }
  updateScreenInfo(){
    const d = Dimensions.get('window')
    store.dispatch({
      type: 'SET_DEVICE_DATA',
      payload: {
        screenMode: d.width < d.height,
        screenSize: d
      }
    })
  }
  componentWillMount(){
    this.updateScreenInfo()
  }
  render() {
    return (
      <Provider
        store={store}
      >
        <PersistGate loading={<Loading/>} persistor={persistor}>
          <Home onLayout={this.onLayout}>
            <Header/>
            {this.rederActive()}
            <Navbar
              onPressButton={this.onPressNavbarButton}
            />
          </Home>
        </PersistGate>
      </Provider>
    );
  }
}
