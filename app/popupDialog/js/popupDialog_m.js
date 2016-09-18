/****************
	弹出框
****************/
function PopupDialogBox(options){
	this.popupBox=null;
	this.popupBg=null;
	this.popupObj=null;
	this.options={
		title:"",
    	html:null,
		buttons:[],
    	closeTime:null,
		closeAuto:true,
		className:"",
		selector:null
	}
	for(var i in options){
		this.options[i]=options[i];
	}
    this.init();
    this.events();
}
PopupDialogBox.prototype.init = function(){
    var dialog_box = '<div class="popup_box_box '+this.options.className+'"></div>';
	var dialog_bg='<div class="popup_box_bg"></div>';
	var dialog_obj="";
	
	if(this.options.selector){
		this.options.html=document.querySelector(this.options.selector).innerHTML;
		document.querySelector(this.options.selector).innerHTML="";
	}
	
	if(this.options.html){
		dialog_obj += this.options.html;
    }else{
		dialog_obj += '<div class="popup_box">';
		if(this.options.title){
			dialog_obj +='<div class="popup_top">'+this.options.title+'</div>';
		}
			dialog_obj +='<div class="popup_center">'+this.options.content+'</div>';
		if(this.options.buttons.length >= 1){
			dialog_obj += '<div class="popup_bottom">';
			for(var i=0,btns=this.options.buttons,len=btns.length;i<len;i++){
				 dialog_obj += '<button class="btn'+(btns[i].btnType||1)+' '+(btns[i].className||"")+'">'+btns[i].text+'</button>';
			}
			dialog_obj += '</div>';
		}
		dialog_obj += '</div>';
	}
    this.popupBox = buildFragment(dialog_box);
    this.popupBg = buildFragment(dialog_bg);
	this.popupObj = buildFragment(dialog_obj);
	this.popupBox.appendChild(this.popupBg);
	this.popupBox.appendChild(this.popupObj);
	document.querySelector("body").appendChild(this.popupBox);

	//初始化函数
	if(this.options.initFn){
		this.options.initFn.call(this);
	}
}
PopupDialogBox.prototype.events = function(){
    var self = this;
	var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
		hasTouch = 'ontouchstart' in window && !isTouchPad,
		CLICK_EV = hasTouch ? 'touchend' : 'click';
    self.popupBg.addEventListener(CLICK_EV,function(){
		if(self.options.closeAuto){
			self.close();
		}
		if(typeof self.options.closeFn=="function"){
			self.options.closeFn.call(self);
		}
    });
	
	var buttons=self.popupBox.querySelectorAll(".popup_bottom button");
	for(var i=0,len=buttons.length;i<len;i++){
		(function(i){
			buttons[i].addEventListener(CLICK_EV,function(){
				if(self.options.closeAuto){
					self.close();
				}
				if(typeof self.options.buttons[i].closeFn == "function"){
					self.options.buttons[i].closeFn.call(self);
				}
			})
		})(i);
	}
	
    if(this.options.closeTime){
        setTimeout(function(event){
			if(self.options.closeAuto){
				self.close();
			}
			if(typeof self.options.closeFn=="function"){
				self.options.closeFn.call(self);
			}
        },this.options.closeTime);
    }
}

PopupDialogBox.prototype.close=function(fn){
	preventTouchThrough();  //防止点穿
	this.popupBox.parentNode.removeChild(this.popupBox);
	if(this.options.selector){
		document.querySelector(this.options.selector).innerHTML=this.options.html;
	}
	if(fn && typeof fn=="function"){
		fn.call(this);
	}
}

/*html转化成对象*/
function buildFragment(html){
	if(typeof html=="object") return html;
	var nodes=[],div=document.createElement("div");
	div.innerHTML=html;
	for(i in div.childNodes){  //储存数据
		nodes[i]=div.childNodes[i];
	}
	for(var i=0,len=nodes.length;i<len;i++){
		if(nodes[i].nodeType === 1){
			return nodes[i];
		}
	}
}

/******防止点穿******/
function preventTouchThrough(){
	var div=document.createElement("div");
	div.style.position="fixed";
	div.style.top="0px";
	div.style.left="0px";
	div.style.right="0px";
	div.style.bottom="0px";
	div.style.opacity="0";
	div.style.zIndex="10000";
	document.querySelector("body").appendChild(div);
	setTimeout(function(){
		div.parentNode.removeChild(div);
	},400);
}