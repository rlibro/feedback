import React, { Component, PropTypes } from 'react';
import RedBookNote from '../components/RedBookNote'

export default class RedBookNoteList extends Component {

  render(){

    const { entityNotes, entityComments, noteIds, pagingCommentsByNoteId, loginUser, pageForRedBook } = this.props;
    const { onLogin, onFetchComments, onAddComment, onDeleteNote, onDeleteComment} = this.props

    return <div className="RedBookNoteList">
      { noteIds.map( (noteId, i) => {
        
        const note = entityNotes[noteId];

        return <RedBookNote key={i}
          loginUser={loginUser}
          pageForRedBook={pageForRedBook}
          note={note} 
          entityComments={entityComments}
          pagingComments={pagingCommentsByNoteId[noteId]}

          onLogin={onLogin}
          onFetchComments={onFetchComments}
          onDeleteNote={onDeleteNote}
          onAddComment={onAddComment} 
          onDeleteComment={onDeleteComment}
          />
      }) }
    </div>
  }
}

RedBookNoteList.propTypes = {
  loginUser: PropTypes.object.isRequired,
  pageForRedBook: PropTypes.object.isRequired,
  noteIds: PropTypes.array.isRequired,
  
  entityNotes: PropTypes.object.isRequired,
  entityComments: PropTypes.object.isRequired,
  pagingCommentsByNoteId: PropTypes.object.isRequired,

  onLogin: PropTypes.func.isRequired,
  onFetchComments: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired
}
