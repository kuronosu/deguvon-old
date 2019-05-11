import React from 'react'
import {
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator
} from 'react-native'

const Loading = () => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.text}>Deguvon</Text>
    <ActivityIndicator />
  </SafeAreaView>
)

export default Loading

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333'
  },
  text: {
    fontSize: 75,
  }
})
