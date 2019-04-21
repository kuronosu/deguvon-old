import React from 'react'
import RNVideo from 'react-native-video'
import { StyleSheet } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import Overlay from './overlay'
import { height, width } from '../../../utils/screen-landscape'

const Video = props => (
  <TouchableWithoutFeedback onPress={props.toggleControls}>
    <RNVideo
      {...props}
      volume={1}
      controls={false}
      fullscreen={true}
      style={styles.video}
      resizeMode='contain'
      ref={props.setRef}
      source={{ uri: props.src }}
    />
    {
      props.showContols &&
      <Overlay opacity/>
    }
  </TouchableWithoutFeedback>
)

export default Video

const styles = StyleSheet.create({
  video: {
    height,
    width,
    alignSelf: "stretch",
  }
})
