import React, { useState } from 'react'
import { FAB, Portal, Provider, FABGroupAction } from 'react-native-paper'
import { StyleSheet } from 'react-native'

type buildAction = (
  icon: string,
  onPress: () => void,
  label?: string | null,
  accessibilityLabel?: string | null,
  style?: any | null,
  color?: string
) => FABGroupAction

const buildAction: buildAction = (icon, onPress, label, accessibilityLabel, style, color = 'white'): FABGroupAction => {
  return {
    icon,
    onPress,
    style: styles.main,
    color,
    ...(label && { label }),
    ...(style && { style: [styles.main, style] }),
    ...(accessibilityLabel && { accessibilityLabel })
  }
}

type Props = {
  filterType: string
  onPressFilter: () => void
}

const DirectoryFloatActionButton = ({ filterType, onPressFilter }: Props) => {
  const [open, setOpen] = useState(false)
  return (
    <Provider>
      <Portal>
        <FAB.Group
          open={open}
          accessibilityLabel='Filtros'
          fabStyle={{ backgroundColor: 'green' }}
          icon={open ? 'close' : 'add'}
          actions={[
            buildAction('filter-list', onPressFilter, `Tipo: ${filterType}`)
          ]}
          onStateChange={({ open }) => setOpen(open)}
        />
      </Portal>
    </Provider>
  )
}

export default DirectoryFloatActionButton

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#62727b',
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center'
  }
})