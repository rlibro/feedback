import React, { Component, PropTypes } from 'react';

export default class NoteCommentForm extends Component {

  render = () => {
    const { loginUser } = this.props;

    return <div className="NoteCommentForm">
    
      <div className="profile photo">
        <img src={loginUser.picture.data.url} />
      </div>
      
      <input className="text" type="text" placeholder="댓글을 입력하세요." 
        autoFocus={true}
        onKeyPress={this.checkEnter} />
    
    </div>
  }

  checkEnter = (e) => {
    if(e.key === 'Enter') {
      this.finishEdit(e);
    }
  }

  finishEdit = (e) => {
    this.props.onSubmitComment(e.target.value);

    e.target.value = '';
  }
}

NoteCommentForm.propTypes = {
  loginUser: PropTypes.object.isRequired,
  isOpenComment: PropTypes.bool.isRequired,
  onSubmitComment: PropTypes.func.isRequired
}