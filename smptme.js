"use strict";
const admin = require('firebase-admin');
const nodemailer = require("nodemailer");
let http         = require('http');
let fs           = require('fs');

const url = require('url');
const querystring = require('querystring');

let sendtocc       = ["test@test.com", "test1@test.com"]

var mailtemplete = fs.readFileSync('templete.html','utf8');

http.createServer(function (req, res) {
  if (req.url != '/favicon.ico') {

    const queryObject = url.parse(req.url,true).query;
    let sendToThis    = queryObject['visitorMe']
    let nameOfThis    = queryObject['name']
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Sent To : '+ sendToThis);
    // console.log('Sent To : '+ parsedQs)
    // console.log(req.url);
    main(sendToThis, nameOfThis).catch(console.error);
  }

  
}).listen(8080);

// async..await is not allowed in global scope, must use a wrapper
async function main(sendToThis, nameOfThis) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'test@test.com', // generated ethereal user
      pass: 'Your Email / EamilApp  Password', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"FirstName LastName" <test@test.com>', // sender address
    to: sendto, // list of receivers
    subject: "Hello Test", // Subject line
    //text: "Hello world?", // plain text body
    html: mailtemplete, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}



// http://localhost:8080/?visitorMe=testme@mailinator.com&name=test