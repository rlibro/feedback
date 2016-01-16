import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

export default class RedBookNoteForm extends Component {

  constructor(props){
    super(props);

    this.state = {
      formMode: 'NOTE'
    }
  }

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
    return loginUser.id ? this.renderFormByMode() : false;
    
  }


  renderFormByMode = () => {

    const { formMode } = this.state;
    const { loginUser } = this.props;
    

    if( formMode === 'NOTE') {
      return <div className="RedBookNoteForm">
        <div className="note-form-header">
          <button onClick={this.handleFormMode.bind(this,'NOTE')} className="on">Note</button>
          {/*<button onClick={this.handleFormMode.bind(this,'CHECKIN')}>장소</button>*/}
        </div>  
        <textarea ref="textarea" className="text" autoFocus={true} placeholder="Share your exprience in this city!"></textarea>
          
        <div className="note-form-footer">
          <button onClick={this.handleAddNote}>Post</button>
        </div>
      </div>
    }

    if( formMode === 'CHECKIN'){
      return <div className="RedBookNoteForm">
        <div className="note-form-header">
          <button onClick={this.handleFormMode.bind(this,'NOTE')}>Note</button>
          <button onClick={this.handleFormMode.bind(this,'CHECKIN')} className="on">장소</button>
        </div>  
        <div className="checkin-options">
          상태를 
        </div>          
        <div className="note-form-footer">
          <p className="message">위 상태로 당신의 위치를 공개 하겟습니까?</p>
          <button onClick={this.handleCheckIn}>공개</button>
        </div>
      </div>    
    }
    
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

  handleFormMode = (mode, e) => {
    this.setState({
      formMode: mode
    });
  };

  handleCheckIn = (e) => {
    
  };

}

RedBookNoteForm.propTypes = {
  loginUser: PropTypes.object.isRequired,
  onAddNote: PropTypes.func.isRequired
}
