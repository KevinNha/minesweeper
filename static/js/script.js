document.getElementById("game_board").addEventListener('contextmenu', e => {
    e.preventDefault();
});

$( document ).ready(() => {
    placeMines()
})

function handleClick(index, event) {
    data = {"index" : index}
    if (event.button == 0) {
       data["button"] = "left"
    } else if (event.button == 2) {
        data["button"] = "right"
    }
    updateSquare(data)
}

function placeMines() {
    $.ajax({
        type: 'GET',
        url: '/setMines',
        contentType: 'application/json',
        success: function(return_data) {
            console.log(return_data)
        },
        error: function() {
            alert('error sending data');
        }
    });}

function updateSquare(data) {
    var square = data["index"];
    var click_event = data["button"];
    var game_square = $( "#game_square_" + square)

    if (click_event == "right") {
        if (game_square.hasClass("game_square")) {
            game_square.removeClass()
            game_square.addClass("flag_square")
        } else {
            game_square.removeClass()
            game_square.addClass("game_square")
        }
    }
}