import { NavigationContainer } from 'react-navigation'
import { createMaterialTopTabNavigator } from 'react-navigation'
import EpisodeListScreen from '../screens/anime/containers/episode-list'
import AnimeScreen from '../screens/anime/containers'

const AnimeNavigator: NavigationContainer = createMaterialTopTabNavigator(
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