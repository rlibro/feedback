var React   = require('react');
var Fluxxor = require('fluxxor');

module.exports = React.createClass({
  // START - Fluxxor의 스토어를 사용할 경우 END 까지는 기본으로 추가해야한다.
  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('AccountStore')
  ],

  getStateFromFlux: function(){
    var accountStore = this.props.flux.store('AccountStore').getState();

    console.log("Header: -> ", "1. 로그인후 헤더의 전역 변수는? ", accountStore)

    return accountStore;
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState(this.getStateFromFlux());
  },
  // END

  render: function() {

    var user = this.state.user;

    return <header id="header" className="clearfix">
      <h1 className="logo">
        
        <a href="/">

          <span>RedBook</span>

        </a>

      </h1>
      {function(){

        if (user) {

          return <ul className="account-menu">
            <li><a href="/note">내 노트</a></li>
          </ul>

        }else{

          return <ul className="account-menu">
            <li><a href="#" onClick={this.handleSignIn}>로그인</a></li>
            <li><a href="/register">회원가입</a></li>
          </ul>

        }


      }.bind(this)()}

    </header>
  },


  handleSignIn: function (e){
    e.preventDefault();
    this.getFlux().actions.openLayer('login');
  }



});