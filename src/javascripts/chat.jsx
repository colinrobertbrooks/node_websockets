var React = require('react');
var ReactDOM = require('react-dom');

var NameModal = React.createClass({
  propTypes: {
    onModalClose: React.PropTypes.func.isRequired,
    onSubmitUserName: React.PropTypes.func.isRequired
  },
  componentDidMount: function() {
    $('#js-name-modal').modal('show');
    $('#js-name-modal').on('hidden.bs.modal', this.props.onModalClose);
  },
  handleTyping: function(e) {
    if(e.which == 13) {
      this.handleSubmit();
    } else {
      var name = $('#js-name-input').val();
      if(name) {
        $('#js-name-submit')
          .addClass('name-submit-enabled')
          .removeClass('name-submit-disabled');
      } else {
        $('#js-name-submit')
          .addClass('name-submit-disabled')
          .removeClass('name-submit-enabled');
      }
    }
  },
  handleSubmit: function() {
    var name = $('#js-name-input').val();
    if(name) {
      this.props.onSubmitUserName(name);
      $('#js-name-modal').modal('hide');
    }
  },
  render: function() {
    return (
      <div
        className="modal fade"
        data-backdrop="static"
        data-keyboard="false"
        id="js-name-modal"
      >
        <div className="modal-dialog">
          <div className="modal-content text-center">
            <div className="modal-header">
              <h3 className="modal-title">
                Welcome
              </h3>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <input
                  className="form-control"
                  id="js-name-input"
                  placeholder="Type your name to enter the chat..."
                  type="text"
                  onKeyUp={this.handleTyping}
                />
                <span
                  className="input-group-addon name-submit-disabled"
                  id="js-name-submit"
                  title="Submit name"
                  onClick={this.handleSubmit}
                >
                  Submit
                </span>
              </div>
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    );
  }
});

var Message = React.createClass({
  propTypes: {
    message: React.PropTypes.object.isRequired
  },
  render: function() {
    return <li><b>{this.props.message.name}:</b> {this.props.message.text}</li>;
  }
});

var MessageWindow = React.createClass({
  propTypes: {
    messages: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  componentDidUpdate: function() {
    $('.message-window').scrollTop($('.message-window')[0].scrollHeight);
  },
  render: function() {
    return (
      <ul
        className="list-unstyled message-window"
        id="js-messages-container"
      >
        {this.props.messages.map(function(message, i) {
          return (
            <Message
              key={i}
              message={message}
            />
          );
        })}
      </ul>
    );
  }
});

var MessageInput = React.createClass({
  propTypes: {
    onOutgoingMessage: React.PropTypes.func.isRequired
  },
  handleTyping: function(e) {
    if(e.which == 13) {
      this.handleSubmit();
    } else {
      var text = $('#js-message-input').val();
      if(text) {
        $('#js-message-submit')
          .addClass('message-submit-enabled')
          .removeClass('message-submit-disabled');
      } else {
        $('#js-message-submit')
          .addClass('message-submit-disabled')
          .removeClass('message-submit-enabled');
      }
    }
  },
  handleSubmit: function() {
    var text = $('#js-message-input').val();
    if(text) {
      $('#js-message-input').val('');
      $('#js-message-submit')
          .addClass('message-submit-disabled')
          .removeClass('message-submit-enabled');
      this.props.onOutgoingMessage(text);
    }
  },
  render: function() {
    return (
      <div className="input-group">
        <input
          className="form-control message-input"
          id="js-message-input"
          placeholder="Type your chat message here..."
          type="text"
          onKeyUp={this.handleTyping}
        />
        <span
          className="input-group-addon message-submit message-submit-disabled"
          id="js-message-submit"
          title="Send message"
          onClick={this.handleSubmit}
        >
          <i className="fa fa-comment"></i>
        </span>
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      messages: [],
      modalVisible: true,
      name: null,
      socket: io()
    };
  },
  componentDidMount: function() {
    this.state.socket.on('chat message', this.handleIncomingMessage);
    window.onbeforeunload = this.handleUserLeave;
  },
  _handleModalVisibility: function(boolean) {
    this.setState({
      modalVisible: boolean
    });
  },
  _handleUserJoin: function(name) {
    this.setState({
      name: name
    });
    this.state.socket.emit('chat message', {
      name: 'System',
      text: name + ' has joined the chat.'
    });
  },
  handleUserLeave: function() {
    this.state.socket.emit('chat message', {
      name: 'System',
      text: this.state.name + ' has left the chat.'
    });
  },
  handleIncomingMessage: function(message) {
    var messages = this.state.messages;
    messages.push(message);
    this.setState({
      messages: messages
    });
  },
  _handleOutgoingMessage: function(text) {
    this.state.socket.emit('chat message', {
      name: this.state.name,
      text: text
    });
  },
  render: function() {
    return (
      <div className="container">
        <div className="row text-center">
          <h1>Chat</h1>
        </div>
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <MessageWindow
              messages={this.state.messages}
            />
            <MessageInput
              onOutgoingMessage={this._handleOutgoingMessage}
            />
          </div>
          <div className="col-md-3"></div>
        </div>
        {this.state.modalVisible ?
          <NameModal
            onSubmitUserName={this._handleUserJoin}
            onModalClose={function() {this._handleModalVisibility(false)}.bind(this)}
          />
        : null}
      </div>
    );
  }
});

ReactDOM.render(<App/>, document.getElementById('app'));
