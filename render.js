let ejs = require("ejs");
let fs = require("fs");

let inputPath = "cards/";
let outputPath = "output/";

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}
fs.readdir(inputPath, function (err, files) {
    if (err) {
        return console.error(err);
    }
    files.forEach(function (filename) {
        if (!filename.endsWith(".ejs")) {
            console.log("Unknown file " + filename)
        } else {
            let basename = filename.substr(0, filename.length - 4);
            ejs.renderFile(inputPath + filename, function (err, str) {
                if (err) {
                    return console.error(err);
                }
                fs.writeFile(outputPath + basename + ".html", str, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("Generate " + basename + ".html")
                });
            });
        }

    });
});