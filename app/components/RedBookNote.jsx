import React, { Component, PropTypes } from 'react';
import NoteCommentList from '../components/NoteCommentList'
import ContextMenu from '../components/RedBookNoteContextMenu'
import moment from 'moment'

import { Provider } from 'react-redux'

export default class RedBookNote extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isOpenContext: false,
      isOpenComment: false
    }
  }

  render() {

    const { loginUser, pageForRedBook, note} = this.props;
    const { onLogin, onAddComment, onDeleteNote, onDeleteComment} = this.props;
    const { isOpenComment, isOpenContext } = this.state;

    const contentText = 
      note.content
        .replace(/(.*)\n(.*)/g, '<p>$1<br/></p><p>$2</p>')
        .replace(/\s/g, '<span></span>')

    return <div className="RedBookNote">
      <div className="note-header">
        <div className="profile photo" >
          <img src={note.author.picture} />
        </div>
        <div className="meta">
          <div className="date">{ moment(note.createdAt).format('LLL') }</div>
          <div className="username">{ note.author.username }</div>
        </div>
        <div className="options">
          <button><i className="fa fa-angle-down" onClick={this.handleOpenContext} /></button>
          <ContextMenu 
            loginUser={loginUser}
            noteAuthor={note.author}
            onDeleteNote={onDeleteNote.bind(null, note.id)}
            isOpenContext={isOpenContext} />
        </div>
      </div>
      <div className="content" dangerouslySetInnerHTML={{__html: contentText}}></div>
      <div className="controls">
        <div className="like">좋아요</div>
        <div className="dislike">싫어요</div>
        <div className="save">담기</div>
        <div className="comments" onClick={this.handleOpenComment}>댓글({note.comments.length})</div>
      </div>

      <NoteCommentList 
        loginUser={loginUser}
        comments={note.comments || []} 
        pageForRedBook={pageForRedBook}
        onLogin={onLogin}
        isOpenComment={isOpenComment}
        onAddComment={onAddComment.bind(null, note.id)} 
        onDeleteComment={onDeleteComment.bind(null, note.id)}
        />
    </div>
  }

  handleOpenComment = (e) => {
    this.setState({
      isOpenComment : !this.state.isOpenComment
    })
  };

  handleOpenContext = (e) => {
    this.setState({
      isOpenContext : !this.state.isOpenContext
    })
  };
}

RedBookNote.propTypes = {
  loginUser: PropTypes.object.isRequired,
  pageForRedBook: PropTypes.object.isRequired,
  note: PropTypes.object.isRequired,
  onLogin: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired
}
