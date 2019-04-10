import React from 'react'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const PlayPause = props => (
  <View style={styles.container}>
    <Icon
      name={props.paused? 'play-arrow': 'pause'}
      size={80}
      color='white'
      onPress={props.onPress}
    />
  </View>
)

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default PlayPause;