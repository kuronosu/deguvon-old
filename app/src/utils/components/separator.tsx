import React from 'react'
import { View, Dimensions } from 'react-native'

type Props = {
  numCards: number
}

const VerticalSeparator: React.FC<Props> = (props: Props) => (
  <View style={{
    padding: (Dimensions.get('window').width * (1 / ((props.numCards + 1) * 10) / 2)) + 1
  }}
  />
)

export default VerticalSeparator