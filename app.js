if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker Registered'))
        .catch(err => console.error('Service Worker Error:', err));
}

// Обновить спискок документов
function resetData() {
    localStorage.clear();
    alert("Все данные успешно сброшены!");
}

// Функция для проверки данных и сброса интерфейса
function checkAndResetFields(fields, uploadedImageId, imageContainerId) {
    const uploadedImage = document.getElementById(uploadedImageId);
    const imageContainer = document.getElementById(imageContainerId);

    // Проверяем, есть ли данные
    if (!localStorage.getItem(fields[0])) {
        // Сбрасываем поля
        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.value = ''; // Очищаем значение
                input.classList.remove('readonly'); // Убираем стили "только для чтения"
            }
        });

        // Сбрасываем изображение
        if (uploadedImage && imageContainer) {
            uploadedImage.src = '';
            imageContainer.style.display = 'none'; // Скрываем контейнер
        }
    }
}