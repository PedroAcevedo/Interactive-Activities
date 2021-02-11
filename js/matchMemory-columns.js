var time_to_finish, type, userID, pairs = 0, attempts = 0, num_matches, activity_id, interactive_id, module_id, theme_id, badge, theme;;
var lockBoard = false;
var flipSound;
var closeText = '';
var right_items = [], left_items = [];
var selection = 'right';
var pair = [];
var tries = 0;
var matches_selected = {}
var selected = []
var images = [];

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
    /* board := defines the cards area */
    document.getElementById('board').innerHTML += buildCards(matches);

    document.querySelector('.left-options .stick').innerHTML += `
    <div class="row d-flex flex-column justify-content-center mt-4">
        <div class="col-12">
          <a id="remove-mov" class="btn btn-secondary pulse-grow w-100" style="background-color:${json['pivot'][0]};color: white;" > Deshacer movimiento </a>
        </div> 
        <div class="col-12 mt-4">
          <h3>Conexiones: <span id="connections">${tries}</span> </h3>
        </div>
     </div>
    `;

    if (images.length == 0) {
      document.querySelector("#loader").style.display = "none";
      document.querySelector("#board").style.display = "block";
    }
    /* cards := save the element of each card on page */
    // cards = document.querySelectorAll('.memory-card');
    // /* adding click listener to the cards */
    // cards.forEach((card) => { card.addEventListener('click', flipCard) });
    // /* shuffle := sorting the cards on page */
    // shuffle();

    document.getElementById('remove-mov').addEventListener('click', removeMove);

    $('.card').click(function () {

      if ($(this).parent().hasClass(selection) && !selected.includes($(this).attr('id'))) {

        $(this).css("background-color", `${json['pivot'][0]}`);
        $(`#${$(this).attr('id')} p`).css("color", 'white');
        selection = selection === 'right' ? 'left' : 'right';
        selected.push($(this).attr('id'))
        if (pair.length < 2) {

          pair.push($(this).attr('id'));
          if (pair.length == 2) {
            tries++;
            document.getElementById('connections').innerHTML = tries;
            let line = new LeaderLine(document.getElementById(`${pair[0]}`), document.getElementById(`${pair[1]}`), { color: 'red', size: 3, dash: { animation: true }, startSocket: 'right', endSocket: 'left' });
            matches_selected[`${pair[0]}-${pair[1]}`] = {
              line: line,
              relation: document.getElementById(`${pair[0]}`).getAttribute('data-word') === document.getElementById(`${pair[1]}`).getAttribute('data-word')
            }
            pair = [];
            if (selected.length == Object.keys(matches).length * 2) {
              console.log(matches_selected);
              setTimeout(() => { postToServer(); }, 2000);
            }
          }
        }
      }

    });


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

  Object.entries(matches).forEach(([key, values], index) => {
    right_items.push(defineCard(key, values, index, 'r'));
    left_items.push(defineCard(values, key, index, 'l'));

  });

  right_items.sort(() => .5 - Math.random());
  left_items.sort(() => .5 - Math.random());

  return `
  <div class="row mt-5 d-flex justify-content-between">
  <div id="right" class="sel-col right col-5 pl-5 pr-5">
  ${right_items.join(' ')} 
  </div>

  <div id="left" class="sel-col left col-5 pl-5 pr-5">
  ${left_items.join(' ')}
  </div>
  <div>`;
}

/**
 * 
 * @param {*} key id for identify pairs 
 * @param {*} value values of a card
 */
function defineCard(key, value, index, dir) {
  if (value.includes('/') && value.includes('.')) {
    images.push(true);
  }

  return value.includes('/') && value.includes('.') ?
    `
  <div id="${index}-${dir}" class="card memory-card" data-word="${index}">
    <img class="front-face card-body" src="https://apiavas.dcm-system.co/public/${value}" alt="" style="height:150px" onload="javascript: ready()"/>
  </div>
  `
    :
    `
  <div id="${index}-${dir}" class="card memory-card" data-word="${index}">
    <div class="front-face card-body"> <p class="paragraph ow" style="font-size: medium;">${value}&nbsp;</p> </div>
  </div>
  `;


}

function ready() {
  images.pop();

  if (images.length == 0) {
    document.querySelector("#loader").style.display = "none";
    document.querySelector("#board").style.display = "block";
  }
}


function removeMove() {
  if (selected.length > 0) {
    selection = 'right';
    if (pair.length == 0) {

      let lastItem = document.getElementById(selected.pop());
      let penultimateItem = document.getElementById(selected.pop());
      matches_selected[`${penultimateItem.getAttribute('id')}-${lastItem.getAttribute('id')}`].line.remove();
      lastItem.style.backgroundColor = 'white';
      penultimateItem.style.backgroundColor = 'white';
      if (lastItem.children[0].children.length > 0) {
        lastItem.children[0].children[0].style.color = 'black';
      }
      if (penultimateItem.children[0].children.length > 0) {
        penultimateItem.children[0].children[0].style.color = 'black';
      }
    } else {
      document.getElementById(pair[0]).style.backgroundColor = 'white';
      if (document.getElementById(pair[0]).children[0].children.length > 0) {
        document.getElementById(pair[0]).children[0].children[0].style.color = 'black';
      }
      pair = [];
      selected.pop();
    }
  }
}


/**
 * 
 *  Sending data  to server
 * 
 */
function postToServer() {
  document.querySelector(".layout").style.display = "none";
  document.querySelector("#loader").style.display = "block";
  document.querySelectorAll('.leader-line').forEach((line) => line.style.display = 'none');
  time = timediff(time_to_finish, document.getElementById('timer').value);
  let data = {
    "type": type,
    "userID": userID,
    "time_to_finish": time,
    "activity_id": activity_id,
    "module_id": module_id,
    "interactive_id": interactive_id,
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
      let pair_finded = Object.values(matches_selected).filter((elem) => elem.relation === true).length;
      let badge = res['data']['user_badge'] != false ? res['data']['user_badge'] : false;
      document.querySelector('#final-message .results').innerHTML = `<ul><li>Tiempo: ${time}</li> <li>Intentos: ${tries}</li> <li>Parejas encontradas: ${pair_finded}/${num_matches}</li> </ul>`;

      document.querySelector("#final-message p").innerText = pair_finded >= Math.ceil(num_matches / 2) ? '¡Muy buen trabajo! Ha logrado relacionar las palabras e imágenes claves propuestas en la actividad de aprendizaje. Vamos a explorar otra actividad y/o módulo de aprendizaje.' : '¡Ánimos! Vamos a intentarlo nuevamente, recarga la página para reiniciar la actividad';
      document.querySelector("#loader").style.display = "none";
      document.querySelector("#final-message").style.display = "block";


      if (badge != false) {
        const modals = badges_modal(badge, theme);

        modals.next();

        $('#badge_modal').on('hidden.bs.modal', function (e) {
          modals.next();
        });
      }
    });
}


