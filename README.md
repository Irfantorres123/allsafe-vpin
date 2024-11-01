**Hilane Digital VPIN Demo**

The project has three main directories,
1. authapi/apiserver - This contains our hilane digital server code that will perform tasks like user authentication, call generation and response validation.
2. bankserver - This is a simple app that emulates a bank application entirely without a server. This will be the app where user tries to authenticate himself 
before performing any transactions.
3. vpin/vpin - This contains the code for the mobile app which will store the VCS of the user and where he will get the codes that authenticate him to third party apps.


Now we will look a little deeper into how the whole process works,

**authapi/apiserver**

This server is written in node js and has been dockerized for convenience of running. The API exposed by this server contains the following routes,

1. **GET /services/list** - Lists all the services registered in the app. For demo the services are hard coded in init/init.js and stored in the 
Services collection in the database. When the app starts up for the first time, it will store fetch the names and codes of the services and
add them to the Services collection in the database if it doesnt already exist. 

2. **POST /users/v1/register** - This endpoint takes the following parameters,

      headers : 

        x-service-id: This field is used to refer to the id of the service in which the user is trying to register or login.

      body : 

        username: The username of the user,
        accountNumber: The accountNumber of the user

      
      It returns an object with the following fields,

          a. id: Returns the id of the user created. If a user already exists with the same username and accountNumber, then instead of registering a new user the existing users id will be returned.

          b. code: This code is used to fetch the VCS associated with the particular service for this particular user.

3. GET **/vcs/code** - This takes the code returned by /users/v1/register as a query parameter and returns the vcs associated with the code.

4. GET **/vcs/call** - This takes the userId as a parameter and returns the call associated with that user. Since each user in each service can only have one call associated with
them at a time, this will not cause any collisions.

5. GET **/vcs/verify** - This endpoint is used to verify the response to a call. This endpoint takes the following parameters,

      headers : 

        x-service-id: This field is used to refer to the id of the service in which the user is trying to register or login.
      
      queryparams :
      
        username: The username of the user trying to authenticate himself.
        response: The response to the call.
        
      It returns an object with the following fields,
        
        a. status: "success" if the response is correct, "failure" otherwise 

**bankserver**

  The bank application contains three pages,
  
  1. main.html - This page displays the name of the bank into which the user is logging in, for convenience in demo, you can change the bank application that is emulated
  by clicking on the name of the bank and selecting a different one. The user enters his username for logging in in this page. Once the username is submitted, a call is
  generated by the server for this user.
  
  2. verify.html - In this page the user enters the response to the call. This is where the user opens his mobile app and clicks on get code next to the name of the bank
  to fetch the call and convert it into the response.
  
  3. status.html -  Once the user submits the response to the call, he will be redirected this page and the depending on whether the response was correct or wrong, this
  page will display "Login successful" or "Login failed" respectively.
  
**vpin/vpin**

  The mobile app contains the following screens,
  
  1. Apps - This is the homepage which displays the names of all the services into which the user is logged in.
  2. AddService - This page fetches the services using the /services/list endpoint to display the services that our hilane server supports.
  3. Login - On selecting a service the user is shown this page where he enters his username and accountNumber as provided by the bank to login. For the sake of demo,
  the endpoint which creates authenticates a new user isnt used but instead we use the userId returned by the /users/v1/register endpoint as an authentication
  token for the user directly. This means if you enter any username and accountNumber pair that dont exist, it will be created automatically therefore acting as both a registration
  and authentication endpoint.
  
The **Get Code** button does the following,

It fetches the call associated with the particular user and then uses the VCS stored locally for that service to generate the response and displays it in a box. Clicking on that box will copy the coded into clipboard so that it can be pasted directly in the bank application for authentication.
  
**Running the servers**

I have written a script called start.cmd to automatically start the three application servers simply double clicking on the script will start the servers provided the 
following binaries are installed and configured in the PATH environment variable.

docker : https://docs.docker.com/desktop/install/windows-install/ 

docker-compose : https://docker-docs.netlify.app/compose/install/

npm : https://nodejs.org/en/download/

Once these binaries are installed, run docker desktop and after the docker daemon has started running, run the start.cmd file, If all worked correctly, you should see the applications starting up soon once the dependencies are installed and the build is complete.
