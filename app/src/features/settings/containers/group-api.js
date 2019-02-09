import React, { Component } from 'react';
import { View, Text } from 'react-native';
import ApiSetting from '../components/api-setting';
import settingsManager from '../../../utils/settings-manager';

class Api extends Component {
  state = {
    text: '',
    saveState: 'Cambios Guardados'
  }
  componentWillMount(){
    settingsManager.getSetting('API_SERVER').then(val => {
      this.setState({
        text: val
      })
    })
  }
  onChangeText = text => {
    this.setState({
      text: text,
      saveState: 'Guardando cambios'
    })
    settingsManager.setSetting('API_SERVER', text)
      .then(val => {
        state = {
          saveState: 'Cambios Guardados'
        }
      }).catch( e => {
        console.error(e)
      })
  }
  render() {
    return (
      <View>
        <ApiSetting
          text={this.state.text}
          onChangeText={this.onChangeText}
        />
        <Text>{this.state.saveState}</Text>
      </View>
    );
  }
}

export default Api;
