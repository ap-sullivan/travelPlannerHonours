import { Text, StyleSheet } from 'react-native';
import Colors from '../../../constants/Colors';

export default function AppText({ style, children, ...props }) {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: Colors.gray900,
    fontSize: 15,
  },
});