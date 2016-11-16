$(function(){


/*--------------------------本页面为专题菜单list.html的文件---------------------------*/



/*点击选项卡切换（销量，选项，价格）*/
	$(".pro-fenlei").on("click","a",function(){
		var index = $(this).index();
		$(this).addClass("click-on").siblings().removeAttr("class");
		$(".rank-show").eq(index).show().siblings(".rank-show").hide();
	});

});