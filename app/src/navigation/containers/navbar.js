import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

class Navbar extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.button} onPress={() => this.props.onPressButton('HOME')}>Home</Text>
        <Text style={styles.button} onPress={() => this.props.onPressButton('SETTINGS')}>Setting</Text>
      </View>
    );
  }
}

export default Navbar;

const styles = StyleSheet.create({
  button: {
    color: 'white',
    fontSize: 20
  },
  container: {
    flex: 1,
    height: 55,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    backgroundColor: '#2C2B2C',
    borderTopWidth: 5,
    borderTopColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
})
