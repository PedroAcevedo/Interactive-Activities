var time_to_finish, type, userID, pairs = 0, attempts = 0, num_matches, activity_id, interactive_id, module_id, theme_id, badge, theme;;
var cards;
var hasFlippedCard = false;
var lockBoard = false;
var firstCard, secondCard;
var flipSound;
var closeText = '';

/**
 * 
 *  GET the initial activity
 * 
 */
fetch(API + `api/getInteractive/${getUrlParameter('id')}`, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token
  },
})
  .then(response => response.json())
  .then(function (json) {
    json = json['data'];
    type = json['type'];
    time_to_finish = json['time_limit'];
    var title = json['title'];

    activity_id = json['interactive_id'];
    module_id = json['module_id'];
    theme_id = json['theme_id'];


    theme = json['theme'];
    interactive_id = json['interactive_id'];
    activity_id = json['id'];

    var matches = json['matches'];
    closeText = json['close'];
    
    var title_timer = `<h3 class="title mt-5 mb-3" style="color:${json['pivot'][0]};">${title}</h3>`;



    num_matches = Object.keys(matches).length;
    /* title_results := defines the navbar */
    document.getElementById('board').innerHTML = title_timer;
    /* loader := simulate a charge view */
    document.querySelector("#loader").style.display = "none";
    /* board := defines the cards area */
    document.getElementById('board').innerHTML += buildCards(matches);
    /* cards := save the element of each card on page */
    cards = document.querySelectorAll('.memory-card');
    /* adding click listener to the cards */
    cards.forEach((card) => { card.addEventListener('click', flipCard) });
    /* shuffle := sorting the cards on page */
    shuffle();

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
  });

/**
 * 
 * @param {*} matches dictionary of pairs of words for the card board
 */
function buildCards(matches) {
  cards_view = `
  <div class="row w-100" >
  <div class="col-12 d-flex justify-content-center">
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

  return value.includes('/')  && value.includes('.') ?
    `
  <div class="memory-card" data-word="${key}">
    <img class="front-face" src="${API + value}" alt="" />
    <img class="back-face" src="assets/images/Incities_logo.svg" alt="Incities" />
  </div>
  `
    :
    `
  <div class="memory-card" data-word="${key}">
    <div class="front-face"> <p class="paragraph" ${value.length>30? 'style="font-size: small;"' : ''}>${value}</p> </div>
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
  document.querySelector(".layout").style.display = "none";
  document.querySelector("#loader").style.display = "block";
  time = timediff(time_to_finish, document.getElementById('timer').value);
  let data = {
    "type": type,
    "userID": userID,
    "time_to_finish": time,
    "activity_id": activity_id,
    "module_id": module_id,
    "interactive_id": interactive_id,
    "flips": pairs
  }
  console.log(data);
  fetch(API + 'api/responseInteractive', {
    method: 'POST',
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(function (res) {
      console.log(res)
      console.log('Success:', res);
      let badge = res['data']['user_badge'] != false ? res['data']['user_badge'] : false;
      document.querySelector('#final-message .results').innerHTML = `<ul><li>Tiempo: ${time}</li> <li>Flips totales: ${attempts}</li> <li>Parejas encontradas: ${res['data']['flips']}/${num_matches}</li> </ul>`;
           
      document.querySelector("#final-message p").innerText = res['data']['flips'] == num_matches? '¡Muy buen trabajo! Ha logrado relacionar las palabras e imágenes claves propuestas en la actividad de aprendizaje. Vamos a explorar otra actividad y/o módulo de aprendizaje.' : '¡Ánimos! Vamos a intentarlo nuevamente, recarga la página para reiniciar la actividad';
      document.querySelector("#loader").style.display = "none";
      document.querySelector("#final-message").style.display = "block";
      
      
      if (badge != false) {
        const modals = badges_modal(badge,theme);
        
        modals.next();

        $('#badge_modal').on('hidden.bs.modal', function (e) {
          modals.next();
        });
      }
    });
}


