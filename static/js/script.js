document.getElementById("game_board").addEventListener('contextmenu', e => {
    e.preventDefault();
});

function handleClick(index, event) {
    data = {"index" : index}
    if (event.button == 0) {
       data["button"] = "left"
    } else if (event.button == 2) {
        data["button"] = "right"
    }
    sendPost(data)
}

function sendPost(data) {
    $.ajax({
        type: 'POST',
        url: '/postMoveData',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(return_data) {
            console.log(return_data)
        },
        error: function() {
            alert('error sending data');
        }
    });
}