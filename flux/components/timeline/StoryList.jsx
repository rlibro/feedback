var React   = require('react');
var Fluxxor = require('fluxxor');
var Story   = require('./Story.jsx');
var moment  = require('moment');

var StoryList = React.createClass({

  getInitialState() {
    return {
      storys : [{
        itemname : '파\'s 설사약', 
        content: '이약을 보고 있짜니 자꾸 파가 생각난다. 어딘가에서 잘 살고 있으려나? 어딨니 파아?',
        username: '불꽃남자',
        date: moment('2016-04-22T12:40:00').format('LLL')
      },{
        itemname : '볼리비아 멀미약', 
        content: '볼리비아에서 이거 먹었더니 진짜 아무 문제 없었다잉~!',
        username: '불꽃남자',
        date: moment('2016-02-28T14:30:00').format('LLL')
      },{
        itemname : '파\'s 설사약', 
        content: '시엔푸에고스에서 파에게 설사약을 받았다! 사실 난 약 안먹어도 되긴하는데,.. ㅋㅋㅋ 암튼 땡큐~ @파',
        username: '불꽃남자',
        date: moment('2015-12-02T13:40:00').format('LLL')
      },{
        itemname : '볼리비아 멀미약', 
        content: '하바나에서 만난 솔지양이 건내준 알약! 이거면 볼리비아에서도 문제가 없겠지? 땡큐 솔지~!!',
        username: '불꽃남자',
        date: moment('2015-11-22T12:22:00').format('LLL')
      }]      
    };
  },


  render: function() {

    return <main id="story_list" >

      {this.state.storys.map(function(story, i){
        return <Story key={i} itemname={story.itemname} content={story.content} username={story.username} date={story.date} />
      })}

    </main>
  }



});

module.exports = StoryList;