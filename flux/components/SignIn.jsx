var React   = require('react');
var Fluxxor = require('fluxxor');

module.exports = React.createClass({
  
  // START - Fluxxor의 스토어를 사용할 경우 END 까지는 기본으로 추가해야한다.
  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('AccountStore')
  ],

  getStateFromFlux: function(){
    var flux = this.props.flux;
    return flux.store("AccountStore").getState();
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState(this.getStateFromFlux());
  },
  // END

  render() {
    return <div className="popup-wrapper">
      <div id="login">

        <button className="facebook">
          <span className="fa fa-facebook"></span> 
          <span className="text" onClick={this.handleConnectFacebook}>페이스북으로 연결하기</span>
        </button>

        <form action="/" method="POST">

          <fieldset className="clearfix">
            <p>
              <span className="fa fa-user"></span>
              <input type="text" placeholder="email" ref='email' required />
            </p>
            <p>
              <span className="fa fa-lock"></span>
              <input type="password" placeholder="password" ref='pass' required />
            </p>
            <p>
              <input type="submit" value="로그인" onClick={this.handleSubmitSignIn} />
            </p>
            <p className="message">{this.state.message}</p>

          </fieldset>

        </form>

        <div className="footer">
          아직 회원이 아니신가요? <a href="#" onClick={this.handleSignUp}>회원가입</a>
          <span className="fa fa-arrow-right"></span>
        </div>

      </div>
    </div>;
  },

  componentDidMount: function () {
    React.findDOMNode(this.refs.email).focus();  
  },

  handleConnectFacebook(e){
    window.open('/facebook/login', '', 'width=600, height=550');
  },

  handleSubmitSignIn(e){
    e.preventDefault();
    e.stopPropagation();

    var email = React.findDOMNode(this.refs.email).value
    var pass  = React.findDOMNode(this.refs.pass).value
    
    this.getFlux().actions.login(email, pass);
  },

  handleSignUp(e){
    e.preventDefault();
    this.getFlux().actions.openLayer('register');
  }


});