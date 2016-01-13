import React, { Component, PropTypes } from 'react';

import NoteCommentForm from '../components/NoteCommentForm'
import NoteComment from '../components/NoteComment'
import moment from 'moment'

export default class NoteCommentList extends Component {

  renderCommentList = () => {

    const { loginUser, pageForRedBook, isOpenComment } = this.props;
    const { commentIds, entityComments } = this.props;
    const { onLogin, onAddComment, onDeleteComment } = this.props

    return <div className="NoteCommentList">

      {commentIds.map( (commentId,i) => {
        return <NoteComment key={i}
          index={i}
          comment={entityComments[commentId]}
          pageForRedBook={pageForRedBook}
          loginUser={loginUser}
          onDeleteComment={onDeleteComment.bind(null, commentId)}
          />
      })}

      <NoteCommentForm 
        loginUser={loginUser}
        pageForRedBook={pageForRedBook}
        isOpenComment={isOpenComment}
        onLogin={onLogin}
        onAddComment={onAddComment} />
    
    </div>
  };

  render() {

    const { comments, isOpenComment } = this.props

    if( isOpenComment ){
      return this.renderCommentList()
    }else{
      return false  
    }
    
  }
}

NoteCommentList.propTypes = {
  loginUser: PropTypes.object.isRequired,
  isOpenComment: PropTypes.bool.isRequired,
  pageForRedBook: PropTypes.object.isRequired,
  
  commentIds: PropTypes.array.isRequired,
  entityComments: PropTypes.object.isRequired,

  onLogin: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired
}
