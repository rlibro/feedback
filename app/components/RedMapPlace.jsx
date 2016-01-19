import React, { Component, PropTypes } from 'react';
import {default as update} from 'react-addons-update';
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow} from 'react-google-maps';

/*
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 *
 * Loaded using async loader.
 */
export default class RedMapPlace extends Component {

  static version = Math.ceil(Math.random() * 22);

  state = {
    markers: []
  };

  render () {

    const mapLocation = {
      lat : this.props.geo.latitude,
      lng : this.props.geo.longitude
    };

    return <div className="RedBookCover place">
    <div className="button-close">
      <i className="fa fa-times" onClick={this.handleClosePlaceMap}/>
    </div>
    <GoogleMapLoader
      containerElement={
        <div
          {...this.props}
          style={{
            height: '360px',
          }}
        />
      }
      googleMapElement={
        <GoogleMap
          ref={(map) => console.log(map)}
          defaultOptions={{
            mapTypeControl: false,
            streetViewControl: false,
            scrollwheel: false,
            disableDoubleClickZoom: true
          }}
          defaultZoom={13}
          defaultCenter={mapLocation}
          onClick={this.handleMapClick}>
          {this.state.markers.map((marker, index) => {

            console.log('marker ==> ', marker, index)
            const ref = `marker_${index}`;

            return (
              <Marker key={ref} ref={ref}
                {...marker}
                title={(index+1).toString()}
                onClick={this.handleMarkerClick.bind(this, marker)}
                onRightclick={this.handleMarkerRightclick.bind(this, index)} >

                {marker.showInfo ? this.renderInfoWindow(ref, marker) : null}
              </Marker>
            );
          })}
        </GoogleMap>
      }
    />
    </div>

  };

  renderInfoWindow = (ref, marker) => {
    return (
      <InfoWindow key={`${ref}_info_window`}
        content={marker.title}
        onCloseclick={this.handleCloseclick.bind(this, marker)}
      />
    )    
  };

  getAddress = (latLng, callback) => {
    const geocoder = new google.maps.Geocoder;
    const self = this;

    geocoder.geocode({'location': latLng}, function(results, status) {
      
      if (status === google.maps.GeocoderStatus.OK) {
        
        callback(results[0].formatted_address);

      }
    })

      
  };

  handleMapClick =(event) =>{
    var {markers} = this.state;
    var self = this;

    this.getAddress(event.latLng, function(address){

      markers = update(markers, {
        $push: [
          {
            position: event.latLng,
            defaultAnimation: 5,
            title: address,
            label: (markers.length + 1) + '',
            key: Date.now()
          },
        ],
      });
      self.setState({ markers });


    });
  };

  handleMarkerRightclick = (index, event) => {
    var {markers} = this.state;
    markers = update(markers, {
      $splice: [
        [index, 1]
      ],
    });
    this.setState({ markers });
  };

  handleMarkerClick = (marker) => {
    marker.showInfo = true;
    this.setState(this.state);
  };

  handleCloseclick = (marker) => {
    marker.showInfo = false;
    this.setState(this.state);
  };

  handleClosePlaceMap = () => {
    this.props.onUpdateDataForRedBook({
      formMode: 'NOTE'
    })
  };
}

RedMapPlace.propTypes = {
  geo : PropTypes.object.isRequired,
  onUpdateDataForRedBook: PropTypes.func.isRequired
}