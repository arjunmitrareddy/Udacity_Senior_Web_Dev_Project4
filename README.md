# Corporate Dashboard
A Corporate Dashboard application, with Real-Time Updated data using Socket Programming. Application fetches data from CSV, JSON files which are modified on the server every few seconds and the modified data is updated on the Client via Sockets

##[DEMO](https://dashboard-amr.herokuapp.com)

##Screenshots
### Geospatial View
![image](https://github.com/arjunmitrareddy/Udacity_Senior_Web_Dev_Project4/blob/master/screens/1.png)

### Metrics View
![image](https://github.com/arjunmitrareddy/Udacity_Senior_Web_Dev_Project4/blob/master/screens/2.png)

###Issues View
![image](https://github.com/arjunmitrareddy/Udacity_Senior_Web_Dev_Project4/blob/master/screens/3.png)

##Technologies Used:
- [ECMAScript 6](http://es6-features.org/)
- [AngularJS v1.5.7](https://angularjs.org/)
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Gulp](http://gulpjs.com/)
- [Sass](http://sass-lang.com/)
- HTML5
- CSS3

##Compiler Used:
[Babel](https://babeljs.io/)

##Instructions to Run the Application (PRODUCTION):
- Installing dependencies:
```{r, engine='bash', count_lines}
$ npm run dep
```
This will install both npm and bower dependencies
- Running the Application:
```{r, engine='bash', count_lines}
$ npm run serve
```
This will run gulp serve, which will Compile, Collect & Minify all the Required Assets & Place them in a build directory and then serve it.
