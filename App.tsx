import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Button from './components/Button';
import { Colors } from './assets/Colors';

const App = () => {
  // Calculator states
  const [previousValue, setPreviousValue] = useState('');
  const [currentValue, setCurrentValue] = useState('0');
  const [selectedOperator, setSelectedOperator] = useState('');

  // Handle number or decimal input
  const onNumberPress = (input: string) => {
    if (currentValue === '0') {
      setCurrentValue(input);
    } else {
      setCurrentValue(currentValue + input);
    }
  };

  // Handle operator (+, -, *, /, %)
  const onOperatorPress = (operator: string) => {
    setSelectedOperator(operator);
    setPreviousValue(currentValue);
    setCurrentValue('0');
  };

  // Perform calculation
  const onCalculate = () => {
    const firstNum = parseFloat(previousValue);
    const secondNum = parseFloat(currentValue);

    let result = 0;
    switch (selectedOperator) {
      case '+':
        result = firstNum + secondNum;
        break;
      case '-':
        result = firstNum - secondNum;
        break;
      case '*':
        result = firstNum * secondNum;
        break;
      case '/':
        result = firstNum / secondNum;
        break;
      case '%':
        result = firstNum % secondNum;
        break;
    }

    setCurrentValue(result.toString());
    setSelectedOperator('');
    setPreviousValue('');
  };

  // Reset calculator
  const onClear = () => {
    setCurrentValue('0');
    setSelectedOperator('');
    setPreviousValue('');
  };

  // Delete last character
  const onDelete = () => {
    if (currentValue.length === 1) {
      setCurrentValue('0');
    } else {
      setCurrentValue(currentValue.slice(0, -1));
    }
  };

  return (
    <View style={styles.container}>
      {/* Display */}
      <View style={styles.display}>
        <Text style={styles.smallText}>{previousValue + selectedOperator}</Text>
        <Text style={styles.mainText}>{currentValue}</Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        <Button title="C" type="top" onPress={onClear} />
        <Button title="⌫" type="top" onPress={onDelete} />
        <Button title="%" type="top" onPress={() => onOperatorPress('%')} />
        <Button title="÷" type="right" onPress={() => onOperatorPress('/')} />

        <Button title="7" type="number" onPress={() => onNumberPress('7')} />
        <Button title="8" type="number" onPress={() => onNumberPress('8')} />
        <Button title="9" type="number" onPress={() => onNumberPress('9')} />
        <Button title="×" type="right" onPress={() => onOperatorPress('*')} />

        <Button title="4" type="number" onPress={() => onNumberPress('4')} />
        <Button title="5" type="number" onPress={() => onNumberPress('5')} />
        <Button title="6" type="number" onPress={() => onNumberPress('6')} />
        <Button title="−" type="right" onPress={() => onOperatorPress('-')} />

        <Button title="1" type="number" onPress={() => onNumberPress('1')} />
        <Button title="2" type="number" onPress={() => onNumberPress('2')} />
        <Button title="3" type="number" onPress={() => onNumberPress('3')} />
        <Button title="+" type="right" onPress={() => onOperatorPress('+')} />

        <Button title="0" type="number" onPress={() => onNumberPress('0')} />
        <Button title="00" type="number" onPress={() => onNumberPress('00')} />
        <Button title="." type="number" onPress={() => onNumberPress('.')} />
        <Button title="=" type="right" onPress={onCalculate} />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  display: {
    flex: 1,
    backgroundColor: Colors.display,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  smallText: {
    fontSize: 30,
    fontWeight: '300',
    color: Colors.btnFunction,
  },
  mainText: {
    fontSize: 70,
    fontWeight: '300',
    color: Colors.white,
  },
  keypad: {
    flex: 2,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    padding: 30,
  },
});
