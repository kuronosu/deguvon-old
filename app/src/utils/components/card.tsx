import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback
} from 'react-native'

const defaultImgAspectRatioSize = 238 / 339

interface CardProps {
  pressData?: any
  mode: boolean
  screenWidth: number
  index: number
  onPressCard: Function
  onLongPressCard: Function
  image: string
  primaryText: string
  secondaryText: string
  uniqueInRow?: boolean
  cardsPerRowLandscape?: number
  cardsPerRowPortrait?: number
  primaryOverlay?: boolean
  imgAspectRatioSize?: number
}

const Card: React.FC<CardProps> = (props: CardProps) => {
  let styles
  let marginStyle
  if (props.uniqueInRow) {
    styles = createStyles(props.screenWidth, 0, 0.9)
    marginStyle = styles.marginHorizontal
  } else {
    styles = createStyles(
      props.screenWidth,
      props.mode ? 1 / ((props.cardsPerRowPortrait + 1) * 10) / 2 : 1 / ((props.cardsPerRowLandscape + 1) * 10) / 2,
      0.9 / (props.mode ? props.cardsPerRowPortrait : props.cardsPerRowLandscape)
    )
    switch (props.index % (props.mode ? props.cardsPerRowPortrait : props.cardsPerRowLandscape)) {
      case 0:
        marginStyle = styles.marginRight
        break;
      case (props.mode ? props.cardsPerRowPortrait : props.cardsPerRowLandscape) - 1:
        marginStyle = styles.marginLeft
        break;
      default:
        marginStyle = styles.marginHorizontal
        break;
    }
  }

  return (
    <View style={marginStyle}>
      <TouchableNativeFeedback
        onPress={() => { props.onPressCard && props.onPressCard(props.pressData) }}
        onLongPress={() => { props.onLongPressCard && props.onLongPressCard(props.pressData) }}
        background={TouchableNativeFeedback.Ripple('white')}
        useForeground={true}
      >
        <View>
          <View style={[styles.cover, props.primaryOverlay && styles.coverBoderAll, props.primaryOverlay && styles.radiusBot, styles.backgroundImage]}>
            <Image
              style={[styles.cover, props.primaryOverlay && styles.coverBoderAll]}
              source={{
                uri: `https://kuronosu.dev${props.image}`
              }}
            />
          </View>
          <View style={styles.secondary}>
            <Text style={styles.secondaryText}>{props.secondaryText}</Text>
          </View>
          <View style={[styles.primary, props.primaryOverlay && styles.primaryOverlay]}>
            <Text numberOfLines={1} style={styles.primaryText}>{props.primaryText}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  )
}

export default Card

const createStyles = (screenWidth: number, separatorSize: number, sizePercent: number, imgAspectRatioSize: number = defaultImgAspectRatioSize) => {
  return StyleSheet.create({
    primary: {
      backgroundColor: '#484848',
      margin: 0,
      padding: 5,
      borderBottomRightRadius: 5,
      borderBottomLeftRadius: 5,
      width: screenWidth * sizePercent,
    },
    primaryOverlay: {
      position: 'absolute',
      bottom: -1
    },
    primaryText: {
      color: '#fafafa',
      fontSize: 17,
      flex: 1,
    },
    cover: {
      resizeMode: 'contain',
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      width: screenWidth * sizePercent,
      height: (screenWidth / imgAspectRatioSize) * sizePercent,
    },
    coverBoderAll: {
      borderRadius: 5
    },
    secondary: {
      position: 'absolute',
      left: 0,
      top: 0,
      backgroundColor: '#f9a825',//'#ff7e00',
      borderBottomEndRadius: 15,
      borderTopStartRadius: 5
    },
    secondaryText: {
      color: 'white',
      fontSize: 15,
      paddingVertical: 5,
      paddingHorizontal: 7
    },
    marginRight: {
      marginRight: screenWidth * separatorSize
    },
    marginHorizontal: {
      marginHorizontal: screenWidth * separatorSize
    },
    marginLeft: {
      marginLeft: screenWidth * separatorSize
    },
    backgroundImage: {
      backgroundColor: '#222d34',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 7,
    },
    radiusBot: {
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 6
    }
  })
}