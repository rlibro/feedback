import React, { Component, PropTypes } from 'react';
import trim from 'lodash/string/trim';
import findIndex from 'lodash/array/findIndex';

export default class CurrentLocation extends Component {

  constructor(props){
    super(props);

    this.state = {
      loadedGoogleSDK: false,
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

        //console.log('CurrentLocation 에서 위치 정보 업데이트 해야함!');  
        this.loadCurrentLocation();  
      }
      
    }
    
  }

  render(){
    return false;

    <div className="CurrentLocation">
      <p className="message">{this.state.message}</p>
    </div>
  }

  componentDidMount(){
    const {loginUser} = this.props;

    //console.log('위치 정보 로드 준비!!', loginUser);

    if( loginUser.currentLocation ){ 
      this.setState({message: loginUser.currentLocation.cityName});
    }

  }

  loadCurrentLocation = () => {

    // 구글 지도 API 로딩
    if( !this.state.loadedGoogleSDK ){
      this.setState({
        loadedGoogleSDK: true
      })
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyABFo5etnTuWbcrgVxaCeJa7a4R2ZLZsOY&signed_in=true&language=en&callback=loadedGoogle';
      document.head.appendChild(script);
    }

    if (navigator.geolocation) {
      this.setState({message: 'finding location...'})
      navigator.geolocation.getCurrentPosition(this.onSuccessPosition, this.onFailPosition);
    }
  
  };


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

    //console.log('findLocation..', this.state)

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

      self.props.onUpdateCurrentUserLocation({ 
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
  onUpdateCurrentUserLocation: PropTypes.func.isRequired
}
