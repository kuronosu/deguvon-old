import React, { Component } from 'react';
import { connect } from 'react-redux'
import { TextInput, StyleSheet } from 'react-native';
import BackButton from './back-button';
import NavbarSearchLayout from '../components/navbar-search-layout';
import Icon from 'react-native-vector-icons/MaterialIcons'

class NavbarSearch extends Component {
  render() {
    return (
      <NavbarSearchLayout>
        <TextInput
          style={styles.searchInput}
          onChangeText={this.props.onChangeText}
          value={this.props.text}
        />
        <BackButton backImage={<Icon name='close' size={25} color='white' />}/>
      </NavbarSearchLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    text: state.search.text
  }
}

export default connect(mapStateToProps)(NavbarSearch);

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    marginVertical: 10,
    marginLeft: 25,
    padding: 0,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    color: 'white'
  }
})