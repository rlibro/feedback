import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { facebookLogin, updateAppState, updateLoginUserInfo, logOutUser } from '../actions'
import { findDOMNode } from 'react-dom';

class NoteCommentForm extends Component {

  constructor(props){
    super(props)
    this.state = { commentText: '' }
  }

  render() {

    const { loginUser } = this.props;

    if( !loginUser.id ) {
      return <div className="NoteCommentForm"> 
        if you leave a comment, please <a href="#" onClick={this.handleFacebookLogin}><i className="fa fa-facebook" />  login with facebook</a>
      </div>      
    } 

    return <div className="NoteCommentForm">
      <div className="profile photo">
        <img src={loginUser.picture} />
      </div>
      {this.renderCommentByState()}
    </div>
  }

  renderCommentByState = () => {

    const { noteState:{ stateAddComment } } = this.props;


    if( stateAddComment === 'READY') {
      return this.renderCommentReady();
    } 

    if (stateAddComment === 'REQUESTING') {
      return this.renderCommentRequesting();
    }

  };

  renderCommentReady = () => {
    return <div>
      <input className="text" 
        type="text" 
        placeholder="댓글을 입력하세요." 
        autoFocus={true}
        ref="cmtxt"
        onKeyPress={this.handleCheckEnter} />
      <button className="send" 
        onClick={this.handleSendComment}>입력</button>
    </div>
  };

  renderCommentRequesting = () => {

    return <div>
      <input className="text" type="text" disabled
        value={this.state.commentText}/>
      <div className="send">
        <i className="fa fa-spinner fa-pulse"></i>
      </div>
    </div>

  };

  
  handleCheckEnter = (e) => {
    if(e.key === 'Enter') {
      this.handleSendComment(e);
    }
  };

  handleSendComment = (e) => {

    const node = findDOMNode(this.refs.cmtxt);
    const text = node.value;

    if( text.length < 1 ) {
      alert('댓글이 비어 있습니다.');
      node.focus();
    
    } else {

      this.setState({
        commentText: text
      });

      this.props.onAddComment(text);
    }

  };

  handleFacebookLogin = (e) => {
    this.props.facebookLogin(function(result){

      this.props.updateAppState({
        tringLogin: false
      })

      if( result.success ){
        const userInfo = result.success.parseUser.toJSON();
        this.props.updateLoginUserInfo(userInfo);
      } else {

        Parse.FacebookUtils.unlink(
          Parse.User.current(), 
          function success(a){
            console.log('unlink success', a)
          }, 
          function error(b){
            console.log('unlink error', b)
          }
        );
        Parse.User.logOut();


        console.log(result.error);
        if( result.error.code === 190){
          this.handleLogOut();
        }

      }
      
    
    }.bind(this));
    e.preventDefault();
 
  };

}

NoteCommentForm.propTypes = {
  loginUser: PropTypes.object.isRequired,
  noteState: PropTypes.object.isRequired,

  // 외부에서 주입
  isOpenComment: PropTypes.bool.isRequired,
  onAddComment: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    loginUser: state.login,
    noteState: state.noteState,
  }
}

export default connect(mapStateToProps, {
  facebookLogin, updateAppState, updateLoginUserInfo, logOutUser
})(NoteCommentForm)