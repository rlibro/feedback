var React   = require('react');
var Fluxxor = require('fluxxor');
var Header  = require('../Header.jsx');
var StoryList = require('../timeline/StoryList.jsx');

var Search = React.createClass({
  // START - Fluxxor의 스토어를 사용할 경우 END 까지는 기본으로 추가해야한다.
  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('AccountStore')
  ],

  getStateFromFlux: function(){
   
    var AccountStore = this.props.flux.store('AccountStore');

    if( this.props.user ){
      AccountStore.setState(this.props.user);  
    }

    return AccountStore.getState();
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState(this.getStateFromFlux());
  },
  // END

  render() {

    
    return <div id="wrap">
        <Header flux={this.props.flux} />

        <div id="search_bar">
          <input placeholder="찾고자하는 도시명을 입력하세요." defaultValue="" />
        </div>

        <StoryList flux={this.props.flux} /> 

        <main id="item_list">

          <div className="item card note">
            <h4 className="title">시엔푸에고스</h4>

            <div className="summary">쿠바</div>

            <div className="info">
              <div>노트 <span className="num">423</span> 건</div>
              <div>기여자 <span className="num">55</span> 명</div>
            </div>

          </div>
          <div className="item card note">
            <h4 className="title">아바나</h4>

            <div className="info">
              <div>노트 <span className="num">1423</span> 건</div>
              <div>기여자 <span className="num">1055</span> 명</div>
            </div>

          </div>
          

        </main>
    </div>
  }


});

module.exports = Search;