import React from 'react'
import {
  createStackNavigator,
  createAppContainer,
  HeaderProps,
  NavigationInjectedProps
} from 'react-navigation'
import HomeNavigator from './home-navigator'
import AnimeNavigator from './anime-navigator'
import SearchButton from './containers/search-button'
import NavbarSearch from './containers/navbar-search'
import SearchScreen from '../screens/search/containers'
import VideoPlayer from '../screens/player/containers'

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: ({ navigation }: NavigationInjectedProps) => {
        if (navigation.state.routes[navigation.state.index].key == 'Directory')
          return { title: 'Directorio' }
        else if (navigation.state.routes[navigation.state.index].key == 'Config')
          return { title: 'Configuracion' }
        return {}
      }
    },
    Anime: {
      screen: AnimeNavigator,
      navigationOptions: ({ navigation }: NavigationInjectedProps) => {
        return { title: navigation.getParam('title', 'Anime') }
      }
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: ({ navigation }: NavigationInjectedProps) => {
        return {
          header: (props: HeaderProps) => <NavbarSearch {...props} onChangeText={navigation.state.params ? navigation.state.params.handleChangeText : () => { }} />
        }
      }
    },
    Player: {
      screen: VideoPlayer,
      navigationOptions: {
        headerVisible: false,
        headerMode: 'none',
        header: null
      }
    }
  },
  {
    defaultNavigationOptions: {
      title: "Deguvon",
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#558b2f'
      },
      headerTitleStyle: {
        color: 'white',
        fontWeight: 'normal'
      },
      headerRight: <SearchButton />,
      headerRightContainerStyle: {
        marginRight: 20
      }
    },
  }
)

export default createAppContainer(AppNavigator)