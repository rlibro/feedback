import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { updateDataForNewRedBook, addRedBook } from '../actions'
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

  componentWillReceiveProps(nextProps){

    if( nextProps.redBooks !== this.props.redBooks ) {

      setTimeout(function(){
        this.props.replacePath(`/${this.props.redirect}`);
      }.bind(this), 400)    
      
    }
  }

  componentWillUnmount(){

    this.props.updateDataForNewRedBook(null);
  }

  render(){

    const { loginUser, replacePath, location } = this.props;

    return <div className="NewRedBookPage">
      <NewRedBookCover 
        loginUser={loginUser}
        newRedBook={location}
        setCoverImageForNewRedBook={this.handleCoverImageForNewRedBook} />

      <NewRedBookForm 
        loginUser={loginUser}
        newRedBook={location}
        onCreateNewRedBook={this.handleCreateNewRedBook}
        onCancelNewRedBook={this.handleCancelNewRedBook}
      />
      <div className="dimmed"></div>
    </div>
  }

  componentDidMount(){
     this.props.updateDataForNewRedBook(this.props.location);
  }

  handleCancelNewRedBook = (e) => {
    this.props.replacePath('/')
  };

  handleCreateNewRedBook = (noteText) => {
    this.props.addRedBook(noteText);
  };

  handleCoverImageForNewRedBook = (imgData) => {

    this.props.updateDataForNewRedBook(imgData);

  };
}

NewRedBookPage.propTypes = {
  pushState: PropTypes.func.isRequired,
  replacePath: PropTypes.func.isRequired
}


function mapStateToProps(state) {

  const { routing, entities:{ redBooks } } = state
  const [ cityName, countryName ] = routing.state.split(',');
  const location = {
    uname: routing.state,
    countryName: countryName.replace(/_/g,' '),
    cityName: cityName.replace(/_/g,' ')
  }

  return {
    redirect: location.uname,
    redBooks: redBooks,
    loginUser: state.login,
    location: location
  }
}


export default connect(mapStateToProps, {
  updateDataForNewRedBook,
  addRedBook,
  pushState,
  replacePath
})(NewRedBookPage)