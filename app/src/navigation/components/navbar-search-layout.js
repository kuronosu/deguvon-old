import React from 'react'
import { View, StyleSheet } from 'react-native'

const NavbarSearchLayout = props => (
  <View style={styles.container}>
    {props.children}
  </View>
)

export default NavbarSearchLayout

const styles = StyleSheet.create({
  container: {
    height: 56,
    padding: 0,
    margin: 0,
    backgroundColor: '#558b2f',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
})