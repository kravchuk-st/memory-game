const cards = [... document.querySelectorAll('.card')],
      secTag = document.querySelector(".time .sec"),
      minTag = document.querySelector(".time .min"),
      flipsTag = document.querySelector(".flips b"),
      btn = document.querySelector('.btn'),
      table = document.querySelector('#table tr');

let disableDeck = false,
    matchedCard = 0,
    sec = 0,
    min = 0,
    flips = 0;
let cardOne, cardTwo, newGame;

const win = localStorage.win ? JSON.parse(localStorage.win) : [];

btn.addEventListener('click', () =>{
  clearInterval(newGame);
  shuffleCard();
});

function flipCard(e) {
  let clickedCard = e.target;
  if (clickedCard !== cardOne && !disableDeck) {
    clickedCard.classList.add('flip');
    if (!cardOne) {
      return cardOne = clickedCard;
    }
    cardTwo = clickedCard;
    disableDeck = true;
    flips++;
    flipsTag.innerText = flips;

    let cardOneImg = cardOne.querySelector('img').src,
        cardTwoImg = cardTwo.querySelector('img').src;

    matchCards(cardOneImg, cardTwoImg);
  }
}

function matchCards(img1, img2) {
  if (img1 === img2) {
    matchedCard++;
    if (matchedCard === 10) {
      clearInterval(newGame);
      if (typeof(Storage) !== 'undefined') {
        win.unshift(flips);
        win.length = 10;
        localStorage.win = JSON.stringify(win);
      } else {
        console.log('Ваш браузер не поддерживает localStorage');
      }
      alert(`You Win!\nКоличество ходов: ${flips}.`)
      setTimeout(() => {
        return location.reload();
      }, 1000)
      
    }
    cardOne.removeEventListener('click', flipCard);
    cardTwo.removeEventListener('click', flipCard);
    cardOne = cardTwo = '';
    return disableDeck = false;
  }
  setTimeout(() => {
    cardOne.classList.add('shake');
    cardTwo.classList.add('shake');
  }, 350);

  setTimeout(() => {
    cardOne.classList.remove('shake', 'flip');
    cardTwo.classList.remove('shake', 'flip');
    cardOne = cardTwo = '';
    disableDeck = false;
  }, 1000)
}

function shuffleCard() {
  matchedCard = 0;
  sec = 0;
  min = 0;
  flips = 0;
  flipsTag.innerText = flips;
  cardOne = cardTwo = '';
  newGame = setInterval(tick, 1000);
  disableDeck = false;
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,];
  arr.sort(() => Math.random() > 0.5 ? 1 : -1);
  cards.forEach((card, ind) => {
    card.classList.remove('flip');
    let imgTag = card.querySelector('img');
    imgTag.src = `./img/animal/img${arr[ind]}.svg`
    card.addEventListener('click', flipCard);
  })
}

function tick() {
  sec++;
  if (sec >= 60) {
      min++;
      sec = sec - 60;
  }
  if (sec < 10) { 
    secTag.innerText = '0' + sec;
  } else {
    secTag.innerText = sec;
  }
  if (min < 10) { 
    minTag.innerText = '0' + min;
  } else {
    minTag.innerText = min;
  }
}

shuffleCard();

function fillTable(table, arr) {
  arr.forEach(el => {
    let td = document.createElement('td');
    td.innerText = el;
    table.appendChild(td);
  });
}

fillTable(table, win);

cards.forEach(card => {
  card.addEventListener('click', flipCard);
})