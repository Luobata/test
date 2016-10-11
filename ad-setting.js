/**
 * @author lidonglin
 * @date 2016-08-05
 */
var Tool = require("../../script/util/tool.js");
mdev.dom.build(function ($mod) {
    var $ = window.$;
    var urlReg = /^https?:\/\/(([a-zA-Z0-9_\-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_\-](\?)?)*)*$/i;
    var adAjax = require('../../script/model/info.js');
    var $subBtn = $mod.find('[node-type="ad-submit"]');
    // 字数统计,同时判断是否去掉错误提示
    // hack ie9
    if ($.browser.msie && $.browser.version === '9.0') {
        $mod.find(".title-input").on("keyup", function (e) {
            var inputWrap = window.mdev.wrapDom(e.currentTarget);
            var wordWrap = inputWrap.next();
            Tool.validateLength(inputWrap, 16, wordWrap);
            inputWrap.parent().next().html('');
        });
        $mod.find(".description-input").on("keyup", function (e) {
            var inputWrap = window.mdev.wrapDom(e.currentTarget);
            var wordWrap = inputWrap.next();
            Tool.validateLength(inputWrap, 38, wordWrap);
            inputWrap.parent().next().html('');
        });
        $mod.find(".link-input").on("keyup", function (e) {
            var inputWrap = window.mdev.wrapDom(e.currentTarget);
            if (urlReg.test(this.value)) {
                inputWrap.parent().next().html('');
            }
        });
    } else {
        $mod.find(".title-input").on("input propertychange", function (e) {
            var inputWrap = window.mdev.wrapDom(e.currentTarget);
            var wordWrap = inputWrap.next();
            Tool.validateLength(inputWrap, 16, wordWrap);
            inputWrap.parent().next().html('');
        });
        $mod.find(".description-input").on("input propertychange", function (e) {
            var inputWrap = window.mdev.wrapDom(e.currentTarget);
            var wordWrap = inputWrap.next();
            Tool.validateLength(inputWrap, 38, wordWrap);
            inputWrap.parent().next().html('');
        });
        $mod.find(".link-input").on("input propertychange", function (e) {
            var inputWrap = window.mdev.wrapDom(e.currentTarget);
            if (urlReg.test(this.value)) {
                inputWrap.parent().next().html('');
            }
        });
    }
    function submitAdForm() {
        var token = $mod.find('[node-type="token"]').val();
        var title1 = $mod.find('[node-type="title-one"]').val();
        var title2 = $mod.find('[node-type="title-two"]').val();
        var des1 = $mod.find('[node-type="description-one"]').val();
        var des2 = $mod.find('[node-type="description-two"]').val();
        var link1 = $mod.find('[node-type="link-one"]').val();
        var link2 = $mod.find('[node-type="link-two"]').val();
        var settingData = {
            _token: token,
            method: 'save',
            pcTitle1: title1,
            pcText1: des1,
            pcLink1: link1,
            pcTitle2: title2,
            pcText2: des2,
            pcLink2: link2
        };
        adAjax.adEdit(settingData);
    }
    adAjax.on("adEdit", function (data) {
        if (data.code === 0) {
            var toast = {
                'type': 'success',
                'content': '提交成功',
                'parentSelector': '#main .module-ad-setting',
                'time': 1500,
                'fn': function () {
                    window.location.href = '/v2/main/ad/view.action';
                }
            };
            mdev.message.trigger('dialog-toast', 'dialog-toast', toast);
        } else {
            var toast_error = {
                'type': 'error',
                'content': '提交失败',
                'parentSelector': '#main .module-ad-setting',
                'time': 500,
                'fn': function () {
                    $subBtn.removeClass('disabled');
                }
            };
            mdev.message.trigger('dialog-toast', 'dialog-toast', toast_error);
        }
    });
    // 失去焦点的时候提示错误
    $mod.find("#ad-form .input").on("blur", function (e) {
        var $inputWraper = $mod.find(this);
        if (this.value.replace(/(^\s*)|(\s*$)/g, "").length === 0 && $inputWraper.hasClass("title-input")) {
            $inputWraper.parent().next().html("请输入标题");
        } else if (this.value.replace(/(^\s*)|(\s*$)/g, "").length === 0 && $inputWraper.hasClass("description-input")) {
            $inputWraper.parent().next().html("请输入简介");
        } else if (!urlReg.test(this.value) && $inputWraper.hasClass("link-input")) {
            $inputWraper.parent().next().html("请输入有效URL地址，如http://www.sohu.com");
        } else {
            $inputWraper.parent().next().html("");
        }
    });

    // 提交检查
    function checkField() {
        var inputs = $mod.find("#ad-form .input");
        var pass = true;
        var length = inputs.length;
        var i;
        for (i = 0; i < length; i++) {
            var inputEle = $mod.find(inputs[i]);
            if (inputEle.val().replace(/(^\s*)|(\s*$)/g, "").length === 0 && inputEle.hasClass("title-input")) {
                inputEle.parent().next().html("请输入标题");
                pass = false;
            } else if (inputEle.val().replace(/(^\s*)|(\s*$)/g, "").length === 0 && inputEle.hasClass("description-input")) {
                inputEle.parent().next().html("请输入简介");
                pass = false;
            } else if (!urlReg.test(inputEle.val()) && inputEle.hasClass("link-input")) {
                inputEle.parent().next().html("请输入有效URL地址，如http://mp.sohu.com");
                pass = false;
            } else {
                inputEle.parent().next().html('');
            }
        }
        return pass;
    }
    $subBtn.on("click", function (e) {
        if ($subBtn.hasClass('disabled')) {
            return;
        }
        var pass = checkField();
        if (pass) {
            submitAdForm();
            $subBtn.addClass("disabled");
        }
    });
    //进入页面，设置长度
    var tinput1 = $mod.find('[node-type="title-one"]');
    Tool.validateLength(tinput1, 16, tinput1.next());
    var tinput2 = $mod.find('[node-type="title-two"]');
    Tool.validateLength(tinput2, 16, tinput2.next());
    var dinput1 = $mod.find('[node-type="description-one"]');
    Tool.validateLength(dinput1, 38, dinput1.next());
    var dinput2 = $mod.find('[node-type="description-two"]');
    Tool.validateLength(dinput2, 38, dinput2.next());
});
