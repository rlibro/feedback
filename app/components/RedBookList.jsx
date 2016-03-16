import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { fetchRedBooks, findThisKeyWord } from '../actions'

import RedBook from '../components/RedBook';

import RedBookListByCountry from '../components/RedBookListByCountry';
import RedBookStatics from '../components/RedBookStatistics';
import _ from 'lodash';

function insertAdsenceBetweenCards(cards){

  const adCount = (6 - cards.length % 6);
  let startIndex = 2;
  
  for(let i=0; i<adCount; ++i){
    let length  = cards.length;

    // 광고 배열 위치
    const adIndex = 2+Math.floor((i+1)/2)*5+Math.floor(i/2)*7
    //const adIndex =1/2*(12 * (i+1)-Math.pow(-1,i+1)-9)
    console.log(adIndex);

    const start = cards.slice(0, adIndex);
    const last  = cards.slice(adIndex, length);
    start.push({id:'adsence'});
    cards = start.concat(last);
  }

  return cards;
}

class RedBookList extends Component {

  /**
   * 레드북 목록을 가져오거나 사용자의 위치정보가 업데이트 된 경우에만 다시 그림
   */
  shouldComponentUpdate(nextProps, nextState) {
    const { redBooks: {isFetching}, loginUser } = nextProps;

    if( !isFetching || (loginUser && loginUser.current_location) ) {   
      return true;
    }

    return false;
  }

  render() {

    const { redBooks: {isFetching}, loginUser } = this.props;
    
    if( isFetching || typeof isFetching === 'undefined' ){ 
      return <div className="RedBookList"></div>
    } else {
      return this.renderRedBooks();
    }
  }


  // 사용자의 위치가 업데이트되면 원래 목록에서도 빼줘야한다.
  renderRedBooks = () => {

    const { loginUser, redBooks, entities } = this.props;
    const { isFetching } = redBooks, location = loginUser.current_location;
    let ids = redBooks.ids || [];


    if(!redBooks.isSearchResult){

      if( loginUser.id && location && location.cityName ) {
        ids = _.filter(ids, (id)=>{
          return entities.redBooks[id].countryName !== location.countryName;
        });
      }
    
      ids = insertAdsenceBetweenCards(ids);  
    }

    return <ul className="RedBookList">{ ids.map((id, i) => {

      const redBook = entities.redBooks[id];
      let className = this.props.onGetRedBoodCardClassName(i, 'RedBook');

      if(redBook) {

        return <RedBook key={i} klassName={className} 
          redBook={redBook} 
          loginUser={loginUser}
        />

      } else {
        className += ' adsence'

        return <li key={i} className={className}>
          <h4>광고 영역</h4>
          <p>레드북 갯수에 따라 빈공간에 <br/>자동 삽입될 예정</p>
        </li>
      }
    
    }) }</ul>

  };

}

RedBookList.propTypes = {
  loginUser : PropTypes.object.isRequired,
  entities : PropTypes.object.isRequired,
  redBooks : PropTypes.object.isRequired,
  onGetRedBoodCardClassName: PropTypes.func.isRequired
}

function mapStateToProps(state, ownProps) {
  return {
    loginUser: state.login,
    entities: state.entities
  }
}

export default connect(mapStateToProps, {
})(RedBookList)

