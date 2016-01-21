import React, { Component, PropTypes } from 'react';
import RedBookNote from '../components/RedBookNote'

export default class RedBookNoteList extends Component {

  render(){

    const { entityNotes, entityComments, noteIds, loginUser, pageForRedBook } = this.props;
    const { onLogin, onPushState, childPath,
            onFetchComments, onAddComment, 
            onSaveEditingNote, onSaveEditingNoteDone, 
            onDeleteNote, onDeleteComment
          } = this.props

    return <div className="RedBookNoteList">
      { noteIds.map( (noteId, i) => {
        
        const note = entityNotes[noteId];

        let comments = [];
        note.comments.forEach(function(commentId){

          const comment = entityComments[commentId];
          if( comment ){
            comments.push( comment );               
          }
      
        });

        return <RedBookNote key={i}
          loginUser={loginUser}
          pageForRedBook={pageForRedBook}
          note={note}
          comments={comments}

          onLogin={onLogin}
          onFetchComments={onFetchComments}
          onDeleteNote={onDeleteNote}
          onAddComment={onAddComment} 
          onSaveEditingNote={onSaveEditingNote}
          onSaveEditingNoteDone={onSaveEditingNoteDone}
          onDeleteComment={onDeleteComment}
          onPushState={onPushState}
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

  onLogin: PropTypes.func.isRequired,
  onFetchComments: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onSaveEditingNote: PropTypes.func.isRequired,
  onSaveEditingNoteDone: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  onPushState: PropTypes.func.isRequired
}
