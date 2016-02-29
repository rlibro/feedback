import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

export default class NewRedBookForm extends Component {


  render() {

    const { loginUser } = this.props;
    return loginUser.id ? this.renderFormWrite() : false;
    
  }

  renderFormWrite = () => {

    const { loginUser, newRedBook, onCancelNewRedBook, onCreateNewRedBook } = this.props;

    return <div className="RedBookNoteForm">
      <div className="note-form-header">
        <p className="notice">You are the first!</p>
      </div>
  
      <textarea tabIndex="1" ref="textarea" className="text" autoFocus={true} placeholder="Share your useful experiences of this city!">{newRedBook.noteText}</textarea>
        
      {this.renderButtons()}
    </div>
  };

  renderButtons = () => {
    const { redBookState: { isFetching } } = this.props;

    if( isFetching.addRedBook === 'READY' ) {

      return <div className="note-form-footer">
        <button tabIndex="3" className="cancel" onClick={this.props.onCancelNewRedBook}>Cancel</button>
        <button tabIndex="2" className="create" onClick={this.handleCreateNewRedBook}>Create</button>
      </div>
    } 

    if( isFetching.addRedBook === 'REQUESTING') {

      return <div className="note-form-footer">
        <button disabled className="cancel">Cancel</button>
        <button disabled className="create"><i className="fa fa-spinner fa-pulse"></i></button>
      </div>

    }
  };

  handleCreateNewRedBook = (e) => {

    const node = findDOMNode(this.refs.textarea);
    const text = node.value.trim();

    if( text.length < 1 ){
      alert('Please, share your experiences!');
      node.focus();
      return;
    }

    this.props.onCreateNewRedBook(text);
    e.preventDefault()
  };

}

NewRedBookForm.propTypes = {
  loginUser: PropTypes.object.isRequired,
  redBookState: PropTypes.object.isRequired,
  onCreateNewRedBook: PropTypes.func.isRequired,
  onCancelNewRedBook: PropTypes.func.isRequired
}
