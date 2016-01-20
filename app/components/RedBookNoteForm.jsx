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

    const { pageForRedBook: { isFetching } } = nextProps;

    if( isFetching.addNote === 'DONE' ) {
      this.setState({
        activeForm: false,
        lineCount: 0
      });
      
      this.props.onUpdateDataForRedBook({
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
    const { pageForRedBook: {formMode} } = this.props;

    let style = {height:'36px'}

    if( 1 < lineCount ) {
      style = {
        height: `${18 + (18 * lineCount)}px`
      }
    }

    if( formMode === 'NOTE') { return this.renderNoteForm(style) }
    if( formMode === 'PLACE'){ return this.renderPlaceForm(style) }
      
  };

  renderNoteForm = (style) => {
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
      {this.renderPostButton()}
    </div>
  };

  renderPlaceForm = (style) => {

    const { pageForRedBook: {places} } = this.props;

    return <div className="RedBookNoteForm">
      <div className="note-form-header">
        <button onClick={this.handleFormMode.bind(this,'NOTE')}>Note</button>
        <button onClick={this.handleFormMode.bind(this,'PLACE')} className="on">Place</button>
      </div>  
      <textarea ref="textarea" className="text" style={style}
                onKeyDown={this.handleFormKeyDown}
                onFocus={this.handeFormFocus}
                placeholder="[You can link your place like this][1]">
      </textarea>
      <div className="note-form-footer">
        <div className="references">
          <select ref="select">
            <option value="0">select a place to reference</option>
            {places.map(function(place, i){

              let refText = `[${place.title}][${place.label}]`;

              return <option key={i} value={refText}>{`[${place.label}]:${place.title}`}</option>
            })}
          </select>
          <button onClick={this.handleReferncePlace}>Add</button>
        </div>
        {this.renderPlacePostButton()}
      </div>
    </div>    

  };

  renderPostButton = () => {

    const { activeForm } = this.state;
    const { pageForRedBook: { isFetching } } = this.props;


    if( activeForm && isFetching.addNote === 'READY' ) {
      return <div className="note-form-footer">
        <button onClick={this.handleAddNote}>Post</button>
      </div>
    } 

    if( activeForm && isFetching.addNote === 'REQUESTING') {
      return <div className="note-form-footer">
        <button onClick={this.handleAddNote} disabled><i className="fa fa-spinner fa-pulse"></i></button>
      </div>
    }

  };

  renderPlacePostButton = () => {
    const { pageForRedBook: { isFetching } } = this.props;

    if( isFetching.addNote === 'READY' ) {
      return <button onClick={this.handleAddNote}>Post</button>
    } 

    if( isFetching.addNote === 'REQUESTING' ) {
      return <button onClick={this.handleAddNote} disabled><i className="fa fa-spinner fa-pulse"></i></button>
    } 
  };

  handleReferncePlace = (e) => {
    const node = findDOMNode(this.refs.textarea);
    const select = findDOMNode(this.refs.select);

    if( select.selectedIndex ) {
      node.value += '\n';
      node.value += select.value;
    }

    select.selectedIndex = 0;
    const lines = node.value.split('\n');

    node.style.height = (18*lines.length) + 'px'

  };

  handleAddNote = (e) => {

    const { pageForRedBook: {formMode, places} } = this.props; 
    const node = findDOMNode(this.refs.textarea);
    const text = node.value.trim();

    this.props.onAddNote(formMode, text, places);    
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
