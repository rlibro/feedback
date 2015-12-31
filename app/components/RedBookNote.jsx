import React, { Component, PropTypes } from 'react';
import NoteCommentList from '../components/NoteCommentList'
import moment from 'moment'

export default class RedBookNote extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isOpenComment: false
    }
  }

  handleOpenComment = (e) => {
    this.setState({
      isOpenComment : !this.state.isOpenComment
    })
  }

  render = () => {

    const { note } = this.props;
    const {isOpenComment} = this.state

    return <div className="RedBookNote border blue">
      <div>{ moment(note.createdAt).format('LLL') } - {note.user.name}</div>
      <div>{note.content}</div>
      <div className="controls">
        <div>좋아요</div>
        <div onClick={this.handleOpenComment}>댓글({note.comments.length})</div>
      </div>

      <NoteCommentList 
        comments={note.comments} 
        isOpenComment={isOpenComment}
        onSubmitComment={this.props.onSubmitComment.bind(null, note.id)} />
    </div>
  }
}

RedBookNote.propTypes = {
  note: PropTypes.object.isRequired,
  onSubmitComment: PropTypes.func.isRequired
}
