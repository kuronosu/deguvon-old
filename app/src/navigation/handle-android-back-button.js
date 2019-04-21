import React from 'react'
import { BackHandler } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'

const withHandleAndroidBackButton = (WrappedComponent, mapStateToProps) => connect(mapStateToProps)(
  class extends React.Component {
    componentWillMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick = () => {
      if (this.props.navigation.index === 0) {
        return false
      }
      this.props.dispatch(NavigationActions.back())
      return true
    }
    render(){
      return <WrappedComponent {...this.props} />
    }
  }
)

export default withHandleAndroidBackButton