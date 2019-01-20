import { View, StyleSheet } from "react-native";
import React from "react";

const Layout = props => {
  return (
    <View style={styles.container}>
      {props.children}
    </View>
  );
}

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    marginBottom: 55,
  }
})
