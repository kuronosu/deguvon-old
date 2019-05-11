import React from 'react'
import { View, StyleSheet } from 'react-native'
import { width, height } from '../../../utils/screen-landscape'

const PlayerLayout = props => (
  <View style={styles.container}>
    {props.children}
  </View>
)

export default PlayerLayout

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F0',
    height,
    width
  }
})