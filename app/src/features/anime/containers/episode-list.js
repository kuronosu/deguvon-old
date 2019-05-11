import React, { useState } from 'react'
import { View, FlatList, Button, Text } from 'react-native'
import { NavigationActions } from 'react-navigation'

import Episode from '../components/episode'
import { getServers } from '../../../api'
import { getAvailableServers, getNatsukiVideo } from '../../../api/video-servers'
import EpisodeSeparator from '../components/episode-separator'
import DropDownHolder from '../../../utils/dropdownholder'

const playEpisode = (id, number, name, dispatch) => {
  (async () => {
    try {
      const server = await getServers(id)
      const availableServers = getAvailableServers(server)
      const natsukiVideoList = await getNatsukiVideo(id, availableServers)
      const video = natsukiVideoList.length > 0 ? natsukiVideoList[0].file : null
      if (video) {
        dispatch(NavigationActions.navigate({
          routeName: 'Player',
          params: {
            video,
            title: `${name} ${number}`
          }
        }))
      } else {
        DropDownHolder.alert('error', "Error al obtener el episodio", "")
      }
    } catch (err) {
      DropDownHolder.alert('error', "Error al obtener el episodio", err.message)
    }
  })()
}

const renderEpisode = (episode, animeName, dispatch) => (
  <Episode
    episode={episode}
    handlePlay={() => playEpisode(episode.url.split('/')[2], episode.number, animeName, dispatch)}
  />
)

const keyExtractor = item => `episode_${item.number}_${item.url}`

const EpisodeList = props => {
  const { name: animeName = '', episodeList = [] } = props.navigation.getParam('anime', null)
  const [data, setData] = useState(episodeList)
  return (
    <View>
      <Button
        title={data[0].number > data[data.length - 1].number ? 'Mayor a menor' : 'Menor a mayor'}
        onPress={() => {
          let tmp = data.slice()
          tmp.reverse()
          setData(tmp)

        }}
      />
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => renderEpisode(item, animeName, props.dispatch)}
        ItemSeparatorComponent={EpisodeSeparator}
      />
    </View>
  )
}

export default EpisodeList