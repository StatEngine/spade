@echo off
@echo off
set nssm_dir=%~dp0
set spade_install_dir=%nssm_dir%\..\..\..
set nssm=%nssm_dir%\win64\nssm.exe
set nssm_admin=%nssm_dir%\elevate.exe -k %nssm_dir%\win64\nssm.exe
REM -- this is where the app is installed on the machine
REM -- example win7 C:\Users\<user>\AppData\Local\Programs\spade
set spade_exe=%spade_install_dir%\spade.exe
set spade_log=%spade_install_dir%\log.txt

echo register service, and configure
%nssm_admin% install spade %spade_exe%
%nssm_admin% set spade AppParameters -- --service
%nssm_admin% set spade AppRotateFiles 1
%nssm_admin% set spade AppRotateOnline 1
%nssm_admin% set spade AppRotateBytes 10000000
%nssm_admin% set spade AppStdout %spade_log%
%nssm_admin% set spade AppStderr %spade_log%
