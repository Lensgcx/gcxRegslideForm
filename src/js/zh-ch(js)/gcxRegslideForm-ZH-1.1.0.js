/*
 +----------------------------------------------------------------------------------------------------------------------------------------------
 * jQuery gcxRegslideForm Plugin v1.1.0
 * Plugin Introduce ：This plugin is based on jQuery development, using the plugin page form, according to user needs, custom plug-in content,
 * 					  with the help of validate, can be dynamically to verify the form and submit verification.
 * Copyright (c) 2016 - 2017  高仓雄（gcx / Spring of broccoli）   In Hangzhou, China
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
			//语言判断
			language: 'zh_ch'
		};
		var structure = {
			flip_Num: 4,						//总页数
			txtNum: 20,							//表单验证错误提示，文字最大数量(只有在激活公共方法限制字数的时候才启用)
			reg_width: 700,						//注册插件整体宽度
			reg_height: 500,					//注册插件整体高度
			reg_HeadTitH: 30,					//注册 头部标题高度
			reg_sideMargins: 30,				//注册插件整体 两侧留白
			reg_UpLowMargins: 15,				//注册插件整体 上下留白
			reg_bottonH: 60,					//注册插件 底部高度
			reg_BtnWidth: 100,					//注册插件  两个按钮 宽度
			reg_MiddleFS: 16,					//注册插件 中间内容部分 字体大小
			reg_liMarginTB: 8,					//注册插件 中间每条内容 之间 间距
			reg_leadFs: 20,						//注册插件 导语字体大小
			reg_leadL: 28,						//注册插件 导语字体间距
			iptdefWidth: 155					//input默认宽度
		};
		//可以修改
		var speedOrtime = {
			slideSpeedL_s: 500, 				//向左滑动速度 next
			slideSpeedR_s: 300, 				//向左滑动速度 back
			slide_speed: 300, 					//点击下方step 按钮，页面滑动速度*/
			jump_click_s: 0.92, 				//对下方step 按钮 大跨度点击 动画速度进行降速/提速*/
			jump_clickCue_t: 2000, 				//对下方step 按钮 大跨度点击后，弹出的提示框存在时间*/
			submit_fade_s: 300, 				//提交按钮出现/消失时间，为了美观，请设置在100~1000之间，不然采用默认值 300*/
			backModule_fadeIn_s: 1000, 			//返回按钮出现 速度，为了美观，请设置在100~1600之间，不然采用默认值 1000*/
			backModule_fadeOut_s: 300           //返回按钮消失 速度，为了美观，请设置在100~1000之间，不然采用默认值 300*/
		};
		//不可修改
		var nomodifiable = {
			//内容列表清单 前缀标识
			list_prefix: [ 'Radio_', 'Select_', 'Input_', 'Lead_', 'P_', 'Checkbox_', 'Txt_', 'Password_', 'Gap_' ], //不建议调整
			//内容列表清单 前缀 位置排布 标识
			list_prefix_style: [ 'Cen_', 'L_', 'R_' ],
			//input select radio 等 需要设置样式 的 前缀
			_setting: '_setting',
			//样式数组  前缀标识
			formEle_style: [ 'equal:', 'postion:', 'cen_adjust:', 'norequired', 'name:', 'value:', 'width:', 'height:', 'size:', 'font-size:', 'cols:', 'rows:' ],   //不建议调整
			//初始 页码
			init_page: 1
		};
		//不建议修改
		var tagName = {
			//注册 表单部件
			select: 'select',
			input: 'input',
			radio: 'radio',
			span: 'span',
			txt: 'textarea',
			checkbox: 'checkbox',
			password: 'password',
			textarea: 'textarea',
			reg_container: 'reg_container',					//注册 表单整体
			reg_HeadTit: 'reg_HeadTit',						//注册 表单头部  标题
			reg_slider: 'reg_slider',						//注册 表单  下方内容整体
			reg_slider_turn: 'reg_slider_turn',				//注册 表单  内容移动部分
			reg_content: 'reg_content',						//注册 表单  每块注册内容（步骤内容）
			reg_close: "reg_close",							//注册 表单  关闭模块
			reg_content_img: 'reg_content_img',				//注册 表单  背景图片 （默认为公司logo）
			reg_bottom: 'reg_bottom',						//注册 表单 底部整体
			button_module: 'button_module',					//左右按钮整体
			reg_back_module: 'reg_back_module',				//back 按钮模块整体
			reg_next_module: 'reg_next_module',				//next 按钮模块整体
			btn_next: 'reg_next',							//下一步按钮
			btn_back: 'reg_back',							//返回按钮
			btn_submit: 'reg_submit',						//提交按钮
			btn_back_module: 'reg_back_module',				//返回按钮 整体模块
			step: 'step',									//创建底部 step跳转部分整体
			active: 'active',								//step 按钮 选中
			stepchange: 'stepchange',						//step 按钮 点击过的按钮
			reg_split_line: 'reg_split_line',				//注册表单  分割线（分割  头部标题 和 滑动内容 ）
			required: 'required',							//必填标识
			lead: 'reg_lead',								//导语
			paragraph: 'reg_paragraph'						//段落
		};
		$.fn.extend( {
			"gcxRegslideForm": function( options )
			{
				// Extend with options
				opts = $.extend( true, {}, defaults, speedOrtime, structure, nomodifiable, tagName, content, options );

				//判断  语言
				_lanJudge( opts );

				//检测用户传进来的参数是否合法
				if( !isValid( options ) )
				{
					return this;
				}
				return this.each( function()
				{  //这里的this 就是 jQuery对象。这里return 为了支持链式调用
					//遍历所有的要执行的dom,当调用 函数插件的是一个集合的时候。

					//插件准备
					_init( opts );
				} );
			}
		} );

		//语言判断选择
		function _lanJudge( opts )
		{
			if( opts.language == 'en' )
				lan = jQuery.gcxRegslideForm.langs.en;
			if( opts.language == 'zh_ch' )
				lan = jQuery.gcxRegslideForm.langs.zh_ch;
		}

		//私有方法，检测参数是否合法
		function isValid( options )
		{
			return !options || (options && typeof options === "object") ? true : false;
		}
		var $body = $( 'body' );                                   //body
		var $reg_content = $( '.reg_content' );                   //每块注册内容（步骤内容）
		var reg_c_l = $reg_content.length;                 		  //每块注册内容（步骤内容） 的 数量
		var reg_c_w = parseInt( $reg_content.css( "width" ) );   //每块注册内容（步骤内容） 的 宽度 取整
		var max = (reg_c_l - 1) * reg_c_w;

		/**
		 * 插件准备初始化
		 * 准备包括：
		 * 1.ajax 传入并且获取初始页面内容列表数据  /  非ajax传入情况下，用户自己设置初始页面内容列表数据
		 * 2.建立整个注册界面 （头部，中间框架  底部）
		 * 3.设定默认显示（标题，按钮等）
		 * 4.载入用户点击事件方法
		 * 5.公共方法载入（其他自定义设定）
		 * @param opts            传入参数对象opts
		 * @returns none
		 */
		function _init( opts )
		{
			//先将容器清空
			$( '#' + opts.reg_container + '' ).empty();
			//ajax 页面初始加载（上传open_reg参数唤醒，下载获取初始页面内容列表 数据）
			$.fn.gcxRegslideForm.ajax_Int_loading( opts, opts.open_reg );
			//建立整个注册界面 （头部，中间框架  底部）
			_build_Whole( opts );
			//默认显示
			_DefaultShow( opts );
			//公共方法，
			$.fn.gcxRegslideForm.customInit( opts );
			//向前点击
			_reg_back( opts );
			//向后点击
			_reg_next( opts );
			//step 按钮点击 跳转
			_step_click( opts );
			//注册关闭
			$.fn.gcxRegslideForm.regClose();
		}

		/**
		 * 注册插件 点击关闭
		 */
		$.fn.gcxRegslideForm.regClose = function()
		{
			//整体点击关闭
			$body.on( 'click', '#reg_close', function()
			{
				var $reg_container = $( '#reg_container' );
				$reg_container.animate( {
					'opacity': 0
				}, 600 );
				$reg_container.animate( {
					'top': -1200
				}, {
					duration: 2300,
					queue: false
				} );
			} );
		};
		/**
		 * 添加前缀
		 * @param opts    传入参数对象opts
		 * @param value    添加前缀的对象value
		 * @param i        前缀数组的序列参数
		 * @returns 前缀 + value
		 */
		$.fn.gcxRegslideForm.add_prefix = function( opts, value, i )
		{
			return opts.list_prefix[ i ] + value;
		};

		/**
		 * ajax 页面初始加载（上传open_reg参数唤醒，下载获取初始页面内容列表 数据）
		 * @param opts    传入参数对象opts
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
						$.each( data.cont_step1, function( n, value )    //每个option去寻找  自己对应的 xx_setting 样式设置选项
						{
							//遍历，第一个前缀加上Load_,其余的加上Radio_
							//add_prefix 方法（）添加前缀
							n == 0 ? intLoadCont.push( $.fn.gcxRegslideForm.add_prefix( opts, value, 3 ) ) : intLoadCont.push( $.fn.gcxRegslideForm.add_prefix( opts, value, 0 ) );
						} );
						flag = false;  //关闭阀门，防止二次添加
						return opts.cont_step1 = intLoadCont;  //输出结果
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
		 * 公共方法，用户自定义调整界面和参数
		 * @param opts    传入参数对象opts
		 */
		$.fn.gcxRegslideForm.customInit = function( opts )
		{
		};

		/**
		 * 界面模块默认显示
		 * @param opts    传入参数对象opts
		 */
		var _DefaultShow = function( opts )
		{
			title_change( opts, 1 );  //显示第一个 标题
			$( '#step' ).find( 'li[ data-num ="1"]' ).addClass( 'active' );    //默认第一个高亮
			$( '#step > div > span' ).html( 'Step 1' );       			//显示step1
		};

		/**
		 * 建立整个注册界面 （头部，中间框架  底部）
		 * @param opts    传入参数对象opts
		 */
		var _build_Whole = function( opts )
		{
			var $reg_container = $( '#' + opts.reg_container + '' );
			//设置 注册插件 整体  宽度和高度
			$reg_container.css( { 'width': opts.reg_width, 'height': opts.reg_height } );
			//创建 头部标题 关闭按钮 分割线 背景图片
			_build_regHead( opts );
			//创建中间内容模块以及其下的滑动模块
			_build_regMiddle( opts );
			//创建底部
			_build_regBottom( opts );
			//创建每部分的 reg_content
			_build_each_frame( opts );
		};

		/**
		 * 创建 头部标题 关闭按钮 分割线 背景图片
		 * @param opts    传入参数对象opts
		 */
		var _build_regHead = function( opts )
		{
			$( '#' + opts.reg_container + '' ).append( $( "<h1 id=" + opts.reg_HeadTit + ">" + "</h1>" + "<div id=" + opts.reg_close + ">" + "</div>" + "<div id=" + opts.reg_split_line + ">" + "</div>" + "<div class=" + opts.reg_content_img + ">" + "</div>" ) );
			//设置注册插件的主标题的样式
			var titmLR = opts.reg_sideMargins - 5;   //定义两边的margin-left/right
			$( '#' + opts.reg_HeadTit + '' ).css( {
				'font-size': parseInt( opts.reg_HeadTitH * 0.8 ),
				'height': opts.reg_HeadTitH,
				'margin': '' + parseInt( opts.reg_HeadTitH / 2 ) + 'px ' + titmLR + 'px',   //上下margin为标题高度的一半，左右margin为左右留白宽度 - 5
				'font-weight': '600'
			} );
		};
		/**
		 * 创建中间内容模块以及其下的滑动模块
		 * @param opts    传入参数对象opts
		 */
		var _build_regMiddle = function( opts )
		{
			$( '#' + opts.reg_container + '' ).append( $( "<div id=" + opts.reg_slider + ">" + "<div id=" + opts.reg_slider_turn + "></div>" + "</div>" ) );
			//设置  注册插件整体 两侧留白
			$( '#' + opts.reg_slider + '' ).css( 'margin', '' + opts.reg_UpLowMargins + 'px ' + opts.reg_sideMargins + 'px' );
			//设置  注册插件滑动部分 的 样式
			$( '#' + opts.reg_slider_turn + '' ).css( {
				'width': opts.flip_Num * opts.reg_width,
				'margin-left': 0
			} );
		};
		/**
		 * 创建底部模块
		 * @param opts    传入参数对象opts
		 */
		var _build_regBottom = function( opts )
		{
			$( '#' + opts.reg_container + '' ).append( $( "<div id=" + opts.reg_bottom + ">" + "</div>" ) );
			//设置底部按钮 高度和宽度
			$( '#' + opts.reg_bottom + '' ).css( { 'height': opts.reg_bottonH } );   //设置底部高度
			//创建 注册 back 按钮模块
			_build_reg_btnModule( opts, opts.reg_back_module, opts.btn_back );
			//创建底部 step跳转按钮，step标题等
			_build_reg_botStep( opts );
			//创建 注册 next 按钮模块
			_build_reg_btnModule( opts, opts.reg_next_module, opts.btn_next );
		};
		/**
		 * 创建 注册 next/back 按钮模块
		 * @param opts            传入参数对象opts
		 * @param button_moduleId    按钮模块ID
		 * @param btn_Id            按钮模块子标签input ID
		 */
		var _build_reg_btnModule = function( opts, button_moduleId, btn_Id )
		{
			//如果是建立back 按钮，则value 为Back，否则为Next
			if( button_moduleId == 'reg_back_module' )
			{
				regBtnValue = 'Back';
				$( '#' + opts.reg_bottom + '' ).append( $( "<div class=" + opts.button_module + " id=" + button_moduleId + ">" + "<input type='button' value=" + regBtnValue + " id=" + btn_Id + " />" + "</div>" ) );
			}
			else if( button_moduleId == 'reg_next_module' )
			{
				regBtnValue = 'Next';
				$( '#' + opts.reg_bottom + '' ).append( $( "<div class=" + opts.button_module + " id=" + button_moduleId + ">" + "<input type='button' value=" + regBtnValue + " id=" + btn_Id + " />" + "<input type='submit' value='Submit' id=" + opts.btn_submit + " />" + "</div>" ) );
				//隐藏submit按钮
				$( '#' + opts.btn_submit + '' ).hide();
			}
			else
			{
				//创建标签时候，因为源代码传入的参数被人为破坏，而造成无法顺利创建注册表单各个部件，弹出的提示框
				$.dialog( 'alert', lan.cue_tit, lan.build_regError, opts.jump_clickCue_t );
			}
			//设置按钮 高度和宽度
			$( '#' + opts.reg_bottom + ' .' + opts.button_module + '' ).css( {
				'width': opts.reg_BtnWidth
			} );
		};
		/**
		 * 创建底部 step 跳转 按钮，step标题等
		 * @param opts    传入参数对象opts
		 */
		var _build_reg_botStep = function( opts )
		{
			$( '#' + opts.reg_bottom + '' ).append( $( "<div id=" + opts.step + ">" + "<div>" + "<span>" + "</span>" + "<ul>" + "</ul>" + "</div>" + "</div>" ) );
			$( '#' + opts.step + '' ).css( { 'width': opts.reg_width - opts.reg_BtnWidth } ); 		//设置中间step 区域宽度为 插件整体宽度 - 按钮宽度
			$( '#' + opts.step + ' div span' ).css( 'line-height', opts.reg_bottonH + 'px' );
			var $stepUl = $( '#' + opts.step + ' div ul' );
			$stepUl.css( 'margin', '' + (opts.reg_bottonH - $stepUl.height()) / 2 + 'px 0' );  		//margin上下值为（botton模块总高度-ul总高度）/2
			for( var i = 1; i <= opts.flip_Num; i++ )
			{
				$( '#' + opts.reg_bottom + ' div ul' ).append( $( "<li data-num=" + i + ">" + "</li>" ) );
			}
		};
		/**
		 * 创建注册插件每部分的翻页内容
		 * @param opts    传入参数对象opts
		 */
		var _build_each_frame = function( opts )
		{
			for( var i = 1; i <= opts.flip_Num; i++ )
			{
				$( '#' + opts.reg_slider_turn + '' ).append( $( "<div id='reg_" + i + "st' class=" + opts.reg_content + ">" + "</div>" ) );
				//中间高度 = 总高度 - 底部高度 - 头部高度（头部标题高度 * 2）- 中间内容区域上下留白高度 * 2
				var reg_contentH = opts.reg_height - opts.reg_bottonH - $( '#' + opts.reg_HeadTit + '' ).height() * 2 - opts.reg_UpLowMargins * 2;
				//设置  reg_content 的宽度 和 高度
				$( '.' + opts.reg_content + '' ).css( {
					'width': $( '#' + opts.reg_slider + '' ).width(),
					'height': reg_contentH
				} );
				//创建ul 到 各个翻页模块
				_build_formUl( i );
				//页面初始化加载的时候，首先只加载 默认设定页码（这里默认为1，建议不要改动，可能会出错） 的内容
				if( i == opts.init_page )
				{
					//加载初始化标题
					$( '#' + opts.reg_container + ' h1' ).html( eval( "opts.tit_" + i + "st" ) );
					/*开关阀门，主要作用：确定当前步骤是否重新加载新的内容页面（即 刷新），只有在特定条件下，才会打开开关，
					 否则在用户前后点击切换的时候，步骤页面是不会重新加载的*/
					build_Switch = true;        //创建页面开关
					back_Switch = true;      	//step 往回点击 开关
					next_switch = true;
					clickDif = 2;           	//初次填写（从step-step4时） step按钮两次点击间隔限制
					//创建 相应的表单内容
					build_formCont( i, opts );
				}
			}
		};
		/**
		 * 创建ul 到 各个翻页模块
		 * @param i    id参数序列
		 */
		var _build_formUl = function( i )
		{
			$( '#reg_' + i + 'st' ).append( $( "<ul id='reg_" + i + "st_ul' >" + "</ul>" ) );
		};
		/**
		 * 创建 相应的表单内容
		 * @param i         特定页码
		 * @param opts    传入参数对象opts
		 */
		var build_formCont = function( i, opts )
		{
			//开关阀门，主要作用：确定当前步骤是否重新加载新的内容页面（即 刷新），只有在特定条件下，才会打开开关，
			// 否则在用户前后点击切换的时候，步骤页面是不会重新加载的，这里要配合 公共方法 switch_change 使用，在页面加载好之后及时切换开关状态

			if( !build_Switch )return false;    //页面开关关闭，直接跳出

			var checkVal = $( 'input:radio[name="objective"]:checked' ).val();
			//根据相关条件  特定步骤页面 ajax上传数据并获取页面内容列表 数据
			$.fn.gcxRegslideForm.ajax_cont2_loading( opts, i, checkVal );

			//获取各个部分 内容列表
			_reg_content_list( i );
			//识别内容，处理内容列表
			_handle_conList( opts, reg_content );
			//在各个版块内 ， 根据 内容列表清单，创建相应的表单内容
			_buildPart_content( opts, new_conList, i );
			//页面开关的更改
			$.fn.gcxRegslideForm.switch_change( opts, i );
		};

		/**
		 * 自定义后续页面ajax上传数据并获取页面内容列表数据
		 * @param opts    传入参数对象opts
		 * @param i         特定页码
		 * @param val    上传后端的val值用于交互数据
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
							//生成 第二部分 内容列表数据（select）
							$.each( data.cont_step2, function( n, value )
							{
								//添加前缀并且推入内容列表数组中
								LoadCont2.push( $.fn.gcxRegslideForm.add_prefix( opts, value, 1 ) );
							} );
							//生成 第四部分 个人内容列表数据
							var build_4stLsit1 = function( data, opts )
							{
								$.each( data.cont_step4_1, function( n, value )
								{
									//添加前缀并且推入内容列表数组中
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
							//生成 第四部分 企业内容列表数据
							var build_4stLsit2 = function( data, opts )
							{
								$.each( data.cont_step4_2, function( n, value )
								{
									//添加前缀并且推入内容列表数组中
									LoadCont4_2.push( $.fn.gcxRegslideForm.add_prefix( opts, value, 2 ) );
								} );
							};

							//生成 第四部分 select 下拉框 内容列表数据
							_storageToArr( data.marriage_opt, LoadCont4_1_opt1 );
							_storageToArr( data.education_opt, LoadCont4_1_opt2 );

							var checkVal = $( 'input:radio[name="objective"]:checked' ).val();
							//分情况，获取 data 返回数据 存入到新的数组中去
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
							//输出 各个内容列表数据
							opts.cont_step2 = LoadCont2;
							opts.nationality_opt = LoadCont2_opt;
							opts.marriage_opt = LoadCont4_1_opt1;
							opts.education_opt = LoadCont4_1_opt2;
							flag = false;  //关闭阀门，防止二次添加
						},
						complete: function( XMLHttpRequest, status )
						{
							//Timeout, and  status is success, error equivalents
							if( status == 'timeout' )ajaxTimeOut.abort(); 			  //Cancel request
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
			//获取 data 返回数据 存入到新的数组中去
			function _storageToArr( arr, new_arr )
			{
				$.each( arr, function( n, value )
				{
					new_arr.push( value );   //获取 option 内容列表数据
				} );
			}
		};

		/**
		 * 改变开关阀门的状态，在特定条件下（用户自己定义），才会打开开关，这决定了当界面到当前步骤的时候，是否重新加载新内容
		 * 在当前注册界面下，只有用户在step1中改变radio的值的时候，才会导致step2和step4内容的更替，其他情况下（用户前后点击），是不会重新加载新内容的
		 * @param opts    传入参数对象opts
		 * @param i       特定页码
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
		 * 获取各个部分 内容列表
		 * @param i     特定页码
		 */
		var _reg_content_list = function( i )
		{
			reg_content = eval( "opts.cont_step" + (i) + "" ); //获取每个滑动单页部分，需要添加的 内容列表，以便后续处理
			// 获取每个滑动单页部分的内容列表 是否为 object 类型且不为null，是则输出，否则输出空数组
			if( typeof reg_content == 'object' && reg_content !== null )return reg_content;
			else return reg_content = [];
		};

		/**
		 * 处理内容列表数组，剔除不符合要求的数组内容，生成新的信息列表
		 * @param opts    传入参数对象opts
		 * @param arr     传入内容列表数组
		 */
		var _handle_conList = function( opts, arr )
		{
			new_conList = [];
			$.each( arr, function( i, value )
			{
				//头部以 Radio_ select_ input_  ............... 开头都挑选出来，不满足条件的全部删除
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
		 * @param opts    传入参数对象opts
		 * @param arr     传入内容列表数组
		 * @param i       特定页码
		 */
		var _buildPart_content = function( opts, arr, i )
		{
			//输出 需要采取动态生成表单数据 的 页面条件判断
			$.fn.gcxRegslideForm.build_condition( i );
			(function ss( Condition )
			{
				//在设定的页面中 采取动态生成表单数据，故需要灵活变动，页面随着操作会随时变化，故输出 加载命令为 true
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
					//如果当前页没有被添加过表单内容，则输出 加载命令 为true  反之为false
					if( $( '#reg_' + i + 'st_ul' ).is( ":empty" ) )
						return loadCommand = true;
					else
						return loadCommand = false;
				}
			})( ajaxPage );
			//console.log( 'loadCommand', loadCommand, i );
			//console.log( 'back_Switch', back_Switch, i );
			//判断 加载命令 是否开启
			if( loadCommand )
			{
				//console.log( 'LoadCommand is open，so loading success...' );
				$( '#reg_' + i + 'st_ul' ).empty();
				$.each( arr, function( j, value )
				{
					//头部以 Radio_开头，创建radio
					if( value.indexOf( opts.list_prefix[ 0 ] ) == 0 )_build_radio( opts, i, j, value, 0 );

					//头部以 Select_开头，创建select
					if( value.indexOf( opts.list_prefix[ 1 ] ) == 0 )_build_select( opts, value, i, j, 1 );

					//头部以 Input_开头，创建input
					if( value.indexOf( opts.list_prefix[ 2 ] ) == 0 )_build_input( opts, value, i, j, 2 );

					//头部以 Lead_开头，创建 导语
					if( value.indexOf( opts.list_prefix[ 3 ] ) == 0 )_build_lead( opts, value, i, j );

					//头部以 P_开头，创建  段落
					if( value.indexOf( opts.list_prefix[ 4 ] ) == 0 )_build_paragraph( opts, value, i, j, 4 );

					//头部以 Checkbox_开头，创建 checkbox
					if( value.indexOf( opts.list_prefix[ 5 ] ) == 0 )_build_checkbox( opts, value, i, j, 5 );

					//头部以 Txt_开头，创建 textarea
					if( value.indexOf( opts.list_prefix[ 6 ] ) == 0 )_build_textarea( opts, value, i, j, 6 );

					//头部以 Password_开头，创建 input（ type = password ）
					if( value.indexOf( opts.list_prefix[ 7 ] ) == 0 )_build_password( opts, value, i, j, 7 );

					//头部以 Gap_开头，创建  空白块
					if( value.indexOf( opts.list_prefix[ 8 ] ) == 0 )_build_gap( opts, value, i, j, 8 );

				} );
				//设置  注册插件 中间每条内容 之间 间距以及字体大小
				$( '#reg_' + i + 'st_ul li' ).css( {
					'font-size': opts.reg_MiddleFS + 'px',
					'margin': '' + opts.reg_liMarginTB + 'px 0'
				} );
				//自定义变化
				$.fn.gcxRegslideForm.customChange( opts, i );
				//自定义创建
				$.fn.gcxRegslideForm.customBuild( opts, i );

				back_Switch = true;   //step 往回点击 开关开启
			}
		};

		/**
		 * 输出 需要采取动态生成表单数据的页面  条件
		 * @param i       特定页码
		 * @returns       {boolean}
		 */
		$.fn.gcxRegslideForm.build_condition = function( i )
		{
			//在第2页 和 第4页 采取动态生成表单数据，需要灵活变动，页面随着操作会随时变化
			//若不需要，改为  ajaxPage = null 即可
			return ajaxPage = i == 2 || i == 4;
		};

		/**
		 * 自定义改变特定页面 内容
		 * @param opts    传入参数对象opts
		 * @param i       特定页码
		 */
		$.fn.gcxRegslideForm.customChange = function( opts, i )
		{
			var name = 'nationality';
			var simpleCondition = i == 2;
			if( simpleCondition )
			{
				//这里 删除除了表单本体以外的部分，即：前面的p标签里面的显示内容和必填标志以及冒号
				var simpleObj = $( "[ name = " + name + " ]" );
				simpleObj.parent().find( 'p' ).remove();
				simpleObj.attr( 'size', $( "[ name = " + name + " ] option" ).length );
			}
		};

		/**
		 * 自定义创建扩展操作
		 * @param opts    传入参数对象opts
		 * @param i       特定页码
		 */
		$.fn.gcxRegslideForm.customBuild = function( opts, i )
		{
			if( i == 2 )$( "#reg_slider_turn select[name='nationality']" ).parent().parent().css( 'margin-top', 26 );
		};

		/**
		 * 切割字符串，去掉头部 前缀
		 * @param start    起始位置
		 * @param value       处理对象value
		 * @returns {string}
		 */
		function del_head( start, value )
		{
			return value.substr( start, value.length ); //切割字符串，去掉头部 前缀
		}

		/**
		 * 创建 radio 模块
		 * @param opts    传入参数对象opts
		 * @param i       特定页码
		 * @param j       内容列表数组当前序列
		 * @param value   内容列表数组当前value
		 * @param k       前缀标识序列
		 */
		function _build_radio( opts, i, j, value, k )
		{
			// 默认name值：去空格改为_；
			// 显示值，首字母大写
			// value值：切割字符串后的值
			var new_val = del_head( opts.list_prefix[ 0 ].length, value );  //切割字符串，去掉头部 前缀
			//创建 radio 整个模块（ li > div > input + label ）
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "' >" + "<div>" + "<input class='notnull' id='reg_" + i + "st_" + opts.radio + "" + j + "' type='radio' name =" + strSpace_line( new_val ) + " />" + "<label for ='reg_" + i + "st_" + opts.radio + "" + j + "'>" + Title_case( new_val ) + "</label>" + "</div>" + "</li>" ) );
			//设置radio 的value 值
			$( '#reg_' + i + 'st_li' + j + ' div ' + opts.input + '' ).val( new_val );
			$( '#reg_' + i + 'st_li' + j + ' div ' + opts.input + '[type=' + opts.radio + ']' ).css( 'border', 'none' );
			$( '#reg_' + i + 'st_li' + j + ' div' ).css( {
				"display": "inline-block",
				"*display": "inline",
				"zoom": "1"
			} );
			//公共方法，自定义 表单错误提示信息
			$.fn.gcxRegslideForm.errorTxtStyle( opts.input, opts.radio, opts, i, j );
			//判断是否存在 （需要设置的对象 + _setting 后缀的样式）数组，并且根据设置的数组，添加样式
			_judgePro_arr( new_val, opts, i, j, k );
		}

		/**
		 * 创建 select 模块
		 * @param opts    传入参数对象opts
		 * @param value   内容列表数组当前value
		 * @param i       特定页码
		 * @param j       内容列表数组当前序列
		 * @param k       前缀标识序列
		 */
		function _build_select( opts, value, i, j, k )
		{
			var new_val = del_head( opts.list_prefix[ 1 ].length, value );
			//创建select
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "'>" + "<div>" + "<p>" + Title_case( new_val ) + "<span class='required'>" + " *" + "</span>" + "：" + "</p>" + "<select class='notnull' id='reg_" + i + "st_" + opts.select + "" + j + "' name=" + strSpace_line( new_val ) + " >" + "</select>" + "</div>" + "</li>" ) );

			//默认定义 select 宽度为155
			$( '#reg_' + i + 'st_li' + j + ' div ' + opts.select + '' ).css( 'width', opts.iptdefWidth );
			$( '#reg_' + i + 'st_ul li div' ).css( { "display": "inline-block", "*display": "inline", "zoom": "1" } );

			//获取到 select 对应的 option （用户自己设定的，即：option内容）
			var arr_option = eval( 'opts.' + strSpace_line( new_val ) + '_opt' + '' );
			var $reg_select = $( '#reg_' + i + 'st_li' + j + ' div select' );

			//如果用户设置了 select-option的内容，则显示设置内容，否则显示默认option
			arr_option === undefined ?
				$reg_select.append( $( "<option value= " + lan.optDefSelect + " >" + lan.optDefSelect + "</option>" ) ) :
				$.each( arr_option, function( x, value )
				{
					if( x == 0 )
					{
						if( value == lan.optDefSelect ) /* 若第一条为默认 'Please select'或者 '请选择'*/
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

			//公共方法，自定义 表单错误提示信息
			$.fn.gcxRegslideForm.errorTxtStyle( opts.select, opts.select, opts, i, j );
			//判断是否存在 （需要设置的对象 + _setting 后缀的样式数组），并且根据设置的数组，添加样式
			_judgePro_arr( new_val, opts, i, j, k );
		}

		/**
		 * 创建 input 模块
		 * @param opts    传入参数对象opts
		 * @param value   内容列表数组当前value
		 * @param i       特定页码
		 * @param j       内容列表数组当前序列
		 * @param k       前缀标识序列
		 */
		function _build_input( opts, value, i, j, k )
		{
			var new_val = del_head( opts.list_prefix[ 2 ].length, value );
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "'>" + "<div>" + "<p>" + Title_case( new_val ) + "<span class='required'>" + " *" + "</span>" + "：" + "</p>" + "<input class='notnull' type='text' id='reg_" + i + "st_" + opts.input + "" + j + "' value='' name=" + strSpace_line( new_val ) + " />" + "</div>" + "</li>" ) );

			//默认定义input宽度为155
			$( '#reg_' + i + 'st_li' + j + ' div ' + opts.input + '' ).css( 'width', opts.iptdefWidth );
			$( '#reg_' + i + 'st_ul li div' ).css( { "display": "inline-block", "*display": "inline", "zoom": "1" } );

			//公共方法，自定义 表单错误提示信息
			$.fn.gcxRegslideForm.errorTxtStyle( opts.input, opts.input, opts, i, j );
			//判断是否存在 （需要设置的对象 + _setting 后缀的样式数组），并且根据设置的数组，添加样式
			_judgePro_arr( new_val, opts, i, j, k );
		}

		/**
		 * 创建 Lead 导语 模块
		 * @param opts    传入参数对象opts
		 * @param value   内容列表数组当前value
		 * @param i       特定页码
		 * @param j       内容列表数组当前序列
		 */
		function _build_lead( opts, value, i, j )
		{
			// 显示值：切割字符串后的值
			var new_val = del_head( opts.list_prefix[ 3 ].length, value );  //切割字符串，去掉头部
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "' >" + "<div>" + "<span class=" + opts.lead + ">" + new_val + "</span>" + "</div>" + "</li>" ) );
			//设置导语字体大小 和 字体上下间距
			$( '#' + opts.reg_slider_turn + ' .' + opts.reg_content + ' ul li .' + opts.lead + '' ).css( {
				'font-size': opts.reg_leadFs + 'px',
				'line-height': opts.reg_leadL + 'px'
			} );
		}

		/**
		 * 创建段落 paragraph 模块
		 * @param opts    传入参数对象opts
		 * @param value   内容列表数组当前value
		 * @param i       特定页码
		 * @param j       内容列表数组当前序列
		 * @param k       前缀标识序列
		 */
		function _build_paragraph( opts, value, i, j, k )
		{
			var new_val = del_head( opts.list_prefix[ 4 ].length, value );
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "' >" + "<div>" + "<span  id='#reg_" + i + "st_paragraph" + j + "' class=" + opts.paragraph + ">" + Title_case( new_val ) + "</span>" + "<span class='required'>" + " *" + "</span>" + "</div>" + "</li>" ) );

			//判断是否存在 （需要设置的对象 + _setting 后缀的样式数组），并且根据设置的数组，添加样式
			_judgePro_arr( new_val, opts, i, j, k );
		}

		/**
		 * 创建 checkbox 模块
		 * @param opts    传入参数对象opts
		 * @param value   内容列表数组当前value
		 * @param i       特定页码
		 * @param j       内容列表数组当前序列
		 * @param k       前缀标识序列
		 */
		function _build_checkbox( opts, value, i, j, k )
		{
			var new_val = del_head( opts.list_prefix[ 5 ].length, value );
			//添加radio 表单整个模块（ li > div > input + label ）
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "' >" + "<div>" + "<label>" + "<input class='notnull' type='checkbox' id='reg_" + i + "st_" + opts.checkbox + "" + j + "' name =" + strSpace_line( new_val ) + " value='' />" + Title_case( new_val ) + "</label>" + "</div>" + "</li>" ) );
			//设置radio 的value 值
			$( '#reg_' + i + 'st_li' + j + ' div input' ).val( new_val );
			$( '#reg_' + i + 'st_li' + j + ' div' ).css( {
				"display": "inline-block",
				"*display": "inline",
				"zoom": "1"
			} );
			//公共方法，自定义 表单错误提示信息
			$.fn.gcxRegslideForm.errorTxtStyle( opts.input, opts.checkbox, opts, i, j );
			//判断是否存在 （需要设置的对象 + _setting 后缀的样式数组），并且根据设置的数组，添加样式
			_judgePro_arr( new_val, opts, i, j, k );
		}

		/**
		 * 创建 textarea 模块
		 * @param opts    传入参数对象opts
		 * @param value   内容列表数组当前value
		 * @param i       特定页码
		 * @param j       内容列表数组当前序列
		 * @param k       前缀标识序列
		 */
		function _build_textarea( opts, value, i, j, k )
		{
			var new_val = del_head( opts.list_prefix[ 6 ].length, value );
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "'>" + "<div>" + "<p>" + Title_case( new_val ) + "<span class='required'>" + " *" + "</span>" + "：" + "</p>" + "<textarea id='reg_" + i + "st_" + opts.textarea + "" + j + "' class='notnull' name=" + strSpace_line( new_val ) + " />" + "</div>" + "</li>" ) );
			$( '#reg_' + i + 'st_ul li div' ).css( { "display": "inline-block", "*display": "inline", "zoom": "1" } );
			//添加左边浮动，使前面标题上浮顶格
			$( '#reg_' + i + 'st_li' + j + ' div p' ).css( 'float', 'left' );
			$( '#reg_' + i + 'st_li' + j + ' div ' + opts.textarea + '' ).css( {
				'width': opts.iptdefWidth
			} );
			//公共方法，自定义 表单错误提示信息
			$.fn.gcxRegslideForm.errorTxtStyle( opts.textarea, opts.textarea, opts, i, j );
			//判断是否存在 （需要设置的对象 + _setting 后缀的样式数组），并且根据设置的数组，添加样式
			_judgePro_arr( new_val, opts, i, j, k );
		}

		/**
		 * 创建 input（type：password） 模块
		 * @param opts    传入参数对象opts
		 * @param value   内容列表数组当前value
		 * @param i       特定页码
		 * @param j       内容列表数组当前序列
		 * @param k       前缀标识序列
		 */
		function _build_password( opts, value, i, j, k )
		{
			var new_val = del_head( opts.list_prefix[ 7 ].length, value );
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "'>" + "<div>" + "<p>" + Title_case( new_val ) + "<span class='required'>" + " *" + "</span>" + "：" + "</p>" + "<input class='notnull' type='password' id='reg_" + i + "st_" + opts.password + "" + j + "' value='' name=" + strSpace_line( new_val ) + " />" + "</div>" + "</li>" ) );

			//默认定义input宽度为155
			$( '#reg_' + i + 'st_li' + j + ' div ' + opts.input + '' ).css( 'width', opts.iptdefWidth );
			$( '#reg_' + i + 'st_ul li div' ).css( { "display": "inline-block", "*display": "inline", "zoom": "1" } );

			//公共方法，自定义 表单错误提示信息
			$.fn.gcxRegslideForm.errorTxtStyle( opts.input, opts.password, opts, i, j );
			//判断是否存在 （需要设置的对象 + _setting 后缀的样式数组），并且根据设置的数组，添加样式
			_judgePro_arr( new_val, opts, i, j, k );
		}

		/**
		 * 创建 空白块 gap 模块
		 * @param opts    传入参数对象opts
		 * @param value   内容列表数组当前value
		 * @param i       特定页码
		 * @param j       内容列表数组当前序列
		 * @param k       前缀标识序列
		 */
		function _build_gap( opts, value, i, j, k )
		{
			var new_val = del_head( opts.list_prefix[ 8 ].length, value );
			$( '#reg_' + i + 'st_ul' ).append( $( "<li id='reg_" + i + "st_li" + j + "' >" + "</li>" ) );

			/*设置空白块 gap 的高度*/
			var gap_H = $( '#reg_' + i + 'st_li' + (j - 1) + '' ).height();
			var $gap = $( '#reg_' + i + 'st_li' + j + '' );
			gap_H == 19 ? $gap.css( 'height', gap_H + 3 ) : $gap.css( "height", gap_H );  //默认高度19的情况下 + 3

			//判断是否存在 （需要设置的对象 + _setting 后缀的样式数组），并且根据设置的数组，添加样式
			_judgePro_arr( new_val, opts, i, j, k );
		}

		/**
		 * 自定义 表单验证错误信息模块
		 * @param ele        特定页码
		 * @param ele2       内容列表数组当前序列
		 * @param opts         传入参数对象opts
		 * @param i         特定页码
		 * @param j         内容列表数组当前序列
		 */
		$.fn.gcxRegslideForm.errorTxtStyle = function( ele, ele2, opts, i, j )
		{
			//_errorTxtStyle(ele, ele2, opts, i, j);
		};

		/**
		 * 表单验证错误信息模块 显示设置
		 * @param ele        特定页码
		 * @param ele2       内容列表数组当前序列
		 * @param opts         传入参数对象opts
		 * @param i         特定页码
		 * @param j         内容列表数组当前序列
		 */
		var _errorTxtStyle = function( ele, ele2, opts, i, j )
		{
			//表单   的情况下
			$( '#reg_' + i + 'st_li' + j + ' div ' + ele + '' ).blur( function()
			{
				var formerror = '#reg_' + i + 'st_' + ele2 + '' + j + '-error';
				var errortext = $( '#reg_' + i + 'st_li' + j + ' div ' + formerror + '' );
				if( errortext.is( ':visible' ) )   //判断有没有，有的话进行操作
				{
					var reg_li = $( '#reg_' + i + 'st_li' + j + '' );
					//设置高度
					reg_li.height() == 19 ? reg_li.css( 'height', reg_li.height() + 3 ) : reg_li.css( "height", reg_li.height() );  //默认高度 + 3
					errortext.css( { 'height': reg_li.height() } );
					//显示内容截取前 n 个，尾部加上...
					errortext.text( errortext.text().substring( 0, opts.txtNum ) + "..." );
					return false;
				}
			} )

		};

		/**
		 * 判断是否存在 （需要设置的对象 + _setting 后缀的样式数组），并且根据设置的数组，添加样式
		 * @param new_val    表单名称字符串
		 * @param opts         传入参数对象opts
		 * @param i         特定页码
		 * @param j         内容列表数组当前序列
		 * @param k        前缀标识序列
		 */
		function _judgePro_arr( new_val, opts, i, j, k )
		{
			//当前 需要设置的对象 + _setting 后缀，即（用户自己设定需要的样式数组对象）, new_val为之前切割好的字符串名称
			var arr_Style = eval( 'opts.' + Specialsym_line( new_val ) + opts._setting + '' ); //把特殊符号全全换为 : '_'  ，再拼接_setting

			//如果存在(用户自己设定需要的样式数组对象）
			if( arr_Style !== undefined )
			{
				/*对样式数组进行操作     把'equal:', 'postion:', 'cen_adjust:'开头的样式放到数组的最前面*/
				arr_StyleHandle( arr_Style, opts );
				//console.log( newStyleArr );
				$.each( newStyleArr, function( n, value )    /*遍历样式数组对象的内容，根据内容添加样式*/
				{
					for( var v = 0; v < opts.formEle_style.length; v++ )
					{
						_setStyleAll( opts, value, v, i, j, k );
					}
				} );
			}
			else
			{
				return false
			}
		}

		/**
		 * 对样式数组进行操作（包括去重和重新排序）
		 * @param arr        样式数组
		 * @param opts         传入参数对象opts
		 */
		function arr_StyleHandle( arr, opts )
		{
			//先去重
			//$.unique( arr );
			//找出符合条件的数组元素，获取其value，并删除，放入数组头部
			var newArr = [];
			var newHarr0 = [];
			var newHarr1 = [];
			var newHarr2 = [];
			//先把原数组的每一项推入新的数组，之后的操作是对于新数组的，原数组无需对齐修改操作，保证参数的完整性
			for( var j = 0; j < arr.length; j++ )
			{
				newArr.push( arr[ j ] )
			}
			//在上步骤建立的新数组中进行三个循环搜索，当前缀符合要求，即推入定义的另外一个数组中去，并将其在新数组中删除。
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
			//按照特定顺序，将这4个数组合并，按照的顺序如下：equal：xx    postion：xx    cen_adjust: xx   其他........
			arr1 = newHarr2.concat( newArr );
			arr2 = newHarr1.concat( arr1 );
			newStyleArr = newHarr0.concat( arr2 );
			return newStyleArr
		}

		/**
		 * 设置  样式
		 * @param opts       传入参数对象opts
		 * @param value     样式数组当前val
		 * @param v         样式数组特定序列
		 * @param i         特定页码
		 * @param j         内容列表数组当前序列
		 * @param k         前缀标识序列
		 */
		function _setStyleAll( opts, value, v, i, j, k )
		{
			if( value.indexOf( opts.formEle_style[ v ] ) == 0 )   //如果 有设定这个属性需要修改样式的情况下
			{
				select_style = remove_spaces( value.substr( 0, opts.formEle_style[ v ].length - 1 ) );  //字符串切割样式名称，并且去除首尾空格
				new_optStyle = remove_spaces( value.substr( opts.formEle_style[ v ].length, value.length ) ); //字符串切割样式属性的大小，并且去除首尾空格
				//判断对象（input，radio，select....），并为其设置属性
				_judgeObj_setpro( opts, v, i, j, k );
			}
		}

		/**
		 * 判断对象（input，radio，select....），并为其设置属性
		 * @param opts      传入参数对象opts
		 * @param v         样式数组特定序列
		 * @param i         特定页码
		 * @param j         内容列表数组当前序列
		 * @param k         前缀标识序列
		 */
		function _judgeObj_setpro( opts, v, i, j, k )
		{
			//设置option的高
			function _setOption_H( n )
			{
				if( v == n )$( '#reg_' + i + 'st_li' + j + ' div ' + opts.select + ' option' ).css( select_style, new_optStyle );
			}

			//设置input的高
			function _setIpt_H( n )
			{
				if( v == n )$( '#reg_' + i + 'st_li' + j + ' div ' + opts.input + '' ).css( select_style, new_optStyle );
			}

			if( k == 1 )  			//select的情况
			{
				_set_property( v, i, j, k, opts.select );
				_setOption_H( 7 );
			}
			else if( k == 4 )   	//paragraph的情况
			{
				_set_property( v, i, j, k, opts.span );
			}
			else if( k == 6 )   	//textarea   的情况
			{
				_set_property( v, i, j, k, opts.txt );
			}
			else if( k == 8 )   	//空白块gap填充的情况
			{
				if( v == 0 )
				{
					//空白块只有 宽度 一个属性，主要用来填充空白部分
					var reg_Li = $( '#reg_' + i + 'st_li' + j + '' );
					reg_Li.css( 'width', reg_Li.width() / parseFloat( new_optStyle ) );
				}
			}
			else    			//其他情况: radio / input text password /checkbox
			{
				_set_property( v, i, j, k, opts.input );
				_setIpt_H( 7 );
			}
		}

		/**
		 * 设置属性 到对象（input，radio，select...）
		 * @param v         样式数组特定序列
		 * @param i         特定页码
		 * @param j         内容列表数组当前序列
		 * @param k         前缀标识序列
		 * @param obj       表单对象
		 */
		function _set_property( v, i, j, k, obj )
		{
			//设置 equal  排布等分
			if( v == 0 )
			{
				var reg_Li = $( '#reg_' + i + 'st_li' + j + '' );
				reg_Li.css( 'width', reg_Li.width() / parseFloat( new_optStyle ) );
			}
			//设置 位置（左中右）
			if( v == 1 )
			{
				if( new_optStyle == 'center' )Cen_( opts, k, i, j );
				if( new_optStyle == 'left' )$( '#reg_' + i + 'st_li' + j + '' ).css( 'text-align', 'left' );
				if( new_optStyle == 'right' )$( '#reg_' + i + 'st_li' + j + '' ).css( 'text-align', 'right' );
			}
			//设置 居中调整值
			if( v == 2 )
			{
				var reg_LiDiv = $( '#reg_' + i + 'st_li' + j + ' div' );
				reg_LiDiv.css( 'margin-left', parseFloat( reg_LiDiv.css( 'margin-left' ) ) * parseFloat( new_optStyle ) );//设置margin-left 值 = 原始值 * 居中调整值
			}
			//撤销必填标识 和 name 属性
			if( v == 3 )
			{
				$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).removeAttr( 'name' ).removeClass( 'notnull' );     //移除name 和 必填标识class
				var $require_marking = $( '#reg_' + i + 'st_li' + j + ' div .required' );
				//如果 含有 必填标识 则删除必填标识，若是没有，则删除其父级（p标签）下所有的元素
				$require_marking.length !== 0 ? $require_marking.remove() : $( '#reg_' + i + 'st_li' + j + ' div p span' ).empty();
			}
			//设置 更改  name值
			if( v == 4 )$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).attr( select_style, new_optStyle );

			//设置 更改  value值
			if( v == 5 )$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).attr( select_style, new_optStyle );

			//设置  宽度
			if( v == 6 )$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).css( select_style, new_optStyle );

			//设置 select 中  option 显示的个数
			if( v == 8 )$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).attr( "size", new_optStyle );

			//设置 字体大小
			if( v == 9 )$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).css( select_style, new_optStyle + 'px' );

			//设置 rows
			if( v == 10 )
			{
				$( '#reg_' + i + 'st_li' + j + ' div textarea' ).css( 'width', '' );   //先把宽度清空
				$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).attr( "cols", new_optStyle );
			}
			//设置 cols
			if( v == 11 )$( '#reg_' + i + 'st_li' + j + ' div ' + obj + '' ).attr( "rows", new_optStyle );
		}

		/**
		 * 居中设置，不会随着表单验证出现的提示信息而改变当前每条显示内容的居中位置，即：固定居中位置
		 * @param opts         传入参数对象opts
		 * @param k          前缀标识序列
		 * @param i         特定页码
		 * @param j         内容列表数组当前序列
		 */
		function Cen_( opts, k, i, j )
		{
			_reg_liDivWidth( opts, k, i, j );
			reg_liWidth = $( '#reg_' + i + 'st_li' + j + '' ).width();  // 获取 #regXst_ul li div 的宽度，每个li内 实际显示内容的总宽度
			var marginL = parseInt( (reg_liWidth - reg_liDivWidth) / 2 ); //（总宽-内容宽度）/2
			//设置magrin-left值
			$( '#reg_' + i + 'st_li' + j + ' div' ).css( 'margin-left', marginL );
		}

		/**
		 * 输出 对象的 border-Width
		 * @param obj        操作对象
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
		 * 获取 每块内容实际显示部分宽度
		 * @param opts      传入参数对象opts
		 * @param k         前缀标识序列
		 * @param i         特定页码
		 * @param j         内容列表数组当前序列
		 */
		function _reg_liDivWidth( opts, k, i, j )
		{
			var $regUlIpt = $( '#reg_' + i + 'st_li' + j + ' div input' );
			var $regUlSel = $( '#reg_' + i + 'st_li' + j + ' div select' );
			var $regUllabel = $( '#reg_' + i + 'st_li' + j + ' div label' );
			var $regUltextarea = $( '#reg_' + i + 'st_li' + j + ' div textarea' );
			var $regUlp = $( '#reg_' + i + 'st_li' + j + ' div p' );

			//当每块内容中 实际显示中有  radio时
			if( k == 0 )return reg_liDivWidth = $regUllabel.width() + $regUlIpt.width() + borderW( $regUlIpt );

			//当每块内容中 实际显示中有  select时
			if( k == 1 )return reg_liDivWidth = $regUlp.width() + $regUlSel.width() + borderW( $regUlSel );

			//当每块内容中 实际显示中有  input（type =text / password ）时
			if( k == 2 || k == 7 )return reg_liDivWidth = $regUlp.width() + $regUlIpt.width() + borderW( $regUlIpt );

			//当每块内容中 实际显示中有  lead（导语）时
			if( k == 3 )return reg_liDivWidth = $( '#reg_' + i + 'st_ul li div .' + opts.lead + '' ).width();

			//当每块内容中 实际显示中有  paragraph（段落）时
			if( k == 4 )return reg_liDivWidth = $( '#reg_' + i + 'st_ul li div span.' + opts.paragraph + '' ).width();

			//当每块内容中 实际显示中有 checkbox时
			if( k == 5 )return reg_liDivWidth = $regUllabel.width() + parseInt( $regUllabel.css( 'padding-left' ) ) * 2 + 10;

			//当每块内容中 实际显示中有 textarea 时
			if( k == 6 )
			{
				return reg_liDivWidth = $regUlp.width() + $regUltextarea.width() + borderW( $regUltextarea );
			}

		}

		/*--------------------------------------------板块移动，点击操作部分----------------------------------------*/
		/**
		 * 获取 margin-left
		 * @param opts
		 * @returns {number}
		 */
		function Reg_slider_margL( opts )
		{
			return margL = parseInt( $( '#' + opts.reg_slider_turn + '' ).css( 'margin-left' ) );
		}

		/**
		 * 获取 最大 magrin-left
		 * @param opts
		 * @returns {number}
		 */
		function reg_slider_MaxMargL( opts )
		{
			reg_c_w = parseInt( $( '.' + opts.reg_content + '' ).css( "width" ) );
			return max = (opts.flip_Num - 1) * reg_c_w;
		}

		/**
		 * margin-left与宽度求余数 (保留整数)   正常情况下为0
		 * @return {number}
		 */
		function Reg_slider_modulo()
		{
			return modulo = margL % reg_c_w;          //margin-left与宽度取余
		}

		//margin-left值增加（增加值为实际显示宽度）
		function margL_add()
		{
			margL += reg_c_w;
		}

		// margin-left值减少（减少值为实际显示宽度），
		function margL_reduce()
		{
			return margL -= reg_c_w;
		}

		/**
		 * 确定是哪一个步骤
		 * @return {number}
		 */
		function Sure_step()
		{
			return x = -margL / reg_c_w + 1;   //确定第几个步骤
		}

		/**
		 * step 高亮显示，显示当前页
		 * @param opts
		 * @param x        步骤参数
		 */
		function Highlight( opts, x )
		{
			$( '#' + opts.step + ' ul li.' + opts.active + '' ).removeClass( opts.active );   	// 全部移除高亮显示
			var stepCircle = $( '#' + opts.step + ' div ul li[data-num="' + x + '"]' );
			stepCircle.addClass( opts.active );  // 高亮显示
			//伪类加class
			stepCircle.addClass( opts.stepchange );
			$( '#' + opts.step + ' div ul li[data-num="' + (x - 1) + '"]' ).addClass( opts.stepchange );
			$( '#' + opts.step + ' span' ).html( "Step " + x );
		}

		/**
		 * 用户向下一步点击 next
		 * @param opts
		 */
		var _reg_next = function( opts )
		{
			$( '#' + opts.btn_next + '' ).on( 'click', function()
			{
				Reg_slider_margL( opts );				//获取  margin-left
				reg_slider_MaxMargL( opts );			//获取  最大 margin-left
				Reg_slider_modulo();					//获取  margin-left与宽度 求余数 (保留整数)   此插件中正常情况下为0
				if( -margL < max && modulo == 0 )    	//在正常范围内移动，且余数为 0
				{
					if( margL < -max )return false;
					/*移动的  magrin 值小于 -max 时，直接跳出，双保险*/
					margL_reduce( opts ); 				   //margin-left 值减少，
					Sure_step();  						  //确定步骤   x
					//检查当前步骤页面的所有必填form表单是否填写完毕
					_presentCompleted( x );
					//下一步开关    关闭则直接跳出
					if( !next_switch )return false;
					//版块滑动
					displayPart_move( opts.reg_slider_turn, opts.slideSpeedL_s );
					Highlight( opts, x );
					back_Switch = true;          	//后退标识开关开启
					next_each_change( opts, x );
					Default_Postion( x );   		//均等移动函数所需参数，默认位置 为 x（当前点击页码）
				}
				if( -margL > max )  				//移动超出限定范围，弹出的提示框
				{
					$.dialog( 'alert', lan.cue_tit, lan.build_regError, opts.jump_clickCue_t );     //源码参数被人为破坏,弹出的提示框
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
				if( -margL <= max && modulo == 0 )   	//max 为移动底部时，marin的最大值，判断当前margin值是否小于max（next点击到最后一张的情况下，max=margin）
				{
					if( margL > 0 )return false;   		// 移动的 magrin 值大于 0 时，即：第一页往右移动，直接跳出，双保险
					margL_add( opts );    				//注册界面 margin-left 值增加，
					//版块滑动
					displayPart_move( opts.reg_slider_turn, opts.slideSpeedR_s );
					Sure_step();
					Highlight( opts, x );
					back_Switch = false;             //后退标识开关 关闭
					//后退  每章节 的变化
					back_each_change( opts, x );
				}
				if( -margL > max )
				{
					$.dialog( 'alert', lan.cue_tit, lan.build_regError, opts.jump_clickCue_t );
				}
			} )
		};

		/**
		 * step 按钮点击 跳转
		 * @param opts
		 */
		var _step_click = function( opts )
		{
			var step_btn = $( '#' + opts.step + ' div ul li' );
			Default_Postion( opts.init_page );   					//均等移动函数所需参数，页面初始加载时候为1
			step_btn.each( function( i )
			{
				$( this ).click( function()
				{
					// 判断当前位置 是否在 1到 总页面个数之间
					if( Def_Postion >= 1 && Def_Postion <= opts.flip_Num )
					{
						//本次点击位置 与 上次点击位置（或者初始位置） 的差小于2，即：跳跃点击，则不能行使相应功能。
						if( i + 1 - Def_Postion < clickDif )
						{
							//第一页自定义拓展
							if( i == 0 )
							{
								$.fn.gcxRegslideForm.customFirstStep( opts, i + 1 );
							}
							//console.log( Def_Postion )
							//console.log( i + 1 )
							//检查所点击的步骤之前所有的页面里面，所有必填form表单是否填写完毕
							_AllbeforeCompleted( i, Def_Postion );
							//下一步开关    关闭则直接跳出
							if( !next_switch )return false;

							Reg_slider_margL( opts );//获取  margin-left
							reg_slider_MaxMargL( opts );//获取  最大 margin-left
							Reg_slider_modulo();//获取  margin-left与宽度 求余数 (保留整数)   此插件中正常情况下为0
							if( -margL <= max && modulo == 0 )
							{
								if( margL < -max || margL > 0 )return false;
								margL = -reg_c_w * i;   											//设定 margin-left 值
								//判断是否是点击往前（点击步骤小于当前步骤），则把backSwitch开关 关闭，这样凡是往前翻页都不会重新加载页面
								Def_Postion > i + 1 ? back_Switch = false : back_Switch = true;
								//确定是第几个步骤
								Sure_step();
								//当前按钮高亮显示
								Highlight( opts, x );
								//点击步骤按钮 所对应的页面显示
								next_each_change( opts, x );
								//均速 移动
								equal_Move( opts, x );
								/* 当依次点击到最后一页的时候（即：所有页面都加载完毕），把clickDif修改掉，
								 则下一次点击的时候，无论点击跨度有多大，都不会弹出错误提示信息。
								 弊端如下：当用户选择不同的关键选项，从而刷新激活加载新的内容列表数组，则跳跃式点击会造成相关页面不能正常显示。*/
								//if( i == opts.flip_Num - 1)
								//{
								//	clickDif = opts.flip_Num;
								//}
							}
						}
						else
						{
							$.dialog( 'alert', lan.cue_tit, lan.jump_clickCue, opts.jump_clickCue_t );   //step 跳跃式点击 提示信息
						}
					}
					else
					{
						$.dialog( 'alert', lan.cue_tit, lan.build_regError, opts.jump_clickCue_t );   //源码参数被人为破坏,弹出的提示框
					}
				} );
			} );
		};

		/**
		 * 检查当前步骤页面的所有必填form表单是否填写完毕
		 * @param i  特定页面
		 */
		function _presentCompleted( i )
		{
			/* 遍历当前页面 下所有含有必填class的元素，查看它们是否含有valid标签（含有则 说明用户已经对此元素进行过正确操作填写）
			 只要有一个元素不符合要求，则输出false，不可以进行下一页面的操作填写 */
			$( '#reg_' + (i - 1) + 'st_ul .notnull' ).each( function()
			{
				if( $( this ).hasClass( 'valid' ) )next_switch = true;
				if( !$( this ).hasClass( 'valid' ) )
				{
					$.dialog( 'alert', lan.cue_tit, lan.inspect_complete, opts.jump_clickCue_t );     	//没有全部正确填写时，弹出提示信息
					next_switch = false;
				}
			} );
		}

		/**
		 * 检查所点击的步骤之前所有的页面里面，所有必填form表单是否填写完毕
		 * @param i  特定页面
		 * @param n  上一次点击的位置
		 */
		function _AllbeforeCompleted( i, n )
		{
			//是否往后点击
			if( i + 1 > n )
			{
				/*	遍历所点击的步骤之前所有的页面页面 下所有含有必填class的元素，查看它们是否含有valid标签（含有说明用户已经对此元素进行过正确操作填写）
				 只要有一个元素不符合要求，则输出false，不可以进行下一页面的操作填写 */
				for( var j = 0; j <= i; j++ )
				{
					$( '#reg_' + j + 'st_ul .notnull' ).each( function()
					{
						if( $( this ).hasClass( 'valid' ) )next_switch = true;
						if( !$( this ).hasClass( 'valid' ) )
						{
							$.dialog( 'alert', lan.cue_tit, lan.allbefore_completed, opts.jump_clickCue_t );     //没有全部正确填写时，弹出提示信息
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
		 * 输出上一次存储的 位置序列
		 * @param x
		 * @returns {number}
		 */
		var Default_Postion = function( x )
		{
			return Def_Postion = x;
		};

		/**
		 * 匀速移动
		 * @param opts
		 * @param x      位置序列
		 */
		function equal_Move( opts, x )
		{
			var dif = Math.abs( x - Def_Postion ); 			 //每次点击，点击的位置与之前的位置的 差值
			Default_Postion( x );   						 //初始值改为 点击的  位置 的 值
			var equ_speed = opts.slide_speed * dif;          //速度为基础速度*差值
			dif >= 2 ? equ_speed = equ_speed * opts.jump_click_s : equ_speed;  		 //对大跨度点击 动画速度进行降速
			displayPart_move( opts.reg_slider_turn, equ_speed );           			 //执行滑动
		}

		/**
		 * 下一页 每个注册部分的 变化
		 * @param opts
		 * @param x      位置序列
		 */
		function next_each_change( opts, x )
		{
			if( x == 1 )
			{
				//返回按钮（整体） 隐藏
				regBackModule_hide( opts );
				//提交按钮隐藏，注册 顶部标题 改变
				submitHide_TitChange( opts, x );
				//创建 相应的表单内容 整体
				build_formCont( x, opts );
				//第一页自定义拓展
				$.fn.gcxRegslideForm.customFirstStep( opts, x );
				return false;
			}
			else if( x == opts.flip_Num )
			{
				//返回按钮（整体） 显示
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
		 * 上一页 每个注册部分的 变化
		 * @param opts
		 * @param x      位置序列
		 */
		function back_each_change( opts, x )
		{
			if( x == 1 )
			{
				//返回按钮 整体 隐藏
				regBackModule_hide( opts );
				title_change( opts, x );
				//第一页自定义拓展
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
		 * 第一页自定义拓展
		 * @param opts
		 * @param x         当前步骤
		 */
		$.fn.gcxRegslideForm.customFirstStep = function( opts, x )
		{
			$( '#reg_' + x + 'st_ul li input[type=radio]' ).change( function()
			{
				$( '#' + opts.step + ' ul li.' + opts.stepchange + '' ).removeClass( opts.stepchange );
			} )
		};

		/**
		 * 显示 注册插件的标题
		 * @param opts
		 * @param i      特定页码
		 */
		function title_change( opts, i )
		{
			var reg_topTit = eval( "opts.tit_" + i + "st" );  //获取当前 键值 为 tit_ i st 的 标题内容
			//值（字符串）类型：一个标题的
			if( typeof reg_topTit == 'string' )
			{
				$( '#' + opts.reg_container + ' #' + opts.reg_HeadTit + '' ).html( reg_topTit );
			}
			//对象（数组）类型：多个标题的，功能需要，需具体分类添加标题
			else if( typeof reg_topTit == 'object' )
			{
				$.fn.gcxRegslideForm.custom_multipleTit( opts, reg_topTit );
			}
			//都不满足的情况，说明当前获取的标题内容格式不符合要求，需要用户重新设置
			else
				$( '#' + opts.reg_container + ' #' + opts.reg_HeadTit + '' ).html( lan.tit_error );
		}

		/**
		 * 当标题需要随着用户操作选择而动态变更时，此时用户设定的标题为数组，需要对其进行判断并且变更，公共拓展方法，可自行操作。
		 * @param opts
		 * @param titArr       标题数组
		 */
		$.fn.gcxRegslideForm.custom_multipleTit = function( opts, titArr )
		{
			var reg_tit = $( '#' + opts.reg_container + ' #' + opts.reg_HeadTit + '' );
			if( $( "input[name='objective']:checked" ).val() == 'I want to post recruiting/enrollment/coopration information' )
				reg_tit.html( titArr[ 1 ] );
			else reg_tit.html( titArr[ 0 ] );
		};

		/**
		 * submit 提交显示，标题改变
		 * @param opts
		 * @param i      特定页码
		 */
		function submitShow_TitChange( opts, i )
		{
			title_change( opts, i );
			$( '#' + opts.btn_next + '' ).hide();
			var reg_submit = $( '#' + opts.btn_submit + '' );
			lan.submit_fade_s >= 100 && lan.submit_fade_s <= 1000 ? reg_submit.fadeIn( opts.submit_fade_s ) : reg_submit.fadeIn( 300 );
		}

		/**
		 * submit 提交隐藏，标题改变
		 * @param opts
		 * @param i      特定页码
		 */
		function submitHide_TitChange( opts, i )
		{
			title_change( opts, i );
			$( '#' + opts.btn_submit + '' ).hide();
			var reg_next = $( '#' + opts.btn_next + '' );
			lan.submit_fade_s >= 100 && lan.submit_fade_s <= 1000 ? reg_next.fadeIn( opts.submit_fade_s ) : reg_next.fadeIn( 300 );
		}

		/**
		 * 注册插件 上一步按钮模块显示
		 * @param opts
		 */
		function regBackModule_show( opts )
		{
			//step 区域移动
			var move_dis = ($( '#' + opts.reg_container + '' ).width() - $( '.' + opts.button_module + '' ).width() * 2) / 2 - 15;   //居中设置
			$( '#' + opts.step + ' div' ).animate( { 'margin-left': move_dis + 'px' }, opts.slideSpeedL_s );
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
			//设置的 返回按钮消失 时间 在100到1600之间，则正常使用此参数，否则选取默认值 300 进行传参
			opts.backModule_fadeOut_s >= 100 && opts.backModule_fadeOut_s <= 1600 ? btn_back_module.fadeOut( opts.backModule_fadeOut_s ) : btn_back_module.fadeOut( 300 );
		}

		/**
		 * 板块滑动
		 * @param slider        滑动对象
		 * @param speed
		 */
		function displayPart_move( slider, speed )
		{
			$( '#' + slider + '' ).animate( { 'margin-left': margL }, speed, 'swing' );
		}

		/**
		 * 字符串首字母大写
		 * @param value
		 * @returns {string}
		 */
		function Title_case( value )
		{
			str_case = value.substr( 0, 1 ).toUpperCase() + value.substr( 1, value.length - 1 );                         //拼接
			return str_case;
		}

		/**
		 * 下划线替换空格
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
		 * 下划线替换特殊字符
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
		 * 去除首尾空格
		 * @param value
		 * @returns {string}
		 */
		function remove_spaces( value )
		{
			return $.trim( value );
		}

		/**
		 * 改变 name 值
		 * @param parent         操作对象
		 * @param name           操作对象name值
		 * @param result         改变的值
		 */
		function change_ObjName( parent, name, result )
		{
			target_obj = target_obj.replace( / /g, '_' );			//空格转换成'_'
			var $change_ipt = $( "." + parent + "[ name = " + name + " ]" );
			if( $change_ipt )$change_ipt.attr( 'name', result );
		}

		/**
		 * 删除 name 值
		 * @param parent         操作对象
		 * @param name           操作对象name值
		 */
		function delete_ObjName( parent, name )
		{
			target_obj = target_obj.replace( / /g, '_' );
			var $change_ipt = $( "." + parent + "[ name = " + name + " ]" );
			if( $change_ipt )$change_ipt.removeAttr( 'name ' )
		}

		/**
		 * 数组各部分首字母大写
		 * @param arr
		 * @returns {object}
		 */
		function arrTitle_case( arr )
		{
			var new_arr = [];
			$.each( arr, function( i, value )
			{
				var new_str = value.substr( 0, 1 ).toUpperCase() + value.substr( 1, value.length - 1 ); //切割字符串，首字母大写 + 去除除了首字母以外的部分，拼接
				new_arr.push( new_str );
			} );
			arr.length = 0;
			arr = new_arr;
			return arr;
		}

		/**
		 * 移除 必填 显示标签  remove Star symbol（Required）
		 * @param obj             操作对象
		 * @param name            操作对象name值
		 * @param target          移除目标
		 */
		function delete_tap( obj, name, target )
		{
			$( "." + obj + "[ name = " + name + " ]" ).parent().find( '.' + target + '' ).remove();
		}
	}
) );

////增加 位置 样式 text-align
//function add_posStyle( opts, value, i, j, k )
//{
//	//如果前缀中有 Cen_ 位置标识，则 加上居中样式
//	if( value.indexOf( opts.list_prefix_style[ 0 ] ) == opts.list_prefix[ k ].length )   //在value值里面， 前缀标识Cen_是否第一次出现在表单类型前缀 的后面
//	{
//		//居中设置，不会随着表单验证出现的提示信息而改变当前每条显示内容的居中位置，即：固定居中位置
//		Cen_( opts, k, i, j );
//	}
//	//如果前缀中有 L_ 位置标识，则 加上靠左样式
//	else if( value.indexOf( opts.list_prefix_style[ 1 ] ) == opts.list_prefix[ k ].length )
//	{
//		$( '#reg_' + i + 'st_ul li' ).eq( j ).css( 'text-align', 'left' );
//	}
//	//如果前缀中有 R_ 位置标识，则 加上靠右样式
//	else if( value.indexOf( opts.list_prefix_style[ 2 ] ) == opts.list_prefix[ k ].length )
//	{
//		$( '#reg_' + i + 'st_ul li' ).eq( j ).css( 'text-align', 'right' );
//	}
//	//都没有的情况下，实现两端对齐文本效果
//	else
//	{
//		$( '#reg_' + i + 'st_ul li' ).eq( j ).css( 'text-align', 'justify' );
//	}
//}
////确定切割字符串的起始位置
//function sure_DelStart( value, opts, n )
//{
//	//如果 value 值里面 有 Cen_ 则，切割起始位置为：前缀值（表单类型）的长度 + cen_（位置类型）的长度
//	if( value.indexOf( opts.list_prefix_style[ 0 ] ) == opts.list_prefix[ n ].length )
//	{
//		//console.log( "cen", opts.list_prefix[ n ].length + opts.list_prefix_style[ 0 ].length );
//		return DelStart = opts.list_prefix[ n ].length + opts.list_prefix_style[ 0 ].length;
//	}
//	//如果 value 值里面 有 L_ 则，切割起始位置为：前缀值（表单类型）的长度 + L_（位置类型）的长度
//	else if( value.indexOf( opts.list_prefix_style[ 1 ] ) == opts.list_prefix[ n ].length )
//	{
//		//console.log( "L", opts.list_prefix[ n ].length + opts.list_prefix_style[ 0 ].length );
//		return DelStart = opts.list_prefix[ n ].length + opts.list_prefix_style[ 1 ].length;
//	}
//	//如果 value 值里面 有 R_ 则，切割起始位置为：前缀值（表单类型）的长度 + R_（位置类型）的长度
//	else if( value.indexOf( opts.list_prefix_style[ 2 ] ) == opts.list_prefix[ n ].length )
//	{
//		//console.log( "R", opts.list_prefix[ n ].length + opts.list_prefix_style[ 0 ].length );
//		return DelStart = opts.list_prefix[ n ].length + opts.list_prefix_style[ 2 ].length;
//	}
//	//如果 都没有 则，切割起始位置为：前缀值（表单类型）的长度
//	else
//	{
//		return DelStart = opts.list_prefix[ n ].length;
//	}
//}

//
////建立   基本注册页面
//function build_Basic_inf( opts, x )
//{
//	var basic_arr = [ "memberID", "password", "re-enter-password", "password question", "password answer" ];
//	if( $( '.' + opts.container_3st + '' ).is( ":empty" ) )
//	{
//		$.each( basic_arr, function( i, value )
//		{
//			i == 3 ?
//				(function build_SelectToBasicInf()
//				{
//					//创建select
//					build_LiselToUl( opts.container_3st, value, x, i );
//					//判断在对应的selcet中添加对应的option
//					judge_whichsel( opts, x, i )
//
//				})() : build_LiinputToUl( opts.container_3st, value );
//
//		} );
//		//增加  If You Forget Password...
//		append_LitoContainer( opts.add_content1, opts.container_3st, 2 );
//		//更改repassword 的 name
//		change_ObjName( opts.change_obj_parent3, opts.repassword_change, opts.repassword_become );
//	}
//}
//
////建立个人注册页面
//function build_personal_inf( opts, x )
//{
//	var personal_arr = [ "name", "gender", "mobile", "date of birth", "carded", "email", "marriage", "education" ];
//	if( $( '.' + opts.container_4st + '' ).is( ":empty" ) )
//	{
//		$.each( personal_arr, function( i, value )
//		{
//			i == 1 || i == 6 || i == 7 ?
//				(function build_SelectToAppoint()
//				{
//					//创建select
//					build_LiselToUl( opts.container_4st, value, x, i );
//					//判断在对应的selcet中添加对应的option
//					judge_whichsel( opts, x, i )
//				})() : build_LiinputToUl( opts.container_4st, value );
//		} );
//		//更改 email 的name为personal_email
//		change_ObjName( opts.change_obj_parent4, opts.personal_email_change, opts.personal_email_become );
//		//更改 Date of birth  的 name 为 birth
//		change_ObjName( opts.change_obj_parent4, opts.birth_change, opts.birth_become );
//		//$('.reg_4st_ul input' ).eq(0 ).focus();
//		//console.log($('.reg_4st_ul input' ).eq(0))
//	}
//}
//
////建立企业注册页面
//function build_Company_inf( opts )
//{
//	var company_arr = [ "company name", "tel", "email", "address", "fax", "website", "remarks" ];
//	if( $( '.' + opts.container_4st + '' ).is( ":empty" ) )
//	{
//		$.each( company_arr, function( i, value )
//		{
//			build_LiinputToUl( opts.container_4st, value );
//		} );
//		//移除 remarks 栏目的必填标记
//		delete_tap( opts.change_obj_parent4, opts.remarks_change, opts.required );
//		//更改 email 的name为company_email
//		change_ObjName( opts.change_obj_parent4, opts.company_email_change, opts.company_email_become );
//		//移除 remarks 栏目的 input 的 name 值
//		delete_ObjName( opts.change_obj_parent4, opts.remarks_change );
//	}
//}
//
///**
// * 判断在哪个select，分别建立不同的option
// */
//function judge_whichsel( opts, x, i )
//{
//	var reg_containerSelName = $( ".reg_" + x + "st_select" + i + "" ).prop( "name" );
//	//创建 gender—select  下option
//	if( reg_containerSelName == opts.password_question )
//	{
//		var Password_Q_arr = [ opts.optDefSelect, opts.password_question1, opts.password_question2, opts.password_question3, opts.password_question4, opts.password_question5, opts.password_question6, opts.password_question7 ];
//		bulid_optionTosel( Password_Q_arr, x, i, 0 );
//	}
//	//创建 gender—select  下option
//	if( reg_containerSelName == opts.gender )
//	{
//		var Gender_arr = [ opts.optDefSelect, opts.male, opts.female ];
//		bulid_optionTosel( Gender_arr, x, i, 0 );
//	}
//	//创建 marriage—select  下option
//	if( reg_containerSelName == opts.marriage )
//	{
//		var Marriage_arr = [ opts.optDefSelect, opts.unmarried, opts.married ];
//		bulid_optionTosel( Marriage_arr, x, i, 0 );
//	}
//	//创建 education—select  下option
//	if( reg_containerSelName == opts.education )
//	{
//		var education_arr = [ opts.optDefSelect, opts.high_school, opts.junior_College, opts.college, opts.postgraduate, opts.doctorate, opts.other ];
//		bulid_optionTosel( education_arr, x, i, 0 );
//	}
//}
//
///**
// * 建立option
// */
//function bulid_optionTosel( arr, x, i, j )
//{
//	var $reg_containerSel = $( ".reg_" + x + "st_select" + i + "" );
//	$reg_containerSel.empty();
//	$.each( arr, function( j, value )
//	{
//		$reg_containerSel.append( $( "<option value= " + value + " >" + value + "</option>" ) );
//	} );
//	$( " .reg_" + x + "st_select" + i + " option" ).eq( j ).val( "" ).prop( "selected", true );   //第j个select 显示
//	arr.splice( 0, arr.length );
//}