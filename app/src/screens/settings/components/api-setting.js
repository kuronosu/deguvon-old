import React from 'react';
import { TextInput, Text, StyleSheet, View } from 'react-native';
import SettingLayout from './setting-layout';

const ApiSetting = props => {
  return (
    <View>
      <Text style={[styles.label]}>{props.title}</Text>
      <TextInput
        style={styles.input}
        onChangeText={props.onChangeText}
        value={props.value}
      />
      {
        props.helpText &&
        <Text style={styles.info}>{props.helpText}</Text>
      }
      {
        props.warningText &&
        <Text style={[styles.info, styles.warning]}>{props.warningText}</Text>
      }
    </View>
  );
};

export default ApiSetting;

const styles = StyleSheet.create({
  info: {
    fontSize: 12,
    color: 'black',
    margin: 15,
    marginTop: 0
  },
  warning: {
    color: 'red'
  },
  label: {
    fontSize: 17,
    marginLeft: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 15,
    fontSize: 15
  }
})
