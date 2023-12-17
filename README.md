# How to run the Script?

* After cloning the script. Get inside project directory directory from terminal and run `npm i`
* Then go to *src/* folder and run `node index.js`
* User will be propmted to enter the path of the file - Enter the correct absolute path, if user enter wrong path the script will exit, so user have to run the script again.
* User will be prompted to enter the range of messages for which user want to get the difference. Enter the range **<Range_from-Range_to>** for eg. **10-20**. If user enter the incorrect range it will give user the error message and allow user to enter the range again. But if user exceed the max range it will display the max range and the script will exit.
* User will be promped to enter his/her choice whether to send an email or not. Enter Y or y for sending the email and any other key for not sending.

## Output
* User will ge the output in the console
* A diff.txt file is created in the root dir of project
* If the user has selected Y for sending an email will be sent to the listed recipients in **mailaddress.json** file