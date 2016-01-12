import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Select from 'react-select';


export default class NewRedBookForm extends Component {

  renderFormWrite = () => {

    const { loginUser, newRedBook, onCancelNewRedBook, onCreateNewRedBook } = this.props;

    return <div className="RedBookNoteForm">
      <div className="note-form-header">
        <p className="notice">You are going to be the pioneer of {newRedBook.cityName}</p>
      </div>
  
      <textarea tabIndex="1" ref="textarea" className="text" autoFocus={true} placeholder="Share your useful experiences of this city!">{newRedBook.noteText}</textarea>
        
      <div className="note-form-footer">
        <button tabIndex="3" className="cancel" onClick={onCancelNewRedBook}>Cancel</button>
        <button tabIndex="2" className="create" onClick={this.handleCreateNewRedBook}>Create</button>
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

  handleCreateNewRedBook = (e) => {

    const node = findDOMNode(this.refs.textarea);
    const text = node.value.trim();

    if( text.length < 1 ){
      alert('Please, share your experiences!');
      node.focus();
      return;
    }

    this.props.onCreateNewRedBook(text);
    //node.value = '';
    e.preventDefault()
  };

}

NewRedBookForm.propTypes = {
  loginUser: PropTypes.object.isRequired,
  onCreateNewRedBook: PropTypes.func.isRequired,
  onCancelNewRedBook: PropTypes.func.isRequired
}
