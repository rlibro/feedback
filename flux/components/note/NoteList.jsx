var React   = require('react');
var Fluxxor = require('fluxxor');
var Note   = require('./Note.jsx');
var moment  = require('moment');

var NoteList = React.createClass({

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

    return <main id="note_list">
      <div className="note card">
        <div className="header shared">
          <div className="city">비냘네스</div>
          <div className="country">Cuba</div>
          <div className="state synced">공유됨</div>
        </div>

        <div className="content">
          미겔 y 말레나 까사 추천합니다. 저희 부부는 방하나에 15쿡, 아침은 인당 2쿡씩 먹었는데 퀄러티 너무 좋았어요. 처음엔 방값을 20쿡 달라기에 흥정을 했는데, 아주머니와 아저씨가 너무 좋아서 괜히 깍았나 싶기도 했습니다. 
          영어를 할줄아는 딸래미가 있어서 언어소통에 큰 문제는 없었구요. 딸래미에게 기본적인 살사 스탭을 배웠습니다. 랑고스타 12쿡 달라는거 10쿡에 요리 해줬는데 랑고스타 정말 어마어마하게 컸습니다. 
          큰 랍스타라 냉동이었구요. 냉동이라 그런지 식감은 닭고기 같았어요 :)   
        </div>

        <div className="published">
          <div className="date">2015년 12월 3일 오후 4시 54분</div>
        </div>

        <div className="reaction">
          <div className="like">좋아요 <span>10</span></div>
          <div className="comment">댓글 <span>10</span></div>
        </div>
      </div>

      <Note 
        isShared={false}
        date={moment('2015-12-03T16:54:00').format('LLL')} 
        content={'호세 마르티 광장으로 가는 센트로 거리 초입에 있는 마트에서 레전다리오 7년산 럼이 6.5쿡에 팝니다. 하바나보다 3쿡정도 쌉니다. 사실분은 여기서 사세요!'} 
      />

    </main>
  }



});

module.exports = NoteList;