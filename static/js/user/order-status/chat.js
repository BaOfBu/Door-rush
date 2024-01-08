var socket = io();
console.log(socket);
var userId = document.getElementById('userId').value;
console.log(userId);
socket.emit('register', userId);

var sendBtn = document.getElementById('sendBtn');
var input = document.getElementById('input');
var receiverId = document.getElementById('merchantId').value;
console.log(receiverId);
sendBtn.addEventListener('click', function(e) {
    //console.log("hello");
    e.preventDefault();
    if (input.value) {
        console.log(input.value);
        socket.emit('chat message', {
            to:receiverId,
            message:input.value
        });
        $('#chatPanel').append('<li class="clearfix">' + '<div class="message other-message float-right">'+ input.value +'</div>' + '</li>');
        input.value = '';
    }
});

socket.on('chat message', function(msg) {
    //console.log(msg);
    if (msg) {
        $('#chatPanel').append('<li class="clearfix">' + '<div class="message my-message float-left">'+ msg.message +'</div>' + '</li>');
        window.scrollTo(0, document.body.scrollHeight);
    }
});

$('#conversationList li').attr('id', function(i) {
    return 'conver'+(i+1);
});

$('#conversationList>li').addEventListener('click', function(e) {
    console.log("hello");
});