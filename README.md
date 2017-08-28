# gcxRegslideForm
gcxRegslideForm
jQuery-gcxRegslideForm  
Slide Form - Form build and validation made easy
Plug-in description：
This plug-in is divided into three parts：1.Construction and implementation of sliding click behavior 2.Custom dynamic form content 3.Form validation and submission.
Plug in based on jquery，JaveScript automatically generates a single registry page. Automatic personalization，Reflected in the following points：
1. Add the plug-in method directly to the entry object
2. Appearance custom adjustment
3. Time and speed custom adjustment
4. Display content customization
5. Custom content style
6. Support content Ajax generation
7. Support form validation, dynamic display of information
8. Other optimization experience

Thanks to the jquery-validate plugin for this plugin support，Some forms of gcxRegslideForm verify functional dependencies jquery-validate，Of 
course, can also be added to the public development methods.
In addition, this plugin adds a number of authentication expansion to the additional-methods script to support the vast majority of forms of authentication in the current,project application.


GcxRegslideForm instructions：
Ⅰ、Including it on your page
<script src=".../js/merge/gcxRegslideAux.js"></script>                                        Auxiliary script   
<script src=".../js/lan.js"></script>                                                                     language
<script src=".../js/gcxRegslideForm-1.1.0.js"></script>                                       Core plugin
Ⅱ、Add plug-in method on object
[Html] copy
1.<form id='reg_container' action="reg_new.php" method="post"></form>  
2.<script>  
3.$( function()  
4.{  
5.     $( '#reg_container' ).gcxRegslideForm();  
6.} );  
7.</script>  
Ⅲ、Set default parameters
Conventional parameters：
language: 'zh_ch'                     language
Form construction parameters：
flip_Num: 4                              PageCount
reg_width: 700                         Overall width
reg_height: 500                       Overall heigh
reg_HeadTitH: 30                    Head height
reg_sideMargins: 30                Side gap
reg_UpLowMargins: 15           Upper and lower space
reg_bottonH: 60                      Bottom height
reg_BtnWidth: 100                  Button width
reg_MiddleFS: 16                    Middle content font-size
reg_liMarginTB: 8                   Upper and lower spacing between each form element
reg_leadFs: 2                           Lead font-size
reg_leadL: 28                          Lead line-height
iptdefWidth: 155                    Input default width
txtNum: 20                             Form validation error, maximum number of text(Enable only when the method of limiting the number of words is activated)
Speed or time Parameters ( can be modified )：
slideSpeedL_s:                        Left(next) slip speed
slideSpeedR_s:                       Right(back) slip speed
slide_speed:                           Click the step button, the page sliding speed
jump_clickCue_t:                    Prompt POP display time
jump_click_s:                          Step button jump click speed change parameters
submit_fade_s:                       Submit button appear / disappear time，please set between 100~1000, or use the default value 300
backModule_fadeIn_s:           Back button showing speed, please set between 100~1600, or use the default value 1000 
backModule_fadeOut_s:        Back button hiding speed，please set between 100~1000, or use the default value 300
Ⅳ、Plug-in core idea

In the process of using the plug-in, the user can add the form content and the form style (if necessary) to form the form. If you need to use ajax from the background value, you need to expand the method, the background value passed, to generate the parameter list, in order to get the plug-in content, so as to achieve the purpose of generating specific methods, detailed steps back again.
Ⅴ、Simple use plug-in
1. Add form content
Users only need to add the contents of the list of parameters in the content can be, according to the need to add a form element, in addition to the prefix before the content. Note: Please enter in strict accordance with the sample format, and pay attention to whether the number of steps and the corresponding number, otherwise it may not be able to get the correct parameters.
prefix：
Radio_：                                                radio
Checkbox_：                                         checkbox
Select_：                                               select
Input_：                                                input
Password_：                                         password
Txt_：                                                    textarea
Lead_：                                                 lead
P_：                                                      Text paragraph
Gap_：                                                  gap
Example：
[javascript] copy
1.$( function(){  
2.    $( '#reg_container' ).gcxRegslideForm(  
3.        content = {       
4.                Example: [   
5.                    'Input_name',  
6.                    'P_gender',   
7.                    'Radio_male',  
8.                    'Radio_female',   
9.                    'Input_personal Email',  
10.                    'Input_date of birth',  
11.                    'Input_carded',  
12.                    'P_hobby',   
13.                    'Checkbox_baskball',   
14.                    'Checkbox_football',  
15.                    'Gap_gap1',  
16.                    'Checkbox_swimming',   
17.                    'Checkbox_other',  
18.                    'Select_marriage',  
19.                    'Select_education'  
20.                ]  
21.            }  
22.        );  
23.} );  
24.</script>  
Generate page：



2. Set form element style
Form elements added by default generated for the left top line of a lattice, and form elements, form and the height of the font size, color are the default, input / select /textarea the default width is 155, all the form elements, the border width is 1 by default, if you want to modify the style, the same style into the array object in the parameter list.
样式如下：
equal：           		The value of the default, the default situation of the current form elements around the top grid, a row of a form element, if equal:2, divided                                    by 2, if the top and bottom of the adjacent elements of the form equal values are 2, they are on the same line.
postion：        		 Postion value ( left, right, center ).
cen_adjust：     	Center position adjustment value. Only when the postion:center can activate the parameters.
norequired：    	No validation (not required), the default all form controls are required to verify (required).
name：         		Change name value. Because the form generated content, the contents of the list for each item to remove the default prefix part                                                     afterprocessing (replace spaces _) is set to the name value, if the default name value is too long or the user need to re set
value：           		Change value value. Form content generation value principle with name.
width：         		Change width value
height：        		Change heightvalue
size：             		Change the size value of the set select (option display)
font-size：     		Change font size
cols：             		Sets the number of columns in textarea
rows：           		Set the number of rows in textarea
Mind：1.In the textarea style settings, pay attention to the cols and width successively.2.The theory should be set postion and cen_adjust first set up equal, ortypesetting confusion, this plugin in the parameter array using the load style of rearrangement, so no need to tangle the sequence in question, no matter in principle.
Set the style to add the _setting settings object,  if there are spaces or special characters in the object, then change it for _, for example：date of birth...need to modify style，so：date_of_birth____setting
[javascript] copy
1.<script>  
2.$( function(){  
3.$( '#reg_container' ).gcxRegslideForm(  
4.content = {  
5.      cont_step4: [   
6.                    'Input_name', 'P_gender', 'Radio_male', 'Radio_female', 'Input_personal Email', 'Input_date of birth','Input_carded',  
7.                    'P_hobby', 'Checkbox_baskball', 'Checkbox_football','Gap_gap1','Checkbox_swimming', 'Checkbox_other','Select_marriage',  
8.                    'Select_education'  
9.                  ]，  
10.      name_setting: [ 'postion:center', 'cen_adjust:0.8'],  
11.      gender_setting: [ 'equal:2.25', 'postion:right' ],  
12.      male_setting: [ 'postion:right', 'equal:7', 'cen_adjust:0.32', 'name:gender' ],  
13.      female_setting: [ 'postion:center', 'cen_adjust:0.3', 'name:gender', 'equal:4' ],  
14.      personal_Email_setting: [ 'postion:center', 'cen_adjust:0.8' ],  
15.      personal_Mobile_setting: [ 'postion:center', 'cen_adjust:0.8' ],  
16.      date_of_birth_setting: [ 'postion:center', 'cen_adjust:0.8' ],  
17.      marriage_setting: [ 'postion:center', 'cen_adjust:0.74', 'size:1', 'width:155' ],  
18.      education_setting: [ 'postion:center', 'cen_adjust:0.74', 'size:1', 'width:155' ],  
19.      hobby_setting: [ 'equal:2.25', 'postion:right' ],  
20.      baskball_setting: [ 'equal:5.8', 'postion:center', 'cen_adjust:0.7', 'name:hobby' ],  
21.      football_setting: [ 'equal:5.8', 'postion:center', 'cen_adjust:0.3', 'name:hobby' ],  
22.      gap1_setting: [ 'equal:2.22' ],  
23.      swimming_setting: [ 'equal:5.0', 'postion:center', 'cen_adjust:0.34', 'name:hobby' ]  
24.      }  
25.);  
26.} );  
27.</script>  
3. Effect display

以上步骤都完成后，生成页面如下：


Ⅵ、Public extension method for plug-in exposure
1.add prefix copy
/**
* add prefix
* @param opts into object opts
* @param value
* @param i Prefix arr num
* @returns prefix + value
*/
$.fn.gcxRegslideForm.add_prefix = function( opts, value, i )
{
	return opts.list_prefix[ i ] + value;
};
Note: this method does not recommend modifications
2.Ajax page initial (first page) loading
When the user needs to use the Ajax plugin is loaded, the method of generating content, there is no need to add the form content in the parameter list, only in this way from the background to obtain the corresponding parameters of the dynamic parameters to add to the plugin. If the user sets the content of the original (first page) list and uses the extension method, this method will cover the former, if you do not need to use this method, you need to set up an empty method.
/**
* Ajax page initial loading
* @param opts
*/
$.fn.gcxRegslideForm.ajax_Int_loading = function( opts, val ) 
{ 
	$.ajax( { 
	type: "POST", 
	dataType: "json", 
	url: "reg_new.json", 
	async: false, 
	timeout: 1000, 
	data: { 
		"open_reg": val 
		}, 
	success: function( data ) 
	{ 
		/*input code*/ 
	}, 
	complete: function( XMLHttpRequest, status ) 
	{ 
		if( status == 'timeout' )ajaxTimeOut.abort(); 
	}, 
		error: function( XMLHttpRequest, textStatus, data ) 
	{ 
		alert( data ); 
		alert( XMLHttpRequest.status ); 
		alert( XMLHttpRequest.readyState ); 
		alert( textStatus ); 
	} 
} ); 
}; 
Example：
success: function( data )
					{
						var intLoadCont = [];
						$.each( data.cont_step1, function( n, value )    // each options to find its own xx_setting style settings
						{
							//1st prefix add 'Load_' prefix,others add 'Radio_' prefix
                                                        n == 0 ? intLoadCont.push( $.fn.gcxRegslideForm.add_prefix( opts, value, 3 ) ) : intLoadCont.push( $.fn.gcxRegslideForm.add_prefix( opts, value, 0 ) );
						} );
						flag = false;  //Switch off ，prevent add for the second time
						return opts.cont_step1 = intLoadCont;  //Output results (Content arr)
					},
3.Custom initialization
/**
* Custom initialization
* @param opts
*/
$.fn.gcxRegslideForm.customInit = function( opts )
{
};
After initializing the load page, you can use this method to adjust the page.
4.Custom page Ajax to upload data and get the page content list data
/**
		 * ajax load the specified step contne
		 * @param opts
		 * @param i         page step
		 * @param val
		 */
		$.fn.gcxRegslideForm.ajax_cont2_loading = function( opts, i, val )
		{}
This method can be set to load the following step pages, and the different steps of the front page can be selected by setting the loading condition.
Example：
$.fn.gcxRegslideForm.ajax_cont2_loading = function( opts, i, val ){
			if( i == 2 )
			{
				/* Set a parameter, in order to control ajax will not be submitted repeatedly
				 No other operations are performed until a request is completed */
				var flag = true;
				if( flag )
					$.ajax( {
						type: "POST",
						dataType: "json",
						url: "reg_new.json",
						async: false,
						timeout: 1000,
						data: {
							"objective": val
						},
						success: function( data )
						{
							var LoadCont2 = [];
							var LoadCont2_opt = [];
							var LoadCont4_1 = [];
							var LoadCont4_1_opt1 = [];
							var LoadCont4_1_opt2 = [];
							var LoadCont4_2 = [];
							//Generate second part list data（select）
							$.each( data.cont_step2, function( n, value )
							{
								LoadCont2.push( $.fn.gcxRegslideForm.add_prefix( opts, value, 1 ) );
								/*Add a prefix and push into the content list array*/
							} );
							//Generate fourth parts of personal content list data
							var build_4stLsit1 = function( data, opts )
							{
								$.each( data.cont_step4_1, function( n, value )
								{
									if( n == 2 || n == 3 )
										LoadCont4_1.push( $.fn.gcxRegslideForm.add_prefix( opts, value, 0 ) );
									if( n == 13 || n == 14 )
										LoadCont4_1.push( $.fn.gcxRegslideForm.add_prefix( opts, value, 1 ) );
									if( n == 0 || n == 4 || n == 5 || n == 6 )
										LoadCont4_1.push( $.fn.gcxRegslideForm.add_prefix( opts, value, 2 ) );
									if( n == 1 || n == 7 )
										LoadCont4_1.push( $.fn.gcxRegslideForm.add_prefix( opts, value, 4 ) );
									if( n == 8 || n == 9 || n == 11 || n == 12 )
										LoadCont4_1.push( $.fn.gcxRegslideForm.add_prefix( opts, value, 5 ) );
									if( n == 10 )
										LoadCont4_1.push( $.fn.gcxRegslideForm.add_prefix( opts, value, 8 ) );
								} );
							};
							//Generate the fourth part of the enterprise content list data
							var build_4stLsit2 = function( data, opts )
							{
								$.each( data.cont_step4_2, function( n, value )
								{
									LoadCont4_2.push( $.fn.gcxRegslideForm.add_prefix( opts, value, 2 ) );
								} );
							};
							//Generate fourth part select drop-down box content list data
							_storageToArr( data.marriage_opt, LoadCont4_1_opt1 );
							_storageToArr( data.education_opt, LoadCont4_1_opt2 );

							var checkVal = $( 'input:radio[name="objective"]:checked' ).val();
							//According to the situation, the data return data is stored in the new array
							if( checkVal == 'I want to teach or work in China' )
							{
								_storageToArr( data.nationality_opt1, LoadCont2_opt );
								build_4stLsit1( data, opts );
								opts.cont_step4 = LoadCont4_1;
							}
							else if( checkVal == 'I want to study in China' )
							{
								_storageToArr( data.nationality_opt2, LoadCont2_opt );
								build_4stLsit1( data, opts );
								opts.cont_step4 = LoadCont4_1;
							}
							else if( checkVal == 'I want to post recruiting/enrollment/coopration information' )
							{
								_storageToArr( data.nationality_opt3, LoadCont2_opt );
								build_4stLsit2( data, opts );
								opts.cont_step4 = LoadCont4_2;
							}
							else
							{
								_storageToArr( data.nationality_opt4, LoadCont2_opt );
								build_4stLsit1( data, opts );
								opts.cont_step4 = LoadCont4_1;
							}
							//return each content list data
							opts.cont_step2 = LoadCont2;
							opts.nationality_opt = LoadCont2_opt;
							opts.marriage_opt = LoadCont4_1_opt1;
							opts.education_opt = LoadCont4_1_opt2;
							flag = false;
							/*Switch off ，prevent add for the second time*/
						},
						complete: function( XMLHttpRequest, status )
						{
							if( status == 'timeout' )ajaxTimeOut.abort();
						},
						error: function( XMLHttpRequest, textStatus )
						{
							alert( XMLHttpRequest.status );
							alert( XMLHttpRequest.readyState );
							alert( textStatus );
						}
					} );
				if( !flag )return false;
			}
			else
			{
				return false;
			}
			//Gets the data ,and return data to the new array
			function _storageToArr( arr, new_arr )
			{
				$.each( arr, function( n, value )
				{
					new_arr.push( value );
				} );
			}
	};
Examples to explain: when the user clicks to second pages, second pages of content and subsequent dynamic loading of the page, select the radio button in the different values of step1, get a different value after processing to set parameters to plug from the background, resulting in the page load, can be obtained by these parameters, the generation of content smooth.
5.Switch change
		/**
		 * Change the status of the switch valve, under certain conditions (in user's own definition), will open the switch, which determines when the interface to the current step,
		 * whether to reload the new content. Under the current registration interface, only the user changes the value of step1 in radio, will lead to the replacement of Step2 and Step4 content,
		 * in other cases (the user clicks), will not reload the new content.
		 * @param opts
		 * @param i        page step
		 */
		$.fn.gcxRegslideForm.switch_change = function( opts, i )
		{
			if( i == 1 )$( 'input:radio[name="objective"]' ).change( function()
			{
				build_Switch = true;
			} );
			if( i == opts.flip_Num )build_Switch = false;
		};
Change the status of the switch valve, under certain conditions (the user's own definition), will open the switch, which determines when the interface to the current step, whether to reload the new content. In the current registration interface, only the user defined in the case, will lead to Ajax dynamically generated content change, other cases (before and after the user click) is not reloaded, new content, this method needs to meet the following build_condition () method to use.
6.Need to take advantage of dynamically generated form data page conditions
/**
		 * Onditional judgment of dynamically generated pages
		 * @param i
		 * @returns       {boolean}
		 */
		$.fn.gcxRegslideForm.build_condition = function( i )
		{
			/*In page second and  fourth step, the form data is dynamically generated, and the page changes with the operation
			 if you no need Dynamic loading，you can set  ajaxPage = null .*/
			return ajaxPage = i == 2 || i == 4;
		};
In page second and fourth step, the form data is dynamically generated, and the page changes with the operation. if you no need Dynamic loading，you can set ajaxPage = null .
7.Customize the adjustment after the page loads
After the current step page is loaded, you can modify this step and add your custom style directly in the following method.

Custom change：
		/**
		 * Custom change
		 * @param opts
		 * @param i
		 */
		$.fn.gcxRegslideForm.customChange = function( opts, i )
		{
			var name = 'nationality';
			var simpleCondition = i == 2;
			if( simpleCondition )     //Simplified display
			{
				var simpleObj = $( "[ name = " + name + " ]" );
				simpleObj.parent().find( 'p' ).remove();
				simpleObj.attr( 'size', $( "[ name = " + name + " ] option" ).length );
			}
		};
Custom build：

/**
		 * Custom build
		 * @param opts
		 * @param i
		 */
		$.fn.gcxRegslideForm.customBuild = function( opts, i )
		{
			if( i == 2 )$( "#reg_slider_turn select[name='nationality']" ).parent().parent().css( 'margin-top', 26 );   //set margin-top
		};
8.Custom form validation error message module
You can write code here to modify the error message style

Example：

/**
		 * Custom form error message
		 * @param ele        object1
		 * @param ele2       object2
		 * @param opts
		 * @param i         page step
		 * @param j         content array current num
		 */
		$.fn.gcxRegslideForm.errorTxtStyle = function( ele, ele2, opts, i, j )
		{
			//_errorTxtStyle(ele, ele2, opts, i, j);
		};

9.Step multi-title selection change method
When the title needs to change dynamically with the user's choice of operation, the user to set the title of the array,it is necessary to judge and change the public extension methods, can operate on their own

Example：

/**
		 * Custom arr title
		 * @param opts
		 * @param titArr      tit arr
		 */
		$.fn.gcxRegslideForm.custom_multipleTit = function( opts, titArr )
		{
			var reg_tit = $( '#' + opts.reg_container + ' #' + opts.reg_HeadTit + '' );
			if( $( "input[name='objective']:checked" ).val() == 'I want to post recruiting/enrollment/coopration information' )
				reg_tit.html( titArr[ 1 ] );
			else reg_tit.html( titArr[ 0 ] );
		};
Ⅶ、additional-methods add a verification method
[javascript] copy
1./**  
2.* id 
3.*/  
4.$.validator.addMethod( "isId", function( value, element )  
5.{  
6.    var regular = /^[a-zA-Z0-9_]{4,16}$/;  
7.    return this.optional( element ) || (regular.test( value ));  
8.}, "Only english letters,number and '_",length 4 to 20 );  
9.  
10./**  
11.* Password
12.*/  
13.$.validator.addMethod( "isPassword", function( value, element )  
14.{  
15.    var regular = /((?=.*[a-z])(?=.*\d)|(?=[a-z])(?=.*[#@!~%^&*.])|(?=.*\d)(?=.*[#@!~%^&*.]))[a-z\d#@!~%^&*.]{6,20}/i;  
16.    return this.optional( element ) || (regular.test( value ));  
17.}, "Can not be pure numbers,letters,pure special characters,length 6 to 20" );  
18.  
19./**  
20.* Name
21.*/  
22.$.validator.addMethod( "isName", function( value, element )  
23.{  
24.    var regular = /^[a-zA-Z0-9_*-]{4,16}$/;  
25.    return this.optional( element ) || (regular.test( value ));  
26.}, "Only english letters,number and '*,_",the length 4 to 20 );  
27.  
28./**  
29.* Mobilephone
30.*/  
31.$.validator.addMethod( "isMobilephone", function( value, element )  
32.{  
33.    var regular = /^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}|14[7]\d{8}|15[89]\d{8}|18[0-9]\d{8}$/;  
34.    return this.optional( element ) || (regular.test( value ));  
35.}, "Please enter the correct mobilephone" );  
36.  
37./**  
38.* tel  
39.*/  
40.$.validator.addMethod( "isTel", function( value, element )  
41.{  
42.    var regular = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;  
43.    return this.optional( element ) || (regular.test( value ));  
44.}, "Please enter the correct tel, (Example:  XXXX-XXXXXXXX，XXXXXXX。" );  
45.  
46./**  
47.* fax  
48.*/  
49.$.validator.addMethod( "isFax", function( value, element )  
50.{  
51.    var regular = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;  
52.    return this.optional( element ) || (regular.test( value ));  
53.}, "Please enter the correct fax,( Example: +123 -999 999 ； +123-999 999" );  
54.  
55./**  
56.* Birth  
57.*/  
58.$.validator.addMethod( "isBirth", function( value, element )  
59.{  
60.    var regular = /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;  
61.    return this.optional( element ) || (regular.test( value ));  
62.}, "Please enter the correct birthday(Example:1990-09-16)" );  
63.  
64./**  
65.* Email
66.*/  
67.$.validator.addMethod( "isEmail", function( value, element )  
68.{  
69.    var regular = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;  
70.    return this.optional( element ) || (regular.test( value ));  
71.}, "Please enter the correct email" );  
72.  
73./**  
74.* Carded
75.*/  
76.$.validator.addMethod( "isCarded", function( value, element )  
77.{  
78.    var regular = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;  
79.    return this.optional( element ) || (regular.test( value ));  
80.}, "Please enter the correct ID" );  
81.  
82./**  
83.* QQ
84.*/  
85.$.validator.addMethod( "isQQ", function( value, element )  
86.{  
87.    var regular = /^[1-9][0-9]{4,14}$/;  
88.    return this.optional( element ) || (regular.test( value ));  
89.}, "Please enter the correct QQ" );  
90.  
91./**  
92.* web 
93.*/  
94.$.validator.addMethod( "isWebsite", function( value, element )  
95.{  
96.    var regular = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/|[Ww]{3}.)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;  
97.    return this.optional( element ) || (regular.test( value ));  
98.}, "Please enter the correct website URL" );  
Ⅷ、jquery-validate support
插件导入以及内容和样式导入完毕后，还需要引入 jquery-validate 并使用，本插件已经合并相关代码，至于 jquery-validate 的使用方法自行百度，这里不再叙述。
Ⅸ、Plugin show








Ⅹ、Questions and Precautions
1. The custom form contents and custom form styles entered by the user are entered exactly in the example format, and note that the numbering corresponds to the step number. Otherwise, the relevant parameters may not be obtained correctly.
2. Plug-in position parameter value of the size of the adjustment effect relative to the size of the entire registration page, so set the plug-in parameters, in accordance with the order, from outside to inside, followed by construction, in order to avoid repeated adjustments.
3. After each registration form is generated, if you want to make a page change or callback, please add the corresponding changes in the post extension method.
4. The plug-in support google chrome, firefox, safari, opera and other mainstream versions, ie9 and above support, ie8 will cause the form to submit verification failure, the interface has a slight display error, but the plug-in page jump function is normal, but please carefully choose the application To the actual project, ie7 and the following version does not support the plug-in.
Ⅺ、Communicate 
If the plug-in has to use the problem or need to be perfect, please put forward，send email to  sina771401093@sina.com，or  add Wechat lensgcx 
Ⅻ、版权
Copyright (c) 2011 gaocangxiong（gcx / Broccoli spring）. All rights reserved.
