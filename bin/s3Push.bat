if not defined ARTIFACT_BUCKET exit /B 1

if not defined APP set APP=spade
if not defined PACKAGING set PACKAGING=exe
if not defined DEPLOY_LATEST set DEPLOY_LATEST=true

if not defined VERSION for /f %%i in ('git describe --long --tags --always') do set VERSION=%%i

if not defined ARTIFACT set ARTIFACT=releases\setup.exe

if not exist %ARTIFACT% exit /B 1

for /f %%i in ('git symbolic-ref HEAD 2>nul') do set sym=%%i
if [%sym] == [] for /f %%i in ('git describe --contains --all HEAD') do set sym=%%i
if [%sym] == [] for /f %%i in ('git rev-parse --short HEAD') do set sym=%%i
set branch=!sym:refs/heads/=!

if [%GIT_BRANCH] == [] set GIT_BRANCH=%sym%
if [%GIT_COMMIT] == [] for /f %%i in ('git log -n1 --pretty=format:%H') do set GIT_COMMIT=%%i
if [%OPERATING_SYSTEM] == [] for /f %%i in ('wmic os get version') do set os=%%i
if [%OPERATING_SYSTEM] == [] set OPERATING_SYSTEM="windows"

(
  echo {
  echo   "app": "%APP%",
  echo   "packaging": "%PACKAGING%",
  echo   "version": "%VERSION%",
  echo   "commit": "%GIT_COMMIT%",
  echo   "branch": "%GIT_BRANCH%",
  echo   "build_os": "%os%"
  echo }
) > metadata.json

aws s3 cp %ARTIFACT% s3://%ARTIFACT_BUCKET%/%APP%/%OPERATING_SYSTEM%/%GIT_BRANCH%/%GIT_COMMIT%/%APP%.%PACKAGING%

aws s3 cp metadata.json s3://%ARTIFACT_BUCKET%/%APP%/%OPERATING_SYSTEM%/%GIT_BRANCH%/%GIT_COMMIT%/%APP%.metadata.json

if "%DEPLOY_LATEST%" == "true" (
  aws s3 cp %ARTIFACT% s3://%ARTIFACT_BUCKET%/%APP%/%OPERATING_SYSTEM%/%GIT_BRANCH%/latest/latest.%PACKAGING%
  aws s3 cp metadata.json s3://%ARTIFACT_BUCKET%/%APP%/%OPERATING_SYSTEM%/%GIT_BRANCH%/latest/%APP%.metadata.json
)
