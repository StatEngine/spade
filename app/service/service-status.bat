@echo off
set service_dir=%~dp0
set spade_install_dir=%service_dir%\..\..\..
set spade_service=%service_dir%\spade-service.exe

echo status
%spade_service% status
