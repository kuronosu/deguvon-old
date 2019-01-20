import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native'

function VerticalSeparator(props) {
  return (
    <View style={[
        styles.separator,
        {
          borderTopColor: props.color || '#eaeaea'
        }
      ]} >
    </View>
  )
}

const styles = StyleSheet.create({
  separator: {
    padding: Dimensions.get('window').width * 0.017
  }
})

export default VerticalSeparator;