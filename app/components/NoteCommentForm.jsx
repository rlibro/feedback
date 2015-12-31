import React, { Component, PropTypes } from 'react';

export default class NoteCommentForm extends Component {

  render = () => {
    return <div>
      <form onSubmit={this.handleSubmit}>
        <input type="text" placeholder="댓글을 입력하세요." 
          autoFocus={true}
          onBlur={this.finishEdit} 
          onKeyPress={this.checkEnter} />
        <input type="submit" value="SEND" />
      </form>
    </div>
  }

  handleSubmit = (e) => {
    e.preventDefault()
  }

  checkEnter = (e) => {
    if(e.key === 'Enter') {
      this.finishEdit(e);
    }
  }

  finishEdit = (e) => {
    this.props.onSubmitComment(e.target.value);

    this.setState({
      editing: false
    });
  }

  // renderNote = (note) => {
  //   return (
  //     <li className="note" key={note.id}>
  //       <Note task={note.task} 
  //             onEdit={this.props.onEdit.bind(null, note.id)} 
  //             onDelete={this.props.onDelete.bind(null, note.id)}/>
  //     </li>
  //   );
  // }
}

NoteCommentForm.propTypes = {
  isOpenComment: PropTypes.bool.isRequired,
  onSubmitComment: PropTypes.func.isRequired
}