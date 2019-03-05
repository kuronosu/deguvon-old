import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator
} from 'react-navigation'
import RecentScreen from '../screens/containers/recent'
import AnimeScreen from '../screens/containers/anime'
import SettingsScreen from '../screens/containers/settings'

const HomeNavigator = createBottomTabNavigator(
  {
    Recent: {
      screen: RecentScreen,
      navigationOptions: {
        title: 'Recientes'
      }
    },
    Config: {
      screen: SettingsScreen,
      navigationOptions: {
        title: 'Configuracion'
      }
    }
  },
  {}
  )

const Main = createStackNavigator(
  {
    Home: HomeNavigator,
    Anime: AnimeScreen
  },
  {defaultNavigationOptions: {title: "Deguvon"}}
)

export default createAppContainer(Main)