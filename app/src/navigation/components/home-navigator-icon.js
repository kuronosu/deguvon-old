import React from 'react'
import { View } from 'react-native'
import Icon from '../../utils/components/icon'

const HomeNavigatorIcon = ({ tintColor, focused, iconSet, name }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Icon set={iconSet} name={name} size={focused ? 28 : 25} color={tintColor} />
  </View>
)

export default HomeNavigatorIcon