// JavaScript Document
/**
 * selectInit pc模拟select选择
 */
function SelectInit(ele){
	var that=this;
	var obj=ele || ".c_select";
	$(obj).each(function(){
		that.events(this);
	});
}
/*下拉框内容定位*/
SelectInit.prototype.position=function(obj){
	var scrollTop;
	var index;
	var val=$(obj).find(".select_text").attr("value");
	if(val && val.length!=0){
		$(obj).find(".select_content").children("p").each(function(){
			if($(this).attr('value')==val){
				scrollTop=this.offsetTop;
				index=$(this).index();
				return;
			}
		});
	}else{
		scrollTop=0;
		index=0;
	}
	$(obj).find(".select_content").scrollTop(scrollTop);
	$(obj).find(".select_content p").eq(index).addClass("selected");
}
/*绑定事件*/
SelectInit.prototype.events=function(obj) {
	var that=this;
	var compObj={};
	if($(obj).attr('options')){
		compObj=eval("({" + $(obj).attr('options') + "})");		
	}
    $(obj).unbind("mouseenter mouseleave").bind({
        mouseenter:function() {
            //禁用
            var _select_state = $(obj).hasClass("disabled");
            if(_select_state){
                return
            }
            if ($(obj).find(".select_content").css("display") != "block") {
				$(obj).find(".select_content").show();
				
				that.position(obj);
            }
        },
        mouseleave:function(){
            //禁用
            var _select_state = $(obj).hasClass("disabled");
            if(_select_state){
                return
            }
            $(obj).find(".select_content").hide();
        }
    })
    $(obj).find(".select_content").unbind("click mouseover").bind({
        click:function(event){
			if(event.target.tagName.toUpperCase()=="P"){
				var temp_state = $(event.target).attr("value");
				var temp = $(event.target).text();
				$(obj).find(".select_text").removeClass("placeH");
				$(obj).find(".select_text").html(temp);
				$(obj).find(".select_text").attr("value",temp_state);
				
				//回调函数
				if (compObj.callBack && typeof (compObj.callBack) == "function") {
					compObj.callBack.call(event.target, temp_state,temp);
				}
				
				$(obj).find(".select_content").hide();
			}
            
        },
		mouseover:function(event){
			if(event.target.tagName.toUpperCase()=="P"){
				$(obj).find(".select_content p").removeClass("selected");
			}
		},
    });
}
//初始化下拉框
var selectInit=function(obj){
		return new SelectInit(obj);
	}