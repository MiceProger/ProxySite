$(function () {
    let name_days = $('.header_select input[name="days"]');
    let name_element = $('.header_select input[name="element"]');
    
    $('.header_select input[name="section"]').attrchange({
        trackValues: true, callback: function (event) {
            if (event.attributeName == 'value' && event.oldValue != event.newValue) {
            	//Сброс страны и интервала при смете вида прокси divasoft
            	name_element.val('');
            	name_days.val('');
            	name_element.siblings(".slct").removeClass("active_link");
            	name_days.siblings(".slct").removeClass("active_link");
            	$(".header_bottom .dvs_hide").hide();
                dvs_checkAndStartPreCalc();
            }
        }
    });
    name_element.attrchange({
        trackValues: true, callback: function (event) {
            if (event.attributeName == 'value' && event.oldValue != event.newValue) {
                dvs_checkAndStartPreCalc();
            }
        }
    });
    name_days.attrchange({
        trackValues: true, callback: function (event) {
            if (event.attributeName == 'value' && event.oldValue != event.newValue) {
                dvs_checkAndStartPreCalc();
            }
        }
    });

    $('.header_bottom input[name="enter_promo"]').on('keyup', delay(function ()  {
        dvs_checkAndStartPreCalc();
    }, 500));

    $('.header_select input[name="quantity"]').on('keyup', delay(function () {
    	if($(this).val() != '')
        	dvs_checkAndStartPreCalc();
    }, 500));

    $('.dvs-show-modal-order').on('click', function () {
        dvs_checkAndStartPreCalc(true);
    });
});

function dvs_checkAndStartPreCalc(show) {
    // TODO: Зашаблонить, переместить в калькулятор

    var nom_aj_quant = $("input[name='quantity']");
    var nom_aj_att;

    var section = $('.header_select input[name="section"]').val();
    var element = $('.header_select input[name="element"]').val();
    var days = $('.header_select input[name="days"]').val();
    var promo = $('.header_bottom input[name="enter_promo"]').val() || "";
    
    var operator = $('.header_bottom input[name="operator"]').val() || "";
    var rotation = $('.header_bottom input[name="rotation"]').val() || "";
	
    var quantity = '';
    //Вывод 5 штук по умолчанию в калькуляторе
    if($('.header_select input[name="quantity"]').val())
    	quantity = $('.header_select input[name="quantity"]').val();
	else if (element && days)
	{
		quantity = 1;
		if(section == "16")
			quantity = 5;
				
		$('.header_select input[name="quantity"]').val(quantity+ " " + BX.message('TEMPL_PCS') )
	}

    if (show) {
        localStorage.setItem('auth_value', "");
        initPaymentModal(section, element, quantity, days, "", "", promo, section, '', operator, rotation, 'login', 'USD');
    } else if (element && days && quantity) {

        var formData = new FormData();
        formData.append('sessid', BX.message('bitrix_sessid'));
		formData.append('siteDir', location.pathname);
        formData.append('items[0][id]', element);
        formData.append('items[0][q]', quantity);
        formData.append('items[0][p]', days);
        formData.append('items[0][t]', 0);
        formData.append('coupon', promo);
        formData.append('next', "Y");

        $.ajax({
            type: "POST",
            url: '/bitrix/services/main/ajax.php?' + $.param({c:'diva:catalog', action: 'calc', mode: 'ajax'}, true),
            data: formData, contentType: false, processData: false, cache: false,
            success: function (data) {
                try {
                    var obj = (typeof data === "object" ? data : JSON.parse(data));

                    if (obj.status == "success") {
                        var first = obj.data.BASKET_ITEMS[Object.keys(obj.data.BASKET_ITEMS)[0]];
                        var lang_currency = currencyUSD ? currencyUSD : obj.data.CURRENCY;
                        $(".header_bottom .header_price .title").html(first.TOTAL[lang_currency] + " " + lang_currency);
                        $(".header_bottom .header_price span").html(first.PRICE[lang_currency] + " " + lang_currency + "/" + BX.message('TEMPL_PCS'));
                        $(".header_bottom .dvs_hide").show();

                        let quant_sel = $('.header_select input[name="quantity"]');
                        let quant_inp = parseInt( quant_sel.val() );
                        
                        
                        // let quant_sho = first.QUANTITY;
                        /*/ if ( !isNaN(quant_inp) && quant_inp < first.QUANTITY) {
                        //     quant_sho = quant_inp;
                        // }
                        // setTimeout(function(){
                        //     quant_sel.val(quant_sho + " " + BX.message('TEMPL_PCS'));
                        // }, 3000);

                        //setSelectValue($('.header_select .header_select-months'), first.TIME, section);
                        //setSelectValue($('.header_select .header_select-country'), first.ID, section);
                        //*/
                        $('.header_bottom input[name="rotation"]').val(first?.ROTATION);
                        $('.header_bottom input[name="operator"]').val(first?.OPERATOR);
                        
                        if (Object.keys(obj.data.BASKET_ITEMS).length === 2 && !(!isNaN(quant_inp) && quant_inp < first.QUANTITY) ) {
                            var next = obj.data.BASKET_ITEMS[Object.keys(obj.data.BASKET_ITEMS)[1]];
                                                        
                            if ( next.DIFF_PRICE[lang_currency] != 0 ) {

                                $(".header_bottom .header_description_price p span").html(next.DIFF_QUANTITY);
                                $(".header_bottom .header_description_price p b").html((next.DIFF_PRICE[lang_currency]) + " " + lang_currency); // * next.DIFF_QUANTITY
                                $(".header_bottom .dvs_hide").show();

                            } else {
                                $(".header_bottom .dvs_hide").hide();
                            }
                        } else {
                            $(".header_bottom .dvs_hide").hide();
                        }
                        return true;
                    } else {
                        alert(obj.errors[0].message);
                    }
                } catch (e) {
                    console.log(e);
                    alert( BX.message('TEMPL_ERROR_TRY_LATER') );
                }
                return false;
            }
        });
    }
}