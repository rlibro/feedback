import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

export default class RedBookNoteForm extends Component {

  constructor(props){
    super(props);

    this.state = {
      activeForm: false,
      lineCount: 0,
      selectIndex: 0
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

  render() {

    const { loginUser } = this.props;
    return loginUser.id ? this.renderFormByMode() : false;
    
  }


  renderFormByMode = () => {

    const { lineCount } = this.state;
    const { pageForRedBook: {formMode} } = this.props;

    let style = {height:'54px'}

    if( 1 < lineCount ) {
      style = {
        height: `${18 + (18 * lineCount)}px`
      }
    }

    if( formMode === 'NOTE') { return this.renderNoteForm(style) }
    if( formMode === 'PLACE'){ return this.renderPlaceForm(style) }
      
  };

  renderNoteForm = (style) => {

    const { appState } = this.props;

    return <div className="RedBookNoteForm">
      <div className="note-form-header">
        <button onClick={this.handleFormMode.bind(this,'NOTE')} className="on">Note</button>
        {function(){

          if( appState.loadedGoogleSDK ) {
            return <button onClick={this.handleFormMode.bind(this,'PLACE')}>Place</button>    
          } else {
            return false
          }
        }.bind(this)()}
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

    return <div className="RedBookNoteForm">
      <div className="note-form-header">
        <button onClick={this.handleFormMode.bind(this,'NOTE')}>Note</button>
        <button onClick={this.handleFormMode.bind(this,'PLACE')} className="on">Place</button>
      </div>
      <div className="textarea-placeholder">
        <textarea ref="textarea" className="text" style={style}
                  onKeyDown={this.handleFormKeyDown}
                  onFocus={this.handeFormFocus}>
        </textarea>
        <div>
          you can make a link of the marker like this:
          <br /> [your link name][marker number]
          <br /> ex) [Rlibro][1] is everywhere!
        </div>
      </div>
      <div className="note-form-footer">
        <div className="references">
          {this.renderPlaceAddButton()}
        </div>
        {this.renderPlacePostButton()}
      </div>
    </div>    

  };

  renderSelectButton = () => {
    const { pageForRedBook: { places } } = this.props;

    if( places.length === 0 ){
      return <select ref="select" disabled style={{width: '200px'}}>
        <option value="0">click a map and add place </option>
      </select>
    } else {
      return <select ref="select" onChange={this.handleSelectPlace}>
        <option value="0">select a place to add note</option>
        {places.map(function(place, i){

          let refText = `[${place.title}][${place.label}]`;

          return <option key={i} value={refText}>{`[${place.label}]:${place.title}`}</option>
        })}
      </select>
    }
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

  renderPlaceAddButton = () => {

    if( 0 < this.state.selectIndex ) {
      return <button onClick={this.handleReferncePlace}>Add</button>
    } else {
      return false;
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

    var length = e.target.value.length;
    if( length > 0) {
      e.target.className = 'text data-edits';
    } else {
      e.target.className = 'text';
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

  handeFormFocus = (e) => {
    this.setState({
      activeForm: true
    });

  };

}

RedBookNoteForm.propTypes = {
  appState: PropTypes.object.isRequired,
  loginUser: PropTypes.object.isRequired,
  pageForRedBook: PropTypes.object.isRequired,
  onUpdateDataForRedBook: PropTypes.func.isRequired,
  onAddNote: PropTypes.func.isRequired,
  onAddNoteDone: PropTypes.func.isRequired
}
