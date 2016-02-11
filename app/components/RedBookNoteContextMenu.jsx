import React, { Component, PropTypes } from 'react';

export default class RedBookNoteContextMenu extends Component {

  render(){

    let ContextMenu;
    const { isOpenContext, loginUser, noteAuthor } = this.props;

    if( loginUser.id === noteAuthor.id ) {
      ContextMenu = this.renderAuthorContext();
    } else {
      ContextMenu = this.renderUserContext();
    }


    return isOpenContext ? <div className="ContextMenu">
      {ContextMenu}
    </div>: false
  }

  renderUserContext = () => {
    return <ul>
      <li><a className="option" href="#"> 게시물 신고</a></li>
    </ul>;
  };

  renderAuthorContext = () => {
    return <ul>
      <li><a className="option" href="#" onClick={this.handleEditNote}>Edit</a></li>
      <li><a className="option" href="#" onClick={this.handleDeleteNote}>Del</a></li>
    </ul>;
  };

  handleEditNote = (e) => {
    e.preventDefault();

    const { noteState: {isEditing} } = this.props;

    if( isEditing ){
      alert('now you are editing another note.');
      return;
    }

    this.props.onEditNote();
  };

  handleDeleteNote = (e) => {
    e.preventDefault();

    var yes = confirm('Are you sure to delete?');
    if (yes){
      this.props.onDeleteNote();  
    }
  };

}

RedBookNoteContextMenu.propTypes = {
  noteAuthor: PropTypes.object.isRequired,
  noteState: PropTypes.object.isRequired,
  loginUser: PropTypes.object.isRequired,
  isOpenContext: PropTypes.bool.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
  onEditNote: PropTypes.func.isRequired
}
