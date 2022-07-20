const fs = require('fs');
var AWS = require('aws-sdk');
AWS.config = {
    "accessKeyId": 'AKIAQRE3UHEMU4GGAIGZ',
    "secretAccessKey": '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',
    "region": 'us-east-2',

};
const s3 = new AWS.S3({ region: 'us-east-2' })
const BucketName = 'touchimage'
exports.upload = (file, path) => {

    return new Promise((resolve, reject) => {
        var tmp_path = file.path;
        image = fs.createReadStream(tmp_path);
        imageName = path + Date.now() + "-" + file.name;
        const params = {
            Bucket: BucketName,
            Key: imageName,
            ACL: 'public-read',
            Body: image,
            ContentType: file.type
        };
        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Location);
            }
        })
    })
}
exports.uploadPath= (file, path) => {

    return new Promise((resolve, reject) => {
        var tmp_path = file.path;
        image = fs.createReadStream(tmp_path);
        imageName = path + Date.now() + "-" + file.name;
        const params = {
            Bucket: BucketName,
            Key: imageName,
            ACL: 'public-read',
            Body: image,
            ContentType: file.type
        };
        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log(data)
                resolve(data.Location);
            }
        })
    })
}

exports.deleteImage = (file) => {

    return new Promise((resolve, reject) => {
        let newImage = file.split('https://wow-won-images.s3.us-west-2.amazonaws.com/')[1]
        s3.deleteObject({
            Bucket: BucketName,
            Key: newImage
        }, (err, data) => {
            if (err)reject(err)
            else resolve(data)
        })
    })
}


exports.uploadImage= (req) => {

    return new Promise((resolve, reject) => {
           let body = Buffer.from(req.files.image.data, 'binary')
           const params = {
                    Bucket: 'touchimage',
                    Key: `passport/touch_passport_user_${+new Date()}_${req.files.image.name}`,
                    Body: body
                };
        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log(data)
                resolve(data.Location);
            }
        })
    })


    // let body = Buffer.from(req.files.image.data, 'binary')
                            
    //             const params = {
    //                 Bucket: 'touchimage',
    //                 Key: `passport/touch_passport_user_${+new Date()}_${req.files.image.name}`,
    //                 Body: body
    //             };
                
    //                 s3.putObject(params, function (err, data1) {
    //                     if (err) {
    //                        // reject(err);
    //                     } else {
    //                          url = "https://touchimage.s3.us-east-2.amazonaws.com/" + params.Key;
    //                         console.log("url", url)
    //                         return response.responseHandlerWithData(res, statusCode.SUCCESS, "Tourist file upload successfully", url);
    //                     }

    //                 })


}






