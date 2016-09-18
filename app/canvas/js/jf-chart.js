/****************
	统计图
****************/
function fChart(ele,options){
	this.ele=ele;
	this.options={
		colors:null,
		percents:null,
		x:110,
		y:110,
		radius:100,
		textPos:75,
		font:"14px Arial",
		minPercent:8,
		translate:5,
		scale:1,
		rotateSpend:1,
		translateSpend:1
	}	
	for(i in options){
		this.options[i]=options[i];	
	}
	this.init();
	this.animate();
	this.events();
}
//所占真实比例计算
fChart.prototype.percentFn=function(arr){
	var minAll=0,minLen=0;
	var bool=false;
	for(i in arr){
		if(arr[i]<this.options.minPercent){
			minLen++;
			minAll+=(this.options.minPercent-arr[i]);
			arr[i]=this.options.minPercent;
			bool=true;
		}else if(arr[i]==this.options.minPercent){
			minLen++;
		}
	}
	
	if(!bool){return}
	
	var diff=minAll/(this.options.len-minLen);
	for(i in arr){
		if(arr[i]>this.options.minPercent){
			arr[i]-=diff;
		}
	}
	this.percentFn(arr);
}
//初始化
fChart.prototype.init=function(){
	this.options.len=this.options.percents.length;
	this.options.realPercents=[];  //真实百分比
	for(i in this.options.percents){
		this.options.realPercents[i]=this.options.percents[i];	
	}
	this.percentFn(this.options.realPercents);
	this.options.percentDegs=[]; //扇形角度
	this.options.transform=[]; ////旋转角度，偏移
	
	var degs=0;
	for(var i=0;i<this.options.len;i++){
		var deg=360*this.options.realPercents[i]/100;
		this.options.percentDegs.push(deg); 
		if(i==0){
			this.options.transform.push([0,0]);  //旋转角度，偏移
		}else{
			var previousDeg=360*this.options.realPercents[i-1]/100
			degs+=previousDeg/2+deg/2;
			this.options.transform.push([degs,0]);
		}
	}
	if(this.options.index!==undefined){
		this.options.transform[this.options.index][1]=this.options.translate;
		var deg=this.options.transform[this.options.index][0];
		var diffDeg;
		if(Math.abs(90-deg)>=Math.abs(450-deg)){
			diffDeg=450-deg;
		}else{
			diffDeg=90-deg;
		}
		for(var j=0;j<this.options.len;j++){
			this.options.transform[j][0]+=diffDeg;
		}
	}
	
	//初始化画图
	this.cobj=f(this.ele);
	var canvas=f(this.ele)[0];
	this.w=canvas.width;
	this.h=canvas.height;
	canvas.style.width=this.w*this.options.scale+"px";
	canvas.style.height=this.h*this.options.scale+"px";
	this.cobj.getContext2D();
	this.cobj.clearRect();
	
	for(var i=0;i<this.options.len;i++){
		this.draw(i);
	}
	
}
//画图
fChart.prototype.draw=function(i){
	this.cobj.save();
	this.cobj.translate(this.options.x,this.options.y);
	/*文字*/
	this.cobj.save();
	this.cobj.rotate(this.options.transform[i][0]);
	this.cobj.translate(this.options.textPos+this.options.transform[i][1],0);
	this.cobj.rotate(-this.options.transform[i][0]);
	this.cobj.text([this.options.percents[i]+"%",0,0],{color:{color:"#fff"},prop:{font:this.options.font,textBaseline:"middle",textAlign:"center"}});
	this.cobj.restore();	
	
	/*扇形图*/
	this.cobj.mixImage('destination-over');
	var arcDeg=this.options.percentDegs[i]/2;
	this.cobj.save();
	this.cobj.rotate(this.options.transform[i][0]);
	this.cobj.line([[this.options.transform[i][1],0]]);
	this.cobj.arc([this.options.transform[i][1],0,this.options.radius,-arcDeg,arcDeg,false],{color:{color:this.options.colors[i]},beginPath:false});
	this.cobj.restore();
	
	this.cobj.restore();
}
//动画
fChart.prototype.animate=function(){	
	var imgdata=this.cobj.getImage();
	var deg=this.options.percentDegs[0]/2;
	var startDeg=-deg;
	var that=this;
	new StopWatch({
		isRunning:true, //初始化是否执行
		fn:function(time,ftp){
			that.cobj.save();
			that.cobj.putImage(imgdata,0,0);
			startDeg+=20;
			if(startDeg>=360-deg){
				startDeg=360-deg;
				this.stop();
			}
			that.cobj.line([[that.options.x,that.options.y]]);
			that.cobj.arc([that.options.x,that.options.y,that.options.radius+5,startDeg,360-deg,false],{type:"",beginPath:false});
			that.cobj.clip();
			that.cobj.clearRect();
			that.cobj.restore();
		}	
	});	
}
//事件
fChart.prototype.events=function(){
	//判断是pc端还是移动端
	var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
		hasTouch = 'ontouchstart' in window && !isTouchPad,
		CLICK_EV = hasTouch ? 'touchend' : 'click';
	var cobj=this.cobj;
	var that=this;
	
	function endfn(event){
		var box = this.getBoundingClientRect();
		var startPos = {
			top:box.top + window.pageYOffset,
			left:box.left + window.pageXOffset
		};
		var touch = hasTouch ? event.changedTouches[0] : event;
		var x=touch.pageX - startPos.left;
		var y=touch.pageY - startPos.top;
		var first=false; //整个在旋转，下面会执行多次
		
		cobj.clearRect();
		for(var i=0;i<that.options.len;i++){
			that.draw(i);
			if(!first && f(this).cobj().isPointInPath(x/that.options.scale,y/that.options.scale)){
				for(var j=0;j<that.options.len;j++){
					that.options.transform[j][1]=0;
				}
				document.querySelector(that.ele).removeEventListener(CLICK_EV,endfn,false);
				first=true;
				if(typeof that.options.fn=="function"){
					that.options.fn.call(that,i);
				}
				ratoteAnimate(i);
			}
		}
	}
	document.querySelector(that.ele).addEventListener(CLICK_EV,endfn,false);
	
	//旋转动画
	function ratoteAnimate(i){
		var deg=that.options.transform[i][0]%360;
		var diffDeg;
		if(deg>=0){
			if(Math.abs(90-deg)>=Math.abs(450-deg)){
				diffDeg=450-deg;
			}else{
				diffDeg=90-deg;
			}
		}else{
			if(Math.abs(90-deg)>=Math.abs(-270-deg)){
				diffDeg=-270-deg;
			}else{
				diffDeg=90-deg;
			}
		}
		var spend=diffDeg>0?that.options.rotateSpend:-that.options.rotateSpend;
		var oldchartArr=[];
		for(key in that.options.transform){
			oldchartArr.push(that.options.transform[key][0]);	
		}
		
		new StopWatch({
			isRunning:true, //初始化是否执行
			fn:function(time,ftp){
				spend+=spend;
				if(Math.abs(spend)>=Math.abs(diffDeg)){
					spend=diffDeg;
					this.stop();
					transAnimate(i);
				}
				for(var j=0;j<that.options.len;j++){
					that.options.transform[j][0]=oldchartArr[j]+spend;
					
				}
				
				cobj.clearRect();
				for(var k=0;k<that.options.len;k++){
					that.draw(k);
				}
			}	
		});
	}
	
	//下移动画
	function transAnimate(i){
		var spend=0;
		new StopWatch({
			isRunning:true, //初始化是否执行
			fn:function(time,ftp){
				spend+=that.options.translateSpend;
				if(spend>=that.options.translate){
					spend=that.options.translate;
					this.stop();
					document.querySelector(that.ele).addEventListener(CLICK_EV,endfn,false);
					if(typeof that.options.animatedFn=="function"){
						that.options.animatedFn.call(that,i);
					}
				}
				that.options.transform[i][1]=spend;
				
				cobj.clearRect();
				for(var k=0;k<that.options.len;k++){
					that.draw(k);
				}
			}	
		});
	}
}