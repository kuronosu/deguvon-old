import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native'

const VerticalSeparator = props => (
  <View style={{
    padding: props.mode?
      (Dimensions.get('window').width * 1/30/2) + 1:
      (Dimensions.get('window').width * 1/50/2) + 1
    }}
  />
)

export default VerticalSeparator;