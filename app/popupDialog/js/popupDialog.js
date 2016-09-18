// JavaScript Document
/****************
	弹出框
****************/
function PopupDialogBox(options){
	this.popupBox=null;
	this.popupBg=null;
	this.popupObj=null;
	this.options={
		width:"328px",
		height:"110px",
		title:"",
		popupType:"",
    	html:null,
		buttons:[],
		isDrag:true,
    	closeTime:null,
		style:null,
		closeAuto:true,
		className:"",
		dragEle:null,
		selector:null
	}
	for(var i in options){
		this.options[i]=options[i];
	}
    this.init();
    this.events();
    this.drag();
}
PopupDialogBox.prototype.init = function(){
	var styleStr="";
	if(this.options.style){
		for(i in this.options.style){
			styleStr+=i+":"+this.options.style[i]+";";
		}
	}
	
	if(this.options.selector){
		this.options.html=$(this.options.selector).html();
		$(this.options.selector).empty();
	}
	
    var dialog_box = '<div class="popup_box_box '+this.options.className+'"></div>';
    var dialog_bg = '<div class="popup_box_bg"></div>';
    var dialog_obj = '<div class="popup_box">';
	if(this.options.title){
			dialog_obj +='<div class="popup_top">'+this.options.title+'<i class="popup_close"></i></div>';
	}
            dialog_obj +='<div class="popup_center" style="width:'+this.options.width+';height:'+this.options.height+';'+styleStr+'">';
    if(this.options.html){
			dialog_obj += this.options.html;
    }
    else{
			dialog_obj += '<div class="popup_center_content">';
				dialog_obj += '<i class="popup_icon'+this.options.popupType+'"></i>';
				dialog_obj += '<label>'+this.options.content+'</label>';
			dialog_obj += '</div>';
    }
		dialog_obj += '</div>';
	if(this.options.buttons.length >= 1){
		dialog_obj += '<div class="popup_bottom">';
		$.each(this.options.buttons,function(){
			 dialog_obj +=  '<button class="btn'+(this.btnType||1)+' '+(this.className||"")+'">'+this.text+'</button>';
		});
		dialog_obj += '</div>';
	}
    dialog_obj += '</div>';
    this.popupObj = $(dialog_obj);
    this.popupBg = $(dialog_bg);
    this.popupBox= $(dialog_box);
	this.popupBox.append(this.popupBg).append(this.popupObj);
    $("body").append(this.popupBox);
	
	if(this.options.html){
		this.popupBox.find(".popup_center").css("display","block");
	}
	//计算位置
    var _top = ($(window).height() - this.popupObj.outerHeight()) / 2+$(window).scrollTop();
    var _left = ($(window).width() - this.popupObj.outerWidth()) / 2+$(window).scrollLeft();
    this.top = _top;
    this.left = _left;
	this.popupObj.css({"left":this.left,"top":this.top});
	//初始化函数
	if(this.options.initFn){
		this.options.initFn.call(this);
	}
}
PopupDialogBox.prototype.events = function(){
    var self = this;
    this.popupBox.find(".popup_close").bind("click",function(){
		if(self.options.closeAuto){
			self.close();
		}
		if(self.options.closeFn){
			self.options.closeFn.call(self);
		}
    });
    this.popupBox.find(".popup_bottom button").each(function(index){
        $(this).bind("click",function(){
			if(self.options.closeAuto){
				self.close();
			}
            if(typeof self.options.buttons[index].closeFn == "function"){
                self.options.buttons[index].closeFn.call(self);
            }
        })
    })
    if(this.options.closeTime){
        setTimeout(function(){
			if(self.options.closeAuto){
				self.close();
			}
            if(self.options.closeFn){
				self.options.closeFn.call(self);
			}
        },this.options.closeTime);
    }
}
PopupDialogBox.prototype.close=function(){
	this.popupBox.remove();
	if(this.options.selector){
		$(this.options.selector).html(this.options.html);
	}
}
PopupDialogBox.prototype.drag = function(){
    if(this.options.isDrag){
		if(this.options.dragEle === null) this.options.dragEle=this.popupObj.find(".popup_top")[0];
		this.popupObj.drag({
			dragEle:this.options.dragEle
		});  
    }
}