@echo off
echo stop
.\win64\nssm.exe stop spade

echo remove service if it exists already
.\win64\nssm.exe remove spade confirm

echo register service, and configure
.\win64\nssm.exe install spade C:\Users\syrusm\AppData\Local\Programs\spade\spade.exe
.\win64\nssm.exe set spade AppParameters -- --service
.\win64\nssm.exe set spade AppRotateFiles 1
.\win64\nssm.exe set spade AppRotateOnline 1
.\win64\nssm.exe set spade AppRotateBytes 10000000
.\win64\nssm.exe set spade AppStdout C:\Users\syrusm\AppData\Local\Programs\spade\log.txt
.\win64\nssm.exe set spade AppStderr C:\Users\syrusm\AppData\Local\Programs\spade\log.txt

echo start
.\win64\nssm.exe start spade
