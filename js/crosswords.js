var activity_id, type, userID;
var focusword = []
var actual = 0;
var solved = {};
var wordCount = {}
var def = [];
var helps = 0;

/**
 * 
 *  GET the initial activity
 *  
 */
fetch(API + 'api/getInteractive/47') //https://api.myjson.com/bins/a3l3w') https://www.freemysqlhosting.net/account/
    .then(response => response.json())
    .then(function (json) {
        
        json = json['data'];
        def = json['matches'];
        type = json['type'];
        time_to_finish = json['time_limit'];
        var title = json['title'];
        activity_id = json['interactive_id'];
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

        /* title_results := defines the navbar */
        document.getElementById('title_results').innerHTML = title_timer;
        let results = '<h3 class="text-center">Definiciones</h3><div class="row"><div class="col-sm" style="padding: 20px;"><ol class="list-group">';
        let order = {}
        Object.entries(def).forEach(([key, value], index) => {
            results += `
                <li class="list-group-item" id="${key}">
                ${value}
                </li>       
                `

            order[key] = index + 1;
        });
        /* results := define options buttons */
        results += `</ol></div></div> 
        <button class="btn-check btn" id="option-btn-check" >Verificar palabra</button>
        <button class="btn-check btn" id="option-btn-reveal" >Revelar</button>
        <button class="btn-check btn" id="option-btn-clear" >Limpiar este</button>
        <button class="btn-check btn" id="option-btn-end" >Terminar Crucigrama</button>`;

        /** buildBoard := constructs the board on page  */
        buildBoard(json['board'], json['size'], order, results);

        /* loader := simulate a charge view */
        document.querySelector("#loader").style.display = "none";
        /* btn-back := defines the button to go back */
        document.getElementById('btn-back').addEventListener('click', postToServer);

        /** letters := crossword tiles actions */
        $(".letters").focus(function () {
            if (focusword) {
                if (focusword.findIndex(element => element.dataset.row == $(this).data('row') && element.dataset.column == $(this).data('column')) == -1) {
                    document.querySelectorAll('input[data-number^="' + actual + '-"]').forEach((item) => { focusword.push(item); item.style.backgroundColor = "#F1F1F1" });
                    document.querySelectorAll('input[data-number$="-' + actual + '"]').forEach((item) => { focusword.push(item); item.style.backgroundColor = "#F1F1F1" });
                    document.querySelectorAll('input[data-number="' + actual + '"]').forEach((item) => { focusword.push(item); item.style.backgroundColor = "#F1F1F1" });
                    actual = 0;
                }
            }
            if (actual == 0) {
                var $input = $(this).data()
                focusword = [];
                $input = $input["number"].length > 1 ? $input["number"].split("-").shift() : $input["number"];
                actual = $input;
                document.querySelectorAll('input[data-number^="' + $input + '-"]').forEach((item) => { focusword.push(item); item.style.backgroundColor = "#00C574" });
                document.querySelectorAll('input[data-number$="-' + $input + '"]').forEach((item) => { focusword.push(item); item.style.backgroundColor = "#00C574" });
                document.querySelectorAll('input[data-number="' + $input + '"]').forEach((item) => { focusword.push(item); item.style.backgroundColor = "#00C574" });
            }
        });
        $("input").keydown(function (e) {
            let text = $(this).val();
            $(this).val(text.slice(1));
        });
        $("input").keyup(function (e) {
            if (e.keyCode == 8) {
                var row = $(this).data('row');
                var column = $(this).data('column');
                var index = wordCount[actual] ? wordCount[actual].findIndex(element => element[0] == row && element[1] == column) - 1 : -1;
                if (wordCount[actual] != undefined) {
                    if (wordCount[actual][index] != undefined) {
                        let neighbor = focusword.find(element => element.dataset.row == wordCount[actual][index][0] && element.dataset.column == wordCount[actual][index][1]);
                        while (neighbor == undefined) {
                            index--;
                            neighbor = focusword.find(element => element.dataset.row == wordCount[actual][index][0] && element.dataset.column == wordCount[actual][index][1]);
                        }
                        neighbor.focus();
                    }
                }
            } else {
                var row = $(this).data('row');
                var column = $(this).data('column');
                var index = wordCount[actual] ? wordCount[actual].findIndex(element => element[0] == row && element[1] == column) + 1 : -1;
                if (wordCount[actual] != undefined) {
                    if (wordCount[actual][index] != undefined) {
                        let neighbor = focusword.find(element => element.dataset.row == wordCount[actual][index][0] && element.dataset.column == wordCount[actual][index][1]);
                        while (neighbor == undefined) {
                            index++;
                            neighbor = focusword.find(element => element.dataset.row == wordCount[actual][index][0] && element.dataset.column == wordCount[actual][index][1]);
                        }
                        neighbor.focus();
                    }
                }
            }
        });


    });

/**
 * 
 * @param {*} board squad matrix of lettes with the words configuration
 * @param {*} size size of board
 * @param {*} index establish the order of the appearance of the word
 * @param {*} def1 is the definitions list of every word
 */
function buildBoard(board, size, index, def1) {
    var result = '<div class="wrapper" align="right" style="grid-template-columns: repeat(' + size + ', 1fr);">';
    result =
        `<div class="row d-flex justify-content-between">
    <div class="col d-flex justify-content-start">
        <button id="btn-back" class="btn btn-back float-sm-right">  REGRESAR  < </button>
    </div>
    <div class="col">
        <h3>Crucigrama</h3>
    </div>
    </div>
    <div class="row mb-2 mt-2">
    ` + result;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (board[i][j] != '0') {
                let worditem = board[i][j].split("*").shift().split('-').shift();
                wordCount[worditem] ? wordCount[worditem].push([i, j]) : wordCount[worditem] = [[i, j]];
                let cross = board[i][j].split("*").shift().split('-')
                if (cross.length > 1) {
                    wordCount[cross[1]] ? wordCount[cross[1]].push([i, j]) : wordCount[cross[1]] = [[i, j]];
                }
                result += `
                    <div class="letter">
                    <span class="question_number"><small>${board[i][j].includes("*") ? index[board[i][j].split("*").shift()] : ''}</small></span>
                    <input class="letters" data-row="${i}" data-column="${j}"  data-number="${board[i][j].split("*").shift()}" onkeyup="this.value = this.value.toUpperCase();"> </input>
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
    result += `</div> </div>`;
    document.getElementById('result').innerHTML = result;
    document.getElementById('definitions').innerHTML = def1;
    buttons = document.querySelectorAll('button[id*="option"]')
    for (const button of buttons) {
        button.addEventListener('click', optionButtons)
    }
}

/**
 * 
 * @param {*} e click event
 */
function optionButtons(e) {
    let writeword = '';
    let id;
    switch (e.target.id) {
        case 'option-btn-check':
            word_list = [];
            wordCount[actual].forEach(function (coordinate, index) {
                box = focusword.find(element => element.dataset.row == coordinate[0] && element.dataset.column == coordinate[1]);
                if (index == 0) {
                    id = box.dataset.number;
                }
                writeword += box.value;
                word_list.push(box);
            });
            checkword(word_list, writeword, id.split('*').shift().split('-').shift());
            break;
        case 'option-btn-clear':
            focusword.forEach(function (box) {
                box.value = "";
            });
            break;
        case 'option-btn-end':
            clearTimeout(intervalID);
            postToServer();
            break;
        case 'option-btn-reveal':
            box = focusword.find(element => element.dataset.row == wordCount[actual][0][0] && element.dataset.column == wordCount[actual][0][1]);
            getword(box.dataset.number.split('*').shift().split('-').shift());
            break;
        default:
            console.log('ERROR : ' + expr + '.');
    }
}

/**
 * 
 * @param {*} word_list list of the selected box in the board
 * @param {*} word word to be checked
 * @param {*} id id of the match
 */
function checkword(word_list, word, id) {
    if (solved[id] === undefined) {
        fetch(API + 'api/getInteractive/' + activity_id + '/crosswords/' + id + "/" + word) //https://api.myjson.com/bins/a3l3w')
            .then(response => response.json())
            .then(function (json) {
                if (json['data']['response'] == true) {
                    word_list.forEach(function (box) {
                        box.style.color = 'green';
                    });
                    document.getElementById(id).classList.add("list-group-item-success");
                    solved[id] = 1;

                    if (Object.keys(solved).length == Object.keys(def).length) {
                        setTimeout(() => {
                            postToServer();
                        }, 2000);
                    }
                } else {
                    word_list.forEach(function (box) {
                        box.value = '';
                    });
                }
            });
    }
}

function getword(id) {
    //getInteractive/{id}/crosswords/{word_id}/{word?}
    fetch(API + 'api/getInteractive/' + activity_id + '/crosswords/' + id) //https://api.myjson.com/bins/a3l3w')
        .then(response => response.json())
        .then(function (json) {
            word_reference = json['data']['word'];
            wordCount[actual].forEach(function (coordinate, index) {
                box = focusword.find(element => element.dataset.row == coordinate[0] && element.dataset.column == coordinate[1]);
                box.value = word_reference[index].toUpperCase();
                box.style.color = 'green';
            });
            document.getElementById(id).classList.add("list-group-item-success");
            solved[id] = 1;
            helps++;

            if (Object.keys(solved).length == Object.keys(def).length) {
                setTimeout(() => {
                    postToServer();
                }, 2000);
            }
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
        "solved": Object.keys(solved).length
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
            document.getElementById('score').innerHTML = `<ul> <li>Tiempo: ${time}</li> <li>Palabras acertadas: ${res['data']['solved']}</li></ul>`;
            $('#myModal').modal('toggle');
        });
}