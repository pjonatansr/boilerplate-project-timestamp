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
  req.date = new Date(parseInt(req.params.date));
  next();
});

app.use("/api/:date?", (req, res) => {
  const dateParam = req.params.date || Date.now();
  const date = req.date || new Date(dateParam);

  const isDate = (date) => !isNaN(date.getMonth());
  const invalidDate = () => { throw new Error("Invalid Date") };

  try {
    isDate(date) || invalidDate();
  } catch (e) {
    res.statusCode = 422;
    res.json({ error: e.message });
    console.log(e);
  }

  const data = {
    unix: date.getTime(),
    utc: date.toUTCString()
  }

  res.json(data);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
