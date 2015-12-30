import React from 'react';
import Note from './Note.jsx';

export default class Notes extends React.Component {
  constructor(props){
    super(props);

    // this.props.store.subscribe(function(){

    //   const store = this.props.store.getState();
    //   console.log("노트에서 결과는? ==> ", store);

    // }.bind(this));

  }

  render() {
    const notes = this.props.items;



    return <ul className="notes">{notes.map(this.renderNote)}</ul>;

  }
  renderNote = (note) => {
    return (
      <li className="note" key={note.id}>
        <Note task={note.task} 
              onEdit={this.props.onEdit.bind(null, note.id)} 
              onDelete={this.props.onDelete.bind(null, note.id)}/>
      </li>
    );
  }
}