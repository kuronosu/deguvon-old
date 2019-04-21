import React from 'react'
import { withNavigationFocus } from 'react-navigation'
import Player from '../../features/player/containers'
import withHandleAndroidBackButton from '../../navigation/handle-android-back-button'

const PlayerScreen = ({ isFocused }) => (
  isFocused &&
  <Player />
)

export default withHandleAndroidBackButton(withNavigationFocus(PlayerScreen))