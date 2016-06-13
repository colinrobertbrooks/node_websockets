/*
  TODO:
  - validate proptypes
  - style message windows, buttons
  - alert user joined/left
  - show users connected
  - indicate user is typing
*/

var React = require('react');
var {render} = require('react-dom');

const NameModal = React.createClass({
  propTypes: {
    onModalClose: React.PropTypes.func.isRequired
  },
  componentDidMount: function() {
    $('#js-name-modal').modal('show');
    $('#js-name-modal').on('hidden.bs.modal', this.props.onModalClose);
  },
  handleSubmit: function() {
    var name = $('#js-name-input').val();
    if(name) {
      $('#js-name-input').val('');
      this.props.onSubmitUserName(name);
      $('#js-name-modal').modal('hide');
    }
  },
  handleEnterKey: function(e) {
    if(e.which == 13) {
      this.handleSubmit();
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
                  placeholder="Type your name to enter chat..."
                  type="text"
                  onKeyUp={this.handleEnterKey}
                />
                <span
                  className="input-group-addon"
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
  render: function() {
    var {message} = this.props;
    return <li><b>{message.name}:</b> {message.text}</li>;
  }
});

var MessageWindow = React.createClass({
  render: function() {
    var {messages} = this.props;
    return (
      <ul
        className="list-unstyled"
        id="js-messages-container"
      >
        {messages.map(function(message, i) {
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
  handleSubmit: function() {
    var text = $('#js-message-input').val();
    if(text) {
      $('#js-message-input').val('');
      this.props.onOutgoingMessage(text);
    }
  },
  handleEnterKey: function(e) {
    if(e.which == 13) {
      this.handleSubmit();
    }
  },
  render: function() {
    var {onOutgoingMessage} = this.props;
    return (
      <div className="input-group">
        <input
          className="form-control"
          id="js-message-input"
          placeholder="Type your message here..."
          type="text"
          onKeyUp={this.handleEnterKey}
        />
        <span
          className="input-group-addon"
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
    var {socket} = this.state;
    socket.on('chat message', this.handleIncomingMessage);
  },
  _handleModalVisibility: function(boolean) {
    this.setState({
      modalVisible: boolean
    });
  },
  _handleSubmitUserName: function(name) {
    this.setState({ name });
  },
  handleIncomingMessage: function(message) {
    var {messages} = this.state;
    messages.push(message);
    this.setState({ messages });
  },
  _handleOutgoingMessage(text) {
    var {messages, name, socket} = this.state;
    var message = {
      name: name,
      text: text
    };
    socket.emit('chat message', message);
  },
  render: function() {
    var {messages, modalVisible, name} = this.state;
    return (
      <div className="container">
        <div className="row text-center">
          <h1>Chat</h1>
        </div>
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <MessageWindow
              messages={messages}
            />
            <MessageInput
              onOutgoingMessage={this._handleOutgoingMessage}
            />
          </div>
          <div className="col-md-2"></div>
        </div>
        {modalVisible ?
          <NameModal
            onSubmitUserName={this._handleSubmitUserName}
            onModalClose={() => {this._handleModalVisibility(false)}}
          />
        : null}
      </div>
    );
  }
});

render(<App/>, document.getElementById('app'));
