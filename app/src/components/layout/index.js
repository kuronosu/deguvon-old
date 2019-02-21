import { View, StyleSheet } from "react-native";
import React from "react";

const Layout = props => {
  return <View style={styles.wrapper} {...props}>
    {props.children}
  </View>;
};

export default Layout;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
