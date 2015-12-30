var React   = require('react');
var Fluxxor = require('fluxxor');

module.exports = React.createClass({
  
  // START - Fluxxor의 스토어를 사용할 경우 END 까지는 기본으로 추가해야한다.
  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('AppStore')
  ],

  getStateFromFlux: function(){
    var flux = this.props.flux;
    return flux.store("AppStore").getState();
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState(this.getStateFromFlux());
  },
  // END

  render() {
    return <div className="popup-wrapper">
      <div id="login">

        <button className="facebook" onClick={this.handleConnectFacebook}>
          <span className="fa fa-facebook"></span> 
          <span className="text">페이스북으로 연결하기</span>
        </button>

        <form action="/" method="POST">

          <fieldset className="clearfix">
            <p>
              <span className="fa fa-user"></span>
              <input type="text" placeholder="email" ref='id' required />
            </p>
            <p>
              <span className="fa fa-lock"></span>
              <input type="password" placeholder="password" ref='pass' required />
            </p>
            <p>
              <input type="submit" value="회원가입" onClick={this.handleSubmitSignIn} />
            </p>
            <p className="message">{this.state.message}</p>

          </fieldset>

        </form>

        <div className="footer">
          이미 회원이신가요? <a href="#" onClick={this.handleSignIn}>로그인</a>
          <span className="fa fa-arrow-right"></span>
        </div>

      </div>
    </div>;
  },

  componentDidMount: function () {
    React.findDOMNode(this.refs.id).focus();  
  },

  handleConnectFacebook(e){
    window.open('/facebook/login', '', 'width=400, height=300');
  },

  handleSubmitSignUp(e){
    e.preventDefault();
    e.stopPropagation();

    var id = React.findDOMNode(this.refs.id).value
    var pass = React.findDOMNode(this.refs.pass).value
    
    this.getFlux().actions.signup(id, pass);
  },

  handleSignIn(e){
    e.preventDefault();
    this.getFlux().actions.signinLayer('show');
  }

});