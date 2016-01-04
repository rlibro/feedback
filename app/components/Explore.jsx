import React, { Component, PropTypes } from 'react'

export default class Explore extends Component {

  constructor(props){
    super(props)

    this.state = {
      lat : null, 
      lng : null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setInputValue(nextProps.value)
    }
  }

  getInputValue() {
    return this.refs.input.value
  }

  setInputValue(val) {
    // Generally mutating DOM is a bad idea in React components,
    // but doing this for a single uncontrolled field is less fuss
    // than making it controlled and maintaining a state for it.
    this.refs.input.value = val
  }

  render() {
    return (
      <div className="Explore">
        <p>찾고자하는 나라/도시/친구 이름을 입력하세요!</p>
        <div className="search-bar">
          <input ref="input"
                 placeholder="Countries, Cites, Friends "
                 defaultValue={this.props.value}
                 onKeyUp={this.handleKeyUp} />
          <button onClick={this.handleGoClick}>
            Find!
          </button>
        </div>

        <div className="current-location">
          <button onClick={this.handleFindMyLocation}>현재 내위치 찾기</button>
        </div>

        {function(){

          if( this.state.lat ) {

             const { lat, lng } = this.state;

             return <img src={'http://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lng + '&zoom=13&size=300x300&sensor=false'} />

          }


        }.bind(this)()}
      </div>
    )
  }

  handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.handleGoClick()
    }
  }

  handleGoClick = () => {
    this.props.onChange(this.getInputValue())
  }


  handleFindMyLocation = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.handleGeoPosition);
    }

  }

  onGetCoords = (coords) => {

    console.log( coords );

    var latlng = {
      lat: coords.latitude,
      lng: coords.longitude,
    };
    this.setState(latlng);

    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          console.log('==> ', results );
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  handleGeoPosition = (position) => {
    this.onGetCoords(position.coords);
  }
}

Explore.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}