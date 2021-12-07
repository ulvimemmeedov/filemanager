import api from "./api";
import alertify from 'alertifyjs';
const wind = window;
const doc = document;
export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
export function openFile(fileData,getDirectoryAndContent) {
    let content;
    const extension = fileData.extension;
    const rawName = fileData.rawName;
    if (extension == 'png') {
        content = `
        <div class="container">
        <center>
        <div style="width:100%"><button class='btn btn-dark' onclick="window.location.reload();">X</button></div>
        <img width = '100%' height='100%' src='/${rawName}' ></img>
        </center>
        </div>
        `
        doc.body.innerHTML = content
    }
    else if (extension == 'mp3') {
        content = `
        <div class="container">
        <center>
        <div style="width:100%"><button class='btn btn-dark' onclick="window.location.reload();">X</button></div>
        <audio controls>
        <source src="${rawName}" type="audio/ogg">
        <source src="${rawName}" type="audio/mpeg">
        No audio support.
        </audio> 
        </center>
        </div>
        `
        doc.body.innerHTML = content
    }
    else if (extension == 'folder') {

    }
    else {
        api.get(`/readFile/${rawName}`).then(res => {
            if (res.data.success == true) {
                const content = res.data.content;
                const directory = res.data.directory;
                getDirectoryAndContent(content,directory,rawName)
            }
        })

    }
}
export function uploadFile(files) {
    const filesData = new FormData();
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        filesData.append("file", file);
    }
    api.post('/upload', filesData).then(res => {
        if (res.data.success == true) {
            alertify.success("upload success")
        }
    })
    setTimeout(() => {
        // wind.location.reload();
    }, 2000);
}
export function fileDelete(file) {
    api.post("/deletefile",{
        filename:file.raw
    }).then(res=>{
        if (res.data.success == true) {
            alertify.success("delete success")
            wind.location.reload();
        }else{
            alertify.success(res.data.message)
        }
    })
}