import React from 'react'
import { ActivityIndicator } from 'react-native'
import Overlay from './overlay'

const PlayerLoader: React.FC = () => (
  <Overlay>
    <ActivityIndicator color="red" size='large' />
  </Overlay>
)

export default PlayerLoader