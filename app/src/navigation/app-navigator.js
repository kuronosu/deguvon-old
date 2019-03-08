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
        else if (navigation.state.routes[navigation.state.index].key == 'Config')
          return {title: 'Configuracion'}
        return {}
      }
    },
    Anime: AnimeScreen
  },
  {
    defaultNavigationOptions: {
      title: "Deguvon",
      headerStyle: {
        backgroundColor: '#37474f'
      },
      headerTitleStyle: {
        color: 'white',
        fontWeight: 'normal'
      }
    },
  }
)

export default createAppContainer(AppNavigator)