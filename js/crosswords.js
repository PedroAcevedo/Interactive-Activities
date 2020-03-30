

fetch('https://api.myjson.com/bins/a3l3w')
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
        let results = '<ol>';
        let maxlen = 0
        console.log(typeof (matches))
        Object.entries(matches).forEach(([key, value], index) => {
            results += `
        <li>
          ${value}
        </li>       
  `
            if (key.length > maxlen) {
                maxlen = key.length
            }
        });
        console.log(maxlen);
        results += '</ol>';
        buildBoard(parseInt(maxlen * (3 / 2)), Object.keys(matches), results)
        document.querySelector("#loader").style.display = "none";
    });

function buildBoard(size, values, def) {
    var board = generateCrossWords(size, values.slice());
    console.log(board)
    while (board == undefined) {
        board = generateCrossWords(size, values.slice());
    }
    var result = '<div class="wrapper" style="grid-template-columns: repeat(' + size + ', 1fr);">';
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (board[i][j] != '0') {
                result += `
                    <div>
                    <p><small>${board[i][j]}</small></p>
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
    document.getElementById('definitions').innerHTML = def;
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
            for (var i = 0; i < actualword.length; i++) {
                if (orientation == 1) {
                    if (i == 0) {
                        board[i][column] = "1";
                    } else {
                        board[i][column] = "";
                    }
                    visited[i][column] = true;
                } else {
                    if (i == 0) {
                        board[row][i] = "1";
                    } else {
                        board[row][i] = "";
                    }
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
            console.log(row + ' - ' + column);
            for (var i = 0; i < actualword.length; i++) {
                if (orientation == 1) {
                    if (i == 0) {
                        board[row + i][column] = num_words - words.length + '';
                    } else {
                        board[row + i][column] = '';
                    }
                    visited[row + i][column] = true;
                } else {
                    if (i == 0) {
                        board[row][column + i] = num_words - words.length + '';
                    } else {
                        board[row][column + i] = '';
                    }
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
        for (var j = 0; j < actual.length; j++) {
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
