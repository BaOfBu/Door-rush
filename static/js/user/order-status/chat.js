var socket = io();
console.log(socket);
var userId = document.getElementById('userId').value;
console.log(userId);
socket.emit('register', userId);

var sendBtn = document.getElementById('sendBtn');
var input = document.getElementById('input');
var receiverId = document.getElementById('merchantId').value;
var sendOrderInfoBtn = document.getElementById('sendOrderInfoBtn');
var orderId = document.getElementById('orderId').value;
var total = document.getElementById('totalPrice').value;

const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

sendBtn.addEventListener('click', function(e) {
    //console.log("hello");
    e.preventDefault();
    var start = new Date();
    console.log("start",start);
    if (input.value) {
        console.log(input.value);
        var date = days[start.getDay()] + " " + start.getDate()
            +' - ' + (start.getMonth()+1) + ' - '+start.getFullYear();
        socket.emit('chat message', {
            to:receiverId,
            message:input.value,
            time: start
        });
        $('#chatPanel').append('<li class="clearfix">' +
        '<div class="message-data text-end">' + '<span class="message-data-name">'+ date +'</span>'+ '</div>'
        + '<div class="message other-message float-right">'+ input.value
        +'</div>' + '</li>');
        input.value = '';
    }
});

socket.on('chat message', function(msg) {
    //console.log(msg);
    if (msg) {
        var newDate = new Date(msg.time);
        var date = days[newDate.getDay()] + " " + newDate.getDate()
            +' - ' + (newDate.getMonth()+1) + ' - '+newDate.getFullYear();
        $('#chatPanel').append('<li class="clearfix">' +
        '<div class="message-data">' + '<span class="message-data-name">'+ date +'</span>'+ '</div>'
        + '<div class="message my-message float-left">'+ msg.message 
        +'</div>' + '</li>');
        window.scrollTo(0, document.body.scrollHeight);
    }
});

sendOrderInfoBtn.addEventListener('click', function(e) {
    //console.log("hello");
    e.preventDefault();
    var start = new Date();
    var message = "Mã đơn hàng: " + orderId + " | Trị giá đơn hàng: " + total;
    var date = days[start.getDay()] + " " + start.getDate()
            +' - ' + (start.getMonth()+1) + ' - '+start.getFullYear();
    socket.emit('chat message', {
        to:receiverId,
        message: message,
        time: start
    });
    $('#chatPanel').append('<li class="clearfix">' +
    '<div class="message-data text-end">' + '<span class="message-data-name">'+ date +'</span>'+ '</div>'
    + '<div class="message other-message float-right">'+ message
    +'</div>' + '</li>');
});