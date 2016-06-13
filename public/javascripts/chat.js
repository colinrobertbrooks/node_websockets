// load the socket.io-client
var socket = io();

// handle outgoing messages
$('#js-message-submit-btn').on('click', function(){
  handleOutgoingMessage();
});

$('#js-message-input').keypress(function(e) {
  if(e.which == 13) {
    handleOutgoingMessage();
  }
});

function handleOutgoingMessage() {
  var messageText = $('#js-message-input').val();
  if(messageText) {
    socket.emit('chat message', messageText);
    $('#js-message-input').val('');
  }
}

// handle incoming messages
socket.on('chat message', function(msg){
  $('#js-messages-container').append($('<li>').text(msg));
});
