


var score_board = document.getElementsByClassName("score-board")[0]

var queryString = window.location.search
var urlParams = new URLSearchParams(queryString)
var score = parseInt(urlParams.get('score'))


if (score && (typeof score === 'number')) {
    var score_board_pad = String(score).padStart(2, 0)
    score_board.innerText = score_board_pad
}