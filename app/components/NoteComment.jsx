import React, { Component, PropTypes } from 'react';
import moment from 'moment';

export default class NoteComment extends Component {

  constructor(props){
    super(props)

    this.state = {
      deletingIndex: -1
    }
  }

  renderDeleteButton = () => {

    const { comment, loginUser, index, pageForRedBook:{ stateDeleteComment } } = this.props;

    if( comment.author.id !== loginUser.id ){
      return false;
    }

    if( stateDeleteComment === 'READY' ){
      return <div className="option">
        <button className="delete" href="#" onClick={this.handleDeleteComment.bind(this, index)}>
          <i className="fa fa-times"/>
        </button>
      </div>  
    }

    if( stateDeleteComment === 'REQUESTING' && (index === this.state.deletingIndex) ){
      return <div className="option">
        <button className="delete" href="#" onClick={this.handleDeleteComment.bind(this, index)}>
          <i className="fa fa-spinner fa-pulse"/>
        </button>
      </div>  
    }
  };

  render(){

    const { comment } = this.props;

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

  handleDeleteComment = (index, e) => {

    this.setState({
      deletingIndex: index
    })

    this.props.onDeleteComment();
    
  };
}

NoteComment.propTypes = {
  index: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  loginUser: PropTypes.object.isRequired,
  pageForRedBook: PropTypes.object.isRequired,
  onDeleteComment: PropTypes.func.isRequired
}
