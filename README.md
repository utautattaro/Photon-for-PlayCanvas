# Photon-for-PlayCanvas
PlayCanvas plugin for online multiplayer webGL Apps using photon :)

====

Overview

## Description
You can create multiplayer webGL Apps with [PlayCanvas](https://playcanvas.com) and [Photon](https://www.photonengine.com/en/Photon) (and this plugin);

You just insert this plugin for your playcanvas project, you can be ready using photon.

This plugin support both photon cloud and photon server.

![imgur](http://i.imgur.com/bpgThme.gif,"demo")

## Demo
[Multiplay tank game sample](http://playcanvas.utautattaro.com/photon/)

Project overview is [here](https://playcanvas.com/project/433966/overview/photonstarterkit).This project is all public.

## Requirement
Only PlayCanvas

## Usage
<ol>
<li>download this plugin</li>
<li>upload your game project</li>
<li>create script on PlayCanvas, "app.js"</li>
<li>rewirte old app.js to new app.js,after delete old app.js</li>
because app.js must playcanvas object.
INSPECTOR > SCRIPT "No Script Objects found" is old app.js
<li>"SCRIPT LOADING ORDER"change</li>
You should call Photon-Javascript_SDK.js and demoloadbalancing.js before app.js
<li>attached app.js to any object</li>
<li>after parse, fill your information(Please get your AppId)</li>
<li>You can ready to use photon</li>
</ol>

## coding
if you attached app.js to ROOT object...
### sendmessage
<pre>
var photonobject;
somescript.prototype.initialize = function(){
    photonobject = this.app.root;
};

somescript.prototype.update = function(dt){
    PhotonController.photon.raiseEvent(1, this.entity.getLocalPosition()); // send position data on Eventcode 1
    PhotonController.photon.raiseEvent(2, this.entity.getLocalEulerAngles());// send angle data on Eventcode 2
};
</pre>

### getmessage
<pre>
var photonobject;
somescript.prototype.initialize = function(){
    photonobject = this.app.root;
};

somescript.prototype.update = function(dt){
    photonobject.photon.onEvent = function(code, content, actorNr){
        switch(code){
            case 1: 
                console.log(content.data[0]) // Position.x;
                console.log(content.data[1]) // Position.y;
                console.log(content.data[2]) // Position.z;
                break;
            case 2:
                console.log(content.data[0]) // angle.x;
                console.log(content.data[1]) // angle.y;
                console.log(content.data[2]) // angle.z;
                break;
        }
    };
};
</pre>

### joinroom
<pre>
//in update method...
photonobject.photon.onActorJoin = function(actor){
    if(actor.actorNr == this.myActor().actorNr)
    {//I join room
    }
    else
    {//other player join room

    }
}


<pre>
//if other player joined room before you join 
PhotonController.photon.onJoinRoom = function(){
for(var i = 1;i < this.myActor().actorNr;i++){
            if(this.myRoomActors()[i]){
                if(!this.myRoomActors()[i].isLocal){
                    //loop num of players on room
                }
            }
    }
}
</pre>

## Author

ryotaro

[portal](http://utautattaro.com)
[blog](http://blog.utautattaro.com)
[playcanvas](https://playcanvas.com/ryotaro)