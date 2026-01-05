import { Text, StyleSheet } from 'react-native';
import Colors from '../../../constants/Colors';

export default function LabelText({ style, children, ...props }) {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: Colors.gray700,
    marginBottom: 6,
  },
});