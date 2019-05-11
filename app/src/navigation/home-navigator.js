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
        title: 'Directorio',
        // drawerIcon: ({ tintColor }) => (
        //   <Image
        //     source={require("../assets/icons/home.png")}
        //     resizeMode="contain"
        //     style={{ width: 20, height: 20, tintColor: tintColor }}
        //   />
        // )
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
    inactiveColor: '#3e2465',
    barStyle: { backgroundColor: '#558b2f' },
    labeled: false,
  }
)

export default HomeNavigator