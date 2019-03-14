import React, { Component } from "react";
import { Dimensions, BackHandler } from "react-native";
import { NavigationActions, withNavigation } from 'react-navigation';
import { connect } from 'react-redux'
import Base from "../components/base";
import Api from "../../api";
import DropDownHolder from "../../utils/dropdownholder";

class AppLayout extends Component {

  _updateScreenInfo(){
    const d = Dimensions.get('window')
    this.props.dispatch({
      type: 'SET_DEVICE_DATA',
      payload: {
        screenMode: d.width < d.height,
        screenSize: d
      }
    })
  }

  async _updateDirectory(){
    DropDownHolder.alert('info', 'Actualizando directorio','')
    try {
      this.props.dispatch({
        type: 'SET_DIRECTORY_DATA',
        payload: {
          updating: true
        }
      })
      let directory = await Api.getDirectory();
      this.props.dispatch({
        type: 'SET_DIRECTORY_DATA',
        payload: {
          updated: true,
          data: Object.values(directory)
        }
      })
      DropDownHolder.alert('success', 'Directorio actualizado', 'Directorio actualizado con exito')
      this.props.dispatch({
        type: 'SET_DIRECTORY_DATA',
        payload: {
          updating: false
        }
      })
    } catch (error) {
      DropDownHolder.alert('error', 'Error', 'Error al actualizar el directorio')
      this.props.dispatch({
        type: 'SET_DIRECTORY_DATA',
        payload: {
          updating: false
        }
      })
      console.log(error)
    }
  }

  _onLayout = e => {
    this._updateScreenInfo()
  }

  _onBackButtonPressAndroid = () => {
    if (this.props.navigation.index === 0) {
      return false;
    }

    this.props.dispatch(NavigationActions.back());
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._onBackButtonPressAndroid);
    if (!this.props.directoryUpdated){
      this._updateDirectory()
    }
  }

  componentWillMount(){
    this._updateScreenInfo()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._onBackButtonPressAndroid);
  }

  render() {
    return (
      <Base onLayout={this._onLayout}>
        {React.cloneElement(this.props.children, { _updateDirectory: this._updateDirectory })}
      </Base>
    )
  }
}

const mapStateToProps = state => {
  return {
    directoryUpdated: state.directory.updated
  }
}

export default withNavigation(connect(mapStateToProps)(AppLayout))