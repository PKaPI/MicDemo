init(40,"mylegend",640,960,loading);
var loadingLayer,startLayer,backLayer,micLayer,playLayer,resultLayer,flashLayer,shareLayer;
var width,height;
var bitmapData,bitmap;
var replayBtn;
var countdown;//开始倒计时
var intervalId,intervalMic;//定时器
var statusTxt,scoreTxt,tipsTxt;//文字显示
var countItem=1;
var hero;//英雄
var score,timeNum;//分数，倒计时时间
var Miss="";
var trigger=false;//记录触发状态
var MicNum;//记录音符滑块类型
var isNoTime=false;//时间用尽判断
var imgData=new Array(
   	{name:"playBtn",path:'img/playBtn.png'},
   	{name:"ruleBtn",path:'img/ruleBtn.png'},
   	{name:"ruleInfo",path:'img/ruleInfo.jpg'},
   	{name:"backBtn",path:'img/backBtn.png'},
   	{name:"replayBtn",path:'img/replayBtn.png'},
   	{name:"notes",path:'img/notes.png'},
   	{name:"explosion_upper",path:'img/explosion_upper.png'},
   	{name:"explosion_lower",path:'img/explosion_lower.png'}
   	 	
);
// 出现音符的 数量、 类型、分数、速度
var MicArray=new Array(
	{count:1,type:'blue',value:5,speed:5},
	{count:2,type:'blue',value:10,speed:5},
	{count:3,type:'blue',value:15,speed:5},
	{count:3,type:'blue',value:20,speed:5},
	{count:3,type:'blue',value:25,speed:5} 
);//初始化音符属性数组     //游戏频率问题最多加三个音符

var json={
	"TITLE":"演示音樂",
	"WAVE":"test.ogg",
	"OFFSET":-0.4017,
	"SONGVOL":80,

	"COURSE":3,
	"LEVEL":7,
	"MicAtr":[
	"000000000",
	"0",
	"0",
	"0",
	"3",
	"0",
	"0",
	"40040040",
	"40040040",
	"4444",
	"4444",
	"4444",
	"4444",
	"4444",
	"4444",
	"300030003",
	"10021020",
	"1002102010",
	"100210200",
	"100210200",
	"1002102020",
	"100210200",
	"1002102",
	"400400400",
	"100210200",
	"10021020120",
	"100210201200",
	"10021020120",
	"10021020120",
	"100210201020",
	"1002102020",
	"1002102020",
	"11111111",
	"11111111",
	"1111111111110",
	"4",
	"0",
	"0",
	"0",
	"0"
	]
}
console.log(json["MicAtr"]);
var isStart=false;//判断开始
var imgList={};
function loading(){

	width=LGlobal.width;
	height=LGlobal.height;
	startLayer=new LSprite();
	addChild(startLayer);

    loadingLayer=new LoadingSample3(40);
    startLayer.addChild(loadingLayer);
    LLoadManage.load(
    	imgData,
    	function(progress){
    		loadingLayer.setProgress(progress);
    	},
    	main
    )
}
function main(results){
	imgList=results;
	startLayer.removeChild(loadingLayer);
	loadingLayer=null;
	
    startLayer.graphics.drawRect(1,"#000000",[0,0,640,960],true,"pink");
//	bitmapData = new LBitmapData(imgList["startBg"]);
//  bitmap = new LBitmap(bitmapData);
	
	playBtn=new LButton(new LBitmap(new LBitmapData(imgList["playBtn"])),new LBitmap(new LBitmapData(imgList["playBtn"])));
    playBtn.x=(width-playBtn.getWidth())/2;
    playBtn.y=350;
    startLayer.addChild(playBtn);
    playBtn.addEventListener(LMouseEvent.MOUSE_UP,onPlayHandler);
    
    ruleBtn = new LButton(new LBitmap(new LBitmapData(imgList["ruleBtn"])),new LBitmap(new LBitmapData(imgList["ruleBtn"])));
	ruleBtn.x = (width - ruleBtn.getWidth())/2;
	ruleBtn.y = height/2;
	startLayer.addChild(ruleBtn);
    ruleBtn.addEventListener(LMouseEvent.MOUSE_DOWN,onruleHandler);
}
function onPlayHandler(){
	playBtn.removeEventListener(LMouseEvent.MOUSE_UP,onPlayHandler);
	ruleBtn.removeEventListener(LMouseEvent.MOUSE_DOWN,onruleHandler);
	startLayer.removeAllChild();
	startLayer.die();
	
	gameInit();//游戏初始化
}
function onruleHandler(){ //添加遮罩层
	shareLayer = new LSprite();
	addChild(shareLayer);
    bitmap = new LBitmap(new LBitmapData(imgList["ruleInfo"]));
    shareLayer.addChild(bitmap);
	//返回按钮
	backBtn = new LButton(new LBitmap(new LBitmapData(imgList["backBtn"])),new LBitmap(new LBitmapData(imgList["backBtn"])));
	backBtn.x = (width-backBtn.getWidth())/2;
	backBtn.y = 2*height/3;	
	shareLayer.addChild(backBtn);
	
	backBtn.addEventListener(LMouseEvent.MOUSE_DOWN, onBackHandler);
}
function onBackHandler(){//移除规则层
	shareLayer.die();
	removeChild(shareLayer);
}
function gameInit(){  //游戏初始化
	 score=0;    //分数
	 countdown=3;//准备时间
	 timeNum=60;//游戏时间
	
	backLayer=new LSprite();
	addChild(backLayer);
	
    backLayer.graphics.drawRect(1,"#000000",[0,0,640,960],true,"#222");
    
    resultLayer=new LSprite();//结果
    addChild(resultLayer);
    
    
    
    micLayer=new LSprite();//滑块
    addChild(micLayer);
    
    playLayer=new LSprite();//玩家
    addChild(playLayer);
    hero=new Hero();
    playLayer.addChild(hero);
    hero.changeAction();
    
    flashLayer=new LSprite();//道具层
    addChild(flashLayer);
    
    playLayer.graphics.drawRect(1,"#f40",[0,880,640,960],true,"#cccccc");
    playLayer.addEventListener(LMouseEvent.MOUSE_DOWN,mouseDown);
    playLayer.addEventListener(LMouseEvent.MOUSE_UP,mouseUp);
    
    scoreTxt = new LTextField();//分数文字显示
	scoreTxt.color = "yellow";
	scoreTxt.font = "Microsoft Yahei";
	scoreTxt.size = 24;
	scoreTxt.text="分数："+score;	
	scoreTxt.x = 60;
	scoreTxt.y = 42;
	resultLayer.addChild(scoreTxt);	
	
	statusTxt = new LTextField();//状态文字显示
	statusTxt.color = "red";
	statusTxt.font = "Microsoft Yahei";
	statusTxt.size = 25;
	statusTxt.x =(width-statusTxt.getWidth())/2;
	statusTxt.y = 160;
	resultLayer.addChild(statusTxt);
    
    timeTxt = new LTextField();//时间文字显示
	timeTxt.color = "#ffffff";
	timeTxt.font = "Microsoft Yahei";
	timeTxt.size = 18;
	timeTxt.text="剩余时间："+timeNum+"秒";	
	timeTxt.x = 60;
	timeTxt.y = 110;
	resultLayer.addChild(timeTxt);

    setTimeout(function(){
    	intervalMic=setInterval(timeLife,1000);
		
    },1000);
    
	backLayer.addEventListener(LEvent.ENTER_FRAME,onframe);
}
function onframe(){//运动刷新
	hero.onframe();
	statusTxt.text=countdown;
	statusTxt.size=50;
	statusTxt.color='red';
	timeTxt.text=timeTxt.text="剩余时间："+timeNum+" 秒";
	if(isStart){
		addMic();
		isStart=false;
	}
	if(countdown<=0) {
		statusTxt.text="go";
	    statusTxt.color='yellow';
		if(countdown<0) {
			statusTxt.text=Miss;
		}
	}
	    scoreTxt.text="得分："+score;
		if(timeNum==0){
			gameOver();
	    }	

}
function timeCount() {  
	if(timeNum>0){
		timeNum-=1;
		if(timeNum==30){ //
	    	for(var i=0;i<micLayer.childList.length;i++){
	    	  micLayer.childList[i].speed=15;	
	    	}
	    }
	}else{
		if(intervalId){
			clearInterval(intervalId);
		}
	}
}
function timeLife(){ //开场前倒计时秒数
	if(countdown>=0){
			countdown-=1;
		}else{
			isStart=true;
			if(intervalMic){
			 clearInterval(intervalMic);
			 intervalId=setInterval(timeCount,1000);
		    }
			 
		}
}
function gameOver() {
	backLayer.removeEventListener(LEvent.ENTER_FRAME,onframe);
	micLayer.removeAllChild();
    removeChild(micLayer);	
	
	playLayer.removeAllChild();
	playLayer.removeEventListener(LMouseEvent.MOUSE_DOWN,mouseDown);
    playLayer.removeEventListener(LMouseEvent.MOUSE_UP,mouseUp);
    removeChild(playLayer);	
	
	flashLayer.removeAllChild();
    removeChild(flashLayer);		
		
	resultLayer.removeAllChild();		
    //清除以上事件与元素
	tipsTxt = new LTextField();
	tipsTxt.color = "#de5e06";
	tipsTxt.font = "Microsoft Yahei";
	tipsTxt.size = 40;
	tipsTxt.x = 120;
	tipsTxt.y = 380;
	tipsTxt.text="恭喜，你获得 "+score+" 分";		
	tipsTxt.textAlign="left";	
	resultLayer.addChild(tipsTxt);		
	tipsTxt.x = (width-tipsTxt.getWidth())/2;
			
	replayBtn = new LButton(new LBitmap(new LBitmapData(imgList["replayBtn"])),new LBitmap(new LBitmapData(imgList["replayBtn"])));
	replayBtn.x = (width-replayBtn.getWidth())/2;
	replayBtn.y = -100;	
	resultLayer.addChild(replayBtn);
	
	replayBtn.addEventListener(LMouseEvent.MOUSE_DOWN, onReplayHandler);
	LTweenLite.to(replayBtn,1.2,{x:(width-replayBtn.getWidth())/2,y:2*height/3,ease:LEasing.Quint.easeIn,delay:0.5});
}
function onReplayHandler(){
	resultLayer.die();
	resultLayer.removeAllChild();
	removeChild(resultLayer);
	gameInit();
}
function mouseDown() {
	trigger=true;
	hero.isJump=true;
	hero.moveType="";
	hero.changeAction();
}
function mouseUp() {
	trigger=false;
	hero.isJump=false;
	hero.moveType="right";
	hero.changeAction();//设置英雄运动函数
}
function addMic(){//初始化添加游戏侧边出现滑块的频率
	    var location=0;//音符出现的位置记录
    	for(var i=0;i<json["MicAtr"].length;i++) {
    		location=-width*i //记录
    		var line=new Line(i);
			micLayer.addChild(line);
    	    for(var j=0;j<json["MicAtr"][i].length;j++) {

	    	    location -= width/(json["MicAtr"][i].length+1);
		    	var mic=new Mic(location,parseInt(json["MicAtr"][i].charAt(j)));
		        micLayer.addChild(mic);
		    }	
	    }
}
function Line(inum){
	base(this,LSprite,[]);
	var self=this;
	self.speed=json["LEVEL"];
	self.graphics.drawLine(1,"#ffffff",[-inum*width,height/2-60,-inum*width,height/2+60]);
	self.addEventListener(LEvent.ENTER_FRAME,self.run);
}
Line.prototype.run=function(event){
	var self=event.target;
	self.x +=self.speed;
}
function Hero(){//玩家角色
	base(this,LSprite,[]);
	var self = this;
	var list = LGlobal.divideCoordinate(2890,680,4,17);
	var data = new LBitmapData(imgList["explosion_upper"],0,0,170,170);
	self.anime = new LAnimation(self,data,list);  //怎样修改data
    
	self.scaleX=0.5;
	self.scaleY=0.5;
	self.moveType="right";
	self.isJump=false;
	self.x=width-130;
	self.y=(height-self.getHeight())/2;
}

Hero.prototype.onframe = function (){
	var self = this;
	self.anime.onframe();
};
Hero.prototype.changeAction = function(){
	var self = this;
   if(self.moveType == "right"){
		hero.anime.setAction(2);
	}else if(hero.isJump){
		hero.anime.setAction(1);
	}else{
		hero.anime.setAction(0,0);
	}
}
function Num(){//倒计时处理ui
	base(this,LSprite,[]);
    
}
