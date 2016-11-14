function Mic(location,typeNum){
	var params={};
	switch(typeNum){//音符数字所表示的类型
		case 0:
		params={
			value:10,
			type:"blue",
			speed:json["LEVEL"]
		};
		break;
		case 1:
		params={
			value:20,
			type:"blue",
			speed:json["LEVEL"]
		};
		break;
		case 3:
		params={
			value:15,
			type:"blue",
			speed:json["LEVEL"]
		};
		break;
		case 4:
		params={
			value:25,
			type:"blue",
			speed:json["LEVEL"]
		};
		break;
		default:
		params={
		    value:10,
			type:"blue",
			speed:json["LEVEL"]
	    };
		
	}
	base(this,LSprite,[]);
	var self=this;
	self.mode="score";
	self.id="";
	self.x=location;
	self.y=height/2;
	self.value=params.value;//自带属性分数
	self.type=params.type;
	self.speed=params.speed;
	this.init(typeNum);
}
Mic.prototype.init=function(typeNum){
	var self=this;
	var list = LGlobal.divideCoordinate(825,110,2,15);
	var data =new LBitmapData(imgList["notes"],0,0,57,57);
	// data.x=-data.getWidth()/2;	
	// data.y=-data.getHeight()/2;	
	var Bullets = new LAnimationTimeline(data,[ 
		[list[0][1],list[1][1]],
		[list[0][2],list[1][2]],
		[list[0][3],list[1][3]],
		[list[0][4],list[1][4]],
		[list[0][5],list[1][5]],
		[list[0][6],list[1][6]],
		[list[0][7],list[1][7]],
		[list[0][8],list[1][8]],
		[list[0][9],list[1][9]],
		[list[0][10],list[1][10]],
		[list[0][11],list[1][11]]
		]);
	Bullets.setAction(typeNum);
	Bullets.speed = 3;
	Bullets.x=-Bullets.getWidth()/2;
	Bullets.y=-Bullets.getHeight()/2;
	self.addChild(Bullets);
	self.addEventListener(LEvent.ENTER_FRAME,self.run);
}
Mic.prototype.run=function(event){
	var self=event.target;
	self.x +=self.speed;
	if(self.x>(width+50)){
		self.parent.removeChild(self);
		
	 }else{
	 	if(self.x>(width-130)&&self.x<(width-70)&&self.mode=="score"&&trigger==true){//逻辑可能有问题  
			self.mode="die";
			Miss="good";
			trigger=false;
			LTweenLite.to(self,1.2,{x:170,y:70,ease:LEasing.Quint.easeOut,onComplete:self.onCoincomplete});	
			
	   }
	 	if(self.x>(width-70)&&self.mode=="score"){
	 	
	 		score=score>0?score-5:0;
	 		Miss="Miss";
	 		self.mode='die';
	 	}
	 	if(self.x>width){
	 		Miss='';
	 	}
   }
	
}
Mic.prototype.onCoincomplete=function(event){
	var self = event.target;
	score+=self.value;
	self.parent.removeChild(self);
}