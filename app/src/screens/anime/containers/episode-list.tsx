import { Dispatch } from 'redux'
import { FlatList } from 'react-native'
import { DispatchProp } from 'react-redux'
import { Button, Text } from 'react-native-paper'
import React, { useState, useEffect } from 'react'
import { NavigationActions } from 'react-navigation'

import { EpisodeModel, AnimeModel, StoreState } from '../../../'
import { getEpisodeData } from '../../../api'
import Episode from '../components/episode'
import DropDownHolder from '../../../utils/dropdownholder'
import EpisodeSeparator from '../components/episode-separator'
import GeneralLayout from '../../../utils/components/general-layout'
import withHandlePressBack from '../../../navigation/handle-press-back'
import { getNatsukiVideo } from '../../../api/video-servers'

const playEpisode = (anime_id: string, number: number, name: string, dispatch: Dispatch) => {
  (async () => {
    try {
      // const server = await getServers(id)
      // const availableServers = getAvailableServers(server)
      const natsukiData = await getNatsukiVideo(anime_id, number)
      const video = natsukiData.videos.length > 0 ? natsukiData.videos[0].file : null
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

const renderEpisode = (episode: EpisodeModel, animeName: string, animeID: string ,dispatch: Dispatch) => (
  <Episode
    episode={episode}
    handlePlay={() => playEpisode(animeID, episode.number, animeName, dispatch)}
  />
)

const keyExtractor = (item: EpisodeModel, index: number) => `episode_${item.number}_${index}`

const reverse = (data: EpisodeModel[], setData: React.Dispatch<React.SetStateAction<EpisodeModel[]>>) => {
  let tmp = data.slice()
  tmp.reverse()
  setData(tmp)
}

const getOrderText = (data: EpisodeModel[]) => {
  if (data.length > 0 && data[0].number < data[data.length - 1].number) return 'Menor a mayor'
  return 'Mayor a menor'
}

type Props = {
  animeName: string
  list: EpisodeModel[]
  animeID: string
}

const EpisodeList: React.FC<Props & DispatchProp> = ({ dispatch, animeName, list, animeID }) => {
  const [data, setData] = useState(list)
  useEffect(() => {
    setData(data.length ? data : list)
  })
  return (
    <GeneralLayout>
      <Button
        color='#424242'
        onPress={() => reverse(data, setData)}
      > {getOrderText(data)} </Button>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => renderEpisode(item, animeName, animeID, dispatch)}
        ItemSeparatorComponent={EpisodeSeparator}
        ListEmptyComponent={<Text>Nada</Text>}
      />
    </GeneralLayout>
  )
}

const mapStateToProps = (state: StoreState): Props => {
  let animeStote = state.anime as AnimeModel
  return {
  list: state.anime && animeStote.episodes ? animeStote.episodes : [],
  animeName: state.anime  && animeStote.name ? animeStote.name : '',
  animeID: state.anime  && animeStote.aid ? animeStote.aid : '-1'
}}

const EpisodeListScreen = withHandlePressBack<Props>(mapStateToProps)(EpisodeList)

export default EpisodeListScreen