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
      <li>이 사람 팔로우</li>
      <li>게시물 신고</li>
    </ul>;
  };

  renderAuthorContext = () => {
    return <ul>
      <li><a className="option" href="#" onClick={this.props.onEditNote}>수정</a></li>
      <li><a className="option" href="#" onClick={this.props.onDeleteNote}>삭제</a></li>
    </ul>;
  };

}

RedBookNoteContextMenu.propTypes = {
  noteAuthor: PropTypes.object.isRequired,
  loginUser: PropTypes.object.isRequired,
  isOpenContext: PropTypes.bool.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
  onEditNote: PropTypes.func.isRequired
}
