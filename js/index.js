// JavaScript Document
//动态生成右侧导航栏
var content="";
$("section").each(function(){
	$(this).children("h1").each(function(){
		content+="<li><a href='#"+$(this).prop('id')+"' id='nav_"+$(this).prop('id')+"'>"+$(this).html()+"</a>";
	});
	content+="<ul class='col3_nav2'>";
	$(this).children("h2").each(function(){
		content+="<li><a href='#"+$(this).prop('id')+"' id='nav_"+$(this).prop('id')+"'>"+$(this).html()+"</a></li>";
	});
	content+="</ul></li>";
});

$(".col3_nav").append(content);


//链接
$(".url").each(function(){
	var str=$(this).html();
	$(this).prop("href",str.substr(str.indexOf("/app/")+1));
	$(this).parent().prev(".img_link").prop("href",str.substr(str.indexOf("/app/")+1));
});


/*根据滚动条的位置选中右侧导航*/
var start=$("article .col3_nav").offset().top;
function scrollX(scrollTop){
	setTimeout(function(){
		$("article .col3").css("top",scrollTop-start+50);
	},100);
	if(scrollTop==(start-50)){
		$(".col3_nav2").hide();
		$(".col3_nav>li>a").removeClass("active");
		$(".col3_nav2>li>a").removeClass("active");	
		return;
	}
	$("section h1").each(function(i){
		if($(this).offset().top<=scrollTop+1){
			$(".col3_nav2").hide();
			$(".col3_nav2").eq(i).show();
			var id=$(this).prop("id");
			$(".col3_nav>li>a").removeClass("active");
			$("#nav_"+id).addClass("active");
			$(".col3_nav2>li>a").removeClass("active");
			$(this).nextAll("h2").each(function(){
				if($(this).offset().top<=scrollTop+1){
					var id=$(this).prop("id");
					$(".col3_nav2>li>a").removeClass("active");
					$("#nav_"+id).addClass("active");
				}
			});
		}		
	});
	
}

$(".col3_nav>li>a").click(function(){
	$(".col3_nav>li>a").removeClass("active");
	$(this).addClass("active");
	$(".col3_nav2").hide();
	$(this).next(".col3_nav2").show();
})
$(".col3_nav2>li>a").click(function(){
	$(".col3_nav2>li>a").removeClass("active");
	$(this).addClass("active");
})

$(document).scroll(function(){
	var scrollTop=$(this).scrollTop();
	var scrollBottom=$('body').height()-$(window).height();
	if(Math.abs(scrollTop-scrollBottom)<=1){ //多减一个像素，ie
		setTimeout(function(){
			$("article .col3").css("top",scrollTop-start+50);
		},100);
		return;
	}
	if(scrollTop>=start){
		scrollX(scrollTop);
	}else{
		scrollX(start-50);
	}
});