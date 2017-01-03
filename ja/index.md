<div align="right">
<a href="https://utautattaro.github.io/Photon-for-PlayCanvas/">en</a>
/
<a href="https://utautattaro.github.io/Photon-for-PlayCanvas/ja">ja</a>
</div>

# 概要

## 説明
[PlayCanvas](https://playcanvas.com)と[Photon](https://www.photonengine.com/en/Photon)を利用して簡単にマルチプレイヤーWebGLアプリケーションを作成することができます。

こちらはphoton_JavaScriptSDKをPlayCanvas向けにラップし、手軽に使用可能にしたプラグインです。
このプラグインを利用することで、既存のPlayCanvasプロジェクトに手軽にPhotonを利用したマルチプレイが組み込むことが可能です。

このプラグインはPhoton cloud，Photon serverどちらも対応しています。

<img width="100%" src="http://i.imgur.com/wEfLBe7.png" />

# デモ (photon cloud 20ccu @東京・日本リージョン)
<iframe src="https://playcanv.as/p/m9ZoTmjj/" frameborder="0" width="100%" height="480px"></iframe>

移動...WASD ショット...enter (モバイル端末、ゲームパッド対応)

[6画面デモ](https://utautattaro.github.io/Photon-for-PlayCanvas/testclient.html)
*PCのみ

[Project overview](https://playcanvas.com/project/433966/overview/photonstarterkit)
PlayCanvasページに遷移します。このプロジェクトはすべてパブリックです。


## 要件
PlayCanvasのみ

## 使用方法
<ol>
<li>プラグインをダウンロードします</li>
<li>ダウンロードしたファイルをすべてPlayCanvasプロジェクトへアップロードします</li>

<img width="40%" src="http://i.imgur.com/UGxJnFj.png" />

<li>app.jsをPlayCanvasで読み取り可能な状態のスクリプトにします</li>
app.jsはPlayCanvasのオブジェクトである必要があります。

INSPECTOR > SCRIPT > SCRIPTSから　"PARSE"をクリックしてください


<img width="40%" src="http://i.imgur.com/mRAiQ2D.png" title="before"/>
<img width="40%" src="http://i.imgur.com/9DdBX7X.png" title="after"/>

<li>"SCRIPT LOADING ORDER"を変更します</li>

Photon-Javascript_SDK.js及びdemoloadbalancing.jsはapp.jsの前に呼ばれる必要があるので、順番を変更します。


<img width="40%" src="http://i.imgur.com/vE9mP7d.png" />

<li>app.jsを任意のオブジェクトにアタッチします</li>

<li>parseをした後に、情報を入力してください.PHOTON SERVERの"server address"に値がある場合、pluginはphoton serverを使用します。Photon cloudを使用する場合、この欄は空白にしてください</li>

<img width="40%" src="http://i.imgur.com/1Oq54Vj.png" />

<li>Photonを使用する準備ができました</li>

<img width="100%" src="http://i.imgur.com/aSYMNoG.png" />

</ol>

## コーディング
app.jsをROOTオブジェクトにアタッチした場合

### メッセージ送信
<pre>
var photonobject;
somescript.prototype.initialize = function(){
    photonobject = this.app.root.children[0];//ROOTオブジェクトを取得
};

somescript.prototype.update = function(dt){
    photonobject.photon.raiseEvent(1, this.entity.getLocalPosition()); //イベントコード1でポジションデータを送信
    photonobject.photon.raiseEvent(2, this.entity.getLocalEulerAngles()); //イベントコード2で回転データを送信
};
</pre>

### メッセージ受信
<pre>
var photonobject;
somescript.prototype.initialize = function(){
    photonobject = this.app.root.children[0];//ROOTオブジェクトを取得
};

somescript.prototype.update = function(dt){
    photonobject.photon.onEvent = function(code, content, actorNr){//メッセージを受け取った際に呼び出されるコールバック
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

### ルーム入室時
<pre>
//in update method...
photonobject.photon.onActorJoin = function(actor){//Actorが入室した際に呼び出されるコールバック
    if(actor.actorNr == this.myActor().actorNr)
    {
        //自身が入室したとき
    }
    else
    {
        //他のプレイヤーが入室したとき
    }
};

//自分が入室したときに他のプレイヤーがすでに入室していた時の処理 
photonobject.photon.onJoinRoom = function(){
    for(var i = 1;i < this.myActor().actorNr;i++){
        if(this.myRoomActors()[i]){
            if(!this.myRoomActors()[i].isLocal){
                //ルームにいるプレイヤーの数だけループする
            }
        }
    }
};
</pre>

### ルーム退室時
<pre>
//in update method...
PhotonController.photon.onActorLeave = function(actor,cleanup){//Actorが退出した際に呼び出されるコールバック
    if(actor.actorNr == this.myActor().actorNr)
    {
        //自身が退室したとき
    }
    else
    {
        //他のプレイヤーが退室したとき
    }
};
</pre>


### ヒント
<pre>
///////////////シンプルなオブジェクト同期///////////////

// 1.他のプレイヤーのオブジェクトを生成する
photonobject.photon.onActorJoin = function(actor){//Actorが入室した際に呼び出されるコールバック
    if(actor.actorNr != this.myActor().actorNr){
        //他のプレイヤーが入室したとき
        otherobject.generate(); // 他のプレイヤーのオブジェクトを生成する
    }
};

//自分が入室したときに他のプレイヤーがすでに入室していた時の処理 
photonobject.photon.onJoinRoom = function(){
    for(var i = 1;i < this.myActor().actorNr;i++){
        if(this.myRoomActors()[i]){
            if(!this.myRoomActors()[i].isLocal){
                //ルームにいるプレイヤーの数だけループする
                otherobject.generate(); // 他のプレイヤーのオブジェクトを生成する
            }
        }
    }
};

// 2. プレイヤーのスクリプト：オブジェクトのトランスフォーム情報を送信する
playercontrol.prototype.send = function(){
    photonobject.photon.raiseEvent(1, this.entity.getLocalPosition()); // イベントコード1でポジションデータを送信
    photonobject.photon.raiseEvent(2, this.entity.getLocalEulerAngles()); // イベントコード2で回転データを送信
};

// 3. 他のプレイヤーを管理するスクリプト：トランスフォーム情報を受け取る
otherplayercontrol.prototype.recive = function(){
    photonobject.photon.onEvent = function(code, content, actorNr){//メッセージを受け取った際に呼び出されるコールバック
        switch(code){
            case 1: 
                otherobject.setLocalPotisions(content.data[0],content.data[1],content.data[2]);
                break;
            case 2:
                otherobject.setLocalEularAngles(content.data[0],content.data[1],content.data[2]);
                break;
        }
    };
};

// 4. 退出時：オブジェクトを消去する
PhotonController.photon.onActorLeave = function(actor,cleanup){//Actorが退出した際に呼び出されるコールバック
    if(actor.actorNr != this.myActor().actorNr)
    {
        //他のプレイヤーが退室したとき
        otherobject.destroy();
    }
};

///////////////シリアライズ, デシリアライズ///////////////
somescript.prototype.send = function(){
    var message = "";
    message += this.entity.getLocalPosition().x + ",";
    message += this.entity.getLocalPosition().y + ",";
    .
    .
    .
    message += this.entity.getLocalEulerAngles().z;

    var oldmessage = "";
    if(message != oldmessage){
        PhotonController.photon.raiseEvent(1,message);
        oldmessage = message;
    }
};

somescript.prototype.recive = function(){
    photonobject.photon.onEvent = function(code, content, actorNr){//メッセージを受け取った際に呼び出されるコールバック
        switch(code){
            case 1: 
                var recivemes;
                recivemes = content.data.split(",");
                otherobject.setLocalPotisions(recivemes[0],recivemes[1],recivemes[2]);
                otherobject.setLocalEularAngles(recivemes[3],recivemes[4],recivemes[5]);
                break;
        }
    };
};
</pre>

### ドキュメント
[Photon-Javascript_SDK Client API Documentation](http://doc-api.photonengine.com/en/javascript/current/)

## ライセンス
MIT License

Copyright (c) 2016 Ryotaro Tsuda


## Author
<img width="30%" src="http://i.imgur.com/Xh1GynL.jpg" />

ryotaro
[portal](http://utautattaro.com)
[blog](http://blog.utautattaro.com)
[playcanvas](https://playcanvas.com/ryotaro)

last update 2017-01-03 13:23:56