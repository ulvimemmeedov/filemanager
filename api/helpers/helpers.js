const fs = require("fs");
const path = require("path");
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'test')
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname )
  }
});

const upload = multer({ storage: storage });

function decode (str) {
    return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
}

const customErrorHandler = (e, req, res, next) => {

    let customError = e;

    if (e.name === "SyntaxError") {
        customError = new CustomError("Unexpected Syntax syn123", 400)
    };
    if (e.name === "secretOrPrivateKey") {
        customError = new CustomError("keys not in .env nkn444", 500)
    };

    if (e.name === "ValidationError") {
        customError = new CustomError(e.message, 400);
    };

    if (e.name === "MongoServerError") {
        customError = new CustomError("Database Server Error MONGO444", e.status);
    };

    if (e.code === 11000) {
        customError = new CustomError(`Dublicate key error code collection is exits MONGO333 : ${e.code}`, 400);
    };

    if (e.name === "MongoError") {
        customError = new CustomError(`MongoStd Database Server Error code : ${e.code}`, e.status);
    };

    if (e.name === "CastError") {
        customError = new CustomError('Please provide valid id', 400);
    };

    if (e.name === "TypeError") {
        customError = new CustomError('Internal Server Error (type error json)', 500);
    }
    catchError(customError)
    res.status(customError.status || 500).json({
        success: false,
        error: {
            message: customError.message,
        }
    })
}

function sendJwtToClient(user, res) {

    const token = user.generateJwtFromUser();

    return res

        .status(200)

        .cookie("access_token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE) * 1000 * 60),
            secure: process.env.NODE_ENV === "development" ? false : true
        })

        .json({
            success: true,
            access_token: token,
            message: "Success Auth",
            data: user
        });

}

function isTokenIncluded(req) {
    return req.cookies && req.cookies.access_token;

}

function getAccessTokenFromHeader(req) {

    const access_token = req.cookies.access_token;

    return access_token;

}

function catchError(e) {
    if (e.fatal) {
        console.log(e);
    }
    const nd = new Date();
    const y = nd.getFullYear();
    const m = (nd.getMonth() + 1);
    const d = nd.getDate();
    const h = nd.getHours();
    const mm = nd.getMinutes();
    const s = nd.getSeconds();
    let err;
    if (e.name == "MongoParseError") {
        err = JSON.stringify({
            name: e.name,
            code: e.code,
            status: e.status,
            error: e,
        }, null, 2)
    }
    else if (e.name === "SyntaxError") {
        err = JSON.stringify({
            e: e,
            status: e.status,
            customMsg: "Unexpected Syntax"
        }, null, 2)
    }
    else if (e.name === "secretOrPrivateKey") {
        err = JSON.stringify({
            error: e,
            status: e.status,
            customMsg: "keys not in .env"
        }, null, 2)
    }
    else if (e.name === "ValidationError") {
        err = JSON.stringify({
            error: e,
            status: e.status,
            customMsg: "keys not in .env"
        }, null, 2)
    }
    else if (e.name === "MongoServerError") {
        err = JSON.stringify({
            error: e,
            message: e.message,
            status: e.status,
            customMsg: "Database Server Error"
        }, null, 2)
    }
    else if (e.code === 11000) {
        err = JSON.stringify({
            error: e,
            message: e.message,
            status: e.status,
            customMsg: `Dublicate key error code user is exits : ${e.code}`
        }, null, 2)
    }
    else if (e.name === "MongoError") {
        err = JSON.stringify({
            error: e,
            message: e.message,
            status: e.status,
            customMsg: `Database Server Error code : ${e.code}`
        }, null, 2)
    }
    else if (e.name === "CastError") {
        err = JSON.stringify({
            error: e,
            message: e.message,
            status: e.status,
            customMsg: `Please provide valid id`
        }, null, 2)
    }
    else if (e.name === "TypeError") {
        err = JSON.stringify({
            error: e,
            message: e.message,
            status: e.status,
            customMsg: `Internal Server Error (type error json)`
        }, null, 2)
    }
    else {
        err = JSON.stringify(e, null, 2)

    }
    if(!fs.existsSync(path.resolve(__dirname, '../error_logs'))) { fs.mkdirSync(path.resolve(__dirname, '../error_logs')); }
    if(!fs.existsSync(path.resolve(__dirname, '../error_logs', `${y}-${m<10?`0${m}`:m}-${d<10?`0${d}`:d}`))) { fs.mkdirSync(path.resolve(__dirname, '../error_logs', `${y}-${m<10?`0${m}`:m}-${d<10?`0${d}`:d}`)); }
    fs.writeFileSync(path.resolve(__dirname, '../error_logs', `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}`, `log-${h < 10 ? `0${h}` : h}-${mm < 10 ? `0${mm}` : mm}-${s < 10 ? `0${s}` : s}.json`), err);

}

function validationUserInput(email, password) {

    return email && password;

}

function comparePassword(password, hashedPassword) {

    return bcrypt.compareSync(password, hashedPassword);

}

function print(text, color) {
    let c = "\x1b[0m%s\x1b[0m";
    if (color) {
        if (color == "blue") c = "\x1b[36m%s\x1b[0m";
        if (color == "yellow") c = "\x1b[33m%s\x1b[0m";
        if (color == "red") c = "\x1b[31m%s\x1b[0m";
        if (color == "black") c = "\x1b[30m%s\x1b[0m";
        if (color == "white") c = "\x1b[1m%s\x1b[0m";
        if (color == "green") c = "\x1b[32m%s\x1b[0m";
        if (color == "purple") c = "\x1b[35m%s\x1b[0m";
        if (color == "gray") c = "\x1b[37m%s\x1b[0m";
    }
    console.log(c, text);
}
function includeParams(params) {
    if (params.length < 1) {
        return false;
    }
    return true;
}
function today() {
    const nd = new Date();
    const y = nd.getFullYear();
    const m = (nd.getMonth() + 1);
    const d = nd.getDate();
    return `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}`;
}

function yesterday() {
    const nd = new Date();
    const y = nd.getFullYear();
    const m = (nd.getMonth() + 1);
    const d = nd.getDate() - 1;
    return `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}`;
}

function now() {
    const nd = new Date();
    const y = nd.getFullYear();
    const m = (nd.getMonth() + 1);
    const d = nd.getDate();
    const h = nd.getHours();
    const mm = nd.getMinutes();
    const s = nd.getSeconds();
    return `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d} ${h < 10 ? `0${h}` : h}:${mm < 10 ? `0${mm}` : mm}:${s < 10 ? `0${s}` : s}`;
}

function randString() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve(1), ms));
}

function checkurl (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (new RegExp(/(script)|(&lt;)|(&gt;)|(%3c)|(%3e)|(SELECT)|(UPDATE)|(INSERT)|(DELETE)|(GRANT)|(REVOKE)|(UNION)|(&amp;lt;)|(&amp;gt;)/g).test(req.url)) {
      return res.json({ 
          success:false,
          message: 'not!' 
        });
    } else {
        next();
    }
}
const saveFile = async (data, _path, fin, callback) => {
    const path = _path.replace(/\.\./g, '');
    const extraPath = Math.floor(Math.random() * (99 - 10) + 10);
    if (!fs.existsSync(`./uploads`)) { fs.mkdirSync(`./uploads`); }
    if (!fs.existsSync(`./uploads/${path}`)) { fs.mkdirSync(`./uploads/${path}`); }
    if (!fs.existsSync(`./uploads/${path}/${extraPath}`)) { fs.mkdirSync(`./uploads/${path}/${extraPath}`); }
    if (!exts.includes(data.ext)) {
      callback('');
    } else if (data.filedata) {
      var name = data.filename `.${data.ext}`;
      while (fs.existsSync(`./uploads/${path}/${extraPath}/${name}`)) {
        name = makeid() + `.${data.ext}`;
      }
      let base64Data = Buffer.from(data.filedata.split(',')[1], 'base64');
      fs.writeFileSync(`./uploads/${path}/${extraPath}/${name}`, base64Data);
      generateFileToken({ path: `./uploads/${path}/${extraPath}/${name}`, fin, name: data.fname + `.${data.ext}` }, (token) => {
        callback('/file/' + token);
      });
    } else {
      callback('');
    }
  }

module.exports = {
    upload,
    decode,
    randString,
    sleep,
    now,
    yesterday,
    today,
    print,
    customErrorHandler,
    catchError,
    validationUserInput,
    comparePassword,
    getAccessTokenFromHeader,
    sendJwtToClient,
    isTokenIncluded,
    checkurl,
    saveFile,
    includeParams
};