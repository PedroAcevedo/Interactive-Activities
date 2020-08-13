var intervalID, num_questions, time_to_finish, userID, activity_id;
var questions = [], selected = [], set = {};
var index = 1;
var type = 0;
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
    questions = json['questions'];
    type = json['type'];
    num_questions = questions.length;
    time_to_finish = json['time_limit'];
    var title = json['title'];
    closeText = json['close'];

    var title_timer = `<h3 class="title mt-5 mb-3">${title}</h3>`;

    /* title_results := defines the navbar */
    document.getElementById('results_enum').innerHTML = title_timer;
    loadQuestions();

    /* loader := simulate a charge view */
    document.querySelector("#loader").style.display = "none";
    /* content := contain all the activity code, hide when charge */
    document.querySelector("#content").style.display = "block";
    /* sendData := defines the button for save the choice */
    document.getElementById('sendData').addEventListener('click', sendData);
    /* btn-back := defines the button to go back */
    document.getElementById('btn-back').addEventListener('click', postToServer);
    /* index := count the showed questions */
    index = index + 1;

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


function loadQuestions() {
  while (questions.length > 0) {
    const { id, content, options } = questions.pop();
    document.getElementById('results_enum').innerHTML += `<div id="${'q-' + index}">` + getContent(content);
    document.getElementById('results_enum').innerHTML += getOptions(options) + '</div>';
    index = index + 1;
  }
  document.getElementById('results_enum').innerHTML += `
  <div id="${'q-' + (num_questions+1)}" class="ml-0 mr-0 mt-5 pt-5 pr-5 d-flex justify-content-end"> 
      <button id="sendData" type="button" class="btn btn-lg btn-info shadow" disabled>Enviar test</button>
  </div>`;
  $('.results .btn').click(function () {
    $(`.results .btn[data-question="${$(this).data('question')}"]`).removeClass('selected');
    $(this).addClass('selected');
    set[$(this).data('question')] = $(this).data('value');
    window.location.href = `#q-${$(this).data('question') + 1}`;
    if (Object.keys(set).length == num_questions) {
      $("#sendData").removeAttr("disabled");
    }
  });
}

/**
 * 
 *  Restart the page view with a new question, when finish send answer to server
 * 
 */
function sendData() {
  document.querySelector("#content").style.display = "none";
  document.querySelector("#loader").style.display = "block";
  postToServer();
}
/**
 * 
 *  Sending data  to server
 * 
 */
function postToServer() {
  document.querySelector("#content").style.display = "none";
  document.querySelector("#loader").style.display = "block";
  let data = {
    "type": type,
    "userID": userID,
    "time_to_finish": timediff(time_to_finish, document.getElementById('timer').value),
    "activity_id": activity_id,
    "answers": Object.values(set)
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
      document.getElementById('score').innerHTML = `<ul> <li>Tiempo: ${document.getElementById('timer').value}</li> <li>Correctas: ${res['data']['correct_answers']}/${num_questions}</li></ul> <p>${closeText}</p>`;
      $('#myModal').modal('toggle');
    });
}




/**
 * 
 * @param {*} content defines the question statement
 * 
 */

function getContent(content) {
  let quest_img = '';
  let quest = content.split('@@');
  if (quest.length > 1) {
    content = quest[1];
    quest_img = quest[0];
  }

  let contenido = content.length > 300 ? `<h3 style="padding: 5% 15%;">${content}</h3>` : `<h1 style="padding: 5% 15%;">${content}</h1>`;

  return `
    ${ index != 1? `<div class="ml-0 mr-0 mt-5 pt-5 pr-5 d-flex align-items-start justify-content-end"> </div>`: ''}
    <div class="row pt-3 ml-3 font-weight-bold" style="padding-left:20px">${index} de ${num_questions}</div>
    ${quest_img != '' ? quest_img.split("src='")[0] + "src='" + `${/^http/.test(quest_img.split("src='")[1]) ? '' : API.substring(0, API.length - 1)}` + quest_img.split("src='")[1] : ""}
    <div class="row text-justify d-flex justify-content-center">
      ${contenido}
    </div>
    `
}


/**
 * 
 * @param {*} options list with the for options of answer
 */
function getOptions(options) {
  content = '<div class="results">';
  content += `
          <div class="row">
              <div class="col pl-2 pr-2">
                <button type="button" class="btn btn-success d-flex w-100" style="height:100%" data-question="${index}" data-value=\'` + options[0]['option_id'] + `\'>
                  <div class="col-3 shad"><b>A.</b></div>
                  <div class="col-9 text-left option">${options[0]['content']}</div>
                </button>
              </div>
              <div class="col pl-2 pr-2">
                <button type="button" class="btn btn-primary d-flex w-100" style="height:100%" data-question="${index}" data-value=\'` + options[1]['option_id'] + `\'>
                  <div class="col-3 shad"><b>B.</b></div>
                  <div class="col-9 text-left option">${options[1]['content']}</div>
                </button>
              </div>
            `
  if (options.length > 2) {
    content += `
    <div class="col pl-2 pr-2">
        <button type="button" class="btn btn-warning d-flex w-100" style="height:100%" data-question="${index}" data-value=\'` + options[2]['option_id'] + `\'>
          <div class="col-3 shad"><b>C.</b></div>
          <div class="col-9 text-left option" >${options[2]['content']}</div>
        </button>
      </div>
      <div class="col pl-2 pr-2">
          <button type="button" class="btn btn-danger d-flex w-100" style="height:100%" data-question="${index}" data-value=\'` + options[3]['option_id'] + `\'>
            <div class="col-3 shad"><b>D.</b></div>
            <div class="col-9 text-left option">${options[3]['content']}</div>
          </button>
      </div>
    </div>
    `
  }
  content += '</div>'
  return content;
}