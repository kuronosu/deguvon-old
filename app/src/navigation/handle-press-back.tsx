import React from 'react'
import { BackHandler } from 'react-native'
import { connect, DispatchProp } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { StoreState } from '../'
import getCurrentRoute from './get-current-route'

/**
 * Permite que un componente maneje el evento de atras en android
 * @param Component Componente que manejara el evento
 * @param mapStateToProps Funcion que extrae datos del store de redux
 */
const withHandlePressBack = <P extends any>(mapStateToProps?: (state: StoreState) => object) => (
  (Component: React.ComponentType<P & DispatchProp>) => connect(mapStateToProps)(
    class extends React.Component<P & DispatchProp> {

      counter: number = 0
      timer: number = 0

      componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
      }

      componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        clearTimeout(this.timer)
      }

      handleBackPress = () => {
        if (getCurrentRoute().toLowerCase() === 'recent') {
          if (this.timer) { clearTimeout(this.timer) }
          this.timer = setTimeout(() => { this.counter = 0 }, 1000)
          this.counter += 1
          if (this.counter >= 2) {
            clearTimeout(this.timer)
            BackHandler.exitApp()
          }
        }
        this.props.dispatch(NavigationActions.back())
        return true
      }

      render() {
        return <Component {...this.props as P & DispatchProp} />
      }
    }
  )
)

export default withHandlePressBack