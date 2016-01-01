import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadNotesByRedBookId, submitNoteComment } from '../actions'
import { pushPath as pushState } from 'redux-simple-router'
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
        redBook={redBook} />
      <RedBookNoteForm loginUser={loginUser} />
      <RedBookNoteList
        loginUser={loginUser}
        notes={entities.notes} 
        ids={ids}
        onSubmitComment={this.handleSubmitComment}/>
      <div className="dimmed" onClick={this.handleCloseRedBook}></div>
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
  
    this.props.pushState('/');
  }

  handleSubmitComment = (noteId, commentText) => {
    
    this.props.submitNoteComment(noteId, commentText)

  }
}

RedBookPage.propTypes = {
  pushState: PropTypes.func.isRequired,
  loadNotesByRedBookId: PropTypes.func.isRequired,
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
  submitNoteComment,
  pushState
})(RedBookPage)