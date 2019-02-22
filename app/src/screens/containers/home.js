import { View, StyleSheet } from "react-native";
import React from "react";

const Home = props => {
  return <View style={styles.wrapper} {...props}>
    {props.children}
  </View>;
};

export default Home;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
