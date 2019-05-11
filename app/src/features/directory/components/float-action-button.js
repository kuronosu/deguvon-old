import React from 'react'
import {
  StyleSheet
} from 'react-native'
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DirectoryFloatActionButton = ({ filterType, onPressFilter }) => (
  <ActionButton buttonColor="#c17900">
    <ActionButton.Item buttonColor='#62727b' title={`Tipo: ${filterType}`} onPress={onPressFilter}>
      <Icon name="filter-list" style={styles.actionButtonIcon} />
    </ActionButton.Item>
  </ActionButton>
)

export default DirectoryFloatActionButton

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});