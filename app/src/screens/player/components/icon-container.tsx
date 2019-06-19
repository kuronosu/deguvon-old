import React from 'react'
import { View, StyleSheet } from 'react-native'

const IconContainer: React.FC = ({ children }) => (
  <View style={styles.container}>
    {children}
  </View>
)

export default IconContainer

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    marginHorizontal: 15
  }
})