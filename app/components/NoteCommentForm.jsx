import React, { Component, PropTypes } from 'react';

export default class NoteCommentForm extends Component {

  constructor(props){
    super(props)

    this.state = {
      commentText: ''
    }
  }

  renderLogin = () => {
    return <div className="NoteCommentForm"> 
      댓글을 남기시려면 
      <a href="#" className="fa fa-facebook" 
        onClick={this.handleFacebookLogin}> 페이스북으로 로그인</a> 해주세요!
    </div>
  };

  renderCommentReady = () => {
    return <div>
      <input className="text" 
        type="text" 
        placeholder="댓글을 입력하세요." 
        autoFocus={true}
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

    const { loginUser, pageForRedBook:{ stateAddComment } } = this.props;

    return loginUser.id ? this.renderForm(stateAddComment) : this.renderLogin();
  }

  handleCheckEnter = (e) => {
    if(e.key === 'Enter') {
      this.handleSendComment(e);
    }
  };

  handleSendComment = (e) => {
    this.setState({
      commentText: e.target.value
    });

    this.props.onAddComment(e.target.value);
  };

  handleFacebookLogin = (e) => {
    this.props.onLogin();
    e.preventDefault();
  };
}

NoteCommentForm.propTypes = {
  loginUser: PropTypes.object.isRequired,
  pageForRedBook: PropTypes.object.isRequired,
  isOpenComment: PropTypes.bool.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired
}