import { createMaterialTopTabNavigator } from 'react-navigation'
import EpisodeListScreen from '../screens/containers/episode-list'
import AnimeScreen from '../screens/containers/anime'

const AnimeNavigator = createMaterialTopTabNavigator(
  {
    Details: {
      screen: AnimeScreen,
      navigationOptions: {
        title: 'Detalles'
      }
    },
    Episodes: {
      screen: EpisodeListScreen,
      navigationOptions: {
        title: 'Episodios'
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#fff',
      style: {
        backgroundColor: '#85bb5c',
      },
    }
  }
)

export default AnimeNavigator