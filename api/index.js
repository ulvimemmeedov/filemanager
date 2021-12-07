/* 
  Author: Ulvi Memmedov
*/
const express = require('express');
const app = express();
const fs = require('fs');
const port = 5000;
const directory = './test/';
const { randString, upload, catchError, includeParams } = require('./helpers/helpers');
const ext = require('./helpers/type');
const lineByLine = require('n-readlines');
const he = require('he');
app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(express.static('test'))
  .post('/api/upload', upload.array('file', 10000), (req, res) => {
    res.json({
      success: true,
      files: req.files
    })
  })
  .get('/api/files', (req, res) => {
    let files = [];
    const { folder } = req.query;
    const dir = `${directory}${folder && folder.length > 0 ? `${folder}/` : '/'}`;
    if (folder && folder.length && includeParams(folder)) {
      return res.status(200).json({
        success: false,
        message: 'something went wrong'
      })
    }
    fs.readdir(dir, (err, raw) => {
      if (err) {
        if (err.fatal) {
          catchError(err);
        }
        return res.status(200).json({ success: false, message: err.message });
      };
      if (raw.length < 1) {
        return res.json({
          success: true,
          files: ["this directory is empty"]
        });
      };
      raw.forEach(rawFile => {
        const file = rawFile.toString().split('.');
        files.push({
          uuid: randString(),
          raw: rawFile,
          name: file[0],
          extension: ext.filter(ex => ex.extension == file[1])[0] ? ext.filter(ex => ex.extension == file[1])[0].extension : 'folder',
          type: file[1] != undefined ? file[1] : "folder",
          icon: ext.filter(ex => ex.extension == file[1])[0] ? ext.filter(ex => ex.extension == file[1])[0].icon : 'fa fa-folder',
        });
      });
      res.status(200).json({
        directory: directory,
        success: true,
        files: files
      });
    });
  })
  .get('/api/readFile/:filename', (req, res) => {
    const { dir } = req.query;
    const { filename } = req.params;
    const directory2 = `${directory}${filename}`
    const liner = new lineByLine(directory2);
    var arr =[];
    if (dir && includeParams(dir) && includeParams(filename)) {
      return res.status(200).json({
        success: false,
        message: 'something went wrong'
      })
    }

    while (line = liner.next()) {
     if (line == '') {
       line = '<br>'
     }
     arr.push(line.toString());
    }
  
    res.status(200).json({
      directory: directory2,
      success: true,
      content: arr.join('')
    });
  })
  .post('/api/makefile', (req, res) => {
    const { name, content, folder } = req.body;
    if (includeParams(name) && includeParams(content) && includeParams(folder)) {
      return res.status(200).json({
        success: false,
        message: 'something went wrong'
      })
    }
    const dir = `${directory}${folder && folder.length > 0 ? `${folder}/` : '/'}`;
    fs.readdir(dir, (err, raw) => {
      if (err) {
        if (err.fatal) {
          catchError(err);
        }
        return res.status(200).json({
          success: false,
          message: err.message
        });
      };
      if (raw.length > 1)
        if (raw.some(rawFile => rawFile == name)) {
          return res.json({
            success: false,
            message: "file name is exits"
          })
        }
      fs.writeFile(`${dir}/${name}`, content, 'utf-8', function (err, data) {
        console.log(data);
        if (err) {
          if (err.fatal) {
            catchError(err);
          };
          return res.status(200).json({
            success: false,
            message: e.message
          });
        };
        res.status(200).json({
          directory: dir,
          success: true,
          file: name
        });
      });
    });
  })
  .post('/api/makedirectory', (req, res) => {
    
  })
  .post('/api/writefile', (req, res) => {
    const { dir,filename,content} = req.body;
    const directory2 = `${directory}${filename}`
    
    if (dir && includeParams(dir) && includeParams(filename) && includeParams(content)) {
      return res.status(200).json({
        success: false,
        message: 'something went wrong'
      })
    }
    var stripedHtml = content.replace(/<[^>]+>/g, '');
   
    fs.writeFile(directory2,he.decode(stripedHtml),function (err) {
      if (err) {
        return res.status(200).json({
          success: false,
          message: 'something went wrong'
        }) 
      }
      res.status(200).json({
        success: true,
        message: 'saved success'
      })
    })
  })
  .post('/api/deletefile', (req, res) => {
    const { dir,filename,content} = req.body;
    const directory2 = `${directory}${filename}`
    
    if (dir && includeParams(dir) && includeParams(filename) && includeParams(content)) {
      return res.status(200).json({
        success: false,
        message: 'something went wrong'
      })
    }
    fs.unlink(directory2,(err)=>{
      if (err) {
      return res.status(200).json({
          success: false,
          message: 'something went wrong'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'saved success'
      })
    })
    
  })
  .listen(port, () => console.log(`app running port: ${port}`))