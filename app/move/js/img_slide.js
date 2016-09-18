/****************
	图片切换
****************/
function ImgChange(ele,options){
	this.ele=ele;
	this.options={
		autoplay:true,
		animate:true,
		time:5000,
		resize:false,
		useCapture:true
	}
	for(var i in options){
		this.options[i]=options[i];
	}
	
	if(this.ele.querySelectorAll(".imgs .li").length<=1){  //图片数量1张或更少时
		return;
	}
	this.init();
	if(this.options.autoplay){
		this.play();
	}
	if(this.options.resize){
		this.resize();
	}
	
	this.events();
}
/***初始化***/
ImgChange.prototype.init=function(){
	this.options.width=this.ele.querySelector(".imgBox").offsetWidth;
	
	if(this.options.indexLi===undefined){
		var content_dot="";
		for(var i=0,len=this.ele.querySelectorAll(".imgs .li").length;i<len;i++){
			content_dot+="<li></li>";
		}
		this.ele.querySelector(".imgDot").appendChild(f.buildFragment(content_dot));
		this.options.indexLi=this.ele.querySelectorAll(".imgDot li");
	}
	
	var content=this.ele.querySelector(".imgs").innerHTML;
	this.ele.querySelector(".imgs").appendChild(f.buildFragment(content));
	
	this.options.count=this.ele.querySelectorAll(".imgs .li").length;
	f(this.ele.querySelectorAll(".imgs .li")).css("width",this.options.width+"px");
	f(this.ele.querySelector(".imgs")).css("width",this.options.width*this.options.count+"px");
	
	this.options.index=this.options.index?this.options.index:this.options.count/2;
	this.styleFn(false);
}
/***样式***/
ImgChange.prototype.styleFn=function(animate){
	animate=(animate===false)?false:this.options.animate;
	if(animate){
		f(this.ele.querySelector(".imgs")).css("transition","all 1s");
		f(this.ele.querySelector(".imgs")).css("transform","translate("+(-this.options.index)*this.options.width+"px,0px) translateZ(0px)");
	}else{
		f(this.ele.querySelector(".imgs")).css("transition","all 0s");
		f(this.ele.querySelector(".imgs")).css("transform","translate("+(-this.options.index)*this.options.width+"px,0px) translateZ(0px)");
	}
	
	f(this.options.indexLi).removeClass("selected");
	f(f(this.options.indexLi)[this.options.index%(this.options.count/2)]).addClass("selected");
	
}
/***动画***/
ImgChange.prototype.play=function(){
	var that=this;
	that.options.timerFn=function(){
		if(!that.options.autoplay){
			clearInterval(that.options.timer);
			return;
		} 
		that.options.index+=1;
		that.styleFn();
		if(that.options.index==that.options.count-1){
			that.options.index=that.options.count/2-1;
			var transitionend="ontransitionend" in window?'transitionend':'onwebkittransitionend';
			function _transitionend(){
				that.styleFn(false);
				that.ele.querySelector(".imgs").removeEventListener(transitionend,_transitionend,false);
			}
			that.ele.querySelector(".imgs").addEventListener(transitionend,_transitionend,false);
		}
	}
	that.options.timer=setInterval(that.options.timerFn,that.options.time);
}
/***事件***/
ImgChange.prototype.events=function(){
	var that=this;
	f(that.ele.querySelector(".imgs")).move({
		useCapture:that.options.useCapture,
		startFn:function(obj){
			clearInterval(that.options.timer);
			f(this.ele).css("transition","all 0s");
		},
		moveFn:function(obj,isScrolling){
			if(isScrolling === 0){
				obj.events.preventDefault();
				f(this.ele).css("transform","translate("+(obj.startPointX+obj.x)+"px,0px) translateZ(0px)");
			}
		},
		endFn:function(obj,isScrolling){
			var x=obj.translateX-(-that.options.index)*that.options.width;
			if(x < -50){
				that.options.index+=1;
				if(that.options.index==that.options.count-1){
					that.options.index=that.options.count/2-1;
				}
			}else if(x > 50){
				that.options.index-=1;
				if(that.options.index==0){
					that.options.index=that.options.count/2;
				}
			}
			that.styleFn(false);
			that.options.timer=setInterval(that.options.timerFn,that.options.time);
		},
	});
}
/**窗口大小改变**/
ImgChange.prototype.resize=function(){
	var that=this;
	window.onresize=function(){
		that.options.width=that.ele.querySelector(".imgBox").offsetWidth;
		f(that.ele.querySelectorAll(".imgs .li")).css("width",that.options.width+"px");
		f(that.ele.querySelector(".imgs")).css("width",that.options.width*that.options.count+"px");
		that.styleFn(false);
	}
}

jf.fn.extend({
	imgChange:function(options){
		return new ImgChange(this[0],options);
	}
});
	