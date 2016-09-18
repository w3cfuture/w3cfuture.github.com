/****************
	图片切换
****************/
function ImgChange(ele,options){
	this.ele=ele;
	this.options={
		autoplay:true,
		animate:true,
		resize:false,
		time:5000
	}
	for(var i in options){
		this.options[i]=options[i];
	}
	
	if($(this.ele).find(".imgs .li").length<=1){  //图片数量1张或更少时
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
	this.options.width=$(this.ele).find(".imgBox").width();
	if(this.options.indexLi===undefined){
		var content_dot="";
		$(this.ele).find(".imgs .li").each(function(){
			content_dot+="<li></li>";	
		});
		$(this.ele).find(".imgDot").append(content_dot);
		this.options.indexLi=$(this.ele).find(".imgDot li");
	}
	
	var content=$(this.ele).find(".imgs").html();
	$(this.ele).find(".imgs").append(content);
	
	this.options.count=$(this.ele).find(".imgs .li").length;
	$(this.ele).find(".imgs .li").width(this.options.width);
	$(this.ele).find(".imgs").width(this.options.width*this.options.count);
	
	this.options.index=this.options.index?this.options.index:this.options.count/2;
	this.styleFn(false);
}
/***样式***/
ImgChange.prototype.styleFn=function(animate){
	animate=(animate===false)?false:this.options.animate;
	if(animate){
		$(this.ele).find(".imgs").stop().animate({"left":-this.options.index*this.options.width},1000);
	}else{
		$(this.ele).find(".imgs").css("left",-this.options.index*this.options.width);
	}
	
	$(this.ele).find(".imgs .li").removeClass("selected");
	$(this.ele).find(".imgs .li").eq(this.options.index).addClass("selected");
	$(this.options.indexLi).removeClass("selected");
	$(this.options.indexLi).eq(this.options.index%(this.options.count/2)).addClass("selected");
	
}
/***动画播放***/
ImgChange.prototype.play=function(){
	var that=this;
	that.options.timerFn=function(){
		if(that.options.index==that.options.count-1){
			that.options.index=that.options.count/2-1;
			$(that.ele).find(".imgs").css("left",-that.options.index*that.options.width);	
		}
		that.options.index+=1;
		that.styleFn();
	}
	that.options.timer=setInterval(that.options.timerFn,that.options.time);
	$(that.ele).find(".imgRight,.imgLeft").mouseenter(function(){
		clearInterval(that.options.timer);
	}).mouseleave(function(){
		that.options.timer=setInterval(that.options.timerFn,that.options.time);
	});
	$(this.options.indexLi).mouseenter(function(){
		clearInterval(that.options.timer);
	}).mouseleave(function(){
		that.options.timer=setInterval(that.options.timerFn,that.options.time);
	});
}
/***事件***/
ImgChange.prototype.events=function(){
	var that=this;
	$(this.options.indexLi).click(function(){
		if(that.options.index>=that.options.count/2){
			that.options.index-=that.options.count/2;
			$(that.ele).find(".imgs").css("left",-that.options.index*that.options.width);	
		}
		that.options.index=$(this).index();
		that.styleFn();
	});
	$(that.ele).find(".imgRight").click(function(){
		if(that.options.index==that.options.count-1){
			that.options.index=that.options.count/2-1;
			$(that.ele).find(".imgs").css("left",-that.options.index*that.options.width);	
		}
		that.options.index+=1;
		that.styleFn();
	});
	$(that.ele).find(".imgLeft").click(function(){
		if(that.options.index==0){
			that.options.index=that.options.count/2;
			$(that.ele).find(".imgs").css("left",-that.options.index*that.options.width);	
		}
		that.options.index-=1;
		that.styleFn();
	});
}
/**窗口大小改变**/
ImgChange.prototype.resize=function(){
	var that=this;
	$(window).resize(function(){
		that.options.width=$(that.ele).find(".imgBox").width();
		$(that.ele).find(".imgs .li").width(that.options.width);
		$(that.ele).find(".imgs").width(that.options.width*that.options.count);
		that.styleFn(false);
	});
}

$.fn.extend({
	imgChange:function(options){
		 return new ImgChange(this[0],options);
	}
})