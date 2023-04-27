var socket = io();
var messages = document.getElementById('messages');
var user_count = document.getElementById('user_count');
var notify = document.querySelector(".notification");

function sendMessage(user, color) {
    event.preventDefault();
    var message = event.target.querySelector('#message');
    socket.emit('chat message', {
        msg: message.value,
        sender: user,
        color: color
    });
    message.value = '';
}

socket.on('chat message', ({msg, sender, color}) => {
    if (msg !== undefined && sender !== undefined && color !== undefined) {
        messages.insertAdjacentHTML('beforeend', `<li><strong style="color: ${color}">${sender}:</strong> ${msg}</li>`);
        window.scrollTo(0, document.body.scrollHeight);
    }
});

socket.on('user connected', (message) => {
    if (message !== undefined)
    messages.insertAdjacentHTML('beforeend', `<li><strong>${message}</strong></li>`);
});

socket.on('update user count', (count) => {
    user_count.textContent = count;
});

(function() {
    notify.classList.remove('hide');
    notify.classList.add('animate__bounceIn');
    setTimeout(() => {
        notify.classList.remove('animate__bounceIn');
        notify.classList.add('animate__fadeOut');
    }, 2000);
}());