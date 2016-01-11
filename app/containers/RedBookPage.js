import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadNotesByRedBookId, deleteNote, deleteComment, addComment, addNote } from '../actions'
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
  
  componentWillMount() {
    loadData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if( nextProps.redBook && !this.props.redBook){
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
        onDeleteNote={this.handleDeleteNote}
        onAddComment={this.handleAddComment}
        onDeleteComment={this.handleDeleteComment}
        />
      <div className="dimmed"></div>
    </div>
  };

  render() {

    return (
      <div>
        {this.renderListOfNotes()}
      </div>
    )
  }

  handleCloseRedBook = (e) => {

    if( history.length === 2) {
      this.props.replacePath('/')  
    }else{
      history.back()
    }
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
  pushState: PropTypes.func.isRequired,
  replacePath: PropTypes.func.isRequired,
  loadNotesByRedBookId: PropTypes.func.isRequired,
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
  const [ cityName, countryName ] = uname.split('-');

  let redBookId = null;
  for ( let id in redBooks ){
    if( redBooks[id].uname === uname ){
      redBookId = id;
      break;
    }
  }

  return {
    loginUser: state.login,
    cityName: cityName,
    countryName: countryName,
    redBook: redBooks[redBookId],
    notes: notesByRedBookId[redBookId],
    entities: state.entities
  }
}

export default connect(mapStateToProps, {
  loadNotesByRedBookId,
  addNote,
  addComment,
  deleteNote,
  deleteComment,
  pushState,
  replacePath
})(RedBookPage)