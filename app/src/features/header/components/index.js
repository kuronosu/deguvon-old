import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView
} from "react-native";

function Header(props) {
  return (
    <View style={styles.shadow}>
      <SafeAreaView>
        <View style={styles.container}>
          {/* <Image
            source={require('../../../../assets/logo.jpg')}
            style={styles.logo}
          /> */}
          <Text style={styles.brand}>Deguvon</Text>
          <View style={styles.right}>
            {props.children}
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 50,
    resizeMode: 'contain',
  },
  shadow: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1
  },
  brand: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 27,
    color: 'white',
  },
  container: {
    padding: 10,
    paddingBottom: 9,
    flexDirection: 'row',
    backgroundColor: '#2C2B2C',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
})

export default Header;