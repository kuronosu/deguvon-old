import {
  createStackNavigator,
  createAppContainer
} from 'react-navigation'
import HomeNavigator from './home-navigator'
import AnimeScreen from '../screens/containers/anime'

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: ({ navigation }) => {
        if (navigation.state.routes[navigation.state.index].key == 'Directory')
          return {title: 'Directorio'}
        return {}
      }
    },
    Anime: AnimeScreen
  },
  {
    defaultNavigationOptions: {
      title: "Deguvon",
      headerStyle: {
        backgroundColor: '#102027'
      },
      headerTitleStyle: {
        color: 'white',
        fontWeight: 'normal'
      }
    },
  }
)

export default createAppContainer(AppNavigator)