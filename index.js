const record = [];
const makeState = (value, type) => ({ value, type });

const input = document.querySelector('.input');
const result = document.querySelector('.result');
const buttons = document.querySelector('.buttons');

buttons.addEventListener('click', (event) => {
  const target = event.target;

  if (target.className === 'number') {
    inputNumber(target);
  } else if (target.className === 'operator') {
    inputOperator(target);
  } else {
    switch (target.id) {
      case 'equal':
        calculate();
        break;
      case 'decimal':
        inputDecimal();
        break;
      case 'clear':
        clear();
        break;
      case 'all-clear':
        allClear();
        break;
      case 'negate':
        negate();
        break;
    }
  }
});

function inputNumber(target) {
  if (result.textContent === '0') {
    result.textContent = target.textContent;
  } else if (seekCurrentType() === 'number') {
    const value = record.pop().value;
    input.textContent = input.textContent.slice(0, -(value.length + 1));
    result.textContent = value + target.textContent;
  } else {
    result.textContent += target.textContent;
  }

  result.scrollLeft = result.scrollWidth;
}

function inputOperator(target) {
  if (!result.textContent && !input.textContent) {
    return;
  }

  if (record.length) {
    if (seekCurrentType() === 'equal') {
      input.textContent = result.textContent;
      result.textContent = '';
    }
  }

  if (result.textContent) {
    if (!input.textContent) {
      input.textContent = result.textContent;
    } else {
      input.textContent += ' ' + result.textContent;
    }

    record.push(makeState(result.textContent, 'number'));
    result.textContent = '';
  }

  if (seekCurrentType() === 'operator') {
    input.textContent = input.textContent.slice(0, -1) + target.textContent;
    record.pop();
  } else {
    input.textContent += ' ' + target.textContent;
  }

  input.scrollLeft = input.scrollWidth;
  record.push(makeState(target.textContent, 'operator'));
}

function calculate() {
  if (!input.textContent) {
    return;
  }

  if (seekCurrentType() === 'equal') {
    input.textContent = result.textContent;
    return;
  }

  if (result.textContent) {
    record.push(makeState(result.textContent, 'number'));
    input.textContent += ' ' + result.textContent;
  }

  if (seekCurrentType() === 'operator') {
    input.textContent = input.textContent.slice(0, -2);
    record.pop();
  }

  result.textContent = eval(
    input.textContent.replaceAll('×', '*').replaceAll('÷', '/'),
  );

  record.length = 0;
  record.push(makeState(result.textContent, 'equal'));
}

function inputDecimal() {
  if (result.textContent.includes('.')) {
    return;
  }

  if (!result.textContent) {
    result.textContent = '0.';
  } else {
    result.textContent += '.';
  }
}

function clear() {
  if (!result.textContent && !input.textContent) {
    return;
  }

  if (seekCurrentType() === 'equal') {
    input.textContent = '';
    result.textContent = result.textContent.slice(0, -1);
    record.pop();
    return;
  }

  if (result.textContent) {
    result.textContent = result.textContent.slice(0, -1);
    return;
  }

  if (seekCurrentType() === 'number') {
    const value = record.pop().value;
    input.textContent = input.textContent.slice(0, -(value.length + 1));
    result.textContent = value.slice(0, -1);
  } else if (seekCurrentType() === 'operator') {
    input.textContent = input.textContent.slice(0, -2);
    record.pop();
  }
}

function allClear() {
  record.length = 0;
  input.textContent = result.textContent = '';
}

function negate() {
  if (!input.textContent && !result.textContent) {
    return;
  }

  if (seekCurrentType() === 'equal') {
    input.textContent = '';
  }

  if (!result.textContent) {
    if (seekCurrentType() === 'number') {
      const value = record.pop().value;
      result.textContent = value;
      input.textContent = input.textContent.slice(0, -(value.length + 1));
    }
  }

  result.textContent = -result.textContent;
}

function seekCurrentType() {
  if (!record.length) {
    return '';
  }

  return record.at(-1).type;
}
