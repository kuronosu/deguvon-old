import React from 'react'
import { View, Text } from 'react-native'
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
        tabBarIcon: ({ tintColor, focused }) =>  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Icon iconSet='EvilIcons' name="clock" size={focused ? 28: 26} color={tintColor}/>
        </View>
      }
    },
    Directory: {
      screen: DirectoryScreen,
      navigationOptions: {
        title: 'Directorio',
        tabBarIcon: ({ tintColor, focused }) => <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Icon iconSet='Entypo' name='grid' size={focused ? 28: 25} color={tintColor}/>
          </View>
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
    inactiveColor: '#DCE775',
    barStyle: { backgroundColor: '#33691e' },
    labeled: false,
  }
)

export default HomeNavigator