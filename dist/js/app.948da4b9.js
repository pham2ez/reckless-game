(function(e){function t(t){for(var o,s,r=t[0],c=t[1],l=t[2],m=0,d=[];m<r.length;m++)s=r[m],Object.prototype.hasOwnProperty.call(a,s)&&a[s]&&d.push(a[s][0]),a[s]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(e[o]=c[o]);u&&u(t);while(d.length)d.shift()();return i.push.apply(i,l||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],o=!0,r=1;r<n.length;r++){var c=n[r];0!==a[c]&&(o=!1)}o&&(i.splice(t--,1),e=s(s.s=n[0]))}return e}var o={},a={app:0},i=[];function s(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=o,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)s.d(n,o,function(t){return e[t]}.bind(null,o));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],c=r.push.bind(r);r.push=t,r=r.slice();for(var l=0;l<r.length;l++)t(r[l]);var u=c;i.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"05bb":function(e,t,n){e.exports=n.p+"img/Duke.52768b42.png"},1:function(e,t){},"114d":function(e,t,n){},"20e4":function(e,t,n){e.exports=n.p+"media/nani.87076b2b.mp3"},"23f5":function(e,t,n){e.exports=n.p+"media/approachingMe.b76e70a7.mp3"},"25ba":function(e,t,n){},"27fe":function(e,t,n){e.exports=n.p+"media/nope.4c93fb92.mp3"},"4f6c":function(e,t,n){"use strict";var o=n("f038"),a=n.n(o);a.a},5386:function(e,t,n){"use strict";var o=n("8216"),a=n.n(o);a.a},"56d7":function(e,t,n){"use strict";n.r(t),n.d(t,"socket",(function(){return Ie})),n.d(t,"eventBus",(function(){return we}));n("cadf"),n("551c"),n("f751"),n("097d");var o=n("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("b-navbar",{attrs:{type:"dark",variant:"info"}},[n("b-navbar-brand",{attrs:{href:"#"}},[e._v("Coup")]),n("b-collapse",{attrs:{id:"nav-collapse","is-nav":""}},[e.signedin&&!e.inRoom?n("b-navbar-nav",[n("b-form-input",{staticClass:"mr-sm-2",attrs:{size:"sm",placeholder:"Search Room..."},on:{input:e.changeSearch},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}})],1):e._e(),e.signedin?n("b-navbar-nav",{staticClass:"ml-auto"},[e.inRoom?e._e():n("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.my-modal",modifiers:{"my-modal":!0}}]},[e._v("Create a Room")]),e.inGame?e._e():n("b-nav-item",{attrs:{href:"#"},on:{click:e.signOut}},[e._v("Sign Out")])],1):e._e()],1)],1),n("b-modal",{attrs:{id:"my-modal",title:"Create a Room"},on:{ok:e.createRoom}},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.roomName,expression:"roomName"}],attrs:{type:"text",placeholder:"Enter a room name"},domProps:{value:e.roomName},on:{input:function(t){t.target.composing||(e.roomName=t.target.value)}}})]),e.signedin&&!e.inRoom?n("div",{staticClass:"home"},[n("div",{staticClass:"big"},[n("GamesList")],1),n("div",{staticClass:"small"},[n("FriendsList")],1)]):e._e(),e.signedin?e._e():n("SignUpIn"),n("WaitRoomView",{directives:[{name:"show",rawName:"v-show",value:e.signedin&&e.inRoom,expression:"signedin && inRoom"}],attrs:{username:e.username}})],1)},i=[],s=(n("386d"),n("bc3a")),r=n.n(s),c=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"sign"}},[n("b-tabs",{attrs:{"content-class":"mt-3",justified:""},on:{input:function(t){return e.clear()}},model:{value:e.modeIndex,callback:function(t){e.modeIndex=t},expression:"modeIndex"}},[n("b-tab",{attrs:{title:"Sign In"}}),n("b-tab",{attrs:{title:"Sign Up",active:""}})],1),n("form",{attrs:{id:"form",method:"post"},on:{submit:function(t){return t.preventDefault(),e.submitThis(t)}}},[n("div",{staticClass:"form-group"},[n("h2",[e._v(e._s(e.title))]),n("label",{attrs:{for:"username"}},[e._v("Username")]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.username,expression:"username"}],attrs:{id:"username",type:"text",placeholder:[[e.userPrompt]]},domProps:{value:e.username},on:{input:function(t){t.target.composing||(e.username=t.target.value)}}}),n("label",{attrs:{for:"password"}},[e._v("Password")]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.password,expression:"password"}],attrs:{id:"password",type:"text",placeholder:[[e.passPrompt]]},domProps:{value:e.password},on:{input:function(t){t.target.composing||(e.password=t.target.value)}}}),n("input",{attrs:{type:"submit"},domProps:{value:e.title}})])])],1)},l=[],u={name:"SignUpIn",data:function(){return{modeIndex:0,options:["signin","signup"],username:"",password:""}},computed:{title:function(){return 0===this.modeIndex?"Sign In":1===this.modeIndex?"Sign Up":void 0},userPrompt:function(){return 0===this.modeIndex?"Enter your username":1===this.modeIndex?"Enter your password":void 0},passPrompt:function(){return 0===this.modeIndex?"Create a username":1===this.modeIndex?"Create a password":void 0}},methods:{submitThis:function(){0===this.modeIndex?this.signIn():1===this.modeIndex&&this.signUp()},clear:function(){this.username="",this.password=""},signIn:function(){var e=this,t={username:this.username,password:this.password};r.a.post("/api/user/signin",t).then((function(t){we.$emit("signin-success",t.data.username),e.clear()})).catch((function(e){we.$emit("error",e.response.data.error)}))},signUp:function(){var e=this,t={username:this.username,password:this.password};r.a.post("/api/user",t).then((function(t){we.$emit("signin-success",t.data.username),e.clear()})).catch((function(e){we.$emit("error",e.response.data.error)}))}}},m=u,d=(n("a651"),n("2877")),q=Object(d["a"])(m,c,l,!1,null,null,null),h=q.exports,f=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"friendsList"},[n("b-tabs",{attrs:{"content-class":"mt-3",justified:""}},[n("b-tab",{attrs:{title:"Friends",active:""},on:{click:e.getFriends}},e._l(e.show,(function(e){return n("FriendsItem",{key:e,attrs:{username:e,mode:0}})})),1),n("b-tab",{attrs:{title:"Requests"},on:{click:e.getRequests}},e._l(e.show,(function(e){return n("FriendsItem",{key:e,attrs:{username:e,mode:1}})})),1),n("b-tab",{staticClass:"flex-container",attrs:{title:"Add"},on:{click:e.changeSearch}},[n("div",{staticClass:"container"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.search,expression:"search"}],staticClass:"small",attrs:{type:"text",placeholder:"Search user..."},domProps:{value:e.search},on:{input:[function(t){t.target.composing||(e.search=t.target.value)},e.changeSearch]}}),e._l(e.show,(function(e){return n("FriendsItem",{key:e,staticClass:"small",attrs:{username:e,mode:2}})}))],2)])],1)],1)},p=[],g=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"friend"},[n("b-card",{attrs:{title:e.username}},[n("b-card-text",[e._v(" "+e._s(e.showStatus)+" ")]),"room"===e.status?n("b-button",{attrs:{variant:"primary"}},[e._v(" Join ")]):e._e(),1===e.mode?n("b-button",{attrs:{variant:"primary"},on:{click:function(t){return e.accept()}}},[e._v(" Accept ")]):e._e(),1===e.mode?n("b-button",{attrs:{variant:"primary"},on:{click:function(t){return e.reject()}}},[e._v(" Delete ")]):e._e(),2===e.mode?n("b-button",{attrs:{variant:"primary"},on:{click:function(t){return e.request()}}},[e._v(" Request ")]):e._e()],1)],1)},v=[],A={name:"FriendsItem",props:["username","mode","status","roomID"],created:function(){},computed:{showStatus:function(){return"room"===this.status?"Waiting":"game"===this.status?"In game":void 0}},methods:{join:function(){r.a.put("/api/room/players/"+this.roomID,{}).then((function(e){we.$emit("joined-room",e.data)}))},accept:function(){r.a.put("/api/user/request/"+this.username,{}).then((function(){we.$emit("update-requests")}))},reject:function(){r.a.delete("/api/user/request/"+this.username,{}).then((function(){we.$emit("update-requests")}))},request:function(){r.a.post("/api/user/request/"+this.username,{}).then((function(){we.$emit("friend-requested")}))}}},b=A,y=Object(d["a"])(b,g,v,!1,null,"006388cf",null),I=y.exports,w={name:"FriendsList",components:{FriendsItem:I},data:function(){return{mode:"friends",show:[],search:""}},created:function(){var e=this;this.getFriends(),we.$on("friend-requested",(function(){e.search="",e.show=[]})),we.$on("update-requests",(function(){e.getRequests()}))},computed:{},methods:{getFriends:function(){var e=this;this.search="",r.a.get("/api/user/friends",{}).then((function(t){e.show=t.data}))},getRequests:function(){var e=this;this.search="",r.a.get("/api/user/request/",{}).then((function(t){e.show=t.data}))},changeSearch:function(){var e=this;""===this.search?this.show=[]:r.a.get("/api/user/find/"+this.search,{}).then((function(t){e.show=t.data}))}}},C=w,D=(n("5386"),Object(d["a"])(C,f,p,!1,null,"0c2c4186",null)),k=D.exports,x=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"gamesList"},e._l(e.gameList,(function(e){return n("GameItem",{key:e.id,attrs:{roomName:e.roomName,roomID:e.id,players:e.players}})})),1)},P=[],_=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"game"},[n("b-card",{attrs:{title:e.roomName}},[n("b-card-text",[e._v(" ID: "+e._s(e.roomID)+" "),n("br"),e._v(" Players: "+e._s(e.players)+" ")]),n("b-button",{attrs:{variant:"primary"},on:{click:e.join}},[e._v("Join")])],1)],1)},R=[],N={name:"GameItem",props:["roomName","roomID","players"],data:function(){return{}},created:function(){},computed:{},methods:{join:function(){var e=this;r.a.put("/api/room/players/"+this.roomID,{}).then((function(t){console.log("joining"),Ie.emit("join",{roomID:e.roomID,players:t.data.players}),we.$emit("joined-room",t.data)}))}}},E=N,G=Object(d["a"])(E,_,R,!1,null,"37c0b478",null),B=G.exports,S={name:"GamesList",components:{GameItem:B},props:[],data:function(){return{gameList:[]}},created:function(){var e=this;Ie.on("create",(function(){e.getRooms()})),Ie.on("join",(function(){e.getRooms()})),Ie.on("leave",(function(){e.getRooms()})),we.$on("room-added",(function(){e.getRooms()})),we.$on("search",(function(t){""===t?e.getRooms():r.a.get("/api/room/find/"+t,{}).then((function(t){e.gameList=t.data}))})),this.getRooms()},computed:{},methods:{getRooms:function(){var e=this;r.a.get("/api/room/rooms",{}).then((function(t){e.gameList=t.data}))}}},j=S,F=Object(d["a"])(j,x,P,!1,null,"6b249a74",null),O=F.exports,M=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"wait"},[n("h2",[e._v(e._s(e.roomName))]),e._v(" "+e._s(e.players.length)+"/6 players "),n("div",{staticClass:"players"},e._l(e.players.length,(function(t){return n("b-card",{key:e.players[t-1],attrs:{title:e.players[t-1],"bg-variant":e.bgVariant(t-1),"text-variant":e.textVariant(t-1)}},[n("b-card-text",[e._v(" "+e._s(e.playerText(e.players[t-1]))+" ")]),e.okedPlayers.includes(e.players[t-1])?n("b-card-text",[e._v(" Player did nothing. ")]):e._e()],1)})),1),n("div",{directives:[{name:"show",rawName:"v-show",value:!e.inGame&&!e.loading,expression:"!inGame && !loading"}],staticClass:"wait"},[n("b-button",{attrs:{variant:"info",disabled:e.username!==e.creator||e.players.length<2},on:{click:e.start}},[e._v("Start")]),n("b-button",{attrs:{variant:"outline-dark"},on:{click:e.leave}},[e._v("Leave")])],1),n("b-spinner",{directives:[{name:"show",rawName:"v-show",value:e.loading,expression:"loading"}],attrs:{variant:"primary",label:"Spinning"}}),n("div",{directives:[{name:"show",rawName:"v-show",value:e.inGame,expression:"inGame"}]},[n("b-modal",{attrs:{visible:e.inGame&&""!==e.winner,"hide-header":"","hide-footer":""}},[e._v(" The winner is "+e._s(e.winner.winner)+". "),e.creator===e.username?n("b-button",{on:{click:e.end}},[e._v("End")]):e._e()],1)],1),n("div",{staticClass:"columns"},[""!==e.roomID?n("Messages",{attrs:{roomID:e.roomID}}):e._e(),n("CoupView",{directives:[{name:"show",rawName:"v-show",value:e.inGame&&!e.dead,expression:"inGame && !dead"}],attrs:{username:e.username,players:e.players,roomID:e.roomID}})],1)],1)},K=[],$=(n("ac4d"),n("8a81"),n("ac6a"),n("6762"),n("2fdb"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"messageBox"},[n("b-form-textarea",{staticStyle:{"border-style":"solid 5px","box-shadow":"0 0 10px #719ECE","border-color":"#00cdcd","font-size":"15px","font-weight":"bold","font-family":"'Arial'"},attrs:{id:"textarea",rows:"26",plaintext:"","no-resize":""},model:{value:e.messages,callback:function(t){e.messages=t},expression:"messages"}})],1)}),L=[],V={name:"Messages",props:["roomID"],data:function(){return{messages:""}},created:function(){var e=this;this.messages="Welcome to room "+this.roomID,we.$on("add-message",(function(t){e.messages+="\n- "+t.message,document.getElementById("textarea").scrollTop=document.getElementById("textarea").scrollHeight,console.log(t),Ie.emit("message",t)})),we.$on("left-room",(function(){e.messages=""})),Ie.on("message",(function(t){e.messages+="\n- "+t.message,e.$nextTick((function(){document.getElementById("textarea").scrollTop=document.getElementById("textarea").scrollHeight}))}))}},T=V,U=(n("91ab"),Object(d["a"])(T,$,L,!1,null,"2703fbc1",null)),H=U.exports,Q=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("b-card",{class:e.classy,style:e.style,attrs:{title:e.title,"img-top":"","img-src":e.img},on:{click:e.choose,mouseover:e.onHover,mouseout:e.onLeave}},e._l(e.textArray,(function(t){return n("b-card-text",{key:t},[e._v(" "+e._s(t)+" ")])})),1)},Y=[],W={name:"CoupView",props:["role","available"],data:function(){return{hover:!1,textArray:[]}},created:function(){"A1"===this.role?this.textArray=["Exchange cards with Court Deck.","Blocks stealing."]:"C"===this.role?this.textArray=["Blocks assassination."]:"D"===this.role?this.textArray=["Take 3 coins from Treasury.","Blocks Foreign Aid."]:"N"===this.role?this.textArray=["Pay 3 coins to assassinate another player."]:"T"===this.role&&(this.textArray=["Steal 2 coins from another player.","Blocks stealing."])},computed:{title:function(){return"A1"===this.role?"Ambassador":"C"===this.role?"Contessa":"D"===this.role?"Duke":"N"===this.role?"Assassin":"T"===this.role?"Captain":void 0},style:function(){return this.hover?"max-width: 15rem;":"max-width: 12rem"},img:function(){return"A1"===this.role?n("cc37"):"C"===this.role?n("8c12"):"D"===this.role?n("05bb"):"N"===this.role?n("9455"):"T"===this.role?n("c530"):void 0},classy:function(){return this.available?"":"dark"}},methods:{choose:function(){this.available&&we.$emit("chosen-card",this.role)},onHover:function(){this.hover=!0},onLeave:function(){this.hover=!1}}},J=W,z=(n("e3e1"),Object(d["a"])(J,Q,Y,!1,null,"e1dea1aa",null)),Z=z.exports,X=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"coup"},[null!==e.gameInfo?o("div",{staticClass:"cards"},[o("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal",value:"info",expression:"'info'"}],attrs:{variant:"outline-dark"}},[e._v("Game Info")]),o("Info",{attrs:{title:"My Cards",textArray:e.myCardsArray}}),o("Info",{attrs:{title:"Dead Cards",textArray:e.deadCardsArray}}),o("b-modal",{attrs:{id:"info",size:"lg",title:"Coup Actions","hide-footer":""}},[o("b-img",{attrs:{src:n("bdee"),"fluid-grow":""}})],1)],1):e._e(),o("div",{directives:[{name:"show",rawName:"v-show",value:e.currentPlayer&&null===e.chosenAction,expression:"currentPlayer && chosenAction === null"}],staticClass:"actions"},[o("b-button",{directives:[{name:"show",rawName:"v-show",value:!e.coup,expression:"!coup"}],on:{click:e.income}},[e._v("Income")]),o("b-button",{directives:[{name:"show",rawName:"v-show",value:!e.coup,expression:"!coup"}],on:{click:e.foreignAid}},[e._v("Foreign Aid")]),o("b-button",{directives:[{name:"show",rawName:"v-show",value:e.available||e.coup,expression:"(available || coup)"}],on:{click:e.coupClick}},[e._v("Coup")])],1),o("div",{directives:[{name:"show",rawName:"v-show",value:(e.currentPlayer||e.blockingPlayer)&&!e.coup,expression:"(currentPlayer || blockingPlayer) && !coup"}],staticClass:"cards"},[o("Card",{attrs:{role:"D",available:null===e.chosenAction||"FA"===e.chosenAction}}),o("Card",{attrs:{role:"N",available:null===e.chosenAction&&e.gameInfo.coinDict[e.username]>=3}}),o("Card",{attrs:{role:"A1",available:null===e.chosenAction||"T"===e.chosenAction}}),o("Card",{attrs:{role:"T",available:null===e.chosenAction||"T"===e.chosenAction}}),o("Card",{attrs:{role:"C",available:"N"===e.chosenAction}})],1),o("div",{staticClass:"modals"},[o("b-modal",{attrs:{visible:e.showChoose,"no-close-on-esc":"","no-close-on-backdrop":"","hide-footer":"","hide-header":""}},[o("div",{staticClass:"actions"},e._l(e.players,(function(t){return o("b-button",{directives:[{name:"show",rawName:"v-show",value:t!==e.username,expression:"player !== username"}],key:t,on:{click:function(n){return e.choose(t)}}},[e._v(e._s(t))])})),1)]),null!==e.currentAction?o("b-modal",{attrs:{title:e.title,visible:e.show,"no-close-on-esc":"","no-close-on-backdrop":"","hide-footer":"","hide-header":""}},[o("div",{staticClass:"actions"},[e.currentAction.blockable?o("b-button",{on:{click:e.block}},[e._v("Block")]):e._e(),e.currentAction.challengable?o("b-button",{on:{click:e.challenge}},[e._v("Challenge")]):e._e(),o("b-button",{on:{click:e.handleOk}},[e._v("Do Nothing")])],1)]):e._e(),null!==e.gameInfo?o("b-modal",{attrs:{visible:e.showKill,"no-close-on-esc":"","no-close-on-backdrop":"","hide-header":"","hide-footer":""}},[o("div",{staticClass:"actions"},[e._l(e.gameInfo.myCards.length,(function(t){return o("b-button",{key:e.gameInfo.myCards[t-1]+t,attrs:{variant:"danger",pressed:e.inKill[t-1]},on:{"update:pressed":function(n){return e.$set(e.inKill,t-1,n)},click:function(n){return e.kill(t-1)}}},[e._v(" "+e._s(e.dict[e.gameInfo.myCards[t-1]])+" ")])})),o("b-button",{attrs:{variant:"dark",disabled:0!==e.numKill},on:{click:e.handleKill}},[e._v("Finish")])],2)]):e._e()],1)])},ee=[],te=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("b-card",{staticClass:"info",attrs:{title:e.title}},e._l(e.textArray,(function(t){return n("b-card-text",{key:t},[e._v(" "+e._s(t)+" ")])})),1)},ne=[],oe={name:"CoupView",props:["title","textArray"]},ae=oe,ie=(n("4f6c"),Object(d["a"])(ae,te,ne,!1,null,"5e45713f",null)),se=ie.exports,re={name:"CoupView",components:{Card:Z,Info:se},props:["username","players","roomID"],data:function(){return{chosenAction:null,chosenPlayer:null,currentAction:null,blocking:!1,currentPlayer:!1,blockingPlayer:!1,showChoose:!1,showBlock:!1,title:"",showChallenge:!1,showKill:!1,available:!1,coup:!1,oks:0,numKill:0,inKill:[!1,!1,!1,!1],dict:{A1:"Ambassador",C:"Contessa",T:"Captain",D:"Duke",N:"Assassin"},gameInfo:null,deadCardsArray:[],myCardsArray:[]}},created:function(){var e=this;Ie.on("getInfo",(function(){"A1"!==e.chosenAction&&"A2"!==e.chosenAction&&"BS1"!==e.chosenAction&&e.clear(),r.a.get("/api/coup/info/"+e.roomID,e.body).then((function(t){e.gameInfo=t.data,e.deadCardsPopu(),e.myCardsPopu(),e.currentPlayer=e.username===e.players[t.data.playerIndex];var n=e.gameInfo.coinDict[e.username];n<7?(e.available=!1,e.coup=!1):n>=10?(e.available=!0,e.coup=!0):(e.available=!0,e.coup=!1),we.$emit("game-info",t.data),"A1"===e.chosenAction&&(e.chosenAction="A2",e.showKill=!0)}))})),we.$on("ended",(function(){e.clear()})),Ie.on("action",(function(t){var o=new Audio(n("23f5"));o.play(),e.currentAction=t,e.title=e.currentAction.fromPlayer+"'s "+e.dict[e.currentAction.action],t.toPlayer!==e.username||t.blockable||t.challengable||(e.chosenAction="COUP",e.numKill=1,e.showKill=!0),t.toPlayer!==e.username&&"FA"!==e.currentAction.action||("FA"===e.currentAction.action&&(e.chosenAction="FA"),e.showBlock=t.blockable),e.showChallenge=t.challengable})),Ie.on("challenge",(function(t){var o;if(e.username===t.toPlayer&&e.gameInfo.myCards.includes(t.action)){o=new Audio(n("976e")),o.play();var a="N"===e.chosenAction?2:1;Ie.emit("challengeResults",{roomID:e.roomID,loser:t.fromPlayer,kill:a}),we.$emit("add-message",{message:e.username+" did have "+e.dict[e.chosenAction],roomID:e.roomID}),"N"!==e.chosenAction&&e.finish()}else e.username!==t.toPlayer||e.gameInfo.myCards.includes(t.action)?e.clearModal():(o=new Audio(n("d433")),o.play(),we.$emit("add-message",{message:e.username+" did not have "+e.dict[e.chosenAction],roomID:e.roomID}),e.chosenAction="BS2",e.showKill=!0,e.numKill="C"===t.action?2:1)})),Ie.on("challengeResults",(function(t){if(e.username===t.loser){e.chosenAction="BS1",e.showKill=!0,e.numKill=t.kill>e.gameInfo.myCards.length?e.gameInfo.myCards.length:t.kill;var o=new Audio(n("27fe"));o.play()}})),Ie.on("block",(function(){e.clearModal()})),Ie.on("ok",(function(t){e.username===t.player&&(e.oks++,e.oks===e.players.length-1&&e.finish())})),we.$on("chosen-card",(function(t){var o=new Audio(n("d12b"));o.play(),e.currentPlayer=!1,e.blockingPlayer=!1,e.chosenAction=t,e.blocking?(we.$emit("add-message",{message:e.username+" blocks with "+e.dict[e.chosenAction],roomID:e.roomID}),Ie.emit("action",{roomID:e.roomID,action:e.chosenAction,blockedAction:e.currentAction.action,blockable:!1,challengable:!0,fromPlayer:e.username,toPlayer:e.currentAction.fromPlayer})):"N"===t||"T"===t?e.showChoose=!0:(we.$emit("add-message",{message:e.username+" chose "+e.dict[t],roomID:e.roomID}),Ie.emit("action",{roomID:e.roomID,action:e.chosenAction,blockable:!1,challengable:!0,fromPlayer:e.username}))}))},computed:{show:function(){return(this.showChallenge||this.showBlock)&&!this.blocking}},methods:{clear:function(){this.chosenPlayer=null,this.chosenAction=null,this.currentAction={},this.blocking=!1,this.blockingPlayer=!1,this.clearModal(),this.showChallenge=!1,this.showKill=!1,this.oks=0,this.numKill=0,this.inKill=[!1,!1,!1,!1]},clearModal:function(){this.showBlock=!1,this.showChallenge=!1},income:function(){this.chosenAction="IN",this.finish(),we.$emit("add-message",{message:this.username+" chose income",roomID:this.roomID})},foreignAid:function(){this.chosenAction="FA",this.currentPlayer=!1,we.$emit("add-message",{message:this.username+" chose foreign aid",roomID:this.roomID}),Ie.emit("action",{roomID:this.roomID,action:this.chosenAction,fromPlayer:this.username,blockable:!0,challengable:!1})},coupClick:function(){this.showChoose=!0,this.chosenAction="COUP"},choose:function(e){this.chosenPlayer=e,this.showChoose=!1,we.$emit("add-message",{message:this.username+" picked "+e+" to use "+this.dict[this.chosenAction]+" on",roomID:this.roomID}),Ie.emit("action",{roomID:this.roomID,action:this.chosenAction,blockable:"COUP"!==this.chosenAction,challengable:"COUP"!==this.chosenAction,fromPlayer:this.username,toPlayer:e})},finish:function(){var e=this;this.body={id:this.roomID,player1:this.username,player2:this.chosenPlayer,action:this.chosenAction,cards:[]},r.a.put("/api/coup/move",this.body).then((function(){Ie.emit("getInfo",{roomID:e.roomID}),"A1"===e.chosenAction&&(e.numKill=2)}))},block:function(){this.blocking=!0,this.blockingPlayer=!0,this.chosenAction=this.currentAction.action,Ie.emit("block",{roomID:this.roomID,player:this.username})},challenge:function(){this.clearModal(),we.$emit("add-message",{message:this.username+" challenges "+this.currentAction.fromPlayer+"'s "+this.dict[this.currentAction.action],roomID:this.roomID}),Ie.emit("challenge",{roomID:this.roomID,action:this.currentAction.action,fromPlayer:this.username,toPlayer:this.currentAction.fromPlayer})},handleOk:function(){var e=this;if(void 0===this.currentAction.blockedAction)if(we.$emit("add-message",{message:"Action successfully went through",roomID:this.roomID}),this.clearModal(),"N"===this.currentAction.action){this.chosenAction="N",this.numKill=1,this.showKill=!0;var t=new Audio(n("20e4"));t.play()}else Ie.emit("ok",{roomID:this.roomID,player:this.currentAction.fromPlayer,okPlayer:this.username});else we.$emit("add-message",{message:"Action was successfully blocked",roomID:this.roomID}),"N"===this.chosenAction?this.finish():r.a.get("/api/coup/next/"+this.roomID).then((function(){Ie.emit("getInfo",{roomID:e.roomID})}))},handleKill:function(){var e=this;this.showKill=!1;for(var t=[],n=this.username+" chose to kill ",o=0;o<this.inKill.length;o++)this.inKill[o]&&(t.push(this.gameInfo.myCards[o]),n+=this.dict[this.gameInfo.myCards[o]]+" ");we.$emit("add-message",{message:n+"to die",roomID:this.roomID}),this.body={id:this.roomID,player1:this.currentAction.fromPlayer,player2:this.username,action:this.chosenAction,cards:t},r.a.put("/api/coup/move",this.body).then((function(){e.clear(),Ie.emit("getInfo",{roomID:e.roomID})}))},kill:function(e){this.inKill[e]?this.numKill--:this.numKill++},myCardsPopu:function(){for(var e=[],t=0;t<this.gameInfo.myCards.length;t++)e.push(this.dict[this.gameInfo.myCards[t]]);this.myCardsArray=e},deadCardsPopu:function(){var e=[];for(var t in this.gameInfo.deadCards)e.push(this.dict[t]+": "+this.gameInfo.deadCards[t]+"/3");this.deadCardsArray=e}}},ce=re,le=(n("7fc7"),Object(d["a"])(ce,X,ee,!1,null,"142d6642",null)),ue=le.exports,me={name:"WaitRoomView",components:{Messages:H,CoupView:ue,Card:Z},props:["username"],data:function(){return{creator:"",players:[],roomID:"",roomName:"",dead:!1,deadPlayers:[],okedPlayers:[],numCards:{},coinDict:{},playerIndex:0,inGame:!1,winner:"",loading:!1,dict:{A1:"Ambassador",C:"Contessa",T:"Captain",D:"Duke",N:"Assassin"}}},created:function(){var e=this;Ie.on("join",(function(t){e.players=t.players})),Ie.on("leave",(function(t){e.players=t.players,e.creator=t.creator})),Ie.on("ended",(function(){e.clear()})),Ie.on("winner",(function(t){e.winnerSound(),e.winner=t})),we.$on("joined-room",(function(t){e.creator=t.creator,e.players=t.players,e.roomID=t.id,e.roomName=t.roomName})),we.$on("leave-room",(function(){e.leave()})),we.$on("leave-room",(function(){e.leave()})),we.$on("game-info",(function(t){if(e.loading=!1,e.okedPlayers=[],e.deadPlayers=t.deadPlayers,e.dead=t.deadPlayers.includes(e.username),e.numCards=t.numCards,e.coinDict=t.coinDict,e.playerIndex=t.playerIndex,e.inGame=!0,t.deadPlayers.length===e.players.length-1){var n=!0,o=!1,a=void 0;try{for(var i,s=e.players[Symbol.iterator]();!(n=(i=s.next()).done);n=!0){var r=i.value;if(!e.deadPlayers.includes(r)){e.winner=r;break}}}catch(c){o=!0,a=c}finally{try{n||null==s.return||s.return()}finally{if(o)throw a}}Ie.emit("winner",{roomID:e.roomID,winner:e.winner}),e.winnerSound(),we.$emit("add-message",{message:e.winner+" won the game!",roomID:e.roomID})}})),Ie.on("ok",(function(t){e.okedPlayers.push(t.okPlayer)})),Ie.on("started",(function(){e.inGame=!0})),Ie.on("loading",(function(){e.loading=!0}))},methods:{winnerSound:function(){var e;e=Math.random()<=.5?new Audio(n("9f31")):new Audio(n("f911")),e.play()},clear:function(){this.dead=!1,this.deadPlayers=[],this.numCards={},this.coinDict={},this.inGame=!1,this.winner=""},playerText:function(e){return this.inGame&&!this.deadPlayers.includes(e)?"Coins: "+this.coinDict[e]+", Cards in Hand: "+this.numCards[e]:this.inGame&&this.deadPlayers.includes(e)?"Dead":"Ready"},bgVariant:function(e){return this.inGame?this.deadPlayers.includes(this.players[e])?"dark":e===this.playerIndex?"info":"light":this.username===this.players[e]?"secondary":"light"},textVariant:function(e){return this.inGame?this.deadPlayers.includes(this.players[e])||e===this.playerIndex?"white":"":this.username===this.players[e]?"white":""},leave:function(){var e=this;r.a.delete("/api/room/players/"+this.roomID,{}).then((function(t){we.$emit("add-message",{message:e.username+" left the room.",roomID:e.roomID}),console.log(t.data),Ie.emit("leave",t.data),we.$emit("left-room")}))},start:function(){var e=this;this.loading=!0,Ie.emit("loading",{roomID:this.roomID}),we.$emit("add-message",{message:"Game started",roomID:this.roomID}),r.a.put("/api/room/start/"+this.roomID,{}).then((function(){Ie.emit("getInfo",{roomID:e.roomID})}))},end:function(){var e=this;r.a.put("/api/room/end/"+this.roomID,{}).then((function(){e.clear(),we.$emit("add-message",{message:"Game ended",roomID:e.roomID}),we.$emit("ended"),Ie.emit("ended",{roomID:e.roomID})}))}}},de=me,qe=(n("fbf4"),Object(d["a"])(de,M,K,!1,null,"1d842bb2",null)),he=qe.exports,fe={name:"app",components:{SignUpIn:h,FriendsList:k,GamesList:O,WaitRoomView:he},data:function(){return{username:null,roomName:"",search:"",roomID:null,inRoom:!1,inGame:!1}},computed:{signedin:function(){return null!==this.username}},methods:{signOut:function(){var e=this;r.a.delete("/api/room/players/"+this.roomID,{}).then((function(){we.$emit("leave-room"),r.a.delete("/api/user/signout",{}).then((function(){e.clearUser()}))}))},clearUser:function(){this.username=null},createRoom:function(){var e=this;r.a.post("/api/room",{content:this.roomName}).then((function(t){console.log(t.data),we.$emit("joined-room",t.data),we.$emit("room-added"),Ie.emit("create",t.data),e.roomName=""}))},changeSearch:function(){we.$emit("search",this.search)}},created:function(){var e=this;r.a.get("/api/user/signedin",{}).then((function(e){we.$emit("signin-success",e.data)})),we.$on("joined-room",(function(t){e.roomID=t.id,e.inRoom=!0,we.$emit("add-message",{message:e.username+" joined the room.",roomID:e.roomID})})),we.$on("left-room",(function(){e.inRoom=!1})),we.$on("signin-success",(function(t){e.username=t}))}},pe=fe,ge=(n("7fe6"),Object(d["a"])(pe,a,i,!1,null,"6bb53d00",null)),ve=ge.exports,Ae=n("5f5b"),be=(n("f9e3"),n("2dd8"),n("8055")),ye=n.n(be),Ie=ye()("http://localhost:3000");o["default"].use(Ae["a"]);var we=new o["default"];o["default"].config.productionTip=!1,new o["default"]({render:function(e){return e(ve)}}).$mount("#app")},"66b3":function(e,t,n){},"6e72":function(e,t,n){},"7fc7":function(e,t,n){"use strict";var o=n("66b3"),a=n.n(o);a.a},"7fe6":function(e,t,n){"use strict";var o=n("6e72"),a=n.n(o);a.a},8216:function(e,t,n){},"8c12":function(e,t,n){e.exports=n.p+"img/Contessa.0f057f6e.png"},"91ab":function(e,t,n){"use strict";var o=n("c1cf"),a=n.n(o);a.a},9455:function(e,t,n){e.exports=n.p+"img/Assassin.2bfd2098.png"},"976e":function(e,t,n){e.exports=n.p+"media/yoink.0a6cc059.mp3"},"9f31":function(e,t,n){e.exports=n.p+"media/omg1.3ceeb1f5.mp3"},a651:function(e,t,n){"use strict";var o=n("114d"),a=n.n(o);a.a},a6f5:function(e,t,n){},bdee:function(e,t,n){e.exports=n.p+"img/rules.3c07b809.png"},c1cf:function(e,t,n){},c530:function(e,t,n){e.exports=n.p+"img/Captain.37583f35.jpg"},cc37:function(e,t,n){e.exports=n.p+"img/Ambassador.f239fc0d.jpg"},d12b:function(e,t){e.exports="data:audio/mpeg;base64,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"},d433:function(e,t,n){e.exports=n.p+"media/bruh.eb7507d6.mp3"},e3e1:function(e,t,n){"use strict";var o=n("25ba"),a=n.n(o);a.a},f038:function(e,t,n){},f911:function(e,t,n){e.exports=n.p+"media/omg2.3dbde656.mp3"},fbf4:function(e,t,n){"use strict";var o=n("a6f5"),a=n.n(o);a.a}});
//# sourceMappingURL=app.948da4b9.js.map