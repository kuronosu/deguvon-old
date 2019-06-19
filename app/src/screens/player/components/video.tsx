import React from 'react'
import { StyleSheet } from 'react-native'
import RNVideo, { VideoProperties } from 'react-native-video'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import Overlay from './overlay'
import { Overwrite } from '../../../utils'
import { height, width } from '../../../utils/screen-landscape'

type Props = {
  showContols: boolean
  toggleControls: () => void
  setRef: (ref: any) => void
  onBuffer: (data: { isBuffering: boolean }) => void
}

const Video: React.FC<Overwrite<VideoProperties, Props>> = props => (
  <TouchableWithoutFeedback onPress={props.toggleControls}>
    <RNVideo
      {...props as VideoProperties}
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
      <Overlay opaque />
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
