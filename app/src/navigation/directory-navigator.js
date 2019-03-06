import { createMaterialTopTabNavigator } from 'react-navigation'
import DirectoryScreen from '../screens/containers/directory';

const DirectoryNavigator = createMaterialTopTabNavigator(
  {
    AnimeDirectory: {
      screen: DirectoryScreen,
      navigationOptions: {
        title: 'Anime',
      }
    },
    MovieDirectory: {
      screen: DirectoryScreen,
      navigationOptions: {
        title: 'Pelicula'
      }
    },
    OvaDirectory: {
      screen: DirectoryScreen,
      navigationOptions: {
        title: 'OVA',
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: '#00695c'
      }
    }
  },
  {
  }
)

export default DirectoryNavigator