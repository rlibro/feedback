import React, { Component, PropTypes } from 'react';
import RedBook from '../components/RedBook';
import _ from 'lodash';

export default class RedBookList extends Component {

  renderRedBooksByCurrentLocation = (location) => {

    var { entities : { redBooks }, onOpenRedBook } = this.props;

    if( location ){

      redBooks = _.filter(redBooks, function(book){
        return book.countryName === location.countryName
      });


      return <div className="RedBookList-byLocation">
        You are in {location.cityName}, {location.countryName}

        <ul className="RedBookList">{ redBooks.map( (redBook, i) => {
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


        })}
          <li className="RedBook create-book">
            <h3>Create a RedBook</h3>
            <h4>Be the pioneer of {location.countryName}</h4>
            <img src="/assets/images/create-redbook.png" />
          </li>
        </ul>

      </div>
    }

    return false;
  }

  renderRedBooks = (location) => {

    const { redBooks, entities, onOpenRedBook } = this.props;
    const { isFetching } = redBooks;
    var ids = redBooks.ids || [];

    if( location ) {
      ids = _.filter(ids, (id)=>{
        return id.indexOf(location.countryName) < 0
      });
    } 

    console.log( ids );

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

  }

  render() {

    const { redBooks: {isFetching}, loginUser } = this.props;
    
    if( isFetching ){
      return <h2>Now all RedBooks are loading...</h2>
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
  onOpenRedBook : PropTypes.func.isRequired
}
