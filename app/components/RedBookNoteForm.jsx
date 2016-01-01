import React, { Component, PropTypes } from 'react';

export default class RedBookNoteForm extends Component {

  renderForm = () => {
    const { loginUser } = this.props;

    return <div id="RedBookNoteForm" className="">
      <form onSubmit={this.handleSubmit}>
        <textarea autoFocus={true}></textarea>
        <input type="submit" value="WRITE" />
      </form>
    </div>
  }

  render() {

    const { loginUser } = this.props;
    return loginUser.id ? this.renderForm() : false;
    
  }

  handleSubmit = (e) => {



    e.preventDefault()
  }

}

RedBookNoteForm.propTypes = {
  loginUser: PropTypes.object.isRequired,
}
