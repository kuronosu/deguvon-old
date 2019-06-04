import React, { Component } from 'react'
import { NavigationActions, HeaderBackButton } from 'react-navigation'
import { connect, DispatchProp } from 'react-redux'
import { TouchableNativeFeedback } from 'react-native-gesture-handler'

class BackButton extends Component<DispatchProp, {}> {

  _back = () => {
    this.props.dispatch(NavigationActions.back())
  }

  render() {
    return (
      <TouchableNativeFeedback
        onPress={this._back}
      >
        <HeaderBackButton tintColor='white' {...this.props} />
      </TouchableNativeFeedback>
    )
  }
}


export default connect()(BackButton)