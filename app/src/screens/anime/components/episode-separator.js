import React from 'React'
import { View, StyleSheet } from 'react-native'

const EpisodeSeparator = () => <View style={styles.separator} />

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: "75%",
    backgroundColor: "#CED0CE",
    marginLeft: "25%",
    marginVertical: 1
  }
})

export default EpisodeSeparator