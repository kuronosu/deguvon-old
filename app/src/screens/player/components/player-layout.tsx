import React from 'react'
import { View, StyleSheet } from 'react-native'
import { width, height } from '../../../utils/screen-landscape'

const PlayerLayout: React.FC = ({ children }) => (
  <View style={styles.container}>
    {children}
  </View>
)

export default PlayerLayout

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    height,
    width
  }
})