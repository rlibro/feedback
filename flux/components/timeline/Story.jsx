var React   = require('react');
var Fluxxor = require('fluxxor');

var Story = React.createClass({

  getDefaultProps() {
    return {
      itemname: '사물의 이름',
      content: '어쩌고 저쩌구 스토리 내용이 들어갑니다.',
      username: '사물을 소유했던 사람들만 이야기를 쓸수있음.',
      date: '2015.11.12 13:22'
    };
  },


  render: function() {

    console.log(this.props );

    return <div className="story">

      <div className="item profile">
        <div className="photo"><img src="#"/></div>
        <div className="itemname"><span>{this.props.username}</span></div>
        <div>{this.props.date}</div>
      </div>
      <div className="content">{this.props.content}</div>

    </div>
  }



});

module.exports = Story;