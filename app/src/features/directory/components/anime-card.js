import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback
} from 'react-native'

const sizePercentPortrait = 0.3
const sizePercentLandscape = 0.225
const imageSizeRel = 238 / 339

const AnimeCard = props => {
  const styles = createStyles(
    props.screenWidth,
    props.mode ? 1/40/2: 1/50/2
  )
  let marginStyle
  switch (props.index % props.mode ? 3: 4) {
    case 0:
      marginStyle = styles.marginRight
      break;
    case props.mode ? 2: 3:
    marginStyle = styles.marginLeft
      break;
    default:
      marginStyle = styles.marginHorizontal
      break;
  }
  return (
    <TouchableNativeFeedback
      onLongPress={()=>props.onLongPressRecentCard({...props})}
      onPress={()=>props.onPressRecentCard({...props})}
      // activeOpacity={0.3}
      background={TouchableNativeFeedback.Ripple("#000")}
      useForeground={true}
      >
      <View style={marginStyle}>
        <Image
          style={[
            styles.cover,
            !props.mode ? styles.landscape: styles.portrait
          ]}
          source={{
            uri: `https://kuronosu.dev${props.image}`
          }}
        />
        <View style={styles.episode}>
          <Text style={styles.episodeText}>{props.typea}</Text>
        </View>
        <View style={[
            styles.name,
            !props.mode ? styles.widthLandscape: styles.widthPortrait
          ]}>
          <Text numberOfLines={1} style={styles.nameText}>{props.name}</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

export default AnimeCard;

const createStyles = (screenWidth, separatorSize) => (
  StyleSheet.create({
    name: {
      backgroundColor: '#484848',
      margin: 0,
      padding: 5,
      borderBottomRightRadius: 5,
      borderBottomLeftRadius: 5,
    },
    nameText: {
      color: '#fafafa',
      fontSize: 17,
      flex: 1,
    },
    cover: {
      resizeMode: 'contain',
      borderRadius: 5
    },
    episode: {
      position:'absolute',
      left: 0,
      top: 0,
      backgroundColor: '#FF9800',//'#ff7e00',
      borderBottomEndRadius: 15,
      borderTopStartRadius: 5
    },
    episodeText: {
      color: 'white',
      fontSize: 15,
      paddingVertical: 5,
      paddingHorizontal: 7
    },
    marginRight: {
      marginRight: screenWidth * separatorSize
    },
    marginHorizontal:{
      marginHorizontal: screenWidth * separatorSize
    },
    marginLeft: {
      marginLeft: screenWidth * separatorSize
    },
    widthPortrait: {
      width: screenWidth * sizePercentPortrait,
    },
    widthLandscape: {
      width: screenWidth * sizePercentLandscape,
    },
    portrait: {
      width: screenWidth * sizePercentPortrait,
      height: (screenWidth / imageSizeRel) * sizePercentPortrait,
    },
    landscape: {
      width: screenWidth * sizePercentLandscape,
      height: (screenWidth / imageSizeRel) * sizePercentLandscape,
    }
  })
)