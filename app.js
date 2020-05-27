const express = require('express');
var fs= require('fs');
const app = express();
var AipFaceClient = require("baidu-aip-sdk").face;
var HttpClient = require("baidu-aip-sdk").HttpClient;
const img = "./picture/xingye-1.png";//imgurl 就是图片路径
var groupId = "group1";
var userId = "user3";
var user_info="周星驰";  //图片的名字

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
    //faceUpdate(client,image,imageType,res);
    faceSearch(client,image,imageType,res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


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
    // 调用人脸注册
    client.addUser(image, imageType, groupId, userId,user_info).then(function(result) {
        console.log(JSON.stringify(result));
        return response.json((result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
        return response.json(new Error(err,410));
    });
}

function faceUpdate(client,image,imageType,response){
    // 如果有可选参数
    var options = {};
    options["user_info"] = user_info;
    // options["quality_control"] = "NORMAL";
    // options["liveness_control"] = "LOW";
    // options["action_type"] = "REPLACE";
    // 调用人脸更新
    client.updateUser(image, imageType, groupId, userId, options).then(function(result) {
        console.log(JSON.stringify(result));
        return response.json((result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
        return response.json(new Error(err,410));
    });;
}
