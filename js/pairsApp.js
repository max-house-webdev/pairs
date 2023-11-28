'use strict';

const CARD_VISUAL_DELAY = 1000;

const TIME_LIMIT = 60000;

function createHeader(mount) {
  const title = document.createElement('h1');
  title.classList.add('title');
  title.textContent = 'Пары';
  mount.append(title);
}

function createInputForm(mount) {
  let inputForm = {};
  // форма
  inputForm.form = document.createElement('form');
  inputForm.form.classList.add('form');
  mount.append(inputForm.form);

  // размер игрового поля
  inputForm.inputCells = document.createElement('input');
  inputForm.inputCells.type = 'number';
  inputForm.inputCells.id = 'cells';
  inputForm.inputCells.classList.add('form__input');
  inputForm.inputCells.min = 2;
  inputForm.inputCells.step = 2;
  inputForm.inputCells.max = 10;
  inputForm.inputCells.value = 4;
  inputForm.form.append(inputForm.inputCells);

  inputForm.labelCells = document.createElement('label');
  inputForm.labelCells.textContent = 'Карточек по вертикали/горизонтали:';
  inputForm.labelCells.setAttribute('for', 'Cells');
  inputForm.labelCells.classList.add('form__label');
  inputForm.form.append(inputForm.labelCells);

  // таймер
  inputForm.inputTimer = document.createElement('input');
  inputForm.inputTimer.type = 'checkbox';
  inputForm.inputTimer.id = 'timer';
  inputForm.inputTimer.checked = false;
  inputForm.inputTimer.classList.add('form__checkbox', 'visually-hidden');
  inputForm.form.append(inputForm.inputTimer);

  inputForm.labelTimer = document.createElement('label');
  inputForm.labelTimer.textContent = `Успеть за ${parseInt(
    TIME_LIMIT / 1000
  )} сек`;
  inputForm.labelTimer.setAttribute('for', 'timer');
  inputForm.labelTimer.classList.add('form__label', 'label-for-checkbox');
  inputForm.form.append(inputForm.labelTimer);

  inputForm.inputSeconds = document.createElement('input');
  inputForm.inputSeconds.type = 'number';
  inputForm.inputSeconds.id = 'seconds';
  inputForm.inputSeconds.classList.add('form__input');
  inputForm.inputSeconds.readOnly = true;
  inputForm.inputSeconds.value = parseInt(TIME_LIMIT / 1000);
  inputForm.form.append(inputForm.inputSeconds);

  // кнопка ввода
  inputForm.btnSubmit = document.createElement('button');
  inputForm.btnSubmit.type = 'submit';
  inputForm.btnSubmit.textContent = 'Начать игру!';
  inputForm.btnSubmit.classList.add('btn', 'form__btn-submit');
  inputForm.form.append(inputForm.btnSubmit);

  return inputForm;
}

function createCardList(mount) {
  // список карточек
  const cardList = document.createElement('ul');
  cardList.classList.add('cardList');
  mount.append(cardList);

  return cardList;
}

function createCardLayout(cards) {
  // карточки
  let cardArr = [];
  // перемешанный массив парных цифр
  let dataArr = shuffleDurschenfeld(generateArrOfRepeatitions(0.5 * cards));

  for (let i = 0; i < parseInt(cards); ++i) {
    let card = document.createElement('li');
    card.id = i;
    card.classList.add('card');
    card.textContent = dataArr[i];
    card.setAttribute('data-cardnum', dataArr[i]);
    cardArr.push(card);
  }

  return cardArr;
}

function appendCards(cardList, cardArr) {
  // добавить карточки в список
  for (let i = 0; i < cardArr.length; ++i) {
    cardList.append(cardArr[i]);
  }
}

function createPopup(mount) {
  let popup = {};

  popup.container = document.createElement('div');
  popup.container.classList.add('popup', 'visually-hidden');
  mount.append(popup.container);

  popup.message = document.createElement('p');
  popup.message.classList.add('popup__message');
  popup.container.append(popup.message);

  popup.btnClosePopup = document.createElement('button');
  popup.btnClosePopup.type = 'button';
  popup.btnClosePopup.textContent = 'Закрыть!';
  popup.btnClosePopup.classList.add('btn', 'popup__btn-close');
  popup.container.append(popup.btnClosePopup);

  return popup;
}

function setGrid(container, cells) {
  // сетка для списка
  container.style.cssText = `grid-template-columns: repeat(${cells}, 2.25em);
  grid-template-rows: repeat(${cells}, 3em);`;
}

function generateArrOfRepeatitions(numOfItems, numOfRepeations = 2) {
  // генератор массива повторяющихся цифр
  let result = [];
  let item = 0;
  for (let i = 0; i < numOfItems; ++i) {
    for (let j = 1; j <= numOfRepeations; ++j) {
      result.push(item);
    }
    ++item;
  }

  return result;
}

function shuffleDurschenfeld(arr) {
  // перемешивание по Дуршенфельду
  // проверка является ли аргумент массивом
  if (!Array.isArray(arr) || !arr.length) return 0;
  let j;
  // перемешивание
  for (let i = arr.length - 1; i >= 1; --i) {
    j = Math.floor(
      Math.min(0, i) + Math.random() * (Math.max(0, i) + 1 - Math.min(0, i))
    );
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function checkCards(prevCard, nextCard) {
  // проверка совападений
  if (
    prevCard.getAttribute('data-cardnum') ===
    nextCard.getAttribute('data-cardnum')
  ) {
    // оставить открытыми
    prevCard.classList.add('stay-opened');
    nextCard.classList.add('stay-opened');

    return true;
  } else {
    // скрыть с задержкой
    setTimeout(function () {
      prevCard.classList.remove('is-opened');
      nextCard.classList.remove('is-opened');
    }, CARD_VISUAL_DELAY);

    return false;
  }
}

/**
 * app
 */
let pairsApp = {
  // точка монтирования
  createMount: function (root) {
    root.classList.add('container');

    return root;
  },
  // приложение
  createApp: function (mount) {
    // заголовок
    createHeader(mount);
    // popup
    let popup = createPopup(mount);
    // список карточек
    let cardList = createCardList(mount);

    // форма
    let inputForm = createInputForm(mount);
    inputForm.form.addEventListener('submit', (e) => {
      e.preventDefault();

      let clickCounter = 0;
      let openedCards = 0;

      setGrid(cardList, inputForm.inputCells.value);

      let cards = Math.pow(inputForm.inputCells.value, 2);

      // очистить поле
      document.querySelectorAll('.card').forEach((card) => card.remove());

      // массив с карточками
      let cardArr = createCardLayout(cards);
      appendCards(cardList, cardArr);

      if (inputForm.inputTimer.checked) {
        let startTimer = () => {
          // если текущее значение секунд == 0
          if (secondsCountdown == 0) {
            // останавливаем таймер
            clearInterval(timerID);
            inputForm.inputSeconds.classList.remove('time-is-runningout');
            document.body.classList.add('no-scroll');
            popup.container.classList.remove('visually-hidden');
            popup.message.textContent = `Игра окончена! Время истекло.`;
            // иначе - отсчет
          } else {
            // уменшаем текущее значение секунд на единицу
            --secondsCountdown;
            if (secondsCountdown == 10) {
              inputForm.inputSeconds.classList.add('time-is-runningout');
            }
            inputForm.inputSeconds.value = secondsCountdown;
          }
        };
        var timerID = setInterval(startTimer, 1000);
        let secondsCountdown = inputForm.inputSeconds.value;
        startTimer();
      }

      // пара для сравнения
      let pair = {};
      cardArr.forEach((card) => {
        // обработка клика по карточке
        card.addEventListener('click', (e) => {
          e.currentTarget.classList.add('is-opened');
          ++clickCounter;
          // сохраняем открытые карточки для сравнения
          if (clickCounter == 1 || clickCounter % 2 != 0) {
            pair.prev = e.currentTarget;
            pair.next = null;
          } else {
            pair.next = e.currentTarget;
          }
          // сравниваем карточки
          if (pair.prev && pair.next) {
            if (checkCards(pair.prev, pair.next)) {
              openedCards += 2;
            }
          }

          if (openedCards == cards) {
            document.body.classList.add('no-scroll');
            popup.container.classList.remove('visually-hidden');
            popup.message.textContent = `Вы выиграли! Выполнено ходов - ${clickCounter}.`;
            clearInterval(timerID);
          }
        });
      });
    });

    popup.btnClosePopup.addEventListener('click', () => {
      document.body.classList.remove('no-scroll');
      popup.container.classList.add('visually-hidden');
    });
  },
};

export { pairsApp };
