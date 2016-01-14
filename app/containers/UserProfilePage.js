import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class UserProfilePage extends Component {
  

  render() {
    return <div>
      User Profile Page

      <pre>
        여기서 필요한 것들 <br/>

        1. 회원 탈퇴? <br/>
        2. 체크인 목록 <br/>
        3. 체크인 목록을 기반으로 지도 그리기 <br/>
        4. 체크인시 노출할 정보 <br/>
          - 환전 가능 <br/>
          - 동행 가능 <br/>
        5. 필터링 설정 <br/>
      </pre>

    </div>
  }
}

UserProfilePage.propTypes = {}


function mapStateToProps(state) {

  console.log('===> ', state.routing)

  return {}
}

export default connect(mapStateToProps, {

})(UserProfilePage)