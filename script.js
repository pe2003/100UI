// Массив из 100 форм
const circles = Array.from({ length: 100 }, (_, i) => {
  const types = [
    "mouse-idle", "confirm-digit", "reverse", "voice", "future", "lie-detector",
    "timer", "duplicate", "dark", "fake-success", "depression", "thought",
    "time-code", "chase-button", "iq", "breathe", "captcha", "shake", "underwater",
    "soul"
  ];
  const type = types[i % types.length];
  const colors = ["#f03", "#f36", "#c0f", "#60f", "#00f", "#0cf", "#09f"];
  return {
    id: i + 1,
    title: generateTitle(i + 1, type),
    description: generateDesc(i + 1, type),
    type,
    color: colors[i % colors.length]
  };
});

function generateTitle(id, type) {
  const titles = {
    "mouse-idle": "Только если ты не дышишь",
    "confirm-digit": "Ты уверен?",
    "reverse": "Введи в обратном порядке",
    "voice": "Скажи вслух",
    "future": "Номер из будущего",
    "lie-detector": "Мы знаем, когда ты лжёшь",
    "timer": "Успей за 3 секунды",
    "duplicate": "Отправь 100 раз",
    "dark": "Выключи свет",
    "fake-success": "Форма лжёт",
    "depression": "Форма в депрессии",
    "thought": "Форма читает мысли",
    "time-code": "Номер = время в секундах",
    "chase-button": "Поймай кнопку",
    "iq": "Номер = твой IQ",
    "breathe": "Перестань дышать",
    "captcha": "Я не робот",
    "shake": "Трясущаяся форма",
    "underwater": "Под водой",
    "soul": "Ты и есть номер"
  };
  return titles[type] || `Круг ${id}`;
}

function generateDesc(id, type) {
  const descs = {
    "mouse-idle": "Перестань двигать мышкой на 3 секунды — и форма активируется.",
    "confirm-digit": "Каждая цифра требует подтверждения.",
    "reverse": "Введи номер с конца.",
    "voice": "Произнеси номер вслух. Мы «услышим».",
    "future": "Введи номер, которого ещё не существует.",
    "lie-detector": "Если вводишь быстро — ты врешь.",
    "timer": "Форма исчезает через 3 секунды.",
    "duplicate": "Каждая отправка создаёт копию формы.",
    "dark": "Форма работает только в темноте.",
    "fake-success": "Форма говорит «успех», но ничего не делает.",
    "depression": "Форма не хочет принимать номер.",
    "thought": "Мы уже знаем твой номер. Или нет.",
    "time-code": "Введи текущее время в формате ЧЧММСС.",
    "chase-button": "Кнопка убегает при наведении.",
    "iq": "Введи 3 цифры. Если это твой IQ — поверили.",
    "breathe": "Ты не должен дышать при вводе.",
    "captcha": "Напиши 'Я не робот', чтобы продолжить.",
    "shake": "Кнопки трясутся на мобильных.",
    "underwater": "Поле под слоем воды.",
    "soul": "Ты не вводишь номер. Ты и есть номер."
  };
  return descs[type] || "Это ад. Просто вводи.";
}

// Генерация форм
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("circles-container");

  circles.forEach((circle) => {
    const div = document.createElement("div");
    div.classList.add("circle");
    div.innerHTML = `
      <h2 style="color: ${circle.color}">${circle.id}. ${circle.title}</h2>
      <p>${circle.description}</p>
      <input type="tel" id="num${circle.id}" placeholder="Введите номер">
      <button id="btn${circle.id}">Отправить</button>
    `;
    container.appendChild(div);

    setupLogic(circle);
  });

  // Звук ада (включается при прокрутке)
  const sound = new Audio("https://cdn.pixabay.com/audio/2021/08/18/audio_8e3f3d1a4f.mp3");
  let soundPlayed = false;
  window.addEventListener("scroll", () => {
    if (!soundPlayed) {
      sound.play().catch(() => console.log("Автовоспроизведение запрещено"));
      soundPlayed = true;
    }
  }, { once: true });

  // Вибрация на мобильных
  if ('vibrate' in navigator) {
    navigator.vibrate(200);
  }

  // Эффект зависания
  setInterval(() => {
    if (Math.random() < 0.05) {
      document.body.style.animation = "none";
      document.body.offsetHeight;
      document.body.style.animation = "shake-bg 0.5s";
      setTimeout(() => {
        document.body.style.animation = "none";
      }, 500);
    }
  }, 10000);
});

function setupLogic(circle) {
  const input = document.getElementById(`num${circle.id}`);
  const button = document.getElementById(`btn${circle.id}`);

  // Примеры логики
  if (circle.type === "confirm-digit") {
    input.addEventListener("input", (e) => {
      const last = e.target.value.slice(-1);
      if (/[0-9]/.test(last) && !confirm(`Ты точно хочешь ввести "${last}"?`)) {
        e.target.value = e.target.value.slice(0, -1);
      }
    });
  }

  if (circle.type === "chase-button") {
    button.onmouseover = () => {
      button.style.position = "relative";
      button.style.left = Math.random() * 200 - 100 + "px";
      button.style.top = Math.random() * 50 - 25 + "px";
    };
  }

  if (circle.type === "timer") {
    setTimeout(() => {
      input.disabled = true;
      button.disabled = true;
      button.textContent = "Время вышло";
    }, 3000);
  }

  if (circle.id % 3 === 0) {
    button.classList.add("shake"); // Трясущиеся кнопки
  }

  button.onclick = () => {
    if (circle.type === "fake-success") {
      alert("Отправлено!");
      setTimeout(() => alert("Ой, ошибка сети."), 600);
    } else if (circle.type === "depression") {
      alert("Я не хочу. Уходи.");
    } else {
      alert(`Круг ${circle.id}: Вы провалились.`);
    }
  };
}

// Анимации
const style = document.createElement("style");
style.textContent = `
  @keyframes shake-bg {
    0%, 100% { filter: blur(0); }
    50% { filter: blur(1px); }
  }
`;
document.head.appendChild(style);
