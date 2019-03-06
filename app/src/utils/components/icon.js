import React from 'react'
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import Octicons from 'react-native-vector-icons/Octicons'
import EntypoIcon from 'react-native-vector-icons/Entypo'

const Icon = props => {
  let IconSet = EvilIcon
  switch (props.iconSet) {
    case 'EvilIcons':
      IconSet = EvilIcon
      break;
    case 'Octicons':
      IconSet = Octicons
      break
    case 'Entypo':
      IconSet = EntypoIcon
      break
    default:
      IconSet = EvilIcon
      break;
  }
  return (
    <IconSet {...props}/>
  )
}

export default Icon