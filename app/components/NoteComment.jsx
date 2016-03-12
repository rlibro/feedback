import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import moment from 'moment';

class NoteComment extends Component {

  constructor(props){
    super(props)

    this.state = {
      deletingIndex: -1
    }
  }

  render(){

    const { comment } = this.props;

    if( !comment ){
      return false;     // 로딩중입니다... 
    } 

    return <div className="NoteComment">
      <div className="profile photo">
        <img src={comment.author.picture} />
      </div>
      <div className="comment-container">
        <p className="content">
          <span className="name">{comment.author.username}</span>
          <span>{comment.text}</span>
        </p>
        <div className="date">
          { moment(comment.createdAt).fromNow() }
        </div>
      </div>

      {this.renderDeleteButton()}
      
    </div>
  }

  renderDeleteButton = () => {

    const { comment, loginUser, index, noteState:{ stateDeleteComment } } = this.props;

    if( comment.author.id !== loginUser.id ){
      return false;
    }

    if( stateDeleteComment === 'READY' ){
      return <div className="option">
        <button className="delete" href="#" onClick={this.handleDeleteComment.bind(this, comment)}>
          <i className="fa fa-times"/>
        </button>
      </div>  
    }

    if( stateDeleteComment === 'REQUESTING' && (index === this.state.deletingIndex) ){
      return <div className="option on">
        <button className="delete" href="#">
          <i className="fa fa-spinner fa-pulse"/>
        </button>
      </div>  
    }
  };

  handleDeleteComment = (index, e) => {

    this.setState({
      deletingIndex: index
    })

    this.props.onDeleteComment();
    
  };
}

NoteComment.propTypes = {
  loginUser: PropTypes.object.isRequired,
  noteState: PropTypes.object.isRequired,

  // 외부 주입
  index: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  onDeleteComment: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    loginUser: state.login,
    noteState: state.noteState,
  }
}

export default connect(mapStateToProps, {
})(NoteComment)

