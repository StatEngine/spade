@echo off
set service_dir=%~dp0
set spade_install_dir=%service_dir%\..\..\..
set spade_service=%service_dir%\spade-service.exe
set spade_service_admin=%service_dir%\elevate.exe -wait %service_dir%\spade-service.exe
REM -- this is where the app is installed on the machine
REM -- example win7 C:\Users\<user>\AppData\Local\Programs\spade
set spade_exe=%spade_install_dir%\spade.exe
set wait=timeout /T 3 /NOBREAK

echo stop
%spade_service_admin% stop
REM %wait%

echo remove spade_service if it exists already
%spade_service_admin% uninstall
