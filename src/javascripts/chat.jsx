// load the socket.io-client
var socket = io();

// load react and react-dom
var React = require('react');
var {render} = require('react-dom');

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
    var test = 'test';
    var string = `This is a ${test}`;
  }
}

// handle incoming messages
socket.on('chat message', function(msg) {
  $('#js-messages-container').append($('<li>').text(msg));
});

// react test
var App = React.createClass({
  render () {
    return <small className="text-muted">This is React!</small>;
  }
});

render(<App/>, document.getElementById('app'));