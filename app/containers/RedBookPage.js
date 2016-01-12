import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { facebookLogin,updateLoginUserInfo,loadNotesByRedBookId, deleteNote, deleteComment, addComment, addNote } from '../actions'
import { pushPath as pushState, replacePath } from 'redux-simple-router'
import RedBookCover from '../components/RedBookCover'
import RedBookNoteForm from '../components/RedBookNoteForm'
import RedBookNoteList from '../components/RedBookNoteList'


function loadData(props) {
  const { redBook } = props

  if( redBook ){
    props.loadNotesByRedBookId( redBook.id )  
  }
  
}

class RedBookPage extends Component {

  componentWillMount(){

    if( this.props.redBook){
      loadData(this.props);  
    } else {
      console.log('페이지로 바로 접근한 경우에는 다음 업데이트때 책이 로드된다.!!')
    }
    
  }

  shouldComponentUpdate(nextProps, nextState) {
  
    if( nextProps.pageForRedBook.stateLoaded === 'OK' ) {
      if( !nextProps.redBook ){

        // 해당 정보북이 없으면 홈페이지로 이동시켜!
        this.props.pushState('/');
        return false;
      }
    }
    return true;

  }

  componentWillUpdate(nextProps, nextState){

    if( nextProps.redBook && !this.props.redBook){
      console.log('componentWillUpdate : 레드북 노트를 로드해줘~!!', nextProps.redBook, nextState)
      loadData(nextProps)
    }
    
  }

  renderListOfNotes = () => {

    const { notes, entities, redBook, countryName, cityName, loginUser } = this.props;

    if( !notes ){

      return <h2><i>{cityName} 정보북을 로드중입니다. </i></h2>
    }

    const ids = notes.ids || [];

    return <div className="RedBookPage">
      <RedBookCover 
        loginUser={loginUser} 
        redBook={redBook}
        onCloseRedBook={this.handleCloseRedBook} />
      <RedBookNoteForm 
        loginUser={loginUser}
        onAddNote={this.handleAddNote.bind(null, redBook.id)} />
      <RedBookNoteList
        loginUser={loginUser}
        notes={entities.notes} 
        ids={ids}
        onLogin={this.handleFacebookLogin}
        onDeleteNote={this.handleDeleteNote}
        onAddComment={this.handleAddComment}
        onDeleteComment={this.handleDeleteComment}
        />
      <div className="dimmed">
        <i className="fa fa-circle-o-notch fa-spin"></i>
      </div>
    </div>
  };

  render() {

    return (
      <div>
        {this.renderListOfNotes()}
      </div>
    )
  }

  handleFacebookLogin = () => {
    this.props.facebookLogin(this.props.updateLoginUserInfo);    
  };

  handleCloseRedBook = (e) => {

    this.props.replacePath('/')  

  };

  handleAddNote = (redBookId, noteText) => {
    this.props.addNote(redBookId, noteText, this.props.redBook.uname)    
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

  
}

RedBookPage.propTypes = {
  pageForRedBook: PropTypes.object.isRequired,
  pushState: PropTypes.func.isRequired,
  replacePath: PropTypes.func.isRequired,
  loadNotesByRedBookId: PropTypes.func.isRequired,
  facebookLogin: PropTypes.func.isRequired,
  addNote: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired
}

function mapStateToProps(state) {

  const {
    pagination: { notesByRedBookId },
    entities: { redBooks },
    routing: { path }
  } = state

  const uname = path.substr(1) 
  const [ cityName, countryName ] = uname.split(',');

  let redBookId = null;
  for ( let id in redBooks ){
    if( redBooks[id].uname === uname ){
      redBookId = id;
      break;
    }
  }

  return {
    pageForRedBook: state.pageForRedBook,
    loginUser: state.login,
    cityName: cityName,
    countryName: countryName,
    redBook: redBooks[redBookId],
    notes: notesByRedBookId[redBookId],
    entities: state.entities
  }
}

export default connect(mapStateToProps, {
  facebookLogin,
  updateLoginUserInfo,
  loadNotesByRedBookId,
  addNote,
  addComment,
  deleteNote,
  deleteComment,
  pushState,
  replacePath
})(RedBookPage)