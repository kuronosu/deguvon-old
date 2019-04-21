import React from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'

import IconController from './icon-cotroller'
import PlayPause from './play-pause'
import BackButton from '../../../navigation/containers/back-button'
import Overlay from './overlay'
import { height } from '../../../utils/screen-landscape'

const Controls = props => {
  return (
    <Overlay >
      <View style={[styles.bar, styles.header]}>
        <BackButton />
        <Text style={styles.title}>{props.title}</Text>
      </View>
      <View style={[styles.bar, styles.controls]}>
        <Text style={styles.controlTime}>{props.currentTime}</Text>
        <View style={[styles.controls, styles.controlButtons]}>
          <IconController name='' disable/>
          <IconController name='doubleleft' disable/>
          <IconController name='left' onPress={() => {props.relativeSeek(-5)}}/>
          <PlayPause onPress={props.togglePlay} paused={props.paused} />
          <IconController name='right' onPress={() => {props.relativeSeek(15)}}/>
          <IconController name='doubleright' disable/>
          <IconController name='rotate-right' set='MaterialIcons' onPress={() => {props.relativeSeek(85)}}/>
        </View>
        <View>
          <Text style={styles.controlTime}>{props.duration}</Text>
          <Text style={[styles.controlTime, {marginTop: 0  }]}>{props.timeLeft}</Text>
        </View>
      </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
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

export default Controls