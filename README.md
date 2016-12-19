# Photon-for-PlayCanvas
PlayCanvas plugin for online multiplayer webGL Apps using photon :)


====

# Overview

## Description
You can create multiplayer webGL Apps with [PlayCanvas](https://playcanvas.com) and [Photon](https://www.photonengine.com/en/Photon) (and this plugin)

You just insert this plugin for your playcanvas project, you can be ready using photon.

This plugin support both photon cloud and photon server.

<img width="100%" src="http://i.imgur.com/wEfLBe7.png" />

[page](https://utautattaro.github.io/Photon-for-PlayCanvas/)

## Demo (photon cloud free 20ccu @Tokyo.Japan Region)
[demo](https://playcanv.as/p/m9ZoTmjj/)

[demo-6window](https://utautattaro.github.io/Photon-for-PlayCanvas/testclient.html)
*only pc

[Project overview](https://playcanvas.com/project/433966/overview/photonstarterkit)
This project is all public.

## Requirement
Only PlayCanvas

## Usage
<ol>
<li>download this plugin</li>
<li>upload plugin files for your game project</li>

<img width="40%" src="http://i.imgur.com/UGxJnFj.png" />

<li>app.js to become playcanvas script object</li>

app.js must be playcanvas object.

INSPECTOR > SCRIPT > SCRIPTS  click "PARSE"

<img width="40%" src="http://i.imgur.com/mRAiQ2D.png" title="before"/>
<img width="40%" src="http://i.imgur.com/9DdBX7X.png" title="after"/>

<li>"SCRIPT LOADING ORDER"change</li>

You should call Photon-Javascript_SDK.js and demoloadbalancing.js before app.js
</br>
<img width="40%" src="http://i.imgur.com/vE9mP7d.png" />

<li>attached app.js to any object</li>

<li>after parse, fill your information. If you filled "server address" of PHOTON SERVER,must be using photon server.The colum should be blank when you want to use photon cloud.</li>

<img width="40%" src="http://i.imgur.com/1Oq54Vj.png" />

<li>Congratulations! You can ready to use photon</li>

<img width="100%" src="http://i.imgur.com/aSYMNoG.png" />

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
    photonobject.photon.raiseEvent(1, this.entity.getLocalPosition()); // send position data on Eventcode 1
    photonobject.photon.raiseEvent(2, this.entity.getLocalEulerAngles()); // send angle data on Eventcode 2
};
</pre>

### recivemessage
<pre>
var photonobject;
somescript.prototype.initialize = function(){
    photonobject = this.app.root;
};

somescript.prototype.update = function(dt){
    photonobject.photon.onEvent = function(code, content, actorNr){//callback if you recive message
        switch(code){
            case 1: 
                console.log(content.data[0]); // Position.x
                console.log(content.data[1]); // Position.y
                console.log(content.data[2]); // Position.z
                break;
            case 2:
                console.log(content.data[0]); // angle.x
                console.log(content.data[1]); // angle.y
                console.log(content.data[2]); // angle.z
                break;
        }
    };
};
</pre>

### joinroom
<pre>
//in update method...
photonobject.photon.onActorJoin = function(actor){//callback if Actor joined room
    if(actor.actorNr == this.myActor().actorNr)
    {
        //player join room
    }
    else
    {
        //other player join room
    }
}

//if other player joined room before you join 
photonobject.photon.onJoinRoom = function(){
    for(var i = 1;i < this.myActor().actorNr;i++){
        if(this.myRoomActors()[i]){
            if(!this.myRoomActors()[i].isLocal){
                //loop num of players in the room
            }
        }
    }
}
</pre>

### leaveroom
<pre>
//in update method...
PhotonController.photon.onActorLeave = function(actor,cleanup){//callback if Actor leave room
        if(actor.actorNr == this.myActor().actorNr)
        {
            //if player leave room  
        }
        else
        {
            //other player leave room
        }
    };
</pre>

### documentation
[Photon-Javascript_SDK Client API Documentation](http://doc-api.photonengine.com/en/javascript/current/)

## License
MIT License

Copyright (c) 2016 Ryotaro Tsuda


## Author
<img width="30%" src="http://i.imgur.com/Xh1GynL.jpg" />

ryotaro
[portal](http://utautattaro.com)
[blog](http://blog.utautattaro.com)
[playcanvas](https://playcanvas.com/ryotaro)
