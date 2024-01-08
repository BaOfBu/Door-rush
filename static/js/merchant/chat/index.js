function run(){
    var socket = io();
    //console.log(socket);
    var merchantId = document.getElementById('merchantId').value;
    console.log("user duoc register",merchantId);
    socket.emit('register', merchantId);

    var sendBtn = document.getElementById('sendBtn');
    var input = document.getElementById('input');
    var receiverId = document.getElementById('receiverId').value;

    console.log("receiverId từ jquery",receiverId);

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
        console.log("socket merchant nhận",msg);
        if (msg) {
            // console.log(msg);
            // console.log(msg.username);
            // console.log(receiverId);
            // if(msg.username == receiverId){
                $('#chatPanel').append('<li class="clearfix">' + '<div class="message my-message float-left">'+ msg.message +'</div>' + '</li>');
                window.scrollTo(0, document.body.scrollHeight);
            //}
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
}

$(document).ready(function(){
    run();
});