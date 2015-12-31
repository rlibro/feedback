import React, { Component, PropTypes } from 'react';

export default class RedBookNoteForm extends Component {

  render = () => {
    return <div id="RedBookNoteForm" className="border blue">
      <form onSubmit={this.handleSubmit}>
        <textarea autoFocus={true}></textarea>
        <input type="submit" value="WRITE" />
      </form>
    </div>
  }

  handleSubmit = (e) => {



    e.preventDefault()
  }

}

RedBookNoteForm.propTypes = {
}
