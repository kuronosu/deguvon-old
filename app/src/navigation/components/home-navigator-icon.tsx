import React from 'react'
import { View, StyleSheet } from 'react-native'
import Icon, { IconSet } from '../../utils/components/icon'

type Props = {
  tintColor: string
  focused: boolean
  iconSet: IconSet
  name: string
}

const HomeNavigatorIcon: React.FC<Props> = ({ tintColor, focused, iconSet, name }) => (
  <View style={styles.container}>
    <Icon set={iconSet} name={name} size={focused ? 28 : 25} color={tintColor} />
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