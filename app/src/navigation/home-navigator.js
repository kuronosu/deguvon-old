import React from 'react'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import HomeNavigatorIcon from './components/home-navigator-icon'
import RecentScreen from '../screens/recent/containers'
import DirectoryScreen from '../screens/directory/containers'

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