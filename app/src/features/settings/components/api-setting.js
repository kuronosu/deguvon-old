import React from 'react';
import { TextInput, Text, StyleSheet } from 'react-native';
import SettingLayout from './setting-layout';

const ApiSetting = ({text, onChangeText}) => {
  return (
    <SettingLayout title='Api'>
    <Text style={[styles.label]}>Api host</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      <Text style={[styles.info, styles.warning]}>Modificar esta configuracion prodria hacer la que aplicacion deje de funcionar</Text>
    </SettingLayout>
  );
};

export default ApiSetting;

const styles = StyleSheet.create({
  info: {
    fontSize: 10,
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
