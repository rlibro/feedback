import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { facebookLogin, updateLoginUserInfo, updateDataForRedBook } from '../actions'
import { fetchNotes, fetchPlaces,
         updateNote, resetUpdateNote,
         deleteNote, likeNote } from '../actions'
import { fetchComments, addComment, deleteComment } from '../actions'
import { pushPath as pushState } from 'redux-simple-router'
import RedBookCover from '../components/RedBookCover'
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

    this.state = {
      isEditingNote: false,
      editingNote: null
    }
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
    const { appState, loginUser, redBook, pageForRedBook } = this.props;
    let klassName = 'RedBookPage';

    // 레드북
    if( !redBook ) { return this.renderLoadingRedBook()}
    if( this.props.children ) { klassName = 'RedBookPage open-child' }

    // 일단 커버와 입력폼을 로드한다. 
    return <div className={klassName} ref="redbook">
      {this.renderCover()}
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
    const { loginUser, redBook, pageForRedBook, entities } = this.props;
    return <RedBookCover 
      loginUser={loginUser} 
      redBook={redBook}
      onPushState={this.props.pushState}
      onCloseRedBook={this.handleCloseRedBook} />
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

    const { redBook, childPath, loginUser, entities, pagingCommentsByNoteId, pageForRedBook } = this.props;
    const { notes } = this.state;

    if( !notes ){
      return false;
    }

    if( !notes.isFetching && !notes.ids.length ) {
      return <div className="RedBookNoteList empty-note">
        there is no review yet, you can be the first.
      </div>
    }



    return <RedBookNoteList
        loginUser={loginUser}
        pageForRedBook={pageForRedBook}
        entityNotes={entities.notes} 
        entityComments={entities.comments} 
        noteIds={notes.ids}
        pagingCommentsByNoteId={pagingCommentsByNoteId}
        
        onLogin={this.handleFacebookLogin}
        onPushState={this.props.pushState}
        onFetchComments={this.handleFetchComments}
        onSaveEditingNote={this.handleSaveEditingNote}
        onSaveEditingNoteDone={this.props.resetUpdateNote}
        onDeleteNote={this.handleDeleteNote}
        onAddComment={this.handleAddComment}
        onDeleteComment={this.handleDeleteComment}
        onLikeNote={this.handleLikeNote}
        />
  };

  handleFacebookLogin = () => {
    this.props.facebookLogin(this.props.updateLoginUserInfo);    
  };

  handleCloseRedBook = (e) => {
    this.props.updateDataForRedBook({ places: [] });
    this.props.pushState('/');
  };

  handleFetchComments =(noteId)=>{
    this.props.fetchComments(noteId)
  };

  handleAddComment = (noteId, commentText) => {
    this.props.addComment(noteId, commentText)
  };

  handleDeleteNote = (noteId) => {
    this.props.deleteNote(noteId, this.props.redBook.id);
  };

  handleDeleteComment = (noteId, commentId) => {
    this.props.deleteComment(commentId, noteId)
  };

  handleSaveEditingNote = (note, newText) => {
    this.props.updateNote(this.props.redBook.id, note.id, newText);
  };

  handleLikeNote = (noteId) => {
    this.props.likeNote(noteId);
  };
  
}

RedBookPage.propTypes = {
  pageForRedBook: PropTypes.object.isRequired,
  pushState: PropTypes.func.isRequired,
  fetchNotes: PropTypes.func.isRequired,
  facebookLogin: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  children: PropTypes.node
}

function mapStateToProps(state) {

  const {
    pagination: { notesByRedBookId, placesByRedBookId, commentsByNoteId },
    entities: { redBooks },
    routing: { path },
    pageForRedBook
  } = state

  return {
    appState: state.appState,
    childPath: path,
    pageForRedBook: pageForRedBook,
    loginUser: state.login,
    pagingNotesByRedBookId: notesByRedBookId,
    pagingCommentsByNoteId: commentsByNoteId,
    pagingPlacesByRedBookId: placesByRedBookId,
    entities: state.entities
  }
}

export default connect(mapStateToProps, {
  facebookLogin,
  updateLoginUserInfo,
  updateDataForRedBook,
 
  fetchNotes,
  fetchPlaces,
  fetchComments,
  addComment,
  updateNote,
  resetUpdateNote,
  deleteNote,
  deleteComment,
  likeNote,

  pushState
})(RedBookPage)