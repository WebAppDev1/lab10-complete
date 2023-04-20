// use javascript in strict mode
"use strict";

// import all required modules
import express from "express";
import exphbs from "express-handlebars";
import logger from "./utils/logger.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

// initialise project
const app = express();

// static files output to public folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false, }));
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true
}));

// use handlebars as view engine
const handlebars = exphbs.create({ 
  extname: ".hbs",
helpers: {
     
      uppercase: (inputString) => {
        return inputString.toUpperCase();
      },
     
      formatDate: (date) => {
        let dateCreated = new Date(date);
        let options = {year: "numeric", month: "long", day: "2-digit"};        
        return `${dateCreated.toLocaleDateString("en-IE",options)}`;
      },
     
      calcTotal: (arr) => {
        let totDuration = 0;
        arr.forEach(song => totDuration += parseFloat(song.duration))       
        return totDuration
      },
  }
});
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

// import routes file and use this for routing
import routes from "./routes.js";
app.use("/", routes);

// listen for requests :)
const listener = app.listen(process.env.PORT || 4000, function () {
  logger.info("Your app is listening on port " + listener.address().port);
});
