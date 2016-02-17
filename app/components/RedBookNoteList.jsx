import React, { Component, PropTypes } from 'react';
import RedBookNote from '../components/RedBookNote'

export default class RedBookNoteList extends Component {

  render(){

    const { entityNotes, entityComments, entityPlaces,
            noteIds, loginUser, noteState } = this.props;
    const { onLogin, onPushState, childPath,
            onFetchComments, onAddComment, onDeletePlace,
            onSaveEditingNote, onSaveEditingNoteDone, 
            onDeleteNote, onDeleteComment, onLikeNote
          } = this.props;

    return <div className="RedBookNoteList">
      { noteIds.map( (noteId, i) => {
        
        const note = entityNotes[noteId];

        let comments = [], places = [];
        note.comments.forEach(function(commentId){

          const comment = entityComments[commentId];
          if( comment ){
            comments.push( comment );               
          }
      
        });

        note.places.forEach(function(placeId){

          const place = entityPlaces[placeId];
          if( place ){
            places.push(place);
          }

        });

        return <RedBookNote key={i}
          appState={this.props.appState}
          loginUser={loginUser}
          noteState={noteState}
          note={note}
          comments={comments}
          places={places}

          onUpdateNoteState={this.props.onUpdateNoteState}
          onLogin={onLogin}
          onFetchComments={onFetchComments}
          onDeleteNote={onDeleteNote}
          onAddComment={onAddComment} 
          onSaveEditingNote={onSaveEditingNote}
          onSaveEditingNoteDone={onSaveEditingNoteDone}
          onDeleteComment={onDeleteComment}
          onDeletePlace={onDeletePlace}
          onLikeNote={onLikeNote}
          onPushState={onPushState}
          />
      }) }
    </div>
  }
}

RedBookNoteList.propTypes = {
  appState: PropTypes.object.isRequired,
  loginUser: PropTypes.object.isRequired,
  noteState: PropTypes.object.isRequired,
  onUpdateNoteState: PropTypes.func.isRequired,
  noteIds: PropTypes.array.isRequired,
  
  entityNotes: PropTypes.object.isRequired,
  entityComments: PropTypes.object.isRequired,
  entityPlaces: PropTypes.object.isRequired,

  onLogin: PropTypes.func.isRequired,
  onFetchComments: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onSaveEditingNote: PropTypes.func.isRequired,
  onSaveEditingNoteDone: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  onDeletePlace: PropTypes.func.isRequired,
  onLikeNote: PropTypes.func.isRequired,
  onPushState: PropTypes.func.isRequired
}
