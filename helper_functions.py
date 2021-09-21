from random import randint
num_mines = {
    "easy": 14,
    "medium":54,
    "hard": 144
}

total_num_squares = {
    "easy": 100,
    "medium": 400,
    "hard": 25 * 25
}

def get_mine_positions(difficulty: str):
    mine_count = num_mines.get(difficulty)
    mines = {}
    
    while len(mines) < mine_count:
        num_to_add = randint(0, total_num_squares.get(difficulty))
        if num_to_add not in mines:
            mines[num_to_add] = "bomb"
    return mines
