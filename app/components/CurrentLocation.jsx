import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { updateAppState, updateCurrentUserLocation } from '../actions'

import {default as ScriptjsLoader} from 'react-google-maps/lib/async/ScriptjsLoader';
import {GoogleMap} from 'react-google-maps';

class CurrentLocation extends Component {
  static version = 22; //Math.ceil(Math.random() * 22);

  constructor(props){
    super(props);

    this.state = {
      checkCount: 2,
      message: '',
      latlng : null
    };

    window.loadedGoogle = this.onLoadedGoogle;
  }

  componentWillReceiveProps(nextProps){

    if( nextProps.loginUser.id !== this.props.loginUser.id ){
      if( !nextProps.loginUser.id ) {
        let checkCount = this.state.checkCount;
        checkCount++;

        this.setState({
          checkCount: checkCount,
          message: ''
        })
      } else {
        this.loadCurrentLocation();  
      } 
    }
  }

  render(){

    const { appState: { loadedGoogleSDK } } = this.props;

    //console.log('####> CurrentLocation Render: isGoogleSDK? ', loadedGoogleSDK);
    // if( !loadedGoogleSDK ){
    //   return false;
    // }


    return <ScriptjsLoader
      hostname={'maps.googleapis.com'}
      pathname={'/maps/api/js'}
      query={{
        v: `3.${ CurrentLocation.version }`,
        key:'AIzaSyABFo5etnTuWbcrgVxaCeJa7a4R2ZLZsOY',
        language:'en',
        callback:'loadedGoogle',
        libraries: 'geometry,drawing,places'
      }}
      loadingElement={<div/>}
      containerElement={<div id="google_map"/>}
      googleMapElement={<GoogleMap/>}
    />;
  }

  componentDidMount(){
    const {loginUser} = this.props;

    if( loginUser.currentLocation ){ 
      this.setState({message: loginUser.currentLocation.cityName});
    }

  }

  loadCurrentLocation = () => {

    if (navigator.geolocation) {
      this.setState({message: 'finding location...'})
      navigator.geolocation.getCurrentPosition(this.onSuccessPosition, this.onFailPosition);
    }
  };


  onLoadedGoogle = () => {

    // google SDK 로드 완료!
    this.props.updateAppState({
      loadedGoogleSDK: true
    })

    // SDK 로드를 위한 임시 지도는 제거
    setTimeout(function(){
      $('#google_map').remove();
    }, 0)
    
    this.findLocation();    
  };

  onSuccessPosition = (position) => {
    this.onGetCoords(position.coords);
  };

  onFailPosition = () => {
    this.setState({
      message: 'Please turn on GPS sensor'
    });
  };

  onGetCoords = (coords) => {
    const latlng = {
      lat: coords.latitude,
      lng: coords.longitude
    };

    this.setState({latlng});
    this.findLocation();
  };


  findLocation = () => {
    let { checkCount } = this.state;
    checkCount--;

    this.setState({
      checkCount: checkCount
    });

    if( checkCount === 0 ) {
      this.getGeoCodeder(this.state.latlng) 
    }
  };

  getGeoCodeder = (latlng) => {

    const geocoder = new google.maps.Geocoder;
    const self = this;

    geocoder.geocode({'location': latlng}, function(results, status) {
      
      if (status !== google.maps.GeocoderStatus.OK) {
        self.setState({
          message: 'Where I am?'
        })
      }

      let cityName, countryName;

      results[0].address_components.forEach( (addr, i) => {

        if (addr.types[0] === 'locality'){
          cityName = addr.long_name;
        }

        if (addr.types[0] === 'country'){
          countryName = addr.long_name;
        }

      });

      self.props.updateCurrentUserLocation({ 
        'cityName' : cityName, 
        'countryName' : countryName, 
        'latlng': latlng    
      });

      if( cityName ){
        self.setState({message: cityName});  
      } else {
        self.setState({message: '도시로 이동하세요!' });
      }

    });

  };
}

CurrentLocation.propTypes = {
  loginUser: PropTypes.object.isRequired,
  updateAppState: PropTypes.func.isRequired,
  updateCurrentUserLocation: PropTypes.func.isRequired
}


function mapStateToProps(state, ownProps) {
  return {
    appState: state.appState,
    loginUser: state.login
  }
}

export default connect(mapStateToProps, {
  updateAppState, updateCurrentUserLocation
})(CurrentLocation)
