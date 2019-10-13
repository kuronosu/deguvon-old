import React, { Component } from "react"
import { Dimensions } from "react-native"
import { connect, DispatchProp } from 'react-redux'
import updateDirectory from "../../api/update-directory"
import GeneralLayout from "../../utils/components/general-layout"
import { StoreState } from "../../"
import { setDeviceData } from "../../store/actions"

interface Props extends DispatchProp {
  directoryUpdated: boolean
}

class AppContainer extends Component<Props> {

  constructor(props: Props) {
    super(props)
    this._updateScreenInfo()
    this.props.dispatch({
      type: 'SET_DIRECTORY_DATA',
      payload: { updating: false }
    })
  }

  _updateScreenInfo() {
    const d = Dimensions.get('window')
    this.props.dispatch(setDeviceData({
      screenMode: d.width < d.height,
      screenSize: d
    }))
  }

  _onLayout = () => {
    this._updateScreenInfo()
  }

  componentDidMount() {
    if (!this.props.directoryUpdated) {
      // updateDirectory()
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

const mapStateToProps = (state: StoreState) => {
  return {
    directoryUpdated: state.directory.updated
  }
}

export default connect(mapStateToProps)(AppContainer)