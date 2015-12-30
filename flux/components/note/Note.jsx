var React   = require('react');
var Fluxxor = require('fluxxor');
var moment = require('moment');

var Note = React.createClass({

  getDefaultProps() {
    return {
      isShared: false,
      content: '어쩌고 저쩌구 스토리 내용이 들어갑니다.',
      username: '글쓴이',
      date: '저장한 날짜'
    };
  },


  render: function() {

    console.log(this.props );

    return <div className="note card">
      <div className="header offline">
        <div className="date">{this.props.date}</div>

        {function(){

          if( !this.props.isShared ) {
            return <div className="state private">비공개</div>
          }
        }.bind(this)()}
        
      </div>
      <div className="content">{this.props.content}</div>

      <div className="reaction">
        <div className="btn-sheard">RedBook에 공유하기</div>
      </div>
    </div>

  }



});

module.exports = Note;