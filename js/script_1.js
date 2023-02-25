class DivasoftMiniBasket {
    constructor(type) {
        this.type = type;
        this._basket = new Map();
        this.load();
    }

    set currency(currency) {
        this._currency = currency;
    }

    get currency() {
        return this._currency;
    }

    get type() {
        return this._type;
    }

    set type(type) {
        if (!isNaN(type)) {
            type = arSectionTypes[type];
        }
        if (type === undefined) {
            type = 'ipv4';
        }
        this._type = type;
    }

    set payment(payment) {
        this._payment = payment;
        localStorage.setItem('payment', this._payment);
    }

    get payment() {
        return this._payment;
    }

    set email(email) {
        this._email = email;
        localStorage.setItem('email', this._email);
    }

    get email() {
        return this._email;
    }

    set minprice(minprice) {
        this._minprice = minprice;
        localStorage.setItem('minprice', this._minprice);
    }

    get minprice() {
        return this._minprice;
    }

    set coupon(coupon) {
        this._coupon = coupon;
        localStorage.setItem('coupon', this._coupon);
    }

    get coupon() {
        return this._coupon;
    }

    set period(period) {
        this._period = period;
        localStorage.setItem('period', this._period);
    }

    get period() {
        return this._period; 
    }

    set auth_value(auth_value) {
        this._auth_value = auth_value;
        localStorage.setItem('auth_value', this._auth_value);
    }

    get auth_value() {
        return this._auth_value;
    }

    set auth_type(auth_type) {
        this._auth_type = auth_type;
        localStorage.setItem('auth_type', this._auth_type);
    }

    get auth_type() {
        return this._auth_type;
    }

    set login_pwd_checkbox_state(login_pwd_checkbox_state) {
        this._login_pwd_checkbox_state = login_pwd_checkbox_state;
        localStorage.setItem('login_pwd_checkbox_state', this._login_pwd_checkbox_state);
    }

    get login_pwd_checkbox_state() {
        return this._login_pwd_checkbox_state;
    }

    load() {
        let tBasket = localStorage.getItem('basket_' + this.type);

        if (tBasket) {
            this._basket = JSON.parse(tBasket).reduce((m, [key, val]) => m.set(key, val), new Map());
        }

        this._email = localStorage.getItem('email') || "";
        this._coupon = localStorage.getItem('coupon') || "";
        this._auth_value = localStorage.getItem('auth_value') || "";
        this._payment = localStorage.getItem('payment') || "";
        this._period = localStorage.getItem('period') || "";
        this._login_pwd_checkbox_state = localStorage.getItem('login_pwd_checkbox_state') || "";
        this._minprice = localStorage.getItem('minprice') || "";
    }

    save() {
        localStorage.setItem('basket_' + this.type, JSON.stringify([...this._basket.entries()]));
    }

    get basket() {
        return this._basket;
    }

    get minimalOrderQuantity() {
        try {
            return (arSectionsMinQuantity[this.type] ? Number.parseInt(arSectionsMinQuantity[this.type]) : 1);
        } catch (e) {
            return 1;
        }
    }

    clearQuantity(quantity) {
        try {
            return quantity.replace(/[^0-9]/g, '');
        } catch (e) {
            return quantity;
        }
    }

    build(section, element, quantity, period, target, targetSection, notes, operator, rotation, auth_type) {
        // Очищаем количество
        quantity = this.clearQuantity(quantity);

        if (!quantity || quantity < this.minimalOrderQuantity)
            quantity = this.minimalOrderQuantity;

        target = (target ? target : "");
        let key = this.buildKey(element, period, target);
        let value = {s: section,
            id: element,
            p: period,
            q: quantity,
            //min: this.minimalOrderQuantity,
            t: target,
            ts: targetSection,
            k: key,
            nt: notes,
            operator: operator,
            rotation: rotation,
            at: auth_type,
            currency: this._currency
        };
        return {key: key, value: value};
    }

    buildKey(element, period, target) {
        target = (target) ? target : "";
        return element + "_" + period + "_" + target;
    }

    // Добавляем элемент в корзину
    add(section, element, quantity, period, target, targetSection, notes, operator, rotation, auth_type) {
        if (!section || !element || !quantity || !period) {
            return false;
        }
        this._auth_type =  localStorage.getItem('auth_type') || auth_type;
        let cntBefore = this._basket.size;
        let curBasketItem = this.build(section, element, quantity, period, target, targetSection, notes, operator, rotation, auth_type);

        let needUpd = false;

        if (this._basket.has(curBasketItem.key)) {
            if (this._basket.get(curBasketItem.key).q !== curBasketItem.q) {
                needUpd = true;
            }
        } else {
            this.del('zero');
        }
        this._basket.set(curBasketItem.key, curBasketItem.value);

        if (cntBefore !== this._basket.size) {
            needUpd = true;
        }

        this.save();
        return {needUpd: needUpd, curBasketItem: curBasketItem};
    }

    // Добавляем заготовку
    addzero() {
        this._basket.set('zero', {id: 0, k: 'zero'});
        return true;
    }

    // Удаляем элемент из корзины
    del(element_period) {
        if (this._basket.has(element_period)) {
            this._basket.delete(element_period);
            this.save();
            return true;
        }
        return false;
    }

    // Очищаем корзину
    clear() {
        this._basket.clear();
        this.save();
    }

    // Собираем данные с формы для конкретного элемента
    collect(obj, all) {
        let parent, parentAuth;

        if (all)
        {
            parent = $(obj).find('.dvs_inner_form_items');
            parentAuth = $(obj).find('.authorization_method');
        } else
        {
            parent = $(obj).closest('.dvs_inner_form_items');
            parentAuth = $(obj).closest('.authorization_method');
        }

        let element = $(parent).find('input[name="element"]').val();
        let targetSection = $(parent).find('input[name="targetSection"]').val();
        let target = $(parent).find('input[name="target"]').val();
        let period = $(parent).find('input[name="period"]').val();
        let quantity = $(parent).find('input[name="quantity"]').val();
        let notes = $(parent).find('input[name="notes"]').val();
        let operator, rotation;
        let auth_type = ($(parentAuth).find('.authorization_method_btn input[name=auth_type_login]').prop('checked')) ? "login" : "ip";
        if ($(parent).find('input[name="operator"]').length > 0) {
            operator = $(parent).find('input[name="operator"]').val();
            // Проверяем оператора
            if (!arRotationTimesByCountryAndOperator[element][operator]) {
                operator = Object.keys(arRotationTimesByCountryAndOperator[element])[0];
            }
        }
        // TODO: Рефакторинг
        if ($(parent).find('input[name="rotation"]').length > 0) {
            rotation = $(parent).find('input[name="rotation"]').val();

            // Проверяем такой же период ротации у другого оператора
            let found = false;
            for (var index in arRotationTimesByCountryAndOperator[element][operator]) {
                if (arRotationTimesByCountryAndOperator[element][operator][index]['TIME'] == rotation) {
                    found = true;
                }
            }
            // Выбираем 1й доступный, если нет совпадений
            if (!found) {
                rotation = arRotationTimesByCountryAndOperator[element][operator][0]['TIME'];
            }
        }

        if (rotation === undefined && element && operator) {
            rotation = arRotationTimesByCountryAndOperator[element][operator][0]['TIME'];
        }

        if ($(parent).find('input[name="rotation_by_time"]').length > 0 && element && operator) {
            if ($(parent).find('input[name="rotation_by_time"]').is(':checked')) {
                // TODO: Проверки
                rotation = arRotationTimesByCountryAndOperator[element][operator][0]['TIME'];
            } else {
                // Установим rotation_code в 0
                if ($(parent).find('input[name="rotation_by_link"]').length > 0) {
                    rotation = ($(parent).find('input[name="rotation_by_link"]').is(':checked')) ? 0 : rotation;
                }
            }
        } else {
            // Установим rotation_code в 0
            if ($(parent).find('input[name="rotation_by_link"]').length > 0) {
                rotation = ($(parent).find('input[name="rotation_by_link"]').is(':checked')) ? 0 : rotation;
            }
        }

        let item = this.build(arSectionMap[element], element, quantity, period, target, targetSection, notes, operator, rotation, auth_type);
        item.key = parent.data('key');

        // TODO: Поле одно, но если будет много, надо переделать
        if (target == "0") {
            item.value.tn = $(parent).find('input[name="modal_another-service"]').val();
        }

        if (target in arClaririfation) {
            item.value.tn = $(parent).find('input[name="modal_another-target"]').val();
        }

        return item;
    }

    // Синхронизируем элемент корзины
    sync(item, calc) {
        let _this = this;
        if (this._basket.has(item.key)) {
            let tBasket = new Map();
            this._basket.forEach(function (value, key) {
                if (key == item.key) {
                    let keyUpd = _this.buildKey(item.value.id, item.value.p, item.value.t);
                    // Добавляем количество в один элемент
                    if (keyUpd != key && value.q && item.value.q) {
                        try {
                            // item.value.q = parseInt(item.value.q) + parseInt(value.q);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    tBasket.set(keyUpd, item.value);
                } else {
                    tBasket.set(key, value);
                }
            });

            this._basket = tBasket;
            if (calc) {
                _this.calc();
            }
            return true;
        }
        return false;
    }

    preFormData(order) {
        let formData = new FormData();
        formData.append('sessid', BX.message('bitrix_sessid'));
        formData.append('email', this.email.trim());
        formData.append('coupon', this.coupon);
        formData.append('paymentId', this.payment);
        formData.append('siteDir', location.pathname);
        formData.append('auth_value', this.auth_value);
        formData.append('type', this.type);
        if (order === "Y") {
            if (!this.check()) {
                // alert(BX.message('CAT_FILL_ALL_FIELDS'));
                dvs_is_send = false;
                return false;
            }
            let rez_check_so = this.check_form_so();
            if (!rez_check_so.status) {
                // alert(rez_check_so.message);

                dvs_is_send = false;
                return false;
            }
            if ($('input[name=protocol_value]:checked').length > 0) {
                formData.append('protocol_value', $('input[name=protocol_value]:checked').val());
            }

            if ($('input[name=auth_type_ip]').prop('checked'))
                formData.append('auth_type_ip', "IP");
            else
                formData.append('auth_type_ip', "LOGIN");

            formData.append('order', 'Y');
        } else {
            formData.append('order', 'N');
        }
        return formData;
    }

    checkIP(auth_ip) {
        let formData = new FormData();
        formData.append('sessid', BX.message('bitrix_sessid'));
        formData.append('auth_ip', auth_ip);
        $.ajax({
            type: "POST",
            url: '/bitrix/services/main/ajax.php?' + $.param({c: 'diva:catalog', action: 'checkip', mode: 'ajax'}, true),
            data: formData, contentType: false, processData: false, cache: false,
            success: function (data) {
                let parentAuthValue = $('.authorization_method_inner_check_ip_input');
                try {
                    if (data['data'] === false) {
                        parentAuthValue.addClass('error');
                        parentAuthValue.addClass('validation-error');
                    } else {
                        parentAuthValue.removeClass('error');
                        parentAuthValue.removeClass('validation-error');
                    }
                } catch (e) {
                    parentAuthValue.addClass('error');
                    parentAuthValue.addClass('validation-error');
                    console.error(e);
                }
            }
        });
    }

    checkSelectValue() {
        const targetSection = $('input[name="targetSection"]');
        const target = $('input[name="target"]')
        const payment = $('input[name="payment"]')
        const arrElement = [...targetSection, ...target, ...payment];
        for (let index = 0; index < arrElement.length; index++) {
            if (!arrElement[index].value) {
                this.openSelect(arrElement[index])
                break
            }
        }
    }

    openSelect(obj) {
        // mCustomScrollbarModal();
        const parent = $(obj).closest('.select');
        parent.find('.slct_arrow').addClass('active');
        parent.find('.slct').parent().find('.drop').slideDown("fast");
        parent.find('.slct').addClass('active');
    }

    send(formData, callbackRender) {
        let _this = this;
        dvs_is_send = true;
        // Уницифируем отправку запроса
        let action = 'calc';
        if (this.type.toString().indexOf('prolong') >= 0) {
            action = 'prolong';
        }

        // Основной запрос
        $.ajax({
            type: "POST",
            url: '/bitrix/services/main/ajax.php?' + $.param({c: 'diva:catalog', action: action, mode: 'ajax'}, true),
            data: formData, contentType: false, processData: false, cache: false,
            success: function (data) {
                dvs_is_send = false;
                try {
                    let obj = (typeof data === "object" ? data : JSON.parse(data));
                    if (obj.status == "success") {
                        const PAYMENT_ID = obj.data.PAYMENT_ID;
                        _this.process(obj.data, callbackRender);
                        return true;
                    } else {
                        toastifyStatus(obj.errors[0].message, true);
                    }
                } catch (e) {
                    toastifyStatus(e, true);
                }
                console.log('prolong')
                $(".loader-overlay").fadeOut(300);
                return false;
            }
        });
    }

    // Прекалькулятор для формы прайс листа
    priceCalc(callbackRender, order) {
        let formData = this.preFormData(order);
        buildFormData(formData, {items: [...this._basket.values()]});
        this.send(formData, callbackRender);
    }

    // Прекалькулятор для линии
    prolongCalc(listItems, type, period, callbackRender) {
        let formData = this.preFormData("N");
        buildFormData(formData, {listItems: [...listItems]});
        formData.append('period', period);
        formData.append('type', type);
        this.send(formData, callbackRender);
    }

    // Запускаем калькулятор
    calc(order) {
        let formData = this.preFormData(order);
        let arType = this.type.toString().match(/^prolong_(ip\d)$/);
        // let isAuthValue = $('.authorization_method_inner_check_ip_input').hasClass('active');
        // let authValue = $('.pop_order_form input[name="auth_value"]').val();
        // let isValid = ValidateIPaddress(authValue);
        if (arType) {
            formData.set('type', arType[1]);
        }
        buildFormData(formData, {items: [...this._basket.values()]});
        
        //var wait = BX.showWait('dvsBasketLineTemplatePlace');
        if (!formData) {
            this.checkSelectValue();
            return false;
        }
        
        // if(order == 'Y' && isAuthValue){;
        //     if(!isValid){
        //         toastifyStatus('No valid', true);
        //         return false;
        //     }
        // }
        if (!formData) {
            this.checkSelectValue();
            return false;
        }
        if (order == 'Y') {
            debugger;
            $('.pop_order_form button[type="submit"]').attr('disabled', 'disabled'); //делаем кнопку сабмит не кликабельной ( дабы избежать повторной отправки данных )
            $(".loader-overlay").fadeIn(300);
        }
        this.send(formData, this.renderModal);
    }

    check() {
        let status = true;
        let _this = this;
        this._basket.forEach(function (value, key) {

            // Только для ipv4/ipv6
            if (_this.type != 'mobile') {
                if (!value.id || value.id < 1 || !value.p || !value.t || !value.q) {
                    status = false;
                }

                if (value.t == "0" && !value.tn.trim()) {
                    status = false;
                }

                if (arClaririfation && value.t in arClaririfation && $('#id_strong_modal_another-target').val().length < 3) {
                    status = false;
                }
            }

            if (_this.minprice !== undefined && _this.minprice !== null && value.total <= _this.minprice) {
                document.querySelector('.min-price').style.position = 'absolute';
                document.querySelector('.min-price').style.display = 'block';
                document.querySelector('.min-price').style.top = '50px';
                // position: absolute;display: block;top: 50px;
                status = false;
            }
        });

        // TODO: Пока пропускаем, жду когда верстальщик поправит "цель" и 1сник выгрузит что то из 1С
        if (this.type.toString().indexOf('prolong') >= 0) {
            status = true;
        }
        if (!this._email || !this._payment) {
            status = false;
        }
        // if (target in arClaririfation) {
        //     item.value.tn = $(parent).find('input[name="modal_another-target"]').val();
        // }

        // TODO: Другая цель

        return status;
    }

    check_form_so() {
        let _this = this;
        let answ = {};
        answ.status = true;

        let agree_ch = $(".i-agree-to-the-terms-and-conditions input").is(':checked');
        let autho_ip_val = $("#authorization_method_inner_check_ip").val();
        let autho_ip_val_validation = $(".authorization_method_inner_check_ip_input").hasClass('validation-error');
        let auth_login = $('.authorization_method_btn > label input[type=checkbox]').is(':checked');
        if (!auth_login)
            auth_login = $('.i-agree-to-the-terms-and-conditions > label input[type=checkbox]').is(':checked');

        let promo = $(".enter_promo_wrap input[name='enter_promo']");

        if (!agree_ch) {
            // answ.message = BX.message('CAT_FILL_CONDIT');
            answ.status = false;

        } else if ((autho_ip_val == '' || autho_ip_val.indexOf('_') !== -1 || autho_ip_val_validation) && !auth_login) {
            // answ.message = BX.message('CAT_FILL_FIELD_IP');
            $(".authorization_method_inner_check_ip_input").addClass('error');
            answ.status = false;

        } else if (promo.val().trim() !== '' && promo.is(":visible") && !String(promo.val().trim()).match(/^[-_a-zA-Z0-9]{2,20}$/)) {
            // answ.message = BX.message('CAT_ENTER_PROMO_CODE');
            answ.status = false;
        }

        this._basket.forEach(function (value, key) {
            if (Number(value.q) < _this.minimalOrderQuantity) {
                // answ.message = BX.message('CAT_MIN_IPV6') + section_uf_min_order;
                answ.status = false;
            }
            if (!value.q || value.q < 1) {
                answ.status = false;
            }
        });

        return answ;
    }

    renderModal(tmpl, _this) {
        window.li_sel = [];
        let dvsBasketLineTemplate = $("#dvsBasketLineTemplate").html();
        let rendered = Handlebars.compile(dvsBasketLineTemplate, tmpl);
        if (_this.refresh == "N") {
            var buf = rendered(tmpl);
            $("#dvsBasketLineTemplatePlace").find('.price.clearfix').html($(buf).find('.price.clearfix').html());
            $("#dvsBasketLineTemplatePlace").find('#PAYMENTS').html($(buf).find('#PAYMENTS').html());
            if ($("#dvsBasketLineTemplatePlace").find('input[name="quantity"]').val() < $(buf).find('input[name="quantity"]').val())
            {
                $("#dvsBasketLineTemplatePlace").find('input[name="quantity"]').val($(buf).find('input[name="quantity"]').val());
            }
            //$("#dvsBasketLineTemplatePlace").find('.dvs_inner_form_items').data("key", $(buf).find('.dvs_inner_form_items').data("key"));
            _this.refresh = "Y";
        } else {
            $("#dvsBasketLineTemplatePlace").html(rendered(tmpl));
            modalInitialization(); // main.js
            // Кнопка добавить позицию
            $(".pop_order_form .dvs-calc-add").on('click', function () {
                if (_this.addzero()) {

                    _this.calc();
                }
            });
            // Маска для ip
            _this.initMaskIp();
            // Кнопка удалить позицию
            $(".pop_order_form .dvs-calc-del").on('click', function () {
                if (_this.del($(this).data('key'))) {
                    _this.calc();
                }
            });

            // Поле с купоном
            $('.pop_order_form input[name="enter_promo"]').on('keyup change', delay(function () {
                if (_this.coupon != $(this).val()) {
                    _this.coupon = $(this).val();
                    _this.calc();
                }
            }, 500));

            // Поле с email
            $('.pop_order_form input[name="email"]').on('keyup change', delay(function () {
                if (_this.email != $(this).val()) {
                    _this.email = $(this).val();
                }
            }, 100));

            // Поле с IP
            $('.pop_order_form input[name="auth_value"]').on('keyup change', delay(function () {
                if (_this.auth_value != $(this).val()) {
                    _this.auth_value = $(this).val();
                }
            }, 1000));

            // Поле с Другой целью
            $('.pop_order_form input[name="modal_another-service"]').on('keyup change', delay(function () {
                _this.sync(_this.collect($(this)), true);
            }, 1000));

            // Поле с Другой целью соц сети
            $('.pop_order_form input[name="modal_another-target"]').on('keyup change', delay(function () {
                _this.sync(_this.collect($(this)), true);
            }, 1000));

            // Платёжная система
            $('.pop_order_form input[name="payment"]').attrchange({
                trackValues: true, callback: function (event) {
                    if (event.attributeName == 'value' && event.oldValue != event.newValue && _this.payment != event.newValue) {
                        _this.payment = event.newValue;
                        _this.calc();
                    }
                }
            });

            // Изменение страны
            $('.pop_order_form input[name="element"]').attrchange({
                trackValues: true, callback: function (event) {
                    if (event.attributeName == 'value' && event.oldValue != event.newValue) {
                        _this.sync(_this.collect($(this)), true);
                    }
                }
            });

            // Изменение цели
            $('.pop_order_form input[name="target"]').attrchange({
                trackValues: true, callback: function (event) {
                    if (event.attributeName == 'value' && event.oldValue != event.newValue) {
                        _this.sync(_this.collect($(this)), true);
                    }
                }
            });

            // Изменение периода
            $('.pop_order_form input[name="period"]').attrchange({
                trackValues: true, callback: function (event) {
                    if (event.attributeName == 'value' && event.oldValue != event.newValue) {
                        _this.sync(_this.collect($(this)), true);
                    }
                }
            });

            // Изменение оператора
            $('.pop_order_form input[name="operator"]').attrchange({
                trackValues: true, callback: function (event) {
                    if (event.attributeName == 'value' && event.oldValue != event.newValue) {
                        _this.sync(_this.collect($(this)), true);
                    }
                }
            });

            // Изменение времени ротации
            $('.pop_order_form input[name="rotation"]').attrchange({
                trackValues: true, callback: function (event) {
                    if (event.attributeName == 'value' && event.oldValue != event.newValue) {
                        _this.sync(_this.collect($(this)), true);
                    }
                }
            });

            // Инициируем маску для ip в момент изменения
            $('.pop_order_form input[name="auth_type_ip"]').attrchange({
                trackValues: true, callback: function (event) {
                    if (event.attributeName == 'value' && event.oldValue != event.newValue) {
                        // Маска для ip
                        // _this.initMaskIp();
                    }
                }
            });
            const self = this;
            // Изменение количества
            $('.pop_order_form input[name="quantity"]').on('keyup', delay(function () {
                _this.refresh = "N";
                this.value = this.value.replace(/^[^1-9][^0-9]*/g, '');
                _this.sync(_this.collect($(this)), true);
            }, 500));

            // Изменение галки ротации по ссылке и по времени
            $('.pop_order_form input[name="rotation_by_link"], .pop_order_form input[name="rotation_by_time"]').on('change', function () {
                _this.sync(_this.collect($(this)), true);
            });

            //Сохранения auth_type checkbox состояния
            $('.pop_order_form .authorization_method_btn input[name="auth_type_login"]').on('change', function(){
                // console.log('sss')
                // _this.auth_type =  $('.authorization_method_inner_check_ip_input').hasClass('active') ? "login" : "ip";
                // _this.sync(_this.collect($(this)), true);
            })
            //restoreFocusElement();

            // Удаляем затемнение
            $(".pop_order_form .inner_form").removeClass('loading');
        }
    }

    initMaskIp() {
        if ($(".ip-mask").length > 0) {
            try {
                $(".ip-mask").inputmask();
            } catch (err) {

            }
        }
    }

    // Обрабатываем результаты ответа калькулятора, рендерим форму
    process(data, callbackRender) {
        $('.loader-overlay').fadeOut(300)
        // Добавляем недостающие данные
        // TODO: Удалить не найденные записи
        let _this = this;
        _this._currency = _this._currency || data.CURRENCY;

        /*if (currencyUSD) {
         _this._currency = currencyUSD;
         }*/

        _this.email = _this.email || data.EMAIL || "";

        // Если корзина пуста - создаём корзину из ответа
        if (data.BASKET_ITEMS && _this._basket.size === 0) {
            Object.keys(data.BASKET_ITEMS).map(function (objectKey, index) {

                let res = _this.add(
                        data.BASKET_ITEMS[objectKey].SECTION,
                        data.BASKET_ITEMS[objectKey].ID,
                        data.BASKET_ITEMS[objectKey].QUANTITY,
                        data.BASKET_ITEMS[objectKey].TIME,
                        data.BASKET_ITEMS[objectKey].TARGET,
                        data.BASKET_ITEMS[objectKey].TARGET_SECTION
                        );

                if (data.BASKET_ITEMS[objectKey].IPID) {
                    res.curBasketItem.value.ipid = data.BASKET_ITEMS[objectKey].IPID;
                }

                if (data.BASKET_ITEMS[objectKey].TARGET_NAME) {
                    res.curBasketItem.value.tn = data.BASKET_ITEMS[objectKey].TARGET_NAME;
                }
                if (data.BASKET_ITEMS[objectKey].OPERATOR) {
                    res.curBasketItem.value.operator = data.BASKET_ITEMS[objectKey].OPERATOR;
                }
                if (data.BASKET_ITEMS[objectKey].ROTATION) {
                    res.curBasketItem.value.rotation = data.BASKET_ITEMS[objectKey].ROTATION;
                }

                res.curBasketItem.value.img = data.BASKET_ITEMS[objectKey].IMG;
                res.curBasketItem.value.price = data.BASKET_ITEMS[objectKey].PRICE[_this._currency];
                res.curBasketItem.value.total = data.BASKET_ITEMS[objectKey].TOTAL[_this._currency];
                res.curBasketItem.value.discount = data.BASKET_ITEMS[objectKey].DISCOUNT_PRICE[_this._currency];
                _this._basket.set(res.curBasketItem.key, res.curBasketItem.value);
            });
        }

        let minprice = data.MIN_PRICE;

        if (data.BASKET_ITEMS) {
            // Сопоставляем данные
            this._basket.forEach(function (value, key) {
                Object.keys(data.BASKET_ITEMS).map(function (objectKey, index) {

                    if (_this.buildKey(data.BASKET_ITEMS[objectKey].ID, data.BASKET_ITEMS[objectKey].TIME, data.BASKET_ITEMS[objectKey].TARGET)
                            == _this.buildKey(value.id, value.p, value.t)) {
                        value.img = data.BASKET_ITEMS[objectKey].IMG;
                        value.price = data.BASKET_ITEMS[objectKey].PRICE[_this._currency];
                        value.total = data.BASKET_ITEMS[objectKey].TOTAL[_this._currency];
                        value.discount = data.BASKET_ITEMS[objectKey].DISCOUNT_PRICE[_this._currency];

                        if (value.discount > 0) {
                            value.discount = -value.discount;
                        }
                        value.time_c = data.BASKET_ITEMS[objectKey].TIME;
                    }
                });
            });
        } else {
            // Очищаем корзину или
            // Закрываем модалку или
            // Ничего не делаем
        }
        this.save();

        if (data.PAY) {
            $("#dvsBasketLineTemplatePlace").html(data.MSG);
            location.href = data.PAY + "&SELECTED_CURRENCY=" + (window.cur_currency || 'USD');
            return;
        }

        let total = 0, price = 0, comission = 0;
        if (data.SUM && data.SUM.TOTAL && data.SUM.TOTAL[this._currency]) {
            total = data.SUM.TOTAL[this._currency];
        }
        if (data.SUM && data.SUM.PRICE && data.SUM.PRICE[this._currency]) {
            price = data.SUM.PRICE[this._currency];
        }
        if (data.COMISSION_PS && data.COMISSION_PS[this._currency]) {
            comission = data.COMISSION_PS[this._currency];
        }

        var SINGLE_TARGET_SECTIONS = '';

        if (singleTargetSection)
            SINGLE_TARGET_SECTIONS = singleTargetSection;
        if (!singleTargetSection && this.type == "ivp4")
            SINGLE_TARGET_SECTIONS = singleTargetSectionMAIN;

        this.tmpl = {

            type: this.type.toString().indexOf('prolong_') >= 0 ? 'prolong' : this.type,
            items: [...this._basket.values()],
            MIN_PRICE: minprice,
            ROTATION_TIMES_MAP: arRotationTimesByCountryAndOperator,
            ROTATION_PERMS_MAP: arRotationPermsByCountryAndOperator,
            OPERATOR_MAP: arOperatorsMap,
            PERIOD: arPeriodModal,
            PERIOD_MAP: arPeriodMap,
            ELEMENTS: arElements,
            SECTIONS: arSections,
            MIN_ORDER_COUNT: this.min_order,
            TARGETS: arTargets,
            TARGETS_SECTION: arTargetsSection,
            TARGETS_CLARIFICATION: arClaririfation,
            TARGET_MAP: arTargetMap,
            TARGET_SECTION_MAP: arTargetSectionMap,
            TOTAL: total,
            PRICE: price, QUANTITY: (data.QUANTITY) ? data.QUANTITY : "",
            CURRENCY: this._currency,
            PAYMENTS: (data.PAYMENTS) ? data.PAYMENTS : "",
            PAYMENT_ID: (data.PAYMENT_ID) ? data.PAYMENT_ID : "",
            coupon: this._coupon, email: this._email,
            COMISSION_PS: comission,
            SINGLE_TARGET_SECTIONS: SINGLE_TARGET_SECTIONS,
            auth_type: this._auth_type,
            auth_value: this._auth_value,
            login_pwd_checkbox_state: this._login_pwd_checkbox_state,
        };

        if (typeof callbackRender !== 'function') {
            var fn = window[callbackRender];
            fn(this.tmpl, _this);
            // eval(settings.functionName + '(' + t.parentNode.id + ')'); TODO: или это
            let matches = callbackRender.match(/^lineRender_(ip\d$)/);
            if (matches && matches[1] === 'ip6') {
                let button = document.querySelector('#dvsExtendLineTemplatePlace_' + matches[1] + ' button');
                button.style.pointerEvents = 'none';
                button.style.opacity = '0.3';
            }
        } else {
            callbackRender(this.tmpl, _this);
        }

    }
}

function initPaymentModal(section, element, quantity, period, target, targetSection, coupon, type, notes, operator, rotation, auth_type, currency_user) {
    if (section && element && period) {
        // Разделяем корзину по секциям
        if (!type) {
            type = section;
        }

        if (currency_user)
            this._currency = currency_user;

        
        $(".pop_order_form form").data('type', type);
        $(".pop_order_form .modal_title").text(BX.message('CAT_ORDER_FORM'));
        let basket = new DivasoftMiniBasket(type);
        basket.clear();
        basket.add(section, element, quantity, period, target, targetSection, notes, operator, rotation, auth_type);
        basket.coupon = coupon;
        basket._currency = window.cur_currency || 'USD';
        basket.calc();
        openModal('modal-order');

    } else {
        // Валидация селектов при нажатии на "Купить прокси" на главной странице
        const select = $('.header_select .select .slct')

        for (let i = 0; i < select.length; i++) {
            const element = select[i]
            const bule = $(element).hasClass('active_link')

            if (bule == false) {
                $(element).first().click()
                return
            } else {
                $('.slct').removeClass('active').parent().find('.drop').slideUp("fast")
            }
        }
    }
}

function initProlongModal(type) {
    
    $(".pop_order_form form").data('type', 'prolong_' + type);
    $(".pop_order_form .modal_title").text(BX.message('CAT_PROLONG_FORM'));
    let basket = new DivasoftMiniBasket('prolong_' + type);
    basket.ipVersion = type;
    basket.calc();
    openModal('modal-order');
}

var dvs_is_send = false;
$(function () {
    $('.dvs_order_form form').on('submit', function (e) {
        // console.log('dvs_is_send', dvs_is_send);
        if (dvs_is_send) {
            return false;

        }

        dvs_is_send = true;
        //$('.pop_order_form button[type="submit"]').text('Проверка ...');
        e.preventDefault();
        let basket = new DivasoftMiniBasket($(this).data('type'));
        basket.calc("Y");
        return false;
    });
});
