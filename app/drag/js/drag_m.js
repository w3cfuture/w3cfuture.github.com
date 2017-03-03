/******************
	拖动事件
******************/
//判断是pc端还是移动端
var isAndroid = (/android/gi).test(navigator.appVersion),
	isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
	hasTouch = 'ontouchstart' in window && !isTouchPad,
	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup';

function Drag(ele,options){
	//参数
	this.ele=typeof ele==="object"?ele:document.querySelector(ele);
	this.options={
		useCapture:true
	};
	for (i in options) this.options[i] = options[i];
	this.events();
	
}
//滑动开始
Drag.prototype.start=function(event){
	var touch = hasTouch ? event.targetTouches[0] : event;
	if(hasTouch && event.touches.length > 1){
		return false;
		
	}else{
		this.options.diffX = touch.pageX - this.ele.offsetLeft;
		this.options.diffY = touch.pageY - this.ele.offsetTop;
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
}
//移动
Drag.prototype.move=function(event){
	var touch = hasTouch ? event.targetTouches[0] : event;
	
	this.ele.style.position='absolute';
	this.ele.style.margin='0';
	this.options.left = touch.pageX - this.options.diffX;
	this.options.top = touch.pageY - this.options.diffY;
	
	this.ele.style.left = this.options.left + 'px';
	this.ele.style.top = this.options.top + 'px';
	
	if(this.options.moveFn){
		this.options.moveFn.call(this,event);
	}
}
//滑动释放
Drag.prototype.end=function(event){
	if(this.options.endFn){
		this.options.endFn.call(this,event);
	}
}
//事件
Drag.prototype.events=function(){
	//绑定事件
	var that=this;
	//开始
	function _start(event){
		if(that.start(event)){
			document.addEventListener(MOVE_EV,_move,that.options.useCapture);
			document.addEventListener(END_EV,_end,that.options.useCapture);
		}
	}
	//滑动
	function _move(event){
		that.move(event);
	}
	//结束
	function _end(event){
		that.end(event);
		document.removeEventListener(MOVE_EV,_move,that.options.useCapture);
		document.removeEventListener(END_EV,_end,that.options.useCapture);
	}
	that.ele.addEventListener(START_EV,_start,that.options.useCapture);
}