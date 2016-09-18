// JavaScript Document
jQuery.fn.extend({
	//数值控件
	numInit:function(obj){
		function count(type){
			var numEle=$(this).find(".num");
			var value=parseInt(numEle.val());
			switch(type){
				case "dec":
				value-=1;
				break;
				case "add":
				value+=1;
				break;
			}
			if(value==this.options.minN){
				$(this).find(".dec").addClass("disabled").prop("disabled",true);
			}else{
				$(this).find(".dec").removeClass("disabled").prop("disabled",false);
			}
			if(value==this.options.maxN){
				$(this).find(".add").addClass("disabled").prop("disabled",true);
			}else{
				$(this).find(".add").removeClass("disabled").prop("disabled",false);
			}
			numEle.val(value);
			
			//回调函数
			if (type && typeof this.options.callBack == "function") {
				this.options.callBack.call(this, value);
			}
		}
		$(this).each(function (){
			this.options={
				minN:1,
				maxN:99999999,
				callBack:null
			}
			for(i in obj){
				this.options[i]=obj[i];
			}
			var that=this;
			count.call(that);
			$(that).find(".dec").unbind("click").click(function(){
				count.call(that,'dec');
			});
			$(that).find(".add").unbind("click").click(function(){
				count.call(that,'add');
			});
		});
	}
});