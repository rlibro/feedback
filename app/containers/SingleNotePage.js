import React, { Component, PropTypes } from 'react'
import { 
  fetchNote,
  fetchComments,
  addComment,
  deleteComment,
  resetUpdateNote
} from '../actions'
import { connect } from 'react-redux'
import { pushPath as pushState } from 'redux-simple-router'
import RedBookNote from '../components/RedBookNote'
import _ from 'lodash'

function fetchNoteFromServer(noteId, props) {
  props.fetchNote( noteId );
}

class SingleNotePage extends Component {
  
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
   * note를 못받으면 되돌려라!
   */
  componentWillReceiveProps(nextProps) {

    const { pageForRedBook: { isFetching }, notes, params:{noteId} } = nextProps;

    if( !isFetching.note && !notes[noteId] ) {
      this.props.pushState('/');
    }
  }

  /**
   * 초기로딩X, 프로퍼티나 state가 새로 설정되면 화면을 갱신할지 결정한다. 
   * 로딩 표시도 필요없고, 노트가 있어야 그린다.
   */
  shouldComponentUpdate(nextProps, nextState) {

    const {params:{noteId}, notes} = this.props;
    const note = nextProps.notes[noteId];

    if( note ){
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
      entitiyPlaces
    } = this.props;

    const note = notes[noteId];

    if( !note ){
      return false;
    }

    let comments = [], places=[];
    _.each(note.comments, function(commentId){
      const comment = entitiyComments[commentId];
      if( comment ){
        comments.push( comment );               
      }
    });

    return <div className="SingleNotePage">

      {this.props.children && 
        React.cloneElement(this.props.children, {
          note: note
        })
      }
      <RedBookNote loginUser={loginUser}
        pageForRedBook={pageForRedBook}
        note={note} 
        comments={comments}

        hideContextMenu={true}
        
        onLogin={this.handleFacebookLogin}
        onFetchComments={this.handleFetchComments}
        onAddComment={this.handleAddComment}
        onDeleteComment={this.handleDeleteComment}  
        onPushState={this.props.pushState}
        />
    </div>
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

}


SingleNotePage.propTypes = {
  children: PropTypes.node
};


function mapStateToProps(state) {

  const {
    entities: { notes, comments },
    routing: { path },
    pageForRedBook
  } = state


  return {
    notes,
    entitiyComments:comments,
    loginUser: state.login,
    pageForRedBook: pageForRedBook,
  }
}

export default connect(mapStateToProps, {
  fetchNote,
  fetchComments,
  addComment,
  deleteComment,
  resetUpdateNote,
  pushState
})(SingleNotePage)