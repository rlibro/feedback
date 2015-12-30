import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadNotesByRedBookId } from '../actions'
import RedBookCover from '../components/RedBookCover'


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

    const { notes, entities, redBookName } = this.props;
   
    if( !notes ){
      return <h2><i>{redBookName} 정보북을 로드중입니다. </i></h2>
    }

    const ids = notes.ids || [];

    return <div id="redbook">
      <RedBookCover />
      <ul>
      { ids.map((id, i) => {

        const note = entities.notes[id];

        return <li key={i}>
          {note.content}
        </li>

      }) }
      </ul>
    </div>
   

  }

  render() {

    return (
      <div>
        {this.renderListOfNotes()}
      </div>
    )
  }
}

RedBookPage.propTypes = {
  loadNotesByRedBookId: PropTypes.func.isRequired
}

function mapStateToProps(state) {

  const {
    pagination: { notesByRedBookId },
    entities: { redBooks },
    routing: {state: { redBookId, redBookName }}
  } = state

  return {
    redBookName,
    redBookId,
    notes: notesByRedBookId[redBookId],
    entities: state.entities
  }
}

export default connect(mapStateToProps, {
  loadNotesByRedBookId
})(RedBookPage)