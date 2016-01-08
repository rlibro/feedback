import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { submitNoteComment, submitRedBookNote, clearNewRedBook, setNewRedBookCityName } from '../actions'
import { pushPath as pushState, replacePath } from 'redux-simple-router'
import NewRedBookCover from '../components/NewRedBookCover'
import NewRedBookForm from '../components/NewRedBookForm'

class NewRedBookPage extends Component {

  constructor(props){
    super(props);

    if( !this.props.loginUser.id ){
      replacePath('/');
    }

  }

  render(){

    const { loginUser, replacePath, newRedBook } = this.props;

    return <div className="NewRedBookPage">
      <NewRedBookCover 
        loginUser={loginUser}
        newRedBook={newRedBook}
        onCloseRedBook={this.handleCloseRedBook} />

      <NewRedBookForm 
        loginUser={loginUser}
        newRedBook={newRedBook}
        onSubmitRedBook={this.handleSubmitRedBook}
        onChangeCityName={this.handleChangeCityName}
        onCloseRedBook={this.handleCloseNewRedBook}
      />
      <div className="dimmed"></div>
    </div>
  }

  handleCloseNewRedBook = (e) => {
    this.props.replacePath('/')
  };

  handleChangeCityName = (cityIdx, cityData) => {

    console.log('cha--> ', cityIdx, cityData)
    this.props.setNewRedBookCityName(cityData);
  };

  handleSubmitRedBook = (noteText) => {
    this.props.submitRedBookNote(noteText)    
  };
}

NewRedBookPage.propTypes = {
  pushState: PropTypes.func.isRequired,
  replacePath: PropTypes.func.isRequired
}


function mapStateToProps(state) {

  const {
    entities: { redBooks },
    routing: { path }
  } = state

  const uname = path.substr(1) 
  const [ cityName, countryName ] = uname.split(',');

  return {
    loginUser: state.login,
    countryName: countryName,
    entities: state.entities,
    newRedBook: state.newRedBook
  }
}


export default connect(mapStateToProps, {
  submitRedBookNote,
  submitNoteComment,
  clearNewRedBook,
  setNewRedBookCityName,
  pushState,
  replacePath
})(NewRedBookPage)