import React, { Component, PropTypes } from 'react';

export default class RedBookNoteForm extends Component {

  renderFormWrite = () => {
    const { loginUser } = this.props;

    return <div className="RedBookNoteForm">
      <div className="note-form-header">
        <button>정보</button>
        <button>사진</button>
        <button>마커</button>
      </div>
  
      <textarea className="text" autoFocus={true} placeholder="이 도시에서 경험한 유용한 정보를 공유하세요!"></textarea>
        
      <div className="note-form-footer">
        <button>게시</button>
      </div>
    </div>
  }

  renderFormReady = () => {
    const { loginUser } = this.props;

    return <div className="RedBookNoteForm">
      <div className="note-form-header">
        <button>정보</button>
        <button>사진</button>
        <button>마커</button>
      </div>
  
      <textarea className="text" placeholder="이 도시에서 경험한 유용한 정보를 공유하세요!"></textarea>
    </div>
  }

  render() {

    const { loginUser } = this.props;
    return loginUser.id ? this.renderFormWrite() : false;
    
  }

  handleSubmit = (e) => {



    e.preventDefault()
  }

}

RedBookNoteForm.propTypes = {
  loginUser: PropTypes.object.isRequired
}
