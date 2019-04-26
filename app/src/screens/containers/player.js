import React from 'react'
import { withNavigationFocus } from 'react-navigation'
import Player from '../../features/player/containers'
import withHandlePressBack from '../../navigation/handle-press-back'

const PlayerScreen = ({ isFocused }) => (
  isFocused &&
  <Player />
)

export default withHandlePressBack(withNavigationFocus(PlayerScreen))