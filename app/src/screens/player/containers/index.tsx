import React, { Component } from 'react'
import { StatusBar } from 'react-native'
import Orientation from 'react-native-orientation'

import Video from '../components/video'
import Controls from '../components/control-layout'
import PlayerLoader from '../components/player-loader'
import PlayerLayout from '../components/player-layout'
import timeFormatter from '../../../utils/time-formater'
import DropDownHolder from '../../../utils/dropdownholder'
import { NavigationInjectedProps } from 'react-navigation'
import withHandlePressBack from '../../../navigation/handle-press-back'
import { OnLoadData, OnProgressData, LoadError } from 'react-native-video'

type State = {
  paused: boolean
  loading: boolean
  video: string,
  showContols: boolean
  currentTimeFormated: string
  durationFormated: string
  timeLeftFormated: string
  currentTime: number
  duration: number
}

class Player extends Component<NavigationInjectedProps, State> {

  constructor(props: NavigationInjectedProps) {
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
  
  video: any
  timeFormat = true // true = '00:00' (14, 5) false = '00:00:00' (11, 8)

  onVideoBuffer = ({ isBuffering }: { isBuffering: boolean }) => {
    this.setState({
      loading: isBuffering
    })
  }

  onVideoLoaded = ({ duration }: OnLoadData) => {
    if (duration >= 3600) {
      this.timeFormat = false
    }
    this.setState({
      loading: false,
      durationFormated: timeFormatter(duration, this.timeFormat, false),
      duration
    })
  }

  onVideoError = (e: LoadError) => {
    this.props.navigation.goBack()
    DropDownHolder.alert('error', 'Error', 'Error al reproducir el video')
  }

  onVideoProgress = ({ currentTime }: OnProgressData) => {
    this.setState({
      currentTimeFormated: timeFormatter(currentTime, this.timeFormat),
      currentTime,
      timeLeftFormated: timeFormatter(this.state.duration - currentTime, this.timeFormat, true)
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

  relativeSeek = (offset: number) => {
    const newTime = this.state.currentTime + offset
    this.setState({
      currentTime: newTime,
      currentTimeFormated: timeFormatter(newTime, this.timeFormat)
    })
    this.seek(newTime)
  }

  seek = (newTime: number) => { this.video.seek(newTime) }

  setVideoRef = (ref: any) => {
    this.video = ref
  }

  componentWillUnmount() {
    Orientation.unlockAllOrientations()
  }

  render = () => (
    <PlayerLayout>
      <StatusBar hidden={true} />
      <Video
        source={{}}
        toggleControls={this.toggleControls}
        setRef={this.setVideoRef}
        showContols={this.state.showContols}
        paused={this.state.paused}
        src={this.props.navigation.getParam('video', '')}
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
        />
      }
    </PlayerLayout>
  )
}

const VideoPlayer = withHandlePressBack()(Player)
export default VideoPlayer