import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [history, setHistory] = useState<string[]>([]);

  // Handle number/operator button press
  const handleButtonPress = (value: React.SetStateAction<string>) => {
    if (result !== '0' && expression === '' && !isNaN(Number(value))) {
      setExpression(value);
      return;
    }
    setExpression(prev => prev + value);
  };

  // Handle advanced operations
  const handleAdvancedOperation = (op: string) => {
    let value = parseFloat(expression || result);
    let calcExpression = '';
    let res = 0;

    try {
      switch (op) {
        case '√':
          res = Math.sqrt(value);
          calcExpression = `√(${value})`;
          break;
        case 'x²':
          res = Math.pow(value, 2);
          calcExpression = `(${value})²`;
          break;
        case 'sin':
          res = Math.sin(value * Math.PI / 180);
          calcExpression = `sin(${value})`;
          break;
        case 'cos':
          res = Math.cos(value * Math.PI / 180);
          calcExpression = `cos(${value})`;
          break;
        case 'π':
          res = Math.PI;
          calcExpression = 'π';
          break;
        default:
          return;
      }
      setResult(res.toString());
      setHistory(prev => [`${calcExpression} = ${res}`, ...prev.slice(0, 4)]);
      setExpression('');
    } catch {
      setResult('Error');
      setTimeout(() => setResult('0'), 1500);
    }
  };

  // Basic calculation
  const calculateResult = () => {
    try {
      const sanitized = expression.replace(/[^-()\d/*+.%]/g, '');
      if (!sanitized) return;
      const res = eval(sanitized);
      if (!isFinite(res)) {
        setResult('Error');
        setTimeout(() => setResult('0'), 1500);
        return;
      }
      setResult(res.toString());
      setHistory(prev => [`${expression} = ${res}`, ...prev.slice(0, 4)]);
      setExpression('');
    } catch {
      setResult('Error');
      setTimeout(() => setResult('0'), 1500);
    }
  };

  const clearAll = () => {
    setExpression('');
    setResult('0');
  };

  const clearEntry = () => {
    if (expression.length > 0) setExpression(expression.slice(0, -1));
    else setResult('0');
  };

  const clearHistory = () => setHistory([]);

  const CalculatorButton = ({ title, onPress, style, textStyle }: { title: string; onPress: () => void; style?: any; textStyle?: any }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );

  const advancedButtons = ['√', 'x²', 'sin', 'cos', 'π']; // Removed 'e'
  const basicButtons = [
    ['C', 'CE', '%', '÷'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  return (
    <View style={styles.container}>
      {/* Display */}
      <View style={styles.displayContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text style={styles.expressionText}>{expression || ' '}</Text>
        </ScrollView>
        <Text style={styles.resultText} numberOfLines={1}>{result}</Text>
      </View>

      {/* Advanced Buttons */}
      <View style={styles.advancedContainer}>
        {advancedButtons.map((btn) => (
          <CalculatorButton
            key={btn}
            title={btn}
            onPress={() => handleAdvancedOperation(btn)}
            style={styles.advancedButton} textStyle={undefined}          />
        ))}
      </View>

      {/* Basic Buttons */}
      {basicButtons.map((row, i) => (
        <View key={i} style={styles.buttonRow}>
          {row.map((btn) => {
            if (btn === 'C') return <CalculatorButton key={btn} title={btn} onPress={clearAll} style={styles.clearButton} textStyle={undefined} />;
            if (btn === 'CE') return <CalculatorButton key={btn} title={btn} onPress={clearEntry} style={styles.clearButton} textStyle={undefined} />;
            if (btn === '=') return <CalculatorButton key={btn} title={btn} onPress={calculateResult} style={styles.equalsButton} textStyle={undefined} />;
            if (['÷','*','-','+','%'].includes(btn)) return <CalculatorButton key={btn} title={btn} onPress={() => handleButtonPress(btn === '÷' ? '/' : btn === '×' ? '*' : btn)} style={styles.operatorButton} textStyle={undefined} />;
            return <CalculatorButton key={btn} title={btn} onPress={() => handleButtonPress(btn)} style={styles.numberButton} textStyle={undefined} />;
          })}
        </View>
      ))}

      {/* History Section */}
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>History</Text>
          <TouchableOpacity onPress={clearHistory}><Text style={styles.clearHistoryText}>Clear</Text></TouchableOpacity>
        </View>
        <ScrollView style={styles.historyList}>
          {history.map((item, i) => <Text key={i} style={styles.historyItem}>{item}</Text>)}
        </ScrollView>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  displayContainer: { backgroundColor: '#333', padding: 20, justifyContent: 'center', alignItems: 'flex-end', minHeight: 120, borderRadius: 12, marginBottom: 10 },
  expressionText: { color: '#aaa', fontSize: 18, textAlign: 'right' },
  resultText: { color: '#fff', fontSize: 40, fontWeight: 'bold', textAlign: 'right', marginTop: 5 },
  advancedContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  button: { flex: 1, margin: 3, paddingVertical: 18, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  buttonText: { fontSize: 20, fontWeight: '600' },
  numberButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  operatorButton: { backgroundColor: '#FF9500' },
  clearButton: { backgroundColor: '#FF3B30' },
  equalsButton: { backgroundColor: '#34C759' },
  advancedButton: { backgroundColor: '#9C27B0', margin: 4, flex: 1, minWidth: '18%' },
  historyContainer: { flex: 1, backgroundColor: '#f9f9f9', borderTopWidth: 1, borderTopColor: '#ddd', marginTop: 10 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#eee', borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  historyTitle: { fontWeight: 'bold' },
  clearHistoryText: { color: '#FF3B30', fontWeight: 'bold' },
  historyList: { padding: 10 },
  historyItem: { fontSize: 14, color: '#555', marginBottom: 5 }
});

export default Calculator;
