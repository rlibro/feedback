import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

export default class RedBookNoteForm extends Component {

  renderFormWrite = () => {
    const { loginUser } = this.props;

    return <div className="RedBookNoteForm">
      <div className="note-form-header">
        <button>정보</button>
        <button>사진</button>
        <button>마커</button>
      </div>
  
      <textarea ref="textarea" className="text" autoFocus={true} placeholder="이 도시에서 경험한 유용한 정보를 공유하세요!"></textarea>
        
      <div className="note-form-footer">
        <button onClick={this.handleSubmitNote}>게시</button>
      </div>
    </div>
  };

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
  };

  render() {

    const { loginUser } = this.props;
    return loginUser.id ? this.renderFormWrite() : false;
    
  }

  handleSubmitNote = (e) => {

    const node = findDOMNode(this.refs.textarea);
    const text = node.value.trim();
    this.props.onSubmitNote(text);
    node.value = '';
    e.preventDefault()
  };

}

RedBookNoteForm.propTypes = {
  loginUser: PropTypes.object.isRequired,
  onSubmitNote: PropTypes.func.isRequired
}
