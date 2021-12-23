// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(_, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function(_, res) {
  res.json({ greeting: 'hello API' });
});

//Debug request
app.use((req, _, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.use("/api/:date(\\d+)", (req, _, next) => {
  req.date = parseInt(req.params.date) * 1000;
  next();
});

app.use("/api/:date(\\d{4}-\\d{2}-\\d{2})", (req, _, next) => {
  req.date = req.params.date;
  next();
});

app.use("/api/:date", (req, res) => {
  if (req.date) {
    const date = new Date(req.date);
    return res.json(
      {
        unix: date.getTime(),
        utc: new Date(date).toUTCString(),
        date: req.params.date
      }
    );
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
