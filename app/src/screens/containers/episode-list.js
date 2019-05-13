import withHandlePressBack from '../../navigation/handle-press-back'
import EpisodeList from '../../features/anime/containers/episode-list'

const EpisodeListScreen = withHandlePressBack(EpisodeList, state => ({list: state.anime.episodeList, animeName: state.anime.name}))

export default EpisodeListScreen 