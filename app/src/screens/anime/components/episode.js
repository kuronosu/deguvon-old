import React from 'react'
import {
  View,
  Image,
  Text
} from 'react-native'

import Icon from '../../../utils/components/icon'

const Episode = ({ episode, handlePlay }) => (
  <View style={{
    flexDirection: 'row'
  }}>
    <Image
      source={{ uri: "https://kuronosu.dev" + episode.image }}
      style={{
        width: '25%',
        height: 60
        // height: (Dimensions.get('window').width * 0.25) * p
      }}
      resizeMode='contain'
    />
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1,
      }}
    >
      <Text style={{ fontSize: 20 }}>{`Episodio ${episode.number}`}</Text>
      <View
        style={{
          paddingHorizontal: 20,
          alignItems: 'flex-end',
          flex: 1
        }}
      >
        <Icon
          onPress={handlePlay}
          set='Entypo'
          name='controller-play'
          size={40}
          color='black'
        />
      </View>
    </View>
  </View>
)

export default Episode