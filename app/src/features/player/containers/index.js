import React, { Component } from 'react'
import { View, Dimensions, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native'
import Video from 'react-native-video'

import Orientation from 'react-native-orientation'
import { getServers } from '../../../api';
import { getAvailableServers, getNatsukiVideo } from '../../../utils/video-servers';

export default class Player extends Component {
  state = {
    paused: false,
    height: 0,
    width: 0,
    loading: true,
    video: ''
  }

  onVideoBuffer = e => {
    console.log(e)
    this.setState({
      loading: e.isBuffering
    })
  }

  onVideoLoaded = () => {
    this.player.seek(1)
    this.setState({
      loading: false
    })
  }

  onVideoError = e => {
    console.error("Error", e)
  }

  componentWillMount() {
    Orientation.lockToLandscape()
    const {height, width} = Dimensions.get('screen')
    this.setState({
      height: height >= width? width: height,
      width: width >= height? width: height
    })
  }

  componentWillUnmount() {
    Orientation.unlockAllOrientations()
  }

  componentDidMount(){
    // 'https://storage.googleapis.com/mucho-anime.appspot.com/e93150124434cd0d21ad92d5b25bdccd.mp4'
    // 'https://storage.googleapis.com/mucho-anime.appspot.com/363f95d7f63b0b1404341d013e5fd89b.mp4'
    (async () => {
      const eid = 51719
      const server = await getServers(eid)
      const availableServers = getAvailableServers(server)
      const natsukiVideoList = await getNatsukiVideo(eid, availableServers)
      this.setState({
        video: natsukiVideoList.length > 0 ? natsukiVideoList[0].file: ''
      })
      console.log("URL obtenida", this.state.video)
    })()
  }

  render() {
    const styles = createStyles(this.state.width, this.state.height)
    return (
      <View
        style={{flex: 1, backgroundColor: "red"}}>
        <View style={styles.topViewStyle}>
          <Video
            ref={(ref) => {
              this.player = ref
            }}
            paused={this.state.paused}
            resizeMode='contain'
            source={{uri: this.state.video}}
            style={styles.videoStyle}
            onLoad={this.onVideoLoaded}
            onBuffer={this.onVideoBuffer}
            onError={this.onVideoError}
            fullscreen={true}
            controls={false}
            volume={1}
          />
        </View>
        <View style={styles.overlay}>
          {
            this.state.loading &&
            <ActivityIndicator color="red" />
          }
        </View>
      </View>
    )
  }
}


const createStyles = (width, height) => StyleSheet.create({
  videoStyle: {
    height,
    width,
    alignSelf: "stretch",
  },
  topViewStyle: {
    backgroundColor: '#0F0',
    height,
    width
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
