document.getElementById("game_board").addEventListener('contextmenu', e => {
    e.preventDefault();
});

$( document ).ready(() => {
    placeMines()
})

var bomb_data = {}

var number_of_tiles = {
    "easy" : 10,
    "medium" : 20,
    "hard" : 25
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
        } else {
            num_bombs = find_num_bombs_in_adjacent_cells(square)
            console.log(num_bombs)
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

var checked_list = []

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
        return [bomb_index - 1, bomb_index - number_of_columns, bomb_index - number_of_columns - 1, bomb_index + number_of_columns, bomb_index - number_of_columns + 1]
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

/*
To do: Set state of game on game off
*/