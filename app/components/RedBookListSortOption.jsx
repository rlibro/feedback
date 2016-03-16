import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { updateAppState, changeSortOption } from '../actions'

class RedBookListSortOption extends Component {

  render(){
    const { appState: { sortBy } } = this.props;

    return <div className="RedBookListSortOption">
      <div className="content">
        <div className="title">Sort by</div>
        {function(){
          if( sortBy === 'update') {
            return <ul className="option-list">
              <li key={1} className="active">Update</li>
              <li key={2} onClick={this.handleChangeOption.bind(this, 'name')}>Name</li>    
            </ul>
          } else {
            return <ul className="option-list">
              <li key={1} onClick={this.handleChangeOption.bind(this, 'update')}>Update</li>
              <li key={2} className="active">Name</li>    
            </ul>
          }
        }.bind(this)()}
      </div>
    </div>
  }

  handleChangeOption = (option, e) => {
    this.props.updateAppState({sortBy: option});
    this.props.changeSortOption({sortBy: option});
  }
}

RedBookListSortOption.propTypes = {}

function mapStateToProps(state, ownProps) {
  return {
    routing: state.routing.locationBeforeTransitions,
    appState: state.appState
  }
}

export default connect(mapStateToProps, {
  updateAppState, changeSortOption
})(RedBookListSortOption)