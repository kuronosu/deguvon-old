import { Component } from "react";
import { Dimensions } from "react-native";
import { connect } from 'react-redux'

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
  onLayout = e => {
    this._updateScreenInfo()
  }
  componentWillMount(){
    this._updateScreenInfo()
  }
  render() {
    return this.props.children
  }
}

export default connect(null)(AppLayout)