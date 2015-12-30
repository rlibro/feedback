var React   = require('react');
var Fluxxor = require('fluxxor');
var Header  = require('../Header.jsx');
var NoteList = require('./NoteList.jsx');
var _ = require('lodash');

var Inventory = React.createClass({
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

    return _.extend({
      
      hasGPSLocation : false,
      isEditMode     : false

    }, AccountStore.getState());
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState(this.getStateFromFlux());
  },
  // END

  componentDidUpdate: function(prevProps, prevState) {
    if( this.state.isEditMode ) {

    }
  },

  componentDidMount: function() {

    var self = this;

    navigator.geolocation.getCurrentPosition(
      function success(geo){

        self.setState({hasGPSLocation:true})
        console.log(geo);

    }, function fail(e){
      
      console.log(e);
    
    })  
  },

  render() {

    var hasGPSLocation = this.state.hasGPSLocation;
    var isEditMode     = this.state.isEditMode;
    
    return <div id="wrap">
        <Header flux={this.props.flux} />

        
        {function(){

          if( hasGPSLocation ) {

            if( isEditMode ){
              return <div className="editing new-note">
                <textarea refs="txt" focus></textarea>
                <button onClick={this.handleSaveNote}>저장하기</button>
              </div>;  
            }else{
              return <div className="new-note" onClick={this.handleNewNote}>새노트 작성하기</div>;
            }
            
          }else{
            return <div className="new-note" onClick={this.handleNeedGPS}>노트를 작성하려면 현재의 위치 정보가 필요합니다.</div>
          }

        }.bind(this)()}
          

        <NoteList />
        
    </div>
  },

  handleNewNote: function(e){
    this.setState({isEditMode: true})
  },

  handleNeedGPS: function(e){
    alert('GPS를 켜주세요!');
  },

  handleSaveNote: function(e){
    this.setState({isEditMode: false})
  }


});

module.exports = Inventory;