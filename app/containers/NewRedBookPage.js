import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { updateDataForNewRedBook, addRedBook } from '../actions'
import { pushPath as pushState, replacePath } from 'redux-simple-router'
import NewRedBookCover from '../components/NewRedBookCover'
import NewRedBookForm from '../components/NewRedBookForm'

class NewRedBookPage extends Component {

  shouldComponentUpdate(nextProps, nextSate) {
  

    if( !this.props.loginUser.id ){
      this.props.pushState('/');
      return false;
    }

    return true;    
  }


  componentWillReceiveProps(nextProps){

    if( nextProps.redBooks !== this.props.redBooks ) {

      setTimeout(function(){
        this.props.replacePath(`/guide/${this.props.redirect}`);
      }.bind(this), 400)    
      
    }
  }

  render(){

    const { loginUser, replacePath, location } = this.props;

    if( loginUser.current_location ){
      this.loadGeoCoding();
    }


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

  loadGeoCoding = () => {

    const uname = this.props.redirect;   
    const geocoder = new google.maps.Geocoder;
    const self = this;


    geocoder.geocode({'address': uname}, function(results, status) {

      if (status === google.maps.GeocoderStatus.OK) {
        const {location} = results[0].geometry;

        self.props.updateDataForNewRedBook({
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
    const {requiredInfo} = this.props;
    const requiredFields = ['uname', 'cityName', 'countryName', 'coverImage'];
    let invalids = [];

    var isValid = requiredFields.every(function(fieldName, i){

      if( !requiredInfo[fieldName] ){
        invalids.push(fieldName);
      }

      return requiredInfo[fieldName]

    })

    if( isValid ){
      this.props.addRedBook(noteText);  
    } else {
      alert('잠시만 기다려주세요!')
    }

  };

  handleCoverImageForNewRedBook = (imgData) => {

    this.props.updateDataForNewRedBook(imgData);

  };
}

NewRedBookPage.propTypes = {
  requiredInfo: PropTypes.object.isRequired,
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
    requiredInfo: state.pageForNewRedBook,
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