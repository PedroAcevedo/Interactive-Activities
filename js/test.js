var num_questions, userID, activity_id = 0;
var intervalID, set, num_questions, time_to_finish;
var questions, selected = [];
var index = 1;
var type = 0;

fetch('http://localhost:8000/api/getInteractive/51')
  .then(response => response.json())
  .then(function (json) {
    //console.log(json);
    questions = json['data']['questions'];
    type = json['data']['type'];
    num_questions = questions.length;
    time_to_finish = json['data']['time_limit'];
    var title = json['data']['title'];
    const { id, content, options } = questions.pop();

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
    document.getElementById('title_results').innerHTML = title_timer;
    document.getElementById('results_enum').innerHTML = getContent(content);
    document.getElementById('results').innerHTML = getOptions(options);
    document.querySelector("#loader").style.display = "none";
    document.querySelector("#content").style.display = "block";
    document.getElementById('sendData').addEventListener('click', sendData);
    index = index + 1;
  });

function clickButton(val) {
  set = val
  $("#sendData").removeAttr("disabled");
}

function sendData() {
  var results_enum = '';
  document.querySelector("#content").style.display = "none";
  document.querySelector("#loader").style.display = "block";
  $(":submit").attr("disabled", true);
  selected.push(set)
  if (questions.length > 0) {
    const { id, content, options } = questions.pop();
    document.getElementById('results_enum').innerHTML = getContent(content);
    document.getElementById('results').innerHTML = getOptions(options);
    document.querySelector("#content").style.display = "block";
    document.querySelector("#loader").style.display = "none";
    document.getElementById('sendData').addEventListener('click', sendData);
    index = index + 1;
  } else {
    postToServer();
  }
}

function postToServer() {
  document.querySelector("#content").style.display = "none";
  document.querySelector("#loader").style.display = "block";
  let data = {
    "type": type,
    "userID": userID,
    "time_to_finish": timediff(time_to_finish, document.getElementById('timer').value),
    "activity_id": activity_id,
    "answers": selected
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
      document.querySelector('.modal-title').innerHTML = "Resultados";
      document.getElementById('modal-button').innerHTML = "Terminar";
      document.getElementById('score').innerHTML = `<ul> <li>Tiempo: ${document.getElementById('timer').value}</li> <li>Correctas: ${res['data']['correct_answers']}/${num_questions}</li></ul>`;
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

function getContent(content) {
  let contenido = content.length > 300 ? `<h3 style="padding: 5% 15%;">${content}</h3>` : `<h1 style="padding: 5% 15%;">${content}</h1>`;

  return `
    <a class="carousel-control-next d-flex align-items-start" style="height: 50px;" role="button" data-slide="next">
      <button id="sendData" type="button" class="btn btn-info d-flex shadow" style="margin-top:100px" disabled>Siguiente</button>
    </a>
    <div class="col pt-3 ml-0 mr-0 mt-5 pt-5 d-flex justify-content-start">
      <button id="btn-back" class="btn btn-back float-sm-right">  REGRESAR  < </button>
    </div>
    <div class="row pt-3 ml-3 font-weight-bold" style="padding-left:20px">${index} de ${num_questions}</div>
    <div class="row text-justify d-flex justify-content-center">
      ${contenido}
    </div>
    `
}

function getOptions(options) {
  return `
          <div class="row">
              <div class="col pl-2 pr-2">
                <button type="button" class="btn btn-success d-flex w-100" style="height:100%" onclick="clickButton( \'` + options[0]['option_id'] + `\')">
                  <div class="col-6 col-md-2 shad"><b>A.</b></div>
                  <div class="col-12 col-md-10 text-left" style="color:white;font-size: 20px;padding:5px;">${options[0]['content']}</div>
                </button>
              </div>
              <div class="col pl-2 pr-2">
                <button type="button" class="btn btn-primary d-flex w-100" style="height:100%" onclick="clickButton(\'` + options[1]['option_id'] + `\')">
                  <div class="col-6 col-md-2 shad"><b>B.</b></div>
                  <div class="col-12 col-md-10 text-left" style="color:white;font-size: 20px;padding:5px;">${options[1]['content']}</div>
                </button>
              </div>
              <div class="col pl-2 pr-2">
                <button type="button" class="btn btn-warning d-flex w-100" style="height:100%" onclick="clickButton(\'` + options[2]['option_id'] + `\')">
                  <div class="col-6 col-md-2 shad"><b>C.</b></div>
                  <div class="col-12 col-md-10 text-left" style="color:white;font-size: 20px;padding:5px;">${options[2]['content']}</div>
                </button>
              </div>
              <div class="col pl-2 pr-2">
                  <button type="button" class="btn btn-danger d-flex w-100" style="height:100%" onclick="clickButton(\'` + options[3]['option_id'] + `\')">
                    <div class="col-6 col-md-2 shad"><b>D.</b></div>
                    <div class="col-12 col-md-10 text-left" style="color:white;font-size: 20px;padding:5px;">${options[3]['content']}</div>
                  </button>
              </div>
            </div>
            `
}

/*function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}*/