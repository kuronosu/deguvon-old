import React, { Component } from 'react'
import { View, Dimensions, StyleSheet, ActivityIndicator, Text } from 'react-native'
import Video from 'react-native-video'
import Orientation from 'react-native-orientation'
import { withNavigation } from 'react-navigation'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import BackButton from '../../../navigation/containers/back-button'
import PlayPause from '../components/play-pause'
import IconController from '../components/icon-cotroller';

const timeFormater = (time, format, negative) => {
  const start = format? 14: 11
  const length = format? 5: 8
  const timeObj = new Date(null);
  timeObj.setSeconds(time); // specify value for SECONDS here
  let leftFormat
  if (negative == true) {
    leftFormat = '- '
  } else if (negative == false){
    leftFormat = '  '
  } else {
    leftFormat = ''
  }
  return leftFormat + timeObj.toISOString().substr(start, length)
}

class Player extends Component {

  state = {
    paused: false,
    height: 0,
    width: 0,
    loading: true,
    video: '',
    showContols: false,
    currentTimeFormated: '00:00',
    durationFormated: '00:00',
    timeLeftFormated: '00:00',
    currentTime: 0,
    duration: 0,
  }

  timeFormat = true // true = '00:00' (14, 5) false = '00:00:00' (11, 8)

  onVideoBuffer = e => {
    console.log(e, this.props.navigation.getParam('video', ''))
    this.setState({
      loading: e.isBuffering
    })
  }

  onVideoLoaded = ({ duration }) => {
    // this.player.seek(1)
    if (duration >= 3600){
      this.timeFormat = false
    }
    this.setState({
      loading: false,
      durationFormated: timeFormater(duration, this.timeFormat, false),
      duration
    })
  }

  onVideoError = e => {
    console.error("Error", e)
  }

  onVideoProgress = ({ currentTime }) => {
    this.setState({
      currentTimeFormated: timeFormater(currentTime, this.timeFormat),
      currentTime,
      timeLeftFormated: timeFormater(this.state.duration - currentTime, this.timeFormat, true)
    })
  }

  onExitFullScreen = () => {
    this.player.presentFullscreenPlayer()
  }

  componentWillMount() {
    Orientation.lockToLandscape()
    const { height, width } = Dimensions.get('screen')
    this.setState({
      height: height >= width ? width : height,
      width: width >= height ? width : height
    })
  }

  componentWillUnmount() {
    Orientation.unlockAllOrientations()
  }

  componentDidMount() {
    // 'https://storage.googleapis.com/mucho-anime.appspot.com/e93150124434cd0d21ad92d5b25bdccd.mp4'
    // 'https://storage.googleapis.com/mucho-anime.appspot.com/363f95d7f63b0b1404341d013e5fd89b.mp4'
  }

  toggleControls = () => {
    console.log("Toggle")
    this.setState(oldState => ({
      showContols: !oldState.showContols
    }))
  }

  togglePlay = () => {
    this.setState(oldState => ({
      paused: !oldState.paused
    }))
  }

  render() {
    const styles = createStyles(this.state.width, this.state.height)
    return (
      <View style={styles.videoContainerStyle}>
        <TouchableWithoutFeedback
          onPress={this.toggleControls}
        >
          <Video
            ref={(ref) => {
              this.player = ref
            }}
            paused={this.state.paused}
            resizeMode='contain'
            source={{ uri: this.props.navigation.getParam('video', '') }}
            style={styles.videoStyle}
            fullscreen={true}
            controls={false}
            volume={1}
            onLoad={this.onVideoLoaded}
            onBuffer={this.onVideoBuffer}
            onError={this.onVideoError}
            onProgress={this.onVideoProgress}
            onFullscreenPlayerWillDismiss={this.onExitFullScreen}
          />
          {
            this.state.showContols &&
            <View style={[styles.overlay, styles.overlayColor]} />
          }
        </TouchableWithoutFeedback>
        {
          this.state.loading &&
          <ActivityIndicator style={styles.overlay} color="red" size='large' />
        }
        {
          this.state.showContols &&
          <View style={styles.overlay}>
            <View style={[styles.bar, styles.header]}>
              <BackButton />
              <Text style={styles.title}>{this.props.navigation.getParam('title', '')}</Text>
            </View>
            <View style={[styles.bar, styles.controls]}>
              <Text style={styles.controlTime}>{this.state.currentTimeFormated}</Text>
              <View style={[styles.controls, styles.controlButtons]}>
                <IconController name=''/>
                <IconController name='doubleleft'/>
                <IconController name='left'/>
                <PlayPause onPress={this.togglePlay} paused={this.state.paused} />
                <IconController name='right'/>
                <IconController name='doubleright'/>
                <IconController name='rotate-right' set='MaterialIcons'/>
              </View>
              <View>
                <Text style={styles.controlTime}>{this.state.durationFormated}</Text>
                <Text style={[styles.controlTime, {marginTop: 0  }]}>{this.state.timeLeftFormated}</Text>
              </View>
            </View>
          </View>
        }
      </View>
    )
  }
}

export default withNavigation(Player)

const createStyles = (width, height) => StyleSheet.create({
  videoStyle: {
    height,
    width,
    alignSelf: "stretch",
  },
  videoContainerStyle: {
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlayColor: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flexDirection: 'row',
    alignItems: 'center'
  },
  header: {
    transform: [
      { translateY: -height + 50 }
    ]
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
  controls: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  controlTime: {
    color: 'white',
    marginHorizontal: 10,
    marginTop: 5,
    alignSelf: 'flex-start'
  },
  controlButtons: {
    flexDirection: 'row',
  },
})
