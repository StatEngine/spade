@echo off
@echo off
set nssm_dir=%~dp0
set nssm=%nssm_dir%\win64\nssm.exe
set nssm_admin=%nssm_dir%\elevate.exe -k %nssm_dir%\win64\nssm.exe
set spade_exe=C:\Users\syrusm\AppData\Local\Programs\spade\spade.exe
set spade_log=C:\Users\syrusm\AppData\Local\Programs\spade\log.txt

echo register service, and configure
%nssm_admin% install spade %spade_exe%
%nssm_admin% set spade AppParameters -- --service
%nssm_admin% set spade AppRotateFiles 1
%nssm_admin% set spade AppRotateOnline 1
%nssm_admin% set spade AppRotateBytes 10000000
%nssm_admin% set spade AppStdout %spade_log%
%nssm_admin% set spade AppStderr %spade_log%
