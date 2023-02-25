'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// подключение common.js
// функция throttle
function throttle(func, ms) {
    var isThrottled = false,
        savedArgs,
        savedThis;

    function wrapper() {
        if (isThrottled) {
            // (2)В этом состоянии все новые вызовы запоминаются в замыкании через savedArgs/savedThis. Обратим внимание, что и контекст вызова и аргументы для нас одинаково важны и запоминаются одновременно. Только зная и то и другое, можно воспроизвести вызов правильно.
            savedArgs = arguments;
            savedThis = this;
            return;
        }

        func.apply(this, arguments); // (1)Декоратор throttle возвращает функцию-обёртку wrapper, которая при первом вызове запускает func и переходит в состояние «паузы» (isThrottled = true).

        isThrottled = true;

        setTimeout(function () {
            isThrottled = false; // (3)Далее, когда пройдёт таймаут ms миллисекунд – пауза будет снята, а wrapper – запущен с последними аргументами и контекстом (если во время паузы были вызовы).
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;
            }
        }, ms);
    }

    return wrapper;
}
function toastifyStatus(myText, statusError = false){
    if(statusError) {
        $('.toastify').addClass('error')
    } else{
        $('.toastify').removeClass('error')
    }
    $('.toastify i').text(myText);
    $('.toastify').addClass('open'); setTimeout(function(){ $('.toastify').removeClass('open'); }, 2000);
}
/**
 * SendStatistics
 * @param {String} type - YA or GA
 * @param {String} category
 * @param {String} action
 * @param {Number} key
 * @param {String} type
 * @param {String} proxyType
 * @returns {undefined}
 */

 function sendingStatistics(type, category, action, key, proxyType){
    try {
        if(type == "YA" && key){
            ym(key, category, action)
        }else{
            ga('send', 'event', category, action)
        }
    } catch (error) {
        console.log('statistics', error)
    }
}
//accordion
function accordion(obj) {
    var titleClick = obj.titleClick,
        allContent = obj.allContent;
    $(titleClick).click(function () {
        var content = $(this).siblings(allContent);
        if (content.is(':visible')) {
            content.slideUp(); // убираем
            $(allContent).removeClass('active');
            $(this).removeClass('active');
            $(this).parents('.offcanvas__proxy-for-geo-select-multilevel').removeClass('active');
            $(this).children().removeClass('active'); //убираем активный класс у стрелки к примеру
        } else {
            content.slideDown(); //показываем
            $(titleClick).removeClass('active');
            $(allContent).removeClass('active');
            $(titleClick).children().removeClass('active');
            $(this).addClass('active');
            content.addClass('active');
            $(this).parents('.offcanvas__proxy-for-geo-select-multilevel').addClass('active');
            $(this).children().addClass('active'); //добавляем активный класс у стрекли к примеру
        }
        $(titleClick).not(this).siblings(allContent).stop(true, true).slideUp();
    });
}

function sortDataSection(parent, data) {
    parent.find('[data-section]').removeClass('active-data-section');
    parent.find('[data-section=' + data + ']').addClass('active-data-section');
}

function setSelectValue(element, value) {
    var section = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var elVal = element.find('[data-value=' + value + ']').html(),
        selector;
    element.find('.slct').html(elVal);
    selector = '[data-value=' + value + ']' + section ? '[data-section=' + section + ']' : '';
    element.find(selector).addClass('active-data-section active');
    element.find('input').val(value);
}

function selectTypeProxy() {
    $('.quick_order button.active:not(.authorization_method_btn .main_btn2)').removeClass('active');
    $('.quick_order .quick_order_flag_items .quick_order_flag_item').hide('fade', 200).promise().done(function () {
        $('.quick_order .quick_order_flag_items .quick_order_flag_item').removeClass('active');

        $('.quick_order .quick_order_flag_items .quick_order_flag_item').each(function () {
            var attr = $(this).attr('data-selected');

            if ((typeof attr === 'undefined' ? 'undefined' : _typeof(attr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && attr !== false) {
                var dataSection = $(this).data('section');
                $(this).addClass('active');
                if ($(this).parents('.quick_order_proxy_wrap').hasClass('price')) {
                    $(this).parents('.quick_order_proxy_wrap').find('.quick_order_center_IPv4').each(function () {
                        if ($(this).find('button').data('type-proxy') == dataSection) {
                            $(this).find('button').addClass('active');
                        }
                    });
                }
            }
            if ($(this).hasClass('choice-is-made')) {
                var dataVal = $(this).data('value');

                $('.quick_order_flag_item').removeClass('animation');
                $('.quick_order_flag_item').removeClass('choice-is-made');
                $('.quick_order_flag_item').find('span').css('display', 'none');
                $(this).find('span').css('display', 'inline');
                $(this).addClass('animation active');
                $(this).addClass('choice-is-made');
                $(this).parents('.quick_order_flag_items').find('input').val(dataVal);
            }
        });
    });
}

// триггер по событиям
function triggerEvent(el, type) {
    if ('createEvent' in document) {
        // modern browsers, IE9+
        var e = document.createEvent('HTMLEvents');
        e.initEvent(type, false, true);
        el.dispatchEvent(e);
    } else {
        // IE 8
        var e = document.createEventObject();
        e.eventType = type;
        el.fireEvent('on' + e.eventType, e);
    }
}

// для parents в чистом js
// matches это для IE ибо в parents применяется проверка
(function (e) {
    var matches = e.matches || e.matchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector || e.msMatchesSelector || e.oMatchesSelector;
    !matches ? e.matches = e.matchesSelector = function matches(selector) {
        var matches = document.querySelectorAll(selector);
        var th = this;
        return Array.prototype.some.call(matches, function (e) {
            return e === th;
        });
    } : e.matches = e.matchesSelector = matches;
})(Element.prototype);

Element.prototype.parents = function (selector) {
    var elements = [];
    var elem = this;
    var ishaveselector = selector !== undefined;

    while ((elem = elem.parentElement) !== null) {
        if (elem.nodeType !== Node.ELEMENT_NODE) {
            continue;
        }

        if (!ishaveselector || elem.matches(selector)) {
            elements.push(elem);
        }
    }

    return elements;
};

// для select и input с span добавление padding

function selectAndInputPadding() {
    $('.select.span, .modal_form_input_wrap.span, .authorization_method_input_wrap.label').each(function () {
        var widthLabel = $(this).find('label').width();
        var widthSpan = $(this).find('span').width();
        if ($(this).hasClass('reduce-padding')) {
            $(this).find('.slct').css('paddingLeft', widthSpan + 15);
            $(this).find('input').css('paddingLeft', widthLabel + 15);
        } else {
            $(this).find('.slct').css('paddingLeft', widthSpan + 25);
            $(this).find('input').css('paddingLeft', widthLabel + 25);
        }

        $('.personal_account .authorization_method_input_wrap.label label').css('position', 'absolute');
    });
}

function selectAndInputPaddingMobile() {
    $('.select.span, .modal_form_input_wrap.span, .authorization_method_input_wrap.label').each(function () {
        var widthSpan = $(this).find('span').width();

        if ($(this).hasClass('reduce-padding')) {
            $(this).find('.slct').css('paddingLeft', widthSpan + 15);
        } else {
            $(this).find('.slct').css('paddingLeft', 20);
            $(this).find('input').css('paddingLeft', 20);
        }
        $('.personal_account .authorization_method_input_wrap.label label').css('position', 'static');
    });
}

function filterSelectPadding() {
    $('.select.filter-select-span').each(function () {
        var widthSpan = $(this).find('span').width();
        $(this).find('.slct').css('paddingLeft', widthSpan + 5);
    });
}
function ip_autoriz() {
    let auth_ip_d = $('.authorization_method_inner_check_ip input[type=checkbox]');
    auth_ip_d.parents('.authorization_method_inner_check_ip').find('.authorization_method_inner_check_ip_input').addClass('active');
    auth_ip_d.parents('.check').hide();
    auth_ip_d.parents('.authorization_method_inner_check_ip').find('.authorization_method_inner_check_ip_input input').focus();
    auth_ip_d.parents('.authorization_method_btn').find(' > label input[type=checkbox]').prop('checked', false);
}


// Табы
function tabs(parent) {
	$(document).on('click',parent+" button:not('button[type=submit]')", function(event) {
        //ссылки которые будут переключать табы
        event.preventDefault();
        event.stopPropagation();

        $(parent).find('button').removeClass('active'); //убираем активные состояния у ссылок

        $(this).addClass('active'); //Добавляем активное состояние у той что нажали

        var data = $(this).data('tab'); //создаём переменную с датой
        $(parent).find('.quick_order_tab').hide().removeClass('active'); //убираем активные состояния у табов
        $(parent).find('.quick_order_tab[data-tab=' + data + ']').show('fade', 500).addClass('active'); //если таб соответствует тому, какой data
        if (window.matchMedia('(min-width: 520px)').matches) {
            selectAndInputPadding();
        }
        if (window.matchMedia('(max-width: 520px)').matches) {
            selectAndInputPaddingMobile();
        }
    });
}

tabs('.quick_order_proxy_wrap:not(.price)');
tabs('.authorization_method');

function tabs2(parent) {
    parent.find('.tabs-item').on('click', function (event) {
        //ссылки которые будут переключать табы
        event.preventDefault();

        parent.find('.tabs-item[data-tab2]').removeClass('active'); //убираем активные состояния у ссылок

        $(this).addClass('active'); //Добавляем активное состояние у той что нажали

        var data = $(this).data('tab2'); //создаём переменную с датой

        if ($('.proxy_ipv6_items.proxy_ipv6_swiper0.swiper_on_mobile').length) {
            setTimeout(function () {
                window.sliders[data].init();
                window.sliders[data].update();
            }, 100);
        } else if ($('.proxy_ipv6_items.proxy_ipv6_swiper0').length) {
            setTimeout(function () {
                window.sliders[data - 1].init();
                window.sliders[data - 1].update();
            }, 100);
        }

        parent.find('.tabs-wrap[data-tab2]').removeClass('active').hide(); //убираем активные состояния у табов
        parent.find('.tabs-wrap[data-tab2=' + data + ']').show('fade', 500).addClass('active'); //если таб соответствует тому, какой data
        if (window.matchMedia('(min-width: 520px)').matches) {
            selectAndInputPadding();
        }
        if (window.matchMedia('(max-width: 520px)').matches) {
            selectAndInputPaddingMobile();
        }
        mCustomScrollbarPartnersStatistic();
    });
}

tabs2($('.save_even_more_one'));
tabs2($('.save_even_more_two'));
tabs2($('.partners_private_office_tab'));

function tabs3(parent) {
    parent.find('.tabs-item-affiliate-program').on('click', function (event) {
        //ссылки которые будут переключать табы
        event.preventDefault();

        parent.find('.tabs-item-affiliate-program[data-tab3]').removeClass('active'); //убираем активные состояния у ссылок

        $(this).addClass('active'); //Добавляем активное состояние у той что нажали

        var data = $(this).data('tab3'); //создаём переменную с датой

        parent.find('.tabs-wrap-affiliate-program[data-tab3]').removeClass('active').hide(); //убираем активные состояния у табов
        parent.find('.tabs-wrap-affiliate-program[data-tab3=' + data + ']').show('fade', 500).addClass('active'); //если таб соответствует тому, какой data
    });
}

tabs3($('.affiliate_program_tab'));

// Отключил развертывание на зеленые штучки
// function FaqTab(parent) {
//     parent.find('.FAQ-accordion-wrap>li a').on('click', function (event) {
//         //ссылки которые будут переключать табы
//         event.preventDefault();
//         // console.log('FaqTab', parent.find('.FAQ-tab-group[data-faqtab]'));
//
//         parent.find('.FAQ-tab-group[data-faqtab]').removeClass('active');
//         //убираем активные состояния у ссылок
//
//         var sticky = new Sticky('.sticky');
//         sticky.destroy();
//         sticky = new Sticky('.sticky');
//         $(this).addClass('active'); //Добавляем активное состояние у той что нажали
//
//         var data = $(this).data('faqtab'); //создаём переменную с датой
//
//         parent.find('.FAQ-tab-group[data-faqtab]').removeClass('active').hide(); //убираем активные состояния у табов
//         parent.find('.FAQ-tab-group[data-faqtab=' + data + ']').show('fade', 500).addClass('active'); //если таб соответствует тому, какой data
//     });
// }
//
// FaqTab($('.FAQ-tab-wrapper'));

function tabsPromotionalMaterials(obj) {
    var buttons = document.querySelectorAll(obj.btn);

    var func = function func(e) {
        'use strict';

        e.preventDefault();
        var thisAllWrap = obj.AllWrap ? this.parents(obj.AllWrap)[0] : this.parentNode.parentNode;
        var thisButtons = this.parentNode.parentNode.querySelectorAll(obj.btn);
        var thisBodyTabs = thisAllWrap.querySelectorAll(obj.tabsBody);
        for (var i = thisButtons.length; i--;) {
            thisButtons[i].classList.remove(obj.classBtn);
            thisBodyTabs[i].classList.remove(obj.classBody);
        }
        this.classList.add(obj.classBtn);
        var item = [].indexOf.call(thisButtons, this);
        if (obj.paired) {
            var pairedButtons = thisAllWrap.querySelectorAll(obj.pairedBtn);

            for (var c = pairedButtons.length; c--;) {
                pairedButtons[c].classList.remove(obj.classBtn);
            }

            pairedButtons[item].classList.add(obj.classBtn);

            if (obj.pairedSelect) {
                thisAllWrap.querySelector('.select .slct').textContent = thisButtons[item].textContent;
            }
        }
        thisBodyTabs[item].classList.add(obj.classBody);
    };

    [].forEach.call(buttons, function (item) {
        return item.addEventListener('click', func);
    });
}

function tabsFAQ(obj) {
    var buttons = document.querySelectorAll(obj.btn);
    var buttonsSearch = document.querySelector(obj.btnSearch);

    var func = function func(e) {
        'use strict';

        e.preventDefault();
        var thisAllWrap = obj.AllWrap && this.parents(obj.AllWrap)[0];
        var thisButtons = this.parentNode.querySelectorAll(obj.btn);
        var thisBodyTabs = obj.AllWrap ? thisAllWrap.querySelectorAll(obj.tabsBody) : this.parentNode.parentNode.parentNode.querySelectorAll(obj.tabsBody);
        for (var i = thisButtons.length; i--;) {
            thisButtons[i].classList.remove(obj.classBtn);
            (thisBodyTabs[i])?thisBodyTabs[i].classList.remove(obj.classBody):"";
        }
        this.classList.add(obj.classBtn);
        var item = [].indexOf.call(thisButtons, this);
        (thisBodyTabs[item])?thisBodyTabs[item].classList.add(obj.classBody):"";
        if (obj.sticky) {
            obj.sticky.update();
        }
    };
    var filter = function filter() {
        var inputVal = buttonsSearch.parentNode.querySelector('input').value;
        if (obj.sticky) {
            obj.sticky.update();
        }
        [].forEach.call(buttons, function (item) {
            // console.log(item)
            var filterTitle = item.querySelector('p').textContent.toLowerCase();
            if (filterTitle.indexOf(inputVal.toLowerCase()) >= 0) {
                item.style.cssText = 'display: flex';
                item.classList.add('visible');
                setTimeout(function () {
                    [].forEach.call(item.parentNode.querySelectorAll('.FAQ-tab-item.visible'), function (item, i) {
                        if (i === 0) {
                            item.click();
                        }
                    });
                }, 100);
            } else {
                item.classList.remove('visible');
                [].forEach.call(item.parents('.FAQ-tab-wrapper')[0].querySelectorAll('.FAQ-tabs-wrap'), function (item) {
                    item.classList.remove('active');
                });
                item.style.cssText = 'display: none';
            }
        });
    };
    [].forEach.call(buttons, function (item) {
        return item.addEventListener('click', func);
    });

    if (buttonsSearch) {
        buttonsSearch.addEventListener('click', function (e) {
            e.preventDefault();
            this.parentNode.querySelector('input').value = '';
            triggerEvent(this.parentNode.querySelector('input'), 'keyup');
        });
        buttonsSearch.parentNode.querySelector('input').addEventListener('keyup', function (e) {
            filter();
        });
    }
}

function articleSearch(parent) {
    parent.find('.tabs-item').on('click', function (event) {
        //ссылки которые будут переключать табы
        event.preventDefault();

        parent.find('.tabs-item').removeClass('active'); //убираем активные состояния у ссылок

        $(this).addClass('active'); //Добавляем активное состояние у той что нажали

        var data = $(this).data('search'); //создаём переменную с датой

        parent.find('.tabs-wrap').removeClass('active').hide(); //убираем активные состояния у табов
        parent.find('.tabs-wrap[data-search=' + data + ']').show('fade', 200).addClass('active'); //если таб соответствует тому, какой data
    });
}

articleSearch($('.articles'));

// Функция копирования текста в элементе
function copyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = '_hiddenCopyText_';
    var isInput = elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA';
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement('textarea');
            target.style.position = 'absolute';
            target.style.left = '-9999px';
            target.style.top = '0';
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand('copy');
    } catch (e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === 'function') {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = '';
    }
    return succeed;
}

// Функции добавления элементов через нажатие на чек в таблице
function IPcheckTpl(text, i, dataId, dataOrderType, dataOrderId, dataOrderPrice) {
    return '\n\t\t\t<div class=\'proxy_list_item\' data-id=\'' + dataId + '\' data-order_type=\'' + dataOrderType + '\' data-order_id=\'' + dataOrderId + '\' data-order_price=\'' + dataOrderPrice + '\' data-text=\'' + i + '\'>\n\t\t\t\t<i title=\'\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u0440\u043E\u043A\u0441\u0438 \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430\' class=\'fa fa-close\'></i>\n\t\t\t\t<span>' + text + '</span>\n\t\t\t</div>\n\t\t\t';
}

function IPchecked(input, attr) {
    var id = parseInt(input.attr('data-text')),
        ipArr = input.parents('tbody').find('tr'),
        limit = 0,
        ip = 0,
        text = '',
        flag = 0,
        dataId = void 0,
        dataOrderType = void 0,
        dataOrderId = void 0,
        dataOrderPrice = void 0;
    ipArr.each(function () {
        limit++;
        if (id === limit) {
            ip = 1;
            $(this).find('td').each(function () {
                flag++;
                if (flag === ip) {
                    text = $(this).text();
                    dataId = $(this).find('.check').attr('data-id');
                    dataOrderType = $(this).find('.check').attr('data-order_type');
                    dataOrderId = $(this).find('.check').attr('data-order_id');
                    dataOrderPrice = $(this).find('.check').attr('data-order_price');

                    if (input.is(':checked')) {
                        $('.proxy_list_items').append(IPcheckTpl(text, attr, dataId, dataOrderType, dataOrderId, dataOrderPrice));
                    } else {
                        $('.select_all_check').parents('.dedicated_server_top_inner').find('input:checkbox').prop('checked', false);
                        //$('.proxy_list_items').find('[data-text=' + attr + ']').remove();
                    }
                }
            });
        }
    });
}

// Создаём цикл для инициализации mCustomScrollbar в нужных select
function mCustomScrollbar() {
    $(document).find('.select .drop').each(function () {
        //инициализация mCustomScrollbar
        if ($(this).height() >= 397) {
            $(this).mCustomScrollbar({
                theme: 'my-theme'
            });
        }
    });
}

function mCustomScrollbarModal() {
    $(document).find('.select .drop').each(function () {
        if ($(this).height() >= 267) {
            $(this).mCustomScrollbar({
                theme: 'my-theme',
            });
        }
    });
}


// Создаём цикл для инициализации mCustomScrollbar в нужных select
function mCustomScrollbarPartnersStatistic() {
    $(document).find('.partners_private_office_tab .partners_private_office__number .select .drop').each(function () {
        if ($(this).height() >= 140) {
            $(this).mCustomScrollbar({
                theme: 'my-theme'
            });
        }
    });
}

// в модалке селекты ограничиваем количество букв
function selectLimitLetters() {
    $(document).find('.popup .select.span .slct').each(function () {
        var self = $(this).text();

        var str = self.slice(0, 25); //например макс 100 символов
        var a = str.split(' ');
        a.splice(a.length - 1, 1);
        str = a.join(' ');
		/* divasoft
        if (window.matchMedia('(max-width: 400px)').matches) {
            if ($(this).text().length >= 31) {
                $(this).html(str + ' ...');
            }
        }
        */
    });
}

//Клик на ссылке promo
$(document).on('click', '.extend_proxy_wrap .promo, .quick_order .quick_order_center a.promo, .popup.pop_order_form .authorization_method a.promo, .header_bottom a.promo', function (e) {
    e.preventDefault();
    $(this).parents('.enter_promo_wrap').find('.enter_promo_wrap_link').hide();
    $(this).parents('.enter_promo_wrap').find('input[type=text]').show('fade', 500).addClass('active').add(this).hide();
    $(this).parents('.enter_promo_wrap').find('i.fa-close').show('fade', 500);
});
$(document).on('click', '.quick_order .authorization_method .enter_promo_wrap i.fa-close, .popup.pop_order_form .authorization_method .enter_promo_wrap i.fa-close, .personal_account_ipv4 .extend_proxy_wrap .enter_promo_wrap i.fa-close, .header_bottom .enter_promo_wrap i.fa-close', function (e) {
    var _this = this;

    e.preventDefault();
    $(this).parents('.enter_promo_wrap').find('.enter_promo_wrap_link').show('fade', 500);
    $(this).parents('.enter_promo_wrap').find('a.promo').show('fade', 500).add(this).siblings('input').hide().removeClass('active').add(this).hide();
    setTimeout(function () {
        $(_this).parents('.enter_promo_wrap').removeClass('active');
    }, 100);
});

function getQueryParams(paramName){
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params[paramName];
}

// клик в модалке на
$(document).on('click', '.popup.pop_order_form .inner_form_item .another-service-item>i', function (e) {
    e.preventDefault();
    $(this).parents('.another-service-item').prev().show('fade').add(this).parents('.another-service-item').hide();
    if (window.matchMedia('(min-width: 520px)').matches) {
        selectAndInputPadding();
    }
    if (window.matchMedia('(max-width: 520px)').matches) {
        selectAndInputPaddingMobile();
    }
});

// клик в модалке на
$(document).on('click', '.popup.pop_order_form .inner_form_item .another-target-item>i', function (e) {
    e.preventDefault();
    document.getElementById('id_strong_modal_another-target').value = "";
    $(this).parents('.another-target-item').prev().show('fade').add(this).parents('.another-target-item').hide();
    if (window.matchMedia('(min-width: 520px)').matches) {
        selectAndInputPadding();
    }
    if (window.matchMedia('(max-width: 520px)').matches) {
        selectAndInputPaddingMobile();
    }
});

// validate ip
function ValidateIPaddress(ipaddress) {
    console.log(ipaddress)
    // if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
    //     return true;
    // }else{
    //     return false;
    // } 
}
 
function footerDropdown() {
    $('.footer-dropdown-open').off().on('click', function () {
        var $elem = $(this).find('.footer_dropdown');
        if ($elem.is(':hidden') || $elem.css('visibility') == 'hidden' || $elem.css('opacity') == 0) {
            $elem.addClass('active');
            $(this).addClass('active');
        } else {
            $elem.removeClass('active');
            $(this).removeClass('active');
            $(this).trigger('blur');
        }
    });
}

// вспомогательная функция по выставлению курсора
function setCursorPos(elem, pos) {
    if (elem.setSelectionRange) {
        elem.focus();
        elem.setSelectionRange(pos, pos);
    } else if (elem.createTextRange) {
        var range = elem.createTextRange();

        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}

// клик и hover по ссылке в  header__personal-area .header__personal-area-inner a ee ещё вызываем в resize через throttle
function headerPersonalAreaDrop() {
    if (window.matchMedia('(min-width: 992px)').matches) {
        $('.header__personal-area-inner.after-authorization').hover(function () {
            var drop = $(this).find('.header__personal-area-dropdown');
            if (drop.is(':hidden') || drop.css('visibility') == 'hidden' || drop.css('opacity') == 0) {
                $(this).addClass('active');
            }
        }, function () {
            $(this).removeClass('active');
        });
    }

    if (window.matchMedia('(max-width: 991px)').matches) {
        $('.header__personal-area-inner.after-authorization').off().on('click', function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
            }
        });
        $(document).click(function (event) {
            if ($(event.target).closest('.header__personal-area-inner').length) return;
            $('.header__personal-area-inner.after-authorization').removeClass('active');
            event.stopPropagation();
        });
    }
}

// развёртывание прокси в header
function dropdownUnfolding(obj) {
    var menu = $(obj.menu),
        toggle = menu.find(obj.toggle),
        current = toggle.first();
    var outerHeightSubmenu = void 0;
    toggle.click(function (e) {
        e.preventDefault();
        var submenu = $(this).parents('.header__level2__submenu');
        setTimeout(function () {
            outerHeightSubmenu = submenu.outerHeight();
            submenu.css({ 'min-height': outerHeightSubmenu });
        }, 400);

        $('.header__level2-nav>ul>li.header__level2-li-drop.header__level2-li-accordion .header__level2-nav-drop>ul').hover(function () {}, function () {
            submenu.css({ 'min-height': '100px' });
        });
        if ($(this).hasClass('m-open')) {
            $(this).siblings(obj.subMenu).slideUp();
            $(this).removeClass('m-open');
        } else {
            $(this).addClass('m-open').siblings(obj.subMenu).slideDown();
            toggle.filter('.m-open').removeClass('m-open').end().add($(this)).parent().removeClass('m-open');
            $(this).addClass('m-open');
        }
        toggle.not($(this)).siblings(obj.subMenu).stop(true, true).slideUp();
        $(this).parent().toggleClass('m-open');
    });
}
// развёртывание аккордеона в FAQ
function dropdownUnfoldingAccordion(obj) {
    var menu = $(obj.menu),
        toggle = menu.find(obj.toggle),
        current = toggle.first();
    toggle.click(function (e) {
        e.preventDefault();

        if ($(this).hasClass('m-open')) {
            $(this).siblings(obj.subMenu).slideUp();
            $(this).removeClass('m-open');
        } else {
            $(this).addClass('m-open').siblings(obj.subMenu).slideDown();
            toggle.filter('.m-open').removeClass('m-open').end().add($(this)).parent().removeClass('m-open');
            $(this).addClass('m-open');
        }
        toggle.not($(this)).siblings(obj.subMenu).stop(true, true).slideUp();
        $(this).parent().toggleClass('m-open');
    });
}

// прилипающий футер на vh у sticking-footer
function stickingFooter() {
    var elemH = $('.footer').outerHeight();
    var cssRules = 'calc(100vh - ' + elemH + 'px)';
    $('.sticking-footer').css('min-height', cssRules);
}

// функция делает обновление прилипающих элементов на странице
function stickyUpdateFAQ() {
    if (window.matchMedia('(max-width: 1199px)').matches) {
        $('.partners_private_office_main .partners_private_office_tab_left_links .personal-area-nav').attr('data-margin-top', 40);
        $('.FAQ-tab-wrap-all .FAQ-tabs-wrap').attr('data-margin-top', 40);
    } else if (window.matchMedia('(min-width: 1200px)').matches) {
        $('.partners_private_office_main .partners_private_office_tab_left_links .personal-area-nav').attr('data-margin-top', 90);
        $('.FAQ-tab-wrap-all .FAQ-tabs-wrap').attr('data-margin-top', 90);
    }
    var sticky = new Sticky('.sticky');
    sticky.destroy();
    sticky = new Sticky('.sticky');
}

function CountdownTimer(min, sec, mic, tl, mes) {
    this.initialize.apply(this, arguments);
}

var tid;
CountdownTimer.prototype = {
    initialize: function initialize(min, sec, mic, tl, mes) {
        this.min = document.getElementById(min);
        this.sec = document.getElementById(sec);
        this.mic = document.getElementById(mic);
        this.tl = tl;
        this.mes = mes;
    },
    countDown: function countDown() {
        var minRes = '';
        var secRes = '';
        var mmicRes = '';
        var today = new Date();
        var min = Math.floor((this.tl - today) % (24 * 60 * 60 * 1000) / (60 * 1000)) % 60;
        var sec = Math.floor((this.tl - today) % (24 * 60 * 60 * 1000) / 1000) % 60 % 60;
        var mic = Math.floor(this.tl - today / 10);

        var me = this;

        if (this.tl - today > 0) {
            minRes = this.addZero(min);
            secRes = this.addZero(sec);
            mmicRes = this.addZero(mic);

            this.min.innerHTML = minRes;
            this.sec.innerHTML = secRes;
            this.mic.innerHTML = mmicRes;
            // переменная tid задаёт темп обновления функции и проверяет актуальность функции по заданной в tl дате (это как бы рекурсия)
            tid = setTimeout(function () {
                me.countDown();
            }, 10);
        } else {
            //this.elem.innerHTML = this.mes;
            this.mic.innerHTML = '00';
            return;
        }
    },
    addZero: function addZero(num) {
        return ('0' + num).slice(-2);
    }
};

function tableTimer() {
    // Set countdown limit
    var tl = Math.floor(new Date()) + (60000 + 1);
    // You can add time's up message here
    var timer = new CountdownTimer('minute', 'sec', 'micro', tl, '<span class="number-wrapper"><span class="number end">Время пришло!</span></span>');
    timer.countDown();
}

window.slidersIsInit = undefined;
window.slidersResidentialProxiesRatesIsInit = undefined;
window.slidersResidentialProxiesRates = [];
window.sliders = [];

function modalOnMainIp() {
    var that = $('.authorization_method_inner_check_ip input[type=checkbox]');

    if (_typeof(that.attr('data-selected')) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && that.attr('data-selected') !== false) {
        that.parents('.authorization_method_inner_check_ip').find('.authorization_method_inner_check_ip_input').addClass('active');
        that.parents('.check').hide();
        that.parents('.authorization_method_inner_check_ip').find('.authorization_method_inner_check_ip_input input').focus();
        that.parents('.authorization_method_btn').find(' > label input[type=checkbox]').prop('checked', false);
    }
}

function modalByLoginAndPassword() {
    var that = $('.authorization_method_btn').find(' > label input[type=checkbox]');

    if (_typeof(that.attr('data-selected')) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && that.attr('data-selected') !== false) {
        that.prop('checked', true);
        that.parents('.authorization_method_btn').find('.authorization_method_inner_check_ip_input i').click();
    }
}

function modalInitialization() {
    modalByLoginAndPassword();
    selectDropLiEach();
    headerInputThings();

    if (window.matchMedia('(min-width: 520px)').matches) {
        selectAndInputPadding();
    }
    if (window.matchMedia('(max-width: 520px)').matches) {
        selectAndInputPaddingMobile();
    }
}
//*
function headerInputThings() {
    // TODO ПЕРЕДЕЛАТЬ
    $('.header-input').click(function () {
        var arr = $(this).val().split(' '),
            arrMain = $(this).val().split(' ' + arr[arr.length - 1]);
        if (arr[0] == '0') {
            $(this).val(' ' + arr[1]);
            setCursorPos(this, arrMain[0].length - 1);
        } else if (arr[0] == '' && arr[1] == BX.message('TEMPL_PCS')) {
            $(this).val('');
        } else {
            $(this).val(arr[0].replace(/\D/g, '') + ' ' + BX.message('TEMPL_PCS'));
            setCursorPos(this, arrMain[0].length);
        }
    });
    $('.header-input').on('keyup', function (e) {
        var arr = $(this).val().split(' '),
            arrMain = $(this).val().split(' ' + arr[arr.length - 1]);
        if (arr[0] == '0') {
            $(this).val(' ' + arr[1]);
            setCursorPos(this, arrMain[0].length - 1);
        } else if (arr[0] == '' && arr[1] == BX.message('TEMPL_PCS')) {
            $(this).val('');
        } else {
            $(this).val(arr[0].replace(/\D/g, '') + ' ' + BX.message('TEMPL_PCS'));
            setCursorPos(this, arrMain[0].length-3);
        }
    });
    $('.header-input').on('blur', function () {
        var arr = $(this).val().split(' ');
        if (arr[0] == '' && arr[1] == BX.message('TEMPL_PCS')) {
            $(this).val('');
        } else if (!arr[1] && arr[0] == '') {
            $(this).val('');
        } else if ($(this).val() === '') {
            $(this).val('');
        } else {
            $(this).val(arr[0].replace(/\D/g, '') + ' ' + BX.message('TEMPL_PCS'));
            // setCursorPos(this, 2)
        }
    });
}
//*/
//вспомогательная функция для асинхронного forEach
async function asyncForEach(array, callback) {
    for (var index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

// вспомогательная функция для которая возвращает промис, пока она выполняется функция ниже (isFalseFun() в нашем случае) не выполнится
var waitFor = function waitFor(ms) {
    return new Promise(function (r) {
        return setTimeout(r, ms);
    });
};

$('.header__level2-li-accordion').each(function () {
    var thisOuterWidth = $(this).outerWidth();
    $(this).find('.header__level2__submenu').css('width', thisOuterWidth);
});

function funSwiperProxyIpv6Items() {

        $('.proxy_ipv6_items').each(function (i) {
            var swiperProxyIpv6Items = new Swiper('.proxy_ipv6_swiper' + i + ' .swiper-container', {
                init: false,
                slidesPerView: 6,
                spaceBetween: 0,
                // allowTouchMove: false,
                pagination: {
                    el: '.proxy_ipv6_swiper' + i + ' .swiper-pagination',
                    type: 'bullets',
                    clickable: true
                },
                navigation: {
                    nextEl: '.proxy_ipv6_swiper' + i + ' .button-next',
                    prevEl: '.proxy_ipv6_swiper' + i + ' .button-prev'
                },
                breakpoints: {
                    // when window width is <= 320px
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 0
                    },
                    // when window width is <= 480px
                    480: {
                        slidesPerView: "auto",
                        spaceBetween: 0
                    },
                    // when window width is <= 640px
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 0
                    },
                    990: {
                        slidesPerView: 3,
                        spaceBetween: 0
                    },
                    // when window width is <= 1200px
                    1200: {
                        slidesPerView: 4,
                        spaceBetween: 0
                    }
                }
            });
            window.sliders.push(swiperProxyIpv6Items);
        });
        setTimeout(function() {
            var swiperProxyIpv6 = new Swiper('.proxy_ipv6_swiper_main .swiper-container', {
            slidesPerView: 6,
            spaceBetween: 0,
            // allowTouchMove: false,
            pagination: {
                el: '.proxy_ipv6_swiper_main .swiper-pagination',
                type: 'bullets',
                clickable: true
            },
            navigation: {
                nextEl: '.proxy_ipv6_swiper_main .button-next',
                prevEl: '.proxy_ipv6_swiper_main .button-prev'
            },
            breakpoints: {
                // when window width is <= 320px
                320: {
                    slidesPerView: 1,
                    spaceBetween: 0
                },
                // when window width is <= 480px
                480: {
                    slidesPerView: "auto",
                    spaceBetween: 0
                },
                // when window width is <= 640px
                640: {
                    slidesPerView: 2,
                    spaceBetween: 0,
                    allowTouchMove: true
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 0
                },
                // when window width is <= 1200px
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 0
                }
            }
        });
            window.sliders.push(swiperProxyIpv6);
        }, 50);

}

function funSwiperResidentialProxiesRates() {
    $('.residential-proxies-rates__items').each(function (i) {
        var swiperResidentialProxiesRates = new Swiper('.rates_swiper' + i + ' .swiper-container', {
            init: false,
            observer: true,
            observeParents: true,
            slidesPerView: 3,
            spaceBetween: 0,
            allowTouchMove:false,
            pagination: {
                el: '.rates_swiper' + i + ' .swiper-pagination',
                type: 'bullets',
                clickable: true
            },
            // navigation: {
            //     nextEl: '.swiper' + i + ' .button-next',
            //     prevEl: '.swiper' + i + ' .button-prev',
            // },
            breakpoints: {
                // when window width is <= 320px
                320: {
                    slidesPerView: 1,
                    spaceBetween: 0
                },
                // when window width is <= 480px
                519: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    allowTouchMove: true
                },
                776: {
                    slidesPerView: 2,
                    spaceBetween: 0
                },
                // when window width is <= 1200px
                1200: {
                    slidesPerView: 3,
                    spaceBetween: 0
                }
            }
        });
        window.slidersResidentialProxiesRates.push(swiperResidentialProxiesRates);
    });
}

$(document).ready(function () {
	$(document).on('click','.quick_order .quick_order_proxy_wrap button', function(e) {
        e.preventDefault();

        var thatBtn = $(this);
        var thatDataVal = $(this).data('type-proxy');

        $('.quick_order .quick_order_proxy_wrap button').removeClass('active');
        thatBtn.addClass('active');
        $('.quick_order .quick_order_flag_items .quick_order_flag_item').hide('fade', 200).promise().done(function () {
            $('.quick_order .quick_order_flag_items .quick_order_flag_item').removeClass('active');
            $('.quick_order .quick_order_flag_items .quick_order_flag_item').each(function () {
                var dataVal = $(this).data('value');
                var dataSection = $(this).data('section');

                if (thatDataVal == dataSection) {
                    $(this).show('fade', 200).promise().done(function () {
                        $(this).addClass('active');
                    });
                    $('.quick_order_flag_item').find('span').css('display', 'none');
                }
            });
        });
    });

    const promoHero = getQueryParams('promocode');
    if(promoHero){
        $('.header_bottom a.promo').parents('.enter_promo_wrap').find('.enter_promo_wrap_link').hide();
        $('.header_bottom a.promo').parents('.enter_promo_wrap').find('input[type=text]').show('fade', 500).addClass('active').add('.header_bottom a.promo').hide();
        $('.header_bottom a.promo').parents('.enter_promo_wrap').find('input[type=text]').val(promoHero);
        $('.header_bottom a.promo').parents('.enter_promo_wrap').find('i.fa-close').show('fade', 500);
    }
    
    selectTypeProxy();

    // пример вызова модального окна
    //openModal('modal-order');

    // событие в .mailing-lists
    $('.mailing-lists__item input[type=checkbox]').on('change', function () {
        var arr = [];

        if ($(this).prop('changes')) {
            $(this).prop('changes', false);
        } else {
            $(this).prop('changes', true);
        }
        // начало асинхронной функции чтобы в начале выполнился ForEach
        var start = async function start() {
            await asyncForEach($('.mailing-lists__item input[type=checkbox]'), async function (num, index, array) {
                await waitFor(50);

                if ($(num).prop('changes')) {
                    arr.push(false);
                } else {
                    arr.push(true);
                }
            });

            function isFalseFun() {
                var isFalse = void 0;

                isFalse = arr.some(function (elem) {
                    return elem === false;
                });
                if (isFalse) {
                    $('.mailing-lists button[type=submit]').prop('disabled', false);
                } else {
                    $('.mailing-lists button[type=submit]').prop('disabled', true);
                }
            }

            isFalseFun();
        };
        start();
    });

    // document.addEventListener('select-selected', function (event) {
    //     console.log(event);
    // });

    //setSelectValue($('.header_select-item.bound-pair-select'), '115');

    // активация label на модалке новой
    $('.popup-invoicing input').on('focus', function () {
        $(this).siblings('label').addClass('is_focused');
    });
    $('.popup-invoicing input').on('blur', function () {
        if ($(this).val() === '') {
            $(this).siblings('label').removeClass('is_focused');
        } else if ($(this).val() !== '') {
            $(this).siblings('label').addClass('is_focused');
        }
    });
    // вызов функции для селекта в таблицах
    filterSelectPadding();
    // вызов функции  stickyUpdateFAQ
    if ($('.partners_private_office_tab_left_links').length) {
        stickyUpdateFAQ();
    }
    // маска input-mask
	if($('.input-mask').length){
		$('.input-mask').mask('(9) 99 999 99 99');
	}

    //inputmask прописана маска в дата атрибутах
	if($('.ip-mask').length){
		try {
            $(".ip-mask").inputmask();
          } catch (err) {}
	}
    // прилипающий футер на vh у sticking-footer
    stickingFooter();
    // развёртывание доп меню в сайдбаре в ЛК
    // dropdownUnfolding({
    // 	menu: '.personal-area-nav-dropdown',
    // 	toggle: '.personal-area-navmenu-link-toggle',
    // 	subMenu: '.personal-area-nav__submenu'
    //
    // });

    // развёртывание прокси в header__level2
    dropdownUnfolding({
        menu: '.header__level2__submenu',
        toggle: '.header__level2__menu-link-toggle',
        subMenu: '.header__level2__submenu-drop'
    });

    // Отключил faq
    // dropdownUnfoldingAccordion({
    //     menu: '.FAQ-accordion-wrap',
    //     toggle: '.FAQ-accordion__link-toggle',
    //     subMenu: '.FAQ-accordion-drop'
    // });

    $('.personal-area-nav-dropdown').first().find('.personal-area-navmenu-link-toggle').trigger('click');
    // в модалке pop_order_form делаем добавление второго блока с страной , целью, услугой и прочим
    $('.popup.pop_order_form .inner_form_second_country_selection .inner_form_second_country_selection_inner.add').on('click', function () {
        window.modalOrderTpl = $('[data-modal=modal-order]').find('.inner_form_items-wrap').first().clone();

        $(this).parents('.inner_form').find('.inner_form-block-insert-template').append(window.modalOrderTpl);

        if (window.matchMedia('(min-width: 520px)').matches) {
            selectAndInputPadding();
        }
        if (window.matchMedia('(max-width: 520px)').matches) {
            selectAndInputPaddingMobile();
        }

        headerInputThings();
    });

    $(document).on('mouseenter', '.popup.pop_order_form .inner_form_items-wrap .inner_form_second_country_selection .inner_form_second_country_selection_inner.minus', function (event) {
        $(this).parents('.inner_form_items-wrap').find('.inner_form_items').css('outline', '1px solid red');
    }).on('mouseleave', '.popup.pop_order_form .inner_form_items-wrap .inner_form_second_country_selection .inner_form_second_country_selection_inner.minus', function (event) {
        $(this).parents('.inner_form_items-wrap').find('.inner_form_items').css('outline', 'none');
    });
    $(document).on('click', '.popup.pop_order_form .inner_form_items-wrap .inner_form_second_country_selection .inner_form_second_country_selection_inner.minus', function (event) {
        $(this).parents('.inner_form_items-wrap').remove();
    });
    $(document).on('change', '.authorization_method_btn > label input[type=checkbox]', function () {
        if ( !$(this).is(':checked') ) {
            ip_autoriz();
        }
        if ( $(this).prop('checked') ) {
            $(this).parents('.authorization_method_btn').find('.authorization_method_inner_check_ip_input i').click();
        }
    });
    $(document).on('change', '.protocol_btn-check input[type=checkbox]', function () {
        if ( !$(this).is(':checked') ) {
            let auth_ip_d = $(".rotation input[type=checkbox]");
            auth_ip_d.parents('.rotation').find('.inner_form_item').css('display', "block");
            auth_ip_d.parents('.check').hide();
            auth_ip_d.parents('.protocol_btn').find(' > label input[type=checkbox]').prop('checked', false);
        }
        if ( $(this).prop('checked') ) {
            $(this).parents('.protocol_btn').find('.inner_form_item').css("display", "none");
            $(this).parents('.protocol_btn').find('.rotation .check').css("display", "block");
        }
    });

    $(document).on('change', '.protocol_btn > label input[type=checkbox]', function () {
        var a = $(this);
        var b = $(a).prop('name'), c = $(a).prop('checked');

        $('input[name=protocol_type_https]').prop('checked', false);
        $('input[name=protocol_type_socks5]').prop('checked', false);

        if($(a).prop('name') == "protocol_type_https" && c)
        {
        	$(a).prop('checked', true);
        }

        if($(a).prop('name') == "protocol_type_socks5" && c)
        {
        	$(a).prop('checked', true);
        }

        if($(a).prop('name') == "protocol_type_https" && !c)
        {
        	$('input[name=protocol_type_socks5]').prop('checked', true);
        }

        if($(a).prop('name') == "protocol_type_socks5" && !c)
        {
        	$('input[name=protocol_type_https]').prop('checked', true);
        }

    });

    // Событие на чек в блоке authorization_method_inner_check_ip

    $(document).on('change', '.authorization_method_inner_check_ip input[type=checkbox]', function () {
        if ($(this).prop('checked')) {
            ip_autoriz();
        } else {
            $(this).parents('.authorization_method_inner_check_ip').find('.authorization_method_inner_check_ip_input').removeClass('active');
        }
    });
    $(document).on('change', '.rotation input[type=checkbox]', function () {
        if ($(this).prop('checked')) {
                let auth_ip_d = $(".rotation input[type=checkbox]");
                auth_ip_d.parents('.rotation').find('.inner_form_item').css('display', "block");
                auth_ip_d.parents('.check').hide();
                auth_ip_d.parents('.protocol_btn').find(' > label input[type=checkbox]').prop('checked', false);
        } else {
            $(this).parents('.rotation').find('.authorization_method_inner_check_ip_input').removeClass('active');
        }
    });
    $(document).on('click tap touchstart', '.popup.pop_order_form .authorization_method_inner_check_ip_input i', function () {
        $('.authorization_method_btn > label input[type=checkbox]').prop('checked', true);
        $(this).parents('.authorization_method_inner_check_ip_input').removeClass('active');
        $(this).parents('.authorization_method_inner_check_ip').find('.check input[type=checkbox]').prop('checked', false);
        $(this).parents('.authorization_method_inner_check_ip').find('.check').show('fade', 200);
    });
    // Инициализация маски в input
    $(document).on('keyup', '.ip', function (e) {
        var code = e.keyCode || e.which;
        //Only check last section!
        var that = $(this);
        var isInt = code >= 48 && code <= 57 || code >= 96 && code <= 105;
        var ipformat = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|\*)(?:,\s*(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|\*))*$/;
        // console.log('that.val()', that.val());

        console.log('checkIP', checkIP(that.val()));
        if (ipformat.test(that.val()) || checkIP(that.val()) === false) {
            that.parents('.authorization_method_inner_check_ip_input').removeClass('error');
            return false;
        } else if (code == 191) {
            //CIDR Slash
            return that.val().indexOf('/') == -1;
        } else if (code == 8 || code == 46 || code == 9 || code == 13) {
            return true;
        }
        that.parents('.authorization_method_inner_check_ip_input').addClass('error');
    });
    $('.ip').on('blur', function () {
        if ($(this).val() == '0.0.0.0' || $(this).val() == '0' || $(this).val() == '0.0.0' || $(this).val() == '0.0') {
            $(this).val('');
        }
    });
    // Убираем рекламный блок top-shares
    $('.top-shares__txt >a').on('click', function (e) {
        e.preventDefault();
        $('.top-shares').hide();
    });
    // Скрипт отрисовки линии, которая отображает процент прокрутки контента
    if (typeof $('.header-load').html() != 'undefined' && typeof $('.configure_Safari_and_MAC_OS__form').html() != 'undefined') {
        $('.header-load').each(function () {
            var $this = $(this);
            setInterval(function () {
                var endLoad = $('.configure_Safari_and_MAC_OS__form').offset().top,
                    wPos = $(window).scrollTop();
                $this.css('width', wPos * 100 / endLoad + '%');
            }, 20);
        });
    }
    headerPersonalAreaDrop();
    $('.header__personal-area-inner.after-authorization > a').on('click', function (e) {
        e.preventDefault();
    });
    // клонирование блока в модалке modal-order-dedicated-server-modifications
    $(document).on('click', '.popup.pop_order_form .modal-order-dedicated-server-modifications-plus', function () {
        var modificationsWrapClone = $(this).parent().parent();
        var modificationsClone = $(this).parent().parent().clone();
        modificationsWrapClone.after(modificationsClone);
    });
    // страница partners_private_office.html кнопка показать код
    $('.partners_private_office__profile_body_balance .show-code').on('click', function (e) {
        e.preventDefault();
        if ($(this).hasClass('hide-code')) {
            $(this).parent().siblings('.affiliate-links').hide('fade').end().add(this).children().text('Показать код').removeClass('hide-code');
        } else {
            $(this).parent().siblings('.affiliate-links').show('fade').end().add(this).children().text('Скрыть код').addClass('hide-code');
        }
    });
    // табы promotional-materials
    tabsPromotionalMaterials({
        btn: '.tabs-items-wrap > .tabs-item-promotional-materials',
        tabsBody: '.tabs-wrap',
        classBody: 'active',
        classBtn: 'active'
    });
    tabsPromotionalMaterials({
        btn: '.tabs-items-wrap-inner > .tabs-item-promotional-materials',
        tabsBody: '.tabs-wrap-inner',
        classBody: 'active',
        classBtn: 'active'
    });
    tabsPromotionalMaterials({
        btn: '.tabs-item-wrap > .tabs-item',
        tabsBody: '.main-tabs-with-prices .tabs-wrap',
        classBody: 'active',
        classBtn: 'active',
        paired: true,
        pairedBtn: '.main-tabs-with-prices .select ul.drop li',
        pairedSelect: true
    });
    tabsPromotionalMaterials({
        btn: '.main-tabs-with-prices .select ul.drop li',
        tabsBody: '.main-tabs-with-prices .tabs-wrap',
        classBody: 'active',
        classBtn: 'active',
        AllWrap: '.main-tabs-with-prices',
        paired: true,
        pairedBtn: '.tabs-item-wrap > .tabs-item'
    });
    tabsPromotionalMaterials({
        btn: '.header__level2-nav .header__level2-nav-drop.proxy .header__level2-nav-tabs-item',
        tabsBody: '.header__level2-nav .header__level2-nav-drop.proxy .header__level2-nav-tabs-inner>ul',
        classBody: 'active',
        classBtn: 'active',
        AllWrap: '.header__level2-nav-drop'
    });
    tabsPromotionalMaterials({
        btn: '.residential-proxies-rates__tab-links .residential-proxies-rates__tab-link',
        tabsBody: '.residential-proxies-rates__items',
        classBody: 'active',
        classBtn: 'active',
        AllWrap: '.residential-proxies-rates'
    });
    //sticky
    var sticky = new Sticky('.sticky');
    // табы на странице frequently_asked_questions.html
    // sticky - это мы передаём параметром в функцию tabsFAQ ссылку на экземпляр объявленный выше
    // Отключил табы на странице faq, остальные вроде на затронул
    // tabsFAQ({
    //     btn: '.FAQ-tab-items .FAQ-tab-item',
    //     tabsBody: '.FAQ-tab-group.active .FAQ-tabs-wrap',
    //     classBody: 'active',
    //     classBtn: 'active',
    //     AllWrap: '.FAQ-tab-wrapper',
    //     btnSearch: '.сonditions.articles .articles__search button',
    //     sticky: sticky
    // });

    tabsFAQ({
        btn: '.mobile-proxies-tabs#index-mobile-proxies-tabs .tabs-items-wrap .mobile-proxies-tabs__btn',
        tabsBody: '.tabs-all-items-wrap .mobile-proxies-tabs-wrap',
        classBody: 'active',
        classBtn: 'active'
    });

    tabsFAQ({
        btn: '.mobile-proxies-tabs#mobile-proxies-tabs .tabs-items-wrap .mobile-proxies-tabs__btn',
        tabsBody: '.tabs-all-items-wrap .tabs-wrap',
        classBody: 'active',
        classBtn: 'active'
    });

    tabsFAQ({
        btn: '.mobile-proxies-tabs__inner-block .tabs-items-operator',
        tabsBody: '.tabs-all-items-wrap .tabs-wrap-inner',
        classBody: 'active',
        classBtn: 'active'
    });
    // инициализация swiper слайдера
    var swiperArticles = new Swiper('.frequent-questions-and-articles__articles .swiper-container', {
        slidesPerView: 4,
        spaceBetween: 0,
        direction: 'vertical',
        navigation: {
            nextEl: '.frequent-questions-and-articles__articles .button-next',
            prevEl: '.frequent-questions-and-articles__articles .button-prev'
        },
        breakpoints: {
            // when window width is <= 320px
            320: {
                slidesPerView: 1,
                spaceBetween: 0
            },
            // when window width is <= 480px
            480: {
                slidesPerView: 1,
                spaceBetween: 0
            },
            // when window width is <= 640px
            640: {
                slidesPerView: 2,
                spaceBetween: 0
            },
            // when window width is <= 1200px
            1200: {
                slidesPerView: 3,
                spaceBetween: 0
            }
        }
    });

    if ($('.proxy_ipv6_items.proxy_ipv6_swiper0').length) {
        window.sliders.length === 0 && funSwiperProxyIpv6Items();

        if ($('.proxy_ipv6_items').hasClass('swiper_on_mobile')) {
            if (window.matchMedia('(max-width: 1199px)').matches) {
                $('.proxy_ipv6_items.swiper_on_mobile .swiper-wrapper .proxy_ipv6_item').parent().addClass('swiper-slide');
                setTimeout(function () {
                    window.slidersIsInit === undefined && window.sliders.forEach(function (item) {
                        item.init();
                        window.slidersIsInit = true;
                    });
                }, 100);
            } else {
                setTimeout(function () {
                    window.slidersIsInit !== undefined && window.sliders.forEach(function (item) {
                        item.destroy();
                        window.sliders = [];
                        window.slidersIsInit = undefined;
                    });
                }, 100);
            }
        } else {
            /*setTimeout(function () {
                window.sliders.forEach(function (item) {
                    item.init();
                });
            }, 100);*/
        }
    }

    if ($('.residential-proxies-rates__items').length) {
        window.slidersResidentialProxiesRates.length === 0 && funSwiperResidentialProxiesRates();

        if (window.matchMedia('(max-width: 991px)').matches) {
            $('.residential-proxies-rates__items .swiper-wrapper .residential-proxies-rates__item').parent().addClass('swiper-slide');
            setTimeout(function () {
                window.slidersResidentialProxiesRatesIsInit === undefined && window.slidersResidentialProxiesRates.forEach(function (item) {
                    // console.log('slidersResidentialProxiesRates.forEach item', item);
                    item.init();
                    window.slidersResidentialProxiesRatesIsInit = true;
                });
            }, 100);
        } else {
            setTimeout(function () {
                window.slidersResidentialProxiesRatesIsInit !== undefined && window.slidersResidentialProxiesRates.forEach(function (item) {
                    item.destroy();
                    window.slidersResidentialProxiesRates = [];
                    window.slidersResidentialProxiesRatesIsInit = undefined;
                });
            }, 100);
        }
    }

    // убираем активное состояние у кнопки в первом экране
    $('.header_bottom_btn button').on('click', function () {
        var self = $(this);
        setTimeout(function () {
            self.blur();
        }, 1000);
    });

    // Показываем пароль
    function ShowHidePassword(el) {
        var element = el;
        element.replaceWith(element.clone().attr('type', element.attr('type') == 'password' ? 'text' : 'password'));
    }

    $('.show-password').on('click', function (e) {
        e.preventDefault();
        var elem = $(this).parent().siblings('input');
        ShowHidePassword(elem);
    });
    // делаем при клике чтобы курсор становился в конец певрого слова или вводимого

    headerInputThings();

    // убираем клик по дефолту
    $('.no-click').on('click', function (e) {
        e.preventDefault();
    });
    
    // вводим только цифры
    // todo педелать на один слушатель
    $('body').on('input', 'input.only-num', function(e){
        var c = this.selectionStart,
      r = /[^a-z0-9]/gi,
      v = $(this).val();
        if(r.test(v)) {
            $(this).val(v.replace(r, ''));
            c--;
        }
    })
    $('body').on('keydown', 'input.only-num', function(event){
        // Разрешаем нажатие клавиш backspace, Del, Tab и Esc
        if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
            // Разрешаем выделение: Ctrl+A
            event.keyCode == 65 && event.ctrlKey === true ||
            // Разрешаем клавиши навигации: Home, End, Left, Right
            event.keyCode >= 35 && event.keyCode <= 39) 
            {
                return;
            }
             else {
                // Запрещаем всё, кроме клавиш цифр на основной клавиатуре, а также Num-клавиатуре
                if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            }
        
        
    })
    // клик на ссылку вызова footer_dropdown
    $('.footer-dropdown-open > a').on('click', function (e) {
        e.preventDefault();
    });

    if (window.matchMedia('(max-width: 992px)').matches) {
        footerDropdown();
    }
    $(document).click(function (event) {
        if ($(event.target).closest('.footer-dropdown-open').length) return;
        $('.footer .footer_dropdown').removeClass('active');
        $('.footer-dropdown-open').removeClass('active');
        event.stopPropagation();
    });

    // пример выборки текстовых узлов
    // https://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery
    // на чистом var text = document.getElementsByClassName('articles__search-dropdown-item')[0];
    //console.log(text.childNodes[0].textContent = articlesSearchInput + ' ');
    // активация при поиске выпадающего списка
    $('#articles__search-input').on('keyup', function () {
        var articlesSearchInput = $('#articles__search-input').val();
        $('.articles__search-dropdown').show();
        // $.each($('.articles__search-dropdown-item'),
        // 	function () {
        // 		$(this).contents().filter(function () {
        // 			return this.nodeType === 3;
        // 		})[0].textContent = articlesSearchInput + ' ';
        // 	})
    });
    $('#articles__search-input').on('focus', function () {
        if ($('#articles__search-input').val().length >= 1) {
            $('.articles__search-dropdown').show();
        }
    });
    $(document).click(function (event) {
        if ($(event.target).closest('.articles__search').length) return;
        $('.articles__search-dropdown').hide();
        event.stopPropagation();
    });
    // активация по клику кнопок волюты quick_order_min_block_item_currency_selection на главной странице
    $('.quick_order .quick_order_min_block_sum .quick_order_min_block_item_currency_selection button').on('click', function () {
        $('.quick_order .quick_order_min_block_sum .quick_order_min_block_item_currency_selection button').removeClass('active');
        $(this).addClass('active');
    });
    // Вызовы функций selectAndInputPadding и  selectAndInputPaddingMobile
    if (window.matchMedia('(min-width: 520px)').matches) {
        selectAndInputPadding();
    }
    if (window.matchMedia('(max-width: 520px)').matches) {
        selectAndInputPaddingMobile();
    }
    //кликабельная строка в таблице
    $('tbody tr[data-href]').addClass('clickable').click(function () {
        window.open($(this).attr('data-href'));
    }).find('a, .check, .copy-ip').hover(function () {
        $(this).parents('tr').off('click');
    }, function () {
        $(this).parents('tr').click(function () {
            window.open($(this).attr('data-href'));
        });
    });
    // Скролл по кнопке добавить ещё ipv6
    $(document).on('click', '.proxy_ipv6 .center button', function () {
        var anchor = $(this).parent();
        $('html, body').stop().animate({
            scrollTop: anchor.offset().top - 300
        }, 1000);
    });
    // Неизменяемая строка в input
    var unchangeableInputVal = 'site.ru/ghtrrekger';
    var unchangeableInput = $('#unchangeable');

    $('#unchangeable').on('keyup', function () {
        var check = unchangeableInput.val().slice(0, unchangeableInputVal.length);
        if (check !== unchangeableInputVal) {
            unchangeableInput.val(unchangeableInputVal);
        }
    });

    // Инициализация datepicker
	if($('.datepicker').length){
		$('.datepicker').datepicker({
			showOtherMonths: true,
			changeMonth: true,
			changeYear: true,
			dateFormat: 'dd.mm.yy',
			monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			dayNamesMin: [BX.message('DATEPIC_SU'), BX.message('DATEPIC_MO'), BX.message('DATEPIC_TU'), BX.message('DATEPIC_WE'), BX.message('DATEPIC_TH'), BX.message('DATEPIC_FR'), BX.message('DATEPIC_SA')],
			firstDay: 1,
			beforeShow: function beforeShow(input, inst) {
				// Handle calendar position before showing it.
				// It's not supported by Datepicker itself (for now) so we need to use its internal variables.
				var calendar = inst.dpDiv;

				// Dirty hack, but we can't do anything without it (for now, in jQuery UI 1.8.20)
				setTimeout(function () {
					calendar.position({
						my: 'center top',
						at: 'center bottom',
						collision: 'none',
						of: input
					});
				}, 1);
			}
		});
	}


    // вызов функции с заданными параметрами
    // if ($('.current-orders-table-wrapper-ipv4').length) {
    //     checkedControlTable({
    //         mainParent: '.current-orders-table-wrapper-ipv4',
    //         input: '.personal_account_ipv4_table input[type="checkbox"]:not(.all_check):not(.switct-btn)',
    //         chosseAll: '.select_all_check input[type="checkbox"]',
    //         count: '.how-many-proxies-are-selected'
    //     });
    // }
    // вызов функции с заданными параметрами
    // if ($('.current-orders-table-wrapper-ipv6').length) {
    //     checkedControlTable({
    //         mainParent: '.current-orders-table-wrapper-ipv6',
    //         input: '.personal_account_ipv4_table input[type="checkbox"]:not(.all_check):not(.switct-btn)',
    //         chosseAll: '.select_all_check input[type="checkbox"]',
    //         count: '.how-many-proxies-are-selected'
    //     });
    // }

    //копируем то что в input страницы PA
    /*var clipboard = new ClipboardJS('.copy_the_txt');

    var copy_the_ip = new ClipboardJS('.copy-ip');
*/
// var copyTable = new ClipboardJS('.copy');



	// clipboard.on('success', function(e) {
	// 	toastifyStatus()
	//     e.clearSelection();
	// });

	// copy_the_ip.on('success', function(e) {
	// 	toastifyStatus()
	//     e.clearSelection();
	// });
	// copyTable.on('success', function(e) {
	// 	toastifyStatus();
	//     e.clearSelection();
	// });
    $('body').on('click', '.copy', function(event){
        event.stopPropagation();
        const text =  $(this).attr('data-clipboard-text');
        copyTextToClipboard(text);
       
    })
    async function copyTextToClipboard(text) {
        try {
          await navigator.clipboard.writeText(text);
          toastifyStatus(BX.message('COPY_MSG')) //BX.message('ORDERS_MSG_COPY');
        } catch (err) {
            toastifyStatus("Error", false) 
        }
      }
    // Активация input на странице personal_account.html
    $('.activateInput').on('click', function (e) {
        e.preventDefault();
        $(this).hide();
        $(this).siblings().show('fade');
        $(this).siblings().removeAttr('disabled');
        $(this).parents('form').find('input').removeAttr('readonly');
    });
    // Деактивация input на странице personal_account.html
    $('.disabledInput').on('click', function () {
        $(this).hide();
        $(this).siblings().show('fade');
        $(this).parents('form').find('input').attr('readonly', true);
        //$(this).parents('form').trigger('submit');
    });

    accordion({
        titleClick: '.accordion .accordion_title',
        allContent: '.accordion .accordion_content'
    });
    accordion({
        titleClick: '.offcanvas__personal-area-inner.after-authorization',
        allContent: '.offcanvas__personal-area .offcanvas__personal-area-dropdown'
    });
    // вызов в сайдбаре н страницах с двухуровневым хедером
    accordion({
        titleClick: '.offcanvas__proxy-for-geo-select-multilevel-drop ul li a.no-click',
        allContent: '.offcanvas__proxy-for-geo-select-multilevel-drop.drop-sub'
    });
    // вызов в сайдбаре н страницах с двухуровневым хедером уровень sub
    accordion({
        titleClick: '.offcanvas__proxy-for-geo-select-multilevel > span',
        allContent: '.offcanvas__proxy-for-geo-select-multilevel-drop.level1'
    });
    // аккордеон на странице ipv6 Поделиться страницей
    accordion({
        titleClick: '.share-page__link',
        allContent: '.share-page__social'
    });
    // аккордеон на странице  PA-current-orders.html
    accordion({
        titleClick: '.personal_account .change_authorization_method_proxy_setting',
        allContent: '.change_authorization_method_proxy_setting_container'
    });
    // аккордеон на странице  PA-current-orders.html в таблице .personal_account_ipv4_filter_wrap контент
    accordion({
        titleClick: '.personal_account_ipv4__sort_accordion',
        allContent: '.personal_account_ipv4_filter_wrap'
    });
    //открытие первого аккордеона
    $('.accordion').first().find('.accordion_title').trigger('click');
    // Ограничиваем количество симоволов в параграфе
    $.each($('.articles_item p'), function () {
        var self = $(this).text();
        var str = self.slice(0, 150); //например макс 100 символов
        var a = str.split(' ');
        a.splice(a.length - 1, 1);
        str = a.join(' ');
        if ($(this).text().length >= 130) {
            $(this).addClass('trim');
            $(this).html(str + ' ...');
        }
    });
    $.each($('.frequent-questions-and-articles__articles-title + p'), function () {
        var self = $(this).text();
        var str = self.slice(0, 130); //например макс 100 символов
        var a = str.split(' ');
        a.splice(a.length - 1, 1);
        str = a.join(' ');
        if ($(this).text().length >= 110) {
            $(this).addClass('trim');
            $(this).html(str + ' ...');
        }
    });
    // Создаём цикл для инициализации mCustomScrollbar в нужных select
    mCustomScrollbar();

    // Флаги в quick_order
    $(document).on('click','.quick_order_flag_items a', function(e) {
        e.preventDefault();
        // $(".quick_order_flag_items a").find("span").hide();
        // $(".quick_order_flag_items .quick_order_flag_item").removeClass("active");
        // $(this).find("span").show("fade");
        // $(this).parent().addClass("active");
        var dataVal = $(this).parent().data('value');

        $('.quick_order_flag_item').removeClass('animation');
        $('.quick_order_flag_item').removeClass('choice-is-made');
        $('.quick_order_flag_item').find('span').css('display', 'none');
        $(this).find('span').css('display', 'inline');
        $(this).parent().addClass('animation active');
        $(this).parent().addClass('choice-is-made');

        $(this).parents('.quick_order_flag_items').find('input').val(dataVal);
    });

    // для инициализации tooltips
	if($('.quick_order .type_proxy span, .quick_order .type_proxy i, .copy_the_link_input i, .personal_account_ipv4_table .tooltip, .proxy_list_items i, .copy_the_link a, .quick_order .quick_order_min_block_discounts, .messenger-for-communication__link-wrap i,.personal_account_ipv4 .personal_account_ipv4_filter_wrap .personal_account_ipv4_sort_out a, .header__level2-nav>ul>li.header__level2-li-drop.header__level2-li-accordion .header__level2-nav-drop>ul li .ext-link').length){
		$('.quick_order .type_proxy span, .quick_order .type_proxy i, .copy_the_link_input i, .personal_account_ipv4_table .tooltip, .proxy_list_items i, .copy_the_link a, .quick_order .quick_order_min_block_discounts, .messenger-for-communication__link-wrap i,.personal_account_ipv4 .personal_account_ipv4_filter_wrap .personal_account_ipv4_sort_out a, .header__level2-nav>ul>li.header__level2-li-drop.header__level2-li-accordion .header__level2-nav-drop>ul li .ext-link').tooltip({
			track: true,
			position: {
				my: 'left-10 bottom-20',
				collision: 'none',
				using: function using(position, feedback) {
					$(this).css(position);
					$(this).addClass('arrow_left').appendTo(this);
				}
			}
		});
	}
	if($('.default-table i').length){
		    $('.default-table i').tooltip({
        track: true,
        position: {
            my: 'right+10 bottom-20',
            collision: 'none',
            using: function using(position, feedback) {
                $(this).css(position);
                $(this).addClass('arrow_right').appendTo(this);
            }
        }
    });
	}



	if($('.tooltip-click').length){
		    $('.tooltip-click').tooltip({
				content: $('.tooltip-click').attr('title'),
				items: 'i'
			}).off('mouseover').on('click', function () {
				$(this).tooltip('open');
			}).attr('title', '').css({ cursor: 'pointer' });
	}


    mCustomScrollbarPartnersStatistic();
    // скролл по ссылке с атрибутом href
    // $(".header_nav a[href*='#']").on("click", function(e) {
    //     e.preventDefault();
    //     var anchor = $(this);
    //     $('html, body').stop().animate({
    //         scrollTop: $(anchor.attr('href')).offset().top
    //     }, 500);
    //     return false;
    // });

    // Скролл по классу .scroll_to и атрибуту data-scroll у кнопки к примеру (data-scroll="куда скроллим" в элементе куда скроллим ставим id потом впишем в куда скроллим)
    $('.scroll_to').on('click', function (e) {
        e.preventDefault();
        var anchor = $(this);

        if ($(this).hasClass('scroll_offset_header')) {
            $('html, body').stop().animate({
                scrollTop: $('#' + anchor.data('scroll')).offset().top - 40
            }, 500);
        } else {
            $('html, body').stop().animate({
                scrollTop: $('#' + anchor.data('scroll')).offset().top - 40
            }, 500);
        }

        return false;
    });
});
$(window).on('resize', throttle(function () {

    if ($('.partners_private_office_tab_left_links').length) {
        stickyUpdateFAQ();
    }
    // прилипающий футер на vh у sticking-footer
    stickingFooter();

    if (window.matchMedia('(min-width: 520px)').matches) {
        selectAndInputPadding();
    }
    if (window.matchMedia('(max-width: 520px)').matches) {
        selectAndInputPaddingMobile();
    }

    selectLimitLetters();
    // Скрываем datepicker при resize
	if($('.datepicker').length){
		    $('.datepicker').blur();
    		$('.datepicker').datepicker('hide');
	}


    if ($('.proxy_ipv6_items.proxy_ipv6_swiper0').hasClass('swiper_on_mobile')) {
        window.sliders.length === 0 && funSwiperProxyIpv6Items();

        if (window.matchMedia('(max-width: 1199px)').matches) {
            $('.proxy_ipv6_items.swiper_on_mobile .swiper-wrapper .proxy_ipv6_item').parent().addClass('swiper-slide');

            setTimeout(function () {
                window.slidersIsInit === undefined && window.sliders.forEach(function (item) {
                    item.init();
                    window.slidersIsInit = true;
                });
            }, 100);
        } else {
            $('.proxy_ipv6_items.swiper_on_mobile .swiper-wrapper .proxy_ipv6_item').parent().removeClass('swiper-slide');
            setTimeout(function () {
                window.slidersIsInit !== undefined && window.sliders.forEach(function (item) {
                    item.destroy();
                    window.slidersIsInit = undefined;
                    window.sliders = [];
                });
            }, 100);
        }
    }

    if ($('.residential-proxies-rates__items').length) {
        window.slidersResidentialProxiesRates.length === 0 && funSwiperResidentialProxiesRates();

        if (window.matchMedia('(max-width: 991px)').matches) {
            $('.residential-proxies-rates__items .swiper-wrapper .residential-proxies-rates__item').parent().addClass('swiper-slide');
            setTimeout(function () {
                window.slidersResidentialProxiesRatesIsInit === undefined && window.slidersResidentialProxiesRates.forEach(function (item) {
                    item.init();
                    window.slidersResidentialProxiesRatesIsInit = true;
                });
            }, 100);
        } else {
            $('.residential-proxies-rates__items .swiper-wrapper .residential-proxies-rates__item').parent().removeClass('swiper-slide');
            setTimeout(function () {
                window.slidersResidentialProxiesRatesIsInit !== undefined && window.slidersResidentialProxiesRates.forEach(function (item) {
                    item.destroy();
                    window.slidersResidentialProxiesRatesIsInit = undefined;
                    window.slidersResidentialProxiesRates = [];
                });
            }, 100);
        }
    }

    if (window.matchMedia('(max-width: 992px)').matches) {
        $('.header__personal-area-inner.after-authorization').off('mouseenter mouseleave');
        headerPersonalAreaDrop();
        footerDropdown();
    } else if (window.matchMedia('(min-width: 993px)').matches) {
        $('.header__personal-area-inner.after-authorization').off('mouseenter mouseleave');
        $('.header__personal-area-inner.after-authorization').on('mouseenter mouseleave');
        $('.header__personal-area-inner.after-authorization').off('click');
        headerPersonalAreaDrop();
    }
}, 150));

$(window).on('scroll', throttle(function () {
    if ($('.header__level2').hasClass('is-sticky')) {
        $('.header.ipv6_proxy').addClass('is-sticky');
    } else {
        $('.header.ipv6_proxy').removeClass('is-sticky');
    }

    if ($(window).scrollTop() < 10) {
        $('.header__level2').removeClass('is-sticky');
        $('.header.ipv6_proxy').removeClass('is-sticky');
    }
}, 10));

$(window).resize(function () {});

$(window).scroll(function () {});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// подключение animate.js


var Animation = function () {
	function Animation() {
		_classCallCheck(this, Animation);

		this.tl1 = new TimelineMax();
		this.tl2 = new TimelineMax();
		this.tl1.pause();
		this.tl2.pause();
	}

	_createClass(Animation, [{
		key: 'description',
		value: function description() {
			this.tl1.from('.footer-arrow-up', 0.4, {
				y: 20,
				autoAlpha: 0,
				ease: Power4.easeOut
			}, 0.1);
		}
	}, {
		key: 'play',
		value: function play() {
			if ($(window).scrollTop() >= 1000) {
				var $elem = $('.footer-arrow-up');
				if ($elem.is(":hidden") || $elem.css("visibility") == "hidden" || $elem.css("opacity") == 0) {
					//элемент скрыт
					this.tl1.restart();
					this.tl1.resume();
				} else {
					//элемент видимый

				}
			}
			if ($(window).scrollTop() <= 999) {
				this.tl1.reverse();
			}
		}
	}]);

	return Animation;
}();

/*var anim = new Animation();

$(window).scroll(function () {
	anim.play();
});

$(window).ready(function () {
	anim.description();
	anim.play();
});
'use strict';*/

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// подключение functions.js

$(function () {
	//SVG Fallback
	// if(!Modernizr.svg) {
	//  $("img[src*='svg']").attr("src", function() {
	//      return $(this).attr("src").replace(".svg", ".png");
	//  });
	// };
});
//изменяется - для плавной обратной анимации animate.css*/
$(window).scroll(function () {
	// для правильной рабоы надо прописать в блок которому присваивается анимация атрибут data-anim="fadeInLeft" с названием анимации
	$('.animated').each(function () {
		var imagePos = $(this).offset().top;
		var imageHght = $(this).outerHeight();
		var topOfWindow = $(window).scrollTop() + 40;
		var heightOfWindow = $(window).height();
		var animName = $(this).data('anim');
		if (!$(this).data('atop')) {
			var animTop = 0.9;
		} else {
			var animTop = $(this).data('atop');
		}
		if (imagePos < topOfWindow + heightOfWindow * animTop && imagePos + imageHght > topOfWindow) {
			$(this).css('visibility', 'visible').addClass(animName);
		} else if (imagePos + imageHght < topOfWindow || imagePos > topOfWindow + heightOfWindow) {
			$(this).css('visibility', 'hidden').removeClass(animName);
		}
	});
});

// Initialize Slidebars
(function ($) {
	// Initialize Slidebars
	var controller = new slidebars();
	controller.init();

	// Toggle Slidebars
	$('#nav-button-label').on('click', function (event) {
		// Stop default action and bubbling
		event.stopPropagation();
		event.preventDefault();
		// Toggle the Slidebar with id 'id-1'
		controller.toggle('id-1');
		$("html,body").toggleClass("slidebars");
		$(".off-canvas-wrap").toggleClass("active");
	});

	// Close Slidebar links
	$('[off-canvas] a:not(.offcanvas__personal-area-inner.after-authorization > a, .offcanvas__proxy-for-geo .select .slct, .offcanvas__proxy-for-geo-select .select .slct, .offcanvas__proxy-for-geo-select-multilevel-drop .no-click)').on('click', function (event) {
		event.preventDefault();
		event.stopPropagation();

		var url = $(this).attr('href'),
		    target = $(this).attr('target') ? $(this).attr('target') : '_self';

		$("#nav-button-label").removeClass("nav-on");
		$("#nav-button-label .nav-line").removeClass("active");
		$(".off-canvas-wrap").removeClass("active");
		$("html,body").removeClass("slidebars");
		controller.close(function () {
			window.open(url, target);
		});
	});

	// Add close class to canvas container when Slidebar is opened
	$(controller.events).on('opening', function (event) {
		$('[canvas]').addClass('js-close-any');
	});
	// Add close class to canvas container when Slidebar is opened
	$(controller.events).on('closing', function (event) {
		$('[canvas]').removeClass('js-close-any');
	});
	// Close any
    function closeSidebar(event){
        if (controller.getActiveSlidebar()) {
			event.preventDefault();
			event.stopPropagation();
			$("#nav-button-label").removeClass("nav-on");
			$("#nav-button-label .nav-line").removeClass("active");
			$(".off-canvas-wrap").removeClass("active");
			$("html,body").removeClass("slidebars");
			controller.close();
		}
    }
	$(document).on('click', '.js-close-any', function (event) {
		closeSidebar(event)
	});
    $( window ).resize(function(event) {
        closeSidebar(event)
    });
})($);

window.originalCopyTextLinkCount = true;
window.originalCopyTextLink;

function selectDropLiEach() {
	$('.select .drop li').each(function () {
		var attr = $(this).attr('data-selected');
		if ((typeof attr === 'undefined' ? 'undefined' : _typeof(attr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && attr !== false) {
			var dataVal = $(this).data('value');
			if ($(this).parents('.select').hasClass('purpose-of-use')) {
				setSelectValue($(this).parents('.select'), $(this).data('value'));
				$(this).parents('.inner_form_items').find('.bound-pair-select .drop li').each(function () {
					if ($(this).data('section') == dataVal) {
						$(this).addClass('active-data-section');
					}
				});
			} else if ($(this).parents('.select').hasClass('bound-pair-select')) {
				$(this).parents('.select').find('.slct').html($(this).html());
			} else {
				setSelectValue($(this).parents('.select'), $(this).data('value'));
			}
		}
	});
}

// Функция для инициализации модального окна по data-modal
function openModal(dataModal, dataInfo) {

	// var title =  $(this).data('title'); // для изменения title в модалке
	
	$(".popup[data-modal=" + dataModal + "] input[name=form_name]").val(dataInfo);
	// $(".popup[data-modal="+id+"] h2").html(title); // прописать в ссылку data-title="нужный title"
	modalInitialization();
	mCustomScrollbarModal();
	setTimeout(modalByLoginAndPassword(), 200);
	setTimeout(modalOnMainIp(), 200);
    
	setTimeout(function () {

		if (window.matchMedia("(min-width: 520px)").matches) {
			selectAndInputPadding();
		}
		if (window.matchMedia("(max-width: 520px)").matches) {
			selectAndInputPaddingMobile();
		}
	}, 200);
	if ($(".popup[data-modal=" + dataModal + "]").is(":visible")) {
		if (window.matchMedia("(min-width: 992px)").matches) {
			$("body").css({ "overflow": "hidden", "padding-right": "17px" });
		}
		if (window.matchMedia("(max-width: 992px)").matches) {

			$("body").css({ "overflow": "hidden", "padding-right": "0px" });
		}
	}
    $(".popup[data-modal=" + dataModal + "]").toggle("fade", 200).find("form").css('display', 'block');
}

$(document).ready(function () {
    /*var md = new MobileDetect(window.navigator.userAgent);

	if (md.userAgent() == "Safari" && md.mobile() == "iPhone" || md.mobile() == "iPad") {
        $("html,body").css("overflow", "hidden !important");
	}*/

    var widthSlide = null;
    setTimeout( function() {
        widthSlide = $('.proxy_ipv6 .swiper-slide').width();
        // console.log(1, $('.proxy_ipv6 .swiper-slide').width())
    }, 100)
    $(document).on('click', '.select .drop li', function () {
        widthSlide--;
        $('.proxy_ipv6 .swiper-slide').width(widthSlide);
        widthSlide++;
        $('.proxy_ipv6 .swiper-slide').width(widthSlide);
	});

	// Select в модальном окне
	$(document).click(function (e) {
        if (!$(".select").is(e.target) && !$(".dvs-show-modal-order").is(e.target)){
            $('.slct').removeClass('active');
            $('.slct_arrow').removeClass('active');
            $('.slct').parent().find('.drop').slideUp("fast");
        }
	});
	$('.slct_arrow').on('click', function (e) {
		e.stopPropagation();
		$(this).siblings('.slct').trigger('click');
	});

	selectDropLiEach();

	$(document).on('click', '.slct', function () {
		if (window.matchMedia("(min-width: 520px)").matches) {
			selectAndInputPadding();
		}
		if (window.matchMedia("(max-width: 520px)").matches) {
			selectAndInputPaddingMobile();
		}

		/* Заносим выпадающий список в переменную */
		var dropBlock = $(this).parent().find('.drop');
		var dropBlockIPv4IPv6 = $(this).parents('.header_select-item').siblings('.header_select-item.IPv4-IPv6').find('.drop');
		var dropBlockbBoundPairSelect = $(this).parents('.inner_form_items').find('.inner_form_item .select.purpose-of-use').find('.drop');
		var dropBlockCountrySelect = $(this).parents('.inner_form_items').find('.inner_form_item .select.country-select:not(".disabled")').find('.drop');
		var dropBlockSelectSocial = $(this).parents('.quick_order_tab').find('.inner_form_item .select.select-social').find('.drop');
		mCustomScrollbarModal();
		//  закрываем все открытые
		$('.slct').removeClass('active').parent().find('.drop').slideUp("fast");

		function selectedEvent(el, data) {
			el.dispatchEvent(new CustomEvent("select-selected", {
				bubbles: true,
				detail: data
			}));
		}

		function selectedDataWarning(that) {

			if (that.data('warning')) {
				that.parents('.select').find('.warning-block').html(that.data('warning')).show('fade');
			} else {
				that.parents('.select').find('.warning-block').html(' ').hide('fade');
			}
		}

		function needSelectCountry(bool) {
			if (bool) {
				$('.need-select-country').show('fast');
			} else {
				$('.need-select-country').hide('fast');
			}
		}

		if ($(this).parents('.header_select-item').hasClass('bound-pair-select') && $(this).parents('.header_select-item').siblings('.header_select-item').hasClass('IPv4-IPv6') && !$(this).parents('.header_select-item').siblings('.header_select-item').hasClass('choice-is-made')) {
			// console.log('bound-pair-select IPv4-IPv6');
			/* Делаем проверку: Если выпадающий блок скрыт то делаем его видимым*/
			if (dropBlockIPv4IPv6.is(':hidden')) {
				$(this).parent().find('li').removeClass('active');
				$(this).addClass('active');
				dropBlockIPv4IPv6.slideDown();
				dropBlockIPv4IPv6.siblings('.slct').addClass('active');
				dropBlockIPv4IPv6.siblings(".slct_arrow").addClass('active');

				/* Работаем с событием клика по элементам выпадающего списка */
				$('.drop').find('li').off("click").click(function () {
					/* Заносим в переменную HTML код элемента
     списка по которому кликнули */
					var that = $(this);
					var selectDataValue = $(this).data('value');
					var selectResult = $(this).html();
					$(this).parents('.header_select-item').addClass('choice-is-made');
					sortDataSection($(this).parents(".header_select").find('.bound-pair-select'), $(this).data('value').toString());

					/* Находим наш скрытый инпут и передаем в него
     значение из переменной selectResult */

					/* Передаем значение переменной selectResult в ссылку которая
     открывает наш выпадающий список и удаляем активность */
					$(this).parents(".select").find(".slct").removeClass('active').html(selectResult);
					$(".slct_arrow").removeClass('active');
					selectLimitLetters();
					selectedEvent(this, $(this).data('value'));

					function clickLiHelper(selectResult) {
						that.parents(".select").find('input').val(selectResult);
					}

					clickLiHelper(selectDataValue);

					/* Скрываем выпадающий блок */
					dropBlock.slideUp();
				});

				return false;

				/* Продолжаем проверку: Если выпадающий блок не скрыт то скрываем его */
			} else {

				dropBlockIPv4IPv6.siblings('.slct').removeClass('active');
				dropBlockIPv4IPv6.siblings(".slct_arrow").removeClass('active');
				$(this).removeClass('active');
				$(".slct_arrow").removeClass('active');
				dropBlock.slideUp();

				return false;
			}
		} else if ($(this).parents('.select').hasClass('bound-pair-select') && $(this).parents('.inner_form_item').siblings('.inner_form_item').find('.select').hasClass('purpose-of-use') && !$(this).parents('.inner_form_item').siblings('.inner_form_item').find('.select.purpose-of-use').parents('.inner_form_item').hasClass('choice-is-made')) {
			// console.log('bound-pair-select purpose-of-use');
			if (dropBlockbBoundPairSelect.is(':hidden')) {

				$(this).parent().find('li').removeClass('active');
				$(this).addClass('active');
				dropBlockbBoundPairSelect.slideDown();
				dropBlockbBoundPairSelect.siblings('.slct').addClass('active');
				dropBlockbBoundPairSelect.siblings(".slct_arrow").addClass('active');

				if (window.originalCopyTextLinkCount) {

					window.originalCopyTextLink = $(this).parents('.inner_form_items').find('.bound-pair-select .slct').html();
				}

				/* Работаем с событием клика по элементам выпадающего списка */
				$('.drop').find('li').off("click").click(function () {

					var that = $(this);
					var selectDataValue = $(this).data('value');
					var selectResult = $(this).html();
					$(this).parents('.inner_form_item').addClass('choice-is-made');

					window.originalCopyTextLinkCount = false;

					selectedEvent(this, $(this).data('value'));

					/* Передаем значение переменной selectResult в ссылку которая
     открывает наш выпадающий список и удаляем активность */
					$(this).parents(".select").find(".slct").removeClass('active').html(selectResult);
					$(".slct_arrow").removeClass('active');
					selectLimitLetters();

					sortDataSection($(this).parents(".inner_form_items").find('.bound-pair-select'), $(this).data('value').toString());

					function clickLiHelper(selectResult) {
						that.parents(".select").find('input').val(selectResult);
					}

					clickLiHelper(selectDataValue);

					/* Скрываем выпадающий блок */
					dropBlockbBoundPairSelect.slideUp();
					return false;
				});

				/* Продолжаем проверку: Если выпадающий блок не скрыт то скрываем его */
			} else {
				dropBlockbBoundPairSelect.siblings('.slct').removeClass('active');
				dropBlockbBoundPairSelect.siblings(".slct_arrow").removeClass('active');
				$(this).removeClass('active');
				$(".slct_arrow").removeClass('active');
				dropBlockbBoundPairSelect.slideUp();
				return false;
			}
		} else if ($(this).parents('.select').hasClass('bound-pair-select-country') && $(this).parents('.inner_form_item').siblings('.inner_form_item').find('.select.country-select:not(.disabled)') && !$(this).parents('.inner_form_item').siblings('.inner_form_item').find('.select.country-select:not(.disabled)').parents('.inner_form_item').hasClass('choice-is-made')) {
			// console.log('bound-pair-select country');

			if (dropBlockCountrySelect.is(':hidden')) {

				$(this).parent().find('li').removeClass('active');
				$(this).addClass('active');
				dropBlockCountrySelect.slideDown();
				dropBlockCountrySelect.siblings('.slct').addClass('active');
				dropBlockCountrySelect.siblings(".slct_arrow").addClass('active');

				if (window.originalCopyTextLinkCount) {

					window.originalCopyTextLink = $(this).parents('.inner_form_items').find('.bound-pair-select-country .slct').html();
				}

				/* Работаем с событием клика по элементам выпадающего списка */
				$('.drop').find('li').off("click").click(function () {

					var that = $(this);
					var selectDataValue = $(this).data('value');
					var selectResult = $(this).html();
					$(this).parents('.inner_form_item').addClass('choice-is-made');

					window.originalCopyTextLinkCount = false;

					selectedEvent(this, $(this).data('value'));

					/* Передаем значение переменной selectResult в ссылку которая
     открывает наш выпадающий список и удаляем активность */
					$(this).parents(".select").find(".slct").removeClass('active').html(selectResult);
					$(".slct_arrow").removeClass('active');
					selectLimitLetters();

					//sortDataSection($(this).parents(".inner_form_items").find('.bound-pair-select-country'), $(this).data('value').toString());

					function clickLiHelper(selectResult) {
						that.parents(".select").find('input').val(selectResult);
					}

					clickLiHelper(selectDataValue);
					/* Скрываем выпадающий блок */
					dropBlockCountrySelect.slideUp();
					return false;
				});

				/* Продолжаем проверку: Если выпадающий блок не скрыт то скрываем его */
			} else {
				dropBlockCountrySelect.siblings('.slct').removeClass('active');
				dropBlockCountrySelect.siblings(".slct_arrow").removeClass('active');
				$(this).removeClass('active');
				$(".slct_arrow").removeClass('active');
				dropBlockCountrySelect.slideUp();
				return false;
			}
		} else if ($(this).parents('.select').hasClass('bound-pair-select-social') && $(this).parents('.inner_form_item').siblings('.inner_form_item').find('.select.select-social') && !$(this).parents('.inner_form_item').siblings('.inner_form_item').find('.select.select-social').parents('.inner_form_item').hasClass('choice-is-made')) {
			// console.log('bound-pair-select social');
			if (!$(this).parents('.quick_order_tab').find('.quick_order_flag_item').hasClass('choice-is-made')) {
				needSelectCountry(true);
			} else {
				needSelectCountry(false);
				if (dropBlockSelectSocial.is(':hidden')) {
					$(this).parent().find('li').removeClass('active');
					$(this).addClass('active');
					dropBlockSelectSocial.slideDown();
					dropBlockSelectSocial.siblings('.slct').addClass('active');
					dropBlockSelectSocial.siblings(".slct_arrow").addClass('active');

					/* Работаем с событием клика по элементам выпадающего списка */
					$('.drop').find('li').off("click").click(function () {

						var that = $(this);
						var selectDataValue = $(this).data('value');
						var selectResult = $(this).html();
						$(this).parents('.inner_form_item').addClass('choice-is-made');

						window.originalCopyTextLinkCount = false;

						selectedEvent(this, $(this).data('value'));
						sortDataSection($(this).parents(".quick_order_tab").find('.bound-pair-select-social'), $(this).data('value').toString());
						/* Передаем значение переменной selectResult в ссылку которая
      открывает наш выпадающий список и удаляем активность */
						$(this).parents(".select").find(".slct").removeClass('active').html(selectResult);
						$(".slct_arrow").removeClass('active');
						selectLimitLetters();

						//sortDataSection($(this).parents(".inner_form_items").find('.bound-pair-select-country'), $(this).data('value').toString());

						function clickLiHelper(selectResult) {
							that.parents(".select").find('input').val(selectResult);
						}

						clickLiHelper(selectDataValue);

						/* Скрываем выпадающий блок */
						dropBlockSelectSocial.slideUp();
						return false;
					});

					/* Продолжаем проверку: Если выпадающий блок не скрыт то скрываем его */
				} else {
					dropBlockSelectSocial.siblings('.slct').removeClass('active');
					dropBlockSelectSocial.siblings(".slct_arrow").removeClass('active');
					$(this).removeClass('active');
					$(".slct_arrow").removeClass('active');
					dropBlockSelectSocial.slideUp();
					return false;
				}
			}
		} else if ($(this).parents('.select').hasClass('bound-pair-select-flag') && !$(this).parents('.quick_order_tab').find('.quick_order_flag_item').hasClass('choice-is-made')) {
			needSelectCountry(true);
		} else if ($(this).parents('.header_select-item').hasClass('IPv4-IPv6')) {

			if (dropBlock.is(':hidden')) {
				dropBlock.slideDown();

				/* Выделяем ссылку открывающую select */
				$(this).parent().find('li').removeClass('active');
				$(this).addClass('active');
				$(this).siblings(".slct_arrow").addClass('active');

				/* Работаем с событием клика по элементам выпадающего списка */
				$('.drop').find('li').off("click").click(function () {
					/* Заносим в переменную HTML код элемента
     списка по которому кликнули */
					var that = $(this);
					var selectDataValue = $(this).data('value');
					var selectResult = $(this).html();
					$(this).parents('.header_select-item').addClass('choice-is-made');
					$(this).parents('.header_select').find('.bound-pair-select:not(.header_select-months) .slct').html(BX.message('TEMPL_CHOOSE_COUNTRY')+':');
					$(this).parents('.header_select').find('.bound-pair-select.header_select-months .slct').html(BX.message('TEMPL_CHOOSE_PERIOD')+':');
					$(this).parent().find('item').val('');

					selectedEvent(this, $(this).data('value'));

					sortDataSection($(".bound-pair-select"), $(this).data('value').toString());

					/* Передаем значение переменной selectResult в ссылку которая
     открывает наш выпадающий список и удаляем активность */
					$(this).parents(".select").find(".slct").removeClass('active').html(selectResult);
					$(".slct_arrow").removeClass('active');
					selectLimitLetters();

                    that.parents(".select").find(".slct").addClass("active_link");

                   

					function clickLiHelper(selectResult) {
						that.parents(".select").find('input').val(selectResult);
					}

					clickLiHelper(selectDataValue);

					/* Скрываем выпадающий блок */
					dropBlock.slideUp();
				});

				/* Продолжаем проверку: Если выпадающий блок не скрыт то скрываем его */
			} else {
				$(this).siblings(".slct_arrow").removeClass('active');
			}
		} 
        else if ($(this).parents('.select').hasClass('purpose-of-use')) {
			// console.log('purpose-of-use');

			if (dropBlock.is(':hidden')) {
				dropBlock.slideDown();

				/* Выделяем ссылку открывающую select */
				$(this).parent().find('li').removeClass('active');
				$(this).addClass('active');
				$(this).siblings(".slct_arrow").addClass('active');

				if (window.originalCopyTextLinkCount) {

					window.originalCopyTextLink = $(this).parents('.inner_form_items').find('.bound-pair-select .slct').html();
				}

				/* Работаем с событием клика по элементам выпадающего списка */

				$('.drop').find('li').off("click").click(function () {

					var that = $(this);
					window.originalCopyTextLinkCount = false;
					var selectResult = $(this).html();
					var selectDataValue = $(this).data('value');
					selectedEvent(this, $(this).data('value'));
					$(this).parents('.inner_form_item').addClass('choice-is-made');

					$(this).parents('.inner_form_items').find('.bound-pair-select .slct').html(window.originalCopyTextLink);
					$(this).parent().find('item').val('');
					$(this).parents('.inner_form_items').find('.select.bound-pair-select').parents('.inner_form_item').addClass('choice-is-made');

					sortDataSection($(this).parents(".inner_form_items").find('.bound-pair-select'), $(this).data('value').toString());

					/* Передаем значение переменной selectResult в ссылку которая
     открывает наш выпадающий список и удаляем активность */
					$(this).parents(".select").find(".slct").removeClass('active').html(selectResult);
					$(".slct_arrow").removeClass('active');
					selectLimitLetters();

					function clickLiHelper(selectResult) {
						that.parents(".select").find('input').val(selectResult);
					}

					clickLiHelper(selectDataValue);

                    $(this).parents('.inner_form_item').next().find('.bound-pair-select input').val('');

                    /* Скрываем выпадающий блок */
					dropBlock.slideUp();
				});

				/* Продолжаем проверку: Если выпадающий блок не скрыт то скрываем его */
			} else {
				$(this).siblings(".slct_arrow").removeClass('active');
			}
		} else if ($(this).parents('.select').hasClass('select-social')) {
			// console.log('select-social');
			needSelectCountry(false);
			if (dropBlock.is(':hidden')) {
				dropBlock.slideDown();

				/* Выделяем ссылку открывающую select */
				$(this).parent().find('li').removeClass('active');
				$(this).addClass('active');
				$(this).siblings(".slct_arrow").addClass('active');

				if (window.originalCopyTextLinkCount) {

					window.originalCopyTextLink = $(this).parents('.quick_order_tab').find('.bound-pair-select .slct').html();
				}

				/* Работаем с событием клика по элементам выпадающего списка */
				$('.drop').find('li').off("click").click(function () {

					var that = $(this);
					window.originalCopyTextLinkCount = false;
					var selectResult = $(this).html();
					var selectDataValue = $(this).data('value');
					selectedEvent(this, $(this).data('value'));
					$(this).parents('.inner_form_item').addClass('choice-is-made');

					$(this).parents('.quick_order_tab').find('.bound-pair-select-social .slct').html(window.originalCopyTextLink);
					$(this).parent().find('item').val('');
					$(this).parents('.quick_order_tab').find('.select.bound-pair-select-social').parents('.inner_form_item').addClass('choice-is-made');

					sortDataSection($(this).parents(".quick_order_tab").find('.bound-pair-select-social'), $(this).data('value').toString());

					/* Передаем значение переменной selectResult в ссылку которая
     открывает наш выпадающий список и удаляем активность */
					$(this).parents(".select").find(".slct").removeClass('active').html(selectResult);
					$(".slct_arrow").removeClass('active');
					selectLimitLetters();

					function clickLiHelper(selectResult) {
						that.parents(".select").find('input').val(selectResult);
					}

					clickLiHelper(selectDataValue);

					/* Скрываем выпадающий блок */
					dropBlock.slideUp();
				});

				/* Продолжаем проверку: Если выпадающий блок не скрыт то скрываем его */
			} else {
				$(this).siblings(".slct_arrow").removeClass('active');
			}
		} 
        else {
			dropBlockIPv4IPv6.siblings('.slct').removeClass('active');
			dropBlockIPv4IPv6.siblings(".slct_arrow").removeClass('active');
			needSelectCountry(false);
			/* Делаем проверку: Если выпадающий блок скрыт то делаем его видимым*/
			if (dropBlock.is(':hidden')) {
				dropBlock.slideDown();

				/* Выделяем ссылку открывающую select */
				$(this).parent().find('li').removeClass('active');
				$(this).addClass('active');
				$(this).siblings(".slct_arrow").addClass('active');

				/* Работаем с событием клика по элементам выпадающего списка */
				$('.drop').find('li').off("click").click(function () {
					/* Заносим в переменную HTML код элемента
     списка по которому кликнули */
					var that = $(this);
					var selectResult = $(this).html();
					var selectDataValue = $(this).data('value');
					var selectData = $(this).data("service");
					var selectResult_XTZ = $(this).data('wallet_id'); // ДЛЯ ПАРТНЕРКИ НЕ УДАЛЯТЬ
					var selectIpv4target = $(this).data("ipv4-target");
					var selectIpv4service = $(this).data("ipv4-service");
					var selectIpv4term = $(this).data("ipv4-term");
					var selectIpv6term = $(this).data("ipv6-term");
					var tab1Serv = $(this).data("tab-1-service");
					var tab2Serv = $(this).data("tab-2-service");
					var selectDataTab2 = $(this).data('tab2');
					var anotherService = $(this).data('anotherservice');

					function clickLiHelper(selectResult) {
						that.parents(".select").find('input').val(selectResult);
					}

                    

					if ($(this).parents('.select').hasClass('country-select')) {
						$(this).parents('.inner_form_item').addClass('choice-is-made');
					}

					selectedEvent(this, $(this).data('value'));

					$(this).parent().find('li').removeClass('active');
					$(this).addClass('active');

					if ($(this).parent().parent().parent().hasClass('save_even_more_btn_tab_select')) {

						$(this).parents('.save_even_more_one').find('.tabs-wrap[data-tab2]').removeClass("active").hide(); //убираем активные состояния у табов
						$(this).parents('.save_even_more_one').find('.tabs-wrap[data-tab2=' + selectDataTab2 + ']').show("fade", 500).addClass('active');

						if ($('.proxy_ipv6_items.proxy_ipv6_swiper0.swiper_on_mobile').length) {
							setTimeout(function () {
								window.sliders[selectDataTab2].init();
								window.sliders[selectDataTab2].update();
							}, 100);
						} else if ($('.proxy_ipv6_items.proxy_ipv6_swiper0').length) {
							setTimeout(function () {
								window.sliders[selectDataTab2 - 1].init();
								window.sliders[selectDataTab2 - 1].update();
							}, 100);
						}
					}
                    if($(this).parents('.select').hasClass('period')){
                        clickLiHelper(selectDataValue);
                        const type = $(this).parents('.select').attr('data-type');
                        extendData = getExtendData("calc", type);
                        extendIPs(extendData, type);
                    }
					if ($(this).parents('.header_select-item').hasClass('bound-pair-select')) {

						clickLiHelper(selectDataValue);
					} else if ($(this).parents('.header_select-item').hasClass('header_select-months')) {

						clickLiHelper(selectDataValue);
					}
                     else {
						clickLiHelper(selectDataValue);
					}
					/* Находим наш скрытый инпут и передаем в него
     значение из переменной selectResult */

					$('#partner-wallets').val(selectResult_XTZ); // ДЛЯ ПАРТНЕРКИ НЕ УДАЛЯТЬ

					/* Передаем значение переменной selectResult в ссылку которая
     открывает наш выпадающий список и удаляем активность */
					$(this).parents(".select").find(".slct").removeClass('active').html(selectResult).attr("data-service", selectData).attr("data-ipv4-target", selectIpv4target).attr("data-ipv4-service", selectIpv4service).attr("data-ipv4-term", selectIpv4term).attr("data-ipv6-term", selectIpv6term).attr("data-tab-1-service", tab1Serv).attr("data-tab-2-service", tab2Serv);

					that.parents(".select").find(".slct").addClass("active_link");
					that.parents(".header_select-item").next().find('.slct').focus();
					that.parents(".select").next().find('.slct').focus();

					if (anotherService === 'another-service') {
						$(this).parents('.inner_form_item').addClass('error').find(".another-service-item").show("fade", 500).add(this).prev().hide();
						$(this).parents('.inner_form_item').find('input').focus();
					}

					selectedDataWarning(that);

					$(".slct_arrow").removeClass('active');
					selectLimitLetters();

					/* Скрываем выпадающий блок */
					dropBlock.slideUp();
                    
                
				});
				/* Продолжаем проверку: Если выпадающий блок не скрыт то скрываем его */
			} else {
				$(this).removeClass('active');
				$(".slct_arrow").removeClass('active');
				dropBlock.slideUp();

			}
		}

		/* Предотвращаем обычное поведение ссылки при клике */
		return false;
	});

	// Открываем модальное окно
	$(document).on("click", ".modal, .modal-not-conflict", function (e) {
		e.preventDefault();
		var id = $(this).data('modal');
		var txt = $(this).data('info');
		var comment = $(this).data('comment');
		var commentView = $(this).data('comment-view');

		if (comment) {
			$('.popup[data-modal="' + id + '"] textarea').html(comment);
		} else if (comment !== undefined) {
			$('.popup[data-modal="' + id + '"] textarea').html('');
		}

		if (commentView) {
			$('.popup[data-modal="' + id + '"] .view-comment').html(commentView);
		}
		// var title =  $(this).data('title'); // для изменения title в модалке
		$(".popup[data-modal=" + id + "]").toggle("fade", 200).find("form").css('display', 'block');
		$(".popup[data-modal=" + id + "] input[name=form_name]").val(txt);
		// $(".popup[data-modal="+id+"] h2").html(title); // прописать в ссылку data-title="нужный title"

		mCustomScrollbarModal();
		setTimeout(modalByLoginAndPassword(), 200);
		setTimeout(modalOnMainIp(), 200);

		setTimeout(function () {

			if (window.matchMedia("(min-width: 520px)").matches) {
				selectAndInputPadding();
			}
			if (window.matchMedia("(max-width: 520px)").matches) {
				selectAndInputPaddingMobile();
			}
		}, 200);

		if (window.matchMedia("(min-width: 992px)").matches) {
			$("body").css({ "overflow": "hidden", "padding-right": "17px" });
		}
		if (window.matchMedia("(max-width: 992px)").matches) {

			$("body").css({ "overflow": "hidden", "padding-right": "0px" });
		}

		if ($(this).hasClass('timer')) {
			// Вызов таймера в таблице
			setTimeout(tableTimer, 1000);
		}
	});
	// overlay для закрытия
	$(".overlay").click(function (e) {
		if (e.target.classList.contains('overlay')) {
			$(this).parents(".popup").hide("fade", 200);
			$("body").removeAttr('style');

			if ($(this).parents('.popup').hasClass('popup-payment')) {
				// обнуляем таймер в модальном окне с таймером + обнуляем значения и выставляем на первую минуту
				clearTimeout(tid);
				$('#minute').text('01');
				$('#sec').text('00');
				$('#micro').text('00');
			}
		}
	});
	// закрываем модальное окно на крестик
	$(".popup .close").click(function (e) {
		e.preventDefault();
		$(this).parents(".popup").hide("drop", { direction: "up" }, 200);
		$("body").removeAttr('style'); 
		if ($(this).parents('.popup').hasClass('popup-payment')) {
			// обнуляем таймер в модальном окне с таймером + обнуляем значения и выставляем на первую минуту
			clearTimeout(tid);
			$('#minute').text('01');
			$('#sec').text('00');
			$('#micro').text('00');
		}
		if ($(this).parents('.popup').data('modal') == 'modal-order') {
			$('.popup.pop_order_form .inner_form-block-insert-template .inner_form_items-wrap.tpl').not(':first').each(function () {
				$(this).remove();
			});
		}
	});
	//обработчик кнопки на нажатие btn_mnu
	$("#nav-button-label").click(function (e) {
		e.preventDefault();
		$(this).toggleClass('nav-on'); // добавляет класс для анимации самой кнопки
		$(this).next().slideToggle(); // открывает меню main_nav_block, которое было скрыто
		$(this).find('.nav-line').toggleClass('active');
		$(".mnu_dropdown").toggleClass("active");
	});
	// Скрыть элемент при клике за его пределами бутерброд и его выпадающее меню
	$(document).click(function (event) {
		if ($(event.target).closest("#nav-button-label").length) return;
		if ($(event.target).closest("[off-canvas]").length) return;
		$("#nav-button-label").removeClass("nav-on");
		$("#nav-button-label .nav-line").removeClass("active");

		event.stopPropagation();
	});
    $(document).on('click', '.IPv4-IPv6 .drop li', function() {
        setTimeout(function () {
            $('.header_select input[name="quantity"]').val('')
        }, 400)
    })
	//  Отправка форм
	$("form:not('#form3')").submit(function () {
		// перехватываем все при событии отправки
		var form = $(this); // запишем форму, чтобы потом не было проблем с this
		var error = [];
		form.find('.modal_form_input').each(function () {
			// пробежим по каждому полю в форме

			if ( $(this).val().trim() == '' ) {
				// если находим пустое
				$(this).siblings(".modal_input_error").show("fade", 500);
				$(this).siblings("i").hide("fade", 500);
				error.push(true); // ошибка
			} else if ($(this).val() !== '') {
				// если находим не пустое
				$(this).siblings(".modal_input_error").hide("fade", 500);
				$(this).siblings("i").show("fade", 500);
				error.push(false); // нет ошибки
			}
			$(this).focus(function () {
				$(this).siblings('.modal_input_error').hide("fade", 500);
			});
		});
		form.find('.modal_form_phone').each(function () {
			// пробежим по каждому полю в форме
			var pattern = /^(\+|d+)*\d[\d\(\)\-]{4,14}\d$/;
			if ($(this).val() == '') {
				// если пустое
				$(this).siblings(".modal_input_error").show("fade", 500);
				$(this).siblings("i").hide("fade", 500);
				error.push(true); // ошибка
				if ($(this).siblings().hasClass('input_error_phone')) {
					$(this).siblings(".modal_input_error").removeClass('input_error_phone').text("").prepend("Заполните поле<div class='modal_error_triangle'></div><div class='modal_error_chest_img'></div>");
				}
			} else if ($(this).val() !== '') {
				if ($(this).val().match(pattern)) {
					$(this).siblings(".modal_input_error").hide("fade", 500);
					$(this).siblings("i").show("fade", 500);
					error.push(false); // нет ошибок
				} else {
					$(this).siblings().show("fade", 500).addClass('input_error_phone').text("").prepend("Введите правильный телефон<div class='modal_error_triangle'></div><div class='modal_error_chest_img'></div>");
					$(this).siblings("i").hide("fade", 500);
					error.push(true); // ошибка
				}
			}
			$(this).focus(function () {
				$(this).siblings('.modal_input_error').hide("fade", 500);
			});
		});

		form.find('.modal_form_email').each(function () {
			// пробежим по каждому полю в форме
			var pattern = /(([a-zA-Z0-9]|[!#$%\*\/\?\|^\{\}`~&'\+=-_])+\.)*([a-zA-Z0-9\-]|[!#$%\*\/\?\|^\{\}`~&'\+=-_])+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+$/;
			if ($(this).val() == '') {
				// если пустое
                toastifyStatus(`<?=GetMessage("CAT_FILL_FIELD") ?>`, true);
				$(this).siblings(".modal_input_error").show("fade", 500);
				$(this).siblings("i").hide("fade", 500);
				error.push(true); // ошибка
				if ($(this).siblings().hasClass('input_error_email')) {
				    //Заполните поле
					$(this).siblings(".modal_input_error").removeClass('input_error_email').text("").prepend( BX.message('MAIN_JS_FILL_FIELD') + "<div class='modal_error_triangle'></div><div class='modal_error_chest_img'></div>");
				}
			} else if ($(this).val() !== '') {
				if ($(this).val().match(pattern)) {
					$(this).siblings(".modal_input_error").hide("fade", 500).removeClass('input_error_email');
					$(this).siblings("i").show("fade", 500);
					error.push(false); // нет ошибок
				} else {
				    // Введите правильный Email
					$(this).siblings(".modal_input_error").show("fade", 500).addClass('input_error_email').text("").prepend(BX.message('MAIN_JS_ENTER_CORRECT') + " Email<div class='modal_error_triangle'></div><div class='modal_error_chest_img'></div>");
					$(this).siblings("i").hide("fade", 500);
					error.push(true); // ошибка
				}
			}
			$(this).focus(function () {
				$(this).siblings('.modal_input_error').hide("fade", 500);
			});
		});

		form.find('.modal_form_email_auth').each(function () {

			$(this).focus(function () {
				// $('.form-group-error-block').hide("fade", 500);
				$(this).parent().siblings('.form-group-error-block').hide("fade", 500);
			});
		});

		form.find('.modal_form_promo').each(function () {
		    let promo_ma = $(this);
			// пробежим по каждому полю в форме
            if ($(this).val().trim() !== '') {
				if ( !promo_ma.is(":visible") ) {
					$(this).siblings(".modal_input_error").hide("fade", 500);
					// $(this).siblings("i").show("fade", 500);
					error.push(false); // нет ошибок
				} else if ( promo_ma.is(":visible") && !String(  promo_ma.val().trim() ).match( /^[-_a-zA-Z0-9]{2,20}$/ ) ) {
				    // Введите правильный Promo
					$(this).siblings(".modal_input_error").show("fade", 500);
					// $(this).siblings("i").hide("fade", 500);
					error.push(true); // ошибка
				}
			}
			$(this).focus(function () {
				$(this).siblings('.modal_input_error').hide("fade", 500);
			});
		});

		var erorr_finish = 0;
		for (var i = 0; i < error.length; i++) {
			if (error[i] == false) {
				erorr_finish = erorr_finish + 1;
			}
			;
			// console.log(error[i]);
		}
		//console.log(erorr_finish);
		var size = error.length - 1;
		if (erorr_finish > size) {
			// в зависимости от полей которые проверяются (в нашем случае 3 поля)
			var data = form.serialize(); // подготавливаем данные
			// $.ajax({ // инициализируем ajax запрос
			// 	type: 'POST', // отправляем в POST формате, можно GET
			// 	url: 'mail.php', // путь до обработчика, у нас он лежит в той же папке
			// 	dataType: 'json', // ответ ждем в json формате
			// 	data: data, // данные для отправки
			// 	beforeSend: function (data) { // событие до отправки
			// 		form.find('input[type="submit"]').attr('disabled', 'disabled'); // например, отключим кнопку, чтобы не жали по 100 раз
			// 	},
			// 	success: function (data) { // событие после удачного обращения к серверу и получения ответа
			// 		if (data['error']) { // если обработчик вернул ошибку
			// 			alert(data['error']); // покажем её текст
			// 		} else { // если все прошло ок
			//
			// 			if (data['form_type'] == 'modal') {
			// 				$('.dm-modal form').hide();
			// 				$('.dm-modal .close').hide();
			// 				form.trigger('reset');
			// 				$('.dm-modal .success_mail').addClass('active'); //пишем что всё ок
			// 				setTimeout(function () {
			// 					form.parents('.popup').hide("fade", 500);
			// 					$('.dm-modal .success_mail').removeClass('active');
			// 					$('.dm-modal .modal_form_input_wrap i').hide();
			// 					$('.dm-modal .close').show("fade", 2000);
			// 					//$("body").css({ "overflow": "inherit", "padding-right": "0" });
			// 				}, 3000);
			// 			}
			// 			if (data['form_type'] == 'normal') { //надо писать в обычных формах <input type="hidden" name="form_type" value="normal">
			// 				form.trigger('reset');
			// 				$('.dm-modal .success_mail').addClass('active');
			// 				$('.popup[data-modal=modal-res]').toggle("fade", 500);
			// 				//$("body").css({ "overflow": "hidden", "padding-right": "17px" });
			// 				setTimeout(function () {
			// 					$('.popup[data-modal=modal-res]').hide("fade", 500);
			// 					$('.dm-modal .success_mail').removeClass('active', 500);
			// 					$('.dm-modal .modal_form_input_wrap i').hide();
			// 					//$("body").css({ "overflow": "inherit", "padding-right": "0" });
			// 				}, 3000);
			// 			}
			// 		}
			// 	},
			// 	error: function (xhr, ajaxOptions, thrownError) { // в случае неудачного завершения запроса к серверу
			// 		alert(xhr.status); // покажем ответ сервера
			// 		alert(thrownError); // и текст ошибки
			// 	},
			// 	complete: function (data) { // событие после любого исхода
			// 		form.find('input[type="submit"]').prop('disabled', false); // в любом случае включим кнопку обратно
			// 	}
			//
			// });
		}
		//return false; // вырубаем стандартную отправку формы
	});

	//  Отправка форм с файлом вносим input[type=file]
	var files;
	$('input[type=file]').change(function () {
		files = this.files;
		//alert(files);
	});

	//  Отправка форм с файлом submit
	$("#form3").on('submit', function (e) {
		// перехватываем все при событии отправки
		e.preventDefault();
		var $data = new FormData(),
		    form = $(this),
		    error = [],
		    $inputs = $("#form3").find('input[type=hidden]'),
		    $phone = $("#form3").find('input[name=phone]'),
		    $email = $("#form3").find('input[name=email]'),
		    $name = $("#form3").find('input[name=name]'),
		    $textarea = $("#form3").find('textarea');

		$.each(files, function (key, value) {
			if (!this.name.match(/(.txt)|(.pdf)|(.docx)|(.doc)|(.xlsx)$/i)) {
				alert("Неправильный формат тектового файла.");
				return false;
				error.push(true);
			} else if ((this.size / 1024).toFixed(0) > 1524) {
				alert("Слишком большой размер.");
				return false;
				error.push(true);
			}
			$data.append(key, value);
		});

		$.each($inputs, function (key, value) {
			$data.append($(this).attr('name'), $(this).val());
		});

		//добавление основных тестовых полей вместо serialize
		$data.append($textarea.attr('name'), $textarea.val());
		$data.append($phone.attr('name'), $phone.val());
		$data.append($email.attr('name'), $email.val());
		$data.append($name.attr('name'), $name.val());

		form.find('.modal_form_input').each(function () {
			// пробежим по каждому полю в форме

			if ($(this).val() == '') {
				// если находим пустое
				$(this).siblings().show("fade", 500);
				error.push(true); // ошибка
			} else if ($(this).val() !== '') {
				// если находим не пустое
				$(this).siblings().hide("fade", 500);
				error.push(false); // нет ошибки
			}
			$(this).focus(function () {
				$(this).siblings().hide("fade", 500);
			});
		});
		form.find('.modal_form_phone').each(function () {
			// пробежим по каждому полю в форме
			var pattern = /^(\+|d+)*\d[\d\(\)\-]{4,14}\d$/;
			if ($(this).val() == '') {
				// если пустое
				$(this).siblings().show("fade", 500);
				error.push(true); // ошибка
				if ($(this).siblings().hasClass('input_error_phone')) {
					$(this).siblings().removeClass('input_error_phone').text("").prepend("Заполните поле<div class='modal_error_triangle'></div><div class='modal_error_chest_img'></div>");
				}
			} else if ($(this).val() !== '') {
				if ($(this).val().match(pattern)) {
					$(this).siblings().hide("fade", 500);
					error.push(false); // нет ошибок
				} else {
					$(this).siblings().show("fade", 500).addClass('input_error_phone').text("").prepend("Введите правильный телефон<div class='modal_error_triangle'></div><div class='modal_error_chest_img'></div>");
					error.push(true); // ошибка
				}
			}
			$(this).focus(function () {
				$(this).siblings().hide("fade", 500);
			});
		});
		form.find('.modal_form_email').each(function () {
			// пробежим по каждому полю в форме
			var pattern = /^(([a-zA-Z0-9]|[!#$%\*\/\?\|^\{\}`~&'\+=-_])+\.)*([a-zA-Z0-9]|[!#$%\*\/\?\|^\{\}`~&'\+=-_])+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+$/;
			if ($(this).val() == '') {
				// если пустое
				$(this).siblings().show("fade", 500);
				error.push(true); // ошибка
				if ($(this).siblings().hasClass('input_error_email')) {
					$(this).siblings().removeClass('input_error_email').text("").prepend("Заполните поле<div class='modal_error_triangle'></div><div class='modal_error_chest_img'></div>");
				}
			} else if ($(this).val() !== '') {
				if ($(this).val().match(pattern)) {
					$(this).siblings().hide("fade", 500).removeClass('input_error_email');
					error.push(false); // нет ошибок
				} else {
					$(this).siblings().show("fade", 500).addClass('input_error_email').text("").prepend("Введите правильный Email<div class='modal_error_triangle'></div><div class='modal_error_chest_img'></div>");
					error.push(true); // ошибка
				}
			}
			$(this).focus(function () {
				$(this).siblings().hide("fade", 500);
			});
		});

		if (files === undefined) {
			$('.fileLoad input').val('Файл не выбран!');
			$('.file-load-block input[type=text]').css('border', '1px solid red');
			error.push(true); // ошибка
		}

		var erorr_finish = 0;

		for (var i = 0; i < error.length; i++) {
			if (error[i] == false) {
				erorr_finish = erorr_finish + 1;
			}
			//console.log(error[i]);
		}
		//console.log(erorr_finish);
		var size = error.length - 1;
		if (erorr_finish > size) {
			// $.ajax({
			// 	url: 'mail.php',
			// 	type: 'POST',
			// 	contentType: false,
			// 	processData: false,
			// 	dataType: 'json',
			// 	data: $data,
			// 	beforeSend: function (loading) {
			// 		$('.fileLoad input').val('Файл загружается');
			// 	},
			// 	success: function (data) {
			// 		$('.dm-modal .success_mail').addClass('active');
			// 		$('.popup2 .close').hide();
			// 		$('.fileLoad input').val('Файл загружен!');
			// 		$('.file-load-block input[type=text]').css('color', '#b2d04e');
			// 		$('.popup[data-modal=modal-res]').show().delay(2000).fadeOut(
			// 			function () {
			// 				$('.popup[data-modal=modal-res]').hide("fade", 500);
			// 				form.trigger('reset');
			// 				$('.dm-modal .sucess_mail').addClass('active');
			// 				$("#win2 .close").trigger('click');
			// 				$('.popup2 .close').show();
			// 				$('.fileLoad input').val('Выберите файл');
			// 				files = undefined;
			// 				$('.file-load-block input[type=text]').css('color', '#fff)');
			// 				$('.file-load-block input[type=text]').css('border', '1px solid #fff');
			// 			}
			// 		);
			// 	}
			// });
		}
	});
});

$(".loader_inner").fadeOut(200);
$(".loader").fadeOut(200);

function parseHtmlEnteties(str) {
    return str.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {
        var num = parseInt(numStr, 10); // read num as normal number
        return String.fromCharCode(num);
    });
}

function checkIP(auth_ip){
    let formData = new FormData();
    formData.append('sessid', BX.message('bitrix_sessid'));
    formData.append('auth_ip', auth_ip);

    $.ajax({
        type: "POST",
        url: '/bitrix/services/main/ajax.php?' + $.param({c: 'diva:catalog', action: 'checkip', mode: 'ajax'}, true),
        data: formData, contentType: false, processData: false, cache: false,
        success: function (data) {
            try {
                return (data['data'] === true) ? true : false;
            } catch (e) {
                return  false;
            }
        }
    });
}

const tabsCabinet = (tabsHeadParentSelector, tabsHeadsSelector, tabsContentSelector, activeClass) => {
    var tabsHeadParent = document.querySelector(tabsHeadParentSelector),
        tabsHeads = tabsHeadParent.querySelectorAll(tabsHeadsSelector),
        tabsContent = document.querySelectorAll(tabsContentSelector);

    function hideTabContent() {
        tabsHeads.forEach((item, i) => {
            item.classList.remove(activeClass.substring(1));
        });
        tabsContent.forEach(item => {
            item.classList.remove("show");
        });
    }

    function showTabContent(i = 0) {
        tabsHeads[i].classList.add(activeClass.substring(1));
        tabsContent[i].classList.add("show");
    }
    hideTabContent();
    showTabContent();

    tabsHeadParent.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains(tabsHeadsSelector.substring(1))) {
            tabsHeads.forEach((item, i) => {
                if (e.target === item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
};

window.addEventListener('DOMContentLoaded', () => {
	if(document.querySelector('.profile__content-item')){
		tabsCabinet(".cabinet__content-tabs", ".cabinet__content-tab", ".profile__content-item", ".cabinet__content-tab--active");
	}
	if(document.querySelector('.current-orders__content-item')){
		tabsCabinet(".cabinet__content-tabs", ".cabinet__content-tab", ".current-orders__content-item", ".cabinet__content-tab--active");
	}



});