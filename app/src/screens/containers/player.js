import React from 'react'
import { withNavigationFocus } from 'react-navigation'
import Player from '../../features/player/containers'

const PlayerScreen = ({ isFocused }) => (
  isFocused &&
  <Player />
)

export default withNavigationFocus(PlayerScreen)