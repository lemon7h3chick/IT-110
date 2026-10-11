const input = document.querySelector('.input');
const result = document.querySelector('.result');
const buttons = document.querySelector('.buttons');

buttons.addEventListener('click', (event) => {
  const target = event.target;

  if (target.className === 'number') {
    inputNumber(target);
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
