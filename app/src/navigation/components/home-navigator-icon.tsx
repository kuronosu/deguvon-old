import React from 'react'
import { View, StyleSheet } from 'react-native'
import { TabBarIconProps } from '../..'
import Icon, { IconSet } from '../../utils/components/icon'

type HomeNavigatorIconProps = {
  iconSet: IconSet
  name: string
} & TabBarIconProps

const HomeNavigatorIcon: React.FC<HomeNavigatorIconProps> = ({ tintColor, focused, iconSet, name }) => (
  <View style={styles.container}>
    <Icon set={iconSet} name={name} size={focused ? 28 : 25} color={tintColor? tintColor: 'white'} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default HomeNavigatorIcon