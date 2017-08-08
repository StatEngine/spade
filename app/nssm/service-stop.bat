@echo off
set nssm_dir=%~dp0
set nssm=%nssm_dir%\win64\nssm.exe
set nssm_admin=%nssm_dir%\elevate.exe -k %nssm_dir%\win64\nssm.exe
set spade_exe=C:\Users\syrusm\AppData\Local\Programs\spade\spade.exe
set spade_log=C:\Users\syrusm\AppData\Local\Programs\spade\log.txt

echo start
%nssm_admin% stop spade
