// JavaScript Document
jQuery.fn.extend({
	//默认文字
	placeholder:function (options) {
		var supportPlaceholder = 'placeholder' in document.createElement('input');
		if(supportPlaceholder) return this;
		
		options = $.extend({
			placeholderColor:'#A9A9A9',
			isUseSpan:true, //是否使用插入span标签模拟placeholder的方式
			onInput:true  //使用标签模拟(isUseSpan为true)时，是否绑定onInput事件取代focus/blur事件
		}, options);
		
		$(this).each(function () {
			var _this = this;
			var placeholder=$(_this).attr('placeholder');
			var placeholderColor=$(_this).attr("placeholderColor")||options.placeholderColor;
			if (placeholder) {
				var defaultValue = $(_this).attr('placeholder');
				var defaultColor = $(_this).css('color');
				if (options.isUseSpan == false) {
					$(_this).focus(function () {
						var pattern = new RegExp("^" + defaultValue + "$|^$");
						pattern.test($(_this).val()) && $(_this).val('').css('color', defaultColor);
					}).blur(function () {
							if ($(_this).val() == defaultValue) {
								$(_this).css('color', defaultColor);
							} else if ($(_this).val().length == 0) {
								$(_this).val(defaultValue).css('color', placeholderColor)
							}
						}).trigger('blur');
				} else {
					if($(_this).prev(".wrap-placeholder").length!=0){$(_this).prev(".wrap-placeholder").remove()}
					var $imitate = $('<span class="wrap-placeholder" style="position:absolute; display:inline-block; overflow:hidden; color:'+placeholderColor+'; width:'+$(_this).outerWidth()+'px; height:'+$(_this).outerHeight()+'px;">' + defaultValue + '</span>');
					$imitate.css({
						'top':'auto',
						'left':'auto',
						'margin-left':$(_this).css('margin-left'),
						'margin-top':$(_this).css('margin-top'),
						'font-size':$(_this).css('font-size'),
						'font-family':$(_this).css('font-family'),
						'font-weight':$(_this).css('font-weight'),
						'padding-left':parseInt($(_this).css('padding-left')) + 2 + 'px',
						'line-height':_this.nodeName.toLowerCase() == 'textarea' ? $(_this).css('line-weight') : $(_this).outerHeight() + 'px',
						'padding-top':_this.nodeName.toLowerCase() == 'textarea' ? parseInt($(_this).css('padding-top')) + 2 : 0
					});
					$(_this).before($imitate.click(function () {
						$(_this).trigger('focus');
						$(_this).trigger('click');
					}));

					$(_this).val().length != 0 && $imitate.hide();

					if (options.onInput) {
						//绑定oninput/onpropertychange事件
						$(_this).get(0).onpropertychange=function () {
							$imitate[0].style.display = $(_this).val().length != 0 ? 'none' : 'inline-block';
						}
						$(_this).get(0).onblur=function () {
							$imitate[0].style.display = $(_this).val().length != 0 ? 'none' : 'inline-block';
						}
					} else {
						$(_this).focus(function () {
							$imitate.hide();
						}).blur(function () {
							/^$/.test($(_this).val()) && $imitate.show();
						});
					}
				}
			}
		});
		return this;
	}
});