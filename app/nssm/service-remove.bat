@echo off
set nssm_dir=%~dp0
set nssm=%nssm_dir%\win64\nssm.exe
set nssm_admin=%nssm_dir%\elevate.exe -k %nssm_dir%\win64\nssm.exe
set wait=timeout /T 3 /NOBREAK
set wait_net=ping 127.0.0.1 -n 3 > null

echo stop
%nssm_admin% stop spade
%wait%

echo remove service if it exists already
%nssm_admin% remove spade confirm
