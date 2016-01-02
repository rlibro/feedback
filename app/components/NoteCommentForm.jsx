import React, { Component, PropTypes } from 'react';

export default class NoteCommentForm extends Component {

  renderLogin = () => {
    return <div className="NoteCommentForm"> 
      댓글을 남기시려면 <a href="#" onClick={this.handleFacebookLogin}>페이스북으로 로그인</a> 해주세요!;
    </div>
  }

  renderForm = () => {
    const { loginUser } = this.props;

    return <div className="NoteCommentForm">
    
      <div className="profile photo">
        <img src={loginUser.picture.data.url} />
      </div>
      
      <input className="text" type="text" placeholder="댓글을 입력하세요." 
        autoFocus={true}
        onKeyPress={this.handleCheckEnter} />

      <button className="send">입력</button>
    
    </div>

  }

  render() {

    setTimeout(()=>{
      window.scrollTo(0,document.body.scrollHeight);
    }, 10);

    const { loginUser } = this.props;

    return loginUser.id ? this.renderForm() : this.renderLogin();
  }

  handleCheckEnter = (e) => {
    if(e.key === 'Enter') {
      this.handleFinishEdit(e);
    }
  }

  handleFinishEdit = (e) => {
    this.props.onSubmitComment(e.target.value);
    e.target.value = '';
  }

  handleFacebookLogin = (e) => {
    window.open('/facebook/login', '', 'width=600, height=550');
  }
}

NoteCommentForm.propTypes = {
  loginUser: PropTypes.object.isRequired,
  isOpenComment: PropTypes.bool.isRequired,
  onSubmitComment: PropTypes.func.isRequired
}