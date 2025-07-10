const firstSquare = document.querySelector('.firstSquare');
const secondSquare = document.querySelector('.secondSquare');
const place = document.querySelector('.place');
const yellow = document.querySelector('.yellowBtn');
const green = document.querySelector('.greenBtn');
const purple = document.querySelector('.purpleBtn');
const divide = document.querySelector('.divide');
const styleA = document.createElement('style');

let isGrouped = false;
let frozenLeftDiff  = null;
let frozenTopDiff   = null;

let grouped = false; 

let dragging = false;
let draggingB = false;

let offsetX = 0, offsetY = 0;
let offsetXB = 0, offsetYB = 0;

firstSquare.addEventListener('click', function() {
    firstSquare.classList.add('choose')
    secondSquare.classList.remove('choose')
})

secondSquare.addEventListener('click', function() {
    secondSquare.classList.add('choose')
    firstSquare.classList.remove('choose')
})

firstSquare.addEventListener('mousedown', function(e) {
  dragging = true;
  firstSquare.classList.add('choose')
  secondSquare.classList.remove('choose')
  offsetX = e.clientX - firstSquare.offsetLeft;
  offsetY = e.clientY - firstSquare.offsetTop;
});

secondSquare.addEventListener('mousedown', function(e) {
  draggingB = true;
  secondSquare.classList.add('choose')
  firstSquare.classList.remove('choose')
  offsetXB = e.clientX - secondSquare.offsetLeft;
  offsetYB = e.clientY - secondSquare.offsetTop;
});

function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

function syncCubes() {
  if (!isGrouped || frozenLeftDiff === null) return;
  
  const pr = place.getBoundingClientRect();
  const w1 = firstSquare.offsetWidth;
  const h1 = firstSquare.offsetHeight;
  const w2 = secondSquare.offsetWidth;
  const h2 = secondSquare.offsetHeight;

  if (dragging) {
    let x2 = firstSquare.offsetLeft  - frozenLeftDiff;
    let y2 = firstSquare.offsetTop   - frozenTopDiff;

    x2 = clamp(x2, 0, pr.width  - w2);
    y2 = clamp(y2, 0, pr.height - h2);

    secondSquare.style.left = x2 + 'px';
    secondSquare.style.top  = y2 + 'px';
  }
  else if (draggingB) {
    let x1 = secondSquare.offsetLeft + frozenLeftDiff;
    let y1 = secondSquare.offsetTop  + frozenTopDiff;

    x1 = clamp(x1, 0, pr.width  - w1);
    y1 = clamp(y1, 0, pr.height - h1);

    firstSquare.style.left = x1 + 'px';
    firstSquare.style.top  = y1 + 'px';
  }
  divide.style.display = "block"
}


document.addEventListener('mousemove', function(e) {
  if (dragging) {
    moveWithinBounds(firstSquare, e.clientX - offsetX, e.clientY - offsetY);
  }
  if (draggingB) {
    moveWithinBounds(secondSquare, e.clientX - offsetXB, e.clientY - offsetYB);
  }

  syncCubes(() => {
    const right = firstSquare.getBoundingClientRect().right
                - secondSquare.getBoundingClientRect().right;
    const top   = firstSquare.getBoundingClientRect().top
                - secondSquare.getBoundingClientRect().top;

    return right <= 155 && right >= -155
        && top   <= 155 && top   >= -155;
  });
});

document.addEventListener('mouseup', () => {
  dragging = draggingB = false;

  const r1 = firstSquare.getBoundingClientRect();
  const r2 = secondSquare.getBoundingClientRect();

  const right = r1.right - r2.right;
  const top   = r1.top   - r2.top;

  if (Math.abs(right) <= 155 && Math.abs(top) <= 155) {
    isGrouped = true;
    frozenLeftDiff = r1.left - r2.left;
    frozenTopDiff  = r1.top  - r2.top;
  }
});

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

divide.addEventListener('click', function() {
  isGrouped = false;
  divide.style.display = "none";

  const leftA = parseInt(firstSquare.style.left, 10);
  const topA  = parseInt(firstSquare.style.top, 10);

  const leftB = parseInt(secondSquare.style.left, 10);
  const topB  = parseInt(secondSquare.style.top, 10);

  let xA = Math.round(getRandomArbitrary(-301, 301));
  let yA = Math.round(getRandomArbitrary(-301, 301));
  while ((xA + leftA) > 652 || (xA + leftA) < 0 || (yA + topA) > 652 || (yA + topA) < 0) {
    xA = Math.round(getRandomArbitrary(-301, 301));
    yA = Math.round(getRandomArbitrary(-301, 301));
  }

  let xB = Math.round(getRandomArbitrary(-301, 301));
  let yB = Math.round(getRandomArbitrary(-301, 301));
  while ((xB + leftB) > 652 || (xB + leftB) < 0 || (yB + topB) > 652 || (yB + topB) < 0) {
    xB = Math.round(getRandomArbitrary(-301, 301));
    yB = Math.round(getRandomArbitrary(-301, 301));
  }

  const styleA = document.createElement('style');
  styleA.textContent = `
    @keyframes firstSquareAnim {
      0% {
        top: ${topA}px;
        left: ${leftA}px;
      }
      100% {
        top: ${topA + yA}px;
        left: ${leftA + xA}px;
      }
    }

    @keyframes secondSquareAnim {
      0% {
        top: ${topB}px;
        left: ${leftB}px;
      }
      100% {
        top: ${topB + yB}px;
        left: ${leftB + xB}px;
      }
    }

    .firstSquareAnimClass {
      animation: firstSquareAnim 0.7s ease-out;
      animation-fill-mode: forwards;
    }

    .secondSquareAnimClass {
      animation: secondSquareAnim 0.7s ease-out;
      animation-fill-mode: forwards;
    }
  `;
  document.body.appendChild(styleA);

  firstSquare.classList.add('firstSquareAnimClass');
  firstSquare.style.top  = topA  + yA + 'px';
  firstSquare.style.left = leftA + xA + 'px';

  secondSquare.classList.add('secondSquareAnimClass');
  secondSquare.style.top  = topB  + yB + 'px';
  secondSquare.style.left = leftB + xB + 'px';

  firstSquare.addEventListener('animationend', () => {
    firstSquare.classList.remove('firstSquareAnimClass');
    styleA.remove();
  }, { once: true });

  secondSquare.addEventListener('animationend', () => {
    secondSquare.classList.remove('secondSquareAnimClass');
  }, { once: true });
});


firstSquare.addEventListener('animationend', () => {
  firstSquare.classList.remove('styleA');

  if (styleA && styleA.parentNode) {
    styleA.parentNode.removeChild(styleA);
  }
});


function moveWithinBounds(square, x, y) {
  const parentRect = place.getBoundingClientRect();
  const maxX = parentRect.width  - square.offsetWidth;
  const maxY = parentRect.height - square.offsetHeight;

  const newX = Math.max(0, Math.min(x, maxX));
  const newY = Math.max(0, Math.min(y, maxY));

  const prevX = square.offsetLeft;
  const prevY = square.offsetTop;

  square.style.left = newX + 'px';
  square.style.top  = newY + 'px';

  if (!grouped) {
    const other = square === firstSquare ? secondSquare : firstSquare;
    if (isColliding(square, other)) {
      square.style.left = prevX + 'px';
      square.style.top  = prevY + 'px';
    }
  }
}

function isColliding(a, b) {
  const rectA = a.getBoundingClientRect();
  const rectB = b.getBoundingClientRect();

  return !(
    rectA.right <= rectB.left ||
    rectA.left >= rectB.right ||
    rectA.bottom <= rectB.top ||
    rectA.top >= rectB.bottom
  );
}

green.addEventListener('click', function() {
    if (firstSquare.classList.contains('choose')) {
        firstSquare.style.backgroundColor = 'rgb(173, 230, 176)';
    }

    if (secondSquare.classList.contains('choose')) {
        secondSquare.style.backgroundColor = 'rgb(173, 230, 176)';
    }
})

yellow.addEventListener('click', function() {
    if (firstSquare.classList.contains('choose')) {
        firstSquare.style.backgroundColor = 'rgb(226, 230, 173)';
    }

    if (secondSquare.classList.contains('choose')) {
        secondSquare.style.backgroundColor = 'rgb(226, 230, 173)';
    }
})

purple.addEventListener('click', function() {
    if (firstSquare.classList.contains('choose')) {
        firstSquare.style.backgroundColor = 'rgb(230, 173, 221)';
    }

    if (secondSquare.classList.contains('choose')) {
        secondSquare.style.backgroundColor = 'rgb(230, 173, 221)';
    }
})