import React, { Component } from "react"
import { Dimensions } from "react-native"
import { connect } from 'react-redux'
import updateDirectory from "../../api/update-directory"
import GeneralLayout from "../../utils/components/general-layout"

class AppContainer extends Component {

  constructor(props) {
    super(props)
    this._updateScreenInfo()
    this.props.dispatch({
      type: 'SET_DIRECTORY_DATA',
      payload: {updating: false}
    })
  }

  _updateScreenInfo() {
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

  componentDidMount() {
    if (!this.props.directoryUpdated) {
      updateDirectory()
    }
  }

  render() {
    return (
      <GeneralLayout onLayout={this._onLayout}>
        {this.props.children}
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