import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { updateNoteState, addPlace, updatePlace} from '../actions'

import {GoogleMapLoader, GoogleMap, Marker, InfoWindow, Circle, SearchBox} from 'react-google-maps';
import {triggerEvent} from 'react-google-maps/lib/utils';
import _ from 'lodash'


function findUniqLabel( markers ) {

  if( markers.length === 0 ){
    return '1';
  }

  markers.sort(function(m1, m2){
    return m1.label - m2.label;
  });


  let i=0;
  for(; i<markers.length; ++i) {

    if( markers[i].label != i+1 ){
      return (i+1)+'';
    }
  }
  return (markers.length + 1) +'';

};

/*
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 *
 * Loaded using async loader.
 */
class ControlMap extends Component {

  static version = Math.ceil(Math.random() * 22);

  constructor(props){
    super(props);

    this.state = {
      moveToCenter: false,
      usedUserLocation: false,
      isAddMarker: false,
      markers: props.markers.concat()
    };
  }

  shouldComponentUpdate(nextProps, nextState) {

    const { markers } = nextState;
    const { isAddMarker, usedUserLocation } = nextState;
    let isUpdate = false;

    if( markers.length !== this.state.markers.length ) { return true; } 

    // 마커 인스턴스는 매번 변경되므로 실제 속성이 변경되는지를 확인해야한다.
    markers.forEach(function(marker, i){
      const prevMarker = this.state.markers[i];
      if( !prevMarker ) { isUpdate = true; }  // 새로 추가 됐으면 무조건 업데이트!
      if(  marker.showInfo  !== prevMarker.showInfo 
        || marker.title     !== prevMarker.title 
        || marker.isEditing !== prevMarker.isEditing ) {
        isUpdate = true;
      }
    }.bind(this));

    // 상단의 버튼이 달라지는 경우
    if ( isAddMarker      !== this.state.isAddMarker 
      || usedUserLocation !== this.state.usedUserLocation ) {
      return true;
    }

    return isUpdate;
  }


  render () {
    const { isAddMarker, usedUserLocation } = this.state;
    let klassName = 'ControlMap Map';
    let style = {}

    if( isAddMarker ){
      klassName += ' add-marker-on';
    }

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

  };

  renderGoogleMap = () => {
    const { loginUser } = this.props;
    const { markers, usedUserLocation, moveToCenter, isAddMarker } = this.state;
    let { zoomLevel = 13, disableMoveCenter, mapCenter } = this.props;

    const defaultOptions = {
      mapTypeControl: false,
      streetViewControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: false
    };

    let contents = [];

    // 사용자 위치를 사용하고 moveToCenter 옵션을 사용할 경우 사용자 위치로 중심을 이동시킨다. 
    if( usedUserLocation ){
      zoomLevel = 17;
      mapCenter = loginUser.current_location.latlng;
      contents = contents.concat([
        (<InfoWindow key="info" position={mapCenter} content={'you are here!'} />),
        (<Circle key="circle" center={mapCenter} clickable={false} radius={50} options={{
            fillColor: 'blue',
            fillOpacity: 0.2,
            strokeColor: 'blue',
            strokeOpacity: 0.8,
            strokeWeight: 0.5,
          }} />),
      ]);
      
      if( moveToCenter ){
        disableMoveCenter = false;
      } else{
        disableMoveCenter = true;
      }   
    }


    let finalMapOptions = {
      ref: function (map){ this._googleMapComponent = map }.bind(this),
      defaultOptions: defaultOptions,
      defaultZoom: zoomLevel,
      defaultCenter: mapCenter,
      onClick: this.handleMapClick
    }

    if( !disableMoveCenter ){
      finalMapOptions.center = mapCenter;
      finalMapOptions.zoom = zoomLevel;   
    }

    return <GoogleMap { ...finalMapOptions}>
      <SearchBox
        classes="markerSearchBox"
        bounds={this.state.bounds}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={this.handlePlacesChanged}
        ref="searchBox"
        placeholder="search location" />
      {this.renderMarkers()}
      {contents}
    </GoogleMap>
  };

  renderMapButtons = () => {
    const { loginUser } = this.props;

    return <div className="btn-groups">
      <div className="map-btn close">
        <i className="fa fa-times" onClick={this.handleClosePlaceMap}/>
      </div>  
      <div className="map-btn marker-add">
        <i className="fa icon-pin" onClick={this.handleToggleMarker}/>
      </div>
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

  renderMarkers = () => {

    const { markers } = this.state;
    //var bounds = new google.maps.LatLngBounds();
    var markerArray = [];

    markers.forEach((marker, index) => {
      const ref = `marker_${index}`;

      //bounds.extend(new google.maps.LatLng(marker.position));
      markerArray.push(<Marker key={ref} ref={ref}
        {...marker}
        title={(index+1).toString()}
        onClick={this.handleMarkerClick.bind(this, marker)} >
        {marker.showInfo ? this.renderInfoWindow(ref, marker) : null}
      </Marker>);
      
    });
    
    // FitBound 
    // console.log('bounds ==> ', bounds);
    // setTimeout(function(bounds){
    //   console.log('panToBounds', bounds, this._googleMapComponent.fitBounds);
    //   this._googleMapComponent.fitBounds(bounds);
    // }.bind(this, bounds), 1000)

    return markerArray;
  };

  renderInfoWindow = (ref, marker) => {

    let InfoContent = <div id={marker.key} className="infoWindow" 
      onClick={this.handleEditInfoWindowTitle.bind(this, marker)}>
      <div className="iw-title"><i className="fa fa-pencil-square-o" /> {marker.title}</div>
    </div>;

    if( !marker.canEdit ) {
      InfoContent = <div id={marker.key} className="infoWindow">{marker.title}</div>;
    }

    if( marker.isEditing ){
      InfoContent = <div id={marker.key} className="infoWindow">
        <div>
          <input type="text" className="place-name"
            defaultValue={marker.title}
            placeholder={'Input your place name'}
            autoFocus={true}
            onKeyDown={this.handleKeyDownInfoWindow.bind(this, marker)}
            /> 
        </div>
        <div>
          <button className="save-btn" onClick={this.handleEditInfoWindowTitleDone.bind(this, marker)}>SAVE</button>
          <button className="delete-btn" onClick={this.handleDeleteMarker.bind(this, marker)}>DEL</button>
        </div>
      </div>;
    }

    return (
      <InfoWindow key={`${ref}_info_window`} 
        onClick={this.handleInfoWindow}
        onCloseclick={this.handleCloseInfoWindow.bind(this, marker)}>
        {InfoContent}
      </InfoWindow>
    )    
  };

  handleBoundsChanged =()=> {
    this.setState({
      bounds: this.refs.map.getBounds(),
      center: this.refs.map.getCenter()
    });
  };

  handlePlacesChanged = () => {
    const places = this.refs.searchBox.getPlaces();
    let { markers } = this.state;
    let uniqLabelName = findUniqLabel(markers);

    // 검색창에서 검색한 마커를 지도에 꼽는다.
    places.forEach(function (place) {
      markers.push({
        position: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        },
        defaultAnimation: 5,
        title: place.name,
        label: uniqLabelName,
        key: Date.now(),
        showInfo: true,
        isEditing: true,
        canEdit: true
      });
    });

    // Set markers; set map center to first search result
    const mapCenter = markers.length > 0 ? markers[0].position : this.state.center;

    this.setState({
      moveToCenter:  true,
      center: mapCenter,
      markers: markers
    });

    return;
  };

  handleEditInfoWindowTitle = (marker) => {

    const { markers } = this.state;
    const clones = _.cloneDeep(markers)

    for( var i=0; i < clones.length ; ++i){
      if( clones[i].key === marker.key ){
        clones[i].isEditing = true;
        break;
      }
    }

    this.setState({markers: clones});
  };

  handleKeyDownInfoWindow = (marker, e) => {
    if(e.key === 'Enter') {
      this.handleEditInfoWindowTitleDone(marker, e);
    }
  };


  // 이게 사실상 저장!
  handleEditInfoWindowTitleDone = (editMarker, e) => {

    const {loginUser, noteState: {editingId}, notes} = this.props;
    const markerTitle = $(`#${editMarker.key} input`).val();
    const { markers } = this.state;
    const clones = _.cloneDeep(markers);

    if ( markerTitle === '' ){
      alert('palce name is empty!');
      return;
    } 

    for( var i=0; i < clones.length ; ++i){
      let marker = clones[i];

      if( marker.key === editMarker.key ){
        marker.isEditing = true;
        marker.title = markerTitle;
        marker.isEditing = false;
        marker.canEdit = true;

        if( typeof editMarker.position.lat === 'function') {
          marker.position = {
            lat : editMarker.position.lat(),
            lng : editMarker.position.lng()
          }
        }

        if( typeof editMarker.key === 'number') {
          // 지도에 핀을 꼽으면 DB에 임시로 마커를 저장한다
          this.props.addPlace(marker.key, 
            loginUser.id, editingId, marker.title, marker.label, 
            {lat: marker.position.lat, lng: marker.position.lng}
          );
        } else {

          // 임시핀이 아니면 이름만 수정한다.
          var note = notes[editingId];
          var redBookId = null;
          if( note ) {
            redBookId = note.redBook.objectId
          } 

          this.props.updatePlace(redBookId, editingId, marker);
        }

        break;
      }
    }
   
    this.setState({markers: clones});
    this.props.updateNoteState({
      places: clones
    });

  };

  handleMapClick =(event) =>{
    if( !this.state.isAddMarker ) { return false; }

    const { markers } = this.state;
    const clones = _.cloneDeep(markers);

    // 새로운 임시 마커를 추가
    clones.push({
      position: event.latLng,
      defaultAnimation: 5,
      title: '',
      label: findUniqLabel(markers),
      key: Date.now(),
      showInfo: true,
      isEditing: true 
    });

    this.setState({ 
      markers: clones,
      isAddMarker: false
    });

    this.props.updateNoteState({
      places: markers
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

    this.setState({markers: clones});
  };

  handleCloseInfoWindow = (marker) => {

    const { markers } = this.state;
    const clones = _.cloneDeep(markers);

    for( var i=0; i < clones.length ; ++i){
      if( clones[i].key === marker.key ){
        clones[i].showInfo = false;
        clones[i].isEditing = false;
        break;
      }
    }

    this.setState({markers: clones});
  };


  handleDeleteMarker = (marker) => {
    let yes = confirm('delete this marker');
    if( yes ){
      let {markers} = this.state;
      let newMarkers = _.without(markers, marker);

      this.setState({ markers : newMarkers });
      this.props.updateNoteState({
        places: newMarkers
      });
    }
  };

  handleToggleMarker = () => {
    this.setState({
      isAddMarker: !this.state.isAddMarker,
      moveToCenter: false
    });
  };

  handleMoveCenterToCurrentUser = () => {
    const { loginUser } = this.props;
    const {usedUserLocation} = this.state;
    
    if( !usedUserLocation ) {
      this.setState({
        usedUserLocation: true,
        moveToCenter:  true
      });
    } else{
      this.setState({
        usedUserLocation: false,
        moveToCenter:  false
      });
    }
  };

  handleClosePlaceMap = () => {

    let {markers} = this.state;
    let i=0, isEditing = false;

    for(; i<markers.length; ++i ){
      let marker = markers[i];
      if( marker.title.length === 0){
        marker.showInfo = true;
        marker.isEditing = true;
        isEditing = true;
      }
    }

    if(isEditing){
      this.setState({markers:markers});
      return alert('make sure your place name!');
    }

    this.props.updateNoteState({
      openMap: false
    })
  };
}

ControlMap.propTypes = {
  loginUser: PropTypes.object.isRequired,
  noteState: PropTypes.object.isRequired,
  updateNoteState: PropTypes.func.isRequired,

  // 외부 주입
  markers: PropTypes.array.isRequired,
  mapCenter : PropTypes.shape({
    lat: React.PropTypes.number,
    lng: React.PropTypes.number
  })
  
}

function mapStateToProps(state) {
  
  return {
    appState: state.appState,
    noteState: state.noteState,
    loginUser: state.login,
    notes: state.entities.notes
  }
}

export default connect(mapStateToProps, {
  updateNoteState, addPlace, updatePlace
})(ControlMap)
