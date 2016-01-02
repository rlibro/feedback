import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadNotesByRedBookId, submitNoteComment, submitRedBookNote } from '../actions'
import { pushPath as pushState, replacePath } from 'redux-simple-router'
import RedBookCover from '../components/RedBookCover'
import RedBookNoteForm from '../components/RedBookNoteForm'
import RedBookNoteList from '../components/RedBookNoteList'


function loadData(props) {
  const { redBook, redBookId } = props

  if( redBook ){

    console.log('RedBookPage loadNotes', redBookId);
    props.loadNotesByRedBookId( redBookId )  
  }
  
}

class RedBookPage extends Component {
  
  componentWillMount() {

    console.log('RedBookPage componentWillMount ==> ', this.props)

    loadData(this.props)
  }

  componentWillReceiveProps(nextProps) {

    console.log('RedBookPage componentWillReceiveProps ==> ' , this.props, nextProps);

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
        onSubmitComment={this.handleSubmitComment}/>
      <div className="dimmed"></div>
    </div>
  }

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
  }

  handleSubmitComment = (noteId, commentText) => {
    
    this.props.submitNoteComment(noteId, commentText)

  }

  handleSubmitNote = (redBookId, noteText) => {
    this.props.submitRedBookNote(redBookId, noteText, this.props.redBook.uname)    
  }
}

RedBookPage.propTypes = {
  pushState: PropTypes.func.isRequired,
  replacePath: PropTypes.func.isRequired,
  loadNotesByRedBookId: PropTypes.func.isRequired,
  submitRedBookNote: PropTypes.func.isRequired,
  submitNoteComment: PropTypes.func.isRequired
}

function mapStateToProps(state) {

  const {
    pagination: { notesByRedBookId },
    entities: { redBooks },
    routing: { path }
  } = state

  const uname = path.substr(1) 
  const [ cityName, countryName ] = uname.split('-');

  return {
    loginUser: state.login,
    redBookId: uname,
    cityName: cityName,
    countryName: countryName,
    redBook: redBooks[uname],
    notes: notesByRedBookId[uname],
    entities: state.entities
  }
}

export default connect(mapStateToProps, {
  loadNotesByRedBookId,
  submitRedBookNote,
  submitNoteComment,
  pushState,
  replacePath
})(RedBookPage)