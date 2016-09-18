// JavaScript Document
/******************
	分页控件
*****************/	
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
	var page_html = "";
	var pageHint = '<div class="pageHint">|&nbsp;&nbsp;每页显示' + this.options.num + '条/共 ' + this.options.allNums + ' 条</div>';
	var pagePlug='<div class="pagePlug"></div>';
	$(this.ele).append(pagePlug).append(pageHint);
	if (this.options.page_num > 1) {
		if (this.options.page_num <= 8) {
			for ( var i = 0; i < this.options.page_num; i++) {
				if (i == 0) {
				  page_html += '<span class="page_gray page_previous" hidefocus="true">&lt;&nbsp;上一页</span><div class="page_num"><span class="num page_active page_num_1" hidefocus="true">'+ (i + 1) + '</span>';
				} else if (i == this.options.page_num - 1) {
				  page_html += '<span class="num page_num_' + this.options.page_num + '" hidefocus="true">' + this.options.page_num + '</span></div><span class="page_gray page_next" hidefocus="true">下一页&nbsp;&gt;</span>';
				} else {
				  page_html += '<span class="num page_num_' + (i + 1) + '" hidefocus="true">' + (i + 1) + '</span>';
				}
			}
		}else {
			for ( var i = 0; i < 8; i++) {
				if (i == 0) {
				  page_html += '<span class="page_gray page_previous" hidefocus="true">&lt;&nbsp;上一页</span><div class="page_num"><span class="num page_active page_num_1" hidefocus="true">' + (i + 1) + '</span>';
				} else if (i == 1) {
				  page_html += '<span class="omit_previous">...</span><span class="num page_num_2" hidefocus="true">'+ (i + 1) + '</span>';
				} else if (i == 7) {
				  page_html += '<span class="num page_num_8" hidefocus="true">' + this.options.page_num+ '</span></div><span class="page_gray page_next" hidefocus="true">下一页&nbsp;&gt;</span>';
				} else if (i == 6) {
				  page_html += '<span class="num page_num_7" hidefocus="true">' + (i + 1) + '</span><span class="omit_next">...</span>';
				} else {
				  page_html += '<span class="num page_num_' + (i + 1) + '"  hidefocus="true">' + (i + 1) + '</span>';
				}
			}
	}
	$(this.ele).find(".pagePlug").append(page_html);
	$(this.ele).find(".omit_previous").hide();
	if (this.options.page_num > 8) {
		$(this.ele).find(".page_num_3").nextAll().hide();
		$(this.ele).find(".page_num_8").show();
		$(this.ele).find(".page_next").removeClass("page_gray");
		$(this.ele).find(".omit_next").show();
	}
	this.pageEvent();
	this.pagePreviousNext();
	}else if(this.options.page_num == 1){
		$(this.ele).find(".pageHint").html('&nbsp;&nbsp;共 ' + this.options.allNums + ' 条');
	}else{
		$(this.ele).find(".pageHint").html('');
	}
	this.pageChange();
	if(this.options.isInitLoad){
		this.pageCallBack();
	}
}
/**
 * 分页绑定事件
 */

PageInit.prototype.pageEvent=function() {
	var that=this;
	$(that.ele).find(".pagePlug .page_num").bind("click",function(event) {
		if($(event.target).hasClass("num")){
			that.options.page = parseInt($(event.target).text());
			that.pageChange();
			that.pageCallBack();
		}
	})
}
/**
 * 分页绑定事件——中间换页
 */
PageInit.prototype.pageChange=function() {
	var that=this;
	if (this.options.page_num <= 8) {
		$(that.ele).find(".page_num .num").removeClass("page_active");
		$(that.ele).find(".page_num .num").each(function(){
			if(parseInt($(this).text())==that.options.page){
				$(this).addClass("page_active");
				return;
			}
		});
		if (that.options.page == that.options.page_num) {
		  $(that.ele).find(".page_next").addClass("page_gray");
		} else {
		  $(that.ele).find(".page_next").removeClass("page_gray");
		}
		if (that.options.page == 1) {
		  $(that.ele).find(".page_previous").addClass("page_gray");
		} else {
		  $(that.ele).find(".page_previous").removeClass("page_gray");
		}
	} else {
		if (that.options.page == 1) {
		  $(that.ele).find(".omit_previous").hide();
		  $(that.ele).find(".omit_next").show();
		  $(that.ele).find(".page_previous").addClass("page_gray");
		  $(that.ele).find(".page_next").removeClass("page_gray");
		  $(that.ele).find(".page_num").find(".num").removeClass("page_active");
		  $(that.ele).find(".page_num_1").addClass("page_active").show();
		  $(that.ele).find(".page_num_2").show().text("2");
		  $(that.ele).find(".page_num_3").show().text("3");
		  $(that.ele).find(".page_num_4").hide();
		  $(that.ele).find(".page_num_5").hide();
		  $(that.ele).find(".page_num_6").hide();
		  $(that.ele).find(".page_num_7").hide();
		} else {
		  $(that.ele).find(".page_previous").removeClass("page_gray");
		  $(that.ele).find(".page_num .num").show().removeClass("page_active");
		  if (that.options.page == 2) {
			$(that.ele).find(".omit_previous").hide();
			$(that.ele).find(".omit_next").show();
			$(that.ele).find(".page_num_2").addClass("page_active").show().text("2");
			$(that.ele).find(".page_num_3").show().text("3");
			$(that.ele).find(".page_num_4").show().text("4");
			$(that.ele).find(".page_num_5").hide();
			$(that.ele).find(".page_num_6").hide();
			$(that.ele).find(".page_num_7").hide();
		  } else if (that.options.page == 3) {
			$(that.ele).find(".omit_previous").hide();
			$(that.ele).find(".omit_next").show();
			$(that.ele).find(".page_num_2").show().text("2");
			$(that.ele).find(".page_num_3").addClass("page_active").show().text("3");
			$(that.ele).find(".page_num_4").show().text("4");
			$(that.ele).find(".page_num_5").show().text("5");
			$(that.ele).find(".page_num_6").hide();
			$(that.ele).find(".page_num_7").hide();
		  } else if (that.options.page == 4) {
			$(that.ele).find(".omit_previous").hide();
			$(that.ele).find(".omit_next").show();
			$(that.ele).find(".page_num_2").show().text("2");
			$(that.ele).find(".page_num_3").show().text("3");
			$(that.ele).find(".page_num_4").addClass("page_active").show().text("4");
			$(that.ele).find(".page_num_5").show().text("5");
			$(that.ele).find(".page_num_6").show().text("6");
			$(that.ele).find(".page_num_7").hide();
		  } else if (that.options.page == 5) {
			$(that.ele).find(".omit_previous").hide();
			// 修改总页数为9的时候了
			$(that.ele).find(".omit_next").show();
			$(that.ele).find(".page_num_2").show().text("2");
			$(that.ele).find(".page_num_3").show().text("3");
			$(that.ele).find(".page_num_4").show().text("4");
			$(that.ele).find(".page_num_5").addClass("page_active").show().text("5");
			$(that.ele).find(".page_num_6").show().text("6");
			$(that.ele).find(".page_num_7").show().text("7");
		  } else if (that.options.page > 5 && that.options.page + 2 < this.options.page_num) {
			$(that.ele).find(".omit_previous").show();
			$(that.ele).find(".page_num_2").text(that.options.page - 3);
			$(that.ele).find(".page_num_3").text(that.options.page - 2);
			$(that.ele).find(".page_num_4").text(that.options.page - 1);
			$(that.ele).find(".page_num_5").addClass("page_active").text(that.options.page);
			$(that.ele).find(".page_num_6").text(that.options.page + 1);
			$(that.ele).find(".page_num_7").text(that.options.page + 2);
			$(that.ele).find(".page_next").removeClass("page_gray");
			$(that.ele).find(".omit_next").show();
			if ((that.options.page + 3) == this.options.page_num) {
			  $(that.ele).find(".omit_next").hide();
			}
			$(that.ele).find(".page_next").removeClass("page_gray");
		  } else if ((that.options.page + 2) == this.options.page_num) {
			$(that.ele).find(".omit_previous").show();
			$(that.ele).find(".omit_next").hide();
			$(that.ele).find(".page_num_2").text(that.options.page - 4);
			$(that.ele).find(".page_num_3").text(that.options.page - 3);
			$(that.ele).find(".page_num_4").text(that.options.page - 2);
			$(that.ele).find(".page_num_5").text(that.options.page - 1);
			$(that.ele).find(".page_num_6").addClass("page_active").text(that.options.page);
			$(that.ele).find(".page_num_7").text(that.options.page + 1);
			$(that.ele).find(".page_num_8").text(that.options.page + 2).show();
			$(that.ele).find(".page_next").removeClass("page_gray");
		  } else if ((that.options.page + 1) == this.options.page_num) {
			$(that.ele).find(".omit_previous").show();
			$(that.ele).find(".omit_next").hide();
			$(that.ele).find(".page_num_2").text(that.options.page - 5);
			$(that.ele).find(".page_num_3").text(that.options.page - 4);
			$(that.ele).find(".page_num_4").text(that.options.page - 3);
			$(that.ele).find(".page_num_5").text(that.options.page - 2);
			$(that.ele).find(".page_num_6").text(that.options.page - 1);
			$(that.ele).find(".page_num_7").addClass("page_active").text(that.options.page);
			$(that.ele).find(".page_num_8").text(that.options.page + 1).show();
			$(that.ele).find(".page_next").removeClass("page_gray");
		  } else if (that.options.page == this.options.page_num) {
			$(that.ele).find(".omit_previous ").show();
			$(that.ele).find(".omit_next").hide();
			$(that.ele).find(".page_num_2").text(that.options.page - 6);
			$(that.ele).find(".page_num_3").text(that.options.page - 5);
			$(that.ele).find(".page_num_4").text(that.options.page - 4);
			$(that.ele).find(".page_num_5").text(that.options.page - 3);
			$(that.ele).find(".page_num_6").text(that.options.page - 2);
			$(that.ele).find(".page_num_7").text(that.options.page - 1);
			$(that.ele).find(".page_num_8").addClass("page_active").text(that.options.page);
			$(that.ele).find(".page_next").addClass("page_gray");
		  }
		}
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
	var that=this;
	$(that.ele).find(".page_previous").bind("click", function() {
		var page_active = $(that.ele).find(".page_num").find(".page_active");
		var page_active_number = parseInt(page_active.text());
		if (page_active_number != 1) {
		  page_active.removeClass("page_active");
		  that.options.page = page_active_number - 1;
		  that.pageChange();
		  that.pageCallBack();
		}
	})
  	$(that.ele).find(".page_next").bind("click", function() {
		var page_active = $(that.ele).find(".page_num").find(".page_active");
		var page_active_number = parseInt(page_active.text());
		if (page_active_number != that.options.page_num) {
		  page_active.removeClass("page_active");
		  that.options.page = page_active_number + 1;
		  that.pageChange();
		  that.pageCallBack();
		}
	  })
}