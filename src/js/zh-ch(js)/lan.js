/*
 +----------------------------------------------------------------------------------------------------------------------------------------------
 * jQuery gcxRegslideForm Plugin v1.1.0
 * update：2017.2
 * Plugin Introduce ：For the service of the jQuery gcxRegslideForm Plugin language module shows that the value of simplified Chinese and English language,
 *   				  users can add their own language to the JS file.
 * Copyright (c) 2017.2  高仓雄（gcx / Spring of broccoli）   In Hangzhou, China
 * Contact ：Wechat（lensgcx）
 +----------------------------------------------------------------------------------------------------------------------------------------------
 */
jQuery.gcxRegslideForm = {
	langs: {
		en: {
			/*Default option display content (默认的option 显示内容)*/
			optDefSelect: 'Please select',

			/*Prompt pop title (提示弹窗标题)*/
			cue_tit: 'Warmth Prompt',

			/*Step jump click prompt message (step 跳跃式点击 提示信息)*/
			jump_clickCue: 'Please fill in the following steps',

			/*Check the current page all required steps form form is completed when pop (检查当前步骤页面的所有必填form表单是否填写完毕时 弹窗)*/
			inspect_complete: 'Please check carefully whether the current steps are filled correctly.',

			/*Click on the check before all the steps of the page, all the required form form is completed popups
			 (检查所点击的步骤之前所有的页面里面，所有必填form表单是否填写完毕   弹窗)*/
			allbefore_completed: 'Please check carefully before you fill in all the steps.',

			/* When you create a label, because the source code into the parameters were artificially damaged, resulting in the creation of
			 the registry can not successfully create a single part of the pop-up box.
			 (创建标签时候，因为源代码传入的参数被人为破坏，而造成无法顺利创建注册表单各个部件，弹出的提示框) */
			build_regError: 'Please check the source code to make sure that the parameters are destroyed.',

			/*The format of the title content does not meet the requirements, the user needs to reset (获取的标题内容格式不符合要求，需要用户重新设置)*/
			tit_error: 'Please reset the correct title'
		},
		zh_ch: {
			//默认的option 显示内容
			optDefSelect: '请选择',

			//提示弹窗标题
			cue_tit: '友情提示',

			//step 跳跃式点击 提示信息
			jump_clickCue: '请按照步骤依次填写',

			//检查当前步骤页面的所有必填form表单是否填写完毕时 弹窗
			inspect_complete: '请仔细检查当前步骤是否正确填写',

			//检查所点击的步骤之前所有的页面里面，所有必填form表单是否填写完毕   弹窗
			allbefore_completed: '请仔细检查所点击步骤之前是否已经正确填写',

			//创建标签时候，因为源代码传入的参数被人为破坏，而造成无法顺利创建注册表单各个部件，弹出的提示框
			build_regError: '请检查源代码，查看参数是否正确',

			//获取的标题内容格式不符合要求，需要用户重新设置
			tit_error: '请输入正确的标题'
		}
	}
};