import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { updateNoteState } from '../actions'

import RedBookNote from '../components/RedBookNote'

class RedBookNoteList extends Component {

  render(){

    const { entityNotes, entityComments, entityPlaces,
            noteIds, loginUser, noteState } = this.props;
    const { childPath } = this.props;

    let klassName = 'RedBookNoteList';
    if( noteState.editingId ) {
      klassName = 'RedBookNoteList editing';
    }

    return <div className={klassName}>
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
          
          note={note}
          comments={comments}
          places={places}

          />
      }) }
    </div>
  }
}

RedBookNoteList.propTypes = {
  appState: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
  loginUser: PropTypes.object.isRequired,
  noteState: PropTypes.object.isRequired,
  
  entityNotes: PropTypes.object.isRequired,
  entityComments: PropTypes.object.isRequired,
  entityPlaces: PropTypes.object.isRequired,

  // 외부에서 주입
  noteIds: PropTypes.array.isRequired
}

function mapStateToProps(state, ownProps) {

  const {
    pagination: { commentsByNoteId }
  } = state

  return {
    routing: state.routing.locationBeforeTransitions,
    appState: state.appState,
    loginUser: state.login,
    noteState: state.noteState,
    entityNotes: state.entities.notes,
    entityComments: state.entities.comments,
    entityPlaces: state.entities.places,
    pagingCommentsByNoteId: commentsByNoteId,

  }
}

export default connect(mapStateToProps, {
  
})(RedBookNoteList)
