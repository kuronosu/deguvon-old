import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextInput, StyleSheet } from 'react-native'
import { StoreState } from '../../'
import BackButton from './back-button'
import NavbarSearchLayout from '../components/navbar-search-layout'
import Icon from '../../utils/components/icon'

type Props = {
  onChangeText: (text: string) => void,
  text?: string
}

class NavbarSearch extends Component<Props> {
  render() {
    return (
      <NavbarSearchLayout>
        <TextInput
          style={styles.searchInput}
          onChangeText={this.props.onChangeText}
          value={this.props.text}
        />
        <BackButton backImage={<Icon set='MaterialIcons' name='close' size={25} color='white' />} />
      </NavbarSearchLayout>
    );
  }
}

const mapStateToProps = (state: StoreState) => {
  return {
    text: state.search && state.search.text
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