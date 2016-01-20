import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { facebookLogin, updateLoginUserInfo, updateDataForRedBook } from '../actions'
import { fetchNotes, 
         addNote, resetAddNote,
         updateNote, resetUpdateNote,
         deleteNote } from '../actions'
import { fetchComments, addComment, deleteComment } from '../actions'
import { pushPath as pushState, replacePath } from 'redux-simple-router'
import RedBookCover from '../components/RedBookCover'
import RedBookNoteForm from '../components/RedBookNoteForm'
import RedBookNoteList from '../components/RedBookNoteList'
import RedMapPlace from '../components/RedMapPlace'


function fetchNotesFromServer(props) {
  const { redBook } = props

  if( redBook ){
    props.fetchNotes( redBook.id )  
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
   * 로드된 레드북 노트목록과 캐싱 노트 목록을 비교해서 업데이트가 필요한 경우만 
   * 서버에서 다시 노트를 패치해온다.
   */ 
  componentWillMount(){

    // 페이지로 바로 접근한 경우에는 레드북이 패치된 다음에 업데이트 랜더링에서 처리한다. 
    if( this.props.redBook ){
      fetchNotesFromServer(this.props);
    }
  }

  /**
   * 상태가 변경되었을 경우는 레드북이 업데이트 된 경우다. 
   * 하지만 사용자가 직접 URL을 입력해 들어왔을 경우, 
   * 실제 레드북 정보가 없을수 있으므로 이럴때 무조건 홈으로 이동시켜버린다.
   */
  shouldComponentUpdate(nextProps, nextState) {
    const { redBook, pageForRedBook: {stateRedBook} , childPath} = nextProps;

    if( childPath.indexOf('people') > 1 ){
      return true;
    }
  
    if( stateRedBook === 'LOADED' && !redBook ) {
      this.props.replacePath('/')
      return false;
    }
    return true;
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
    const { loginUser, redBook, pageForRedBook } = this.props;
    let klassName = 'RedBookPage';

    // 레드북
    if( !redBook ) { return this.renderLoadingRedBook()}
    if( this.props.children ) { klassName = 'RedBookPage open-child' }

    // 일단 커버와 입력폼을 로드한다. 
    return <div className={klassName}>
      {this.renderCoverOrMap()}
      <RedBookNoteForm 
        loginUser={loginUser}
        pageForRedBook={pageForRedBook}
        onUpdateDataForRedBook={this.props.updateDataForRedBook}
        onAddNote={this.handleAddNote.bind(null, redBook.id)} 
        onAddNoteDone={this.handleAddNoteDone}
      />
      
      {this.renderNoteList()}
      {this.renderLoadingNotes()}

      <div className="dimmed"></div>

      {this.props.children}
    </div>
  }

  renderCoverOrMap = () => {
    const { loginUser, redBook, pageForRedBook } = this.props;
    const { formMode } = pageForRedBook;

    if( formMode === 'NOTE') {
      return <RedBookCover 
        loginUser={loginUser} 
        redBook={redBook}
        onPushState={this.props.pushState}
        onCloseRedBook={this.handleCloseRedBook} />
    }

    if( formMode === 'PLACE') {

      return <RedMapPlace className="RedMapPlace" 
        mapCenter={{
          lat: redBook.geo.latitude,
          lng: redBook.geo.longitude
        }}
        markers = {[]}
        onUpdateDataForRedBook={this.props.updateDataForRedBook}

      />
    }

  };

  renderLoadingRedBook = () => {

    const { pageForRedBook: { cityName } } = this.props;

    return <div className="RedBookPage">
      <div className="loading">
        <p>Now loading {cityName} infomation</p>
      </div>
    </div>
  };

  renderLoadingNotes = () => {
    const { notes } = this.props;

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

    const { redBook, childPath, loginUser, notes, entities, pagingCommentsByNoteId, pageForRedBook } = this.props;
    if( !notes ){
      return false;
    }


    return <RedBookNoteList
        loginUser={loginUser}
        pageForRedBook={pageForRedBook}
        entityNotes={entities.notes} 
        entityComments={entities.comments} 
        noteIds={notes.ids}
        pagingCommentsByNoteId={pagingCommentsByNoteId}
        
        onLogin={this.handleFacebookLogin}
        onPushState={this.handlePushState}
        onFetchComments={this.handleFetchComments}
        onSaveEditingNote={this.handleSaveEditingNote}
        onSaveEditingNoteDone={this.props.resetUpdateNote}
        onDeleteNote={this.handleDeleteNote}
        onAddComment={this.handleAddComment}
        onDeleteComment={this.handleDeleteComment}
        />
  };

  handleFacebookLogin = () => {
    this.props.facebookLogin(this.props.updateLoginUserInfo);    
  };

  handleCloseRedBook = (e) => {

    this.props.replacePath('/')  

  };

  handleFetchComments =(noteId)=>{
    this.props.fetchComments(noteId)
  };

  handleAddNote = (redBookId, formMode, noteText, places) => {
    this.props.addNote(redBookId, noteText, places);

    if( formMode === 'PLACE') {
      this.props.updateDataForRedBook({
        places: []
      });
    }  
  };

  handleAddNoteDone = () => {
    this.props.resetAddNote();
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
  
}

RedBookPage.propTypes = {
  pageForRedBook: PropTypes.object.isRequired,
  pushState: PropTypes.func.isRequired,
  replacePath: PropTypes.func.isRequired,
  fetchNotes: PropTypes.func.isRequired,
  facebookLogin: PropTypes.func.isRequired,
  addNote: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  children: PropTypes.node
}

function mapStateToProps(state) {

  const {
    pagination: { notesByRedBookId, commentsByNoteId },
    entities: { redBooks },
    routing: { path },
    pageForRedBook
  } = state

  let uname;

  if( path.indexOf('people') > 1) {
    uname = /\/guide\/(.*)\/people/.exec(path)[1];  
  } else {
    uname = path.split('/')[2];
  }
   
  const [ cityName, countryName ] = uname.split(',');

  pageForRedBook.cityName = cityName.replace('_', ' ');
  pageForRedBook.countryName = countryName.replace('_', ' ');


  let redBookId = null;
  for ( let id in redBooks ){
    if( redBooks[id].uname === uname ){
      redBookId = id;
      break;
    }
  }

  return {
    childPath: path,
    pageForRedBook: pageForRedBook,
    loginUser: state.login,
    redBook: redBooks[redBookId],
    notes: notesByRedBookId[redBookId],
    pagingCommentsByNoteId: commentsByNoteId,
    entities: state.entities
  }
}

export default connect(mapStateToProps, {
  facebookLogin,
  updateLoginUserInfo,
  updateDataForRedBook,
 
  fetchNotes,
  fetchComments,
  addNote,
  resetAddNote,
  addComment,
  updateNote,
  resetUpdateNote,
  deleteNote,
  deleteComment,

  pushState,
  replacePath
})(RedBookPage)