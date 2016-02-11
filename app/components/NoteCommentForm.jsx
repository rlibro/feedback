import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

export default class NoteCommentForm extends Component {

  constructor(props){
    super(props)

    this.state = {
      commentText: ''
    }
  }

  renderLogin = () => {
    return <div className="NoteCommentForm"> 
      if you leave a comment, please <a href="#" onClick={this.handleFacebookLogin}><i className="fa fa-facebook" />  login with facebook</a>
    </div>
  };

  renderCommentReady = () => {
    return <div>
      <input className="text" 
        type="text" 
        placeholder="댓글을 입력하세요." 
        autoFocus={true}
        ref="cmtxt"
        onKeyPress={this.handleCheckEnter} />
      <button className="send" 
        onClick={this.handleSendComment}>입력</button>
    </div>
  };

  renderCommentRequesting = () => {

    return <div>
      <input className="text" type="text" disabled
        value={this.state.commentText}/>
      <div className="send">
        <i className="fa fa-spinner fa-pulse"></i>
      </div>
    </div>

  };

  renderCommentByState = (stateComment) => {

    if( stateComment === 'READY') {
      return this.renderCommentReady();
    } 

    if (stateComment === 'REQUESTING') {
      return this.renderCommentRequesting();
    }

  };


  renderForm = (stateComment) => {
    const { loginUser } = this.props;

    return <div className="NoteCommentForm">
    
      <div className="profile photo">
        <img src={loginUser.picture} />
      </div>
      {this.renderCommentByState(stateComment)}
    </div>

  };

  render() {

    const { loginUser, noteState:{ stateAddComment } } = this.props;

    return loginUser.id ? this.renderForm(stateAddComment) : this.renderLogin();
  }

  handleCheckEnter = (e) => {
    if(e.key === 'Enter') {
      this.handleSendComment(e);
    }
  };

  handleSendComment = (e) => {

    const node = findDOMNode(this.refs.cmtxt);
    const text = node.value;

    if( text.length < 1 ) {
      alert('댓글이 비어 있습니다.');
      node.focus();
    
    } else {

      this.setState({
        commentText: text
      });

      this.props.onAddComment(text);
    }

  };

  handleFacebookLogin = (e) => {
    this.props.onLogin();
    e.preventDefault();
  };
}

NoteCommentForm.propTypes = {
  loginUser: PropTypes.object.isRequired,
  noteState: PropTypes.object.isRequired,
  isOpenComment: PropTypes.bool.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired
}