import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { updateNoteState, resetUpdateNote,
         updateNote, deleteNote, likeNote, 
         updatePlace, deletePlace, 
         fetchComments, addComment, deleteComment } from '../actions'
import { findDOMNode } from 'react-dom';
import { render } from '../libs/markdown';
import moment from 'moment'

import NoteCommentList from '../components/NoteCommentList'
import ContextMenu from '../components/NoteContextMenu'
import AttachedPlaces from '../components/AttachedPlaces';

class RedBookNote extends Component {

  constructor(props) {
    super(props)

    this.state = {
      lineCount: 0,
      isEditing: false,
      isOpenContext: false,
      isOpenComment: false
    }
  }

  componentWillReceiveProps(nextProps){

    const { noteState: { editingId, stateNoteUpdate } } = nextProps;

    if( (editingId === this.props.note.id) && ( stateNoteUpdate === 'SUCCESS') ) {
      this.setState({
        lineCount: 0,
        isEditing: false,
        isOpenContext: false,
        isOpenComment: false
      });

      this.props.resetUpdateNote();
    }
  }

  render() {

    const { loginUser, noteState, note, comments } = this.props;
    const { isEditing, isOpenComment } = this.state;

    let klassName = 'RedBookNote';
    if( noteState.isEditing && (noteState.editingId !== note.id) ) {
      klassName += ' hide';
    }

    return <div id={note.id} className={klassName}>
      <div className="note-header">
        <div className="profile photo" >
          <img src={note.author.picture} />
        </div>
        <div className="meta">
          {this.renderDate(note)}
          <div className="username">{ note.author.username }</div>
          {function(){
            if(note.author.nationality){
              return <div className="country"><img src={`http://www.theodora.com/flags/new4/${note.author.nationality.replace(/\s/g,'_').toLowerCase()}-t.gif`}/></div>  
            }
          }()}
          </div>

        {this.renderContextMenu()}
        
      </div>
      {this.renderContentByState()}
      {this.renderControls()}

      <NoteCommentList 
        comments={comments}
        isOpenComment={isOpenComment}
        onAddComment={this.handleAddComment.bind(null, note.id)} 
        onDeleteComment={this.handleDeleteComment.bind(null, note.id)}
      />
    </div>
  }

  renderDate = (note) => {

    const hasUpdated = note.modifiedAt && (note.createdAt !== note.modifiedAt.iso);

    return <div className="date">

      <a href={`/notes/${note.id}`} onClick={this.handleMoveNote.bind(this, `/notes/${note.id}`)} >{ moment(note.createdAt).format('LLL') }</a>
      {function(){
        if( hasUpdated ) {
          return <p className="updated">{`updated ${moment(note.modifiedAt.iso).format('lll')}`}</p>
        }
      }()}
    </div>

  };

  handleAddComment = (noteId, commentText) => {
    this.props.addComment(noteId, commentText)
  };

  handleDeleteComment = (noteId, commentId) => {

    let yes = confirm('the comment will be deleted\nAre you sure?');
    if( yes ){
      this.props.deleteComment(commentId, noteId);
    }
  };


  renderContextMenu = () => {

    const { hideContextMenu, loginUser, note, noteState } = this.props;
    const { isOpenContext } = this.state;

    if( hideContextMenu || noteState.editingId ){
      return false;
    }

    return <div className="options">
      <button><i className="fa fa-angle-down" onClick={this.handleOpenContext} /></button>
      <ContextMenu 
        isOpenContext={isOpenContext}
        noteAuthor={note.author}
        onEditNote={this.handleEditNote.bind(this, note)}
        onDeleteNote={this.handleDeleteNote}
     />
    </div>

  };

  renderContentByState = ()=> {

    const { note, places, noteState: { stateNoteUpdate, editingId } } = this.props;
    const contentText = render(note.content, note.id, note.places, places);
    
    let style = {height:'36px'};
    let lineCount = this.state.lineCount ? this.state.lineCount : note.content.split('\n').length;

    if( 1 < lineCount ) {
      style = {
        height: `${18 + (18 * lineCount)}px`
      }
    }


    // 노트수정
    if( this.state.isEditing ) {

      // 수정 완료 요청
      if( (stateNoteUpdate === 'REQUESTING') && ( editingId === note.id )) {
        return <div className="edit-content" >
          <textarea defaultValue={note.content} style={style} ref="content" disabled
            tabIndex="1"></textarea>

          <div className="edit-controls">
            <button tabIndex="3" className="cancel" disabled>Cancel</button>
            <button tabIndex="2" className="save" disabled><i className="fa fa-spinner fa-pulse"></i></button>
          </div>
        </div>

      } else {
 
        // // 노트 수정폼
        // setTimeout(function(){
        //   const node = findDOMNode(this.refs.content);
        //   const len = node.value.length * 2;
        //   node.setSelectionRange(len, len);
        // }.bind(this), 0)

        return <div className="edit-content" >
          <textarea
            defaultValue={note.content}
            style={style} 
            ref="content"
            tabIndex="1"
            onKeyDown={this.handleFormKeyDown}
            autoFocus={true}></textarea>

          <div className="edit-controls">
            <AttachedPlaces
              onInsertPlace={this.handleInsertPlace}
            />

            <button tabIndex="3" className="cancel" onClick={this.handleCancelEditNote}>Cancel</button>
            <button tabIndex="2" className="save" onClick={this.handleSaveEditNote.bind(this, note)}>Save</button>
          </div>
        </div>
      }

      
    }else {
      return <div className="content" onClick={this.handleContentLink} dangerouslySetInnerHTML={{__html: contentText}}></div>  
    }
  };

  renderControls = () => {

    const { noteState: { editingId }} = this.props;

    if( editingId ){ 
      return false 
    } else {
      return <div className="controls">
        {/*<div className="like" onClick={this.handleToggleLike.bind(null, note.id)}><i className="fa fa-thumbs-o-up"/> </div>*/}
        {this.renderCommentControl()}
      </div>

    }
  };

  renderCommentControl = () => {
    const { note, noteState: {isFetching} }= this.props;
    let iconClass = 'fa fa-comments-o';

    if( isFetching.comments ){
      iconClass = 'fa fa-spinner fa-pulse';
    }

    return <div className="comments" onClick={this.handleToggleComment.bind(null, note.id)}>
      <i className={iconClass}/> Comments ({note.comments.length})
    </div>
  };

  handleInsertPlace = (str) => {

    const node = findDOMNode(this.refs.content);
    node.value += str;
    this.props.updateNoteState({
      formText: node.value
    });   

  };

  handleMoveNote = (url, e) => {

    browserHistory.push({
      pathname: url, 
      state: {referer: this.props.routing.pathname}
    });
    e.preventDefault();

  };

  handleContentLink = (e) => {

    const regNote = RegExp('\/notes\/(.*)\/?');
    
    if( e.target.tagName.toLowerCase() === 'a') {
      var match = regNote.exec(e.target.href);

      if(match){
        browserHistory.push(match[0]);
        window.scrollTo(0,0);
        e.preventDefault();
      } 
    }

  };


  handleFormKeyDown = (e) => {

    if(e.key === 'Enter' || e.key === 'Backspace') {
      
      const text = e.target.value;

      var lineCount = text.split('\n').length;

      if( e.key === 'Backspace' ) {
        lineCount--;
      }

      this.setState({
        lineCount: lineCount
      });

    }

  };
  handleCancelEditNote = () => {
    this.setState({
      isEditing: false
    });
    this.props.updateNoteState({
      isEditing: false, 
      editingId: null,
      openMap: false,
      formText: '',
      places: []
    });
  };

  handleSaveEditNote = (note, e) => {

    const node = findDOMNode(this.refs.content);
    const text = node.value.trim();
    const { noteState: { places } } = this.props;


    this.handleSaveEditingNote(note, text, places);
    this.props.updateNoteState({
      stateNoteUpdate: 'REQUESTING'
    })


    e.preventDefault();
  };

  /**
   * 노트를 수정할때 처리되는 곳
   */
  handleSaveEditingNote = (note, newText, places) => {

    let placeIds = [];
    let deletedPlaceId = note.places; 

    // 첨부된 최종 위치를 확인해서 새로운 것은 추가하고, 삭제된 녀석을 뽑아낸다. 
    _.each(places, function(place){

      this.props.updatePlace(note.redBook.objectId, note.id, place, true);

      placeIds.push(place.key);

      deletedPlaceId = _.without(deletedPlaceId, place.key);

    }.bind(this));

    // 기존에 등록된 위치중에 삭제할 녀석이 있다면 삭제 진행
    _.each(deletedPlaceId, function(placeId){
      this.props.deletePlace(placeId);
    }.bind(this));

    // 임시 위치 삭제
    this.props.updateNote(note.redBook.objectId, note.id, newText, placeIds);
  };

  handleToggleLike = (noteId, e) => {

    this.props.likeNote(noteId);

  };

  handleToggleComment = (noteId, e) => {

    const { isOpenComment } = this.state;

    if( !isOpenComment ){
       this.props.fetchComments(noteId) 
    }

    this.setState({
      isOpenComment: !isOpenComment
    });
  };

  handleOpenContext = (e) => {
    this.setState({
      isOpenContext : !this.state.isOpenContext
    })
  };

  handleEditNote = (note, e) => {

    this.setState({
      isEditing: true,
      isOpenContext: false
    });

    let places = [];

    this.props.places.forEach(function(place){
      places.push({
        canEdit: true,
        defaultAnimation: 5,
        isEditing: false,
        key: place.id,
        label: place.label,
        position: {
          lat: place.geo.latitude,
          lng: place.geo.longitude
        },
        showInfo: false,
        title: place.title
      })
    })

    this.props.updateNoteState({
      isEditing: true, 
      editingId: note.id,
      openMap: false,
      formText: note.content,
      places: places
    });

  };

  handleDeleteNote = (e) => {
    const { note } = this.props;

    this.props.deleteNote( note.id, note.redBook.objectId );
    this.setState({
      isOpenContext: false
    });
  };
}

RedBookNote.propTypes = {
  appState: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
  loginUser: PropTypes.object.isRequired,
  noteState: PropTypes.object.isRequired,

  updateNoteState: PropTypes.func.isRequired,
  
  updateNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  likeNote: PropTypes.func.isRequired,

  updatePlace: PropTypes.func.isRequired, 
  deletePlace: PropTypes.func.isRequired,

  fetchComments: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired, 
  deleteComment: PropTypes.func.isRequired,
  

  // 외부 주입
  note: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired
}

function mapStateToProps(state) {
  return {
    appState: state.appState, 
    routing: state.routing.locationBeforeTransitions,
    loginUser: state.login,
    noteState: state.noteState,
  }
}

export default connect(mapStateToProps, {
  updateNoteState, resetUpdateNote,
  updatePlace, deletePlace, updateNote,
  fetchComments, addComment, deleteComment, likeNote, deleteNote
})(RedBookNote)
