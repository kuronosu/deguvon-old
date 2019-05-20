import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const DetailCard = ({ title, content, priority }) => (
  <View style={styles.container}>
    <Text style={[styles.title, priority && styles.priority]}>{title}</Text>
    {content && <Text style={styles.content}>{content}</Text>}
  </View>
)

export default DetailCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    elevation: 1,
    flex: 1,
    padding: 5,
    margin: 5,
  },
  title: {
    fontSize: 11,
    color: '#000'
  },
  priority: {
    fontSize: 20
  },
  content: {}
})