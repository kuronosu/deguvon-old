import React from 'react'
import { Icon as RNVectorIcon, IconProps } from 'react-native-vector-icons/Icon'
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIconsI from 'react-native-vector-icons/SimpleLineIcons'
import MaterialIconsI from 'react-native-vector-icons/MaterialIcons'
import FontAwesomeI from 'react-native-vector-icons/FontAwesome'
import FoundationI from 'react-native-vector-icons/Foundation'
import EvilIconsI from 'react-native-vector-icons/EvilIcons'
import OcticonsI from 'react-native-vector-icons/Octicons'
import IoniconsI from 'react-native-vector-icons/Ionicons'
import FeatherI from 'react-native-vector-icons/Feather'
import EntypoI from 'react-native-vector-icons/Entypo'
import ZocialI from 'react-native-vector-icons/Zocial'

export type IconSet = 'MaterialCommunityIcons' |
                      'SimpleLineIcons' |
                      'MaterialIcons' |
                      'FontAwesome' |
                      'Foundation' |
                      'EvilIcons' |
                      'Octicons' |
                      'Ionicons' |
                      'Feather' |
                      'Entypo' |
                      'Zocial'

interface Props extends IconProps {
  set: IconSet
}

function loadSet(set: Props["set"]): typeof RNVectorIcon {
  switch (set) {
    case "MaterialCommunityIcons":
      return MaterialCommunityIconsI
    case "SimpleLineIcons":
      return SimpleLineIconsI
    case "MaterialIcons":
      return MaterialIconsI
    case "FontAwesome":
      return FontAwesomeI
    case "Foundation":
      return FoundationI
    case "EvilIcons":
      return EvilIconsI
    case "Octicons":
      return OcticonsI
    case "Ionicons":
      return IoniconsI
    case "Feather":
      return FeatherI
    case "Entypo":
      return EntypoI
    case "Zocial":
      return ZocialI
  }
  return MaterialCommunityIconsI
}

const Icon = (props: Props) => {
  const IconSet = loadSet(props.set)
  return (
    <IconSet {...props} />
  )
}

export default Icon