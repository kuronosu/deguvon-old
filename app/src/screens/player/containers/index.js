import React, { Component } from 'react'
import { StatusBar } from 'react-native'
import Orientation from 'react-native-orientation'

import PlayerLoader from '../components/player-loader'
import Controls from '../components/control-layout'
import PlayerLayout from '../components/player-layout'
import Video from '../components/video'
import timeFormater from '../../../utils/time-formater'
import DropDownHolder from '../../../utils/dropdownholder'
import withHandlePressBack from '../../../navigation/handle-press-back';

class Player extends Component {

  constructor(props) {
    super(props)
    Orientation.lockToLandscape()
  }

  state = {
    paused: false,
    loading: true,
    video: '',
    showContols: false,
    currentTimeFormated: '00:00',
    durationFormated: '  00:00',
    timeLeftFormated: '  00:00',
    currentTime: 0,
    duration: 0,
  }

  timeFormat = true // true = '00:00' (14, 5) false = '00:00:00' (11, 8)

  onVideoBuffer = ({ isBuffering }) => {
    this.setState({
      loading: isBuffering
    })
  }

  onVideoLoaded = ({ duration }) => {
    // this.player.seek(1)
    if (duration >= 3600) {
      this.timeFormat = false
    }
    this.setState({
      loading: false,
      durationFormated: timeFormater(duration, this.timeFormat, false),
      duration
    })
  }

  onVideoError = e => {
    this.props.navigation.goBack()
    DropDownHolder.alert('error', 'Error', 'Error al reproducir el video')
  }

  onVideoProgress = ({ currentTime }) => {
    this.setState({
      currentTimeFormated: timeFormater(currentTime, this.timeFormat),
      currentTime,
      timeLeftFormated: timeFormater(this.state.duration - currentTime, this.timeFormat, true)
    })
  }

  toggleControls = () => {
    this.setState(oldState => ({
      showContols: !oldState.showContols
    }))
  }

  togglePlay = () => {
    this.setState(oldState => ({
      paused: !oldState.paused
    }))
  }

  relativeSeek = offset => {
    const newTime = this.state.currentTime + offset
    this.setState({
      currentTime: newTime,
      currentTimeFormated: timeFormater(newTime, this.timeFormat)
    })
    this.seek(newTime)
  }

  seek = async (newTime) => { this.player.seek(newTime) }

  setVideoRef = ref => {
    this.player = ref
  }

  componentWillUnmount() {
    Orientation.unlockAllOrientations()
  }

  render = () => (
    <PlayerLayout>
      <StatusBar hidden={true} />
      <Video
        showContols={this.state.showContols}
        toggleControls={this.toggleControls}
        paused={this.state.paused}
        src={this.props.navigation.getParam('video', '')}
        setRef={this.setVideoRef}
        onLoad={this.onVideoLoaded}
        onBuffer={this.onVideoBuffer}
        onError={this.onVideoError}
        onProgress={this.onVideoProgress}
      />
      {
        this.state.loading &&
        <PlayerLoader />
      }
      {
        this.state.showContols &&
        <Controls
          title={this.props.navigation.getParam('title', '')}
          currentTime={this.state.currentTimeFormated}
          duration={this.state.durationFormated}
          timeLeft={this.state.timeLeftFormated}
          paused={this.state.paused}
          relativeSeek={this.relativeSeek}
          togglePlay={this.togglePlay}
          toFullScreen={this.toFullScreen}
        />
      }
    </PlayerLayout>
  )
}

export default PlayerScreen = withHandlePressBack(Player)