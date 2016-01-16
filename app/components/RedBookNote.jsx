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

    const { loginUser, pageForRedBook, note, entityComments, pagingComments} = this.props;
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
 {/*       <div className="like"><i className="fa fa-thumbs-o-up"/> 추천</div>*/}
        <div className="comments" onClick={this.handleToggleComment.bind(null, note.id)}><i className="fa fa-comments-o"/> Comments ({note.comments.length})</div>
      </div>

      <NoteCommentList 
        loginUser={loginUser}
        commentIds={note.comments || []} 
        entityComments={entityComments}
        pageForRedBook={pageForRedBook}
        pagingComments={pagingComments}

        onLogin={onLogin}
        isOpenComment={isOpenComment}
        onAddComment={onAddComment.bind(null, note.id)} 
        onDeleteComment={onDeleteComment.bind(null, note.id)}
        />
    </div>
  }

  handleToggleComment = (noteId, e) => {

    const { isOpenComment } = this.state;

    if( !isOpenComment ){
       this.props.onFetchComments(noteId) 
    }

    this.setState({
      isOpenComment: !isOpenComment
    });
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
  entityComments: PropTypes.object.isRequired,

  onLogin: PropTypes.func.isRequired,
  onFetchComments: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired
}
