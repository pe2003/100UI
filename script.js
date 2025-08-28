const circles = [];

// Генерация 100 уникальных форм
for (let i = 1; i <= 100; i++) {
  circles.push({
    id: i,
    ...getCircleConfig(i)
  });
}

function getCircleConfig(id) {
  const configs = {
    1: () => ({
      title: "Только с зажатой Q",
      desc: "Держи клавишу Q, чтобы ввести номер.",
      setup: (input, button) => {
        let qPressed = false;
        document.addEventListener('keydown', (e) => qPressed = e.key === 'q' || e.key === 'Q');
        document.addEventListener('keyup', (e) => qPressed = e.key !== 'q' && e.key !== 'Q');
        input.addEventListener('focus', () => {
          if (!qPressed) input.disabled = true;
          const check = setInterval(() => {
            input.disabled = !qPressed;
          }, 100);
          input.onblur = () => clearInterval(check);
        });
      }
    }),

    2: () => ({
      title: "Пазл: собери номер",
      desc: "Перетащи цифры в правильный порядок.",
      input: false,
      extra: `
        <div class="puzzle" id="puzzle2"></div>
        <button id="submit2">Собрал</button>
      `,
      setup: () => {
        const nums = ['+', '3', '7', '5', ' ', '2', '9', '-', '1', '2', '3'];
        nums.sort(() => Math.random() - 0.5);
        const puzzle = document.getElementById('puzzle2');
        nums.forEach(n => {
          const span = document.createElement('span');
          span.textContent = n;
          span.draggable = true;
          span.ondragstart = (e) => e.dataTransfer.setData('text', n);
          puzzle.appendChild(span);
        });
        document.getElementById('submit2').onclick = () => alert('Пазл собран... но это не номер.');
      }
    }),

    3: () => ({
      title: "Нажми 100 раз",
      desc: "Кликни 100 раз, чтобы активировать поле.",
      setup: (input, button) => {
        let clicks = 0;
        input.disabled = true;
        button.onclick = () => {
          clicks++;
          button.textContent = `Клик ${clicks}/100`;
          if (clicks >= 100) {
            input.disabled = false;
            button.textContent = "Отправить";
            button.onclick = () => alert("Ты прошёл... но номер не нужен.");
          }
        };
      }
    }),

    4: () => ({
      title: "Только в движении",
      desc: "Вводи, пока двигаешь мышкой.",
      setup: (input) => {
        let moving = false;
        document.addEventListener('mousemove', () => moving = true);
        setInterval(() => {
          moving = false;
          setTimeout(() => { if (!moving) input.disabled = true; }, 500);
        }, 1000);
        input.addEventListener('focus', () => {
          const check = setInterval(() => {
            input.disabled = !moving;
          }, 200);
          input.onblur = () => clearInterval(check);
        });
      }
    }),

    5: () => ({
      title: "Голосом!",
      desc: "Произнеси номер вслух. Мы 'услышим'.",
      setup: (input) => {
        input.placeholder = "Скажи: +375...";
        input.onclick = () => alert("Мы не слышим. Но ты должен верить.");
      }
    }),

    // Продолжаем до 100...
    // Примеры уникальных:
    6: () => ({ title: "Форма в зеркале", desc: "Вводи номер, глядя на отражение", style: "transform: scaleX(-1);" }),
    7: () => ({ title: "Только на мобильном", desc: "Десктоп? Увы.", mobileOnly: true }),
    8: () => ({ title: "Номер = твой рост", desc: "Введи свой рост в см", inputLabel: "Рост (см)" }),
    9: () => ({ title: "Кнопка — в другом измерении", desc: "Кнопка появляется при моргании", blink: true }),
    10: () => ({ title: "Ты уже ввёл", desc: "Форма говорит, что всё готово", prefill: "+375 (29) 999-99-99 ✓" }),

    // ... и так до 100
  };

  // Если есть кастомная конфигурация — используем
  if (configs[id]) return configs[id]();

  // Иначе — генерим уникальную
  return {
    title: `Круг ${id}: Уникальная пытка #${id}`,
    desc: [
      "Вводи, не касаясь клавиатуры.",
      "Номер = количество букв в этом описании.",
      "Форма активируется при полной тишине.",
      "Ты должен ввести номер… но поле — это фон.",
      "Форма знает, что ты лжёшь.",
      "Ты не человек. Ты — бот. Докажи обратное.",
      "Номер = хэш твоего сердцебиения.",
      "Ты должен ввести номер… но только левой ногой.",
      "Форма читает мысли… и врёт.",
      "Ты уже в аду. Номер не спасёт."
    ][id % 10],
    setup: (input, button) => {
      button.onclick = () => alert(`Круг ${id}: Ты проиграл.`);
    }
  };
}

// Генерация форм
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("circles-container");
  const sound = document.getElementById("hell-sound");

  let soundPlayed = false;
  window.addEventListener("scroll", () => {
    if (!soundPlayed) {
      sound.play().catch(() => console.log("Автовоспроизведение запрещено"));
      soundPlayed = true;
    }
  }, { once: true });

  circles.forEach(circle => {
    const div = document.createElement("div");
    div.classList.add("circle");
    if (circle.style) div.style.cssText = circle.style;

    const inputHtml = circle.input === false ? '' : `
      <input type="tel" id="num${circle.id}" placeholder="Введите номер" ${circle.prefill ? 'value="' + circle.prefill + '"' : ''}>
    `;
    const buttonHtml = `<button id="btn${circle.id}">Отправить</button>`;

    div.innerHTML = `
      <h2>${circle.title} <span>№${circle.id}</span></h2>
      <p>${circle.desc}</p>
      ${inputHtml}
      ${circle.extra || ''}
      ${buttonHtml}
    `;

    container.appendChild(div);

    const input = document.getElementById(`num${circle.id}`);
    const button = document.getElementById(`btn${circle.id}`);

    if (circle.setup) {
      circle.setup(input, button);
    } else {
      button.onclick = () => alert(`Круг ${circle.id}: Вы провалились.`);
    }

    if (input && !input.disabled && !button.onclick.toString().includes('alert')) {
      button.onclick = () => alert(`Круг ${circle.id}: Номер не принят. Ты в аду.`);
    }
  });

  // Вибрация на мобильных
  if ('vibrate' in navigator) {
    navigator.vibrate(100);
  }
});
