document.getElementById("game_board").addEventListener('contextmenu', e => {
    e.preventDefault();
  });

function handleClick(index, event) {
    if (event.button == 0) {
        console.log("left clicked button " + index);
    } else if (event.button == 2) {
        console.log("right clicked button " + index);
    }
    
}