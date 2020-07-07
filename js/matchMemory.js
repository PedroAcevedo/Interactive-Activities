var activity_id, time_to_finish, type, userID, pairs = 0, attempts = 0, num_matches;
var cards;
var hasFlippedCard = false;
var lockBoard = false;
var firstCard, secondCard;
var flipSound;

/**
 * 
 *  GET the initial activity
 * 
 */
fetch(API + 'api/getInteractive/76')//'https://jsonblob.com/api/jsonBlob/30ae5e51-75b7-11ea-9538-21f393c40628')
  .then(response => response.json())
  .then(function (json) {
    json = json['data'];
    type = json['type'];
    time_to_finish = json['time_limit'];
    var title = json['title'];
    activity_id = json['interactive_id'];
    var matches = json['matches'];
    var title_timer = `
  <div class="container-fullwidth">
   <header>
    <nav class="fixed-top navbar navbar-expand-lg bg-white justify-content-center" style="border-bottom:3px #dee2e6 solid">
      <div class="row">
        <section class=\"title\"><h2>${title}</h2> 
      </div>
        <h3 id="timer" style="margin-left: 10%;" value="00:00"></h3>
    </nav>
    </header>
  </div>
  `;
    num_matches = Object.keys(matches).length;
    /* title_results := defines the navbar */
    document.getElementById('title_results').innerHTML = title_timer;
    /* loader := simulate a charge view */
    document.querySelector("#loader").style.display = "none";
    /* board := defines the cards area */
    document.getElementById('board').innerHTML = buildCards(matches);
    /* btn-back := defines the button to go back */
    document.getElementById('btn-back').addEventListener('click', postToServer);
    /* cards := save the element of each card on page */
    cards = document.querySelectorAll('.memory-card');
    /* adding click listener to the cards */
    cards.forEach((card) => { card.addEventListener('click', flipCard) });
    /* shuffle := sorting the cards on page */
    shuffle();
  });

  /**
   * 
   * @param {*} matches dictionary of pairs of words for the card board
   */
function buildCards(matches) {
  cards_view = `
  <div class="row w-100" >
  <div class="col-2">
    <button id="btn-back" class="btn btn-back float-sm-right">  REGRESAR  < </button>
  </div>
  <div class="col-6 d-flex justify-content-center">
  <h3>Emparejamiento</h3>
  </div>
  <div class="col-4 d-flex justify-content-center">
  <ul class="list-group list-group-horizontal d-flex justify-content-center">
    <li class="list-group-item tile"> Intentos:  <p id="attempts">${attempts}</p></li>
    <li class="list-group-item tile"> Parejas:  <p id="pairs">${pairs}</p> </li>
  </ul>
  </div>
  </div>
  <div class="row" >
  <div class="memory-game col d-flex justify-content-center">`;

  Object.entries(matches).forEach(function ([key, value], index) {

    cards_view += defineCard(key, value);

    cards_view += defineCard(key, key);

  });

  cards_view += `
  </div>
  </div>`
  return cards_view;
}

/**
 * 
 * @param {*} key id for identify pairs 
 * @param {*} value values of a card
 */
function defineCard(key, value) {

  return value.includes('/') ?
    `
  <div class="memory-card" data-word="${key}">
    <img class="front-face" src="${API.substring(0, API.length-1) + value}" alt="" />
    <img class="back-face" src="assets/images/Incities_logo.svg" alt="Incities" />
  </div>
  `
    :
    `
  <div class="memory-card" data-word="${key}">
    <div class="front-face"> <p class="paragraph">${value}</p> </div>
    <img class="back-face" src="assets/images/Incities_logo.svg" alt="Incities" />
  </div>
  `;


}


/**
 * 
 * flip action
 * 
 */
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  document.getElementById("flip").play();
  this.classList.add('flip');
  attempts++;
  document.getElementById('attempts').innerHTML = attempts;
  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;

    return;
  }
  // second click
  secondCard = this;
  checkForMatch();
}

/**
 * 
 * Check a match of two flipped cards
 * 
 */
function checkForMatch() {
  let isMatch = firstCard.dataset.word === secondCard.dataset.word;
  isMatch ? disableCards() : unflipCards();

}

/**
 * 
 * Disable cards until the match verfication
 * 
 */
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  pairs++;
  document.getElementById('pairs').innerHTML = pairs;
  resetBoard();
  setTimeout(() => {
    if (pairs == num_matches) {
      postToServer();
    }
  }, 2000);
}

/**
 * 
 * showed the backface of two wrong flipped cards
 * 
 */
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}


/**
 * 
 * Resets configuration
 * 
 */
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

/**
 * 
 * Sorting cars on the screen
 */
function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
};

/**
 * 
 *  Sending data  to server
 * 
 */
function postToServer() {
  document.querySelector("#content").style.display = "none";
  document.querySelector("#loader").style.display = "block";
  time = timediff(time_to_finish, document.getElementById('timer').value);
  let data = {
    "type": type,
    "userID": userID,
    "time_to_finish": time,
    "activity_id": activity_id,
    "flips": pairs
  }
  console.log(data);
  fetch(API + 'api/responseInteractive', {
    method: 'POST',
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(function (res) {
      console.log(res)
      console.log('Success:', res);
      document.querySelector('.modal-title').innerHTML = "Resultados";
      document.getElementById('modal-button').innerHTML = "Terminar";
      document.getElementById('modal-button').addEventListener('click', function () { window.location = 'index.html' });
      document.getElementById('score').innerHTML = `<ul><li>Tiempo: ${time}</li> <li>Flips totales: ${attempts}</li> <li>Parejas encontradas: ${res['data']['flips']}/${num_matches}</li> </ul>`;
      $('#myModal').modal('toggle');
    });
}

/**
 * 
 * Activate the timer
 * 
 */
var intervalID = setInterval(function () {
  $("#timer").val(function () {
    var timer = showTime(time_to_finish);
    if (timer.localeCompare('02:00') == -1) {
      $("#timer").css("color", "red");
    }
    if (timer.localeCompare('end') == 0) {
      clearTimeout(intervalID);
      postToServer();
    }
    $("#timer").text(timer)
    return timer;
  });

}, 1000);
