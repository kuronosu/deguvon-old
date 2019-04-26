import React from 'react'
import { BackHandler } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import getCurrentRoute from './get-current-route'

const withHandlePressBack = (WrappedComponent, mapStateToProps) => connect(mapStateToProps)(
  class extends React.Component {

    counter = 0
    timer = null

    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    }

    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
      clearTimeout(this.timer)
    }

    handleBackPress = () => {
      if (getCurrentRoute().toLowerCase() === 'recent') {
        if(this.timer) {clearTimeout(this.timer)}
        this.timer = setTimeout(() => {this.counter = 0}, 500)
        this.counter += 1
        if (this.counter >= 2){
          BackHandler.exitApp()
        }
      }
      this.props.dispatch(NavigationActions.back())
      return true
    }

    render(){
      return <WrappedComponent {...this.props} />
    }
  }
)

export default withHandlePressBack