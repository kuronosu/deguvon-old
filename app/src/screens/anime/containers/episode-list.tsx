import React, { useState, useEffect } from 'react'
import { FlatList } from 'react-native'
import { Button } from 'react-native-paper'
import { NavigationActions } from 'react-navigation'

import Episode from '../components/episode'
import { getServers } from '../../../api'
import { getAvailableServers, getNatsukiVideo } from '../../../api/video-servers'
import EpisodeSeparator from '../components/episode-separator'
import DropDownHolder from '../../../utils/dropdownholder'
import GeneralLayout from '../../../utils/components/general-layout'
import withHandlePressBack from '../../../navigation/handle-press-back'
import { anime, StoreState } from '../../../store/types'
import { Dispatch } from 'redux'

const playEpisode = (id: number, number: number, name: string, dispatch: Dispatch) => {
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

const renderEpisode = (episode: anime.episode, animeName: string, dispatch: Dispatch) => (
  <Episode
    episode={episode}
    handlePlay={() => playEpisode(parseInt(episode.url.split('/')[2]), episode.number, animeName, dispatch)}
  />
)

const keyExtractor = (item: anime.episode, index: number) => `episode_${item.number}_${index}`

const reverse = (data: anime.episode[], setData: React.Dispatch<React.SetStateAction<anime.episode[]>>) => {
  let tmp = data.slice()
  tmp.reverse()
  setData(tmp)
}

const getOrderText = (data: anime.episode[]) => {
  if (data.length > 0 && data[0].number < data[data.length - 1].number) return 'Menor a mayor'
  return 'Mayor a menor'
}

type Props = {
  dispatch: Dispatch
  animeName: string
  list: anime.episode[]
}

const EpisodeList: React.FC<Props> = ({ dispatch, animeName = '', list = [] }) => {
  const [data, setData] = useState(list)
  useEffect(() => {
    setData(data.length ? data : list)
  })
  return (
    <GeneralLayout>
      <Button
        mode="outlined"
        color='#424242'
        onPress={() => reverse(data, setData)}
      > {getOrderText(data)} </Button>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => renderEpisode(item, animeName, dispatch)}
        ItemSeparatorComponent={EpisodeSeparator}
      />
    </GeneralLayout>
  )
}

const mapStateToProps = (state: StoreState) => ({
  list: state.anime && typeof state.anime ? state.anime.episodeList : [],
  animeName: state.anime ? state.anime.name : ''
})

const EpisodeListScreen = withHandlePressBack(mapStateToProps)(EpisodeList)

export default EpisodeListScreen