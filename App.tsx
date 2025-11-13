/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  useColorScheme,
  Alert,
  Animated,
} from 'react-native';
import React, { useEffect, useState } from 'react';

const lightTheme = {
  background: '#F5F5F5',
  display: '#E0E0E0',
  textPrimary: '#000',
  textSecondary: '#555',
  button: '#FFF',
  operatorBtn: '#00A3FF',
  equalsBtn: '#FF4D4D',
  feedbackBtn: '#0066FF',
  modalBackground: '#FFF',
  inputBackground: '#EEE',
};

const darkTheme = {
  background: '#0F0F1A',
  display: '#1A1B1E',
  textPrimary: '#FFF',
  textSecondary: '#888',
  button: '#1A1B1E',
  operatorBtn: '#008751',
  equalsBtn: '#FF6B6B',
  feedbackBtn: '#0066FF',
  modalBackground: '#1A1B1E',
  inputBackground: '#0F0F1A',
};

const App = () => {
  const systemTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [isLoading, setIsLoading] = useState(false);

  const [prevValue, setPrevValue] = useState('');
  const [currValue, setCurrValue] = useState('0');
  const [operator, setOperator] = useState('');
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const shakeAnim = useState(new Animated.Value(0))[0]; // Horizontal (X)
  const bounceAnim = useState(new Animated.Value(0))[0]; // Vertical (Y)

  // Calculator handlers
  const handleNumber = (num: string) => {
    setCurrValue(currValue === '0' ? num : currValue + num);
  };

  const handleOperator = (op: string) => {
    if (prevValue && operator && currValue !== '0') {
      calculate();
      setOperator(op);
    } else {
      setPrevValue(currValue);
      setCurrValue('0');
      setOperator(op);
    }
  };

  const handleBackspace = () => {
    if (currValue.length === 1) {
      setCurrValue('0');
    } else {
      setCurrValue(currValue.slice(0, -1));
    }
  };

  const calculate = () => {
    const a = parseFloat(prevValue);
    const b = parseFloat(currValue);
    let result = 0;

    switch (operator) {
      case '+':
        result = a + b;
        break;
      case '-':
        result = a - b;
        break;
      case '*':
        result = a * b;
        break;
      case '/':
        result = a / b;
        break;
      case '%':
        result = a % b;
        break;
    }

    setCurrValue(result.toString());
    setOperator('');
    setPrevValue('');
    setHistory([`${a} ${operator} ${b} = ${result}`, ...history]);
  };
  const clearAll = () => {
    setPrevValue('');
    setCurrValue('0');
    setOperator('');
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback) {
      Alert.alert('Please type your feedback!');
      return;
    }

    setIsLoading(true);
    try {
      await fetch('https://feedback-api.82.29.170.171.nip.io/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback }),
      });
      Alert.alert('Thanks! Your feedback has been sent.');
      setFeedback('');
      setFeedbackModal(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Failed to send feedback. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getClearOrBackspaceLabel = () => {
    return currValue === '0' ? 'C' : '⌫';
  };

  const keyPads = [
    getClearOrBackspaceLabel(),
    '/',
    '*',
    '-',
    '7',
    '8',
    '9',
    '+',
    '4',
    '5',
    '6',
    '.',
    '1',
    '2',
    '3',
    '=',
    '0',
  ];

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const bounce = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -15,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: -10,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    const startAnimationLoop = () => {
      const runAnimation = () => {
        const doShake = Math.random() > 0.5;

        if (doShake) shake();
        else bounce();

        const nextDelay = 3000 + Math.random() * 2000;
        setTimeout(runAnimation, nextDelay);
      };

      runAnimation();
    };

    startAnimationLoop();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Theme toggle */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          padding: 10,
        }}
      >
        <Text style={{ color: theme.textPrimary, marginRight: 10 }}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>

      {/* Display */}
      <View style={[styles.display, { backgroundColor: theme.display }]}>
        <Text style={[styles.prevText, { color: theme.textSecondary }]}>
          {prevValue + operator}
        </Text>
        <Text style={[styles.currText, { color: theme.textPrimary }]}>
          {currValue}
        </Text>
      </View>

      {/* Calculator Buttons */}
      <View style={styles.keypad}>
        {keyPads.map(key => (
          <TouchableOpacity
            key={key}
            style={[
              styles.button,
              { backgroundColor: theme.button },
              key === '='
                ? { backgroundColor: theme.equalsBtn }
                : key.match(/[+\-*/%]/) || key === '.'
                ? { backgroundColor: theme.operatorBtn }
                : {},
            ]}
            onPress={() => {
              if (key === 'C') clearAll();
              else if (key === '⌫') handleBackspace();
              else if (key === '=') calculate();
              else if (key.match(/[+\-*/%]/)) handleOperator(key);
              else handleNumber(key);
            }}
          >
            <Text style={[styles.btnText, { color: theme.textPrimary }]}>
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback Button */}
      <Animated.View
        style={{
          transform: [{ translateX: shakeAnim }, { translateY: bounceAnim }],
        }}
      >
        <TouchableOpacity
          style={[styles.feedbackBtn, { backgroundColor: theme.feedbackBtn }]}
          onPress={() => setFeedbackModal(true)}
        >
          <Text style={[styles.feedbackText, { color: '#fff' }]}>
            Click me 😁
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Feedback Modal */}
      <Modal visible={feedbackModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.modalBackground },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              We Value Your Feedback!
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  color: theme.textPrimary,
                },
              ]}
              placeholder="What app or feature should we build next?"
              placeholderTextColor={theme.textSecondary}
              value={feedback}
              onChangeText={setFeedback}
              multiline
            />
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: theme.operatorBtn }]}
              onPress={handleFeedbackSubmit}
              disabled={isLoading}
            >
              <Text style={[styles.submitText, { color: theme.textPrimary }]}>
                {isLoading ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setFeedbackModal(false)}>
              <Text style={[styles.cancelText, { color: theme.equalsBtn }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* History */}
      <ScrollView style={styles.history}>
        {history.map((item, idx) => (
          <Text
            key={idx}
            style={[styles.historyText, { color: theme.textSecondary }]}
          >
            {item}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  display: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  prevText: { fontSize: 28 },
  currText: { fontSize: 60 },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  button: {
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { fontSize: 24 },
  feedbackBtn: {
    padding: 15,
    borderRadius: 25,
    alignSelf: 'center',
    margin: 20,
  },
  feedbackText: { fontWeight: 'bold', textAlign: 'center' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: { padding: 20, borderRadius: 20, width: '80%' },
  modalTitle: { fontSize: 20, marginBottom: 10, textAlign: 'center' },
  input: {
    padding: 10,
    borderRadius: 10,
    height: 100,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  submitBtn: { padding: 15, borderRadius: 20, marginBottom: 10 },
  submitText: { textAlign: 'center', fontWeight: 'bold' },
  cancelText: { textAlign: 'center' },
  history: {
    maxHeight: 150,
    padding: 10,
    paddingBottom: 50,
    marginBottom: 15,
  },
  historyText: { fontSize: 14, marginBottom: 10 },
});
