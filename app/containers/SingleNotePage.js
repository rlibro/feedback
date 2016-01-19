import React, { Component, PropTypes } from 'react'
import { 
  fetchNote,
  updateNote,
  fetchComments,
  addComment,
  deleteComment,
  resetUpdateNote,

} from '../actions'
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import RedBookNote from '../components/RedBookNote'

function fetchNoteFromServer(noteId, props) {
  props.fetchNote( noteId )  
}

class SingleNotePage extends Component {
  
  constructor(props){
    super(props);
  }

  /** 
   * 최초 렌더링시 한번 호출됨.
   */
  componentWillMount(){

    const {params:{noteId}, notes} = this.props;


    // 페이지로 바로 접근한 경우에는 레드북이 패치된 다음에 업데이트 랜더링에서 처리한다. 
    if( !notes[noteId] ){
      fetchNoteFromServer(noteId, this.props);
    }
  }

  /**
   * 초기로딩X, 프로퍼티가 새로 설정되면, 내부 state에 업데이트할 기회를 제공한다.
   */
  componentWillReceiveProps(nextProps) {
    // this.setState({
    //   likesIncreasing: nextProps.likeCount > this.props.likeCount
    // });
  }

  /**
   * 초기로딩X, 프로퍼티나 state가 새로 설정되면 화면을 갱신할지 결정한다. 
   * 로딩 표시도 필요없고, 노트가 있어야 그린다.
   */
  shouldComponentUpdate(nextProps, nextState) {

    const {params:{noteId}, notes} = this.props;
    const note = nextProps.notes[noteId];

    if( note){
      return true;
    }



    return nextProps.notes[noteId] !== this.props.notes[noteId];
  }

  render() {

    const { 
      params:{noteId}, 
      loginUser, 
      pageForRedBook, 
      notes, 
      entitiyComments, 
      places
    } = this.props;

    const note = notes[noteId];

    if( !note ){
      return false;
    }

    let comments = [];
    note.comments.forEach(function(commentId){

      const comment = entitiyComments[commentId];
      if( comment ){
        comments.push( comment );               
      }
  
    });


    return <RedBookNote loginUser={loginUser}
      pageForRedBook={pageForRedBook}
      note={note} 
      comments={comments}

      hideContextMenu={true}
      
      onLogin={this.handleFacebookLogin}
      onFetchComments={this.handleFetchComments}
      onAddComment={this.handleAddComment}
      onDeleteComment={this.handleDeleteComment}  
      />
  }

  handleFacebookLogin = () => {
    this.props.facebookLogin(this.props.updateLoginUserInfo);    
  };

  handleFetchComments =(noteId)=>{
    this.props.fetchComments(noteId)
  };

  handleDeleteNote = (noteId) => {
    this.props.deleteNote(noteId, this.props.redBook.id);
  };

  handleDeleteComment = (noteId, commentId) => {
    this.props.deleteComment(commentId, noteId)
  };

  handleAddNoteDone = () => {
    this.props.resetAddNote();
  };

  handleAddComment = (noteId, commentText) => {
    this.props.addComment(noteId, commentText)
  };

  handleSaveEditingNote = (note, newText) => {

    this.props.updateNote(this.props.redBook.id, note.id, newText);

  };



}


SingleNotePage.propTypes = {
};


function mapStateToProps(state) {

  const {
    entities: { notes, comments, places },
    routing: { path },
    pageForRedBook
  } = state


  return {
    notes,
    entitiyComments:comments,
    places,
    loginUser: state.login,
    pageForRedBook: pageForRedBook,
  }
}

export default connect(mapStateToProps, {
  fetchNote,
  updateNote,
  fetchComments,
  addComment,
  deleteComment,
  resetUpdateNote,

})(SingleNotePage)