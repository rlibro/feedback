import React, { Component, PropTypes } from 'react';
import string from 'lodash/string';
import array from 'lodash/array';

export default class CurrentLocation extends Component {

  constructor(props){
    super(props);

    this.state = {
      checkCount: 2,
      message: 'finding location...',
      latlng : null
    };

    window.loadedGoogle = this.onLoadedGoogle;
  }

  render(){
    return <div className="message">{this.state.message}</div>
  }

  componentDidMount(){
    const {loginUser} = this.props;

    if( loginUser.currentLocation ){ 
      self.setState({message: loginUser.currentLocation.cityName});
    }

    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyABFo5etnTuWbcrgVxaCeJa7a4R2ZLZsOY&signed_in=true&language=en&callback=loadedGoogle';
    document.head.appendChild(script);

    if (navigator.geolocation) {
      setTimeout(function (){
        navigator.geolocation.getCurrentPosition(this.onSuccessPosition, this.onFailPosition);
      }.bind(this), 2000);      
    }

  }

  onLoadedGoogle = () => {
    this.findLocation();    
  }

  onSuccessPosition = (position) => {
    this.onGetCoords(position.coords);
  }

  onFailPosition = () => {
    this.setState({
      message: '현재위치를 가져올수없습니다'
    });
  }

  onGetCoords = (coords) => {
    const latlng = {
      lat: coords.latitude,
      lng: coords.longitude
    };

    this.setState({latlng});
    this.findLocation();
  }


  findLocation = () => {

    let { checkCount } = this.state;
    checkCount--;

    this.setState({
      checkCount: checkCount
    });

    if( checkCount === 0 ) {
      this.getGeoCodeder(this.state.latlng) 
    }
  }

  getGeoCodeder = (latlng) => {

    const geocoder = new google.maps.Geocoder;
    const self = this;

    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {

          const { types, formatted_address } = results[1];
          const address = formatted_address.split(',').map( name => {
            return string.trim(name);
          })

          const cityIdx = array.findIndex(types, function(type){
            return type === 'sublocality'
          });
          const countryIdx = array.findIndex(types, function(type){
            return type === 'political'
          })


          // 현재위치를 업데이트 한다.
          self.props.onUpdateCurrentUserLocation({ 
            'cityName' : address[cityIdx], 
            'countryName' : address[countryIdx], 
            'latlng': latlng    
          });
          self.setState({message: address[cityIdx]});

        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });

  }
}

CurrentLocation.propTypes = {
  loginUser: PropTypes.object.isRequired,
  onUpdateCurrentUserLocation: PropTypes.func.isRequired
}
