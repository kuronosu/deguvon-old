import React, { Component } from 'react'
import { connect } from 'react-redux'
import AnimeDetails from '../../features/anime/containers/index'
import AppLayout from './app-layout';

class RecentScreen extends Component {
  render(){
    return (
    <AppLayout>
      <AnimeDetails/>
    </AppLayout>
    )
  }
}
export default connect(e=>e)(RecentScreen)