/****************
	事件
****************/
;(function(window){
	/*********公用函数**********/
	jf.extend({
		//保存数据对象
		cache:{},
		//唯一标识
		guid:1,
		//生成随机数
		expando: "jf" + (jf.core_version+Math.random()).replace( /\D/g, "" )
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
		
	jf.fn.extend({
		//解除绑定事件
		unbind:function(type,fn,useCapture){
			var that=this;
			if(type){
				jf.each(type.split(" "),function(i,type){
					switch(type){
						case 'touch':
						type = CLICK_EV;
						break;
						case 'touchmove':
						type = MOVE_EV;
						break;
						case 'touchend':
						type = END_EV;
						break;
						case 'touchstart':
						type = START_EV;
						break;
						case 'mousewheel':
						type = WHEEL_EV;
						break;
						default:
						type=type;
					}
					that.each(function(){
						jf.unbind(this,type,fn,useCapture);
					});
				});
			}else{
				that.each(function(){
					jf.unbind(this,type,fn,useCapture);
				});
			}
			return that;
		},
		//绑定事件
		bind:function(type,fn,useCapture){
			var that=this;
			jf.each(type.split(" "),function(i,type){
				switch(type){
					case 'touch':
					type = CLICK_EV;
					break;
					case 'touchmove':
					type = MOVE_EV;
					break;
					case 'touchend':
					type = END_EV;
					break;
					case 'touchstart':
					type = START_EV;
					break;
					case 'mousewheel':
					type = WHEEL_EV;
					break;
					default:
					type=type;
				}
				that.each(function(){
					jf.bind(this,type,fn,useCapture);
				});
			});
			return that;
		},
		//触发事件
		trigger:function(type,fn,useCapture){
			if(fn===undefined){
				this.each(function(){
					jf.eventFn.call(this,type,false);
					jf.eventFn.call(this,type,true);
				});	
			}else if(useCapture===undefined){
				if(typeof arguments[1]=="function"){
					this.each(function(){
						jf.bind(this,type,fn,useCapture);
					});
				}else if(typeof arguments[1]=="boolean"){
					this.each(function(){
						jf.eventFn.call(this,type,fn);
					});
				}
			}else{
				this.each(function(){
					jf.bind(this,type,fn,useCapture);
				});
			}
			return this;
		},
		//点击
		touch:function(fn,useCapture){
			return this.trigger(CLICK_EV,fn,useCapture);
		},
		//鼠标按下或触摸开始
		touchstart:function(fn,useCapture){
			return this.trigger(START_EV,fn,useCapture);
		},
		//鼠标移动或触摸移动
		touchmove:function(fn,useCapture){
			return this.trigger(MOVE_EV,fn,useCapture);
		},
		//鼠标松开或触摸结束
		touchend:function(fn,useCapture){
			return this.trigger(END_EV,fn,useCapture);
		},
		//滚轮滑动
		mousewheel:function(fn,useCapture){
			return this.trigger(WHEEL_EV,fn,useCapture);
		}
	});
	/*******移动端事件函数********/
	jf.extend({
		//对象是否存在
		isObjNull:function(obj){
			var noProp = true; 
			for (var i in obj){  
				noProp = false;  
				break;  
			} 
			return noProp;
		},
		//事件执行函数
		eventFn:function(type,useCapture,event){
			if(!this){
				return;
			}
			if(!this[jf.expando]){
				return;
			}
			var num=this[jf.expando];
			if(!jf.cache[num]){
				return;
			}
	
			var events=jf.cache[num].events;
			if(!events){
				return;
			}
			var eventTypes=events[type];
			if(!eventTypes){
				return;
			}
			if(!useCapture){
				useCaptureStr="bubbling";
			}else{
				useCaptureStr="capture";
			}
			var handlers=eventTypes[useCaptureStr];
			if(!handlers){
				return;
			}
			switch(type){
				case CLICK_EV:
					for(var i=0;i<handlers.length;i++){
						if(event){
							var touch = hasTouch ? event.changedTouches[0] : event;
							handlers[i].handler.call(this,event,touch);
						}else{
							handlers[i].handler.call(this);
						}
					}
				break;
				case START_EV:
					for(var i=0;i<handlers.length;i++){
						if(event){
							var touch = hasTouch ? event.targetTouches[0] : event;
							handlers[i].handler.call(this,event,touch);
						}else{
							handlers[i].handler.call(this);
						}
						
					}
				break;
				case MOVE_EV:
					for(var i=0;i<handlers.length;i++){
						if(event){
							var touch = hasTouch ? event.targetTouches[0] : event;
							handlers[i].handler.call(this,event,touch);
						}else{
							handlers[i].handler.call(this);
						}
					}
				break;
				case END_EV:
					for(var i=0;i<handlers.length;i++){
						if(event){
							var touch = hasTouch ? event.changedTouches[0] : event;
							handlers[i].handler.call(this,event,touch);
						}else{
							handlers[i].handler.call(this);
						}
					}
				break;
				case WHEEL_EV:
					for(var i=0;i<handlers.length;i++){
						if(event){
							var detail=event.wheelDelta?event.wheelDelta:event.detail;
							handlers[i].handler.call(this,event,detail);
						}else{
							handlers[i].handler.call(this);
						}
					}
				break;
				default:
					for(var i=0;i<handlers.length;i++){
						if(event){
							handlers[i].handler.call(this,event);
						}else{
							handlers[i].handler.call(this);
						}
					}
				break;
			}

		},
		//事件替换函数之冒泡
		bubblingFn:function(e){
			var type=e.type;
			jf.eventFn.call(this,type,false,e);
		},
		//事件替换函数之捕获
		captureFn:function(e){
			var type=e.type;
			jf.eventFn.call(this,type,true,e);
		},
		//绑定事件
		bind:function(ele,type,fn,useCapture){
			var bubblingHandle,captureHandle;
			if(!ele){
				return;
			}
			if(!ele[jf.expando]){
				ele[jf.expando]=jf.guid++;
			}
			
			var num=ele[jf.expando];
			if(!jf.cache[num]){
				jf.cache[num]={};
			}
			
			if(!jf.cache[num].events){
				jf.cache[num].events={};
			}
			
			if(useCapture===undefined){
				useCapture=false;
			}
			var events=jf.cache[num].events;
			if(!events[type]){
				events[type]={};
			}
			
			if(!useCapture){
				if(!(bubblingHandle=jf.cache[num].bubblingHandle)){
					bubblingHandle=jf.cache[num].bubblingHandle=function(e){
						return jf.bubblingFn.call(ele,e);
					}
				}
				if(!events[type].bubbling){
					events[type].bubbling=[];
					ele.addEventListener(type,bubblingHandle,useCapture);
				}
				var data={handler:fn};	
				events[type].bubbling.push(data);
				
			}else{
				if(!(captureHandle=jf.cache[num].captureHandle)){
					captureHandle=jf.cache[num].captureHandle=function(e){
						return jf.captureFn.call(ele,e);
					}
				}
				if(!events[type].capture){
					events[type].capture=[];
					ele.addEventListener(type,captureHandle,useCapture);
				}
				var data={handler:fn};	
				events[type].capture.push(data);
				
			}
			
		},
		//解除事件
		unbind:function(ele,type,fn,useCapture){
			if(!ele){
				return;
			}
			if(!ele[jf.expando]){
				return;
			}
			var num=ele[jf.expando];
			if(!jf.cache[num]){
				return;
			}
			
			var events=jf.cache[num].events;
			if(!events){
				return;
			}
			
			if(type===undefined){
				if(jf.cache[num].bubblingHandle){
					for(i in events){
						ele.removeEventListener(i,jf.cache[num].bubblingHandle,false);
					}
				}
				if(jf.cache[num].captureHandle){
					for(i in events){
						ele.removeEventListener(i,jf.cache[num].captureHandle,true);
					}
				}
				delete events[i];
			}else if(fn===undefined){
				if(typeof arguments[1]=="string"){
					if(jf.cache[num].bubblingHandle){
						ele.removeEventListener(type,jf.cache[num].bubblingHandle,false);
					}
					if(jf.cache[num].captureHandle){
						ele.removeEventListener(type,jf.cache[num].captureHandle,true);
					}
					delete events[type];
				}else if(typeof arguments[1]=="boolean"){
					if(jf.cache[num].bubblingHandle && !arguments[1]){
						for(i in events){
							ele.removeEventListener(i,jf.cache[num].bubblingHandle,false);
							delete events[i].bubbling;
						}
					}
					if(jf.cache[num].captureHandle && arguments[1]){
						for(i in events){
							ele.removeEventListener(i,jf.cache[num].captureHandle,true);
							delete events[i].capture;
						}
					}
					for(i in events){
						if( jf.isObjNull(events[i])){
							delete events[i];
						}
					}
				}
			}else if(useCapture===undefined){
				if(events[type]){
					if(events[type].bubbling){
						if(typeof arguments[2]=="function"){
							for(var i=0;i<events[type].bubbling.length;i++){
								if(events[type].bubbling[i].handler==fn){
									events[type].bubbling.splice(i,1);
								}
							}
							if(events[type].bubbling.length==0){
								ele.removeEventListener(type,jf.cache[num].bubblingHandle,false);
								delete events[type].bubbling;
							}
						}else if(typeof arguments[2]=="boolean" && !arguments[2]){
							ele.removeEventListener(type,jf.cache[num].bubblingHandle,false);
							delete events[type].bubbling;
						}
						
					}
					if(events[type].capture){
						if(typeof arguments[2]=="function"){
							for(var i=0;i<events[type].capture.length;i++){
								if(events[type].capture[i].handler==fn){
									events[type].capture.splice(i,1);
								}
							}
							if(events[type].capture.length==0){
								ele.removeEventListener(type,jf.cache[num].captureHandle,true);
								delete events[type].capture;
							}
						}else if(typeof arguments[2]=="boolean" && arguments[2]){
							ele.removeEventListener(type,jf.cache[num].captureHandle,true);
							delete events[type].capture;
						}
					}
					if( jf.isObjNull(events[type])){
						delete events[type];
					}
					
				}
				
			}else{
				if(events[type]){
					if(events[type].bubbling && !useCapture){
						for(var i=0;i<events[type].bubbling.length;i++){
							if(events[type].bubbling[i].handler==fn){
								events[type].bubbling.splice(i,1);
							}
						}
						if(events[type].bubbling.length==0){
							ele.removeEventListener(type,jf.cache[num].bubblingHandle,false);
							delete events[type].bubbling;
						}
						
					}
					if(events[type].capture && useCapture){
						for(var i=0;i<events[type].capture.length;i++){
							if(events[type].capture[i].handler==fn){
								events[type].capture.splice(i,1);
							}
						}
						if(events[type].capture.length==0){
							ele.removeEventListener(type,jf.cache[num].captureHandle,true);
							delete events[type].capture;
						}
					}
					if( jf.isObjNull(events[type])){
						delete events[type];
					}
					
				}
				
			}
			//判断对象是否为空
			var noProp = jf.isObjNull(events); 
			var hasBubbling=false;
			var hasCapture=false;
			if(noProp){
				delete jf.cache[num].events;
				delete jf.cache[num].captureHandle;
				delete jf.cache[num].bubblingHandle;
			}else{
				for(i in events){
					if(events[i].bubbling){
						hasBubbling=true;
						break;
					}
				}
				for(i in events){
					if(events[i].capture){
						hasCapture=true;
						break;
					}
				}
				if(!hasBubbling){
					delete jf.cache[num].bubblingHandle;
				}
				if(!hasCapture){
					delete jf.cache[num].captureHandle;
				}
			}
		}
	});
	/*****其它事件******/
	jf.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu touchcancel").split(" "), function( i, name ) {
	
		// Handle event binding
		jf.fn[ name ] = function(fn,useCapture) {
			return this.trigger(name,fn,useCapture);
		};
	});

})(window);

