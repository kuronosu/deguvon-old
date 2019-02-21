// @flow

import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import Layout from "./components/layout/index";
import Settings from "./features/settings/containers";
import Home from "./screens/containers/home";
import Header from "./features/header/components";
import Recent from "./features/recent/containers";
import Navbar from "./navigation/containers/navbar";
import Api from './api/index'

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
      return <Recent onShowAnimeDetail={this.showAnimeDetail} mode={this.state.mode}/>
    } else if (this.state.active == 'SETTINGS'){
      return <Settings/>
    } else if (this.state.active == 'ANIME_DETAIL'){
      return <AnimeDetail aid={this.state.data}/>
    }
    return <Recent onShowAnimeDetail={this.showAnimeDetail} mode={this.state.mode}/>
  }
  showAnimeDetail = aid => {
    this.setState({
      active: 'ANIME_DETAIL',
      data: aid
    })
  }
  onLayout = e => {
    const {width, height} = Dimensions.get('window')
    if (width > height){
      this.setState({mode: false, screenWidth: width})
    } else {
      this.setState({mode: true, screenWidth: width})
    }
  }
  render() {
    return (
      <Layout onLayout={this.onLayout}>
        <Header/>
        {this.rederActive()}
        <Navbar
          onPressButton={this.onPressNavbarButton}
        />
      </Layout>
    );
  }
}
