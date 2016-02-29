import React, { Component, PropTypes } from 'react';

export default class RedBookStatistics extends Component {

  constructor(props) {
    super(props);

    this.state = {
      count: {
        city: 0,
        country: 0,
        note: 0,
        place: 0,
        user: 0,
        nationality: 0
      }
    }
  }

  // 외부에서 통계 카운드가 변경되면 내부에 반영한다.
  componentWillReceiveProps(nextProps){
    const { appState: {statCounts} } = nextProps;
    if ( statCounts ){
      this.setState({ count: statCounts });  
    }
  }

  // 통계 카운트가 달라질 경우에만 반영한다.
  shouldComponentUpdate(nextProps, nextState) {
    const { count } = nextState;
    return count !== this.state.count;
  }


  render(){

    var { count } = this.state;

    return <div className="RedBookStatistics">
      <div className="StaticCard">
        <div><strong>{count.city}</strong> cities in <strong>{count.country}</strong> countries</div>
        <div><strong>{count.note}</strong> notes & <strong>{count.place}</strong> places</div>
        <div><strong>{count.user}</strong> rlibrians of <strong>{count.nationality}</strong> countries</div>
        <div className="tagline">take this rlibro and travel all around world</div>
      </div>
    </div>

  }
}

RedBookStatistics.propTypes = {
  appState : PropTypes.object.isRequired
}
