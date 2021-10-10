document.getElementById("game_board").addEventListener('contextmenu', e => {
    e.preventDefault();
});

$( document ).ready(() => {
    placeMines()
    get_number_of_tiles()
})

var bomb_data = {}
var checked_list = []
var number_of_tiles = {}


function placeMines() {
    $.ajax({
        type: 'GET',
        url: '/setMines',
        contentType: 'application/json',
        success: function(return_data) {
            bomb_data = return_data
        },
        error: function() {
            alert('error sending data');
        }
    });}

async function get_number_of_tiles() {
    $.ajax({
        type: 'GET',
        url: '/getNumberOfTiles',
        contentType: 'application/json',
        success: function(return_data) {
            number_of_tiles = return_data
        },
        error: function() {
            alert('error sending data');
        }
    })
}

function handleClick(index, event) {
    data = {"index" : index}
    if (event.button == 0) {
       data["button"] = "left"
    } else if (event.button == 2) {
        data["button"] = "right"
    }
    updateSquare(data)
}


function updateSquare(data) {
    var square = data["index"];
    var click_event = data["button"];
    var game_square = $( "#game_square_" + square)

    if (checked_list.includes(square)) {
        return
    }

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
            set_game_off(false)
            game_square.removeClass()
            game_square.addClass("bomb_square")
            showAllBombs(square)
        } else {
            find_num_bombs_in_adjacent_cells(square)
            var game_squares = document.getElementsByClassName("game_square")
            if (game_squares.length == 0) {
                set_game_off(true)
            }
        }
    }
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


function findAllBombs() {
    var bombs = []
    for(key in bomb_data) {
        if (bomb_data[key] == 'bomb') {
            bombs.push(key)
        }
    }
    return bombs
}

function change_image_to_bomb(bomb_index) {
    var game_square = $( "#game_square_" + bomb_index)
    game_square.removeClass()
    game_square.addClass("bomb_square")
}

function find_num_bombs_in_adjacent_cells(bomb_index) {
    if (checked_list.includes(bomb_index)) {
        return
    }
    checked_list.push(bomb_index)
    if (bomb_data[bomb_index] == "bomb") {
        return
    }

    var number_of_columns = find_num_columns()
    var squares_to_check = get_squares_to_check(bomb_index, number_of_columns)
    var squares_to_check = squares_to_check.filter(square => 
        square >= 0 && square <= (number_of_columns * number_of_columns)
    )

    var bombs = 0
    for (let i = 0; i < squares_to_check.length; i++) {
        if (bomb_data[squares_to_check[i]] == "bomb") {
            bombs++
        }
    }
    
    var game_square = $( "#game_square_" + bomb_index)
    if (bombs >= 1) {
        game_square.removeClass()
        game_square.addClass("number_" + bombs + "_square")
    } else {
        game_square.removeClass()
        game_square.addClass("empty_square")
        squares_to_check.forEach(find_num_bombs_in_adjacent_cells)
    }
}

function find_num_columns() {
    var page_title = document.title
    if (page_title.indexOf("Easy") > 0) {
        return number_of_tiles["easy"]
    } else if (page_title.indexOf("Medium") > 0) {
        return number_of_tiles["medium"]
    } else {
        return number_of_tiles["hard"]
    }
}

function get_squares_to_check(bomb_index, number_of_columns) {
    var square_edge_status = check_if_edge(bomb_index, number_of_columns)
    if (square_edge_status == "left_edge") {
        return [bomb_index + 1, bomb_index - number_of_columns, bomb_index - number_of_columns + 1, bomb_index + number_of_columns, bomb_index + number_of_columns + 1]
    }
    if (square_edge_status == "right_edge") {
        return [bomb_index - 1, bomb_index - number_of_columns, bomb_index - number_of_columns - 1, bomb_index + number_of_columns, bomb_index - number_of_columns - 1]
    }
    return squares_to_check = [bomb_index - 1, bomb_index + 1, 
                               bomb_index - number_of_columns, bomb_index - number_of_columns - 1, bomb_index - number_of_columns + 1, 
                               bomb_index + number_of_columns, bomb_index + number_of_columns - 1, bomb_index + number_of_columns + 1]

}

function check_if_edge(bomb_index, number_of_columns) {
    var remainder = bomb_index % number_of_columns
    if (remainder == 0) {
        return "left_edge"
    } else if (remainder == number_of_columns - 1) {
        return "right_edge"
    } else {
        return "no_edge"
    }
}

function set_game_off(is_game_won) {
    document.getElementById("game_board").style.pointerEvents = "none"
        show_pop_up(is_game_won)
}

function show_pop_up(is_game_won) {
    game_message = is_game_won ? "won :)" : "lost :("
    alert(`Game over! You ${game_message}`)
}

/*
To do: Set state of game on game off
To do: Win conditions
*/