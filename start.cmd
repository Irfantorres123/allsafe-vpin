WHERE docker-compose
IF %ERRORLEVEL% NEQ 0 ECHO docker-compose wasn't found. Check if you installed it and set the path correctly && PAUSE 
cd authapi/apiserver && start start.cmd && cd ../../vpin/vpin && npm install && start expo start && cd../../bankserver && start main.html