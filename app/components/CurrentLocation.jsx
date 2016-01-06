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

        console.log(results);

        const countryName = results[results.length-1].formatted_address;
        let cityName = results[results.length-3].formatted_address;
        cityName = cityName.split(',').map( name => {
          return trim(name);
        })[0];

        // 현재위치를 업데이트 한다.
        self.props.onUpdateCurrentUserLocation({ 
          'cityName' : cityName.replace(/\s/g,'_'), 
          'countryName' : countryName.replace(/\s/g,'_'), 
          'latlng': latlng    
        });
        self.setState({message: cityName});

        
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
