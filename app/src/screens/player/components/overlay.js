import React from 'react'
import { View, StyleSheet } from 'react-native'

const Overlay = props => (
  <View style={[styles.overlay, props.opacity && styles.opacity]}>
    {props.children}
  </View>
)

export default Overlay

const styles = StyleSheet.create({
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
  opacity: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)'
  }
})