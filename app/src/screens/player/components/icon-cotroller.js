import React from 'react'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import IconContainer from './icon-container'

const IconController = props => {
  let Icon = IconAntDesign
  if (props.set == 'MaterialIcons') {
    Icon = MaterialIcons
  }
  return (
    <IconContainer>
      <Icon
        onPress={props.onPress}
        name={props.name}
        color={props.disable ? 'rgba(255, 255, 255, 0.3)' : (props.color ? props.color : 'white')}
        size={25}
      />
    </IconContainer>
  )
}

export default IconController