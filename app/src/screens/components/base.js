import { View, StyleSheet } from "react-native";
import React from "react";

const Base = props => {
  return <View style={styles.wrapper} {...props}>
    {props.children}
  </View>;
};

export default Base;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
