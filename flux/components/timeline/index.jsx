var React   = require('react');
var Fluxxor = require('fluxxor');
var Header  = require('../Header.jsx');
var SignIn  = require('../SignIn.jsx');
var SignUp  = require('../SignUp.jsx');
var StoryList = require('./StoryList.jsx');

var TimeLine = React.createClass({
  // START - Fluxxor의 스토어를 사용할 경우 END 까지는 기본으로 추가해야한다.
  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('AccountStore')
  ],

  getStateFromFlux: function(){
   
    var AccountStore = this.props.flux.store('AccountStore');

    console.log("TimeLime: --> ", "로그인후 타임라인의 프로퍼티 user 변수는? ", AccountStore.getState())

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
        <StoryList flux={this.props.flux} /> 

      {function(){

        if( this.state.isLoginLayerOpened ) {
          return <div>
            <div id="dimmed"></div>
            <div id="popup" onClick={this.handlerHideLayer}>
              <SignIn flux={this.props.flux} />
            </div>
          </div>;
        }

        if( this.state.isSignUpOpened ) {
          return <div>
            <div id="dimmed"></div>
            <div id="popup" onClick={this.handlerHideLayer}>
              <SignUp flux={this.props.flux} />
            </div>
          </div>;
        }

      }.bind(this)()}
    </div>
  },

  handlerHideLayer(e){

    if(e.target.id === "popup") {
      e.preventDefault();
      this.getFlux().actions.hideLayer('hide');
    }
  }

});

module.exports = TimeLine;