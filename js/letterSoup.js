var selectWord, type, userID, time_to_finish, activity_id, initial, second;
var soup_answer = 0, diag = 0;
var selection = false;
var selectedList = [];
var wordList = [];
var closeText = '';

/**
 * 
 *  GET the initial activity
 *  
 */
fetch(API + `api/getInteractive/${getUrlParameter('id')}`)
  .then(response => response.json())
  .then(function (json) {

    json = json['data'];
    var title = json['title'];
    time_to_finish = json['time_limit'];
    activity_id = json['interactive_id'];
    var soup = json['board'];
    wordList = json['soup'];
    closeText = json['close'];
    type = json['type'];
    var size = json['size'];
    var title_timer = `<h3 class="title mt-5 mb-3">${title}</h3>`;
    document.getElementById('title').innerHTML = title_timer;

    var words = '<h3 class="text-center"> Palabras a buscar: </h3> <div class="d-flex flex-row flex-wrap">';

    wordList.forEach(function (word, index) {
      words += `
        <div id="${word[0]}-${index}"class="card card-tile" >

        <h5 class="card-title" >${word[0] + '_'.repeat(word.length - 1) + ' '}</h5>
                
        </div>       
        `;
    });
    words += `</div>   
    <button class="btn btn-check w-100" id="option-btn-check" > Terminar sopa de letras</button>
    `;
    /* title_results := defines the navbar */

    /* word := define the list of words to seach */
    document.getElementById('words').innerHTML = words;
    /* option-btn-check := button for end the game */
    document.getElementById('option-btn-check').addEventListener('click', postToServer);
    /* builBoard := builds the letter soup board */
    buildBoard(size, soup);
    /* loader := simulate a charge view */
    document.querySelector("#loader").style.display = "none";

    /** letters := soup tiles actions */
    $('.letters')
      .on('mouseup touchstart', function () {
        selection = false;
        initial, second = undefined;
        diag = 0;
        if ($(this) != initial) {
          console.log(selectWord);
          let index = verify(selectWord)
          if (index != -1) {
            let card = document.getElementById(selectWord[0] + '-' + index)
            card.classList.add("bg-success");
            soup_answer++;
            if (soup_answer == wordList.length) {
              setInterval(postToServer(), 4000);
            }
            card.innerHTML = selectWord;
            selectedList.forEach(word => word.css("background-color", '#33CC99'));
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
      .on('mousedown touchend', function () {
        selection = true;
        initial = $(this);
        initial[0].center = getCenter($(this));
        selectedList.push(initial);
        selectWord = $(this).text().trim();
        $(this).css("background-color", '#FF9933');
      })
      .on("touchmove", function (e) {
        // get the touch element
        var touch = e.touches[0];

        // get the DOM element
        var box = document.elementFromPoint(touch.clientX, touch.clientY);
        box = $(box);
        // make sure an element was found - some areas on the page may have no elements
        if (box) {
          // interact with the DOM element
          // Dispatch/Trigger/Fire the event
          if (selection) {
            console.log('in');
            if (box != initial) {
              if (!selectedList.includes(box)) {
                if (second == undefined) {
                  second = box;
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
                    if (initial.data('row') == box.data('row')) {
                      if (direction == 1) {
                        if (initial.data('column') < box.data('column')) {
                          selectBox(box);
                        }
                      } else {
                        if (initial.data('column') > box.data('column')) {
                          selectBox(box);
                        }
                      }
                    }
                  } else {
                    if (orientation == 1) {
                      if (initial.data('column') == box.data('column')) {
                        if (direction == 1) {
                          if (initial.data('row') < box.data('row')) {
                            selectBox(box);
                          }
                        } else {
                          if (initial.data('row') > box.data('row')) {
                            selectBox(box);
                          }
                        }
                      }
                    } else {
                      if (Math.abs(selectedList.slice(-1)[0].data('row') - box.data('row')) == 1 && Math.abs(selectedList.slice(-1)[0].data('column') - box.data('column')) == 1) {
                        if (direction == 1) {
                          if (initial.data('column') < box.data('column')) {
                            selectBox(box);
                          }
                        } else {
                          if (initial.data('column') > box.data('column')) {
                            selectBox(box);
                          }
                        }
                      }
                    }
                  }

                }
              } else {
                console.log('in');
                selectWord = selectWord.slice(0, -1);
                selectedList.remove(box);
              }
            } else {
              second = undefined;
            }
          }
        }
      });


    $(".unselectable ").on('mouseenter', function () {
      //stuff to do on mouse enter
      if (selection) {
        $(this)[0].center = getCenter($(this));
        selectBox($(this));
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


function getCenter(element) {
  var offset = element.offset();
  var width = element.width();
  var height = element.height();

  var centerX = offset.left + width / 2;
  var centerY = offset.top + height / 2;

  return { 'x': centerX, 'y': centerY }
}

/**
 * 
 * @param {*} size size of the board
 * @param {*} soup squad matrix of lettes with the words configuration
 */
function buildBoard(size, soup) {
  var result = '<div class="wrapper mt-4" align="right" style="grid-template-columns: repeat(' + size + ', 1fr);">';

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
  document.getElementById('result').innerHTML += result;
}

/**
 * 
 * @param {*} wordselected finds if the selected word is an answer
 */
function verify(wordselected) {
  return wordList.findIndex((element) => element == wordselected);
}

/**
 * 
 * @param {*} element the actual box on click
 */
function selectBox(element) {

  if (selectedList.length > 0)
    if (initial[0].center.x == element[0].center.x || initial[0].center.y == element[0].center.y) {
      selectedList.push(element);
      selectWord += element.text().trim();
      element.css("background-color", '#FF9933');
    } else {
      if (diag == 0) {
        if (selectedList.length == 2) {
          diag = 1;
          selectedList.pop().css("background-color", 'white');
          selectWord = selectWord.substr(0, 1);
          selectedList.push(element);
          selectWord += element.text().trim();
          element.css("background-color", '#FF9933');
        } else {
          if (Math.abs(initial.data('row') - element.data('row')) == 1 && Math.abs(initial.data('column') - element.data('column')) == 1) {
            diag = 1;
            selectedList.push(element);
            selectWord += element.text().trim();
            element.css("background-color", '#FF9933');
          }
        }

      } else {
        if (Math.abs(initial.data('row') - element.data('row')) == selectedList.length && Math.abs(initial.data('column') - element.data('column')) == selectedList.length) {
          selectedList.push(element);
          selectWord += element.text().trim();
          element.css("background-color", '#FF9933');
        }
      }
    }

}

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
    "solved": soup_answer
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
      let nofind = '<ul>';
      document.querySelectorAll('.card-tile').forEach(function (card) {
        if (!card.classList.contains('bg-success')) {
          nofind += `<li>${wordList[parseInt(card.id.split('-')[1])]}</li>`;
        }
      });
      nofind += '</ul>';
      document.querySelector('.modal-title').innerHTML = "Resultados";
      document.getElementById('modal-button').innerHTML = "Terminar";
      document.getElementById('modal-button').addEventListener('click', function () { window.location = 'index.html' });
      document.getElementById('score').innerHTML = `<ul> <li>Tiempo: ${time}</li> <li>Palabras encontradas: ${res['data']['solved']}/${wordList.length}</li> <li> Palabras sin descubir: ${nofind} </li></ul><p>${closeText}</p>`;
      $('#myModal').modal('toggle');
    });
}

