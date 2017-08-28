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
//open
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
			//step tit 1-4
			tit_1st: 'Welcome to Helen',
			tit_2st: 'Nationality',
			tit_3st: 'Basic Information',
			tit_4st: [ 'Personal information', 'Company information' ],
			//step 1 style
			I_want_to_teach_or_work_in_China_setting: [ 'name:objective', 'width:15', 'height:15' ],
			I_want_to_study_in_China_setting: [ 'name:objective', 'width:15', 'height:15' ],
			I_want_to_post_recruiting_enrollment_coopration_information_setting: [ 'name:objective', 'width:15', 'height:15' ],
			I_want_to_travel_in_China_setting: [ 'name:objective', 'width:15', 'height:15' ],
			//step 2 style
			nationality_setting: [ 'postion:center', 'cen_adjust:1', 'size:8', 'width:360', 'height:26', 'equal:1', 'font-size:20' ],
			//step 3 content
			cont_step3: [ 'Input_memberID', 'Password_password', 'Password_re-enter-password', 'P_If You Forget Password...', 'Select_password question', 'Input_password answer', 'Txt_profile' ],
			password_question_opt: [ "Please select", 'question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8' ],
			//step 3 style
			memberID_setting: [ 'postion:center', 'cen_adjust:0.8', 'width:155' ],
			password_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			re_enter_password_setting: [ 'postion:center', 'cen_adjust:0.8', 'name:repassword' ],
			If_You_Forget_Password____setting: [ 'postion:center', 'cen_adjust:0.6', 'font-size:20', 'norequired' ],
			password_question_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			password_answer_setting: [ 'postion:center', 'cen_adjust:0.8' ],
			profile_setting: [ 'postion:center', 'cen_adjust:0.8', 'norequired', 'cols:20', 'rows:5' ],
			//step 4 style (personal)
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
			//step 4 style (enterprise)
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
		//step 2 ,simplified page
		if( i == 2 )
		{
			var simpleObj = $( "[ name = " + name + " ]" );
			simpleObj.parent().find( 'p' ).remove();
			simpleObj.attr( 'size', $( "[ name = " + name + " ] option" ).length );
		}
		if( $( "input[name='objective']:checked" ).val() !== 'I want to post recruiting/enrollment/coopration information' && i == 4 )
		{
			var date = $( "input[name='date_of_birth']" );
			date.addClass( 'datainp wicon' ).attr( 'placeholder', 'Please select time' );
			date.jeDate( {
				isinitVal: true,
				festival: false, 						//Not show Lunar calendar
				ishmsVal: false,
				minDate: '1800-01-01 00:00:00',
				maxDate: $.nowDate( 0 ),
				format: "YYYY-MM-DD",
				zIndex: 3000,
				choosefun: function( elem )   			//selected callback
				{
					$( elem ).valid();
					console.log( $( elem ).val() )
				},
				clearfun: function( elem )    			//empty callback
				{
					$( elem ).valid();
				},
				okfun: function()    					//click sure callback
				{
					date.valid();
				}
			} );
			date.val( '' );
		}
	};
} );
$reg_container.validate( {
	submitHandler: function( form )
	{
		$.dialog( 'confirm', 'Warmth Prompt', 'Are you sure you want to submit it?', 0, function()
		{
			$.tooltip( 'Submit success', 2000, true, function()
			{
				form.submit();
			} );
		} );
	},
	showErrors: function()
	{
		$( "#reg_submit" ).on( "click", function()
		{
			$.dialog( 'alert', 'Warmth Prompt', 'Please check the steps to fill in the relevant content correctly', 2000 );
		} );
		this.defaultShowErrors();
	},
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
	rules: {
		objective: { required: true },
		nationality: { required: true },
		//basic info
		memberID: { required: true, isId: true },
		password: { required: true, isPassword: true },
		repassword: { required: true, minlength: 6, equalTo: "#reg_3st_password1" },
		password_question: { required: true },
		password_answer: { required: true },
		profile: { required: true },
		//Personal info
		name: { required: true, isName: true },
		gender: { required: true },
		personal_Email: { required: true, isEmail: true },
		personal_Mobile: { required: true, isMobilephone: true },
		date_of_birth: { required: true },
		hobby: { required: true },
		marriage: { required: true },
		education: { required: true },
		//Enterprise info
		company_name: { required: true },
		office_TEL: { required: true, isTel: true },
		company_Email: { required: true, isEmail: true },
		address: { required: true },
		fax: { required: true, isFax: true },
		website: { required: true, isWebsite: true }
	},
	//Custom messages
	messages: {
		objective: { required: "Please choose your purpose in China" },
		nationality: { required: "Please choose your nationality" },
		//基本
		memberID: { required: "Please enter ID", isId: "Only English letters, numbers and '-', length 4 to 20" },
		password: { required: "Please enter Password", isPassword: "Can not be pure numbers, letters, pure special characters,length 6 to 20" },
		repassword: { required: "Please input your password", equalTo: "Two password input inconsistent" },
		password_question: { required: "Please select a password question" },
		password_answer: { required: "Please input the password prompt" },
		//个人
		name: { required: "Please enter name", isName: "Only English letters, numbers and '*,-',the length 4 to 20" },
		gender: { required: "Please choose gender" },
		personal_Email: { required: "Please enter your personal email", isEmail: "Please enter the correct email" },
		personal_Mobile: { required: "Please enter your moble phone", isMobilephone: "Please enter the correct moble phone" },
		date_of_birth: { required: "Please enter your date of birth" },
		hobby: { required: "Please choose hobbies" },
		marriage: { required: "Please choose marital status" },
		education: { required: "Please choose education" },
		//企业
		company_name: { required: "Please enter enterprise name" },
		office_TEL: { required: "Please enter the enterprise telephone", isTel: "Please enter the correct fixed telephone(XXXX-XXXXXXXX，XXXXXXX)" },
		company_Email: { required: "Please enter enterprise mailbox", isEmail: "Please enter the correct email" },
		address: { required: "Please enter enterprise address" },
		fax: { required: "Please enter enterprise fax", isFax: "Please enter the correct fax" },
		website: { required: "Please enter enterprise website", isWebsite: "Please enter the correct website URL" }
	}
} );