const ExcelJS = require('exceljs');
let xlsx = require('node-xlsx');


module.exports = {


    zipRead: async (file, path) => {

        return new Promise((resolve, reject) => {
            var tmp_paths = file;
            var obj = xlsx.parse(fs.readFileSync(tmp_paths));
            // parses a buffer
            // console.log("objLength==>",obj[0].data)
            resolve(obj[0].data);

            //     var obj = xlsx.parse(fs.readFileSync(tmp_paths)); // parses a buffer
            //     console.log("objLength==>", obj[0].data.length)
            //     resolve(obj[0].data);
            // })

            // excelParser.worksheets({
            //     inFile: tmp_paths
            // }, function (err, worksheets) {
            //     if (err) console.error(err);
            //     consol.log(worksheets);
            // });

            return
        })

    }
}