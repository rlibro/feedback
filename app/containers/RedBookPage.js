import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { fetchNotes, fetchPlaces, updatePlace } from '../actions'

import RedBookCover from '../components/RedBookCover'
import ControlMap from '../components/ControlMap'
import RedBookNoteList from '../components/RedBookNoteList'

function fetchNotesFromServer(props) {
  const { redBook } = props

  if( redBook ){
    props.fetchNotes( redBook.id )
    props.fetchPlaces( {redBookId: redBook.id} ) 
  }
}

class RedBookPage extends Component {

  constructor(props){
    super(props);
    this.state = {}
  }

  /**
   * 최소에 한번만 호출된다
   * 레드북 정보는 물고오기 때문에 바로 관련 노트를 패치한다.
   */ 
  componentWillMount(){

    fetchNotesFromServer(this.props);
  }

  componentWillReceiveProps(nextProps) {

    const { redBook:{id}, pagingNotesByRedBookId, pagingPlacesByRedBookId } = nextProps;

    this.setState({
      sharedPlaces: pagingPlacesByRedBookId[id],
      notes: pagingNotesByRedBookId[id],
    });
  }

  /**
   * 최소 렌더링시에는 발생하지 않고 상태값이 변경되었을때만 렌더링 직전에 호출된다. 
   * 따라서 새롭게 로드된 레드북이 있다면 노트 정보도 로드하자! 
   * 단, 레드북이 없을수도 있다! 있는 경우에만 로드하자!
   */
  componentWillUpdate(nextProps, nextState){

    if( nextProps.redBook && !this.props.redBook){
      fetchNotesFromServer(nextProps)
    } 
  }

  /**
   * 렌더링 함수는 무조건 호출되기 때문에 레드북이 없으면 렌더링 하지 않는다.
   */
  render() {
    const { appState, loginUser, redBook, noteState } = this.props;
    let klassName = 'RedBookPage';

    // 레드북
    if( !redBook ) { return this.renderLoadingRedBook()}
    if( this.props.children ) { klassName = 'RedBookPage open-child' }
    if( noteState.openMap ) { klassName += ' open-map' }

    // 일단 커버와 입력폼을 로드한다. 
    return <div className={klassName} ref="redbook">
      {this.renderCover()} 
      {this.renderControlMap()}
      {this.renderNoteList()}
      {this.renderLoadingNotes()}

      <div className="dimmed"></div>

      {this.props.children && 
        React.cloneElement(this.props.children, {
          redBook: redBook
        })
      }
    </div>
  }

  renderCover = () => {
    const { loginUser, redBook, noteState, entities } = this.props;
    return <RedBookCover 
      redBook={redBook} 
      onLogin={this.props.onLogin}
      onLogOut={this.props.onLogOut}
    />
  };

  renderControlMap = () => {
    const { loginUser, redBook, noteState: {isEditing, openMap, places} } = this.props;
    
    if( isEditing && openMap ) {

      let markers = [];
      _.each(places, function(place){
        let marker = {
          key: place.key,
          canEdit: true,
          label: place.label,
          title: place.title,
          position: place.position,
          showInfo: place.showInfo || false,
          isEditing: place.isEditing || false,
          isNew: place.isNew || false
        }
        
        markers.push(marker)
      });

      return <ControlMap className="GoogleMap" 
        loginUser={loginUser}
        mapCenter={{
          lat: redBook.geo.latitude,
          lng: redBook.geo.longitude
        }}
        markers = {markers}
        disableMoveCenter={true}
      />
    } else {
      return false;
    }
  };


  renderLoadingRedBook = () => {

    const { cityName } = this.props;

    return <div className="RedBookPage">
      <div className="loading">
        <p>Now loading {cityName} infomation</p>
      </div>
    </div>
  };

  renderLoadingNotes = () => {
    const { notes } = this.state;

    if( !notes || notes.isFetching ) {

      return <div className="RedBookNoteList">
        <div className="loading">
          <p><i className="fa fa-spinner fa-pulse"></i> Now loading notes, <br/>please wait a moment</p>
        </div>
      </div>

    } else {
      return false;
    }
  };

  renderNoteList = () => {

    const { redBook, childPath, loginUser, entities, pagingCommentsByNoteId, noteState } = this.props;
    const { notes } = this.state;

    if( !notes ){
      return false;
    }

    if( !notes.isFetching && !notes.ids.length ) {
      return <div className="RedBookNoteList empty-note">
        there is no review yet, you can be the first.
      </div>
    }

    return <RedBookNoteList noteIds={notes.ids} />
  };
}

RedBookPage.propTypes = {
  noteState: PropTypes.object.isRequired,
  fetchNotes: PropTypes.func.isRequired,
  children: PropTypes.node
}

function mapStateToProps(state) {

  const {
    pagination: { notesByRedBookId, placesByRedBookId, commentsByNoteId },
    entities: { redBooks },
    routing: { locationBeforeTransitions: { pathname } },
    noteState
  } = state;

  return {
    appState: state.appState,
    childPath: pathname,
    noteState: noteState,
    loginUser: state.login,
    pagingNotesByRedBookId: notesByRedBookId,
    pagingCommentsByNoteId: commentsByNoteId,
    pagingPlacesByRedBookId: placesByRedBookId,
    entities: state.entities,
    routing: state.routing.locationBeforeTransitions
  }
}

export default connect(mapStateToProps, {
  fetchNotes, fetchPlaces
})(RedBookPage)