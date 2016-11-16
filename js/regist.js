$(function(){



/*--------------------------本页面为登陆login.html的文件---------------------------*/


/*帮助中心菜单显示*/
	$(".help-ul").hover(function(){
		$(".help-ul li").show();
		$(".help").css({"border": "solid 1px #e8e8e8"});
	},function(){
		$(".help-ul li:not(.help)").hide();
		$(".help").css({"border": 0});
	})


/*注册*/

	//电话号码验证
	$(".phone").on("blur",function(){
		var regPhone = /^1[34578]\d{9}$/;
		var valPhone = $(".phone").val();
		$(".phone").next("span").remove();
		if(regPhone.test(valPhone)){
			//php后台验证
			$.ajax({
				type:"post",
				url:"../check.php",
				async:true,
				data:{"type":"checkusername","username":valPhone},
				success:function(data){
					// console.log(data);
					if(data=="true"){
						$(".phone").after("<span style='color:red;margin-left:10px;'>电话号码已被注册</span>");
						$(".phone").removeClass("sure");
					}else if(data=="false"){
						$(".phone").after("<span style='color:green;margin-left:10px;'>电话号码可用</span>");
						$(".phone").addClass("sure");
					}
				}	
			});
		}else{
			$(".phone").after("<span style='color:red;margin-left:10px;'>请输入正确的电话号码</span>");
			$(".phone").removeClass("sure");
		};
	});
	//登陆验证码校验
	$(".yan").on("blur",function(){
		var yan = $(".yan").val();
		$(".re-a1").next("span").remove();
		var yan_local = yan.toUpperCase();
		var yan_line = getYan.toUpperCase();
		if(yan_line==yan_local){
			$(".re-a1").after("<span style='color:green;margin:10px 0 0 10px;float:left;'>验证码正确</span>");
			$(".yan").addClass("sure");
		}else{
			$(".re-a1").after("<span style='color:red;margin:10px 0 0 10px;float:left;'>验证码错误</span>");
			$(".yan").removeClass("sure");
		}
	});
	//点击获取登陆图片验证码
	var getYan = "Tuvy";
	$(".re-a1").on("click",function(){
		$.ajax({
			type:"post",
			url:"../check.php",
			async:true,
			data:{"type":"getyanzheng"},
			success:function(data){
				var data = JSON.parse(data);
				var img = data.img;
					getYan = data.yan;
				$(".re-a1").find("img").attr("src",img);
			},
			DataType:"json"
		})
	});
	//点击获取短信验证码
	var getMes = "a";
	$(".get-mes").on("click",function(){
		$.ajax({
			type:"post",
			url:"../check.php",
			async:true,
			data:{"type":"getmessage"},
			success:function(data){
				var data = JSON.parse(data);
					getMes = data.info;
				$(".get-mes").text("(模拟短信)"+getMes);
			},
			DataType:"json"
		});
	});
	//短信验证码校验
	$(".message").on("blur",function(){
		var message = $(".message").val();
		$(".get-mes").next("span").remove();
		if(message==getMes){
			$(".get-mes").after("<span style='color:green;margin:10px 0 0 10px;float:left;'>验证码正确</span>");
			$(".message").addClass("sure");
		}else{
			$(".get-mes").after("<span style='color:red;margin:10px 0 0 10px;float:left;'>验证码错误</span>");
			$(".message").removeClass("sure");
		}
	});
	//密码校验(6-16位)
	$(".pwd-one").on("blur",function(){
		var regPwd = /^[^\s]{6,16}$/;
		var Pwdval = $(this).val();
		$(this).next("span").remove();
		if(regPwd.test(Pwdval)){
			$(this).after("<span style='color:green;margin:10px 0 0 10px;'>密码符合要求</span>");
			$(this).addClass("sure");
		}else{
			$(this).after("<span style='color:red;margin:10px 0 0 10px;'>不符合要求(应为6-16位除空格)</span>");
			$(this).removeClass("sure");
		}
		makesure();
	});
	//确认密码
	$(".pwd-sure").on("blur",makesure);
	function makesure(){
		$(".pwd-sure").next("span").remove();
		if($(".pwd-one").hasClass("sure")){
			if($(".pwd-sure").val()==$(".pwd-one").val()){
				$(".pwd-sure").after("<span style='color:green;margin:10px 0 0 10px;'>密码一致</span>");
				$(".pwd-sure").addClass("sure");
			}else if($(".pwd-sure").val()!=""){
				$(".pwd-sure").after("<span style='color:red;margin:10px 0 0 10px;'>密码不一致</span>");
				$(".pwd-sure").removeClass("sure");
			}
		}
	};
	//点击同意条款
	$(".agree").on("click",function(){
		if($(this).prop("checked")){
			$(this).addClass("sure");
		}else{
			$(this).removeClass("sure");
		}
	});


/*提交注册信息*/
	$(".btn-zc").on("click",function(){
		var username = $(".phone").val(),
			password = $(".pwd-sure").val();
		//判断信息是否输入正确
		var isOk = false;
		$(".re-form1 input").not(".btn-zc").each(function(index,elemet){
			if(!$(this).hasClass("sure")){
				isOk=false;
				return false;
			}else{
				isOk=true;
			}
		});
		console.log(isOk);
		if(isOk){	
			$.ajax({
				type:"post",
				url:"../check.php",
				data:{"type":"insert","username":username,"password":password},
				success:function(data){
					var data = JSON.parse(data);
					if(data){
						//用于保存登陆状态
						$.cookie("Name",username,{"path":"/"});
						$.cookie("Pwd",password,{"path":"/"});
						window.location.href="../index.html";
					}
				},
				DataType:"json"
			})
		}else{
			alert("输入的信息不正确");
		}
	});
});