import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";

type Props = {
  children?: ReactNode,
  style?: StyleProp<ViewStyle>
}

const GeneralLayout: React.FC<Props> = ({children, style, ...rest}: Props) => {
  return (
    <View  {...rest} style={[styles.container, style]}>
      {children}
    </View>
  )
}

export default GeneralLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e2e1'
  }
})