document.addEventListener('DOMContentLoaded', () => {
    console.log('Скрипт загружен!');
});

$(document).ready(function() {
    $('.toggle-btn').click(function() {
        $(this).closest('.bank-container').find('.bank-details').slideToggle();
        $(this).text($(this).text() === "Реквізити ▼" ? "Реквізити ▲" : "Реквізити ▼");
    });

    $('.short-data').click(function() {
        $(this).closest('.bank-container').find('.bank-details').slideToggle();
    });

    function copyBankDetails(buttonClass, dataClass) {
        $(buttonClass).click(function(event) {
            event.stopPropagation(); // 🛡 Предотвращаем срабатывание событий у родительских элементов

            // 📝 Получаем текст, объединяем и убираем лишние пробелы
            let bankDetails = $(this).closest('.bank-details').find(dataClass + ' p')
                .map((_, el) => $(el).text().replace(/\s+/g, ' ').trim()) // Удаляем лишние пробелы
                .get().join('\n');

            // 📋 Копируем текст в буфер обмена
            navigator.clipboard.writeText(bankDetails).then(() => {
                showCopyMessage($(this)); // ✨ Уведомление об успешном копировании
            }).catch((err) => {
                console.error('❌ Помилка при копіюванні:', err);
            });
        });
    }


    function showCopyMessage(button) {
        let message = $('.message');

        message.css({
            top: `100px`,
            left: '50%',
            display: 'block',
            transform: 'translateX(-50%)'
        }).fadeIn().delay(1500).fadeOut();
    }

    copyBankDetails('.copy-btn-privat', '.data-privat');
    copyBankDetails('.copy-btn-mono', '.data-mono');
    copyBankDetails('.copy-btn-tas', '.data-tas');

    $(".email-button").click(function () {
        // Получаем email без SVG
        let email = $(this).contents().filter(function () {
            return this.nodeType === 3; // Оставляем только текстовый узел
        }).text().trim();

        // Копируем email в буфер
        navigator.clipboard.writeText(email).then(() => {
            console.log("Email скопирован: " + email);
        }).catch(err => {
            console.error("Ошибка копирования: ", err);
        });
    });



    $(".year").text(new Date().getFullYear());


    function formatNumberWithSpaces(numberString) {
        let parts = numberString.trim().split('.');
        let integerPart = parts[0];
        let decimalPart = parts[1] ? '.' + parts[1] : '';

        // Добавляем пробелы в зависимости от длины целой части
        if (integerPart.length === 4) {
            integerPart = integerPart.slice(0, 1) + ' ' + integerPart.slice(1);
        } else if (integerPart.length === 5) {
            integerPart = integerPart.slice(0, 2) + ' ' + integerPart.slice(2);
        } else if (integerPart.length === 6) {
            integerPart = integerPart.slice(0, 3) + ' ' + integerPart.slice(3);
        }

        return integerPart + decimalPart;
    }

    function processElement(element) {
        // Перебираем все текстовые узлы верхнего уровня в элементе
        element.contents().filter(function() {
            return this.nodeType === 3 && this.nodeValue.trim().length > 0;
        }).each(function() {
            let formattedText = formatNumberWithSpaces(this.nodeValue.trim());
            this.nodeValue = formattedText + ' ';
        });
    }

    // Форматирование для .value и добавление класса right__sum
    $('.value').each(function() {
        processElement($(this));
        $(this).addClass('right__sum');
    });

    // Форматирование для .right__sum без нарушения структуры
    $('.right__sum').each(function() {
        processElement($(this));
    });



    function formatDate(dateString) {
        // Проверяем формат даты и преобразуем
        const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
        const match = dateString.trim().match(datePattern);
        if (match) {
            return `${match[3]}.${match[2]}.${match[1]}`; // DD.MM.YYYY
        }
        return dateString;
    }

    // Находим все элементы, содержащие дату в формате YYYY-MM-DD
    $('*').each(function() {
        $(this).contents().filter(function() {
            return this.nodeType === 3 && /\d{4}-\d{2}-\d{2}/.test(this.nodeValue);
        }).each(function() {
            this.nodeValue = this.nodeValue.replace(/\d{4}-\d{2}-\d{2}/g, function(match) {
                return formatDate(match);
            });
        });
    });



    function setupIbanCopy(buttonSelector, ibanSelector) {
        $(buttonSelector).on('click', function(event) {
            event.stopPropagation();


            const ibanText = $(this).siblings(ibanSelector).text().replace('IBAN: ', '').trim();

            // Копируем в буфер обмена
            navigator.clipboard.writeText(ibanText).then(() => {
                showCopyMessage($(this)); //Показываем уведомление
            }).catch((err) => {
                console.error('Помилка при копіюванні:', err);
            });
        });
    }

    // Подключаем обработчики для всех типов IBAN
    setupIbanCopy('.copy-iban-privat', '.iban-privat');
    setupIbanCopy('.copy-iban-mono', '.iban-mono');
    setupIbanCopy('.copy-iban-tas', '.iban-tas');



    $('.payment-destination').on('click', function(event) {
        event.stopPropagation(); // Предотвращаем срабатывание других обработчиков на родителе

        const paymentText = $(this)
            .siblings('.bold-person-data')
            .text()
            .replace(/\s+/g, ' ') // Оставляем только один пробел между словами
            .trim();

        // 📋 Создаём временный input для копирования
        const tempInput = $('<input>');
        $('body').append(tempInput);
        tempInput.val(paymentText).select();
        document.execCommand('copy');
        tempInput.remove(); // Удаляем временный input

        showCopyMessage($(this));
    });




    // изменение данных в поле даты под "шагами"


    // Получаем строку даты из тега с id "date"
    var dateStr = $("#necesary_date").text().trim();

    // Ожидаем формат "18 Mar 2025" - делим строку по пробелам
    var parts = dateStr.split(" ");
    if (parts.length !== 3) {
        console.error("Неверный формат даты: ожидается '18 Mar 2025'");
        return;
    }

    var day = parts[0];           // "18"
    var monthAbbr = parts[1];     // "Mar"
    var year = parts[2];          // "2025"

    // Сопоставление аббревиатур месяцев с их числовым представлением
    var monthNumbers = {
        "Jan": "01",
        "Feb": "02",
        "Mar": "03",
        "Apr": "04",
        "May": "05",
        "Jun": "06",
        "Jul": "07",
        "Aug": "08",
        "Sep": "09",
        "Oct": "10",
        "Nov": "11",
        "Dec": "12"
    };

    var month = monthNumbers[monthAbbr];
    if (!month) {
        console.error("Неверное обозначение месяца: " + monthAbbr);
        return;
    }

    // Формируем новую строку даты в формате "день.месяц.год"
    var newDateFormat = day + '.' + month + '.' + year;

    // Обновляем содержимое тега #date
    $("#necesary_date").text(newDateFormat);

});
