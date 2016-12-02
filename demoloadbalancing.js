var DemoLoadBalancing = (function (_super) {
    __extends(DemoLoadBalancing, _super);
    function DemoLoadBalancing() {
        _super.call(this, DemoWss ? Photon.ConnectionProtocol.Wss : Photon.ConnectionProtocol.Ws, DemoAppId, DemoAppVersion);
        this.logger = new Exitgames.Common.Logger("Demo:");
        this.output(this.logger.format("Init", this.getNameServerAddress(), DemoAppId, DemoAppVersion));
        this.logger.info("Init", this.getNameServerAddress(), DemoAppId, DemoAppVersion);
        this.setLogLevel(Exitgames.Common.Logger.Level.DEBUG);
    }
    
    DemoLoadBalancing.prototype.start = function () {
        this.setupUI();
        
        // connect if no fb auth required 
        if (ConnectOnStart) {
            if (DemoMasterServer) {
                this.setMasterServerAddress(DemoMasterServer);
                this.connect();
                
            }
            else {
                this.connectToRegionMaster(connectRegion);
            }
        }
    };
    DemoLoadBalancing.prototype.onError = function (errorCode, errorMsg) {
        this.output("Error " + errorCode + ": " + errorMsg);
    };
    DemoLoadBalancing.prototype.onStateChange = function (state) {
        // "namespace" import for static members shorter acceess
        var LBC = Photon.LoadBalancing.LoadBalancingClient;
        var stateText = document.getElementById("statetxt");
        stateText.textContent = LBC.StateToName(state);
        this.updateRoomButtons();
        this.updateRoomInfo();
    };
   
    
    DemoLoadBalancing.prototype.updateRoomInfo = function () {
        var stateText = document.getElementById("roominfo");
        var message;
        if(this.isJoinedToRoom()){
            message = "room: " + this.myRoom().name;
        }
        else
        {
            message = "not joined room";
        }
        stateText.innerHTML = message;
        stateText.innerHTML = stateText.innerHTML + "<br>";
        this.updateRoomButtons();
    };
    DemoLoadBalancing.prototype.onActorPropertiesChange = function (actor) {
        this.updateRoomInfo();
    };
    DemoLoadBalancing.prototype.onMyRoomPropertiesChange = function () {
        this.updateRoomInfo();
    };
    DemoLoadBalancing.prototype.onRoomListUpdate = function (rooms, roomsUpdated, roomsAdded, roomsRemoved) {
        this.logger.info("Demo: onRoomListUpdate", rooms, roomsUpdated, roomsAdded, roomsRemoved);
        this.output("Demo: Rooms update: " + roomsUpdated.length + " updated, " + roomsAdded.length + " added, " + roomsRemoved.length + " removed");
        this.onRoomList(rooms);
        this.updateRoomButtons(); // join btn state can be changed
    };
    DemoLoadBalancing.prototype.onRoomList = function (rooms) {
        var menu = document.getElementById("gamelist");
        while (menu.firstChild) {
            menu.removeChild(menu.firstChild);
        }
        var selectedIndex = 0;
        for (var i = 0; i < rooms.length; ++i) {
            var r = rooms[i];
            var item = document.createElement("option");
            item.textContent = r.name;
            menu.appendChild(item);
            if (this.myRoom().name == r.name) {
                selectedIndex = i;
            }
        }
        menu.selectedIndex = selectedIndex;
        this.output("Demo: Rooms total: " + rooms.length);
        this.updateRoomButtons();
    };
    DemoLoadBalancing.prototype.onJoinRoom = function () {
        this.output("Game " + this.myRoom().name + " joined");
        this.updateRoomInfo();
    };
    DemoLoadBalancing.prototype.onActorJoin = function (actor) {
        this.output("actor " + actor.actorNr + " joined");
        this.updateRoomInfo();
    };
    DemoLoadBalancing.prototype.onActorLeave = function (actor) {
        this.output("actor " + actor.actorNr + " left");
        this.updateRoomInfo();
    };
    DemoLoadBalancing.prototype.sendMessage = function (message) {
        try {
            this.raiseEvent(1, { message: message, senderName: "user" + this.myActor().actorNr });
           }
        catch (err) {
            this.output("error: " + err.message);
        }
    };
    DemoLoadBalancing.prototype.setupUI = function () {
        var _this = this;
        this.logger.info("Setting up UI.");
        var btnJoin = document.getElementById("joingamebtn");
        btnJoin.onclick = function (ev) {
            if (_this.isInLobby()) {
                var menu = document.getElementById("gamelist");
                var gameId = menu.children[menu.selectedIndex].textContent;
                _this.output(gameId);
                _this.joinRoom(gameId);
            }
            else {
                _this.output("Reload page to connect to Master");
            }
            return false;
        };
        var btnJoin2 = document.getElementById("joinrandomgamebtn");
        btnJoin2.onclick = function (ev) {
            if (_this.isInLobby()) {
                _this.output("Random Game...");
                _this.joinRandomRoom();
            }
            else {
                _this.output("Reload page to connect to Master");
            }
            return false;
        };
        var btnNew = document.getElementById("newgamebtn");
        btnNew.onclick = function (ev) {
            if (_this.isInLobby()) {
                var name = document.getElementById("newgamename");
                _this.output("New Game");
                _this.createRoom(name.value.length > 0 ? name.value : undefined);
            }
            else {
                _this.output("Reload page to connect to Master");
            }
            return false;
        };
        var btn = document.getElementById("leavebtn");
        btn.onclick = function (ev) {
            _this.leaveRoom();
            _this.updateRoomInfo();
            return false;
        };
        this.updateRoomButtons();
    };
    DemoLoadBalancing.prototype.output = function (str, color) {
        var log = document.getElementById("theDialogue");
        if(log.clientHeight / window.parent.screen.height > 0.9){
            log.innerHTML = "";
        }
        var escaped = str.replace(/&/, "&amp;").replace(/</, "&lt;").
            replace(/>/, "&gt;").replace(/"/, "&quot;");
        if (color) {
            escaped = "<FONT COLOR='" + color + "'>" + escaped + "</FONT>";
        }
        log.innerHTML = log.innerHTML + escaped + "<br>";
        log.scrollTop = log.scrollHeight;
    };
    DemoLoadBalancing.prototype.updateRoomButtons = function () {
        var btn;
        btn = document.getElementById("newgamebtn");
        btn.disabled = !(this.isInLobby() && !this.isJoinedToRoom());
        var canJoin = this.isInLobby() && !this.isJoinedToRoom() && this.availableRooms().length > 0;
        btn = document.getElementById("joingamebtn");
        btn.disabled = !canJoin;
        btn = document.getElementById("joinrandomgamebtn");
        btn.disabled = !canJoin;
        btn = document.getElementById("leavebtn");
        btn.disabled = !(this.isJoinedToRoom());
    };
    return DemoLoadBalancing;
}(Photon.LoadBalancing.LoadBalancingClient));