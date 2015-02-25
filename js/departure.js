

var isNode = (typeof window === 'undefined');
var isi2c             = 0;
if(isNode){
  var http  = require('http');
  if (isi2c){
    var i2c = require('i2c-bus');
  }
  var os = require('os');
  if (isi2c){
    i2c1 = i2c.openSync(1);
  }
}

var version           = '1.2'
var hostIP            = 'departureboard.herokuapp.com';
var deviceIP          = '';
var ajaxObj           = null;
var trainServices     = new Array();
var trainServicesOld  = new Array();
var boardCtx2D        = null;
var boardCanvas       = null;
var msgCanvas         = null;
var msgXPos            = 0;
var msgYPos            = 0;
var msgStop            = 0;
var boardAnimInterval = null;
var boardAnimState    = "";
var boardAnimDelay    = 0;
var dest;
var orig;
var rows;
var size;
var serviceMsg        = new Array();
var serviceMsgCnt     = 0;
var serviceMsgId      = 0;
var statusMsg         = [];
var timeOuts          = new Array(1,5,10,30); // in min
var curTimeout        = 0;
var colOff            = 0;//"#1C1A00"; 28,26,0
var colText           = 3;//"#FFCC00"; 255,204,0
var colOnTime         = 2;//"#9ACD32"; 154,205,50
var colDelay          = 1;//"#FF0000"; 255,0,0
var colours           = [[28,26,0,255],[255,204,0,255],[154,205,50,255],[255,0,0,255]];

var font1             = {"32":[3,0,0,0,0,0,0,0,0,0],"33":[1,1,1,1,1,1,0,1,0,0],"34":[3,5,5,5,0,0,0,0,0,0],"35":[5,10,10,31,10,31,10,10,0,0],"36":[5,0,0,0,0,0,0,0,0,0],"37":[5],"38":[5,6,9,6,21,9,9,22,0,0],"39":[1,1,1,0,0,0,0,0,0,0],"40":[3,4,2,1,1,1,2,4,0,0],"41":[3,1,2,4,4,4,2,1,0,0],"42":[5,0,0,0,0,0,0,0,0,0],"43":[5,0,0,4,4,31,4,4,0,0],"44":[2,0,0,0,0,0,0,2,2,1],"45":[4,0,0,0,15,0,0,0,0,0],"46":[1,0,0,0,0,0,0,1,0,0],"47":[4,8,12,4,6,2,3,1,0,0],"48":[4,6,9,9,9,9,9,6,0,0],"49":[4,2,3,2,2,2,2,7,0,0],"50":[4,6,9,8,4,2,1,15,0,0],"51":[4,6,9,8,4,8,9,6,0,0],"52":[4,8,12,10,9,15,8,8,0,0],"53":[4,15,1,7,8,8,9,6,0,0],"54":[4,6,9,1,7,9,9,6,0,0],"55":[4,15,8,4,2,2,2,2,0,0],"56":[4,6,9,9,6,9,9,6,0,0],"57":[4,6,9,9,14,8,9,6,0,0],"58":[1,0,0,1,0,0,1,0,0,0],"59":[1,0,0,1,0,0,1,1,0,0],"60":[4,8,4,2,1,2,4,8,0,0],"61":[4,0,0,15,0,15,0,0,0,0],"62":[4,1,2,4,8,4,2,1,0,0],"63":[5,14,17,16,8,4,0,4,0,0],"64":[5],"65":[4,6,9,9,15,9,9,9,0,0],"66":[4,7,9,9,7,9,9,7,0,0],"67":[4,6,9,1,1,1,9,6,0,0],"68":[4,7,9,9,9,9,9,7,0,0],"69":[4,15,1,1,7,1,1,15,0,0],"70":[4,15,1,1,7,1,1,1,0,0],"71":[4,6,9,1,13,9,9,6,0,0],"72":[4,9,9,9,15,9,9,9,0,0],"73":[3,7,2,2,2,2,2,7,0,0],"74":[4,15,4,4,4,4,5,2,0,0],"75":[4,9,9,5,3,5,9,9,0,0],"76":[4,1,1,1,1,1,1,15,0,0],"77":[5,17,27,21,17,17,17,17,0,0],"78":[4,9,11,13,9,9,9,9,0,0],"79":[4,6,9,9,9,9,9,6,0,0],"80":[4,7,9,9,7,1,1,1,0,0],"81":[4,6,9,9,9,9,6,12,0,0],"82":[4,7,9,9,7,5,9,9,0,0],"83":[4,6,9,1,6,8,9,6,0,0],"84":[5,31,4,4,4,4,4,4,0,0],"85":[4,9,9,9,9,9,9,6,0,0],"86":[5,17,17,17,17,17,10,4,0,0],"87":[5,17,17,17,21,21,27,17,0,0],"88":[5,17,10,4,4,4,10,17,0,0],"89":[5,17,17,10,4,4,4,4,0,0],"90":[5,31,16,8,4,2,1,31,0,0],"91":[3,7,1,1,1,1,1,7,0,0],"92":[4,1,3,2,6,4,12,8,0,0],"93":[3,7,4,4,4,4,4,7,0,0],"94":[5,4,10,17,0,0,0,0,0,0],"95":[5,0,0,0,0,0,0,31,0,0],"96":[5],"97":[4,0,0,6,8,14,9,14,0,0],"98":[4,1,1,7,9,9,9,7,0,0],"99":[4,0,0,14,1,1,1,14,0,0],"100":[4,8,8,14,9,9,9,14,0,0],"101":[4,0,0,6,9,7,1,14,0,0],"102":[4,4,10,2,7,2,2,2,0,0],"103":[4,0,0,6,9,9,9,14,8,7],"104":[4,1,1,5,11,9,9,9,0,0],"105":[1,1,0,1,1,1,1,1,0,0],"106":[3,4,0,4,4,4,4,4,5,2],"107":[4,1,1,9,5,3,5,9,0,0],"108":[2,2,2,2,2,2,2,2,0,0],"109":[5,0,0,11,21,21,17,17,0,0],"110":[4,0,0,5,11,9,9,9,0,0],"111":[4,0,0,6,9,9,9,6,0,0],"112":[4,0,0,7,9,9,9,7,1,1],"113":[4,0,0,14,9,9,9,14,8,8],"114":[4,0,0,5,11,1,1,1,0,0],"115":[4,0,0,14,1,6,8,7,0,0],"116":[4,2,2,7,2,2,2,12,0,0],"117":[4,0,0,9,9,9,9,6,0,0],"118":[5,0,0,17,17,17,10,4,0,0],"119":[5,0,0,17,17,21,21,10,0,0],"120":[5,0,0,17,10,4,10,17,0,0],"121":[4,0,0,9,9,9,9,14,8,7],"122":[5,0,0,31,8,4,2,31,0,0],"123":[5],"124":[1,1,1,1,1,1,1,1,0,0],"125":[5],"126":[5,0,0,2,21,8,0,0,0,0],"127":[5],"height":9}




if(!isNode){
  window.onload = onInit;
} else 
  onInit();

function onInit(){
  if(!isNode){
    rows = getUrlVars()["rows"];
    dest = getUrlVars()["dest"];
    orig = getUrlVars()["orig"];
    size = getUrlVars()["size"];
  } else {
    orig = process.argv[2];
    dest = process.argv[3];
  
    console.log("Orig: " + orig,"Dest: " + dest);

    var ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function (ifname) {
      var alias = 0;
      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }

        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          //console.log(ifname + ':' + alias, iface.address);
        } else {
          // this interface has only one ipv4 adress
          console.log("Interface: " + ifname,"IP: " + iface.address);
          deviceIP = iface.address
        }
      });
    });
  }
  
  if(rows==undefined)
    rows=3;
  if(orig==undefined)
    orig="TWI";
  if(size==undefined)
    size=2;



  // need to export font with bits in correct order!!
  // save me doing this!
  var byte;
  for(j=32; j<128; j++){
    for(v=0; v<9; v++){
      byte = 0;
      for(i=0; i<8; i++){
        byte<<=1;
        byte |= font1[String(j)][v+1] & 0x1;
        font1[String(j)][v+1] >>= 1;
      }
      font1[String(j)][v+1] = byte;
    }
  }

  for(var i=0; i<rows; i++)
    trainServices.push(createServiceObj(i));

  createDepartureBoard();
  updateDepartureBoard();
  setTimeout(getDepartureBoardUpdate,isNode?2000:0)
  
  setStatusMessage([{str:"version: "+version,colour:2,align:"left"},
                    {str:"host: " + hostIP,colour:2,align:"left"},
       deviceIP!=''?{str:"deviceIP:         ("+deviceIP+")",colour:2,align:"left"}:{}]);
}

function createServiceObj(id){
  var obj = {};
  obj.serviceID = "";
  obj.y         = id*10;
  obj._y        = 0;
  obj.ctx       = null;
  return obj;
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
  function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}

function createDepartureBoard(){
  if(!isNode){
    var c = document.getElementById("canvas");
    c.width = 192*size;
    c.height= ((rows*10)+1)*size;
    boardCtx2D = c.getContext("2d");
  }

  boardCanvas     = createCanvas(192,(rows*10)+2);
  msgCanvas       = createCanvas(5000,32);
}

function getDepartureBoardUpdate(){
  var d = "";
  if(dest!=undefined)
    d = "&dest="+dest;

  if(isNode){
    var options = {
      host: hostIP,
      path: '/ldbwsService.php?rows='+rows+'&orig='+orig+d
    };
    var req = http.request(options, callback);
    req.on('error', function (e) {
      //  - ECONNRESET - server closed the socket unexpectedly
      //  - ECONNREFUSED - server did not listen
      //  - HPE_INVALID_VERSION
      //  - HPE_INVALID_STATUS
      //  - ... (other HPE_* codes) - server returned garbage
      errorHandler("cant_connect");
    });
    req.end();
  } else {  
    ajaxObj = new ajaxObject("http://"+hostIP+"/ldbwsService.php");
    
    ajaxObj.callback = updateHandler;
    ajaxObj.timeOutErrorHandler = function(){errorHandler("cant_connect")};
    ajaxObj.update("rows="+rows+"&orig="+orig+d, 'GET');
  }
}

function callback(response) {
  var str = '';
  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });
  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    updateHandler(str,200);
  });
}

function updateHandler(responseText, responseStatus, responseXML){
  if(responseStatus != 200){
    errorHandler("cant_connect");
    return;
  }
  try{
    var resp_obj = JSON.parse(responseText);
  } catch(er){
    errorHandler("cant_parse_json");
    return;
  }
  
  console.log("services:"+resp_obj["trainServices"].length);
  curTimeout=0;
  setTimeout(getDepartureBoardUpdate,30000);
  
  // exit if currently animating
  if(boardAnimState!="")
    return;
    
  // take copy of train services
  trainServicesOld = [];
  for(var i=0; i<trainServices.length; i++)
    trainServicesOld.push(trainServices[i]);
  for(var i=0; i<3; i++)
    trainServicesOld.push(createServiceObj(i+trainServices.length));
  // create train services
  trainServices = [];
  if(resp_obj["trainServices"]!=undefined){
    for(var i=0; i<resp_obj["trainServices"].length; i++){
      var obj = {};
      obj.serviceID = resp_obj["trainServices"][i]["serviceID"];
      obj.ctx = createService(i,resp_obj["trainServices"][i]);
      obj.y = i*10;
      obj._y = 0;
      trainServices.push(obj);
      if(i==(rows-1))
        break; 
    }
  }
  
  if(trainServices.length==0)
    serviceMsgCnt = 0;
  // service messages
  serviceMsg = [];
  for(var i=0; i<resp_obj["nrccMessages"].length; i++){
    var str   = decodeURIComponent(resp_obj["nrccMessages"][i]);
    str = str.replace(/\+/g," ");
    str = str.replace(/\&nbsp;/g," ");
    str = str.replace(/\<\/P>/g,"");
    str = str.replace(/\<P>/g,"");
    var idx0 = str.toLowerCase().indexOf("more details");
    var idx1 = str.toLowerCase().indexOf("more information");
    if(idx0>0)
      str = str.slice(0,idx0);
    if(idx1>0)
      str = str.slice(0,idx1);
    serviceMsg.push(str);
  }
  if(serviceMsg.length==0){
    serviceMsgId  = 0;
    serviceMsgCnt = 0
  }

  if(serviceMsg.length && serviceMsgCnt==0){
    clearCanvas(msgCanvas,0);
    serviceMsgId%=serviceMsg.length;
    msgStop = drawText(serviceMsg[serviceMsgId++],msgCanvas,font1,3,192,0,50,"left",1,0)+192;
    runBoardAnimationInit("update-services");
  } else {
    if(trainServices.length>0){
      // create calling at list
      createCallAtList(resp_obj["trainServices"][0].subsequentCallingPoints,resp_obj["trainServices"][0].operator);
      runBoardAnimationInit("update-services");
    }
  }
  
  // add no trains avail service message
  if(trainServices.length==0 && serviceMsg.length==0)
    setStatusMessage([{str:resp_obj["locationName"],colour:1,align:"middle"},{str:"No trains available at this time.",colour:1,align:"middle"},{}]);
}

function setStatusMessage(arr){
  boardAnimState = "status-msg";
  statusMsg = arr;
  clearInterval(boardAnimInterval);
  runBoardAnimation();
}

function runBoardAnimationInit(state){
  switch(state){
   case "update-services":
      for(var i=0; i<trainServices.length; i++){
        if(trainServices[i].serviceID!=trainServicesOld[i].serviceID){
          trainServices[i]._y     = -9;
          trainServicesOld[i]._y  = 0;
         }
      }
      break;
      
    case "calling-drop":
      msgXPos           = 0;
      msgYPos           = 0;
      break;
  }

  boardAnimState    = state;
  boardAnimDelay    = 0;
  clearInterval(boardAnimInterval);
  boardAnimInterval = setInterval(runBoardAnimation,40);
}

function runBoardAnimation(){
  switch(boardAnimState){
    case "update-services":
      clearCanvas(boardCanvas,0);
      for(var i=0; i<trainServices.length; i++){
        if(trainServices[i].serviceID!=trainServicesOld[i].serviceID){
          if(trainServices[i]._y<0){
            trainServices[i]._y++;
             trainServicesOld[i]._y++;
           }
        }
      }
      if(boardAnimDelay++ == 8){
        clearInterval(boardAnimInterval);
        setTimeout(runBoardAnimationInit,1000,"calling-drop");
      }
      break;
      
    case "status-msg":
      clearCanvas(boardCanvas,0);
      for(var i=0; i<statusMsg.length; i++){
        if(statusMsg[i].str)
          drawText(statusMsg[i].str,boardCanvas,font1,statusMsg[i].colour,0,(i*10)+1,192,statusMsg[i].align,1,0);
      }
      updateDMD();
      boardAnimState = "";
      clearInterval(boardAnimInterval);
      return;
      break;
  
  
    case "calling-drop":
      clearCanvas(boardCanvas,0);
      msgYPos++;
      for(var i=0; i<trainServices.length-1; i++)
        trainServices[i+1].y++;
      if(msgYPos==10){
        boardAnimDelay = 0;
        boardAnimState = "calling-scroll";
        if(isNode){
          clearInterval(boardAnimInterval);
          boardAnimInterval = setInterval(runBoardAnimation,25);
        }
      }
      copyCanvas(msgCanvas,msgXPos,0,boardCanvas,0,msgYPos+1,192,9);
      break;
    /*case "calling-start-delay":
      boardAnimDelay++;
      if(boardAnimDelay>10)
        boardAnimState="calling-scroll";
      break;*/
    case "calling-scroll":
      msgXPos+=isNode?1:2;
      if(msgXPos>=msgStop){
        boardAnimDelay = 0;
        boardAnimState = "calling-end-delay";
        if(isNode){
          clearInterval(boardAnimInterval);
          boardAnimInterval = setInterval(runBoardAnimation,40);
        }
      }
      copyCanvas(msgCanvas,msgXPos,0,boardCanvas,0,msgYPos+1,192,9);
      updateDMD();
      return;
      break;
    case "calling-end-delay":
      boardAnimDelay++;
      if(boardAnimDelay>10)
        boardAnimState="calling-rise";
      break;
    case "calling-rise":
      clearCanvas(boardCanvas,0);
      msgYPos--;
       for(var i=0; i<trainServices.length-1; i++)
        trainServices[i+1].y--;
      if(msgYPos==0){
        boardAnimState = "";
        clearInterval(boardAnimInterval);
        serviceMsgCnt++;
        serviceMsgCnt%=2;
      }
      copyCanvas(msgCanvas,msgXPos,0,boardCanvas,0,msgYPos+1,192,9);
      break;
  }
  
  // update train services
  for(var i=0; i<trainServices.length; i++){
    // current services
    if(trainServices[i].ctx!=null)
      copyCanvas(trainServices[i].ctx,0,trainServices[i]._y, boardCanvas,0,trainServices[i].y+1,          192,trainServices[i]._y+9);
    // old services copy
    if((boardAnimState=="update-services") && (trainServicesOld[i].ctx!=null))
      copyCanvas(trainServicesOld[i].ctx,0,trainServicesOld[i]._y, boardCanvas,0,trainServicesOld[i].y+1, 192,9-trainServicesOld[i]._y);
  }

  updateDMD();
}

function errorHandler(type){
  switch(type){
    case "cant_connect":
      setStatusMessage([{str:"ERROR!",colour:1,align:"middle"},{str:("Can't connect to host: ("+hostIP+")"),colour:1,align:"middle"},{str:("Retry in "+timeOuts[curTimeout]+" Min"),colour:1,align:"middle"}]);
      
      setTimeout(getDepartureBoardUpdate,timeOuts[curTimeout]*60000);
      if(curTimeout<(timeOuts.length-1))
        curTimeout++;
      break;
      
    case "cant_parse_json":
      if(curTimeout++ <3)
        setTimeout(getDepartureBoardUpdate,5000);
      else {
        setStatusMessage([{str:"ERROR!",colour:1,align:"middle"},{str:("Can't parse json response."),colour:1,align:"middle"},{str:("Next attempt in 10 minutes."),colour:1,align:"middle"}]);
        setTimeout(getDepartureBoardUpdate,60000*10);
        curTimeout = 0;
      }
      break;
  }
  console.log("ERROR:"+type+" retry:"+curTimeout);
}

function createService(id,obj){
  //console.log(obj);
  var ctx       = createCanvas(192,9);
  var cancelled = (obj.etd=="Cancelled");
  
  //std
  drawText(obj.std,ctx,font1,colText,1,0,25,"left",1,0);
  // platform
  drawText(obj.platform.slice(0,2),ctx,font1,colText,26,0,11,"right",1,0);
  //destination
  var str = formateLocationName(obj.destination.locationName);
  drawText(str,ctx,font1,colText,43,0,110,"left",1,0);
  //etd
  var col = obj.etd=="On time"?colOnTime:colDelay;
  str = obj.etd;
  if(str.length==5)
    str="Exp "+str;
  drawText(str,ctx,font1,col,141,0,50,"right",1,0);

  return ctx;
}

function createCallAtList(arr,operator){
  //console.log(arr);
  clearCanvas(msgCanvas,0);
  
  var xPos = drawText("Calling at: ",msgCanvas,font1,colText,192,0,50,"left",1,0)+193;
  for(var i=0; i<arr.length; i++){
    var col = (arr[i].et=="On time")?colOnTime:colDelay;
    var str = (i>0?(i==arr.length-1?" and ":", "):"")+arr[i].locationName;
    xPos += drawText(str,msgCanvas,font1,colText,xPos,0,150,"left",1,0)+2;
    xPos += drawText("("+(arr[i].et=="On time"?arr[i].st:arr[i].et)+")",msgCanvas,font1,col,xPos,0,50,"left",1,0)+1;
  }
  xPos += drawText(" ("+operator+")",msgCanvas,font1,colText,xPos,0,150,"left",1,0);
  msgStop = xPos;
}

function formateLocationName(str){
  var len = getTextLength(str,font1,1);
  // string larger then 100 pixels
  if(len>100){
    while( getTextLength(str,font1,1)>98 )
      str = str.slice(0,str.length-1);
    // dont leave space or dash as last char
    var lastChar = str.charAt(str.length-1);
    if(lastChar==" " || lastChar=="-")
      str = str.slice(0,str.length-1);
    str+="...";
  }
  return str;
}

function updateDepartureBoard(){
  boardAnimState = "";
  runBoardAnimation();
}

function updateDMD(){
  // NODE JS
  if(isNode){
  
   for(var i=0; i<48; i++){
      boardCanvas.ctx[i+(24*30)]     = 0x0;
      boardCanvas.ctx[i+768+(24*30)] = 0x0;
   }
   var buf = new Buffer(boardCanvas.ctx);
   if (isi2c){
     i2c1.i2cWrite(0x40, buf.length, buf, function(){});
   } else {
     console.log(buf.length, buf);
   }
   
   
  // IN BROWSER
  } else {
    var w = 192;
    var h = (rows*10)+1;
    var finalImage  = boardCtx2D.createImageData(w*size,h*size);
    var finalPixels = finalImage.data;
    
    //var count = 0;
    var i=0;
    var offset;
    var byte1,byte2;
    var col1;
    for(var y=0; y<h-1; y++){
      for(var x=0; x<(w/8); x++){
        byte1 = boardCanvas.ctx[(y*(boardCanvas.w/8))+x];
        byte2 = boardCanvas.ctx[((y*(boardCanvas.w/8))+x)+((boardCanvas.w*boardCanvas.h)/8)];
        
        for(var j=0; j<8; j++){
          col1= 0;
          if(byte1 & 0x80)
            col1=3;
          if(byte2 & 0x80)
            col1=2;
          if((byte1 & 0x80)&&(byte2 & 0x80))
            col1=1;
          byte1 <<= 1;
          byte2 <<= 1;
          
          
          if(size==2){
            offset = (i*8)+(y*w*8);
            for(var v=0; v<8; v++)
              finalPixels[offset+v]    = colours[col1][v%4];

            offset = (i*8)+((y+1)*w*8);
            for(var v=0; v<8; v++)
              finalPixels[offset+v]    = colours[col1][v%4];
          } else {
            offset = (i*4);
            for(var v=0; v<4; v++)
              finalPixels[offset+v]    = colours[col1][v];  
          }
          i++;
        }
      }
    }
    
    boardCtx2D.putImageData(finalImage,0,0);
  }
}



























function createCanvas(w,h){
  var obj = {};
  var ctx = new Uint8Array((w*h*2)/8);
  for(var i=0; i<((w*h*2)/8); i++)
    ctx[i] = 0;
    
  obj.ctx = ctx;
  obj.w = w;
  obj.h = h;

  return obj;
}

function copyCanvas(orig,x1,y1,dest,x2,y2, w1,h1){
  var addr1,addr2,origByte,destByte;
  var origOffset  = (orig.w*orig.h)/8;
  var destOffset  = (dest.w*dest.h)/8;
  var x1Offset    = parseInt(x1/8);
  var x2Offset    = parseInt(x2/8);
  var addrWidth   = parseInt(w1/8);
  var origW8      = (orig.w/8);
  var destW8      = (dest.w/8);
  var x1Mod8      = (x1 % 8);
  var x2Mod8      = (x2 % 8);
  
  for(var row1=y1,row2=y2; row1<h1; row1++,row2++){

    addr1 = (row1 * origW8) + x1Offset;
    addr2 = (row2 * destW8) + x2Offset;

    for (var a1=addr1,a2=addr2; a1<(addr1+addrWidth); a1++,a2++){
      // check for buffer overruns
      if(a1>=0 && a1<origOffset && a2>=0 && a2<destOffset){
   
        dest.ctx[a2]            = (orig.ctx[a1] << (x1%8)) | orig.ctx[a1+1] >> 8-(x1%8);
        dest.ctx[a2+destOffset] = (orig.ctx[a1+origOffset] << (x1%8)) | orig.ctx[a1+1+origOffset] >> 8-(x1%8);
        //b >>= (x2%8)

        // 1x positioning + width not quite right!
        // needs to support dest x2 positioning
        // need to remove [a1+1] on last repetition
      }
    }
  }
}

function clearCanvas(obj,col){
  for(var i=0; i<obj.ctx.length; i++)
    obj.ctx[i] = col;
}

function drawText(str,ctx,font,colour,x,y,width,align,spacing,debug){
  var xPos= getTextLength(str,font,spacing);
  var tWidth = xPos;
  
  // set position of text within container
  switch(align){
    case "left":
      xPos=0;
      break;
    case "right":
      xPos = (width-xPos);
      break;
    case "middle":
      xPos = parseInt((width-xPos)/2);
      break;
  }

  // draw text
  for(var i=0; i<str.length; i++){
    var c = str.charAt(i);
    var idx = safeFontIndex(str.charCodeAt(i));
    var fontWidth  = Number(font[idx][0]);
    var fontHeight = font.height; 
    
    if(idx<=32){
      // add space
      xPos+=fontWidth+spacing;
    } else {
      drawchar(ctx,xPos+x,y,fontWidth,fontHeight,colour,font[idx]);
      xPos+=(fontWidth+spacing);
    }
  }
  
  return tWidth;
}

function drawchar(frame_buf, xp, yp, xw, rows, colour, fontdata){
  var i, j, k, v;
  var addr;
  var plotting;
  var offset    = (frame_buf.w*frame_buf.h)/8;
  var rowOffset = (frame_buf.w/8);
  var xpDiv8    = parseInt(xp / 8);
  var xpMod8    = (xp % 8);
  
  for (j = 0; j < rows; j++){
    addr = ((yp + j) * rowOffset) + xpDiv8;

    for (v=0,k=addr; k < (addr+2); k++,v++){
      if(v==0)
        plotting = fontdata[j+1] >> xpMod8;
      if(v==1)
        plotting = fontdata[j+1] << 8-xpMod8;
        
      if (colour & 1)
        frame_buf.ctx[k] |= plotting;
      if (colour & 2)
        frame_buf.ctx[k + offset] |= plotting;
    }
  }
}

function getTextLength(str,font,spacing){
  var xPos=0;
  // calculate total width of text
  for(var i=0; i<str.length; i++){
    var idx   = safeFontIndex(str.charCodeAt(i));
    var wChar = Number(font[idx][0]);
    xPos+= wChar+((i==str.length-1)?0:spacing);
  }
  return xPos
}

function safeFontIndex(idx){
  if(idx<32 || idx>127)
    idx = 32;
  return idx;
}