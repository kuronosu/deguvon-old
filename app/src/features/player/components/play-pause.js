import React from 'react'
import { StyleSheet, View } from 'react-native'
import IconFoundation from 'react-native-vector-icons/Foundation'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'

const PlayPause = props => {
  const Icon = props.paused? IconMaterial: IconFoundation
  return (
    <Icon
      style={props.paused? styles.iconPlay: styles.iconPause}
      name={props.paused? 'play-arrow': 'pause'}
      size={35}
      color='white'
      onPress={props.onPress}
      {...props}
    />
)}

const styles = StyleSheet.create({
  iconPause: {
    marginHorizontal: 10
  },
  iconPlay: {
    marginHorizontal: 1
  }
})

export default PlayPause;