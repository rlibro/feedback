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

    const { note, loginUser, onSubmitComment } = this.props;
    const {isOpenComment} = this.state

    return <div className="RedBookNote">
      <div>{ moment(note.createdAt).format('LLL') } - {note.user.name}</div>
      <div dangerouslySetInnerHTML={{__html:note.content.replace(/\n/g,'<br/>')}}></div>
      <div className="controls">
        <div>좋아요</div>
        <div onClick={this.handleOpenComment}>댓글({note.comments.length})</div>
      </div>

      <NoteCommentList 
        loginUser={loginUser}
        comments={note.comments} 
        isOpenComment={isOpenComment}
        onSubmitComment={onSubmitComment.bind(null, note.id)} />
    </div>
  }
}

RedBookNote.propTypes = {
  loginUser: PropTypes.object.isRequired,
  note: PropTypes.object.isRequired,
  onSubmitComment: PropTypes.func.isRequired
}
