/****************
	jf核心代码
****************/
;(function(window){
	
	window.f=window.jf=function(selector){
		return	new jf.fn.init(selector);
	}
	//版本号
	jf.core_version="1.0";
	
	/*********jf原型*********/
	jf.fn=jf.prototype={
		//获取元素
		init:function(selector){
			if(typeof selector=="string" || selector instanceof String){
				var elements=document.querySelectorAll(selector);
				this.length=elements.length;
				for(var i=0;i<this.length;i++){
					this[i]=elements[i];
				}	
			}else if(typeof selector=="object"){
				if(selector[0]){
					for(var i=0;i<selector.length;i++){
						this[i]=selector[i];
					}
					this.length=selector.length;
				}else{
					this[0]=selector;
					this.length=1;
				}
			}
			return this;
		},
		//遍历
		each:function(fn,args){
			return jf.each(this,fn,args);
		}
	}
	jf.fn.init.prototype=jf.prototype;

	/*******扩展********/
	jf.extend = jf.fn.extend = function() {
		var target = arguments[0] || {};
		for(i in target){
			this[i]=target[i];
		}
	}
	/*********公用函数**********/
	jf.extend({
		//遍历
		each:function( obj, fn ) { 
			for ( var i = 0, ol = obj.length, val = obj[0]; i < ol && fn.call(val,i,val) !== false; val = obj[++i] ){}
			return obj; 
		},
		//html转化成对象
		buildFragment:function(html){
			if(typeof html=="object") return html;
			var oFragment = document.createDocumentFragment();
			var nodes=[],div=document.createElement("div");
			div.innerHTML=html;
			for(i in div.childNodes){  //储存数据
				nodes[i]=div.childNodes[i];
			}
			for(var i=0,len=nodes.length;i<len;i++){
				if(nodes[i].nodeType === 1){
					oFragment.appendChild(nodes[i]);
				}
			}
			return oFragment;
		}
	});
})(window);