import React from 'react'
import IconFoundation from 'react-native-vector-icons/Foundation'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'

import IconContainer from './icon-container'

const PlayPause = props => {
  const Icon = props.paused? IconMaterial: IconFoundation
  return (
    <IconContainer>
      <Icon
        onPress={props.onPress}
        name={props.paused? 'play-arrow': 'pause'}
        color={props.color? props.color: 'white'}
        size={30}
      />
    </IconContainer>
  )
}

export default PlayPause