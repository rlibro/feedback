import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

export default class RedBookNoteForm extends Component {

  /**
   * 상태가 변경되었을 경우는 호출됨
   */
  shouldComponentUpdate(nextProps, nextState) {
    const { loginUser } = nextProps;

    if( loginUser.id && loginUser.id !== this.props.loginUser.id ) {
      return true;
    } else if( loginUser && loginUser.current_location ) {
      return true;
    }
    return false;
  }

  render() {

    //console.log( 'RedBookNoteForm --> ', this.props.loginUser )

    const { loginUser } = this.props;
    return loginUser.id ? this.renderFormWrite() : false;
    
  }

  renderFormWrite = () => {
    const { loginUser } = this.props;

    return <div className="RedBookNoteForm">
      <div className="note-form-header">
        <button><i className="fa fa-chevron-right"/> 정보</button>
      </div>
  
      <textarea ref="textarea" className="text" autoFocus={true} placeholder="이 도시에서 경험한 유용한 정보를 공유하세요!"></textarea>
        
      <div className="note-form-footer">
        <button onClick={this.handleAddNote}>게시</button>
      </div>
    </div>
  };

  renderFormReady = () => {
    const { loginUser } = this.props;

    return <div className="RedBookNoteForm">
      <div className="note-form-header">
        <button>정보</button>
        <button>사진</button>
        <button>마커</button>
      </div>
  
      <textarea className="text" placeholder="이 도시에서 경험한 유용한 정보를 공유하세요!"></textarea>
    </div>
  };

  handleAddNote = (e) => {

    const node = findDOMNode(this.refs.textarea);
    const text = node.value.trim();
    this.props.onAddNote(text);
    node.value = '';
    e.preventDefault()
  };

}

RedBookNoteForm.propTypes = {
  loginUser: PropTypes.object.isRequired,
  onAddNote: PropTypes.func.isRequired
}
