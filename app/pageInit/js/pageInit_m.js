// JavaScript Document
/****************
	分页组件
****************/
var PageInit=function(ele,options){
	this.ele=ele;
	this.options={};
	this.options.isInitLoad=true; //初始化是否加载
	this.pageRefresh(options);
};

/**
 * 分页刷新事件
 */

PageInit.prototype.pageRefresh=function(options){
	for(var i in options){
		this.options[i]=options[i];
	}
	$(this.ele).empty();
	this.options.page_num=Math.ceil(this.options.allNums/this.options.num);
	var page_html='<a class="page_previous">上一页</a>'+
						'<div class="page_num">'+
							'<div class="select_text"></div>'+
							'<i class="select_icon"></i>'+
							'<select class="select_content">'+
							'</select>'+
						'</div>'+
					'<a class="page_next">下一页</a>';
	$(this.ele).append(page_html);
	if (this.options.page_num > 1) {
		var selectOptions="";
		for(var i=1;i<this.options.page_num+1;i++){
			selectOptions+='<option value="'+i+'">第'+i+'页</option>';
		}
		$(this.ele).find(".select_content").html(selectOptions);
		this.pageEvent();
		this.pagePreviousNext();
		this.pageChange();
	}else{
		$(this.ele).hide();
	}
	if(this.options.isInitLoad){
		this.pageCallBack();
	}
}
/**
 * 分页绑定事件
 */

PageInit.prototype.pageEvent=function() {
	var that=this;
	$(that.ele).find(".select_content").bind("change",function(event) {
		that.options.page=parseInt($(this).val());
		that.pageChange();
		that.pageCallBack();
	})
}
/**
 * 分页绑定事件——中间换页
 */
PageInit.prototype.pageChange=function() {
	$(this.ele).find(".select_text").html(this.options.page+'/'+this.options.page_num);
	if(this.options.page==1){
		$(this.ele).find(".page_previous").addClass("disabled");
	}else{
		$(this.ele).find(".page_previous").removeClass("disabled");
	}
	if(this.options.page==this.options.page_num){
		$(this.ele).find(".page_next").addClass("disabled");
	}else{
		$(this.ele).find(".page_next").removeClass("disabled");
	}
}
/**回调函数**/
PageInit.prototype.pageCallBack=function(){
	if (typeof this.options.thisPageFn == "function") {
		this.options.thisPageFn.call(this,this.options.page);
	}
}
/**
 * 分页绑定事件——上一页，下一页
 */
PageInit.prototype.pagePreviousNext=function() {
	//判断是pc端还是移动端
	var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
		hasTouch = 'ontouchstart' in window && !isTouchPad,
		CLICK_EV = hasTouch ? 'touchend' : 'click';
	var that=this;
	$(that.ele).find(".page_previous").bind(CLICK_EV,function() {
		if($(this).hasClass("disabled")){
			return;
		}
		that.options.page-=1;
		that.pageChange();
		that.pageCallBack();
		
	})
  	$(that.ele).find(".page_next").bind(CLICK_EV,function() {
		if($(this).hasClass("disabled")){
			return;
		}
		that.options.page+=1;
		that.pageChange();
		that.pageCallBack();	  
	})
}
