/*
 +----------------------------------------------------------------------------------------------------------------------------------------------
 * jQuery gcxRegslideForm Plugin v1.1.0 configuration
 * update：2017.2
 * Plugin Introduce ：This plugin is based on jQuery development, using the plugin page form, according to user needs, custom plug-in content,
 * 					  with the help of validate, can be dynamically to verify the form and submit verification.
 * Copyright (c) 2017.2  高仓雄（gcx / Spring of broccoli）   In Hangzhou, China
 * Contact ：Wechat（lensgcx）
 +----------------------------------------------------------------------------------------------------------------------------------------------
 */
var $body = $( 'body' );
var $reg_container = $( '#reg_container' );
//整体点击开启
$body.on( 'click', '#reg_open', function()
{
	$reg_container.stop( true, true );
	//reg show，Move up to down
	$reg_container.fadeIn().css( 'top', -1200 );
	$reg_container.animate( { 'opacity': 1 }, 600 );
	$reg_container.animate( { 'top': '50%' }, { duration: 1000, queue: false } );
	//Custom form
	$reg_container.gcxRegslideForm(
		structure = {
			language: 'en',
			flip_Num: 4
		},
		content = {
			//步骤标题1-4
			tit_1st: 'Welcome to Helen',
			tit_2st: 'Nationality',
			tit_3st: 'Basic Information',
			tit_4st: [ 'Personal information', 'Company information' ],
			//第一页内容  样式设置
			I_want_to_teach_or_work_in_China_setting: [ 'name:objective', 'width:15', 'height:15' ],
			I_want_to_study_in_China_setting: [ 'name:objective', 'width:15', 'height:15' ],
			I_want_to_post_recruiting_enrollment_coopration_information_setting: [ 'name:objective', 'width:15', 'height:15' ],
			I_want_to_travel_in_China_setting: [ 'name:objective', 'width:15', 'height:15' ],
			//第二页内容  样式设置
			nationality_setting: [ 'postion:center', 'cen_adjust:1', 'size:8', 'width:360', 'height:26', 'equal:1', 'font-size:20' ],
			//第三页内容
			cont_step3: [ 'Input_memberID', 'Password_password', 'Password_re-enter-password', 'P_If You Forget Password...', 'Select_password question', 'Input_password answer', 'Txt_profile' ],
			password_question_opt: [ "Please select", 'question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8' ],
			//第三页内容  样式设置
			memberID_setting: [ 'postion:center', 'cen_adjust:0.8', 'width:155' ],
			password_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			re_enter_password_setting: [ 'postion:center', 'cen_adjust:0.8', 'name:repassword' ],
			If_You_Forget_Password____setting: [ 'postion:center', 'cen_adjust:0.6', 'font-size:20', 'norequired' ],
			password_question_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			password_answer_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			profile_setting: [ 'postion:center', 'cen_adjust:0.8', 'norequired', 'cols:20', 'rows:5' ],
			//第四页内容（个人）  样式设置
			name_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			gender_setting: [ 'equal:2.25', 'postion:right' ],
			male_setting: [ 'postion:right', 'equal:7', 'cen_adjust:0.32', 'name:gender' ],
			female_setting: [ 'postion:center', 'cen_adjust:0.3', 'name:gender', 'equal:4' ],
			personal_Email_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			personal_Mobile_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			date_of_birth_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			marriage_setting: [ 'postion:center', 'cen_adjust:0.74', 'size:1', 'width:155' ],
			education_setting: [ 'postion:center', 'cen_adjust:0.74', 'size:1', 'width:155' ],
			hobby_setting: [ 'equal:2.25', 'postion:right' ],
			baskball_setting: [ 'equal:5.8', 'postion:center', 'cen_adjust:0.7', 'name:hobby' ],
			football_setting: [ 'equal:5.8', 'postion:center', 'cen_adjust:0.3', 'name:hobby' ],
			gap1_setting: [ 'equal:2.22' ],
			swimming_setting: [ 'equal:5.0', 'postion:center', 'cen_adjust:0.34', 'name:hobby' ],
			other_setting: [ 'equal:5.8', 'postion:left', 'name:hobby' ],
			//第四页内容（企业）  样式设置
			company_name_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			office_TEL_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			company_Email_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			address_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			fax_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			website_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			remarks_setting: [ 'postion:center', 'cen_adjust:0.8', 'norequired' ]
		}
	);
	$.fn.gcxRegslideForm.customChange = function( opts, i )
	{
		var name = 'nationality';
		//步骤2，简化页面
		if( i == 2 )
		{
			//这里 删除除了表单本体以外的部分，即：前面的p标签里面的显示内容和必填标志以及冒号
			var simpleObj = $( "[ name = " + name + " ]" );
			simpleObj.parent().find( 'p' ).remove();
			simpleObj.attr( 'size', $( "[ name = " + name + " ] option" ).length );
		}
		//步骤4的出生年月日表单增加日期选择
		if( $( "input[name='objective']:checked" ).val() !== 'I want to post recruiting/enrollment/coopration information' && i == 4 )
		{
			var date = $( "input[name='date_of_birth']" );
			date.addClass( 'datainp wicon' ).attr( 'placeholder', 'Please select time' );
			date.jeDate( {
				isinitVal: true,
				festival: false, 						//不显示农历节日
				ishmsVal: false,
				minDate: '1800-01-01 00:00:00',
				maxDate: $.nowDate( 0 ),
				format: "YYYY-MM-DD",    				//格式
				zIndex: 3000,
				choosefun: function( elem )   			//选中日期回调
				{
					$( elem ).valid();
					console.log( $( elem ).val() )
				},
				clearfun: function( elem )    			//清空日期回调
				{
					$( elem ).valid();
				},
				okfun: function()    					//确定日期回调
				{
					date.valid();
				}
			} );
			date.val( '' );
		}
	};
} );
// 在键盘按下并释放，聚焦及提交后验证提交表单
$reg_container.validate( {
	//提交
	submitHandler: function( form )
	{
		$.dialog( 'confirm', '提示', '您确认要提交么？', 0, function()
		{
			$.tooltip( '提交成功～', 2000, true, function()
			{
				form.submit();
			} );
		} );
	},
	showErrors: function()
	{
		$( "#reg_submit" ).on( "click", function()
		{
			$.dialog( 'alert', '温情提示', '请检查各步骤是否正确填写相关内容', 2000 );
		} );
		this.defaultShowErrors();
	},
	//聚焦和键盘按下并释放
	onfocusout: function( element )
	{
		$( element ).valid();
	},
	onkeyup: function( element )
	{
		$( element ).valid();
	},
	errorPlacement: function( error, element )
	{
		error.insertAfter( element );
	},
	//规则
	rules: {
		objective: { required: true },
		nationality: { required: true },
		//基本信息
		memberID: { required: true, isId: true },
		password: { required: true, isPassword: true },
		repassword: { required: true, minlength: 6, equalTo: "#reg_3st_password1" },
		password_question: { required: true },
		password_answer: { required: true },
		profile: { required: true },
		//个人信息
		name: { required: true, isName: true },
		gender: { required: true },
		personal_Email: { required: true, isEmail: true },
		personal_Mobile: { required: true, isMobilephone: true },
		date_of_birth: { required: true },
		hobby: { required: true },
		marriage: { required: true },
		education: { required: true },
		//企业信息
		company_name: { required: true },
		office_TEL: { required: true, isTel: true },
		company_Email: { required: true, isEmail: true },
		address: { required: true },
		fax: { required: true, isFax: true },
		website: { required: true, isWebsite: true }
	},
	//自定义信息
	messages: {
		objective: { required: "请选择您来中国的目的" },
		nationality: { required: "请选择您的国籍" },
		//基本
		memberID: { required: "请输入id", isId: "只能是英文字母，数字和下划线，长度4到20" },
		password: { required: "请输入密码", isPassword: "密码由6到20位字母数字特殊符号构成，不能是纯数字、纯字母、纯特殊字符" },
		repassword: { required: "请输入重复密码", equalTo: "两次密码输入不一致" },
		password_question: { required: "请选择密码提示问题" },
		password_answer: { required: "请输入密码提示答案" },
		//个人
		name: { required: "请输入姓名", isName: "只能是英文字母，数字和下划线*-，长度4到20" },
		gender: { required: "请选择性别" },
		personal_Email: { required: "请输入个人邮箱", isEmail: "请输入正确的邮箱" },
		personal_Mobile: { required: "请输入个人手机号码", isMobilephone: "请输入正确的手机号码" },
		date_of_birth: { required: "请输入出生年月日" },
		hobby: { required: "请选择爱好" },
		marriage: { required: "请选择婚姻状况" },
		education: { required: "请选择学历" },
		//企业
		company_name: { required: "请输入企业名称" },
		office_TEL: { required: "请输入企业座机电话", isTel: "请输入正确的固定电话,例如：XXXX-XXXXXXXX，XXXXXXX。" },
		company_Email: { required: "请输入企业邮箱", isEmail: "请输入正确的邮箱" },
		address: { required: "请输入企业地址" },
		fax: { required: "请输入企业传真", isFax: "请输入正确的传真,例如：+123 -999 999 ； +123-999 999" },
		website: { required: "请输入企业网站", isWebsite: "请输入正确的网址" }
	}
} );