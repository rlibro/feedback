import React, { Component, PropTypes } from 'react';
import RedBook from '../components/RedBook'

export default class RedBookList extends Component {

  render() {
    const { redBooks, entities, onOpenRedBook } = this.props;
    const { isFetching } = redBooks;
    const ids = redBooks.ids || [];
   
    if( isFetching ){
      return <h2>레드북이 등록된 나라를 로드중입니다...</h2>
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
  }

}

RedBookList.propTypes = {
  redBooks : PropTypes.object.isRequired,
  entities : PropTypes.object.isRequired,
  onOpenRedBook : PropTypes.func.isRequired
}
