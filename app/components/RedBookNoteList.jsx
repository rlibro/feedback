import React, { Component, PropTypes } from 'react';
import RedBookNote from '../components/RedBookNote'

export default class RedBookNoteList extends Component {

  render = () => {

    const { notes, ids, loginUser } = this.props

    return <div id="RedBookNoteList" className="border blue">
      { ids.map( (id, i) => {
        
        const note = notes[id];

        return <RedBookNote 
          key={i} note={note} loginUser={loginUser}
          onSubmitComment={this.props.onSubmitComment} />
      }) }
    </div>
  }
}

RedBookNoteList.propTypes = {
  loginUser: PropTypes.object.isRequired,
  ids: PropTypes.array.isRequired,
  notes: PropTypes.object.isRequired,
  onSubmitComment: PropTypes.func.isRequired
}
