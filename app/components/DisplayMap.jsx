import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { updateNoteState } from '../actions'

import {GoogleMapLoader, GoogleMap, Marker, InfoWindow, Circle, SearchBox} from 'react-google-maps';


/**
 * 뷰 전용 맵
 *
 * @depends SingleNotePlacePage
 */
export default class DisplayMap extends Component {

  static version = Math.ceil(Math.random() * 22);

  constructor(props){
    super(props);

    this.state = {
      markers: props.markers.concat(),
      usedUserLocation: false,
      moveToCenter: true
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({moveToCenter: true})
  }

  render () {
    const { usedUserLocation } = this.state;
    let klassName = 'DisplayMap Map';

    if( usedUserLocation ){
      klassName += ' user-loaction-on'
    }

    return <div className={klassName}>
      {this.renderMapButtons()}
      <GoogleMapLoader
        containerElement={ <div {...this.props} />}
        googleMapElement={this.renderGoogleMap()}
      />
    </div>
  }

  /**
   * 읽기 전용맵 일경우 지도 닫기 버튼이 없다. 
   * 
   * SingleNotePlacePage의 경우가 readOnly
   */
  renderMapButtons = () => {
    const { isReadOnly, loginUser } = this.props;
   
    return <div className="btn-groups">
      {function(){
        if (!isReadOnly){
          return <div className="map-btn close">
            <i className="fa fa-times" onClick={this.handleClosePlaceMap}/>
          </div>  
        }
      }.bind(this)()}
      
      {function(){
        if( loginUser.current_location ){
          return <div className="map-btn current-location">
            <i className="fa icon-current" onClick={this.handleMoveCenterToCurrentUser}/>
          </div>
        } else{
          return false;
        }
      }.bind(this)()}

      
    </div>
  };

  renderGoogleMap = () => {
    const { isReadOnly, loginUser } = this.props;
    const { markers, usedUserLocation, moveToCenter } = this.state;
    let { zoomLevel = 13, mapCenter } = this.props;
    let userLocationMarkups = [];

    const defaultOptions = {
      mapTypeControl: true,
      streetViewControl: true,
      scrollwheel: false,
      disableDoubleClickZoom: false
    };

    if( !isReadOnly ){
      defaultOptions.mapTypeControl = false;
    }

    // 사용자 위치를 사용할 경우 사용자 위치로 중심을 이동시킨다. 
    if( usedUserLocation ){
      zoomLevel = 17;
      mapCenter = loginUser.current_location.latlng;
      userLocationMarkups = userLocationMarkups.concat([
        (<Circle key="circle" center={mapCenter} clickable={false} radius={50} 
          options={{
            fillColor: 'blue',
            fillOpacity: 0.2,
            strokeColor: 'blue',
            strokeOpacity: 0.8,
            strokeWeight: 0.5,
          }} />),
      ]);
  
    }

    let finalMapOptions = {
      ref: function (map){ this._googleMapComponent = map }.bind(this),
      defaultOptions: defaultOptions,
      defaultZoom: zoomLevel,
      defaultCenter: mapCenter,
      zoom: zoomLevel,
      center: mapCenter
    }

    if( !moveToCenter ){
      delete finalMapOptions.zoom;
      delete finalMapOptions.center;   
    }

    return <GoogleMap { ...finalMapOptions}>
      {this.renderMarkers()}
      {userLocationMarkups}
    </GoogleMap>
  };

  renderMarkers = () => {

    const { isReadOnly, centerMarkerId, isFitBound } = this.props;
    const { markers, moveToCenter } = this.state;
    var markerArray = [];

    markers.forEach((marker, index) => {
      const ref = `marker_${index}`;

      if( moveToCenter ){
        if( centerMarkerId === marker.key ) {
          marker.showInfo = true;
        } else {
          marker.showInfo = false;
        }
      }
      
      markerArray.push(<Marker key={ref} ref={ref}
        {...marker}
        title={(index+1).toString()}
        onClick={this.handleMarkerClick.bind(this, marker)} >
        {marker.showInfo ? this.renderInfoWindow(ref, marker) : null}
      </Marker>);
      
    });

    return markerArray;
  };

  renderInfoWindow = (ref, marker) => {

    const { isReadOnly } = this.props;
    const { note } = marker;
  
    let InfoContent = <div id={marker.key} className="infoWindow">
      <i className="fa fa-pencil-square-o" /> {marker.title}
    </div>;

    if( isReadOnly || !marker.canEdit ) {
      InfoContent = <div id={marker.key} className="infoWindow">
        <div className="iw-title">{marker.title}</div>
        {function(){
          if( !this.props.hideMarkerNoteLink ){
            return <div className="iw-content">
              <a href={`/notes/${marker.note.objectId}/places/${marker.key}`} onClick={this.handleMovetoNote.bind(this, marker)}>Go to the Note</a>
            </div>
          }
        }.bind(this)()}
        </div>;
    }

    return (
      <InfoWindow key={`${ref}_info_window`}
        onDomready={this.handleInfoWindowReady}
        onCloseclick={this.handleCloseInfoWindow.bind(this, marker)}>{InfoContent}        
      </InfoWindow>
    )    
  };

  handleInfoWindowReady = () => {

    var iwOuter = $('.gm-style-iw');
    var iwBackground = iwOuter.prev();

    iwBackground.children(':nth-child(2)').css({'display' : 'none'});
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(200, 200, 200, 0.6) 0px 1px 6px', 'z-index' : '1'});
  
    var iwCloseBtn = iwOuter.next();
    iwCloseBtn.css({
      opacity: '0.7', 
      width: '19px',
      height: '19px',
      'background-color': '#fff',
      right: '10px', top: '10px',
      border: '3px solid #ccc',
      'border-radius': '13px',
    });
  };

  handleMovetoNote = (marker, e) => {
    e.preventDefault(); 
    browserHistory.push({
      pathname: `/notes/${marker.note.objectId}`, 
      state: {referer:this.props.referer} 
    });

  };

  handleMarkerClick = (marker) => {
  
    const { markers } = this.state;
    const clones = _.cloneDeep(markers);

    for( var i=0; i < clones.length ; ++i){
      if( clones[i].key === marker.key ){
        clones[i].showInfo = !marker.showInfo;
        break;
      }
    }

    this.setState({
      moveToCenter: false,
      markers: clones
    });
  };

  handleCloseInfoWindow = (marker) => {
    const { markers } = this.state;
    const clones = _.cloneDeep(markers);

    for( var i=0; i < clones.length ; ++i){
      if( clones[i].key === marker.key ){
        clones[i].showInfo = false;
        break;
      }
    }

    this.setState({markers: clones});
  };

  handleMoveCenterToCurrentUser = () => {
    const { loginUser } = this.props;
    const { usedUserLocation } = this.state;
    
    if( !usedUserLocation ) {
      this.setState({
        usedUserLocation: true,
        moveToCenter: true
      });
    } else{
      this.setState({
        usedUserLocation: false,
        moveToCenter: false
      });
    }
  };

  handleClosePlaceMap = () => {
    this.props.updateNoteState({
      openMap: false
    });
    this.props.onCloseMap && this.props.onCloseMap();
  };
}

DisplayMap.propTypes = {
  loginUser: PropTypes.object.isRequired,
  updateNoteState: PropTypes.func.isRequired,

  // 외부 주입
  markers: PropTypes.array.isRequired,
  mapCenter : PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  }),
  referer: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  
  return {
    loginUser: state.login
  }
}

export default connect(mapStateToProps, {
  updateNoteState
})(DisplayMap)
