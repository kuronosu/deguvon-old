import React from 'react'
import IconFoundation from 'react-native-vector-icons/Foundation'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'

import IconContainer from './icon-container'

type Props = {
  paused: boolean
  color?: string
  onPress: () => void
} 

const PlayPause: React.FC<Props> = ({paused, color, onPress}) => {
  const Icon = paused ? IconMaterial : IconFoundation
  return (
    <IconContainer>
      <Icon
        onPress={onPress}
        name={paused ? 'play-arrow' : 'pause'}
        color={color ? color : 'white'}
        size={30}
      />
    </IconContainer>
  )
}

export default PlayPause