var activity_id, interactive_id, badge, theme, type, module_id, theme_id, userID;
var focusword = []
var actual = 0;
var solved = {};
var wordCount = {}
var def = [];
var helps = 0;
var closeText = '';
var intervalID;

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
        console.log(json)
        json = json['data'];
        def = json['matches'];
        type = json['type'];
        closeText = json['close'];
        time_to_finish = json['time_limit'];
        var title = json['title'];

        theme = json['theme'];
        interactive_id = json['interactive_id'];
        activity_id = json['id'];
        module_id = json['module_id'];
        theme_id = json['theme_id'];


        var title_timer = `<h3 class="title mt-5 mb-3" style="color:${json['pivot'][0]};">${title}</h3>`;

        document.getElementById('title').innerHTML = title_timer;

        /* title_results := defines the navbar */
        let verticals = '<div class="row"><div class="col-sm" style="padding: 10px;"> <h3 class="text-center">Palabras verticales</h3> <ol class="list-group">';
        let horizontals = '<h3 class="text-center pt-4">Palabras horizontales</h3> <ol class="list-group">';
        let order = {}
        let orientation = Object.values(json['orientation']);
        Object.entries(def).forEach(([key, value], index) => {
            if (orientation[index][2] == 1) {
                verticals += `
                <li class="list-group-item" id="${key}" value="${index + 1}">
                ${value}
                </li>       
                `;
            } else {
                horizontals += `
                <li class="list-group-item" id="${key}" value="${index + 1}">
                ${value}
                </li>       
                `;
            }
            order[key] = index + 1;
        });
        /* results := define options buttons */
        verticals += '</ol>'
        horizontals += `</ol></div></div> 
        <button class="btn-check btn" id="option-btn-check" >Verificar</button>
        <button class="btn-check btn" id="option-btn-reveal" >Revelar</button>
        <button class="btn-check btn" id="option-btn-clear" >Limpiar casillas</button>
        <button class="btn-check btn" id="option-btn-end" >Terminar Crucigrama</button>`;

        /** buildBoard := constructs the board on page  */
        buildBoard(json['board'], json['size'], order, verticals + horizontals);

        /* loader := simulate a charge view */
        document.querySelector("#loader").style.display = "none";


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

        /**
 * 
 * Activate the timer
 * 
 */
        intervalID = setInterval(function () {
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
 * @param {*} board squad matrix of lettes with the words configuration
 * @param {*} size size of board
 * @param {*} index establish the order of the appearance of the word
 * @param {*} def1 is the definitions list of every word
 */
function buildBoard(board, size, index, def1) {
    var result = '<div class="row mb-2 mt-2"> <div class="wrapper" align="right" style="grid-template-columns: repeat(' + size + ', 1fr);">';
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
        fetch(API + 'api/getInteractive/' + interactive_id + '/crosswords/' + id + "/" + word, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }) //https://api.myjson.com/bins/a3l3w')
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
    fetch(API + 'api/getInteractive/' + interactive_id + '/crosswords/' + id,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }) //https://api.myjson.com/bins/a3l3w')
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
        "interactive_id": interactive_id,
        "module_id": module_id,
        "solved": Object.keys(solved).length
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
            document.querySelector('#final-message .results').innerHTML = `<ul> <li>Tiempo: ${time}</li> <li>Palabras acertadas: ${res['data']['solved']}</li></ul>`;

            document.querySelector("#final-message p").innerText = res['data']['solved'] >= 5 ? '¡Muy buen trabajo! Ha logrado asociar las palabras con definiciones claves propuestas en la actividad de aprendizaje. Vamos a explorar otra actividad y/o módulo de aprendizaje.' : '¡Ánimos! Vamos a intentarlo nuevamente, recarga la página para reiniciar la actividad.';
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