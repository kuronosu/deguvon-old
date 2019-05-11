import { View, StyleSheet } from "react-native";
import React from "react";

const GeneralLayout = props => (
  <View  {...props} style={[styles.container, props.style && [...props.style]]}>
    {props.children}
  </View>
)

export default GeneralLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e2e1'
  }
})