import React, { Component, PropTypes } from 'react';
import RedBook from '../components/RedBook';

function insertAdsenceBetweenCards(cards){

  const adCount = (6 - (cards.length+1) % 6);
  let startIndex = 2;
  
  for(let i=0; i<adCount; ++i){ 
    cards.push({id:'adsence'});
  }

  return cards;
}

export default class RedBookListByCountry extends Component {

  render(){
    const { loginUser } = this.props;
    let location = loginUser.current_location;
    location = {
      cityName : 'Puno!',
      countryName: 'Peru'
    }

    if( location && location.cityName ){
      return this.renderListByLocation(location);
    } else {
      return false;
    }

  }

  renderListByLocation = (location) => {

    let { entities : { redBooks }, onOpenRedBook, onCreateRedBook, loginUser } = this.props;
    let hasThisCity = false;
    
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


    redBooks = insertAdsenceBetweenCards(redBooks);


    return <div className="RedBookList-byLocation">
      <ul className="RedBookList">

        {this.renderNewRedBookCard(hasThisCity, location)}    

        { redBooks.map( (redBook, i) => {
          var className;
          var count = i;

          if( !hasThisCity ){
            count++;
          }

          className = this.props.onGetRedBoodCardClassName(count, 'RedBook');

          if( redBook.id !== 'adsence' ){
            
            return <RedBook key={i}  
              klassName={className}
              redBook={redBook}
              loginUser={loginUser}
              onOpenRedBook={onOpenRedBook} />

          } else {

            className += ' adsence'

            return <li key={i} className={className}>
              <h4>캠페인 영역</h4>
              <p>빈공간에 자동 삽입됨<br/>로그인한 사용자에게만 제공<br/>도움이 될만한 정보 삽입 예졍</p>
            </li>

          }

          

        })}

        {this.renderRequestNewRedBook(hasThisCity, redBooks.length)}

      </ul>

    </div>

  };

  renderNewRedBookCard = (hasThisCity, location) => {

    const { onCreateRedBook } = this.props;

    if( !hasThisCity ){
      return <li className="RedBook left odd create-book" onClick={onCreateRedBook.bind(this,location)}>
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

  renderRequestNewRedBook = (hasThisCity, count) => {
    let className = 'RedBook request-book'

    if (hasThisCity) {

      className = this.props.onGetRedBoodCardClassName(count, className);

      return <li className={className} onClick={this.handleRequestNewRedBook}>
        <h4>Request creating a city</h4>
        <p>if don't have what you want</p>
        <div className="sign">
          <i className="fa fa-plus-circle" />
        </div>
      </li>

    }

  };
}

RedBookListByCountry.propTypes = {
  onGetRedBoodCardClassName : PropTypes.func.isRequired,
}
