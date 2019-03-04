import { createStackNavigator, createAppContainer } from 'react-navigation'
import RecentScreen from '../screens/containers/recent'
import AnimeScreen from '../screens/containers/anime'

const Main = createStackNavigator(
  {
    Home: RecentScreen,
    Anime: AnimeScreen
  },
  
)

export default createAppContainer(Main)