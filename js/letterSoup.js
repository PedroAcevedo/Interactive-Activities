var soup_answer = 0, orientation = 0, direction = 0;
var selection = false;
var selectWord, type, userID, time_to_finish, activity_id = '';
var initial, second = undefined;
var selectedList = [];
var wordList = [];

fetch('http://localhost:8000/api/getInteractive/15')//'https://jsonblob.com/api/jsonBlob/30ae5e51-75b7-11ea-9538-21f393c40628')
  .then(response => response.json())
  .then(function (json) {

    json = json['data'];
    var title = json['title'];
    time_to_finish = json['time_limit'];
    activity_id = json['interactive_id'];
    var soup = json['board'];
    wordList = json['soup'];
    type = json['type'];
    var size = json['size'];
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
    var words = '<h3 class="text-center"> Palabras a buscar: </h3> <div class="d-flex flex-row flex-wrap">';
    
    wordList.forEach(function (word, index) {
      words += `
        <div id="${word[0]}-${index}"class="card card-tile" >

        <h5 class="card-title" style="font-size: 15px;letter-spacing: 3px;">${word[0] + '_'.repeat(word.length - 1) + ' '}</h5>
                
        </div>       
        `;
    });
    words += `</div>   

    <button class="btn btn-check w-100" id="option-btn-check" > Terminar sopa de letras</button>
    `;
    document.getElementById('title_results').innerHTML = title_timer;
    document.getElementById('words').innerHTML = words;
    document.getElementById('option-btn-check').addEventListener('click', postToServer);
    buildBoard(size, soup);
    document.querySelector("#loader").style.display = "none";
    document.getElementById('btn-back').addEventListener('click', postToServer);
  

    $('.letters')
      .mouseup(function () {
        selection = false;
        initial, second = undefined;
        if ($(this) != initial) {
          console.log(selectWord);
          let index = verify(selectWord)
          if (index != -1) {
            let card = document.getElementById(selectWord[0] + '-' + index)
            card.classList.add("bg-success");
            soup_answer++;
            if(soup_answer==wordList.length){
              setInterval(postToServer(), 4000);
            }
            card.innerHTML = selectWord;
            selectedList.forEach(word => word.css("background-color", 'yellow'));
            selectedList = [];
          } else {
            selectedList.forEach(word => word.css("background-color", 'white'));
            selectedList = [];
          }
          selectWord = '';
        } else {
          selectedList.forEach(word => word.css("background-color", 'white'));
          selectedList = [];
        }
      })
      .mousedown(function () {
        selection = true;
        initial = $(this);
        selectedList.push(initial);
        selectWord = $(this).text().trim();
        $(this).css("background-color", 'yellow');
      });

  });

function buildBoard(size, soup) {
  var result = '<div class="wrapper" align="right" style="grid-template-columns: repeat(' + size + ', 1fr);">';
  result = 
  `<div class="row d-flex justify-content-between mb-3">
  <div class="col-5 d-flex justify-content-start">
      <button id="btn-back" class="btn btn-back float-sm-right">  REGRESAR  < </button>
  </div>
  <div class="col-7">
      <h3 >Sopa de letras</h3>
  </div>
  </div>` + result;

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      result += `
              <div class="letters unselectable" data-row="${i}" data-column="${j}">
                    ${soup[i][j]}
              </div>
          `;
    }
  }
  result += '</div>'
  document.getElementById('result').innerHTML = result;
}

function verify(wordselected) {
  return wordList.findIndex((element) => element == wordselected);
}

$(document).on({
  mouseenter: function () {
    //stuff to do on mouse enter
    if (selection) {
      if ($(this) != initial) {
        if (!selectedList.includes($(this))) {
          if (second == undefined) {
            second = $(this);
            console.log(initial.data('row'));
            if (initial.data('row') == second.data('row')) {
              orientation = 0;
              if (initial.data('column') < second.data('column')) {
                direction = 1;
              } else {
                direction = 2;
              }
            } else {
              if (initial.data('column') == second.data('column')) {
                orientation = 1;
                if (initial.data('row') < second.data('row')) {
                  direction = 1;
                } else {
                  direction = 2;
                }
              } else {
                orientation = 2;
                if (initial.data('column') < second.data('column')) {
                  direction = 1;
                } else {
                  direction = 2;
                }
              }
            }
            selectBox(second);
          } else {
            if (orientation == 0) {
              if (initial.data('row') == $(this).data('row')) {
                if (direction == 1) {
                  if (initial.data('column') < $(this).data('column')) {
                    selectBox($(this));
                  }
                } else {
                  if (initial.data('column') > $(this).data('column')) {
                    selectBox($(this));
                  }
                }
              }
            } else {
              if (orientation == 1) {
                if (initial.data('column') == $(this).data('column')) {
                  if (direction == 1) {
                    if (initial.data('row') < $(this).data('row')) {
                      selectBox($(this));
                    }
                  } else {
                    if (initial.data('row') > $(this).data('row')) {
                      selectBox($(this));
                    }
                  }
                }
              } else {
                if (Math.abs(selectedList.slice(-1)[0].data('row') - $(this).data('row')) == 1 && Math.abs(selectedList.slice(-1)[0].data('column') - $(this).data('column')) == 1) {
                  if (direction == 1) {
                    if (initial.data('column') < $(this).data('column')) {
                      selectBox($(this));
                    }
                  } else {
                    if (initial.data('column') > $(this).data('column')) {
                      selectBox($(this));
                    }
                  }
                }
              }
            }

          }
        } else {
          console.log('in');
          selectWord = selectWord.slice(0, -1);
          selectedList.remove($(this));
        }
      } else {
        second = undefined;
      }
    }
  },
  mouseleave: function () {
    //stuff to do on mouse leave
  }
}, ".unselectable");

function selectBox(element) {
  selectedList.push(element);
  selectWord += element.text().trim();
  element.css("background-color", 'yellow');
}


function postToServer() {
  document.querySelector("#content").style.display = "none";
  document.querySelector("#loader").style.display = "block";
  time = timediff(time_to_finish, document.getElementById('timer').value);
  let data = {
    "type": type,
    "userID": userID,
    "time_to_finish": time,
    "activity_id": activity_id,
    "solved": soup_answer
  }
  console.log(data);
  fetch('http://localhost:8000/api/responseInteractive', {
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
      let nofind = '<ul>';
      document.querySelectorAll('.card-tile').forEach(function (card){
        if(!card.classList.contains('bg-success')){
          nofind += `<li>${wordList[parseInt(card.id.split('-')[1])]}</li>`;
        }
      });
      nofind += '</ul>';
      document.querySelector('.modal-title').innerHTML = "Resultados";
      document.getElementById('modal-button').innerHTML = "Terminar";
      document.getElementById('score').innerHTML = `<ul> <li>Tiempo: ${time}</li> <li>Palabras encontradas: ${res['data']['solved']}/${wordList.length}</li> <li> Palabras sin descubir: ${nofind} </li></ul>`;
      $('#myModal').modal('toggle');
    });
}


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

