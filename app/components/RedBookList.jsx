import React, { Component, PropTypes } from 'react';
import RedBook from '../components/RedBook';
import RedBookStatics from '../components/RedBookStatics';
import _ from 'lodash';

function getRedBoodCardClassName(index, className){

  switch( index % 3 ){
    case 0:
      className += ' left';
      break;
    case 1:
      className += ' middle';
      break;
    case 2:
      className += ' right';
      break;
  }

  if( index % 2 === 0 ){
    className += ' odd'
  } else {
    className += ' even'
  }

  return className;
}

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
    const { redBooks, loginUser } = nextProps;

    if( (redBooks !== this.props.redBooks) || (loginUser && loginUser.current_location) ) {   
      return true;
    }

    return false;
  }

  render() {

    const { redBooks: {isFetching}, loginUser } = this.props;
    
    if( isFetching || typeof isFetching === 'undefined' ){ return this.renderLoadingState() } 
    else {
      return <div className="wrap-RedBookList">
        {this.renderRedBooksByCurrentLocation()}
        <RedBookStatics />
        {this.renderRedBooks()}
      </div>
    }
  }

  renderLoadingState = () =>{
    return <div className="RedBookList">
      <div className="loading">
        <h2> <i className="fa fa-circle-o-notch fa-spin" /> loading...</h2>

      </div>
      <div className="dimmed"></div>
    </div>
  };

  renderNewRedBookCard = (hasThisCity, location) => {

    const { onCreateRedBook } = this.props;

    if( !hasThisCity ){
      return <li className="RedBook create-book" onClick={onCreateRedBook.bind(this,location)}>
        <h4>You are in {location.cityName}</h4>
        <p>Be the first of {location.countryName}</p>
        <div className="sign">
          <i className="fa fa-plus-circle" />
        </div>
      </li>
    } else {
      return false;
    }
  };

  renderRedBooksByCurrentLocation = () => {

    let { entities : { redBooks }, onOpenRedBook, onCreateRedBook, loginUser } = this.props;
    let hasThisCity = false, location = loginUser.current_location;

    if( loginUser.id && location && location.cityName ){

      // 현재 위치에 있는 나라와 도시를 분리해 낸다.
      redBooks = _.filter(redBooks, function(book){
        if( book.cityName === location.cityName ){
          hasThisCity = true;
        }
        return book.countryName === location.countryName
      });

      // 현재 위치에 있는 카드를 맨 앞으로 둔다.
      redBooks.sort( (a,b) => {
        return a.cityName !== location.cityName 
      });

      return <div className="RedBookList-byLocation">
        <ul className="RedBookList">

          {this.renderNewRedBookCard(hasThisCity, location)}    

          { redBooks.map( (redBook, i) => {
            var className;
            var count = i;

            if( !hasThisCity ){
              count++;
            }

            className = getRedBoodCardClassName(count, 'RedBook');

            return <RedBook key={i}  klassName={className}
              redBook={redBook}
              loginUser={loginUser}
              onOpenRedBook={onOpenRedBook} />
          })}

          {this.renderRequestNewRedBook(hasThisCity, redBooks.length)}

          {this.renderAdsence(redBooks.length)}
        </ul>

      </div>
    }

    return false;
  };

  renderRequestNewRedBook = (hasThisCity, count) => {
    let className = 'RedBook request-book'

    if (hasThisCity) {

      className = getRedBoodCardClassName(count, className);

      return <li className={className}>
        <h4>Request creating a city</h4>
        <p>if don't have what you want</p>
        <div className="sign">
          <i className="fa fa-plus-circle" />
        </div>
      </li>

    }

  };

  renderAdsence = (count) => {
    let className = getRedBoodCardClassName(count+1, 'RedBook adsence');

    return <li className={className}>
      <h4>광고 영역</h4>
      <p>레드북 갯수에 따라 빈공간에 <br/>자동 삽입될 예정</p>
    </li>
  };

  // 사용자의 위치가 업데이트되면 원래 목록에서도 빼줘야한다.
  renderRedBooks = () => {

    const { loginUser, redBooks, entities, onOpenRedBook } = this.props;
    const { isFetching } = redBooks, location = loginUser.current_location;
    let ids = redBooks.ids || [];

    if( loginUser.id && location && location.cityName ) {
      ids = _.filter(ids, (id)=>{
        return entities.redBooks[id].countryName !== location.countryName;
      });
    }

    ids = insertAdsenceBetweenCards(ids);

    return <ul className="RedBookList">{ ids.map((id, i) => {

      const redBook = entities.redBooks[id];
      let className = getRedBoodCardClassName(i, 'RedBook');

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
  onOpenRedBook : PropTypes.func.isRequired,
  onCreateRedBook: PropTypes.func.isRequired
}
