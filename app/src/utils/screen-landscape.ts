import { Dimensions, ScaledSize } from 'react-native'

const dimensionsScreen = Dimensions.get('screen')
const screen: ScaledSize = {
  width: dimensionsScreen.width > dimensionsScreen.height ? dimensionsScreen.width : dimensionsScreen.height,
  height: dimensionsScreen.width < dimensionsScreen.height ? dimensionsScreen.width : dimensionsScreen.height,
  scale: dimensionsScreen.scale,
  fontScale: dimensionsScreen.fontScale
}

const { width, height } = screen

export { width, height }

export default screen