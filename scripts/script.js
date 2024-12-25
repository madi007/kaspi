document.addEventListener("DOMContentLoaded", () => {
    const uploadButton = document.querySelector(".update-btn");

    uploadButton.addEventListener("click", () => {
        // Устанавливаем сигнал сброса в localStorage
        localStorage.setItem("resetIdCard", "true");
        alert("Данные для сброса отправлены. Перезагрузи страницу idcard.html.");
    });
});
