if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker Registered'))
        .catch(err => console.error('Service Worker Error:', err));
}

// Обновить спискок документов
document.addEventListener("DOMContentLoaded", function () {
    // ====== Общие функции ======

    // Сброс всех данных из localStorage
    function resetData() {
        localStorage.clear();
        alert("Все данные успешно сброшены!");
    }

    // Проверка и сброс данных на странице
    function checkAndResetFields(fields, uploadedImageId, imageContainerId) {
        const uploadedImage = document.getElementById(uploadedImageId);
        const imageContainer = document.getElementById(imageContainerId);

        if (!localStorage.getItem(fields[0])) {
            fields.forEach(field => {
                const input = document.getElementById(field);
                if (input) {
                    input.value = ''; // Очищаем значение
                    input.classList.remove('readonly'); // Убираем стили "только для чтения"
                }
            });

            if (uploadedImage && imageContainer) {
                uploadedImage.src = '';
                imageContainer.style.display = 'none';
            }
        }
    }

    // ====== Логика для index.html ======
    const updateButton = document.getElementById("update-btn");
    if (updateButton) {
        updateButton.addEventListener("click", function () {
            resetData();

            // (Опционально) Перенаправляем на другую страницу
            window.location.href = "idcard.html";
        });
    }

    // ====== Логика для idCard.html ======
    const fields = ['fio', 'iin', 'birthdate', 'docNumber', 'issueDate', 'expiryDate'];
    const uploadedImageId = "uploaded-image";
    const imageContainerId = "image-container";

    if (document.getElementById(uploadedImageId)) {
        checkAndResetFields(fields, uploadedImageId, imageContainerId);
    }
});