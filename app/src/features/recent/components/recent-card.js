import React from 'react';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native'

const sizePercentPortrait = 0.45
const sizePercentLandscape = 0.225
const imageSizeRel = 238 / 339

const RecentCard = props => {
  const screenWidth = Dimensions.get('window').width 
  const separatorSize = props.mode ? 1/30/2: 1/50/2
  const styleSize = StyleSheet.create({
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
    },
  })
  let marginStyle
  if (props.mode){
    marginStyle = props.index % 2==0 ? styleSize.marginRight: styleSize.marginLeft
  } else {
    switch (props.index % 4) {
      case 0:
        marginStyle = styleSize.marginRight
        break;
      case 1:
      marginStyle = styleSize.marginHorizontal
        break;
      case 2:
        marginStyle = styleSize.marginHorizontal
          break;
      case 3:
      marginStyle = styleSize.marginLeft
        break;
      default:
        marginStyle = styleSize.marginHorizontal
        break;
    }
  }
  return (
    <TouchableOpacity
      onPress={()=>props.onPress({...props})}
      onLongPress={()=>props.onLongPress({...props})}
      activeOpacity={0.6}
      >
      <View style={marginStyle}>
        <Image
          style={[
            styles.cover,
            !props.mode ? styleSize.landscape: styleSize.portrait
          ]}
          source={{
            uri: `http://deguvon.kuronosu.space${props.anime.image}`
          }}
        />
        <View style={styles.episode}>
          <Text style={styles.episodeText}>{props.name}</Text>
        </View>
        <View style={[
            styles.name,
            !props.mode ? styleSize.widthLandscape: styleSize.widthPortrait
          ]}>
          <Text numberOfLines={1} style={styles.nameText}>{props.anime.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecentCard;

const styles = StyleSheet.create({
  name: {
    backgroundColor: '#484848',
    position: 'absolute',
    bottom: -1,
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
  title: {
  }
})
