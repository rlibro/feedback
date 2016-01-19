import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

export default class RedBookNoteForm extends Component {

  constructor(props){
    super(props);

    this.state = {
      activeForm: false,
      lineCount: 0
    }
  }

  componentWillReceiveProps(nextProps){

    const { pageForRedBook: { addNote } } = nextProps;

    if( addNote && (addNote.state === 'SUCCESS') ) {
      this.setState({
        activeForm: false,
        lineCount: 0,
        formMode: 'NOTE'
      });

      this.props.onAddNoteDone();
    }
  }


  /**
   * 상태가 변경되었을 경우는 호출됨
   */
  shouldComponentUpdate(nextProps, nextState) {
    const { loginUser, pageForRedBook : {formMode} } = nextProps;

    if( formMode !== this.props.pageForRedBook.formMode){
      return true;
    }

    if( loginUser.id && loginUser.id !== this.props.loginUser.id ) {
      return true;
    } else if( loginUser && loginUser.current_location ) {
      return true;
    }
    return false;
  }

  render() {

    const { loginUser } = this.props;
    return loginUser.id ? this.renderFormByMode() : false;
    
  }


  renderFormByMode = () => {

    const { lineCount } = this.state;
    const { loginUser, pageForRedBook: {formMode} } = this.props;

    let style = {height:'36px'}

    if( 1 < lineCount ) {
      style = {
        height: `${18 + (18 * lineCount)}px`
      }
    }

    if( formMode === 'NOTE') {
      return <div className="RedBookNoteForm">
        <div className="note-form-header">
          <button onClick={this.handleFormMode.bind(this,'NOTE')} className="on">Note</button>
          <button onClick={this.handleFormMode.bind(this,'PLACE')}>Place</button>
        </div>  
        <textarea ref="textarea" className="text" style={style}
                  onKeyDown={this.handleFormKeyDown}
                  onFocus={this.handeFormFocus}
                  placeholder="Share your exprience in this city!">
        </textarea>
        {this.renderWriteForm()}
      </div>
    }

    if( formMode === 'PLACE'){
      return <div className="RedBookNoteForm">
        <div className="note-form-header">
          <button onClick={this.handleFormMode.bind(this,'NOTE')}>Note</button>
          <button onClick={this.handleFormMode.bind(this,'PLACE')} className="on">Place</button>
        </div>  
        <textarea ref="textarea" className="text" style={style}
                  onKeyDown={this.handleFormKeyDown}
                  onFocus={this.handeFormFocus}
                  placeholder="Share your exprience in this city!">
        </textarea>
        <div className="note-form-footer">
          <p className="message">위 상태로 당신의 위치를 공개 하겟습니까?</p>
          <button>공개</button>
        </div>
      </div>    
    }
    
  };

  renderWriteForm = () => {

    const { activeForm } = this.state;
    const { pageForRedBook: { addNote } } = this.props;


    if( activeForm && addNote.state === 'READY' ) {
      return <div className="note-form-footer">
        <button onClick={this.handleAddNote}>Post</button>
      </div>
    } 

    if( activeForm && addNote.state === 'REQUESTING' ) {
      return <div className="note-form-footer">
        <button onClick={this.handleAddNote} disabled><i className="fa fa-spinner fa-pulse"></i></button>
      </div>
    } 
  };

  handleAddNote = (e) => {

    const node = findDOMNode(this.refs.textarea);
    const text = node.value.trim();
    this.props.onAddNote(text);
    node.value = '';
    e.preventDefault()
  };

  handleFormMode = (mode, e) => {

    this.props.onUpdateDataForRedBook({
      formMode: mode
    });

  };

  handleFormKeyDown = (e) => {

    if(e.key === 'Enter' || e.key === 'Backspace') {

      const node = findDOMNode(this.refs.textarea);
      const text = node.value;

      var lineCount = text.split('\n').length;

      if( e.key === 'Backspace' ) {
        lineCount--;
      }

      this.setState({
        lineCount: lineCount
      });
    }

  };

  handeFormFocus = (e) => {
    this.setState({
      activeForm: true
    });

  };

}

RedBookNoteForm.propTypes = {
  loginUser: PropTypes.object.isRequired,
  pageForRedBook: PropTypes.object.isRequired,
  onUpdateDataForRedBook: PropTypes.func.isRequired,
  onAddNote: PropTypes.func.isRequired,
  onAddNoteDone: PropTypes.func.isRequired
}
