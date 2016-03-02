import React, { Component, PropTypes } from 'react';
import RedBook from '../components/RedBook';

import RedBookListByCountry from '../components/RedBookListByCountry';
import RedBookStatics from '../components/RedBookStatistics';
import _ from 'lodash';

function insertAdsenceBetweenCards(cards){

  const adCount = (6 - cards.length % 6);
  let startIndex = 2;
  
  for(let i=0; i<adCount; ++i){
    let length  = cards.length;

    // startIndex + i*3; 내가 원하는 위치에 삽입 시킬수 있다.
    const index = Math.floor(Math.random() * length);
    const start = cards.slice(0, index);
    const last  = cards.slice(index, length);
    start.push({id:'adsence'});
    cards = start.concat(last);
  }

  return cards;
}

export default class RedBookList extends Component {

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

    const { loginUser, redBooks, entities, onOpenRedBook } = this.props;
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
          onOpenRedBook={onOpenRedBook} />

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
  redBooks : PropTypes.object.isRequired,
  entities : PropTypes.object.isRequired,
  onOpenRedBook : PropTypes.func.isRequired
}
