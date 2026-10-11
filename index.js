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
  }
});

function inputNumber(target) {
  if (!+result.textContent) {
    result.textContent = target.textContent;
  } else {
    result.textContent += target.textContent;
  }

  result.scrollLeft = result.scrollWidth;
}

function inputOperator(target) {
  if (!result.textContent && !input.textContent) {
    return;
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

  if (record.at(-1).type === 'operator') {
    input.textContent = input.textContent.slice(0, -1) + target.textContent;
    record.pop();
  } else {
    input.textContent += ' ' + target.textContent;
  }

  input.scrollLeft = input.scrollWidth;
  record.push(makeState(target.textContent, 'operator'));
}
