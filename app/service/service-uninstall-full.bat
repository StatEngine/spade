@echo off
set service_dir=%~dp0
set spade_install_dir=%service_dir%\..\..\..
set spade_service=%service_dir%\spade-service.exe
set spade_service_admin="%service_dir%\elevate.exe" -wait "%service_dir%\spade-service.exe"

echo stop
%spade_service_admin% stop

echo remove spade_service if it exists already
%spade_service_admin% uninstall
