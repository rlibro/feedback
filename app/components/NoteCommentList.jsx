import React, { Component, PropTypes } from 'react';
import NoteCommentForm from '../components/NoteCommentForm'
import NoteComment from '../components/NoteComment'

export default class NoteCommentList extends Component {

  render() {

    const { isOpenComment } = this.props;

    if( isOpenComment ){
      return this.renderCommentList()
    }else{
      return false  
    }
  }

  renderCommentList = () => {

    const { 
      loginUser, 
      pageForRedBook,
      comments,
      isOpenComment,
      onLogin, onAddComment, onDeleteComment
    } = this.props;

    return <div className="NoteCommentList">

      {comments.map( (comment,i) => {

        return <NoteComment key={i}
          index={i}
          comment={comment}
          pageForRedBook={pageForRedBook}
          loginUser={loginUser}
          onDeleteComment={onDeleteComment.bind(null, comment.id)}
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
}

NoteCommentList.propTypes = {
  loginUser: PropTypes.object.isRequired,
  isOpenComment: PropTypes.bool.isRequired,
  pageForRedBook: PropTypes.object.isRequired,

  comments: PropTypes.array.isRequired,

  onLogin: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired
}
