// JavaScript Document
jQuery.fn.extend({
	waterfall:function(options){
		return new Waterfall(this[0],options);
	}
});
/****************
	瀑布流
****************/
function Waterfall(ele,options){
	this.ele=ele;
	this.options={
		container:window
	}
	for(k in options){
		this.options[k]=options[k];
	}
	this.refresh();
	this.resize();
	
}

//更新布局
Waterfall.prototype.refresh=function(){
	var h=[],li=$(this.ele).children();
	this.options.width=li[0].offsetWidth;
	this.options.num = Math.floor($(this.options.container).width()/this.options.width);
	this.ele.style.width=this.options.num*this.options.width+"px";
	function getarraykey(s, v) {for(k in s) {if(s[k] == v) {return k;}}}
	
	for(var i = 0;i < li.length;i++) {
		li_H = li[i].offsetHeight;
		if(i < this.options.num) {
			h[i]=li_H;
			li[i].style.top="0px";
			li[i].style.left=this.options.width*i+"px";
		}else{
			min_H =Math.min.apply(null,h) ;
			minKey = getarraykey(h, min_H);
			h[minKey] += li_H ;
			li[i].style.top=min_H+"px";
			li[i].style.left=this.options.width*minKey+"px";
		}
	}
}
// 浏览器窗口大小变换
Waterfall.prototype.resize=function() {
	var that = this;
	$(window).resize(function() {
		var num = Math.floor($(that.options.container).width() / that.options.width);
		if (num && num != that.options.num) {
			that.refresh();	
		}
	});
	return this;
}
