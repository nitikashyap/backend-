const express = require("express");
const mongoose = require("mongoose")
const app = express();

var adminRouter = require('./routes/admin');
var userRouter = require('./routes/user');
var indexRouter = require('./routes/index');
var staticRouter = require('./routes/staticContent');

const cors = require('cors');
const bodyParser = require('body-parser')


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.set('trust proxy', true);

//mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

app.use(cors());

mongoose.connect(`mongodb+srv://dbuser:ubuntu@cluster0.dhd93y1.mongodb.net/Hunting`, { useNewUrlParser: true }, (err, result) => {
  if (err) {
    console.log("Error in connecting with database")
  }
  else {
    console.log('Mongoose connecting is setup successfully')
  }
});
// require('./utility/sendSms')


//==========================Request Console=======================//

app.all("*", (req, resp, next) => {
  let obj = {
    Host: req.headers.host,
    ContentType: req.headers['content-type'],
    Url: req.originalUrl,
    Method: req.method,
    Query: req.query,
    Body: req.body,
    Parmas: req.params[0]
  }
  next();
});

app.use('', indexRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/static', staticRouter);




const port = 6200;
app.listen(port, () => {
  console.log(`You pick up listening on port ${port}`);
})

