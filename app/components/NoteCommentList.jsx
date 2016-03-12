import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import NoteCommentForm from '../components/NoteCommentForm'
import NoteComment from '../components/NoteComment'

class NoteCommentList extends Component {

  render() {

    const { comments, isOpenComment } = this.props;

    if( !isOpenComment ){
      return false;
    }

    return <div className="NoteCommentList">

      {comments.map( (comment,i) => {

        return <NoteComment key={i} 
          index={i}
          comment={comment}
          onDeleteComment={this.props.onDeleteComment.bind(this, comment.id)}
        />

      })}

      <NoteCommentForm 
        isOpenComment={this.props.isOpenComment}
        onAddComment={this.props.onAddComment}
      />
    
    </div>
  
  }
}

NoteCommentList.propTypes = {

  // 외부에서 주입
  comments: PropTypes.array.isRequired,
  isOpenComment: PropTypes.bool.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps, {
})(NoteCommentList)

