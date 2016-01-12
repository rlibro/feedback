import React, { Component, PropTypes } from 'react';

export default class NoteCommentForm extends Component {

  renderLogin = () => {
    return <div className="NoteCommentForm"> 
      댓글을 남기시려면 
      <a href="#" className="fa fa-facebook" 
        onClick={this.handleFacebookLogin}> 페이스북으로 로그인</a> 해주세요!
    </div>
  };

  renderForm = () => {
    const { loginUser } = this.props;

    return <div className="NoteCommentForm">
    
      <div className="profile photo">
        <img src={loginUser.picture} />
      </div>
      
      <input className="text" 
        type="text" 
        placeholder="댓글을 입력하세요." 
        autoFocus={true}
        onKeyPress={this.handleCheckEnter} />

      <button 
        className="send" 
        onClick={this.handleSendComment}>입력</button>
    
    </div>

  };

  render() {

    const { loginUser } = this.props;

    return loginUser.id ? this.renderForm() : this.renderLogin();
  }

  handleCheckEnter = (e) => {
    if(e.key === 'Enter') {
      this.handleSendComment(e);
    }
  };

  handleSendComment = (e) => {
    this.props.onAddComment(e.target.value);
    e.target.value = '';
  };

  handleFacebookLogin = (e) => {
    this.props.onLogin();
    e.preventDefault();
  };
}

NoteCommentForm.propTypes = {
  loginUser: PropTypes.object.isRequired,
  isOpenComment: PropTypes.bool.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired
}