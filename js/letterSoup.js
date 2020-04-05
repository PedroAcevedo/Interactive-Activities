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
  buildBoard(20);
  document.querySelector("#loader").style.display = "none";
});

function buildBoard(size) {
    var board = Array(size).fill('0').map((x) => Array(size).fill('0'));
    var result = '<div class="wrapper" style="grid-template-columns: repeat(' + size + ', 1fr);">';
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (board[i][j] == '0') {
                result += `
                    <div class="letter unselectable" >
                       o
                    </div>      
                    
                `;
            } else {
                result += `
                    <div class='empty'>
                        
                    </div>      
                `;
            }
        }
    }
    result += '</div>'
    document.getElementById('result').innerHTML = result;
}


$(document).on({
    mouseenter: function () {
        //stuff to do on mouse enter
        
    },
    mouseleave: function () {
        //stuff to do on mouse leave
    }
}, ".unselectable");

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

