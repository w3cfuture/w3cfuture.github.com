// JavaScript Document
jQuery.fn.extend({
	//js仿display:box布局
	flexBoxX:function(obj){
		this.each(function(){
			var that=this;
			var allWidth=$(that).width();
			var child=$(that).children();
			$(that).children().css("float","left");
			var childLen=child.length;
			var allCount=0;
			var width;
			if(obj.first){
				var childsWidth=0;
				for(var i=0;i<childLen;i++){
					var w=parseInt($(child[i]).outerWidth());
					if(!$(child[i]).attr("ie-flex") && w!=0){
						childsWidth+=w+parseInt($(child[i]).css("marginLeft"))+parseInt($(child[i]).css("marginRight"))+parseInt($(child[i]).css("paddingLeft"))+parseInt($(child[i]).css("paddingRight"));
						
					}
				}
				that.childsWidth=childsWidth;
				
			}
			allWidth-=that.childsWidth;
			
			for(var i=0;i<childLen;i++){
				if($(child[i]).attr("ie-flex")){
					allCount+=parseInt($(child[i]).attr("ie-flex"));
				}
			}
			if(allCount!=0){
				width=allWidth/allCount;
				for(var i=0;i<childLen;i++){
					if($(child[i]).attr("ie-flex")){
						var marginLeft=parseInt($(child[i]).css("marginLeft"));
						var marginRight=parseInt($(child[i]).css("marginRight"));
						$(child[i]).outerWidth(parseInt($(child[i]).attr("ie-flex"))*width-marginLeft-marginRight);
					}
				}
			}
		});
		return this;
	},
	flexBoxY:function(obj){
		this.each(function(){
			var that=this;
			var allHeight=$(that).height();
			var child=$(that).children();
			var childLen=child.length;
			var allCount=0;
			var height;
			if(obj.first){
				var childsHeight=0;
				for(var i=0;i<childLen;i++){
					var h=parseInt($(child[i]).outerHeight());
					if(!$(child[i]).attr("ie-flex") && h!=0){
						childsHeight+=h+parseInt($(child[i]).css("marginTop"))+parseInt($(child[i]).css("marginBottom"))+parseInt($(child[i]).css("paddingTop"))+parseInt($(child[i]).css("paddingBottom"));
					}
					
				}
				that.childsHeight=childsHeight;
				
			}
			allHeight-=that.childsHeight;
			for(var i=0;i<childLen;i++){
				if($(child[i]).attr("ie-flex")){
					allCount+=parseInt($(child[i]).attr("ie-flex"));
				}
			}
			if(allCount!=0){
				height=allHeight/allCount;
				for(var i=0;i<childLen;i++){
					if($(child[i]).attr("ie-flex")){
						var marginTop=parseInt($(child[i]).css("marginTop"));
						var marginBottom=parseInt($(child[i]).css("marginBottom"));
						$(child[i]).outerHeight(parseInt($(child[i]).attr("ie-flex"))*height-marginTop-marginBottom);
					}
				}
			}
		});
		return this;
	}
});

//获取浏览器名字+版本号
function getBrowserInfo(){
	var agent = navigator.userAgent.toLowerCase() ;
	var obj={},str;
	var regStr_ie = /msie [\d.]+;/gi;
	var regStr_edge = /rv:[\d.]+/gi;
	var regStr_ff = /firefox\/[\d.]+/gi;
	var regStr_chrome = /chrome\/[\d.]+/gi;
	var regStr_saf = /safari\/[\d.]+/gi;
	var regStr_opera = /opr\/[\d.]+/gi;
	//IE
	if(agent.indexOf("msie") > 0)
	{
		str=agent.match(regStr_ie);
		obj.agent="ie";
	}
	
	//edge
	if(agent.indexOf("rv:") > 0)
	{
		str=agent.match(regStr_edge);
		obj.agent="edge";
	}
	
	//firefox
	if(agent.indexOf("firefox") > 0)
	{
		str=agent.match(regStr_ff);
		obj.agent="firefox";
	}
	
	//Chrome
	if(agent.indexOf("chrome") > 0)
	{
		str=agent.match(regStr_chrome);
		obj.agent="chrome";
	}
	
	//Safari
	if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0)
	{
		str=agent.match(regStr_saf);
		obj.agent="safari";
	}
	
	//Opera
	if(agent.indexOf("opr") > 0)
	{
		str=agent.match(regStr_opera);
		obj.agent="opera";
	}
	obj.version=(str+"").replace(/[^0-9.]/ig,"");
	return obj;	
}