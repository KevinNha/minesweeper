from random import randint

NUMBER_OF_TILES = {
    "easy" : 10,
    "medium" : 20,
    "hard" : 25
}

NUM_MINES = {
    "easy": 14,
    "medium":54,
    "hard": 100
}

def get_square(num): 
    return num * num

TOTAL_NUM_SQUARES = {
    "easy": get_square(NUMBER_OF_TILES["easy"]),
    "medium": get_square(NUMBER_OF_TILES["medium"]),
    "hard": get_square(NUMBER_OF_TILES["hard"])
}

def get_mine_positions(difficulty: str):
    mine_count = NUM_MINES.get(difficulty)
    mines = {}
    
    while len(mines) < mine_count:
        num_to_add = randint(0, TOTAL_NUM_SQUARES.get(difficulty))
        if num_to_add not in mines:
            mines[num_to_add] = "bomb"
    return mines
