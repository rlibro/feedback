import React, { Component, PropTypes } from 'react'
import { 
  fetchNote,
  fetchComments,
  likeNote,
  addComment,
  deleteComment,
  resetUpdateNote
} from '../actions'
import { connect } from 'react-redux'
import { pushPath as pushState, replacePath } from 'redux-simple-router'
import RedBookNote from '../components/RedBookNote'
import _ from 'lodash'

function fetchNoteFromServer(noteId, props) {
  props.fetchNote( noteId );
}

class SingleNotePage extends Component {
  
  /** 
   * 최초 렌더링시 한번 호출됨.
   */
  componentWillMount(){

    const {params:{noteId}, notes} = this.props;

    // 페이지로 바로 접근한 경우에는 레드북이 패치된 다음에 업데이트 랜더링에서 처리한다. 
    if( !notes[noteId] ){
      fetchNoteFromServer(noteId, this.props);
    }
  }

  /**
   * 초기로딩X, 프로퍼티가 새로 설정되면, 내부 state에 업데이트할 기회를 제공한다.
   * note를 못받으면 되돌려라!
   */
  componentWillReceiveProps(nextProps) {

    const { noteState: { isFetching }, notes, params:{noteId} } = nextProps;

    if( !isFetching.note && !notes[noteId] ) {
      this.props.pushState('/');
    }
  }

  /**
   * 초기로딩X, 프로퍼티나 state가 새로 설정되면 화면을 갱신할지 결정한다. 
   * 로딩 표시도 필요없고, 노트가 있어야 그린다.
   */
  shouldComponentUpdate(nextProps, nextState) {

    const {params:{noteId}, notes} = this.props;
    const note = nextProps.notes[noteId];

    if( note ){
      return true;
    }

    return nextProps.notes[noteId] !== this.props.notes[noteId];
  }

  render() {

    const { 
      appState,
      routing,
      params:{noteId}, 
      loginUser, 
      noteState, 
      notes,
      entitiyComments, 
      entitiyPlaces
    } = this.props;

    const note = notes[noteId];

    if( !note ){
      return <div className="LoadingState Note">
        <div className="loading">
          <p><i className="fa fa-spinner fa-pulse"></i> Now loading a note, <br/>please wait a moment</p>
        </div>
      </div>;
    }

    let comments = [], places=[];
    _.each(note.comments, function(commentId){
      const comment = entitiyComments[commentId];
      if( comment ){
        comments.push( comment );               
      }
    });

    note.places.forEach(function(placeId){

      const place = entitiyPlaces[placeId];
      if( place ){
        places.push(place);
      }

    });

    return <div className="SingleNotePage">
      <div className="Navigation">
        <a className="return" href={`/guide/${note.redBook.uname}`} onClick={this.handleReturn.bind(this, note.redBook.uname)}>
          <i className="fa icon-return"></i> Back to the {note.redBook.cityName}
        </a>
      </div>

      {this.props.children && 
        React.cloneElement(this.props.children, {
          note: note
        })
      }
      
      <RedBookNote 
        appState={appState}
        routing={routing}
        loginUser={loginUser}
        noteState={noteState}
        note={note} 
        places={places}
        comments={comments}

        hideContextMenu={true}
        
        onLogin={this.handleFacebookLogin}
        onFetchComments={this.handleFetchComments}
        onAddComment={this.handleAddComment}
        onDeleteComment={this.handleDeleteComment}  
        onPushState={this.props.pushState}
        onLikeNote={this.props.likeNote}
        onUpdateNoteState={function(){}}
        onDeletePlace={function(){}}
        />
    </div>
  }

  handleReturn = (uname, e) => {

    
    const { routing } = this.props;
    let returnUrl = `/guide/${uname}`;
    e.preventDefault();

    if( routing.state && routing.state.referer ){
      returnUrl = routing.state.referer;
    }

    this.props.replacePath(returnUrl);
    
  };

  handleFacebookLogin = () => {
    this.props.facebookLogin(this.props.updateLoginUserInfo);    
  };

  handleFetchComments =(noteId)=>{
    this.props.fetchComments(noteId)
  };

  handleDeleteNote = (noteId) => {
    this.props.deleteNote(noteId, this.props.redBook.id);
  };

  handleDeleteComment = (noteId, commentId) => {
    this.props.deleteComment(commentId, noteId)
  };

  handleAddNoteDone = () => {
    this.props.resetAddNote();
  };

  handleAddComment = (noteId, commentText) => {
    this.props.addComment(noteId, commentText)
  };

}


SingleNotePage.propTypes = {
  appState: PropTypes.object.isRequired,
  children: PropTypes.node
};


function mapStateToProps(state) {

  const {
    appState,
    entities: { notes, comments, places },
    routing: { path },
    noteState
  } = state


  return {
    appState,
    notes,
    entitiyComments:comments,
    entitiyPlaces: places,
    loginUser: state.login,
    noteState: noteState,
    routing: state.routing
  }
}

export default connect(mapStateToProps, {
  fetchNote,
  fetchComments,
  likeNote,
  addComment,
  deleteComment,
  resetUpdateNote,
  pushState,
  replacePath
})(SingleNotePage)