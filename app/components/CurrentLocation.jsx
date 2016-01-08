import React, { Component, PropTypes } from 'react';
import trim from 'lodash/string/trim';
import findIndex from 'lodash/array/findIndex';

export default class CurrentLocation extends Component {

  constructor(props){
    super(props);

    this.state = {
      checkCount: 2,
      message: '',
      latlng : null
    };

    window.loadedGoogle = this.onLoadedGoogle;

    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyABFo5etnTuWbcrgVxaCeJa7a4R2ZLZsOY&signed_in=true&language=en&callback=loadedGoogle';
    document.head.appendChild(script);

  }

  render(){
    return <div className="message">{this.state.message}</div>
  }

  componentDidMount(){
    const {loginUser} = this.props;

    if( loginUser.currentLocation ){ 
      this.setState({message: loginUser.currentLocation.cityName});
    }

    if (navigator.geolocation) {
      this.setState({message: 'finding current location...'})
      navigator.geolocation.getCurrentPosition(this.onSuccessPosition, this.onFailPosition);
    }

  }

  onLoadedGoogle = () => {
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

      console.log('현재 위치 검색 결과', results, status);

      let cityName, countryName;

      results[0].address_components.forEach( (addr, i) => {

        if (addr.types[0] === 'locality'){
            cityName = addr.long_name;
        }

        if (addr.types[0] === 'country'){
            countryName = addr.long_name;
        }

      });

      self.props.onUpdateCurrentUserLocation({ 
        'cityName' : cityName, 
        'countryName' : countryName, 
        'latlng': latlng    
      });
      self.setState({message: cityName});
    });

  };
}

CurrentLocation.propTypes = {
  loginUser: PropTypes.object.isRequired,
  onUpdateCurrentUserLocation: PropTypes.func.isRequired
}
