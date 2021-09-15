document.getElementById("game_board").addEventListener('contextmenu', e => {
    e.preventDefault();
});

$( document ).ready(() => {
    placeMines()
})

var bomb_data = {}


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
            bomb_data = return_data
            console.log(bomb_data)
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

    if (click_event == "left" && !game_square.hasClass("flag_square")) {
        if (bomb_data[square] == "bomb") {
            game_square.removeClass()
            game_square.addClass("bomb_square")
            showAllBombs(square)
        }
    }
}

function findAllBombs() {
    var bombs = []
    for(key in bomb_data) {
        if (bomb_data[key] == 'bomb') {
            bombs.push(key)
        }
    }
    return bombs
}

async function showAllBombs(current_square) {
    var bomb_data = findAllBombs()
    
    var current_bomb_index_in_list = bomb_data.indexOf(String(current_square))
    bomb_data.splice(current_bomb_index_in_list, 1)

    num_bombs = bomb_data.length
    while (num_bombs > 0) {
        var sleep_time = Math.random() * 1
        await new Promise(r => setTimeout(r, sleep_time * 1000))

        var random_bomb_index = Math.floor(Math.random() * num_bombs)
        bomb_position = bomb_data[random_bomb_index]
        change_image_to_bomb(bomb_position)

        bomb_data.splice(random_bomb_index, 1)
        num_bombs = bomb_data.length
    }
}

function change_image_to_bomb(bomb_index) {
    var game_square = $( "#game_square_" + bomb_index)
    game_square.removeClass()
    game_square.addClass("bomb_square")
}