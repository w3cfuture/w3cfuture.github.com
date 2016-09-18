// JavaScript Document	
//window动画属性
window.requestAnimationFrame=window.requestAnimationFrame||
	window.webkitRequestAnimationFrame||
	window.mozRequestAnimationFrame||
	window.msRequestAnimationFrame||
	function(callback){
		var self=this,start,finish;
		window.setTimeout(
		function(){
		 start=+new Date();
		 callback();
		 finish=+new Date();
		 seljf.timeout=1000/60-(finish-start);
		},seljf.timeout); 
	}

/****************
	浮动
****************/
function FloatObj(ele,options){
	this.ele=ele;
	this.options={
		minX:0,
		maxX:$(window).width()-$(this.ele).outerWidth(),
		minY:0,
		maxY:$(window).height()-$(this.ele).outerHeight(),
		speedX:2,
		speedY:2,
		animate:true
	}
	this.options.nowX=Math.floor(this.options.minX+Math.random()*(this.options.maxX-this.options.minX+1));
	this.options.nowY=Math.floor(this.options.minY+Math.random()*(this.options.maxY-this.options.minY+1));
	for(k in options){
		this.options[k]=options[k];
	}
	
	$(this.ele).css({top:this.options.nowY,left:this.options.nowX,display:"block"});
	this.animate();	
	this.events();
	this.resize();
}
// 刷新
FloatObj.prototype.refresh=function() {
	this.options.maxX=$(window).width()-$(this.ele).outerWidth();
	this.options.maxY=$(window).height()-$(this.ele).outerHeight();
	return this;
}

// 样式
FloatObj.prototype.style=function() {
	if(this.options.nowX<=0){
		this.options.speedX=this.options.speedX<0?-this.options.speedX:this.options.speedX;
	}else if(this.options.nowX>=this.options.maxX){
		this.options.speedX=this.options.speedX>0?-this.options.speedX:this.options.speedX;
	}
	if(this.options.nowY<=0){
		this.options.speedY=this.options.speedY<0?-this.options.speedY:this.options.speedY;
	}else if(this.options.nowY>=this.options.maxY){
		this.options.speedY=this.options.speedY>0?-this.options.speedY:this.options.speedY;
	}
	this.options.nowX=this.options.nowX+this.options.speedX;
	this.options.nowY=this.options.nowY+this.options.speedY;
	$(this.ele).css({top:this.options.nowY,left:this.options.nowX});
	return this;
}

// 动画
FloatObj.prototype.animate=function() {
	var that=this;
	that.options.animate=true;
	function animate(){
		if(that.options.animate){
			that.style();
			requestAnimationFrame(animate);
		}
	};
	requestAnimationFrame(animate);
	return this;
}

// 停止动画
FloatObj.prototype.stop=function() {
	this.options.animate=false;
}

// 绑定鼠标事件
FloatObj.prototype.events=function() {
	var that=this;
	$(this.ele).mouseenter(function(){
		that.stop();
	}).mouseleave(function(){
		that.animate();
	});
}

// 浏览器窗口大小变换
FloatObj.prototype.resize=function() {
	var that=this;
	$(window).resize(function() {
		that.refresh();	
	});
	return this;
}