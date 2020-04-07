
let focusword = []
let actual = 0;
fetch('https://jsonblob.com/api/jsonBlob/30ae5e51-75b7-11ea-9538-21f393c40628') //https://api.myjson.com/bins/a3l3w')
    .then(response => response.json())
    .then(function (json) {

        const matches = json['matches'];
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
        let results = '<h3 class="center">Definiciones</h3><div class="row"><div class="col-sm"><ol>';
        let maxlen = 0
        let elems = Object.keys(matches).length;
        console.log(typeof (matches))
        Object.entries(matches).forEach(([key, value], index) => {
            results += `
                <li>
                ${value}
                </li>       
                `
            if (index == (elems / 2) - 1) {
                results += `</ol></div> <div class="col-sm"><ol start=${index + 2}> `;
            }
            if (key.length > maxlen) {
                maxlen = key.length
            }
        });
        results += `</ol></div></div>
        <button class="btn-check btn" id="option-btn-check" >Verificar palabra</button>
        <button class="btn-check btn" id="option-btn-reveal" >Revelar</button>
        <button class="btn-check btn" id="option-btn-clear" >Limpiar este</button>
        <button class="btn-check btn" id="option-btn-end" >Terminar juego</button>`;
        buildBoard(parseInt(maxlen * (3 / 2)), Object.keys(matches), results)
        document.querySelector("#loader").style.display = "none";
        $(".letters").focus(function () {
            if (focusword) {
                console.log($(this).data());
                console.log(focusword[0]);
                if (focusword.findIndex(element => element.dataset.row == $(this).data('row') && element.dataset.column == $(this).data('column')) == -1) {
                    document.querySelectorAll('input[data-number^="' + actual + '-"]').forEach((item) => { focusword.push(item); item.style.backgroundColor = "white" });
                    document.querySelectorAll('input[data-number$="-' + actual + '"]').forEach((item) => { focusword.push(item); item.style.backgroundColor = "white" });
                    document.querySelectorAll('input[data-number="' + actual + '"]').forEach((item) => { focusword.push(item); item.style.backgroundColor = "white" });
                    actual = 0;
                }
            }
            if (actual == 0) {
                var $input = $(this).data()
                focusword = [];
                $input = $input["number"].length > 1 ? $input["number"].split("-").shift() : $input["number"];
                actual = $input;
                document.querySelectorAll('input[data-number^="' + $input + '-"]').forEach((item) => { focusword.push(item); item.style.backgroundColor = "#FF9933" });
                document.querySelectorAll('input[data-number$="-' + $input + '"]').forEach((item) => { focusword.push(item); item.style.backgroundColor = "#FF9933" });
                document.querySelectorAll('input[data-number="' + $input + '"]').forEach((item) => { focusword.push(item); item.style.backgroundColor = "#FF9933" });
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
                        neighbor.focus();
                    }
                }
            }
            });
    });

function clearboard(board,size){
    for (var i = 0; i < size; i++) {
        var cont = 0;
        for (var j = 0; j < size; j++) {
            if(board[i][j]=='0'){
                cont++;
            }
        }
        if(cont==size){
            board.splice(i);
        }
    }
    console.log
    return board[0].length;
}

var wordCount = {}
function buildBoard(size, values, def1) {
    var board = generateCrossWords(size, values.slice());
    console.log(board)
    while (board == undefined) {
        board = generateCrossWords(size, values.slice());
    }
    var result = '<div class="wrapper" style="grid-template-columns: repeat(' + size + ', 1fr);">';
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
                    <span class="question_number"><small>${board[i][j].includes("*") ? board[i][j].split("*").shift() : ''}</small></span>
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
    result += '</div>'
    document.getElementById('result').innerHTML = result;
    document.getElementById('definitions').innerHTML = def1;
    buttons = document.querySelectorAll('button[id*="option"]')
    for (const button of buttons) {
        button.addEventListener('click', optionButtons)
    }
}

function optionButtons(e) {
    console.log('Hola bb', e.target.id);
    let writeword = ''
    switch (e.target.id) {
        case 'option-btn-check':
            wordCount[actual].forEach(function (coordinate) {
                box = focusword.find(element => element.dataset.row == coordinate[0] && element.dataset.column == coordinate[1]);
                writeword += box.value;
            });
            console.log(writeword);
            //postserver
            break;
        case 'option-btn-clear':
            focusword.forEach(function (box) {
                console.log(box);
                box.value = "";
            });
            break;
        case 'option-btn-end':
            clearTimeout(intervalID);
            postToServer();
            break;
        case 'option-btn-reveal':
            //postToServer
            console.log(focusword[0].dataset.number.split('*').shift().split('-').shift());
            conta = 0;
            wordCount[actual].forEach(function (coordinate) {
                box = focusword.find(element => element.dataset.row == coordinate[0] && element.dataset.column == coordinate[1]);
                box.value = conta;
                conta++;
            });
            console.log(writeword);
            break;
        default:
            console.log('ERROR : ' + expr + '.');
    }
}

function generateCrossWords(size, values) {
    var board = Array(size).fill('0').map((x) => Array(size).fill('0'));
    var visited = Array(size).fill('0').map((x) => Array(size).fill(false));
    var words = values.sort(function (a, b) {
        if (a.length > b.length) {
            return 1;
        }
        if (a.length < b.length) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });
    num_words = words.length
    orientation = Math.round(Math.random());
    start = false;
    actualword = words.pop();
    wloc = {};
    wordO = {
        0: [], //Horizontal
        1: [] //Vertical
    }
    while (words.length > 0) {
        orientation = (orientation == 0) ? 1 : 0;
        if (!start) {
            wordO[orientation].push(actualword);
            row = (orientation == 0) ? Math.floor(Math.random() * (size / 2 - 4)) + 4 : 0;
            column = (orientation == 1) ? Math.floor(Math.random() * (size / 2 - 4)) + 4 : 0;
            let ind = num_words - words.length + '';
            for (var i = 0; i < actualword.length; i++) {
                if (orientation == 1) {
                    board[i][column] = i == 0 ? ind + '*' : ind + '';
                    visited[i][column] = true;
                } else {
                    board[row][i] = i == 0 ? ind + '*' : ind + '';
                    visited[row][i] = true;
                }
            }
            wloc[actualword] = [row, column, orientation];
            start = true;
        } else {
            ppair = findPair(wordO[(orientation == 0) ? 1 : 0], actualword, wloc, visited, size);
            if (ppair.length == 0) {
                return undefined;
            }
            select = Math.ceil(Math.random() * (ppair.length - 1));
            row = ppair[select][0];
            column = ppair[select][1];
            for (var i = 0; i < actualword.length; i++) {
                let ind = num_words - words.length + '';
                if (i == 0) {
                    ind += '*';
                }
                if (orientation == 1) {
                    board[row + i][column] = board[row + i][column] != '0' ? board[row + i][column] + '-' + ind : ind;
                    visited[row + i][column] = true;
                } else {
                    board[row][column + i] = board[row][column + i] != '0' ? board[row][column + i] + '-' + ind : ind;
                    visited[row][column + i] = true;
                }
            }
            wloc[actualword] = [row, column, orientation];
            wordO[orientation].push(actualword);

        }
        actualword = words.pop();
    }
    return board
}

function findPair(wo, actual, loc, v, n) {
    pair = [];
    wo.forEach((word) => {
        for (var j = 1; j < actual.length; j++) {
            for (var i = 0; i < word.length; i++) {
                if (word.substring(i, i + 1) == actual.substring(j, j + 1)) {
                    o = loc[word][2];
                    rc = loc[word][(o == 1) ? 1 : 0];
                    cr = loc[word][(o == 1) ? 0 : 1];
                    if (j < rc && (rc + actual.length - (j + 1)) < n) {
                        let available = true;
                        for (var k = rc - j; k <= (rc + actual.length - (j + 1)); k++) {
                            if (rc != k && available) {
                                if (o == 0) {
                                    if (cr + i >= n || k >= n) {
                                        available = false;
                                    } else {
                                        console.log(v)
                                        console.log(k)
                                        if (v[k][cr + i]) {
                                            available = false;
                                        }
                                    }
                                } else {
                                    if (v[cr + i][k]) {
                                        available = false;
                                    }
                                }
                            }
                        }
                        if (available) {
                            row = (o == 0) ? rc - j : cr + i;
                            column = (o == 1) ? rc - j : cr + i;
                            pair.push([row, column, o])
                        }
                    }
                }
            }
        }
    });
    return pair;
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


function postToServer() {
    document.querySelector("#content").style.display = "none";
    document.querySelector("#loader").style.display = "block";
}