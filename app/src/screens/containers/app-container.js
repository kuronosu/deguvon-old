import React, { Component } from "react";
import { Dimensions, BackHandler } from "react-native";
// import { NavigationActions, withNavigation } from 'react-navigation';
import { connect } from 'react-redux'
import updateDirectory from "../../utils/update-directory";
import GeneralLayout from "../../utils/components/general-layout";

class AppContainer extends Component {

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

  _onLayout = e => {
    this._updateScreenInfo()
  }

  _onBackButtonPressAndroid = () => {
    // if (this.props.navigation.index === 0) {
    //   return false;
    // }

    // this.props.dispatch(NavigationActions.back());
    // return true;
    return false
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._onBackButtonPressAndroid);
    if (!this.props.directoryUpdated){
      updateDirectory()
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
      <GeneralLayout onLayout={this._onLayout}>
        { this.props.children }
      </GeneralLayout>
    )
  }
}

const mapStateToProps = state => {
  return {
    directoryUpdated: state.directory.updated
  }
}

export default connect(mapStateToProps)(AppContainer)