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
    const {isOpenComment} = this.state;

    const contentText = note.content
                        .replace(/(.*)\n(.*)/g, '<p>$1<br/></p><p>$2</p>')
                        .replace(/\s/g, '<span></span>')

    return <div className="RedBookNote">
      <div className="note-header">
        <div className="profile photo" >
          <img src={note.user.picture.data.url} />
        </div>
        <div className="meta">
          <div className="date">{ moment(note.createdAt).format('LLL') }</div>
          <div className="username">{ note.user.name }</div>
        </div>
      </div>
      <div className="content" dangerouslySetInnerHTML={{__html: contentText}}></div>
      <div className="controls">
        <div className="like">좋아요</div>
        <div className="dislike">싫어요</div>
        <div className="save">담기</div>
        <div className="comments" onClick={this.handleOpenComment}>댓글({note.comments.length})</div>
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
