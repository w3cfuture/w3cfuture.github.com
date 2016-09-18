/****************
	滑动事件
****************/
;(function(window){
	jf.fn.extend({
		//设置元素位移的位置
		scrollTo:function (x, y, time, easing) {
			easing = easing || 'cubic-bezier(0.1, 0.57, 0.1, 1)';
			time = time || 0;
			this.each(function(){
				jf(this).css({'transition':"all "+time+"ms "+easing,'transform':"translate("+x+"px,"+y+"px) translateZ(0px)"});
			});
			
		},
		//滑动事件
		move:function(options){
			return new Move(this[0],options);
		}
	});
	jf.extend({
		//滑动距离
		momentum:function (current, start, time, lowerMargin, wrapperSize) {
			var distance = current - start,
				speed = Math.abs(distance) / time,
				destination,
				duration,
				deceleration = 0.0006;
		
			destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
			duration = speed / deceleration;
		
			if ( destination < lowerMargin ) {
				destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
				distance = Math.abs(destination - current);
				duration = distance / speed;
			} else if ( destination > 0 ) {
				destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
				distance = Math.abs(current) + destination;
				duration = distance / speed;
			}
		
			return {
				destination: Math.round(destination),
				duration: duration
			};
		}
	});
	
	//判断是pc端还是移动端
	var isAndroid = (/android/gi).test(navigator.appVersion),
		isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
		isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
		hasTouch = 'ontouchstart' in window && !isTouchPad,
		RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
		START_EV = hasTouch ? 'touchstart' : 'mousedown',
		MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
		END_EV = hasTouch ? 'touchend' : 'mouseup',
		CLICK_EV = hasTouch ? 'touchend' : 'click',
		WHEEL_EV = 'onmousewheel' in window ? 'mousewheel' : 'DOMMouseScroll';

	function Move(ele,options){
		//参数
		this.ele=ele;
		this.options={
			zoom:false,
			scale:false,
			//参数
			zoomNum:1,
			minZoom:1,
			maxZoom:5,
			minX:0,
			minY:0,
			maxX:0,
			maxY:0,
			onRefresh:null,
			useCapture:true
		};
		for (i in options) this.options[i] = options[i];
		this.refresh();
		this.events();
		
	}
	//刷新数据
	Move.prototype.refresh=function(){
		if (this.options.onRefresh) this.options.onRefresh.call(this);
	}
	//滑动开始
	Move.prototype.start=function(event){
		this.options.scale=false;
		var touch = hasTouch ? event.targetTouches[0] : event;
		if(hasTouch && event.touches.length > 1){
			this.options.scale=true;
			if(this.options.zoom){
				var touch1 = event.touches[0];
				var touch2 = event.touches[1];
				var moveX=touch1.pageX-touch2.pageX;
				var moveY=touch1.pageY-touch2.pageY;
				var c1=Math.abs(moveX);
				var c2=Math.abs(moveY);
				this.options.touchesDistStart = Math.sqrt(c1*c1+c2*c2);
				this.options.scaleStart=this.options.zoomNum;
				
				var pageX=touch2.pageX+moveX/2;
				var pageY=touch2.pageY+moveY/2;
				var offsetX=jf(this.ele).offset().left;
				var offsetY=jf(this.ele).offset().top;
				this.options.x0=pageX-offsetX+jf(this.ele).transform().x;
				this.options.y0=pageY-offsetY+jf(this.ele).transform().y;
				this.options.x1=(this.options.x0-jf(this.ele).transform().x)/this.options.zoomNum;
				this.options.y1=(this.options.y0-jf(this.ele).transform().y)/this.options.zoomNum;
			}	
		}else{
			this.options.scale=false;
			//取第一个touch的坐标值
			this.startPos = {
				events:event,
				pageX:touch.pageX,
				pageY:touch.pageY,
				time:+new Date,
				zoomNum:this.options.zoomNum,
				translateX:jf(this.ele).transform().x,
				translateY:jf(this.ele).transform().y
			};
			//判断横向滑动还是纵向滑动
			this.options.prePageX = touch.pageX;
			this.options.prePageY = touch.pageY;
			if(this.options.startFn){
				this.options.startFn.call(this,this.startPos);	
			}
		}
	}
	//移动
	Move.prototype.move=function(event){
		var touch = hasTouch ? event.targetTouches[0] : event;
		if(hasTouch && event.touches.length > 1){
			if(this.options.zoom){
				var touch1 = event.touches[0];
				var touch2 = event.touches[1];
				var moveX=touch1.pageX-touch2.pageX;
				var moveY=touch1.pageY-touch2.pageY;
				var c1=Math.abs(moveX);
				var c2=Math.abs(moveY);
				this.options.touchesDist = Math.sqrt(c1*c1+c2*c2);
				this.options.zoomNum = this.options.touchesDist / this.options.touchesDistStart *this.options.scaleStart;
				if(this.options.zoomNum < this.options.minZoom) this.options.zoomNum = this.options.minZoom;
				else if(this.options.zoomNum > this.options.maxZoom) this.options.zoomNum = this.options.maxZoom;
				
				var x=this.options.x1*this.options.zoomNum-this.options.x0;
				var y=this.options.y1*this.options.zoomNum-this.options.y0;
				
				if(this.options.zoomFn){
					this.zoomPos={
						events:event,
						x:-x,
						y:-y,
						zoomNum: this.options.zoomNum
					}
					this.options.zoomFn.call(this,this.zoomPos);	
				}
			}
		}else{
			this.movePos = {
				events:event,
				x:touch.pageX - this.startPos.pageX,
				y:touch.pageY - this.startPos.pageY,
				scale:this.options.scale,
				zoomNum: this.options.zoomNum,
				startPointX:this.startPos.translateX,
				startPointY:this.startPos.translateY,
				translateX:jf(this.ele).transform().x,
				translateY:jf(this.ele).transform().y,
				deltaX:touch.pageX-this.options.prePageX,
				deltaY:touch.pageY-this.options.prePageY
			};
			this.isScrolling = Math.abs(touch.pageX-this.options.prePageX) < Math.abs(touch.pageY-this.options.prePageY) ? 1:0;    //isScrolling为1时，表示纵向滑动，0为横向滑动
			this.options.prePageX = touch.pageX;
			this.options.prePageY = touch.pageY;
			if(this.options.moveFn){
				this.options.moveFn.call(this,this.movePos,this.isScrolling);	
			}
		}
	}
	//滑动释放
	Move.prototype.end=function(event){
		var touch = hasTouch ? event.changedTouches[0] : event;
		this.endPos = {
			events:event,
			x:touch.pageX - this.startPos.pageX,
			y:touch.pageY - this.startPos.pageY,
			duration:Number(+new Date - this.startPos.time),
			scale:this.options.scale,
			zoomNum: this.options.zoomNum,
			startPointX:this.startPos.translateX,
			startPointY:this.startPos.translateY,
			translateX:jf(this.ele).transform().x,
			translateY:jf(this.ele).transform().y
		};
		if(this.options.endFn){
			this.options.endFn.call(this,this.endPos,this.isScrolling);	
		}
	}
	//pc鼠标滚轮
	Move.prototype.wheel=function(event){
		if(this.options.zoom){
			var detail=event.wheelDelta?event.wheelDelta:event.detail;
			var pageX=event.pageX;
			var pageY=event.pageY;
			var offsetX=jf(this.ele).offset().left;
			var offsetY=jf(this.ele).offset().top;
			this.options.x0=pageX-offsetX+jf(this.ele).transform().x;
			this.options.y0=pageY-offsetY+jf(this.ele).transform().y;
			this.options.x1=(this.options.x0-jf(this.ele).transform().x)/this.options.zoomNum;
			this.options.y1=(this.options.y0-jf(this.ele).transform().y)/this.options.zoomNum;
			
			if(detail>0){
				this.options.zoomNum+=0.1;
			}else{
				this.options.zoomNum-=0.1;
			}
			if(this.options.zoomNum < this.options.minZoom) this.options.zoomNum = this.options.minZoom;
			else if(this.options.zoomNum > this.options.maxZoom) this.options.zoomNum = this.options.maxZoom;
			
			var x=this.options.x1*this.options.zoomNum-this.options.x0;
			var y=this.options.y1*this.options.zoomNum-this.options.y0;
			
			if(this.options.zoomFn){
				this.zoomPos={
					events:event,
					x:-x,
					y:-y,
					zoomNum: this.options.zoomNum
				}
				this.options.zoomFn.call(this,this.zoomPos);	
			}
		}	
	}
	//事件
	Move.prototype.events=function(){
		//绑定事件
		var that=this;
		//开始
		function _start(event){
			that.start(event);
			document.addEventListener(MOVE_EV,_move,that.options.useCapture);
			document.addEventListener(END_EV,_end,that.options.useCapture);
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
		
		//pc鼠标滚轮
		function _wheel(event){
			that.wheel(event);
		}
		if(!hasTouch && that.options.zoom){
			that.ele.addEventListener(WHEEL_EV,_wheel,that.options.useCapture);
		}
	}
})(window);

