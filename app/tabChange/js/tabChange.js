/****************
	选项卡切换
****************/
function TabChange(options){
	this.options={
	}
	for(var i in options){
		this.options[i]=options[i];
	}
	this.events();
	
}
TabChange.prototype.events=function(){
	var that=this;
	$(that.options.tab).click(function(){
		var tab=this,content;
		$(that.options.tab).removeClass("selected");
		$(tab).addClass("selected");
		$(that.options.content).removeClass("selected");
		if($(tab).attr("data-tab")){
			$(that.options.content).each(function(){
				if($(this).attr("data-content")==$(tab).attr("data-tab")){
					content=$(this);		
					return false;
				}
			});
		}else{
			content=$(that.options.content).eq($(tab).index());
		}
		content.addClass("selected");
		if(typeof that.options.fn=="function"){
			that.options.fn(tab,content);
		}	
	});
	
}