import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { updateRedBookState, addRedBook } from '../actions'
import { pushPath as pushState, replacePath } from 'redux-simple-router'
import NewRedBookCover from '../components/NewRedBookCover'
import NewRedBookForm from '../components/NewRedBookForm'

class NewRedBookPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      loadedGeoCoding: false
    }
  }

  componentWillReceiveProps(nextProps){

    const { redBookState: { isFetching }, loginUser } = nextProps;

    if( isFetching.addRedBook === 'DONE' ) {
      this.props.updateRedBookState({
        isFetching: {addRedBook: 'READY'}
      });
      this.props.replacePath(`/guide/${this.props.redirect}`);
    }

    if( !this.state.loadedGeoCoding && loginUser.current_location ){
      this.setState({loadedGeoCoding:true});
      this.loadGeoCoding();
    }

  }


  shouldComponentUpdate(nextProps, nextSate) {
    const { redBookState:{ uname, isFetching: {addRedBook}} } = nextProps;
    const { redBookState } = this.props;

    if( uname !== redBookState.uname || addRedBook !== 'READY'){
      return true;
    }


    return false;    
  }

  render(){

    const { loginUser, replacePath, location, redBookState } = this.props;

    if( !loginUser.id ) {
      return false;
    }

    return <div className="NewRedBookPage">
      <NewRedBookCover 
        loginUser={loginUser}
        newRedBook={location}
        setCoverImageForNewRedBook={this.handleCoverImageForNewRedBook} />

      <NewRedBookForm 
        loginUser={loginUser}
        redBookState={redBookState}
        newRedBook={location}
        onCreateNewRedBook={this.handleCreateNewRedBook}
        onCancelNewRedBook={this.handleCancelNewRedBook} />

      <div className="dimmed"></div>
    </div>
  }

  componentDidMount(){
    this.props.updateRedBookState(this.props.location);
  }

  loadGeoCoding = () => {

    const uname = this.props.redirect;   
    const geocoder = new google.maps.Geocoder;
    const self = this;


    geocoder.geocode({'address': uname}, function(results, status) {

      if (status === google.maps.GeocoderStatus.OK) {
        const {location} = results[0].geometry;

        self.props.updateRedBookState({
          geo : {
            lat: location.lat(),
            lng: location.lng()
          }
        });
      }

    });


  };

  handleCancelNewRedBook = (e) => {
    this.props.replacePath('/')
  };

  handleCreateNewRedBook = (noteText) => {

    // newRedBook 데이터를 한번 검증해서 필요한 데이터가 다 안넘어오면 alret 으로 알려주자!
    const { redBookState } = this.props;
    const requiredFields = ['uname', 'cityName', 'countryName', 'coverImage'];
    let invalids = [];

    var isValid = requiredFields.every(function(fieldName, i){

      if( !redBookState[fieldName] ){
        invalids.push(fieldName);
      }

      return redBookState[fieldName]

    })

    if( isValid ){
      this.props.addRedBook(noteText);  
    } else {
      alert('잠시만 기다려주세요!')
    }

  };

  handleCoverImageForNewRedBook = (imgData) => {

    this.props.updateRedBookState(imgData);

  };
}

NewRedBookPage.propTypes = {
  redBookState: PropTypes.object.isRequired,
  pushState: PropTypes.func.isRequired,
  replacePath: PropTypes.func.isRequired
}


function mapStateToProps(state) {

  const { routing, entities:{ redBooks } } = state;
  const isValidState = !!routing.state;

  if( isValidState ){
    const [ cityName, countryName ] = routing.state.split(',');
    const position = {
      uname: routing.state,
      countryName: countryName.replace(/_/g,' '),
      cityName: cityName.replace(/_/g,' ')
    }

    return {
      redBookState: state.redBookState,
      redirect: position.uname,
      redBooks: redBooks,
      loginUser: state.login,
      location: position
    }
  } else {
    return {
      redBookState: state.redBookState,
      redBooks: redBooks,
      loginUser: state.login
    };
  }

  
}


export default connect(mapStateToProps, {
  updateRedBookState,
  addRedBook,
  pushState,
  replacePath
})(NewRedBookPage)