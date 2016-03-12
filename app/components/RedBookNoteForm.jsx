import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { updateNoteState, resetAddNote, addNote } from '../actions'

import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import AttachedPlaces from '../components/AttachedPlaces';

export default class RedBookNoteForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      lineCount: 0
    }
  }

  componentWillReceiveProps(nextProps){

    const { noteState: { isFetching } } = nextProps;

    if( isFetching.addNote === 'DONE' ) {
      this.setState({
        lineCount: 0
      });
      
      this.props.updateNoteState({
        formText: ''
      });

      this.handleAddNoteDone();
    }
  }

  render() {

    const { loginUser } = this.props;
    const { lineCount } = this.state;
    const { noteState: {formMode} } = this.props;
    const { appState, noteState:{formText} } = this.props;

    let klassName = 'text';
    let style = {height:'54px'}

    if( 1 < lineCount ) {
      style = {
        height: `${18 + (18 * lineCount)}px`
      }
    }

    if( formText.length > 0){
      klassName += ' data-edits';
    }

    return <div className="RedBookNoteForm">
      <div className="note-form-header">
        <p className="markdown-help">
          <a href="https://guides.github.com/features/mastering-markdown/" target="_blank" data-ga-click="Markdown Toolbar, click, help">
            <svg aria-hidden="true" height="16" role="img" version="1.1" viewBox="0 0 16 16" width="16">
              <path d="M14.85 3H1.15C0.52 3 0 3.52 0 4.15v7.69C0 12.48 0.52 13 1.15 13h13.69c0.64 0 1.15-0.52 1.15-1.15V4.15C16 3.52 15.48 3 14.85 3zM9 11L7 11V8l-1.5 1.92L4 8v3H2V5h2l1.5 2 1.5-2 2 0V11zM11.99 11.5L9.5 8h1.5V5h2v3h1.5L11.99 11.5z"></path>
            </svg>
            Styling with Markdown is supported
          </a>
        </p>
      </div>

      <div className="textarea-placeholder">
        <textarea ref="textarea" className={klassName} style={style}
                  onKeyUp={this.handleFormKeyUp}
                  defaultValue={formText}>
        </textarea>
        <div>
          # TITLE
          <br /> ## SUB TITLE
          <br /> contents here
          <br /> 
          <br /> 
          <br /> also, you can make a link like this:
          <br /> [ LINK NAME ][ MARKER ID ]
          <br /> ex) [Rlibro][sWe3ns3kdj] is everywhere!
        </div>
      </div>


      <div className="note-form-footer">
        {/*this.renderAttachPlaces()*/}
        <AttachedPlaces 
          onInsertPlace={this.handleInsertPlace}
        />
        {this.renderPostButton()}
      </div>

    </div>
  };

  handleInsertPlace = (str) => {

    const node = findDOMNode(this.refs.textarea);
    node.value += str;
    this.props.updateNoteState({
      formText: node.value
    });   

  };

  renderPostButton = () => {
    const { noteState: { isFetching } } = this.props;

    if( isFetching.addNote === 'READY' ) {
      return <button onClick={this.handlePostNote}>Post</button>
    } 

    if( isFetching.addNote === 'REQUESTING') {
      return <button disabled>
        <i className="fa fa-spinner fa-pulse"></i>
      </button>
    }
  };

  handlePostNote = (e) => {

    const { noteState: { places} } = this.props; 
    const node = findDOMNode(this.refs.textarea);
    const text = node.value.trim();

    if( text.length === 0){
      return alert('the content is empty');
    }

    this.handleAddNote(text, places);    
    node.value = '';
    e.preventDefault()
  };

  handleFormKeyUp = (e) => {

    var length = e.target.value.length;
    if( length > 0) {
      e.target.className = 'text on data-edits';
    } else {
      e.target.className = 'text on';
    }

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

  handleAddNote = (noteText, markers) => {

    const { redBookId } = this.props;
    
    let placeIds = [];
     // 지도에 첨부된 마커(DB에 임시저장되어 있다) 
     // 키값(DB에 저장된 ID) 뽑아서 노트에 넣어준다.
    _.each(markers, function(marker){
      placeIds.push(marker.key);
    }.bind(this));

    this.props.addNote(redBookId, noteText, placeIds, markers); 
  };

  handleAddNoteDone = () => {
    this.props.resetAddNote();
    this.props.onClose();
  };
}

RedBookNoteForm.propTypes = {
  appState: PropTypes.object.isRequired,
  loginUser: PropTypes.object.isRequired,
  noteState: PropTypes.object.isRequired,
  updateNoteState: PropTypes.func.isRequired,

  // 외부 주입
  redBookId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const {
    pagination: { placesByRedBookId },
  } = state


  return {
    appState: state.appState,
    loginUser: state.login,
    noteState: state.noteState,
    
  }
}

export default connect(mapStateToProps, {
  updateNoteState, resetAddNote, addNote
})(RedBookNoteForm)
