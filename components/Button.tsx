import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '../assets/Colors';

const Button = ({
  title,
  type,
  onPress,
}: {
  title: string;
  type: 'top' | 'right' | 'number';
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor:
            type == 'top'
              ? Colors.btnFunction
              : type == 'right'
              ? Colors.btnOperator
              : Colors.btnNumber,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={{
          fontSize: 34,
          color: Colors.white,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: 70,
    width: 70,
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
