import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

export default class Events extends Component {
  render() {
    return (
      <View style={styles.conatainer}>
        <Text>This is the settings entry component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  conatainer: {
    flex: 1,
    padding: 10
  }
});
