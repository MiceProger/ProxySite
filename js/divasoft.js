// http://stackoverflow.com/questions/2420970/how-can-i-get-selector-from-jquery-object/15623322#15623322
!function(e,t){var n=function(e){var n=[];for(;e&&e.tagName!==t;e=e.parentNode){if(e.className){var r=e.className.split(" ");for(var i in r){if(r.hasOwnProperty(i)&&r[i]){n.unshift(r[i]);n.unshift(".")}}}if(e.id&&!/\s/.test(e.id)){n.unshift(e.id);n.unshift("#")}n.unshift(e.tagName);n.unshift(" > ")}return n.slice(1).join("")};e.fn.getSelector=function(t){if(true===t){return n(this[0])}else{return e.map(this,function(e){return n(e)})}}}(window.jQuery)

Handlebars.registerHelper('isNaN', function(a, opts) {
    try {
        if (isNaN(a)) {
            return opts.fn(this);
        }
    } catch (e) { console.log(e); }
    return opts.inverse(this);
});

// https://stackoverflow.com/questions/8853396/logical-operator-in-a-handlebars-js-if-conditional
Handlebars.registerHelper({
    eq: (v1, v2) => v1 == v2,
    ne: (v1, v2) => v1 != v2,
    isnull: (v1, v2) => v1 === null || v1 === false || v1 === undefined,
    nenull: (v1, v2) => v1 !== null && v1 !== false && v1 !== undefined,
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
    and() {
        return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    }
});

Handlebars.registerHelper('ifIn', function(elem, list, options) {
  if (!list || list.length===0) {
     return options.fn(this);
  }
  if(list.indexOf(elem) > -1) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper({
    get(elem, keyLevel1, keyLevel2, keyLevel3) {
        // TODO: Убрать console.log
        //console.log('get', elem, 'L1:',keyLevel1, 'L2:',keyLevel2, 'L3:',keyLevel3);
        if (!elem) {
            return false;
        }
        if (keyLevel1 && keyLevel2 && typeof keyLevel3 !== 'object') {
            //console.log('get - found level3', elem[keyLevel1][keyLevel2][keyLevel3]);
            return elem[keyLevel1][keyLevel2][keyLevel3];
        }
        if (keyLevel1 && keyLevel2) {
            //console.log('get - found level2', elem[keyLevel1][keyLevel2]);
            return elem[keyLevel1][keyLevel2];
        }
        if (keyLevel1) {
            return elem[keyLevel1];
        }
    },
    getKeys(elem, idElement) {
        return Object.keys(elem[idElement]);
    }
});

// Дополняем formData коллекцией
function buildFormData(formData, data, parentKey) {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
        Object.keys(data).forEach(key => {
            buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
        });
    } else {
        const value = data == null ? '' : data;
        if(formData){
            formData.append(parentKey, value);
        }
        
    }
}

// Задержка срабатывания функции
function delay(callback, ms) {
    var timer = 0;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, ms || 0);
    };
}


// Возвращаем фокус в инпут
let fieldFocusSelectorElement = false;
let fieldFocusSelectorElementPosition = 0;
$(function () {
    $(document).on('focus', 'input', function () {
        fieldFocusSelectorElement = $(this).getSelector().join("\n");
    });
    $(document).on('keyup', 'input', function () {
        fieldFocusSelectorElementPosition = this.selectionStart;
    });
});

function restoreFocusElement() {
    if (fieldFocusSelectorElement) {
        try {
            let elem = $(fieldFocusSelectorElement);
            $(elem).focus();
            $(elem).get(0).setSelectionRange(fieldFocusSelectorElementPosition, fieldFocusSelectorElementPosition);
        } catch (e) {}
    }
}

// Чиним консоль
BX.Event.EventEmitter.setMaxListeners(50);

//Пишем свои табы с блекджеком и не прод словом
let sticky = new Sticky('.sticky');
// Удаление со всех вопросов активный класс
function resetActiveQuestions() {
    const questions = document.querySelectorAll('.FAQ-tab-item')
    for (let i = 0; i < questions.length; i++) {
        questions[i].classList.remove('active')
    }
}

function resetActiveAnswer() {
    const group = document.querySelectorAll('.FAQ-tab-group')
    for (let i = 0; i < group.length; i++) {
        group[i].classList.remove('active')
        for (let j = 0; j < group[i].children.length; j++){
            group[i].children[j].classList.remove('active')
        }
    }
}

function resetFilterFaq() {
    resetActiveQuestions()
    resetActiveAnswer()
    removeActiveAllLiFaq()
    const questions = document.querySelectorAll('.FAQ-tab-item')
    for (let i=0; i<questions.length; i++) {
        questions[i].classList.remove('hide')
    }
}

function setActiveAnswer(id, index) {
    const activeBlock = document.querySelector('.FAQ-tab-group[data-faqtab="'+id+'"]')
    activeBlock.classList.add('active')
    activeBlock.children[index].classList.add('active')
}

function removeActiveAllLiFaq() {
    const allLiItemsActive = document.querySelectorAll('.FAQ-accordion-wrap > li.active')
    for (let i = 0; i < allLiItemsActive.length; i++) {
        allLiItemsActive[i].classList.remove('active')
    }
}

// Функция клика на группу вопросов
function handleClickGroupOfQuestions(event) {
    event.preventDefault()
    // Получаем родительскую лишку на которую вешаем active
    const parentLi = event.target.parentNode
    // Если кликнули на активную, то убираем класс, скрывая ее
    if (parentLi.classList.contains('active')) {
        resetActiveQuestions()
        resetActiveAnswer()
        return parentLi.classList.remove('active')
    }
    // Удаляем со всех лишек активные классы, чтобы скрыть
    removeActiveAllLiFaq()
    // Удаляем со всех вопросов активный класс
    resetActiveQuestions()
    resetActiveAnswer()
    // А теперь на который нажали навешиваем активный
    parentLi.classList.add('active')

    // Первый вопрос делаем активным
    const firstElem = parentLi.querySelector('.FAQ-tab-item')
    if (!firstElem) {
        return null
    }
    firstElem.classList.add('active')

    const activeId = parentLi.querySelector('.FAQ-tab-items').getAttribute('data-faqtab')
    setActiveAnswer(activeId, 0)
    sticky.destroy();
    sticky = new Sticky('.sticky');

}
// Вешаем слушатель на клики на группу вопросов
(function () {
    const groups = document.querySelectorAll('.FAQ-accordion__link-toggle')
    for (let i = 0; i < groups.length; i++) {
        groups[i].addEventListener('click', handleClickGroupOfQuestions)
    }
})()

function handleClickOfQuestions(elem, id, index) {
    resetActiveQuestions()
    resetActiveAnswer()
    setActiveAnswer(id, index)
    elem.classList.add('active')
    sticky.destroy();
    sticky = new Sticky('.sticky');
}

function searchFaq(event) {
    resetFilterFaq()
    const value = event.target.value.toLowerCase()
    if (!value) {
        return
    }
    const allQuestionsHTML = document.querySelectorAll('.FAQ-tab-item')
    const allQuestions = []
    for (let i = 0; i < allQuestionsHTML.length; i++) {
        allQuestions.push(allQuestionsHTML[i].querySelector('p').innerHTML.toLowerCase())
    }
    for (let i = 0; i < allQuestions.length; i++) {
        if (allQuestions[i].indexOf(value) !== -1) {
            allQuestionsHTML[i].parentNode.classList.add('active')
            const liHTML = allQuestionsHTML[i].parentNode.parentNode.parentNode
            if (!liHTML.classList.contains('active')){
                liHTML.classList.add('active')
            }
        } else {
            allQuestionsHTML[i].classList.add('hide')
        }
    }
}

(function () {
    // ешаем обработчки на вопрсоы
    const container = document.querySelectorAll('.FAQ-tab-wrapper .FAQ-tab-items')
    for (let i = 0; i < container.length; i++) {
        for (let j = 0; j < container[i].children.length; j++) {
            const id = container[i].getAttribute('data-faqtab')
            container[i].children[j].addEventListener('click', function () {
                handleClickOfQuestions(container[i].children[j], id, j)
            })
        }
    }

    // TODO Переделать (Открытие первого айтема)
    if(document.querySelector('.FAQ-tab-wrap-all')){
        document.querySelector('.FAQ-tab-wrap-all .FAQ-accordion-wrap li').classList.add('active');
        document.querySelector('.FAQ-tab-wrap-all .FAQ-tab-group').classList.add('active');
        document.querySelector('.FAQ-tab-wrap-all .FAQ-tabs-wrap').classList.add('active');
        
    }
    
    
    // Вешаем обработчик на input
    const input = document.querySelector('.articles__search.faq input')
    if (input) {
        input.addEventListener('keyup', searchFaq)
    }

    const btn = document.querySelector('.articles__search.faq button')
    if (btn) {
        btn.addEventListener('click', function (event) {
            input.value = ''
            resetFilterFaq()
        })
    }
})()