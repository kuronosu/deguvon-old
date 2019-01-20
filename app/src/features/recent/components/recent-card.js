import React from 'react';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native'

const sizePorcent = 0.45
const screenWidth = Dimensions.get('window').width
const imageSizeRel = 238 / 339

const RecentCard = props => {
  return (
    <TouchableOpacity
      onPress={()=>props.onPress({...props})}
      onLongPress={()=>props.onLongPress({...props})}
      activeOpacity={0.6}
    >
      <View style={[styles.container, props.index % 2==0 ? { marginRight: screenWidth * 0.017 } : { marginLeft: screenWidth * 0.017 }]}>
        <Image
          style={styles.cover}
          source={{
            uri: props.image
          }}
        />
        <View style={styles.episode}>
          <Text style={styles.episodeText}>{props.episodeText}</Text>
        </View>
        <View style={styles.name}>
          <Text  numberOfLines={1} style={styles.nameText}>{props.animeName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecentCard;

const styles = StyleSheet.create({
  container: {
  },
  name: {
    width: screenWidth * sizePorcent,
    backgroundColor: '#484848',
    position: 'absolute',
    bottom: 0,
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
    width: screenWidth * sizePorcent,
    height: (screenWidth / imageSizeRel) * sizePorcent,
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
