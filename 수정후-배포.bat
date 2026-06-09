@echo off
chcp 65001 >nul
title 소마 이김수학학원 - 수정 후 배포

set "GIT=C:\Program Files\Git\cmd\git.exe"
set "GH=C:\Program Files\GitHub CLI\gh.exe"
set "ROOT=%~dp0"
cd /d "%ROOT%"

echo.
echo  변경 사항을 GitHub에 올리는 중...
echo  (1~2분 후 Netlify 링크에 자동 반영됩니다)
echo.

"%GH%" auth status >nul 2>&1
if errorlevel 1 (
  echo [오류] GitHub 로그인이 필요합니다. "자동배포-설정.bat"을 먼저 실행하세요.
  pause
  exit /b 1
)

"%GIT%" add .
"%GIT%" commit -m "update: site changes"
if errorlevel 1 (
  echo 변경된 파일이 없습니다.
  pause
  exit /b 0
)

"%GIT%" push
if errorlevel 1 (
  echo push 실패. 인터넷 연결과 GitHub 로그인을 확인하세요.
  pause
  exit /b 1
)

echo.
echo  배포 요청 완료!
echo  사이트: https://venerable-croissant-064c15.netlify.app
echo  Netlify에서 1~2분 후 반영됩니다.
echo.
pause
