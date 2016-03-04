# Rlibro

## 개발 스택 
 
 - Client: React + Redux
 - API Server: Parser Server
 - DataBase: MongoLab, MongoDB

## 구성도

                     ⎡̅̅̅̅̅‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾⎤      
    [Production]     ⎢ Parse server  ⎟      ⎡̅̅̅̅̅‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾⎤
                     ⎢    heroku     ⎟----->⎢    MongoLab   ⎟
                     ⎣_______________⎦      ⎣_______________⎦

                            need Internet connection
     ------------------------------------------------------------------------
                          don't need Internet connection

                     ⎡̅̅̅̅̅‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾⎤       ⎡̅̅̅̅̅‾‾‾‾‾‾‾‾‾⎤
    [Development]    ⎢ Local server  ⎟------>⎢ MongoDB ⎟ 
                     ⎣_______________⎦       ⎣_________⎦

## 프로젝트 구성
두개의 프로젝트로 구성된다. 

#### 1. 서버
Parse Server로 만들어진 API 서버는 Heroku를 통해 배포된다. 따라서 현재 저장소의 위치는 배포용 Heroku 저장소에만 존재한다. Heroku 저장소에서 체크아웃 받으려면 [Herok Toolbelt](https://toolbelt.heroku.com/)라는 커맨드라인 도구를 먼저 인스톨해야한다. 자세한 내용은 [문서](https://dashboard.heroku.com/apps/rlibro-server/deploy/heroku-git
)를 참고하자.

 - 저장소: https://git.heroku.com/rlibro-rlibro.git
 
Toolbelt를 설치했다면 Heroku에서 체크아웃 받자.

    $> heroku git:clone -a rlibro-server
 

#### 2. 클라이언트
클라이언트는 React를 이용해 Full Ajax로 구현되어 있다. 일단 저장소에서 체크아웃 받자.

- 저장소 위치: git@bitbucket.org:4hrs/rlibro-client.git

    $> git clone git@bitbucket.org:4hrs/rlibro-client.git
    $> cd rlibro-client

React 클라이언트는 Webpack 빌드를 위해 프로젝트 내부에 서버 프로젝트를 심볼릭 링크로 참조하고 있다. 
    
    $> ln -fs ~/git/rlibro-server/ ./parser-server

이제 필요한 라이브러리를 설치해보자. 

    $> npm install
 

## 빌드 및 배포
클라이언트 프로젝트에서 빌드를 실행하면 심볼링 링크를 걸어둔 서버 프로젝트에 빌드 결과가 배포된다. 

    $> npm run build

빌드된 결과를 Heroku 서버에 배포하려면 히로쿠 저장소에 Push 하면 된다. Heroku에 변경값이 푸시되면 자동으로 배포된다.

    $> git push heroku master


## 로컬 개발환경 구성
#### 1. MongoDB 설치
클라이언트 프로젝트는 실서버 API와 로컬 API를 모두 사용할수있다. 로컬 API를 사용하려면 일단 로컬에 MongoDB를 설치해야한다.

    $> brew install mongo
    $> mongod --config /usr/local/etc/mongod.conf

#### 2. Mongo 데이터 베이스 백업 및 복구
로컬 몽고 DB엔 데이터가 없으므로 실서버(MongoLab)에 있는 데이터를 가져오자. 

    $> mongodump -h ds015878.mongolab.com:15878 -d rlibro -u <username> -p <password> -o ./

가져온 데이터를 로컬 몽고디비에 넣기 위해서 몽고가 먼저 실행되어있어야한다 

    $> mongorestore -h 127.0.0.1:27017 -d rlibro ./rlibro/

#### 3. 로컬 개발 시작
실시간 개발을 위해 클라이언트 개발 서버를 실행한다. 

    $> npm start

#### 4. 실서버 데이터를 이용해 디버깅
로컬DB를 사용하다 실서버 데이터를 사용해보고 싶다면 configureStore.dev.js 파일을 아래와 같이 실서버 API를 사용하도록 수정한다.

    Parse.serverURL = 'https://rlibro.herokuapp.com/'

#### 5. 새로운 아이콘을 추가하고 싶을때
[fontastic](https://app.fontastic.me/accounts/login/)을 이용해 아이콘을 폰트에 삽입하고 있다. 

        
