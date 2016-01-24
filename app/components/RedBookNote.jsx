import React, { Component, PropTypes } from 'react';
import NoteCommentList from '../components/NoteCommentList'
import ContextMenu from '../components/RedBookNoteContextMenu'
import { findDOMNode } from 'react-dom';
import moment from 'moment'

import { Provider } from 'react-redux'

export default class RedBookNote extends Component {

  constructor(props) {
    super(props)

    this.state = {
      lineCount: 0,
      isEditing: false,
      isOpenContext: false,
      isOpenComment: false,
      isInitialEditing: true,
      scrollTop: 0
    }
  }

  componentWillReceiveProps(nextProps){

    const { pageForRedBook: { updateNote } } = nextProps;

    if( updateNote && (updateNote.id === this.props.note.id) && (updateNote.state === 'SUCCESS') ) {
      this.setState({
        lineCount: 0,
        isEditing: false,
        isOpenContext: false,
        isOpenComment: false,
        isInitialEditing: true,
        scrollTop: 0
      });

      this.props.onSaveEditingNoteDone();
    }
  }

  render() {

    const { loginUser, pageForRedBook, note, comments } = this.props;
    const { onLogin, onAddComment, onDeleteNote, onDeleteComment} = this.props;
    const { isEditing, isOpenComment, scrollTop, isInitialEditing } = this.state;

    if( isEditing && scrollTop && isInitialEditing ){
      setTimeout(function(){
        document.body.scrollTop = scrollTop
      }, 0)
    }

    return <div id={note.id} className="RedBookNote">
      <div className="note-header">
        <div className="profile photo" >
          <img src={note.author.picture} />
        </div>
        <div className="meta">
          <div className="date">{ moment(note.createdAt).format('LLL') }</div>
          <div className="username">{ note.author.username }</div>
          <div className="country"><img src={`http://www.theodora.com/flags/new4/${note.author.location.country.replace(/\s/g,'_').toLowerCase()}-t.gif`}/></div>
        </div>

        {this.renderContextMenu()}
        
      </div>
      {this.renderContentByState()}
      <div className="controls">
 {/*       <div className="like"><i className="fa fa-thumbs-o-up"/> 추천</div>*/}
        <div className="comments" onClick={this.handleToggleComment.bind(null, note.id)}><i className="fa fa-comments-o"/> Comments ({note.comments.length})</div>
      </div>

      <NoteCommentList 
        loginUser={loginUser}


        comments={comments}

        pageForRedBook={pageForRedBook}

        onLogin={onLogin}
        isOpenComment={isOpenComment}
        onAddComment={onAddComment.bind(null, note.id)} 
        onDeleteComment={onDeleteComment.bind(null, note.id)}
        />
    </div>
  }

  renderContextMenu = () => {

    const { hideContextMenu, loginUser, note } = this.props;
    const { isOpenContext } = this.state;

    if( hideContextMenu ){
      return false;
    }

    return <div className="options">
      <button><i className="fa fa-angle-down" onClick={this.handleOpenContext} /></button>
      <ContextMenu 
        loginUser={loginUser}
        noteAuthor={note.author}
        onEditNote={this.handleEditNote}
        onDeleteNote={this.handleDeleteNote}
        isOpenContext={isOpenContext} />
    </div>

  };

  renderContentByState = ()=> {

    const { note, pageForRedBook: {noteUpdate}} = this.props;
    const contentText = 
      note.content
        .replace(/\[([^\[\]]*)\]\[(\d+)\]/g, `<a target="_blank" href="/notes/${note.id}/places/$2"><i class="fa fa-map-signs"></i> $1</a>`)
        .replace(/(.*)\n\n(.*)/g, '<p>$1</p><br/><p>$2</p>')
        .replace(/(.*)\n(.*)/g, '<p>$1</p><p>$2</p>')
        .replace(/\s\s/g, '<span></span>');

    let style = {height:'36px'};
    let lineCount = this.state.lineCount ? this.state.lineCount : note.content.split('\n').length;

    if( 1 < lineCount ) {
      style = {
        height: `${18 + (18 * lineCount)}px`
      }
    }


    if( this.state.isEditing ) {

      // 수정 완료 요청
      if( noteUpdate && ( noteUpdate.state === 'REQUESTING') && ( noteUpdate.id === note.id )) {
        return <div className="edit-content" >
          <textarea defaultValue={note.content} style={style} ref="content" disabled
            tabIndex="1"></textarea>

          <div className="edit-controls">
            <button tabIndex="3" className="cancel" disabled>Cancel</button>
            <button tabIndex="2" className="save" disabled><i className="fa fa-spinner fa-pulse"></i></button>
          </div>
        </div>

      } else {

        if( this.state.isInitialEditing ){
          setTimeout(function(){
            const node = findDOMNode(this.refs.content);
            const len = node.value.length * 2;
            node.setSelectionRange(len, len);
            this.setState({
              isInitialEditing: false
            })
          }.bind(this), 0)
        }

        return <div className="edit-content" >
          <textarea
            defaultValue={note.content}
            style={style} 
            ref="content"
            tabIndex="1"
            onKeyDown={this.handleFormKeyDown}
            autoFocus={true}></textarea>

          <div className="edit-controls">
            <button tabIndex="3" className="cancel" onClick={this.handleCancelEditNote}>Cancel</button>
            <button tabIndex="2" className="save" onClick={this.handleSaveEditNote.bind(this, note)}>Save</button>
          </div>
        </div>
      }

      
    }else {
      return <div className="content" onClick={this.handleContentLink} dangerouslySetInnerHTML={{__html: contentText}}></div>  
    }
  };

  handleContentLink = (e) => {

    var link = e.target.href.split('notes')[1];
    this.props.onPushState('/notes' + link);
    window.scrollTo(0,0);
    e.preventDefault();

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
  };

  handleSaveEditNote = (note, e) => {

    const node = findDOMNode(this.refs.content);
    const text = node.value.trim();
    this.props.onSaveEditingNote(note, text);
    e.preventDefault();
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

  handleEditNote = (e) => {

    this.setState({
      isEditing: true,
      isOpenContext: false,
      scrollTop: document.body.scrollTop
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
  loginUser: PropTypes.object.isRequired,
  pageForRedBook: PropTypes.object.isRequired,
  note: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,


  // 댓글관련 컨트롤은 로그인해야만 할수있다. 
  onLogin: PropTypes.func.isRequired,
  onFetchComments: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  onPushState: PropTypes.func.isRequired
}
