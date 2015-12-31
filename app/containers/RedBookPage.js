import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadNotesByRedBookId, submitNoteComment } from '../actions'
import RedBookCover from '../components/RedBookCover'
import RedBookNoteForm from '../components/RedBookNoteForm'
import RedBookNoteList from '../components/RedBookNoteList'


function loadData(props) {
  const { redBookId } = props
  props.loadNotesByRedBookId( redBookId )
}

class RedBookPage extends Component {
  
  componentWillMount() {
    loadData(this.props)
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.redBookId !== this.props.redBookId) {
      loadData(nextProps)
    }
  }

  // handleLoadMoreClick = () => {
  //   this.props.loadStarred(this.props.login, true)
  // }

  renderListOfNotes = () => {

    const { notes, entities, redBookName, loginUser } = this.props;
   
    if( !notes ){
      return <h2><i>{redBookName} 정보북을 로드중입니다. </i></h2>
    }

    const ids = notes.ids || [];



    return <div id="RedBookPage" className="border green">
      <RedBookCover />
      <RedBookNoteForm />
      <RedBookNoteList
        loginUser={loginUser}
        notes={entities.notes} 
        ids={ids}
        onSubmitComment={this.handleSubmitComment}/>

     {/* <ul>
      { ids.map((id, i) => {

        const note = entities.notes[id];

        return <li key={i}>
          {note.content}
        </li>

      }) }
      </ul>*/}
    </div>
   

  }

  render() {

    return (
      <div>
        {this.renderListOfNotes()}
      </div>
    )
  }

  handleSubmitComment = (noteId, commentText) => {
    
    this.props.submitNoteComment(noteId, commentText)

  }
}

RedBookPage.propTypes = {
  loadNotesByRedBookId: PropTypes.func.isRequired,
  submitNoteComment: PropTypes.func.isRequired
}

function mapStateToProps(state) {

  const {
    pagination: { notesByRedBookId },
    entities: { redBooks },
    routing: {state: { redBookId, redBookName }}
  } = state

  return {
    loginUser: state.login,
    redBookName,
    redBookId,
    notes: notesByRedBookId[redBookId],
    entities: state.entities
  }
}

export default connect(mapStateToProps, {
  loadNotesByRedBookId,
  submitNoteComment
})(RedBookPage)