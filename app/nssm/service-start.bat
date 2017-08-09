@echo off
set nssm_dir=%~dp0
set nssm=%nssm_dir%\win64\nssm.exe
set nssm_admin=%nssm_dir%\elevate.exe -k %nssm_dir%\win64\nssm.exe

echo start
%nssm_admin% start spade
