# gcxRegslideForm  
## Slide Form - Form build and validation made easy
## 开发
```bash
    # 克隆项目
    git clone  https://github.com/Lensgcx/gcxSpringsideBar.git
    # 安装依赖
    cnpm install
```
## 简单说明 （ Simple explanation ）
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

## GcxRegslideForm Usage method：
Ⅰ、Including it on your page
```javescript
<script src=".../js/merge/gcxRegslideAux.js"></script>                                        Auxiliary script   
<script src=".../js/lan.js"></script>                                                         language
<script src=".../js/gcxRegslideForm-ZH-1.1.0.js"></script>                                       Core plugin
```
Ⅱ、Add plug-in method on object
```javescript
<form id='reg_container' action="reg_new.php" method="post"></form>  
<script>  
$( function()  
{  
     $( '#reg_container' ).gcxRegslideForm();  
} );  
</script>  
```
详细参数以及使用方法详见文档
## 详细文档请移步

中文：
> http://blog.csdn.net/lensgcx/article/details/58589139

英文：
> http://blog.csdn.net/lensgcx/article/details/59491666
 
## 版权所有
BroccoliSpring  ( gcx )        
> https://github.com/Lensgcx/ 