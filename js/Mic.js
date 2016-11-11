function Mic(location,typeNum){
	var params={};
	if(typeNum=1){//音符数字所表示的类型
		params={
			value:10,
			type:"blue",
			speed:json["LEVEL"]
		}
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
	this.init();
}
Mic.prototype.init=function(){
	var self=this;
	var bitmap = new LBitmap(new LBitmapData(imgList["notes"],57,0,57,57));
	bitmap.x=-bitmap.getWidth()/2;	
	bitmap.y=-bitmap.getHeight()/2;	
	self.addChild(bitmap);
	
	self.addEventListener(LEvent.ENTER_FRAME,self.run);
}
Mic.prototype.run=function(event){
	var self=event.target;
	self.x +=self.speed;
	if(self.x>(width+50)){
		self.parent.removeChild(self);
		
	 }else{
	 	if(self.x>(width-130)&&self.x<(width-100)&&self.mode=="score"&&trigger==true){//逻辑可能有问题
	 		score+=self.value;   
			self.mode="die";
			Miss="good";
			trigger=false;
			
			
//			if(Math.abs(width-110-self.x)<40){
//				console.log(1);
//				Miss="perfect";
//			}
//			if(20<Math.abs(width-110-self.x)<30){
//				Miss="good";
//			}
//			if(30<Math.abs(width-110-self.x)<40){
//				Miss="";
//			}
			
//		    self.bitmap= new LBitmap(new LBitmapData(imgList["mic"]));//根据类型改变皮肤
	   }
	 	if(self.x>(width-90)&&self.mode=="score"){
	 	
	 		score=score>0?score-5:0;
	 		Miss="Miss";
	 		self.mode='die';
	 	}
	 	if(self.x>width){
	 		Miss='';
	 	}
   }
	
}
