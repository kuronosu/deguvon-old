import React from 'react'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import RecentScreen from '../screens/containers/recent'
import SettingsScreen from '../screens/containers/settings'
import DirectoryScreen from '../screens/containers/directory'
import HomeNavigatorIcon from './components/home-navigator-icon'

const HomeNavigator = createMaterialBottomTabNavigator(
  {
    Recent: {
      screen: RecentScreen,
      navigationOptions: {
        title: 'Recientes',
        tabBarIcon: props => <HomeNavigatorIcon iconSet='EvilIcons' name="clock" {...props} />
      }
    },
    Directory: {
      screen: DirectoryScreen,
      navigationOptions: {
        title: 'Directorio',
        tabBarIcon: props => <HomeNavigatorIcon iconSet='Entypo' name="grid" {...props} />
      },
    },
    // Config: {
    //   screen: SettingsScreen,
    //   navigationOptions: {
    //     title: 'Configuracion',
    //     tabBarIcon: <Icon iconSet='Octicons' name="settings" size={25} color='white'/>
    //   }
    // }
  },
  {
    activeColor: '#fff',
    inactiveColor: '#9E9E9E',
    barStyle: { backgroundColor: '#558b2f' },
    labeled: false,
  }
)

export default HomeNavigator