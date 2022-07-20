let apn = require("apn"),
    options, connection, notification;
let FCM = require('fcm-node');
let serverKey = 'AAAAeCketZ0:APA91bHsM0jFKfCZpyXwE_ng56zvDQCvcNZsO1xC1o7pLKDYEmjFuWlZdIuBP9D20tyCjXoKB4fdA3iYAVpokLePLvoO-MBqNr3f24HPeR9jgnrjR_C5xYK7ZG0hKTSflGU8YGbbPcWs';
let fcm = new FCM(serverKey);

const accountSid = 'ACb4a3f5ab788a7c13ebde2ea1f6b47650';
const authToken = '38c68f002a896982c2bda80cba3e22c2';
const client = require('twilio')(accountSid, authToken);


exports.sendText= (number,text, callback) => {
    console.log(number, "====>>>", number)
    client.messages
        .create({
            to: number,
            from: "+12056495523",
            body:text,
        })
        .then((message) => {
            console.log("space", message.sid)
            callback(message.sid);
        }, (err) => {
            console.log(err);
            callback(null);
        });
}


exports.sendiosNotification = (deviceToken,title,msg,notificationId,badgeCount1, callback) => {
 
    var options = {
        "cert": "CertificatesVanVuverDriver_7_may.pem",
        "key": "CertificatesVanVuverDriver_7_may.pem",
    };
    var apnProvider = new apn.Provider(options);
    var note = new apn.Notification();
    note.badge =badgeCount1;
    note.sound = msg;
    note.alert={
        title: title,
        body: msg
    }
    note.payload = {title:title,msg: msg,notificationId:notificationId};
    note.topic = "mobulous.VanvuverDriver1";
    console.log(`Sending: ${note.compile()}`);
    apnProvider.send(note, deviceToken).then( (result) => {
       console.log("send driver notification successfully================>",result);
      })
      .catch((e)=>{
          console.log("err=======>",e);
      })
};

exports.sendNotificationForAndroid=(deviceToken, title, body,type,callback)=>{
    console.log("Token is=======>",deviceToken);
    var message = {
        to: deviceToken,
        notification: {
            title:title, 
            body: body,
            sound:'default',
            type:type
        },
        data: {
            title: title,
            body: body,
            sound:'default',
            type:type
        }
    };
    console.log("Message is=========>",message);
    fcm.send(message, function(err, response) {
        if (err) {
          console.log("Error in sending notification===========>",err);
        } else {
            console.log('Notification send successfully',response);
        }
    })

}