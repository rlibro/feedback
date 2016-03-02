import React, { Component, PropTypes } from 'react';
import NoteCommentList from '../components/NoteCommentList'
import ContextMenu from '../components/RedBookNoteContextMenu'
import { findDOMNode } from 'react-dom';
import moment from 'moment'
import {render} from '../libs/markdown';
import AttachedPlaces from '../components/AttachedPlaces';

export default class RedBookNote extends Component {

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

      this.props.onSaveEditingNoteDone();
    }
  }

  render() {

    const { loginUser, noteState, note, comments } = this.props;
    const { onLogin, onAddComment, onDeleteNote, onDeleteComment} = this.props;
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
        loginUser={loginUser}
        comments={comments}
        noteState={noteState}

        onLogin={onLogin}
        isOpenComment={isOpenComment}
        onAddComment={onAddComment.bind(null, note.id)} 
        onDeleteComment={onDeleteComment.bind(null, note.id)}
        />
    </div>
  }

  renderDate = (note) => {

    const hasUpdated = note.modifiedAt && (note.createdAt !== note.modifiedAt.iso);

    return <div className="date">

      <a href={`/notes/${note.id}`} onClick={this.handleMoveNote} >{ moment(note.createdAt).format('LLL') }</a>
      {function(){
        if( hasUpdated ) {
          return <p className="updated">{`updated ${moment(note.modifiedAt.iso).format('lll')}`}</p>
        }
      }()}
    </div>

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
        loginUser={loginUser}
        noteState={noteState}
        noteAuthor={note.author}
        onEditNote={this.handleEditNote.bind(this, note)}
        onDeleteNote={this.handleDeleteNote}
        isOpenContext={isOpenContext} />
    </div>

  };

  renderContentByState = ()=> {

    const { note, places, noteState: { stateNoteUpdate, editingId } } = this.props;
    const contentText = render(note.content, note.id);
    
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
              appState={this.props.appState}
              noteState={this.props.noteState}
              onInsertPlace={this.handleInsertPlace}
              onUpdateNoteState={this.props.onUpdateNoteState}
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
    this.props.onUpdateNoteState({
      formText: node.value
    });   

  };

  handleMoveNote = (e) => {

    var link = e.target.href.split('notes')[1];
    this.props.onPushState('/notes' + link);
    e.preventDefault();

  };

  handleContentLink = (e) => {

    const regNote = RegExp('\/notes\/(.*)\/?');
    
    if( e.target.tagName.toLowerCase() === 'a') {
      var match = regNote.exec(e.target.href);

      if(match){
        this.props.onPushState(match[0]);
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
    this.props.onUpdateNoteState({
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


    this.props.onSaveEditingNote(note, text, places);
    this.props.onUpdateNoteState({
      stateNoteUpdate: 'REQUESTING'
    })


    e.preventDefault();
  };

  handleToggleLike = (noteId, e) => {

    this.props.onLikeNote(noteId);

  };

  handleToggleComment = (noteId, e) => {

    const { isOpenComment } = this.state;

    if( !isOpenComment ){
       this.props.onFetchComments(noteId) 
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

    this.props.onUpdateNoteState({
      isEditing: true, 
      editingId: note.id,
      openMap: false,
      formText: note.content,
      places: places
    });

  };

  handleDeleteNote = (e) => {
    this.props.onDeleteNote(this.props.note.id);
    this.setState({
      isOpenContext: false
    });
  };
}

RedBookNote.propTypes = {
  appState: PropTypes.object.isRequired,
  loginUser: PropTypes.object.isRequired,
  noteState: PropTypes.object.isRequired,
  note: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  onUpdateNoteState: PropTypes.func.isRequired,

  // 댓글관련 컨트롤은 로그인해야만 할수있다. 
  onLogin: PropTypes.func.isRequired,
  onFetchComments: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  onDeletePlace: PropTypes.func.isRequired,
  onLikeNote: PropTypes.func.isRequired,
  onPushState: PropTypes.func.isRequired
}
