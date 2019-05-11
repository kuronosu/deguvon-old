import React, { Component } from "react";
import { View } from "react-native";
import Events from "../components";
import Api from "./group-api";

export default class Settings extends Component {
  render() {
    return (
      <View>
        <Api />
      </View>
    )
  }
}
