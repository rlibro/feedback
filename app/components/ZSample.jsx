import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { updateAppState } from '../actions'

class ZSample extends Component {

  render(){
    return <div>샘플 컴포넌트</div>
  }
}

ZSample.propTypes = {
}

function mapStateToProps(state, ownProps) {
  return {
    routing: state.routing.locationBeforeTransitions
  }
}

export default connect(mapStateToProps, {
})(ZSample)