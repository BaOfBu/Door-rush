const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

function run(){
    var socket = io();
    //console.log(socket);
    var merchantId = document.getElementById('merchantId').value;
    console.log("user duoc register",merchantId);
    socket.emit('register', merchantId);

    var sendBtn = document.getElementById('sendBtn');
    var input = document.getElementById('input');
    var receiverId = document.getElementById('receiverId').value;
    //var conversationId = document.getElementById('conversationId').value;

    console.log("receiverId từ jquery",receiverId);

    sendBtn.addEventListener('click', function(e) {
        //console.log("hello");
        e.preventDefault();
        var start = new Date();
        var date = days[start.getDay()] + " " + start.getDate()
            +' - ' + (start.getMonth()+1) + ' - '+start.getFullYear();
        console.log("start",start);     
        if (input.value) {
            console.log(input.value);
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
        console.log("socket merchant nhận",msg);
        if (msg) {
            // console.log(msg);
            // console.log(msg.username);
            // console.log(receiverId);
            var newDate = new Date(msg.time);
            var date = days[newDate.getDay()] + " " + newDate.getDate()
            +' - ' + (newDate.getMonth()+1) + ' - '+newDate.getFullYear();
            if(msg.username == receiverId){
                $('#chatPanel').append('<li class="clearfix">' +
                '<div class="message-data">' + '<span class="message-data-name">'+ date +'</span>'+ '</div>'
                + '<div class="message my-message float-left">'+ msg.message 
                +'</div>' + '</li>');
                window.scrollTo(0, document.body.scrollHeight);
            }
        }
    });

    $('#conversationList li').attr('id', function(i) {
        return 'conver'+(i+1);
    });
    $('#conversationList li input').attr('id', function(i) {
        return 'userID'+(i+1);
    });

    $('#conversationList>li').on('click', function(e) {
        socket.emit('register', merchantId);
        const id = $(this).find('input');
        console.log(id.val());
        $('#getHistory').find('input').val(id.val());
        $('#getHistory').trigger('submit');
    });

    // $('#conversationList li').addClass('active', function() {
    //     var id = $(this).find('input').val();
    //     if(id == conversationId){
    //         return true;
    //     }
    //     return false;
    // });

    $('#conversationList li').filter(function() {
        var id = $(this).find('input').val();
        if(id == receiverId){
            return true;
        }
        return false;
    }).addClass('active');
}

$(document).ready(function(){
    run();
});