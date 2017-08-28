/*
 +----------------------------------------------------------------------------------------------------------------------------------------------
 * jQuery gcxRegslideForm Plugin v1.1.0
 * update：2017.2
 * Plugin Introduce ：This plugin is based on jQuery development, using the plugin page form, according to user needs, custom plug-in content,
 * 					  with the help of validate, can be dynamically to verify the form and submit verification.
 * Copyright (c) 2017.2  高仓雄（gcx / Spring of broccoli）   In Hangzhou, China
 * Contact ：Wechat（lensgcx）
 +----------------------------------------------------------------------------------------------------------------------------------------------
 */
(function( factory )
{
	if( typeof define === "function" && define.amd )
	{
		define( [ "jquery" ], factory );
	}
	else
	{
		factory( jQuery );
	}
}( function( $ )
	{
		var defaults = {
			//language judgment
			language: 'zh_ch'                   //Simplified Chinese
		};
		//structure Parameters ( can be modified )
		var structure = {
			flip_Num: 4,						//PageCount
			reg_width: 700,						//Overall width
			reg_height: 500,					//Overall height
			reg_HeadTitH: 30,					//Head height
			reg_sideMargins: 30,				//Side gap
			reg_UpLowMargins: 15,				//Upper and lower space
			reg_bottonH: 60,					//Bottom height
			reg_BtnWidth: 100,					//Button width
			reg_MiddleFS: 16,					//Middle content font-size
			reg_liMarginTB: 8,					//Upper and lower spacing between each form element
			reg_leadFs: 20,						//Lead font-size
			reg_leadL: 28,						//Lead line-height
			iptdefWidth: 155,					//Input default width
			txtNum: 20							//Form validation error, maximum number of text(Enable only when the method of limiting the number of words is activated)

		};
		//Speed or time Parameters ( can be modified )
		var speedOrtime = {
			slideSpeedL_s: 500, 				//Left(next) slip speed
			slideSpeedR_s: 300, 				//Right(back) slip speed
			slide_speed: 300, 					//Click the step button, the page sliding speed
			jump_click_s: 0.92, 				//Step button jump click speed change parameters
			jump_clickCue_t: 2000, 				//Prompt POP display time
			submit_fade_s: 300, 				//Submit button appear / disappear time，please set between 100~1000, or use the default value 300
			backModule_fadeIn_s: 1000, 			//Back button showing speed, please set between 100~1600, or use the default value 1000
			backModule_fadeOut_s: 300           //Back button hiding speed，please set between 100~1000, or use the default value 300
		};
		//Parameters ( cannot be modified )
		var nomodifiable = {
			//Content list prefix identification
			list_prefix: [ 'Radio_', 'Select_', 'Input_', 'Lead_', 'P_', 'Checkbox_', 'Txt_', 'Password_', 'Gap_' ],
			//Content list postion prefix identification
			list_prefix_style: [ 'Cen_', 'L_', 'R_' ],
			//Set style requirements prefix
			_setting: '_setting',
			//Style prefix identification
			formEle_style: [ 'equal:', 'postion:', 'cen_adjust:', 'norequired', 'name:', 'value:', 'width:', 'height:', 'size:', 'font-size:', 'cols:', 'rows:' ],   //不建议调整
			//The initial page number
			init_page: 1
		};
		//Parameters ( cannot be modified )
		var tagName = {
			//Registration form
			select: 'select',
			input: 'input',
			radio: 'radio',
			span: 'span',
			txt: 'textarea',
			checkbox: 'checkbox',
			password: 'password',
			textarea: 'textarea',
			reg_container: 'reg_container',					//Whole
			reg_HeadTit: 'reg_HeadTit',						//Top title
			reg_slider: 'reg_slider',						//Content whole
			reg_slider_turn: 'reg_slider_turn',				//Content move part
			reg_content: 'reg_content',						//Registered contents (step)
			reg_close: "reg_close",							//Close module
			reg_content_img: 'reg_content_img',				//Background picture
			reg_bottom: 'reg_bottom',						//Bottom whole
			button_module: 'button_module',					//Left and right buttons module
			reg_back_module: 'reg_back_module',				//Back button module
			reg_next_module: 'reg_next_module',				//Next button module
			btn_next: 'reg_next',							//Next button
			btn_back: 'reg_back',							//Back button
			btn_submit: 'reg_submit',						//Submit button
			btn_back_module: 'reg_back_module',				//Back button
			step: 'step',									//Step jump part of the whole
			active: 'active',								//Step button selected
			stepchange: 'stepchange',						//Step button clicked
			reg_split_line: 'reg_split_line',				//Dividing line（ Split header and slide content ）
			required: 'required',							//Required identification
			lead: 'reg_lead',								//Lead
			paragraph: 'reg_paragraph'						//Paragraph
		};

		$.fn.extend( {
			"gcxRegslideForm": function( options )
			{
				// Extend with options
				opts = $.extend( true, {}, defaults, speedOrtime, structure, nomodifiable, tagName, content, options );

				//language judgment
				_lanJudge( opts );

				//Check whether the user enters the parameters are legitimate
				if( !isValid( options ) )
				{
					return this;
				}
				return this.each( function()
				{
					//'return' is JQuery object ,this in order to support chain calls
					//each all the DOM to execute

					//plug-in initialization
					_init( opts );
				} );
			}
		} );

		//language judgment
		function _lanJudge( opts )
		{
			if( opts.language == 'en' )
				lan = jQuery.gcxRegslideForm.langs.en;
			if( opts.language == 'zh_ch' )
				lan = jQuery.gcxRegslideForm.langs.zh_ch;
		}

		//Check whether the user enters the parameters are legitimate
		function isValid( options )
		{
			return !options || (options && typeof options === "object") ? true : false;
		}

		var $body = $( 'body' );                                   //body
		var $reg_content = $( '.reg_content' );                    //Registered contents (step)
		var reg_c_l = $reg_content.length;                 		   //Number of registered content (step content)
		var reg_c_w = parseInt( $reg_content.css( "width" ) );     //The width of each registered content (step content)
		var max = (reg_c_l - 1) * reg_c_w;

		/**
		 * plug-in initialization
		 * initialization Include：
		 * 1.Ajax incoming and initial page content list data  /  AJAX is not the case, the user to set their own initial page content list data
		 * 2.Create the entire registration interface (head, middle frame bottom)
		 * 3.Set default display (title, buttons, etc.)
		 * 4.Load user click event method
		 * 5.Common method load (other custom settings)
		 * @param opts            into object opts
		 * @returns none
		 */
		function _init( opts )
		{
			$( '#' + opts.reg_container + '' ).empty();
			//Ajax page initial loading
			$.fn.gcxRegslideForm.ajax_Int_loading( opts, opts.open_reg );

			_build_Whole( opts );
			//Default display
			_DefaultShow( opts );
			//Custom initialization
			$.fn.gcxRegslideForm.customInit( opts );
			//back click
			_reg_back( opts );
			//next click
			_reg_next( opts );
			//step click jump
			_step_click( opts );
			//reg close
			$.fn.gcxRegslideForm.regClose();
		}

		/**
		 * Registration plugin click Close
		 */
		$.fn.gcxRegslideForm.regClose = function()
		{
			$body.on( 'click', '#reg_close', function()
			{
				var $reg_container = $( '#reg_container' );
				$reg_container.animate( { 'opacity': 0 }, 600 );
				$reg_container.animate( { 'top': -1200 }, { duration: 2300, queue: false } );
			} );
		};
		/**
		 * add prefix
		 * @param opts      into object opts
		 * @param value
		 * @param i         Prefix arr num
		 * @returns prefix + value
		 */
		$.fn.gcxRegslideForm.add_prefix = function( opts, value, i )
		{
			return opts.list_prefix[ i ] + value;
		};

		/**
		 * Ajax page initial loading
		 * @param opts
		 */
		$.fn.gcxRegslideForm.ajax_Int_loading = function( opts )
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
						"open_reg": 'open_reg'
					},
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
					complete: function( XMLHttpRequest, status )
					{
						//Timeout, and  status is success, error equivalents
						if( status == 'timeout' )ajaxTimeOut.abort(); 			  //Cancel request
					},
					error: function( XMLHttpRequest, textStatus, data )
					{
						alert( data );
						alert( XMLHttpRequest.status );
						alert( XMLHttpRequest.readyState );
						alert( textStatus );
					}
				} );
			if( !flag )return false
		};

		/**
		 * Custom initialization
		 * @param opts
		 */
		$.fn.gcxRegslideForm.customInit = function( opts )
		{
		};

		/**
		 * Default Show
		 * @param opts
		 */
		var _DefaultShow = function( opts )
		{
			title_change( opts, 1 );   //show first title
			$( '#step' ).find( 'li[ data-num ="1"]' ).addClass( 'active' ); //1st highlight
			$( '#step > div > span' ).html( 'Step 1' );
		};

		/**
		 * Create registration interface ( head, middle frame bottom )
		 * @param opts
		 */
		var _build_Whole = function( opts )
		{
			var $reg_container = $( '#' + opts.reg_container + '' );
			$reg_container.css( { 'width': opts.reg_width, 'height': opts.reg_height } );
			_build_regHead( opts );
			_build_regMiddle( opts );
			_build_regBottom( opts );
			_build_each_frame( opts );//Create each reg-content
		};

		/**
		 * Create header（Close button，split line，background image）
		 * @param opts
		 */
		var _build_regHead = function( opts )
		{
			$( '#' + opts.reg_container + '' ).append( $( "<h1 id=" + opts.reg_HeadTit + ">" + "</h1>" + "<div id=" + opts.reg_close + ">" + "</div>" + "<div id=" + opts.reg_split_line + ">" + "</div>" + "<div class=" + opts.reg_content_img + ">" + "</div>" ) );
			var titmLR = opts.reg_sideMargins - 5;   //定义两边的margin-left/right
			$( '#' + opts.reg_HeadTit + '' ).css( {
				'font-size': parseInt( opts.reg_HeadTitH * 0.8 ),
				'height': opts.reg_HeadTitH,
				'margin': '' + parseInt( opts.reg_HeadTitH / 2 ) + 'px ' + titmLR + 'px',   //Up and down margin = tit height / 2，left and right margin = left and right gap - 5
				'font-weight': '600'
			} );
		};
		/**
		 * Create middle content
		 * @param opts
		 */
		var _build_regMiddle = function( opts )
		{
			$( '#' + opts.reg_container + '' ).append( $( "<div id=" + opts.reg_slider + ">" + "<div id=" + opts.reg_slider_turn + "></div>" + "</div>" ) );
			$( '#' + opts.reg_slider + '' ).css( 'margin', '' + opts.reg_UpLowMargins + 'px ' + opts.reg_sideMargins + 'px' ); //left and right gap
			$( '#' + opts.reg_slider_turn + '' ).css( {
				'width': opts.flip_Num * opts.reg_width,
				'margin-left': 0
			} );
		};
		/**
		 * Create bottom
		 * @param opts
		 */
		var _build_regBottom = function( opts )
		{
			$( '#' + opts.reg_container + '' ).append( $( "<div id=" + opts.reg_bottom + ">" + "</div>" ) );
			$( '#' + opts.reg_bottom + '' ).css( { 'height': opts.reg_bottonH } );
			_build_reg_btnModule( opts, opts.reg_back_module, opts.btn_back );
			_build_reg_botStep( opts );
			_build_reg_btnModule( opts, opts.reg_next_module, opts.btn_next );
		};
		/**
		 * Create a registered next/back button module
		 * @param opts
		 * @param button_moduleId    button module ID
		 * @param btn_Id             button module input ID
		 */
		var _build_reg_btnModule = function( opts, button_moduleId, btn_Id )
		{
			//Create back button，value is Back，or Next
			if( button_moduleId == 'reg_back_module' )
			{
				regBtnValue = 'Back';
				$( '#' + opts.reg_bottom + '' ).append( $( "<div class=" + opts.button_module + " id=" + button_moduleId + ">" + "<input type='button' value=" + regBtnValue + " id=" + btn_Id + " />" + "</div>" ) );
			}
			else if( button_moduleId == 'reg_next_module' )
			{
				regBtnValue = 'Next';
				$( '#' + opts.reg_bottom + '' ).append( $( "<div class=" + opts.button_module + " id=" + button_moduleId + ">" + "<input type='button' value=" + regBtnValue + " id=" + btn_Id + " />" + "<input type='submit' value='Submit' id=" + opts.btn_submit + " />" + "</div>" ) );
				$( '#' + opts.btn_submit + '' ).hide();
			}
			else
			{
				/*When you create a label, because the source code into the parameters were artificially damaged, resulting in the creation of the registry
				 can not successfully create a single part of the pop-up box*/
				$.dialog( 'alert', lan.cue_tit, lan.build_regError, opts.jump_clickCue_t );
			}
			$( '#' + opts.reg_bottom + ' .' + opts.button_module + '' ).css( {
				'width': opts.reg_BtnWidth
			} );
		};
		/**
		 * Create the bottom step-jump-button, step-title, etc.
		 * @param opts
		 */
		var _build_reg_botStep = function( opts )
		{
			$( '#' + opts.reg_bottom + '' ).append( $( "<div id=" + opts.step + ">" + "<div>" + "<span>" + "</span>" + "<ul>" + "</ul>" + "</div>" + "</div>" ) );
			$( '#' + opts.step + '' ).css( { 'width': opts.reg_width - opts.reg_BtnWidth } ); 		//step width = Plug in width - button width
			$( '#' + opts.step + ' div span' ).css( 'line-height', opts.reg_bottonH + 'px' );
			var $stepUl = $( '#' + opts.step + ' div ul' );
			$stepUl.css( 'margin', '' + (opts.reg_bottonH - $stepUl.height()) / 2 + 'px 0' );
			for( var i = 1; i <= opts.flip_Num; i++ )
			{
				$( '#' + opts.reg_bottom + ' div ul' ).append( $( "<li data-num=" + i + ">" + "</li>" ) );
			}
		};
		/**
		 * Create registration every part of the page content
		 * @param opts
		 */
		var _build_each_frame = function( opts )
		{
			for( var i = 1; i <= opts.flip_Num; i++ )
			{
				$( '#' + opts.reg_slider_turn + '' ).append( $( "<div id='reg_" + i + "st' class=" + opts.reg_content + ">" + "</div>" ) );
				//middle height = Total height - botton height - head height*2 - middle gap * 2
				var reg_contentH = opts.reg_height - opts.reg_bottonH - $( '#' + opts.reg_HeadTit + '' ).height() * 2 - opts.reg_UpLowMargins * 2;
				$( '.' + opts.reg_content + '' ).css( {
					'width': $( '#' + opts.reg_slider + '' ).width(),
					'height': reg_contentH
				} );
				_build_formUl( i );  //Create a ul to each module page
				if( i == opts.init_page )   //Page initialization loading, do not modify default page
				{
					$( '#' + opts.reg_container + ' h1' ).html( eval( "opts.tit_" + i + "st" ) );
					/*Switch valve, main function: to determine whether the current step re loading new content page (refresh), only under certain conditions,
					 will open the switch, or when the user clicks to switch after the steps page is not reloaded*/
					build_Switch = true;        //build reg-content switch
					back_Switch = true;      	//back step switch
					next_switch = true;			//next step switch
					clickDif = 2;           	//step button click,  two click interval limit
					/*Create the corresponding form*/
					build_formCont( i, opts );
				}
			}
		};
		/**
		 * Create a ul to each module page
		 * @param i
		 */
		var _build_formUl = function( i )
		{
			$( '#reg_' + i + 'st' ).append( $( "<ul id='reg_" + i + "st_ul' >" + "</ul>" ) );
		};
		/**
		 * Create the corresponding form
		 * @param i         Step num
		 * @param opts
		 */
		var build_formCont = function( i, opts )
		{
			/*Switch valve, main function: to determine whether the current step re loading new content page (refresh), only under certain conditions,
			 will open the switch, or when the user clicks to switch after the steps page is not reloaded, here with the use of public switch_change method,
			 timely switch state after the page loads good*/
			if( !build_Switch )return false;    // return when build reg-content switch is false

			var checkVal = $( 'input:radio[name="objective"]:checked' ).val();
			/*In the specific steps and conditions, AJAX upload data and get the page content list data*/
			$.fn.gcxRegslideForm.ajax_cont2_loading( opts, i, checkVal );

			/*Get a list of the contents of each part*/
			_reg_content_list( i );
			/*Identification content and processing content list*/
			_handle_conList( opts, reg_content );
			/*In each step, according to the content list, create the corresponding form*/
			_buildPart_content( opts, new_conList, i );
			//step switch change
			$.fn.gcxRegslideForm.switch_change( opts, i );
		};

		/**
		 * ajax load the specified step contne
		 * @param opts
		 * @param i         page step
		 * @param val
		 */
		$.fn.gcxRegslideForm.ajax_cont2_loading = function( opts, i, val )
		{
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

		/**
		 * Get a list of the contents in each part
		 * @param i
		 */
		var _reg_content_list = function( i )
		{
			reg_content = eval( "opts.cont_step" + (i) + "" ); 				//Gets a list of contents to be added in each slide page
			// The type of list of contents in each sliding page is object ? also its typeof is not null
			if( typeof reg_content == 'object' && reg_content !== null )return reg_content;
			else return reg_content = [];
			/* or return [] */
		};

		/**
		 * Processing content list array
		 * @param opts
		 * @param arr
		 */
		var _handle_conList = function( opts, arr )
		{
			new_conList = [];
			$.each( arr, function( i, value )
			{
				/*the object's head is Radio_ select_ input_...............are to be retained ,others are be deleted*/
				for( var v = 0; v < opts.list_prefix.length; v++ )
				{
					if( value.indexOf( opts.list_prefix[ v ] ) == 0 )
					{
						new_conList.push( value );
					}
				}
			} );
		};

		/**
		 * 根据 内容列表清单，创建相应的表单内容
		 * @param opts
		 * @param arr     into content arr
		 * @param i       page step
		 */
		var _buildPart_content = function( opts, arr, i )
		{
			//return conditional judgment of dynamically generated pages
			$.fn.gcxRegslideForm.build_condition( i );
			(function dynJudge( Condition )
			{
				/*In the custom steps, to take the form of dynamic data generation, it is necessary to flexible changes, with the operation of the page
				 will change at any time. so return back-switch is true */
				if( Condition )
				{
					if( back_Switch )
					{
						return loadCommand = true;
					}
					else
					{
						return loadCommand = false;
					}
				}
				else
				{
					//If the current page has not been added to the form, the switch is turned on and off
					if( $( '#reg_' + i + 'st_ul' ).is( ":empty" ) )
						return loadCommand = true;
					else
						return loadCommand = false;
				}
			})( ajaxPage );
			//console.log( 'loadCommand：', loadCommand, 'back_Switch：', back_Switch,i );

			if( loadCommand )   //Load command is turned on
			{
				//console.log( 'LoadCommand is open，so loading success...' );
				$( '#reg_' + i + 'st_ul' ).empty();
				$.each( arr, function( j, value )
				{
					if( value.indexOf( opts.list_prefix[ 0 ] ) == 0 )_build_radio( opts, i, j, value, 0 );
					/* Head start with Radio_, create radio */

					if( value.indexOf( opts.list_prefix[ 1 ] ) == 0 )_build_select( opts, value, i, j, 1 );
					/* Head start with Select_, create Select */

					if( value.indexOf( opts.list_prefix[ 2 ] ) == 0 )_build_input( opts, value, i, j, 2 );
					/* create Input */

					if( value.indexOf( opts.list_prefix[ 3 ] ) == 0 )_build_lead( opts, value, i, j );
					/* create Lead */

					if( value.indexOf( opts.list_prefix[ 4 ] ) == 0 )_build_paragraph( opts, value, i, j, 4 );
					/* create Paragraph */

					if( value.indexOf( opts.list_prefix[ 5 ] ) == 0 )_build_checkbox( opts, value, i, j, 5 );
					/* create Checkbox */

					if( value.indexOf( opts.list_prefix[ 6 ] ) == 0 )_build_textarea( opts, value, i, j, 6 );
					/* create Textarea */

					if( value.indexOf( opts.list_prefix[ 7 ] ) == 0 )_build_password( opts, value, i, j, 7 );
					/* create Input（ type = password ） */

					if( value.indexOf( opts.list_prefix[ 8 ] ) == 0 )_build_gap( opts, value, i, j, 8 );
					/* create Gap */
				} );
				//Set the distance between each content in the registry
				$( '#reg_' + i + 'st_ul li' ).css( {
					'font-size': opts.reg_MiddleFS + 'px',
					'margin': '' + opts.reg_liMarginTB + 'px 0'
				} );
				/*Custom change when current step is loaded*/
				$.fn.gcxRegslideForm.customChange( opts, i );
				/*Custom build when current step is loaded*/
				$.fn.gcxRegslideForm.customBuild( opts, i );

				back_Switch = true;   			//When current step is loaded ,back switch is turn on.
			}
		};

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

		/**
		 * Custom build
		 * @param opts
		 * @param i
		 */
		$.fn.gcxRegslideForm.customBuild = function( opts, i )
		{
			if( i == 2 )$( "#reg_slider_turn select[name='nationality']" ).parent().parent().css( 'margin-top', 26 );   //set margin-top
		};

		/**
		 * Cut string and delete header prefix
		 * @param start            start postion
		 * @param value        Processing object
		 * @returns {string}
		 */
		function del_head( start, value )
		{
			return value.substr( start, value.length );
		}

		/**
		 * Create radio module
		 * @param opts    into opts
		 * @param i       page step
		 * @param j       content arr num
		 * @param value   current value
		 * @param k       prefix identification num
		 */
		function _build_radio( opts, i, j, value, k )
		{
			/* default name：the space is modified as _
			 display value:title case
			 value：the value after cutting */
			var new_val = del_head( opts.list_prefix[ 0 ].length, value );  //Cut string and delete header prefix
			/*Create radio module（ li > div > input + label ）*/
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "' >" + "<div>" + "<input class='notnull' id='reg_" + i + "st_" + opts.radio + "" + j + "' type='radio' name =" + strSpace_line( new_val ) + " />" + "<label for ='reg_" + i + "st_" + opts.radio + "" + j + "'>" + Title_case( new_val ) + "</label>" + "</div>" + "</li>" ) );
			/*set the style of radio*/
			$( '#reg_' + i + 'st_li' + j + ' div ' + opts.input + '' ).val( new_val );
			$( '#reg_' + i + 'st_li' + j + ' div ' + opts.input + '[type=' + opts.radio + ']' ).css( 'border', 'none' );
			$( '#reg_' + i + 'st_li' + j + ' div' ).css( {
				"display": "inline-block",
				"*display": "inline",
				"zoom": "1"
			} );
			/*After radio module created,custom form error message*/
			$.fn.gcxRegslideForm.errorTxtStyle( opts.input, opts.radio, opts, i, j );
			/*Determine whether object(the style array of the object which is need to set + _setting ) is exists, according to the array, add its style*/
			_judgePro_arr( new_val, opts, i, j, k );
		}

		/**
		 * Create select module
		 * @param opts    into opts
		 * @param value   current value
		 * @param i       page step
		 * @param j       content arr num
		 * @param k       prefix identification num
		 */
		function _build_select( opts, value, i, j, k )
		{
			var new_val = del_head( opts.list_prefix[ 1 ].length, value );
			/*Create select module（ li > div > p + select(option) ）*/
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "'>" + "<div>" + "<p>" + Title_case( new_val ) + "<span class='required'>" + " *" + "</span>" + "：" + "</p>" + "<select class='notnull' id='reg_" + i + "st_" + opts.select + "" + j + "' name=" + strSpace_line( new_val ) + " >" + "</select>" + "</div>" + "</li>" ) );

			$( '#reg_' + i + 'st_li' + j + ' div ' + opts.select + '' ).css( 'width', opts.iptdefWidth );   //default width is 155
			$( '#reg_' + i + 'st_ul li div' ).css( { "display": "inline-block", "*display": "inline", "zoom": "1" } );

			/*Get option which is marry select form the option-array(user settings, namely: option content)*/
			var arr_option = eval( 'opts.' + strSpace_line( new_val ) + '_opt' + '' );
			var $reg_select = $( '#reg_' + i + 'st_li' + j + ' div select' );

			/*If the user sets the contents of the select-option, display settings, otherwise display the default option*/
			arr_option === undefined ?
				$reg_select.append( $( "<option value= " + lan.optDefSelect + " >" + lan.optDefSelect + "</option>" ) ) :
				$.each( arr_option, function( x, value )
				{
					if( x == 0 )
					{
						if( value == lan.optDefSelect )		 // if the 1st is 'Please select' or '请选择'
						{
							$reg_select.append( $( "<option value= ''>" + value + "</option>" ) )
						}
						else
						{
							$reg_select.append( $( "<option value= " + value + ">" + value + "</option>" ) );
						}
					}
					else
						$reg_select.append( $( "<option value= " + value + " >" + value + "</option>" ) );
				} );
			$.fn.gcxRegslideForm.errorTxtStyle( opts.select, opts.select, opts, i, j );
			_judgePro_arr( new_val, opts, i, j, k );
		}

		/**
		 * Create input module
		 * @param opts    into opts
		 * @param value   current value
		 * @param i       page step
		 * @param j       content arr num
		 * @param k       prefix identification num
		 */
		function _build_input( opts, value, i, j, k )
		{
			var new_val = del_head( opts.list_prefix[ 2 ].length, value );
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "'>" + "<div>" + "<p>" + Title_case( new_val ) + "<span class='required'>" + " *" + "</span>" + "：" + "</p>" + "<input class='notnull' type='text' id='reg_" + i + "st_" + opts.input + "" + j + "' value='' name=" + strSpace_line( new_val ) + " />" + "</div>" + "</li>" ) );

			$( '#reg_' + i + 'st_li' + j + ' div ' + opts.input + '' ).css( 'width', opts.iptdefWidth );
			$( '#reg_' + i + 'st_ul li div' ).css( { "display": "inline-block", "*display": "inline", "zoom": "1" } );

			$.fn.gcxRegslideForm.errorTxtStyle( opts.input, opts.input, opts, i, j );
			_judgePro_arr( new_val, opts, i, j, k );
		}

		/**
		 * Create lead module
		 * @param opts    into opts
		 * @param value   current value
		 * @param i       page step
		 * @param j       content arr num
		 */
		function _build_lead( opts, value, i, j )
		{
			var new_val = del_head( opts.list_prefix[ 3 ].length, value );
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "' >" + "<div>" + "<span class=" + opts.lead + ">" + new_val + "</span>" + "</div>" + "</li>" ) );
			$( '#' + opts.reg_slider_turn + ' .' + opts.reg_content + ' ul li .' + opts.lead + '' ).css( {               //set font-size and margin when created
				'font-size': opts.reg_leadFs + 'px',
				'line-height': opts.reg_leadL + 'px'
			} );
		}

		/**
		 * Create paragraph module
		 * @param opts    into opts
		 * @param value   current value
		 * @param i       page step
		 * @param j       content arr num
		 * @param k       prefix identification num
		 */
		function _build_paragraph( opts, value, i, j, k )
		{
			var new_val = del_head( opts.list_prefix[ 4 ].length, value );
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "' >" + "<div>" + "<span  id='#reg_" + i + "st_paragraph" + j + "' class=" + opts.paragraph + ">" + Title_case( new_val ) + "</span>" + "<span class='required'>" + " *" + "</span>" + "</div>" + "</li>" ) );

			_judgePro_arr( new_val, opts, i, j, k );
		}

		/**
		 * Create checkbox module
		 * @param opts    into opts
		 * @param value   current value
		 * @param i       page step
		 * @param j       content arr num
		 * @param k       prefix identification num
		 */
		function _build_checkbox( opts, value, i, j, k )
		{
			var new_val = del_head( opts.list_prefix[ 5 ].length, value );
			/*Create checkbox module（ li > div > label >input(checkbox) ）*/
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "' >" + "<div>" + "<label>" + "<input class='notnull' type='checkbox' id='reg_" + i + "st_" + opts.checkbox + "" + j + "' name =" + strSpace_line( new_val ) + " value='' />" + Title_case( new_val ) + "</label>" + "</div>" + "</li>" ) );
			$( '#reg_' + i + 'st_li' + j + ' div input' ).val( new_val );
			$( '#reg_' + i + 'st_li' + j + ' div' ).css( {
				"display": "inline-block",
				"*display": "inline",
				"zoom": "1"
			} );
			$.fn.gcxRegslideForm.errorTxtStyle( opts.input, opts.checkbox, opts, i, j );
			_judgePro_arr( new_val, opts, i, j, k );
		}

		/**
		 * Create textarea module
		 * @param opts    into opts
		 * @param value   current value
		 * @param i       page step
		 * @param j       content arr num
		 * @param k       prefix identification num
		 */
		function _build_textarea( opts, value, i, j, k )
		{
			var new_val = del_head( opts.list_prefix[ 6 ].length, value );
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "'>" + "<div>" + "<p>" + Title_case( new_val ) + "<span class='required'>" + " *" + "</span>" + "：" + "</p>" + "<textarea id='reg_" + i + "st_" + opts.textarea + "" + j + "' class='notnull' name=" + strSpace_line( new_val ) + " />" + "</div>" + "</li>" ) );
			$( '#reg_' + i + 'st_ul li div' ).css( { "display": "inline-block", "*display": "inline", "zoom": "1" } );
			/*set float to the left of module(p) in order to make this floating in the top */
			$( '#reg_' + i + 'st_li' + j + ' div p' ).css( 'float', 'left' );
			$( '#reg_' + i + 'st_li' + j + ' div ' + opts.textarea + '' ).css( {
				'width': opts.iptdefWidth
			} );
			$.fn.gcxRegslideForm.errorTxtStyle( opts.textarea, opts.textarea, opts, i, j );
			_judgePro_arr( new_val, opts, i, j, k );
		}

		/**
		 * Create input（type：password） module
		 * @param opts    into opts
		 * @param value   current value
		 * @param i       page step
		 * @param j       content arr num
		 * @param k       prefix identification num
		 */
		function _build_password( opts, value, i, j, k )
		{
			var new_val = del_head( opts.list_prefix[ 7 ].length, value );
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "'>" + "<div>" + "<p>" + Title_case( new_val ) + "<span class='required'>" + " *" + "</span>" + "：" + "</p>" + "<input class='notnull' type='password' id='reg_" + i + "st_" + opts.password + "" + j + "' value='' name=" + strSpace_line( new_val ) + " />" + "</div>" + "</li>" ) );

			$( '#reg_' + i + 'st_li' + j + ' div ' + opts.input + '' ).css( 'width', opts.iptdefWidth );
			$( '#reg_' + i + 'st_ul li div' ).css( { "display": "inline-block", "*display": "inline", "zoom": "1" } );

			$.fn.gcxRegslideForm.errorTxtStyle( opts.input, opts.password, opts, i, j );
			_judgePro_arr( new_val, opts, i, j, k );
		}

		/**
		 * Create gap module
		 * @param opts    into opts
		 * @param value   current value
		 * @param i       page step
		 * @param j       content arr num
		 * @param k       prefix identification num
		 */
		function _build_gap( opts, value, i, j, k )
		{
			var new_val = del_head( opts.list_prefix[ 8 ].length, value );
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "' >" + "</li>" ) );
			/* Set the height of gap 的高度*/
			var gap_H = $( '#reg_' + i + 'st_li' + (j - 1) + '' ).height();
			var $gap = $( '#reg_' + i + 'st_li' + j + '' );
			gap_H == 19 ? $gap.css( 'height', gap_H + 3 ) : $gap.css( "height", gap_H );  //if its default height is 19,add 3,or use its height

			_judgePro_arr( new_val, opts, i, j, k );
		}

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

		/**
		 * form error message display
		 * @param ele        object1
		 * @param ele2       object2
		 * @param opts
		 * @param i         page step
		 * @param j         content array current num
		 */
		var _errorTxtStyle = function( ele, ele2, opts, i, j )
		{
			/*Default lost focus*/
			$( '#reg_' + i + 'st_li' + j + ' div ' + ele + '' ).blur( function()
			{
				var formerror = '#reg_' + i + 'st_' + ele2 + '' + j + '-error';
				var errortext = $( '#reg_' + i + 'st_li' + j + ' div ' + formerror + '' );
				if( errortext.is( ':visible' ) )   //Operate on each object whith contain class 'visible'(need rely on validate.js)
				{
					var reg_li = $( '#reg_' + i + 'st_li' + j + '' );
					reg_li.height() == 19 ? reg_li.css( 'height', reg_li.height() + 3 ) : reg_li.css( "height", reg_li.height() );
					errortext.css( { 'height': reg_li.height() } );
					/*contents show : get object form head to index of n,and add '...' in its tail*/
					errortext.text( errortext.text().substring( 0, opts.txtNum ) + "..." );
					return false;
				}
			} )
		};

		/**
		 * Determine whether object(the style array of the object which is need to set + _setting ) is exists, according to the array, add its style
		 * @param new_val    processed val
		 * @param opts
		 * @param i       page step
		 * @param j       content arr num
		 * @param k       prefix identification num
		 */
		function _judgePro_arr( new_val, opts, i, j, k )
		{
			//Replace all special symbola with '_',and add '_setting'
			var arr_Style = eval( 'opts.' + Specialsym_line( new_val ) + opts._setting + '' );

			if( arr_Style !== undefined )  //existence
			{
				/*To manipulate the array of styles,put objects whitch heead of 'equal:', 'postion:', 'cen_adjust:' in front of  style array */
				arr_StyleHandle( arr_Style, opts );
				//console.log( newStyleArr );
				$.each( newStyleArr, function( n, value )
				{
					for( var v = 0; v < opts.formEle_style.length; v++ )
					{
						_setStyleAll( opts, value, v, i, j, k );    //Add style based on content
					}
				} );
			}
			else
			{
				return false
			}
		}

		/**
		 * Manipulate styles array
		 * @param arr
		 * @param opts
		 */
		function arr_StyleHandle( arr, opts )
		{
			//Remove duplicate
			//$.unique( arr );
			//找出符合条件的数组元素，获取其value，并删除，放入数组头部
			var newArr = [];
			var newHarr0 = [];
			var newHarr1 = [];
			var newHarr2 = [];
			/*First,each of the original array into the new array，follow step,operation is for the new array,
			 the original array does not need to align the operation to ensure the integrity of the parameters.*/
			for( var j = 0; j < arr.length; j++ )
			{
				newArr.push( arr[ j ] )
			}
			/*In the new array created in the previous step,Perform three loop searches,if the prefix meets the requirements,push to another array,
			 and delete it in the new array.*/
			for( var i = 0; i < arr.length; i++ )
			{
				if( arr[ i ].indexOf( opts.formEle_style[ 0 ] ) == 0 )
				{
					newHarr0.push( arr[ i ] );
					newArr.splice( i, 1 );
				}
			}
			for( var k = 0; k < arr.length; k++ )
			{
				if( arr[ k ].indexOf( opts.formEle_style[ 1 ] ) == 0 )
				{
					newHarr1.push( arr[ k ] );
					newArr.splice( k, 1 );
				}
			}
			for( var l = 0; i < arr.length; l++ )
			{
				if( arr[ l ].indexOf( opts.formEle_style[ 2 ] ) == 0 )
				{
					newHarr2.push( arr[ l ] );
					newArr.splice( l, 1 );
				}
			}
			//console.log( newHarr0, newHarr1, newHarr2 );
			//Merge the 4 arrays in a specific order，Order as follows：equal：xx    postion：xx    cen_adjust: xx   other........
			arr1 = newHarr2.concat( newArr );
			arr2 = newHarr1.concat( arr1 );
			newStyleArr = newHarr0.concat( arr2 );
			return newStyleArr
		}

		/**
		 * Set style
		 * @param opts    into opts
		 * @param value   current value
		 * @param v       the style arr num
		 * @param i       page step
		 * @param j       content arr num
		 * @param k       prefix identification num
		 */
		function _setStyleAll( opts, value, v, i, j, k )
		{
			if( value.indexOf( opts.formEle_style[ v ] ) == 0 )   //If this value have a prefix in its head
			{
				select_style = remove_spaces( value.substr( 0, opts.formEle_style[ v ].length - 1 ) ); //Cutting style name, and removes leading and trailing spaces
				new_optStyle = remove_spaces( value.substr( opts.formEle_style[ v ].length, value.length ) ); //Cutting style attribute values, and removes leading and trailing spaces
				//Judge object（input，radio，select....），set style
				_judgeObj_setpro( opts, v, i, j, k );
			}
		}

		/**
		 * Judge object（input，radio，select....），set style
		 * @param opts    into opts
		 * @param v       the style arr num
		 * @param i       page step
		 * @param j       content arr num
		 * @param k       prefix identification num
		 */
		function _judgeObj_setpro( opts, v, i, j, k )
		{
			//set option height
			function _setOption_H( n )
			{
				if( v == n )$( '#reg_' + i + 'st_li' + j + ' div ' + opts.select + ' option' ).css( select_style, new_optStyle );
			}

			//set input height
			function _setIpt_H( n )
			{
				if( v == n )$( '#reg_' + i + 'st_li' + j + ' div ' + opts.input + '' ).css( select_style, new_optStyle );
			}

			if( k == 1 )  			//select
			{
				_set_property( v, i, j, k, opts.select );
				_setOption_H( 7 );
			}
			else if( k == 4 )   	//paragraph
			{
				_set_property( v, i, j, k, opts.span );
			}
			else if( k == 6 )   	//textarea
			{
				_set_property( v, i, j, k, opts.txt );
			}
			else if( k == 8 )   	//gap
			{
				if( v == 0 )
				{
					//Gap is only a width property, mainly used to fill the blank part
					var reg_Li = $( '#reg_' + i + 'st_li' + j + '' );
					reg_Li.css( 'width', reg_Li.width() / parseFloat( new_optStyle ) );
				}
			}
			else    			//others: radio / input text password /checkbox
			{
				_set_property( v, i, j, k, opts.input );
				_setIpt_H( 7 );
			}
		}

		/**
		 * Set properties to objects（input，radio，select...）
		 * @param v       the style arr num
		 * @param i       page step
		 * @param j       content arr num
		 * @param k       prefix identification num
		 * @param obj     form obj
		 */
		function _set_property( v, i, j, k, obj )
		{
			//set equal
			if( v == 0 )
			{
				var reg_Li = $( '#reg_' + i + 'st_li' + j + '' );
				reg_Li.css( 'width', reg_Li.width() / parseFloat( new_optStyle ) );
			}
			//set postion（left,right center）
			if( v == 1 )
			{
				if( new_optStyle == 'center' )Cen_( opts, k, i, j );
				if( new_optStyle == 'left' )$( '#reg_' + i + 'st_li' + j + '' ).css( 'text-align', 'left' );
				if( new_optStyle == 'right' )$( '#reg_' + i + 'st_li' + j + '' ).css( 'text-align', 'right' );
			}
			//set center adjustment value
			if( v == 2 )
			{
				var reg_LiDiv = $( '#reg_' + i + 'st_li' + j + ' div' );
				reg_LiDiv.css( 'margin-left', parseFloat( reg_LiDiv.css( 'margin-left' ) ) * parseFloat( new_optStyle ) );//设置margin-left 值 = 原始值 * 居中调整值
			}
			//delete name and delete required identification
			if( v == 3 )
			{
				$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).removeAttr( 'name' ).removeClass( 'notnull' );
				var $require_marking = $( '#reg_' + i + 'st_li' + j + ' div .required' );
				/*If it have the required identification ,delete it,otherwise delete its parents(p) of all elements*/
				$require_marking.length !== 0 ? $require_marking.remove() : $( '#reg_' + i + 'st_li' + j + ' div p span' ).empty();
			}
			//change name
			if( v == 4 )$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).attr( select_style, new_optStyle );

			//change value
			if( v == 5 )$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).attr( select_style, new_optStyle );

			//set width
			if( v == 6 )$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).css( select_style, new_optStyle );

			//set option size in select
			if( v == 8 )$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).attr( "size", new_optStyle );

			//set font-size
			if( v == 9 )$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).css( select_style, new_optStyle + 'px' );

			//set rows
			if( v == 10 )
			{
				$( '#reg_' + i + 'st_li' + j + ' div textarea' ).css( 'width', '' );   //first empty width
				$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).attr( "cols", new_optStyle );
			}
			//set cols
			if( v == 11 )$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).attr( "rows", new_optStyle );
		}

		/**
		 * set center
		 * The central position of each display is not changed with the prompt information of the form validation(fixed postion)
		 * @param opts
		 * @param k       prefix identification num
		 * @param i       page step
		 * @param j       content arr num
		 */
		function Cen_( opts, k, i, j )
		{
			_reg_liDivWidth( opts, k, i, j );
			reg_liWidth = $( '#reg_' + i + 'st_li' + j + '' ).width();  		// Actual display content width ( li > div )
			var marginL = parseInt( (reg_liWidth - reg_liDivWidth) / 2 ); 		//(total width - content width) / 2
			$( '#reg_' + i + 'st_li' + j + ' div' ).css( 'margin-left', marginL );
		}

		/**
		 * return object border-Width
		 * @param obj
		 * @returns {Number}
		 */
		function borderW( obj )
		{
			var borderW = parseInt( obj.css( 'borderWidth' ) ) * 2;
			if( isNaN( borderW ) )
				return parseInt( obj.css( 'border-left-width' ) );  //IE firefox
			else
				return parseInt( obj.css( 'borderWidth' ) ) * 2;   //Google Chrome  Opera  Safari
		}

		/**
		 * Get each part of the actual display width
		 * @param opts
		 * @param k       prefix identification num
		 * @param i       page step
		 * @param j       content arr num
		 */
		function _reg_liDivWidth( opts, k, i, j )
		{
			var $regUlIpt = $( '#reg_' + i + 'st_li' + j + ' div input' );
			var $regUlSel = $( '#reg_' + i + 'st_li' + j + ' div select' );
			var $regUllabel = $( '#reg_' + i + 'st_li' + j + ' div label' );
			var $regUltextarea = $( '#reg_' + i + 'st_li' + j + ' div textarea' );
			var $regUlp = $( '#reg_' + i + 'st_li' + j + ' div p' );
			//radio
			if( k == 0 )return reg_liDivWidth = $regUllabel.width() + $regUlIpt.width() + borderW( $regUlIpt );
			//select
			if( k == 1 )return reg_liDivWidth = $regUlp.width() + $regUlSel.width() + borderW( $regUlSel );
			//input（type =text / password ）
			if( k == 2 || k == 7 )return reg_liDivWidth = $regUlp.width() + $regUlIpt.width() + borderW( $regUlIpt );
			//lead
			if( k == 3 )return reg_liDivWidth = $( '#reg_' + i + 'st_ul li div .' + opts.lead + '' ).width();
			//paragraph
			if( k == 4 )return reg_liDivWidth = $( '#reg_' + i + 'st_ul li div span.' + opts.paragraph + '' ).width();
			//checkbox
			if( k == 5 )return reg_liDivWidth = $regUllabel.width() + parseInt( $regUllabel.css( 'padding-left' ) ) * 2 + 10;
			//textarea
			if( k == 6 )return reg_liDivWidth = $regUlp.width() + $regUltextarea.width() + borderW( $regUltextarea );
		}

		/**
		 * Margin-left
		 * @param opts
		 * @returns {number}
		 */
		function Reg_slider_margL( opts )
		{
			return margL = parseInt( $( '#' + opts.reg_slider_turn + '' ).css( 'margin-left' ) );
		}

		/**
		 * Max magrin-left
		 * @param opts
		 * @returns {number}
		 */
		function reg_slider_MaxMargL( opts )
		{
			reg_c_w = parseInt( $( '.' + opts.reg_content + '' ).css( "width" ) );
			return max = (opts.flip_Num - 1) * reg_c_w;
		}

		/**
		 * margin-left % reg-width  (normal val is 0)
		 * @return {number}
		 */
		function Reg_slider_modulo()
		{
			return modulo = margL % reg_c_w;
		}

		//margin-left Add
		function margL_add()
		{
			margL += reg_c_w;
		}

		// margin-left Reduce
		function margL_reduce()
		{
			return margL -= reg_c_w;
		}

		/**
		 * sure step
		 * @return {number}
		 */
		function Sure_step()
		{
			return x = -margL / reg_c_w + 1;   //确定第几个步骤
		}

		/**
		 * Step highlight，display current page
		 * @param opts
		 * @param x        step parameter
		 */
		function Highlight( opts, x )
		{
			$( '#' + opts.step + ' ul li.' + opts.active + '' ).removeClass( opts.active );   	// remove all highlight
			var stepCircle = $( '#' + opts.step + ' div ul li[data-num="' + x + '"]' );
			stepCircle.addClass( opts.active );  		//highlight
			stepCircle.addClass( opts.stepchange );
			$( '#' + opts.step + ' div ul li[data-num="' + (x - 1) + '"]' ).addClass( opts.stepchange );
			$( '#' + opts.step + ' span' ).html( "Step " + x );
		}

		/**
		 * Next click
		 * @param opts
		 */
		var _reg_next = function( opts )
		{
			$( '#' + opts.btn_next + '' ).on( 'click', function()
			{
				Reg_slider_margL( opts );				//get margin-left
				reg_slider_MaxMargL( opts );			//get max margin-left
				Reg_slider_modulo();					//get  margin-left % width
				if( -margL < max && modulo == 0 )    	//Move in the normal range，and modulo is 0
				{
					if( margL < -max )return false;  	//When the magrin value of the mobile is less than -max,return
					margL_reduce( opts ); 				//Reduce margin-left
					Sure_step();  						//sure step(x)
					/*Check the current page of the form form all the required steps are completed*/
					_presentCompleted( x );
					/*Check next-switch flase/true*/
					if( !next_switch )return false;

					displayPart_move( opts.reg_slider_turn, opts.slideSpeedL_s );    //move
					Highlight( opts, x );
					back_Switch = true;          	//Back marker switch on
					/*Next , changes in each step*/
					next_each_change( opts, x );
					Default_Postion( x );   		//Get current location (x)
				}
				if( -margL > max )  				//Move beyond the limit, pop-up prompt box
				{
					$.dialog( 'alert', lan.cue_tit, lan.build_regError, opts.jump_clickCue_t );     //Source parameters are artificially destroyed
				}
			} )
		};

		/**
		 * 用户上一步点击 back
		 * @param opts
		 */
		var _reg_back = function( opts )
		{
			$( '#' + opts.btn_back + '' ).on( 'click', function()
			{
				Reg_slider_margL( opts );
				reg_slider_MaxMargL( opts );
				Reg_slider_modulo();
				if( -margL <= max && modulo == 0 )
				{
					if( margL > 0 )return false;
					margL_add( opts );    				//Margin-left add
					//版块滑动
					displayPart_move( opts.reg_slider_turn, opts.slideSpeedR_s );
					Sure_step();
					Highlight( opts, x );
					back_Switch = false;             //Back marker closed
					/*Back , changes in each step*/
					back_each_change( opts, x );
				}
				if( -margL > max )
				{
					$.dialog( 'alert', lan.cue_tit, lan.build_regError, opts.jump_clickCue_t );
				}
			} )
		};

		/**
		 * Step click jump
		 * @param opts
		 */
		var _step_click = function( opts )
		{
			var step_btn = $( '#' + opts.step + ' div ul li' );
			Default_Postion( opts.init_page );   					// Get current location,Initial page loading is 1
			step_btn.each( function( i )
			{
				$( this ).click( function()
				{
					// Judge whether the current position is between 1 and the total number of pages
					if( Def_Postion >= 1 && Def_Postion <= opts.flip_Num )
					{
						/*The difference between the click position and the last click position (or initial position) is less than 2，it's jump click,，
						can not exercise the corresponding function。*/
						if( i + 1 - Def_Postion < clickDif )
						{
							//Custom on the first page
							if( i == 0 )
							{
								$.fn.gcxRegslideForm.customFirstStep( opts, i + 1 );
							}
							//console.log( Def_Postion ,i + 1)
							/*Click on the check before all the steps of the page, all the required form is completed*/
							_AllbeforeCompleted( i, Def_Postion );
							if( !next_switch )return false;   //next-switch    Turn off ? return

							Reg_slider_margL( opts );
							reg_slider_MaxMargL( opts );
							Reg_slider_modulo();
							if( -margL <= max && modulo == 0 )
							{
								if( margL < -max || margL > 0 )return false;
								margL = -reg_c_w * i;
								//Determine whether to click back，backSwitch turn on,or closed ,so this page is not usually on reloading the page
								Def_Postion > i + 1 ? back_Switch = false : back_Switch = true;

								Sure_step();
								Highlight( opts, x );
								/*Next , changes in each step*/
								next_each_change( opts, x );
								//Uniform move
								equal_Move( opts, x );
								/*When click to the last page (i.e., all the pages are loaded), changes the clickDif off, when the next click, click on both span much,
								will not pop up error information. The disadvantages are as follows: when the user selects a different key option, which refreshes the list of the new content list loaded by the activation,
								the skip click causes the associated page to not display properly.*/
								//if( i == opts.flip_Num - 1)
								//{
								//	clickDif = opts.flip_Num;
								//}
							}
						}
						else
						{
							$.dialog( 'alert', lan.cue_tit, lan.jump_clickCue, opts.jump_clickCue_t );   //step jump click, alert Prompt message
						}
					}
					else
					{
						$.dialog( 'alert', lan.cue_tit, lan.build_regError, opts.jump_clickCue_t );
					}
				} );
			} );
		};

		/**
		 * Check the current page of the form form all the required steps are completed
		 * @param i
		 */
		function _presentCompleted( i )
		{
			/*The current page contains all the required traversal of the elements of class, to find whether they contain valid tags
			(user has been operating correctly fill in elements), as long as there is an element does not meet the requirements,
			 the output false, can not be used in the next page of the operation completed*/
			$( '#reg_' + (i - 1) + 'st_ul .notnull' ).each( function()
			{
				if( $( this ).hasClass( 'valid' ) )next_switch = true;
				if( !$( this ).hasClass( 'valid' ) )
				{
					$.dialog( 'alert', lan.cue_tit, lan.inspect_complete, opts.jump_clickCue_t );     	//Not all correctly filled，alert
					next_switch = false;
				}
			} );
		}

		/**
		 * Click on the check before all the steps of the page, all the required form is completed
		 * @param i
		 * @param n
		 */
		function _AllbeforeCompleted( i, n )
		{
			if( i + 1 > n )     //back click?
			{
				for( var j = 0; j <= i; j++ )
				{
					$( '#reg_' + j + 'st_ul .notnull' ).each( function()
					{
						if( $( this ).hasClass( 'valid' ) )next_switch = true;
						if( !$( this ).hasClass( 'valid' ) )
						{
							$.dialog( 'alert', lan.cue_tit, lan.allbefore_completed, opts.jump_clickCue_t );
							next_switch = false;
							return false
						}
					} );
				}
			}
			else
			{
				next_switch = true;
			}
		}

		/**
		 * Current location	( When used, relative to the next click )
		 * @param x
		 * @returns {number}
		 */
		var Default_Postion = function( x )
		{
			return Def_Postion = x;
		};

		/**
		 * Uniform move
		 * @param opts
		 * @param x
		 */
		function equal_Move( opts, x )
		{
			var dif = Math.abs( x - Def_Postion ); 			 //Every click，click postion - last time postion
			Default_Postion( x );   						 //set initial value = current click step num
			var equ_speed = opts.slide_speed * dif;          //Base speed * difference val
			dif >= 2 ? equ_speed = equ_speed * opts.jump_click_s : equ_speed;  		 //if jump click ,need reduce its speed
			displayPart_move( opts.reg_slider_turn, equ_speed );           			 //slide
		}

		/**
		 * Next changes in each step
		 * @param opts
		 * @param x
		 */
		function next_each_change( opts, x )
		{
			if( x == 1 )
			{
				//back input Modular hide
				regBackModule_hide( opts );
				//submit button hide，reg top tit change
				submitHide_TitChange( opts, x );
				//Create the corresponding form content
				build_formCont( x, opts );
				//first step,custom change
				$.fn.gcxRegslideForm.customFirstStep( opts, x );
				return false;
			}
			else if( x == opts.flip_Num )
			{
				//back input Modular show
				regBackModule_show( opts );
				submitShow_TitChange( opts, x );
				build_formCont( x, opts );
				return false;
			}
			else
			{
				regBackModule_show( opts );
				submitHide_TitChange( opts, x );
				build_formCont( x, opts );
				return false;
			}
		}

		/**
		 * Back changes in each step
		 * @param opts
		 * @param x
		 */
		function back_each_change( opts, x )
		{
			if( x == 1 )
			{
				regBackModule_hide( opts );
				title_change( opts, x );
				$.fn.gcxRegslideForm.customFirstStep( opts, x );
				return false;
			}
			else
			{
				if( x == opts.flip_Num - 1 )
				{
					submitHide_TitChange( opts, x );
					build_formCont( x, opts );
					return false;
				}
				else
				{
					title_change( opts, x );
					return false;
				}
			}
		}

		/**
		 * First step,custom change
		 * @param opts
		 * @param x
		 */
		$.fn.gcxRegslideForm.customFirstStep = function( opts, x )
		{
			$( '#reg_' + x + 'st_ul li input[type=radio]' ).change( function()
			{
				$( '#' + opts.step + ' ul li.' + opts.stepchange + '' ).removeClass( opts.stepchange );
			} )
		};

		/**
		 * Show the title of the registration plugin
		 * @param opts
		 * @param i
		 */
		function title_change( opts, i )
		{
			var reg_topTit = eval( "opts.tit_" + i + "st" );  //Get current key = 'tit_ i st' + tit content
			/*val（string）：single title*/
			if( typeof reg_topTit == 'string' )
			{
				$( '#' + opts.reg_container + ' #' + opts.reg_HeadTit + '' ).html( reg_topTit );
			}
			/*object（arr）：Multiple headings( heading array )，function needs to be classified to add the title.*/
			else if( typeof reg_topTit == 'object' )
			{
				$.fn.gcxRegslideForm.custom_multipleTit( opts, reg_topTit );
			}
			/*The content of the current title format does not meet the requirements, the user needs to reset*/
			else
				$( '#' + opts.reg_container + ' #' + opts.reg_HeadTit + '' ).html( lan.tit_error );
		}

		/**
		 * Custom arr title
		 * @param opts
		 * @param titArr      tit arr
		 */
		$.fn.gcxRegslideForm.custom_multipleTit = function( opts, titArr )
		{
			/*When the title needs to change dynamically with the user's choice of operation, the user to set the title of the array,
			it is necessary to judge and change the public extension methods, can operate on their own*/
			var reg_tit = $( '#' + opts.reg_container + ' #' + opts.reg_HeadTit + '' );
			if( $( "input[name='objective']:checked" ).val() == 'I want to post recruiting/enrollment/coopration information' )
				reg_tit.html( titArr[ 1 ] );
			else reg_tit.html( titArr[ 0 ] );
		};

		/**
		 * Show submit Modular and tit change
		 * @param opts
		 * @param i
		 */
		function submitShow_TitChange( opts, i )
		{
			title_change( opts, i );
			$( '#' + opts.btn_next + '' ).hide();
			var reg_submit = $( '#' + opts.btn_submit + '' );
			lan.submit_fade_s >= 100 && lan.submit_fade_s <= 1000 ? reg_submit.fadeIn( opts.submit_fade_s ) : reg_submit.fadeIn( 300 );
		}

		/**
		 * Hide submit modular and tit change
		 * @param opts
		 * @param i
		 */
		function submitHide_TitChange( opts, i )
		{
			title_change( opts, i );
			$( '#' + opts.btn_submit + '' ).hide();
			var reg_next = $( '#' + opts.btn_next + '' );
			lan.submit_fade_s >= 100 && lan.submit_fade_s <= 1000 ? reg_next.fadeIn( opts.submit_fade_s ) : reg_next.fadeIn( 300 );
		}

		/**
		 * Reg back button modular display
		 * @param opts
		 */
		function regBackModule_show( opts )
		{
			var move_dis = ($( '#' + opts.reg_container + '' ).width() - $( '.' + opts.button_module + '' ).width() * 2) / 2 - 15;   //set center
			$( '#' + opts.step + ' div' ).animate( { 'margin-left': move_dis + 'px' }, opts.slideSpeedL_s );    //botton center display area move
			var btn_back_module = $( '#' + opts.btn_back_module + '' );
			//设置的 返回按钮出现 时间 在100到1600之间，则正常使用此参数，否则选取默认值 900 进行传参
			opts.backModule_fadeIn_s >= 100 && opts.backModule_fadeIn_s <= 1600 ? btn_back_module.fadeIn( opts.backModule_fadeIn_s ) : btn_back_module.fadeIn( 900 );
		}

		/**
		 * 注册插件 上一步按钮模块隐藏
		 * @param opts
		 */
		function regBackModule_hide( opts )
		{
			//step 区域移动
			$( '#' + opts.step + ' div' ).animate( { 'margin-left': 0 }, opts.slideSpeedL_s * 2 );
			var btn_back_module = $( '#' + opts.btn_back_module + '' );
			/*Back button hiding speed, please set between 100~1600, or use the default value 3000*/
			opts.backModule_fadeOut_s >= 100 && opts.backModule_fadeOut_s <= 1600 ? btn_back_module.fadeOut( opts.backModule_fadeOut_s ) : btn_back_module.fadeOut( 300 );
		}

		/**
		 * reg content slide
		 * @param slider
		 * @param speed
		 */
		function displayPart_move( slider, speed )
		{
			$( '#' + slider + '' ).animate( { 'margin-left': margL }, speed, 'swing' );
		}

		/**
		 * Title case
		 * @param value
		 * @returns {string}
		 */
		function Title_case( value )
		{
			str_case = value.substr( 0, 1 ).toUpperCase() + value.substr( 1, value.length - 1 );
			return str_case;
		}

		/**
		 * Underline replace spaces
		 * @param value
		 * @returns {string}
		 */
		function strSpace_line( value )
		{
			var reg = / /g;
			new_str = value.replace( reg, '_' );
			return new_str;
		}

		/**
		 * Underline replace special characters
		 * @param value
		 * @returns {string}
		 */
		function Specialsym_line( value )
		{
			var reg = /[&\|\\\*^%$?!;`.+></#@\- ]/g;
			new_str = value.replace( reg, '_' );
			return new_str;
		}

		/**
		 * Removing leading and trailing whitespace
		 * @param value
		 * @returns {string}
		 */
		function remove_spaces( value )
		{
			return $.trim( value );
		}
	}
) );

