import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadNotesByRedBookId, deleteNote, addNoteComment, addRedBookNote } from '../actions'
import { pushPath as pushState, replacePath } from 'redux-simple-router'
import RedBookCover from '../components/RedBookCover'
import RedBookNoteForm from '../components/RedBookNoteForm'
import RedBookNoteList from '../components/RedBookNoteList'


function loadData(props) {
  const { redBook } = props

  if( redBook ){

    console.log('RedBookPage loadNotes', redBook);
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
        onSubmitNote={this.handleSubmitNote.bind(null, redBook.id)} />
      <RedBookNoteList
        loginUser={loginUser}
        notes={entities.notes} 
        ids={ids}
        onDeleteNote={this.handleDeleteNote}
        onAddComment={this.handleAddComment}/>
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

  handleDeleteNote = (noteId) => {
    this.props.deleteNote(noteId, this.props.redBook.id);
  };

  handleAddComment = (noteId, commentText) => {
    
    this.props.addNoteComment(noteId, commentText)

  };

  handleSubmitNote = (redBookId, noteText) => {
    this.props.addRedBookNote(redBookId, noteText, this.props.redBook.uname)    
  };
}

RedBookPage.propTypes = {
  pushState: PropTypes.func.isRequired,
  replacePath: PropTypes.func.isRequired,
  loadNotesByRedBookId: PropTypes.func.isRequired,
  addRedBookNote: PropTypes.func.isRequired,
  addNoteComment: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired
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
  addRedBookNote,
  addNoteComment,
  deleteNote,
  pushState,
  replacePath
})(RedBookPage)