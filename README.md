# REDBOOK

## 개발환경 설정하기

## 로컬 개발

#### 클라이언트 UI 개발
UI 개발할때는 서버 로직 보다는 React+Redux 개발이 많으므로 아래와 같은 명령어로 실행한다. 

    $> npm run server    // Express 서버와 같이 실행
    $> npm start         // React + Redux 만 실행

#### 서버 API 개발
서버 API를 개발할때는 서버 API가 변경될때마다 Express 서버를 재부팅해줘야하기 때문에 관련 내용을 자동으로 처리해주는 아래 명령을 사용한다. 

 // TODO


#### 풀스택 개발
풀스택으로 개발할때는 서버 변경이 있다면 서버를 재시작하고 UI가 변경되면 UI도 재컴파일해서 클라이언트에 반영해줘야한다.

 // TODO

## 빌드 및 배포
빌드는 다음 명령을 이용한다. 

    $> npm build
    
