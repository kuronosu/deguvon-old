import { createStackNavigator, createAppContainer } from 'react-navigation'
import React, { Component } from 'react'
import { Text, View } from 'react-native'

class TmpComp extends Component{
  render(){
    return(
      <View>
        <Text>Hola</Text>
      </View>
    )
  }
}

const Main = createStackNavigator(
  {
    Home: TmpComp
  }
)

export default createAppContainer(Main)