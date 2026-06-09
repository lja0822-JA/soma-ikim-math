@echo off
chcp 65001 >nul
title 소마 이김수학학원 - 자동 배포 1회 설정

set "GIT=C:\Program Files\Git\cmd\git.exe"
set "GH=C:\Program Files\GitHub CLI\gh.exe"
set "ROOT=%~dp0"
cd /d "%ROOT%"

echo.
echo  ============================================
echo   자동 배포 1회 설정 (처음 한 번만)
echo  ============================================
echo.

if not exist "%GIT%" (
  echo [오류] Git이 설치되어 있지 않습니다.
  pause
  exit /b 1
)
if not exist "%GH%" (
  echo [오류] GitHub CLI가 설치되어 있지 않습니다.
  pause
  exit /b 1
)

echo [1/4] GitHub 로그인 확인...
"%GH%" auth status >nul 2>&1
if errorlevel 1 (
  echo.
  echo  브라우저가 열리면 GitHub 로그인을 완료해 주세요.
  echo  질문이 나오면:
  echo    - GitHub.com 선택
  echo    - HTTPS 선택
  echo    - Login with a web browser 선택
  echo.
  "%GH%" auth login -w -p https -h github.com
)

echo.
echo [2/4] GitHub 저장소 생성 및 업로드...
"%GH%" repo view soma-ikim-math >nul 2>&1
if errorlevel 1 (
  "%GH%" repo create soma-ikim-math --public --source=. --remote=origin --push
) else (
  "%GIT%" add .
  "%GIT%" commit -m "update: site changes" 2>nul
  "%GIT%" push -u origin main 2>nul
  if errorlevel 1 "%GIT%" push -u origin master
)

echo.
echo [3/4] Netlify와 GitHub 연결 페이지를 엽니다...
echo.
echo  Netlify 화면에서:
echo    1. Link repository 클릭
echo    2. GitHub 연결 허용
echo    3. soma-ikim-math 저장소 선택
echo    4. Branch: main
echo    5. Build command: 비워두기
echo    6. Publish directory: .  (점 하나)
echo    7. Deploy site 클릭
echo.
start "" "https://app.netlify.com/projects/venerable-croissant-064c15/link"

echo.
echo [4/4] 완료!
echo.
echo  이후 수정은 "수정후-배포.bat" 실행만 하면
echo  https://venerable-croissant-064c15.netlify.app 에 자동 반영됩니다.
echo.
pause
