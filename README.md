# 터미널 </br>

[Appstore](https://apps.apple.com/app/id1557178596) |
[Playstore](https://play.google.com/store/) |
<!-- [Web](https://www.haru-study.site/) | -->
[Notion](https://www.notion.so/Main-d0d4c0ecf4d744b180645abca77a9784) </br>

### 개발자 스터디 모임 모바일 앱

터미널은 개발 분야 스터디를 하고싶은 사람들을 위해 개발된 개발자 플랫폼 앱입니다 </br>
나를 어필할 수 있는 프로필을 통해 스터디에 가입하고 채팅과 게시판을 통해 스터디에 참여해보세요</br>

```
개발자들에게 친숙한 리눅스 터미널과 많은 이들이 한데 모여 여정을 떠나는 터미널이라는 뜻을 결합한 것으로,
개발자들이 한데 모여 같은 목적(스터디, 개발)을 향한다는 의미를 담고 있습니다.
```

 </br>
 
## 프로젝트 개요

**프로젝트 기간** : 2020.08 ~ 2021.03 </br>

**프로젝트 참여 인원** : Back-End 1명 , iOS 2명 , Android 2명 </br>

**주요 기능** :

```
1. 스터디 검색
   원하는 키워드로 스터디 검색
   iOS, Android, Back-end, Language, AI 등 설정되어있는 카테고리에 따라 스터디 검색
   프로필에 설정한 활동지역과 비교해 가장 가까운 스터디 모임순으로 정렬 or 최신순 정렬

2. 스터디 개설 및 관리
   카테고리와 스터디 정보를 입력해 스터디 모임 개설
   방장의 권한으로 공지사항, 스터디 정보수정, 가입처리 등 스터디 관리기능

3. 스터디 진행
   채팅, 공지사항, 스터디 정보를 통해 스터디 진행

4. 프로필 관리
   소개, 경력, 프로젝트와 Github, 블로그 등 SNS을 통해서 자신의 프로필 관리
   활동지역을 설정해 스터디 검색 시 거리순 검색 가능

5. 알림
   스터디 가입신청, 공지사항 생성 등 주요 알림사항은 푸시알림 전송
```

</br>

## 사용한 기술 스택

**Back-End**

`Javascript`
`Node.js`
`Nginx`
`JWT`
`Socket.io`
`Express.js`
`FCM`
`APNs`
`Mongoose`
`Winston`
`pm2`
</br>
`AWS EC2`
`Route53`
`MySQL`
`MongoDB`
`Redis`
</br>

**Development Tool**

`Git & Github`
`Notion`
`Slack`
`Postman`
</br>

**Front-End**

`Next.js`
`Ant Design Component`
</br></br>

## 개발

Javascript & Express로 REST API를 활용하여 유저, 스터디 등 전반적인 CRUD 기능 구현

Socket.io를 이용한 스터디 멤버 간 실시간 채팅 구현

JWT 토큰 인증 과정을 Express Middleware로 하는 인증체계 구축

Firebase FCM, Apple APNs를 이용한 푸시알림 전송 구현

Redis를 이용한 Push Badge Count 관리 및 Socket.io 클러스터링

Firebase Authentication, Node Mailer를 이용한 이메일 인증 및 계정 관리 구현

Sentry를 활용한 에러로그 수집 및 Slack으로 Message 전송 구현

3-tier Architecture 적용 -> [Controller - Service - Dao]

Next.js & Andt Design Component를 사용하여 랜딩 페이지 개발
</br></br>

## 프로젝트 아키텍쳐

![아키텍쳐](https://user-images.githubusercontent.com/61345745/111968155-36e1d300-8b3c-11eb-8d4b-f60aef766792.png)
</br></br>

## 프로젝트 관리

Notion을 이용하여 프로젝트 전반적인 기획 및 관리

- team rule, task 관리, api 문서 등

Slack을 이용하여 멤버 간 소통 및 서버에서 발생한 에러 확인

MySQL Workbench를 이용하여 데이터베이스 설계

주 단위 회의를 통한 개발 진행관리

ESLint, Prettier를 이용하여 코드 스타일 관리

Postman, Notion을 이용한 API 테스트 및 문서 공유

Sentry, Slack으로 실시간 에러 관리
</br></br>

### Directory Structure

```
cold-brew
├─bin
├─configs
├─controllers
├─dao
├─events
├─logs
│  └─error
├─middlewares
│  ├─error_handler
│  └─validators
├─models
├─routes
│  └─v1
├─services
├─test
│  ├─search
│  └─user
└─utils
    ├─errors
    └─variables
```

</br>

## 프로젝트 IA

![터미널 IA](https://user-images.githubusercontent.com/61345745/111910514-08fd7f80-8aa5-11eb-8d11-684bae814802.png)
