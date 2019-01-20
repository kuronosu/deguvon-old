import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingLayout = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.title}</Text>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5
  },
  text: {
    fontSize: 25,
    padding: 3,
  }
})

export default SettingLayout;