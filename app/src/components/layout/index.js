import { View, StyleSheet } from "react-native";
import React from "react";

const Layout = ({ children }) => {
  return <View style={styles.wrapper}>{children}</View>;
};

export default Layout;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
