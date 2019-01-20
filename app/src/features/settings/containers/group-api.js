import React, { Component } from 'react';
import ApiSetting from '../components/api-setting';
import settingsManager from '../../../utils/settings-manager';

class Api extends Component {
  state = {
    text: ''
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
      text: text
    })
  }
  render() {
    return (
      <ApiSetting
        text={this.state.text}
        onChangeText={this.onChangeText}
      />
    );
  }
}

export default Api;
