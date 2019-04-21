import { Dimensions } from 'react-native'

const dimensionsScreen = Dimensions.get('screen')
const screen = {
  width: dimensionsScreen.width > dimensionsScreen.height?  dimensionsScreen.width: dimensionsScreen.height,
  height: dimensionsScreen.width < dimensionsScreen.height?  dimensionsScreen.width: dimensionsScreen.height,
}

const { width, height } = screen

export { width, height }

export default screen