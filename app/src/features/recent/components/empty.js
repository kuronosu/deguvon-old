import React from 'react';
import { View, Text, StyleSheet } from "react-native";

const Empty = props => {
  return (
    <View style={styles.container} >
      <Text style={[styles.text, {color: props.color}]} >{props.text}</Text>
    </View>
  );
};

export default Empty;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 100
  },
  text: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center'
  }
})
