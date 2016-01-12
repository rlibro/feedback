import React, { Component, PropTypes } from 'react';
import RedBookNote from '../components/RedBookNote'

export default class RedBookNoteList extends Component {

  render(){

    const { notes, ids, loginUser, pageForRedBook } = this.props;
    const { onLogin, onAddComment, onDeleteNote, onDeleteComment} = this.props

    return <div className="RedBookNoteList">
      { ids.map( (id, i) => {
        
        const note = notes[id];

        return <RedBookNote key={i}
          loginUser={loginUser}
          pageForRedBook={pageForRedBook}
          note={note} 

          onLogin={onLogin}
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
  ids: PropTypes.array.isRequired,
  notes: PropTypes.object.isRequired,
  onLogin: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired
}
