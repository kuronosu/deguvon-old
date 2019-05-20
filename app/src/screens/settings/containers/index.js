import React, { Component } from "react"
import { View } from "react-native"
import Api from "./group-api"
import withHandlePressBack from "../../../navigation/handle-press-back"

class Settings extends Component {
  render() {
    return (
      <View>
        <Api />
      </View>
    )
  }
}

export default SettingsScreen = withHandlePressBack(Settings)