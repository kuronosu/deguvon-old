import React from 'react'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import RecentScreen from '../screens/containers/recent'
import SettingsScreen from '../screens/containers/settings'
import Icon from '../utils/components/icon';
import DirectoryScreen from '../screens/containers/directory';

const HomeNavigator = createMaterialBottomTabNavigator(
  {
    Recent: {
      screen: RecentScreen,
      navigationOptions: {
        title: 'Recientes',
        tabBarIcon: <Icon iconSet='EvilIcons' name="clock" size={28} color='white'/>
      }
    },
    Directory: {
      screen: DirectoryScreen,
      navigationOptions: {
        tabBarIcon: <Icon iconSet='Entypo' name='grid' size={25} color='white'/>,
        title: 'Directorio'
      },
    },
    Config: {
      screen: SettingsScreen,
      navigationOptions: {
        title: 'Configuracion',
        tabBarIcon: <Icon iconSet='Octicons' name="settings" size={25} color='white'/>
      }
    }
  },
  {
    activeColor: '#fff',
    inactiveColor: '#3e2465',
    barStyle: { backgroundColor: '#37474f' },
    labeled: false,
  }
)

export default HomeNavigator