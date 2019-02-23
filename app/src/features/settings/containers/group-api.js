import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from "react-redux";

import SettingLayout from '../components/setting-layout';

import ApiSetting from '../components/api-setting';

class Api extends Component {
  state = {
    saveState: 'Cambios Guardados'
  }
  onChangeHostText = text => {
    this.setState({
      saveState: 'Guardando cambios...'
    })
    this.props.dispatch({
      type: 'SET_CONFIG',
      payload: {
        api: {
          host: text,
          route: this.props.route
        }
      }
    })
    this.setState({
      saveState: 'Cambios Guardados'
    })
  }
  onChangeRouteText = text => {
    this.setState({
      saveState: 'Guardando cambios...'
    })
    this.props.dispatch({
      type: 'SET_CONFIG',
      payload: {
        api: {
          host: this.props.host,
          route: text
        }
      }
    })
    this.setState({
      saveState: 'Cambios Guardados'
    })
  }
  render() {
    return (
      <SettingLayout title='Api'>
        <ApiSetting
          title='Api host'
          value={this.props.host || ''}
          onChangeText={this.onChangeHostText}
          warningText='Modificar esta configuracion prodria hacer la que aplicacion deje de funcionar'
        />
        <ApiSetting
          title='Api route'
          value={this.props.route || ''}
          onChangeText={this.onChangeRouteText}
          warningText='Modificar esta configuracion prodria hacer la que aplicacion deje de funcionar'
        />
        <Text>{this.state.saveState}</Text>
      </SettingLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    host: state.config.api.host,
    route: state.config.api.route
  }
}

export default connect(mapStateToProps)(Api);
