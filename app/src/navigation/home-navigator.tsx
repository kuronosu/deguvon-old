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
        tabBarIcon: (props: TabBarIconProps) => <HomeNavigatorIcon iconSet='EvilIcons' name="clock" {...props} />
      }
    },
    Directory: {
      screen: DirectoryScreen,
      navigationOptions: {
        title: 'Directorio',
        tabBarIcon: (props: TabBarIconProps) => <HomeNavigatorIcon iconSet='Entypo' name="grid" {...props} />
      },
    },
  },
  {
    activeTintColor: '#fff',
    inactiveTintColor: '#9E9E9E',
    barStyle: { backgroundColor: '#558b2f' },
    labeled: false,
  }
)

export default HomeNavigator