const express = require('express');
var fs= require('fs');
const app = express();
var AipFaceClient = require("baidu-aip-sdk").face;
var HttpClient = require("baidu-aip-sdk").HttpClient;
const img = "./picture/ag-3.png";//imgurl 就是你的图片路径  

function getBase64Image(img) {  
     var canvas = document.createElement("canvas");  
     canvas.width = img.width;  
     canvas.height = img.height;  
     var ctx = canvas.getContext("2d");  
     ctx.drawImage(img, 0, 0, img.width, img.height);  
     var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();  
     var dataURL = canvas.toDataURL("image/"+ext);  
     return dataURL;  
}  


const port = 3000;

const app_id=19570380;
const api_key="h70fYuSd18dYys73NyjYbn2n";
const secret_key="vG5dH7xr42Sqf3E0FZO4Cth46yk6tM8v";

app.get('/', (req, res) => {
    //res.send('Hello World!')
    intialbaidu();
    var fs = require("fs");
    var imageData = fs.readFileSync(img); // 例：fileUrl="D:\\test\\test.bmp"
    var image = imageData.toString("base64");
    var client=new AipFaceClient(app_id,api_key,secret_key);
    var imageType="BASE64";
    //faceDetect(client,image,imageType,res);
    //faceRegister(client,image,imageType,res);
    faceSearch(client,image,imageType,res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


function baiduFace(req,res){
    var client=new AipFaceClient(app_id,api_key,secret_key);
    var image="https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=%E4%BA%BA%E5%83%8F&step_word=&hs=0&pn=1&spn=0&di=17490&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&istype=2&ie=utf-8&oe=utf-8&in=&cl=2&lm=-1&st=-1&cs=2668322266%2C2142931327&os=3398421995%2C2223198448&simid=3522295409%2C432751500&adpicid=0&lpn=0&ln=1806&fr=&fmq=1588152457384_R&fm=result&ic=&s=undefined&hd=&latest=&copyright=&se=&sme=&tab=0&width=&height=&face=undefined&ist=&jit=&cg=&bdtype=0&oriquery=&objurl=http%3A%2F%2Fimg8.zol.com.cn%2Fbbs%2Fupload%2F14417%2F14416546.jpg&fromurl=ippr_z2C%24qAzdH3FAzdH3F1vkkf_z%26e3Bz5s_z%26e3Bv54_z%26e3BvgAzdH3Fl0AzdH3Fmc0_lmdam9_z%26e3Bip4s&gsm=2&rpstart=0&rpnum=0&islist=&querylist=&force=undefined";
    var imageType="URL";
    client.detect(image,imageType).then(function (result){
        return res.json(new PKG(result));
    }).catch(function(err){
        return res.json(new Error(err,410));
    });
}
function intialbaidu(){
    // 设置request库的一些参数，例如代理服务地址，超时时间等
    // request参数请参考 https://github.com/request/request#requestoptions-callback
    HttpClient.setRequestOptions({timeout: 15000});

    // 也可以设置拦截每次请求（设置拦截后，调用的setRequestOptions设置的参数将不生效）,
    // 可以按需修改request参数（无论是否修改，必须返回函数调用参数）
    // request参数请参考 https://github.com/request/request#requestoptions-callback
    HttpClient.setRequestInterceptor(function(requestOptions) {
        // 查看参数
        //console.log(requestOptions)
        // 修改参数
        requestOptions.timeout = 15000;
        // 返回参数
        return requestOptions;
    });
}

function faceDetect(client,image,imageType,response){
    client.detect(image,imageType).then(function (result){
        console.log(result);
        return response.json((result));
    }).catch(function(err){
        console.log(err);
        return response.json(new Error(err,410));
    });
}
function faceSearch(client,image,imageType,response){
    var groupIdList = "group1,group2";
    // 调用人脸搜索
    client.search(image, imageType, groupIdList).then(function(result) {
        console.log(JSON.stringify(result));
        return response.json((result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
        return response.json(new Error(err,410));
    });
}

function faceRegister(client,image,imageType,response){
    var groupId = "group1";
    var userId = "user1";

    // 调用人脸注册
    client.addUser(image, imageType, groupId, userId).then(function(result) {
        console.log(JSON.stringify(result));
        return response.json((result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
        return response.json(new Error(err,410));
    });
}
