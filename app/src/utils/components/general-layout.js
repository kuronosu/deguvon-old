import { View, StyleSheet } from "react-native";
import React from "react";

const GeneralLayout = props => {
  return (
    <View style={[styles.container, props.styles && [...props.styles]]} {...props}>
      {props.children}
    </View>
  );
}

export default GeneralLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333'
  }
})
