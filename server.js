const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/previews', express.static('./public/previews'));
app.use('/models', express.static('./public/models'));
const directoryPath = path.join(__dirname, 'public/previews/');


console.log("Delete File successfully.");

// union the body and the files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split(".")[1];
        const fileName = req.body["fileName"];
        if (ext==='glb'){
            cb(null, `models/${fileName}.${ext}` )
        }
        else{
            cb(null, `previews/${fileName}.${ext}` )
        }
    }
})
const upload = multer({ storage:storage })

const cpUpload = upload.fields([{ name: 'fileImg', maxCount: 1 }, { name: 'file', maxCount: 1 }])


app.post('/upload', cpUpload, function (req, res, next) {
    res.send('File Created')
});

app.get('/delete', function (req, res, next) {
    const fileName = req.query.filename
    const modelsDirectoryPath = path.join(__dirname, 'public/models/');
    const imagesDirectoryPath = path.join(__dirname, 'public/previews/');
    fs.unlink(modelsDirectoryPath + fileName.split('.')[0]+".glb", (err) => {
        if (err) {
            throw err;
        }

    });
    fs.unlink(imagesDirectoryPath + fileName, (err) => {
        if (err) {
            throw err;
        }

        console.log("Delete File successfully.");
    });
    res.send('File Deleted')
});

app.get('/files',function (req, res, next){
    let arr= []
    fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
       arr.push(file);
    });
    res.send(arr);
    });
})

app.get('/',function (req, res, next){
    res.send("Server is running")
})

app.listen(8000, () => {
    console.log('App is running on port 8000')
});