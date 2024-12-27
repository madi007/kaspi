const sendBtn = document.querySelector('.footer-btn.present-btn');
const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('.close-modal-btn');
const randomCodeElement = document.querySelector('.random-code');

// Функция для генерации случайного 6-значного кода
function generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Показ модального окна
function showModal() {
    randomCodeElement.textContent = generateRandomCode();
    modal.classList.remove('hidden');
    modal.classList.add('visible');
}

// Скрытие модального окна
function hideModal() {
    modal.classList.remove('visible');
    modal.classList.add('hidden');
}

// Обработчики событий
sendBtn.addEventListener('click', showModal);
closeModalBtn.addEventListener('click', hideModal);

// Закрытие модального окна по клику вне его (опционально)
document.addEventListener('click', (e) => {
    if (modal.classList.contains('visible') && !modal.contains(e.target) && !sendBtn.contains(e.target)) {
        hideModal();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const uploadButton = document.getElementById("upload-button");
    const imageContainer = document.getElementById("image-container");
    const uploadedImage = document.getElementById("uploaded-image");

    // Обработчик для кнопки загрузки
    uploadButton.addEventListener("click", function () {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*"; // Только изображения

        // Когда файл выбран
        input.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    uploadedImage.src = e.target.result; // Загружаем изображение в img
                    imageContainer.style.display = "flex"; // Показываем контейнер с изображением
                    uploadButton.style.display = "none"; // Скрываем кнопку

                    // Сохраняем изображение в localStorage
                    localStorage.setItem("uploadedImage", e.target.result);
                };
                reader.readAsDataURL(file); // Читаем файл
            }
        });

        // Открыть окно выбора файла
        input.click();
    });

    // Проверяем, есть ли сохраненное изображение
    const savedImage = localStorage.getItem("uploadedImage");
    if (savedImage) {
        uploadedImage.src = savedImage; // Загружаем сохраненное изображение
        imageContainer.style.display = "flex"; // Показываем контейнер с изображением
        uploadButton.style.display = "none"; // Скрываем кнопку
    }
});
// зум
document.addEventListener("DOMContentLoaded", function () {
    const imageContainer = document.getElementById("image-container");
    const uploadedImage = document.getElementById("uploaded-image");

    let scale = 1; // Текущий масштаб
    let position = { x: 0, y: 0 }; // Текущая позиция
    let lastPosition = { x: 0, y: 0 }; // Последняя позиция
    let isPanning = false;

    imageContainer.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            isPanning = true;
            lastPosition.x = e.touches[0].clientX - position.x;
            lastPosition.y = e.touches[0].clientY - position.y;
        } else if (e.touches.length === 2) {
            isPanning = false;
        }
    });

    imageContainer.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (e.touches.length === 1 && isPanning) {
            position.x = e.touches[0].clientX - lastPosition.x;
            position.y = e.touches[0].clientY - lastPosition.y;

            // Ограничиваем перемещение
            restrictPosition();
            updateTransform();
        } else if (e.touches.length === 2) {
            const distance = getDistance(e.touches[0], e.touches[1]);
            const newScale = Math.max(1, Math.min(scale * (distance / 200), 3)); // Ограничиваем масштаб
            const scaleChange = newScale / scale;
            scale = newScale;

            // Центрируем изображение при изменении масштаба
            const rect = imageContainer.getBoundingClientRect();
            position.x -= (rect.width / 2 - position.x) * (scaleChange - 1);
            position.y -= (rect.height / 2 - position.y) * (scaleChange - 1);

            restrictPosition();
            updateTransform();
        }
    });

    imageContainer.addEventListener("touchend", () => {
        isPanning = false;

        // Возвращаем изображение к исходным размерам при минимальном масштабе
        if (scale <= 1) {
            scale = 1;
            position.x = 0;
            position.y = 0;
            updateTransform();
        }
    });

    function updateTransform() {
        uploadedImage.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`;
    }

    function restrictPosition() {
        const rect = imageContainer.getBoundingClientRect();
        const imgRect = uploadedImage.getBoundingClientRect();

        const deltaX = (imgRect.width - rect.width) / 2;
        const deltaY = (imgRect.height - rect.height) / 2;

        position.x = Math.max(-deltaX, Math.min(deltaX, position.x));
        position.y = Math.max(-deltaY, Math.min(deltaY, position.y));
    }

    function getDistance(pointA, pointB) {
        const dx = pointA.clientX - pointB.clientX;
        const dy = pointA.clientY - pointB.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
});

// Генерация файла
document.addEventListener("DOMContentLoaded", function () {
    const sendButtons = document.querySelectorAll(".footer-btn.send-btn"); // Выбираем все кнопки с классом

    // Функция для создания имени файла
    function generateFileName() {
        const iin = localStorage.getItem('iin') || "000000"; // Получаем IIN из localStorage
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const randomNumbers = Math.floor(Math.random() * 1e9).toString().padStart(9, '0'); // 9 случайных цифр
        return `${iin}-${year}${month}${day}${randomNumbers}.pdf`;
    }

    // Обработчик для всех кнопок
    sendButtons.forEach((sendButton) => {
        sendButton.addEventListener("click", async () => {
            const { jsPDF } = window.jspdf;

            // Получаем сохранённое изображение из localStorage
            const savedImage = localStorage.getItem("uploadedImage");
            if (!savedImage) {
                alert("Изображение не найдено. Загрузите его перед отправкой.");
                return;
            }

            // Создаём объект изображения
            const img = new Image();
            img.src = savedImage;

            // Ждём, пока изображение загрузится
            img.onload = async function () { // Делаем эту функцию асинхронной
                // Получаем исходные размеры изображения
                const imgOriginalWidth = img.width;
                const imgOriginalHeight = img.height;

                // Размеры страницы A4 в мм
                const pageWidth = 210;
                const pageHeight = 297;

                // Рассчитываем коэффициент масштабирования для сохранения пропорций
                const scaleFactor = Math.min(pageWidth / imgOriginalWidth, pageHeight / imgOriginalHeight);

                // Вычисляем новые размеры изображения
                const scaledWidth = imgOriginalWidth * scaleFactor;
                const scaledHeight = imgOriginalHeight * scaleFactor;

                // Создаём PDF
                const pdf = new jsPDF();
                pdf.addImage(savedImage, "JPEG", 0, 0, scaledWidth, scaledHeight);

                // Преобразуем PDF в Blob
                const pdfBlob = pdf.output("blob");

                // Генерация имени файла
                const fileName = generateFileName();

                // Проверяем поддержку Web Share API
                if (navigator.share && navigator.canShare({ files: [new File([pdfBlob], fileName, { type: "application/pdf" })] })) {
                    try {
                        // Создаём файл для отправки
                        const file = new File([pdfBlob], fileName, { type: "application/pdf" });

                        // Вызов встроенного меню "Поделиться"
                        await navigator.share({
                            files: [file],
                        });

                        console.log("PDF успешно отправлен!");
                    } catch (error) {
                        console.error("Ошибка при отправке:", error);
                    }
                } else {
                    alert("Ваш браузер не поддерживает функцию 'Поделиться'.");
                }
            };

            // Поставим проверку на ошибку загрузки изображения
            img.onerror = function () {
                alert("Не удалось загрузить изображение. Проверьте его источник.");
            };
        });
    });
});

// Обновить список документов
document.addEventListener("DOMContentLoaded", () => {
    const fields = ['fio', 'iin', 'birthdate', 'docNumber', 'issueDate', 'expiryDate'];
    const uploadedImage = document.getElementById("uploaded-image");
    const imageContainer = document.getElementById("image-container");
    const uploadButton = document.getElementById("upload-button");

    function resetIdCard() {
        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.value = "";
                input.classList.remove("readonly");
            }
        });
        uploadedImage.src = "";
        imageContainer.style.display = "none";
        uploadButton.style.display = "block";
        fields.forEach(field => localStorage.removeItem(field));
        localStorage.removeItem("uploadedImage");
        localStorage.setItem("isSaved", "false");
    }
    if (localStorage.getItem("resetIdCard") === "true") {
        resetIdCard();
        localStorage.removeItem("resetIdCard");
    }
    window.addEventListener("storage", (event) => {
        if (event.key === "resetIdCard" && event.newValue === "true") {
            resetIdCard();
            localStorage.removeItem("resetIdCard");
        }
    });
});