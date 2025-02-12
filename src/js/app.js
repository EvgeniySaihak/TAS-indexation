document.addEventListener('DOMContentLoaded', () => {
    console.log('Скрипт загружен!');
});

$(document).ready(function() {
    $('.toggle-btn').click(function() {
        $(this).closest('.bank-container').find('.bank-details').slideToggle();
        $(this).text($(this).text() === "Реквізити ▼" ? "Реквізити ▲" : "Реквізити ▼");
    });

    function copyBankDetails(buttonClass, dataClass) {
        $(buttonClass).click(function() {
            let bankDetails = $(this).closest('.bank-details').find(dataClass + ' p')
                .map((_, el) => $(el).text()).get().join('\n');

            navigator.clipboard.writeText(bankDetails).then(() => {
                showCopyMessage($(this));
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
});
