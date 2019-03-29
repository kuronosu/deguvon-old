import React from 'react';
import { View, Dimensions } from 'react-native'

const VerticalSeparator = props => (
  <View style={{
    padding: (Dimensions.get('window').width * (1 / ((props.numCards + 1) * 10) / 2)) + 1
  }}
  />
)

export default VerticalSeparator