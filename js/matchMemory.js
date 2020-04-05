
let cards;
fetch('https://jsonblob.com/api/jsonBlob/30ae5e51-75b7-11ea-9538-21f393c40628')
.then(response => response.json())
.then(function (json) {

  time_to_finish = json['level'] == 1 ? 5 : 3;
  var title = json['activity_title'];
  var title_timer = `
    <div class="container-fullwidth">
     <header>
      <nav class="fixed-top navbar navbar-expand-lg bg-white justify-content-center" style="border-bottom:3px #dee2e6 solid">
        <div class="row">
          <section class=\"title\"><h1>${title}</h1> 
        </div>
          <h3 id="timer" style="margin-left: 10%;" value="00:00"></h3>
      </nav>
      </header>
    </div>
    `;
  document.getElementById('title_results').innerHTML = title_timer;
  document.querySelector("#loader").style.display = "none";
  cards = document.querySelectorAll('.memory-card');
  console.log(cards)
  cards.forEach(card => card.addEventListener('click', flipCard));
});

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

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

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
});

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
