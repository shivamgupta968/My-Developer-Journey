const expressionDisplay = document.querySelector('#expression');
const resultDisplay = document.querySelector('#result');
const messageDisplay = document.querySelector('#message');
const keys = document.querySelector('.keys');

let currentInput = '0';
let storedValue = null;
let pendingOperator = null;
let waitingForOperand = false;
let expressionText = '';

function updateDisplay() {
  resultDisplay.textContent = currentInput;
  expressionDisplay.textContent = expressionText || 'Ready';
}

function showMessage(message, isError = false) {
  messageDisplay.textContent = message;
  messageDisplay.classList.toggle('error', isError);
}

function clearAll() {
  currentInput = '0';
  storedValue = null;
  pendingOperator = null;
  waitingForOperand = false;
  expressionText = '';
  showMessage('Cleared. Ready for a new calculation.');
  updateDisplay();
}

function inputDigit(digit) {
  if (waitingForOperand) {
    currentInput = digit;
    waitingForOperand = false;
  } else {
    currentInput = currentInput === '0' ? digit : currentInput + digit;
  }
  showMessage('Enter an operation or continue typing.');
  updateDisplay();
}

function inputDecimal() {
  if (waitingForOperand) {
    currentInput = '0.';
    waitingForOperand = false;
  } else if (!currentInput.includes('.')) {
    currentInput += '.';
  }
  updateDisplay();
}

function calculate(a, b, operator) {
  switch (operator) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷':
      if (b === 0) throw new Error('Cannot divide by zero.');
      return a / b;
    default: return b;
  }
}

function formatNumber(number) {
  if (!Number.isFinite(number)) throw new Error('Result is not a finite number.');
  return String(Number(number.toPrecision(12)));
}

function chooseOperator(nextOperator) {
  const inputValue = Number(currentInput);
  if (!Number.isFinite(inputValue)) {
    showMessage('Please enter a valid number.', true);
    return;
  }

  if (pendingOperator && !waitingForOperand) {
    try {
      const result = calculate(storedValue, inputValue, pendingOperator);
      currentInput = formatNumber(result);
      storedValue = result;
    } catch (error) {
      showMessage(error.message, true);
      return;
    }
  } else {
    storedValue = inputValue;
  }

  pendingOperator = nextOperator;
  waitingForOperand = true;
  expressionText = `${currentInput} ${nextOperator}`;
  updateDisplay();
  showMessage('Operator selected.');
}

function performCalculation() {
  if (!pendingOperator || storedValue === null) return;
  const first = storedValue;
  const second = Number(currentInput);
  const operator = pendingOperator;

  try {
    const result = calculate(first, second, operator);
    expressionText = `${first} ${operator} ${second} =`;
    currentInput = formatNumber(result);
    storedValue = null;
    pendingOperator = null;
    waitingForOperand = true;
    showMessage('Calculation complete.');
    updateDisplay();
  } catch (error) {
    showMessage(error.message, true);
    expressionDisplay.textContent = `${first} ${operator} ${second}`;
    resultDisplay.textContent = 'Error';
    currentInput = '0';
    storedValue = null;
    pendingOperator = null;
    waitingForOperand = true;
  }
}

function backspace() {
  if (waitingForOperand) return;
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
  if (currentInput === '-') currentInput = '0';
  updateDisplay();
}

keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.number !== undefined) inputDigit(button.dataset.number);
  else if (button.dataset.operator) chooseOperator(button.dataset.operator);
  else if (button.dataset.action === 'decimal') inputDecimal();
  else if (button.dataset.action === 'clear') clearAll();
  else if (button.dataset.action === 'backspace') backspace();
  else if (button.dataset.action === 'equals') performCalculation();
});

document.addEventListener('keydown', (event) => {
  if (/^[0-9]$/.test(event.key)) inputDigit(event.key);
  else if (event.key === '.') inputDecimal();
  else if (event.key === '+') chooseOperator('+');
  else if (event.key === '-') chooseOperator('−');
  else if (event.key === '*') chooseOperator('×');
  else if (event.key === '/') { event.preventDefault(); chooseOperator('÷'); }
  else if (event.key === 'Enter' || event.key === '=') performCalculation();
  else if (event.key === 'Backspace') backspace();
  else if (event.key === 'Escape') clearAll();
});

updateDisplay();
