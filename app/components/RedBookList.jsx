import React, { Component, PropTypes } from 'react';
import RedBook from '../components/RedBook';
import _ from 'lodash';

export default class RedBookList extends Component {

  renderNewRedBookCard = (hasThisCity, location) => {

    const { onCreateRedBook } = this.props;

    if( !hasThisCity ){
      return <li className="RedBook create-book" onClick={onCreateRedBook.bind(this,location)}>
        <h3>You are in {location.cityName}</h3>
        <h4>Be the pioneer of {location.countryName}</h4>
        <i className="fa fa-plus" />
      </li>
    }
    return false;

  };

  renderRedBooksByCurrentLocation = (location) => {

    let { entities : { redBooks }, onOpenRedBook, onCreateRedBook } = this.props;
    let hasThisCity = false;

    if( location && location.cityName ){

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

            switch( count % 3 ){
              case 0:
                className = 'left';
                break;
              case 1:
                className = 'middle';
                break;
              case 2:
                className = 'right';
                break;
            }

            if( count % 2 === 1 ){
              className += ' alt'
            }

            return <RedBook key={i} redBook={redBook} klassName={className}
              onOpenRedBook={onOpenRedBook} />
        })}
        </ul>

      </div>
    }

    return false;
  };

  renderRedBooks = (location) => {

    const { redBooks, entities, onOpenRedBook } = this.props;
    const { isFetching } = redBooks;
    var ids = redBooks.ids || [];

    if( location && location.cityName ) {
      ids = _.filter(ids, (id)=>{
        return entities.redBooks[id].countryName !== location.countryName;
      });
    } 

    return <ul className="RedBookList">{ ids.map((id, i) => {

      const redBook = entities.redBooks[id];
      var className;

      switch( i % 3 ){
        case 0:
          className = 'left';
          break;
        case 1:
          className = 'middle';
          break;
        case 2:
          className = 'right';
          break;
      }

      return <RedBook key={i} redBook={redBook} 
              klassName={className}
              onOpenRedBook={onOpenRedBook} />
    

    }) }</ul>

  };

  render() {

    const { redBooks: {isFetching}, loginUser } = this.props;
    
    if( isFetching ){
      return <div>
        <h2>Now RedBooks are loading...</h2>
        <div className="dimmed">
          <i className="fa fa-circle-o-notch fa-spin"></i>
        </div>
      </div>
    } 

    return <div className="wrap-RedBookList">

      {this.renderRedBooksByCurrentLocation(loginUser.current_location)}

      <hr/>

      {this.renderRedBooks(loginUser.current_location)}

    </div>
  }

}

RedBookList.propTypes = {
  loginUser : PropTypes.object.isRequired,
  redBooks : PropTypes.object.isRequired,
  entities : PropTypes.object.isRequired,
  onOpenRedBook : PropTypes.func.isRequired,
  onCreateRedBook: PropTypes.func.isRequired
}
