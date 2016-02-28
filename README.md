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

#### 1. 클라이언트
Webpack 빌드를 위해 클라이언트 프로젝트 내부에 서버 프로젝트를 심볼릭 링크로 참조하고 있다. 
    
    $> ln -fs ~/git/rlibro-server/ ./parser-server

 - 프로젝트 이름: rlibro-client
 - 저장소 위치: git@bitbucket.org:4hrs/redbook.git

#### 2. 서버
Parse Server로 만들어진 API 서버는 Heroku를 통해 배포된다. 따라서 현재 저장소의 위치는 배포용 Heroku만 존재한다. 

 - 프로젝트 이름: rlibro-server
 - 저장소 위치: https://git.heroku.com/rlibro.git

## 빌드 및 배포
빌드 명령을 실행하면 React 클라이언트 앱이 압축되어 서버 프로젝트로 배포된다. 

    $> npm run build

배포는 Heroku 저장소에 커밋을 하면 자동으로 배포 된다. 

    $> git push heroku master


## 로컬 개발환경 구성
#### 1. MongoDB 설치
로컬 개발환경은 인터넷이 없는 곳에서도 개발을 해야하므로 로컬에 MongoDB를 설치해서 진행한다. 

    $> brew install mongo
    $> mongod --config /usr/local/etc/mongod.conf

#### 2. Mongo 데이터 베이스 백업 및 복구
처음엔 데이터가 없으므로 실서버(MongoLab)에 있는 데이터를 가져와야한다. 

    $> mongodump -h ds015878.mongolab.com:15878 -d rlibro -u <username> -p <password> -o ./

가져온 데이터를 로컬 몽고디비에 넣기 위해서 몽고가 먼저 실행되어있어야한다 

    $> mongorestore -h 127.0.0.1:27017 ./rlibro/

#### 3. 설

        
