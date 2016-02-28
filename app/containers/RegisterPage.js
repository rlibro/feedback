import React, { Component, PropTypes } from 'react'
import { updateLoginUserInfo, logOutUser, leaveUser } from '../actions'
import { pushPath as pushState } from 'redux-simple-router'
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import _ from 'lodash';

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
class RegisterPage extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      email: props.loginUser.email,
      username: props.loginUser.username,
      focusedFieldName: '',
      nationality: '--',
      isValidEmail: true
    }
  }

  componentWillMount() {
    const {loginUser} = this.props;

    if( loginUser && !loginUser.id ){
      this.props.pushState('/');
    }
  }

  componentWillReceiveProps(nextProps){

    const {loginUser} = nextProps;

    this.setState({
      username: loginUser.username,
      email: loginUser.email
    })
  }

  render() {

    const { loginUser } = this.props;
    let { nationality, isValidEmail, focusedFieldName } = this.state;
    let nationalityClass = 'nationality', privacyClass ='', termsClass='';
    let emailClass = 'user-field';
    let usernameClass = 'user-field';
    let countryClass = 'user-field';

    if( !isValidEmail ) {
      emailClass = 'user-field invalid';
    }

    switch (focusedFieldName){
      case 'username':
      usernameClass += ' focus';
      break;

      case 'email':
      emailClass += ' focus';
      break;

      case 'nationality':
      countryClass += ' focus';
      break;

      case 'privacy':
      privacyClass += ' focus';
      break;

      case 'terms':
      termsClass += ' focus';
      break;

      default:
    }

    
    if( this.state.nationality === '--') {
      nationality = 'Select your nationality';
      nationalityClass = 'nationality default';
    }

    return <div className="RegisterPage">
      <div className="propfile">
        <h4>회원정보</h4>
        <div className={usernameClass}>
          <input type="text" placeholder="Input your name"
                 ref="username" 
                 tabIndex={1}
                 defaultValue={this.state.username} 
                 onBlur={this.handleBlur}
                 onFocus={this.handleFocus.bind(this, 'username')} />
        </div>

        <div className={emailClass}>
          <input type="text" placeholder="Input your email" 
                 ref="email"
                 tabIndex={2}
                 defaultValue={this.state.email} 
                 onBlur={this.handleBlur}
                 onFocus={this.handleFocus.bind(this, 'email')}  
                 onKeyDown={this.handleCheckEmail}/>
        </div>

        <div className={countryClass}>
          <span className={nationalityClass}>{nationality}</span>
          <select onChange={this.hendleChangeSelect} 
                  ref="nationality"
                  tabIndex={3}
                  onBlur={this.handleBlur}
                  onFocus={this.handleFocus.bind(this, 'nationality')}>
            <option value="--">Select your nationality</option>
            <option value="Afghanistan">Afghanistan</option>
            <option value="Albania">Albania</option>
            <option value="Algeria">Algeria</option>
            <option value="Andorra">Andorra</option>
            <option value="Angola">Angola</option>
            <option value="Antigua and Barbuda">Antigua and Barbuda</option>
            <option value="Argentina">Argentina</option>
            <option value="Armenia">Armenia</option>
            <option value="Aruba">Aruba</option>
            <option value="Australia">Australia</option>
            <option value="Austria">Austria</option>
            <option value="Azerbaijan">Azerbaijan</option>
            <option value="Bahamas, The">Bahamas, The</option>
            <option value="Bahrain">Bahrain</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="Barbados">Barbados</option>
            <option value="Belarus">Belarus</option>
            <option value="Belgium">Belgium</option>
            <option value="Belize">Belize</option>
            <option value="Benin">Benin</option>
            <option value="Bermuda">Bermuda</option>
            <option value="Bhutan">Bhutan</option>
            <option value="Bolivia">Bolivia</option>
            <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
            <option value="Botswana">Botswana</option>
            <option value="Brazil">Brazil</option>
            <option value="Brunei">Brunei</option>
            <option value="Bulgaria">Bulgaria</option>
            <option value="Burkina Faso">Burkina Faso</option>
            <option value="Burma">Burma</option>
            <option value="Burundi">Burundi</option>
            <option value="Cabo Verde">Cabo Verde</option>
            <option value="Cambodia">Cambodia</option>
            <option value="Cameroon">Cameroon</option>
            <option value="Canada">Canada</option>
            <option value="Cayman Islands">Cayman Islands</option>
            <option value="Central African Republic">Central African Republic</option>
            <option value="Chad">Chad</option>
            <option value="Chile">Chile</option>
            <option value="China">China</option>
            <option value="Colombia">Colombia</option>
            <option value="Comoros">Comoros</option>
            <option value="Congo, Democratic Republic of the">Congo, Democratic Republic of the</option>
            <option value="Congo, Republic of the">Congo, Republic of the</option>
            <option value="Costa Rica">Costa Rica</option>
            <option value="Cote d'Ivoire">Cote d'Ivoire</option>
            <option value="Croatia">Croatia</option>
            <option value="Cuba">Cuba</option>
            <option value="Curacao">Curacao</option>
            <option value="Cyprus">Cyprus</option>
            <option value="Czech Republic">Czech Republic</option>
            <option value="Denmark">Denmark</option>
            <option value="Djibouti">Djibouti</option>
            <option value="Dominica">Dominica</option>
            <option value="Dominican Republic">Dominican Republic</option>
            <option value="Ecuador">Ecuador</option>
            <option value="Egypt">Egypt</option>
            <option value="El Salvador">El Salvador</option>
            <option value="Equatorial Guinea">Equatorial Guinea</option>
            <option value="Eritrea">Eritrea</option>
            <option value="Estonia">Estonia</option>
            <option value="Ethiopia">Ethiopia</option>
            <option value="Fiji">Fiji</option>
            <option value="Finland">Finland</option>
            <option value="France">France</option>
            <option value="Gabon">Gabon</option>
            <option value="Gambia, The">Gambia, The</option>
            <option value="Georgia">Georgia</option>
            <option value="Germany">Germany</option>
            <option value="Ghana">Ghana</option>
            <option value="Greece">Greece</option>
            <option value="Grenada">Grenada</option>
            <option value="Guatemala">Guatemala</option>
            <option value="Guinea ">Guinea</option>
            <option value="Guinea-Bissau ">Guinea-Bissau</option>
            <option value="Guyana">Guyana</option>
            <option value="Haiti">Haiti</option>
            <option value="Holy See">Holy See</option>
            <option value="Honduras">Honduras</option>
            <option value="Hong Kong">Hong Kong</option>
            <option value="Hungary">Hungary</option>
            <option value="Iceland">Iceland</option>
            <option value="India">India</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Iran">Iran</option>
            <option value="Iraq">Iraq</option>
            <option value="Ireland">Ireland</option>
            <option value="Israel">Israel</option>
            <option value="Italy">Italy</option>
            <option value="Jamaica">Jamaica</option>
            <option value="Japan">Japan</option>
            <option value="Jordan">Jordan</option>
            <option value="Kazakhstan">Kazakhstan</option>
            <option value="Kenya">Kenya</option>
            <option value="Kiribati">Kiribati</option>
            <option value="Kosovo">Kosovo</option>
            <option value="Kuwait">Kuwait</option>
            <option value="Kyrgyzstan">Kyrgyzstan</option>
            <option value="Laos">Laos</option>
            <option value="Latvia">Latvia</option>
            <option value="Lebanon">Lebanon</option>
            <option value="Lesotho">Lesotho</option>
            <option value="Liberia">Liberia</option>
            <option value="Libya">Libya</option>
            <option value="Liechtenstein">Liechtenstein</option>
            <option value="Lithuania">Lithuania</option>
            <option value="Luxembourg">Luxembourg</option>
            <option value="Macau">Macau</option>
            <option value="Macedonia">Macedonia</option>
            <option value="Madagascar">Madagascar</option>
            <option value="Malawi">Malawi</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Maldives">Maldives</option>
            <option value="Mali">Mali</option>
            <option value="Malta">Malta</option>
            <option value="Marshall Islands">Marshall Islands</option>
            <option value="Mauritania">Mauritania</option>
            <option value="Mauritius">Mauritius</option>
            <option value="Mexico">Mexico</option>
            <option value="Micronesia">Micronesia</option>
            <option value="Moldova">Moldova</option>
            <option value="Monaco">Monaco</option>
            <option value="Mongolia">Mongolia</option>
            <option value="Montenegro">Montenegro</option>
            <option value="Morocco">Morocco</option>
            <option value="Mozambique">Mozambique</option>
            <option value="Namibia">Namibia</option>
            <option value="Nauru">Nauru</option>
            <option value="Nepal">Nepal</option>
            <option value="Netherlands">Netherlands</option>
            <option value="Netherlands Antilles">Netherlands Antilles</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Nicaragua">Nicaragua</option>
            <option value="Niger">Niger</option>
            <option value="Nigeria">Nigeria</option>
            <option value="North Korea">North Korea</option>
            <option value="Norway">Norway</option>
            <option value="Oman">Oman</option>
            <option value="Pakistan">Pakistan</option>
            <option value="Palau">Palau</option>
            <option value="Palestinian Territories">Palestinian Territories</option>
            <option value="Panama">Panama</option>
            <option value="Papua New Guinea">Papua New Guinea</option>
            <option value="Paraguay">Paraguay</option>
            <option value="Peru">Peru</option>
            <option value="Philippines">Philippines</option>
            <option value="Poland">Poland</option>
            <option value="Portugal">Portugal</option>
            <option value="Qatar">Qatar</option>
            <option value="Romania">Romania</option>
            <option value="Russia">Russia</option>
            <option value="Rwanda">Rwanda</option>
            <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
            <option value="Saint Lucia">Saint Lucia</option>
            <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
            <option value="Samoa">Samoa</option>
            <option value="San Marino">San Marino</option>
            <option value="Sao Tome and Principe">Sao Tome and Principe</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="Senegal">Senegal</option>
            <option value="Serbia">Serbia</option>
            <option value="Seychelles">Seychelles</option>
            <option value="Sierra Leone">Sierra Leone</option>
            <option value="Singapore">Singapore</option>
            <option value="Sint Maarten">Sint Maarten</option>
            <option value="Slovakia">Slovakia</option>
            <option value="Slovenia">Slovenia</option>
            <option value="Solomon Islands">Solomon Islands</option>
            <option value="Somalia">Somalia</option>
            <option value="South Africa">South Africa</option>
            <option value="South Korea">South Korea</option>
            <option value="South Sudan">South Sudan</option>
            <option value="Spain">Spain</option>
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="Sudan">Sudan</option>
            <option value="Suriname">Suriname</option>
            <option value="Swaziland">Swaziland</option>
            <option value="Sweden">Sweden</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Syria">Syria</option>
            <option value="Taiwan">Taiwan</option>
            <option value="Tajikistan">Tajikistan</option>
            <option value="Tanzania">Tanzania</option>
            <option value="Thailand">Thailand</option>
            <option value="Timor-Leste">Timor-Leste</option>
            <option value="Togo">Togo</option>
            <option value="Tonga">Tonga</option>
            <option value="Trinidad and Tobago">Trinidad and Tobago</option>
            <option value="Tunisia">Tunisia</option>
            <option value="Turkey">Turkey</option>
            <option value="Turkmenistan">Turkmenistan</option>
            <option value="Tuvalu">Tuvalu</option>
            <option value="Uganda">Uganda</option>
            <option value="Ukraine">Ukraine</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Uruguay">Uruguay</option>
            <option value="Uzbekistan">Uzbekistan</option>
            <option value="Vanuatu">Vanuatu</option>
            <option value="Venezuela">Venezuela</option>
            <option value="Vietnam">Vietnam</option>
            <option value="Yemen">Yemen</option>
            <option value="Zambia">Zambia</option>
            <option value="Zimbabwe">Zimbabwe</option>
          </select>        
        </div>
        
      </div>

      <div className="terms-privacy">
        <div className="terms">
          <h4>회원약관</h4>
          <div>
            <textarea disabled defaultValue="레드북에 거재된 노트를 원저작자와 알리브로의 허가없이 무단으로 출판할 경우 법적 제재를 받습니다.&#13;&#10;"></textarea>
          </div>
          <div>
            <label className={termsClass}>
              <input type="checkbox" tabIndex={4} ref="ckterms"
                     onBlur={this.handleBlur}
                     onFocus={this.handleFocus.bind(this, 'terms')} /> 약관에 동의합니다.</label>
          </div>
        </div>
        <div className="privacy">
          <h4>개인정보 취급방침</h4>
          <div>
            <textarea disabled defaultValue="
              1. 페이스북 공개 프로필만 저장합니다.&#13;&#10;
              2. 가입시 등록한 이메일도 저장합니다.&#13;&#10;
              3. 가입시 등록한 국적도 저장합니다.&#13;&#10;
              4. 약관에 동의하지 않으면 바로 삭제합니다.&#13;&#10;"></textarea>
          </div>
          <div>
            <label className={privacyClass}>
              <input type="checkbox" tabIndex={5} ref="ckprivacy" 
                     onBlur={this.handleBlur}
                     onFocus={this.handleFocus.bind(this, 'privacy')} /> 개인정보 취급방침에 동의합니다.</label>
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="cancel" tabIndex={7} onClick={this.handleCancelRegister}>가입취소</button>
        <button className="register" tabIndex={6} onClick={this.handleSaveRegister}>회원가입</button>
      </div>
    </div>
  }

  handleBlur = () => {
    this.setState({
      focusedFieldName: ''
    })
  };

  handleFocus = (name, e) => {
    this.setState({
      focusedFieldName: name
    })
  };

  handleCheckEmail = (e) => {
    const text = e.target.value;

    if( validateEmail(text) ) {
      this.setState({
        isValidEmail: true
      });
    } else {
      this.setState({
        isValidEmail: false
      });
    }

  };

  hendleChangeSelect = (e) => {
    this.setState({
      nationality: e.target.value
    })
  };

  handleCancelRegister = (e) => {

    let yes = confirm('정말로 가입을 취소하시겠습니까?');
    if( yes){
      const { loginUser } = this.props;
      
      Parse.FacebookUtils.unlink(
        Parse.User.current(), 
        function success(a){
          console.log('unlink success', a)
        }, 
        function error(b){
          console.log('unlink error', b)
        }
      );
      this.props.leaveUser();
      this.props.logOutUser();
      this.props.pushState('/');
      Parse.User.logOut();
    } 

  };

  handleSaveRegister = (e) => {

    let { isValidEmail } = this.state;

    const usernameNode = findDOMNode(this.refs.username);
    const emailNode = findDOMNode(this.refs.email);
    const nationalityNode = findDOMNode(this.refs.nationality);
    const termsNode = findDOMNode(this.refs.ckterms);
    const privacyNode = findDOMNode(this.refs.ckprivacy);

    if( usernameNode.value === '' ){
      alert('사용할 이름을 입력해주세요!');
      return usernameNode.focus();
    }

    if( !isValidEmail || emailNode.value === '' ){
      alert('이메일을 입력해주세요!');
      return emailNode.focus();
    }

    if( nationalityNode.value === '--' ) {
      alert('국적을 선택하세요.');
      return nationalityNode.focus();
    }

    if( !termsNode.checked ){
      alert('약관에 동의해주세요.');
      return termsNode.focus();
    }

    if( !privacyNode.checked ){
      alert('개인정보 취급방침에 동의해주세요.');
      return privacyNode.focus();
    }

    let updatingUser = {
      email: emailNode.value,
      username: usernameNode.value,
      nationality: nationalityNode.value,
      updatedAt: new Date()
    }

    Parse.User.current().save(updatingUser);
    alert('알리브로에 오신걸 환영합니다.\n등록 메일을 보냈습니다.');

    const userInfo = Parse.User.current().toJSON();
    this.props.updateLoginUserInfo(userInfo);
    this.props.pushState('/');

  };

}

RegisterPage.propTypes = {
  updateLoginUserInfo: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    loginUser: state.login
  }
}

export default connect(mapStateToProps, {
  updateLoginUserInfo,
  pushState,
  logOutUser,
  leaveUser
})(RegisterPage)