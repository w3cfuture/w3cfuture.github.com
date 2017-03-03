// JavaScript Document
jQuery.fn.extend({
	//拖拽
	drag:function(options){
		return new Drag(this[0],options);
	}
});


/******************
	拖动事件
******************/
function Drag(ele,options){
	this.ele=ele;
	this.options={
		boundary:true
	};
	for(var i in options){
		this.options[i]=options[i];
	}
	this.events();
}

//绑定事件
Drag.prototype.events=function(){
	//阻止默认事件
	function preventDefault(event){
		event.preventDefault();
	}
	
	var that=this;
	//开始
	function _start(event){
		if(that.start(event)){
			$(document).mousemove(_move);
			$(document).mouseup(_end);
			$(document).mousemove(preventDefault);
		};
	}
	//滑动
	function _move(event){
		that.move(event);
	}
	//结束
	function _end(event){
		$(document).unbind("mousemove",_move);
		$(document).unbind("mouseup",_end);
		$(document).unbind("mousemove",preventDefault);
		that.end(event);
	}
	
	$(that.ele).mousedown(_start);
}

//开始
Drag.prototype.start=function(event){
	this.options.diffX = event.pageX - this.ele.offsetLeft;
	this.options.diffY = event.pageY - this.ele.offsetTop;
	//自定义拖拽区域
	var flag = false;
	if(!this.options.dragEle){
		flag = true;
	}else{
		var parent = event.target;
		while ( parent && parent.nodeType !== 9) {
			if ( parent.nodeType === 1 ) {
				if (parent == this.options.dragEle) {
					flag = true;
					break;
				}
			}
			parent = parent.parentNode;
		}
	}
	if(flag && this.options.startFn){
		this.options.startFn.call(this,event);
	}
	return flag;
}

//移动
Drag.prototype.move=function(event){
	this.ele.style.position='absolute';
	this.ele.style.margin='0';
	this.options.left = event.pageX - this.options.diffX;
	this.options.top = event.pageY - this.options.diffY;
	
	if(this.options.boundary){
		var minX=(typeof this.options.minX==="undefined")?$(window).scrollLeft():this.options.minX;
		var maxX=(typeof this.options.maxX==="undefined")?$(window).innerWidth()+$(window).scrollLeft():this.options.maxX;
		var minY=(typeof this.options.minY==="undefined")?$(window).scrollTop():this.options.minY;
		var maxY=(typeof this.options.maxY==="undefined")?$(window).innerHeight()+$(window).scrollTop():this.options.maxY;
		
		if (this.options.left < minX) {
			this.options.left = minX;
		}else if(this.options.left > maxX-$(this.ele).outerWidth()) {
			this.options.left = maxX-$(this.ele).outerWidth();
		}
	
		if (this.options.top < minY) {
			this.options.top = minY;
		}else if(this.options.top > maxY  - $(this.ele).outerHeight()) {
			this.options.top = maxY  - $(this.ele).outerHeight();
		}
	}

	this.ele.style.left = this.options.left + 'px';
	this.ele.style.top = this.options.top + 'px';
	
	if(this.options.moveFn){
		this.options.moveFn.call(this,event);
	}
}

//结束
Drag.prototype.end=function(event){
	if(this.options.endFn){
		this.options.endFn.call(this,event);
	}
}
