// ================================
// HTML ELEMENTS
// ================================

// Главные экраны и поле ввода
const menuSection = document.getElementById("firstMenuSection");
const gameSection = document.getElementById("startGame");
const menuButton = document.getElementById("firstMenuButton");
const input = document.getElementById("input");
const terminal = document.getElementById("terminalDiv");

// Элементы списка заданий
const task1 = document.getElementById("t1");
const task2 = document.getElementById("t2");
const task3 = document.getElementById("t3");
const task4 = document.getElementById("t4");
const task5 = document.getElementById("t5");


// ================================
// AVAILABLE COMMANDS
// ================================

// Список всех доступных команд терминала
const commands = new Set([
    "------------------------",
    "/radioplayrestart",
    "/radioplayon",
    "/radioplayoff",
    "/radioplaypause",
    "/radioplaytwominuteforward",
    "/radioplaytwominuteback",
    "-----------",
    "/instructions",
    "/specifications",
    "/help",
    "/clear",
    "/time",
    "/copy",
    "/paste",
    "-------",
    "/task1",
    "/task2",
    "/task3",
    "/task4",
    "/task5",
    "----------------",
    "|"
]);


// ================================
// TASK DATABASE
// ================================

// Задания сгруппированы по номерам.
// В первой группе находятся математические задачи.
// Остальные группы пока содержат тестовые значения.
const tasks = {
    tasks_1: [
        {
            type: "math",
            question: "CALCULATE: 17*4",
            answer: "68"
        },
        {
            type: "",
            question: "",
            answer: ""
        },
        {
            type: "",
            question: "",
            answer: ""
        }
    ],

    tasks_2: ["11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
    tasks_3: ["21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],
    tasks_4: ["41", "42", "43", "44", "45", "46", "47", "48", "49", "50"],
    tasks_5: ["51", "52", "53", "54", "55", "56", "57", "58", "59", "60"]
};


// ================================
// GAME VARIABLES
// ================================

// Аудиофайл радиоприёмника
const radio = new Audio("/Инструменты/Аудио/Нашиды/финальная_версия.mp3");

// Set хранит номера уже выполненных заданий
const completedTasks = new Set();

// Игровое время
let time = 0;

// Объект текущего задания
let currentTask = null;

// Переменные для дополнительных механик
let copyPaste = null;
let secretCode;

// Номер активного задания.
// null означает, что игрок сейчас не решает задание.
let userTask = null;

// Текущий ввод игрока
let userInput = "";


// ================================
// TERMINAL OUTPUT
// ================================

// Добавляет новую строку в терминал
function createText(text) {
    const newText = document.createElement("p");
    newText.textContent = text;

    terminal.appendChild(newText);

    // Автоматически прокручивает терминал к последнему сообщению
    terminal.scrollTop = terminal.scrollHeight;
}


// ================================
// RANDOM NUMBER
// ================================

// Возвращает случайное целое число в заданном диапазоне
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// ================================
// RANDOM TASK SELECTION
// ================================

// Выбирает случайный элемент массива
function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}


// Выбирает случайное задание из указанной группы
function randomTasks(taskNumber) {
    const currentArray = tasks[`tasks_${taskNumber}`];

    // Проверяем, существует ли такая группа заданий
    if (!currentArray) {
        createText("ERROR: task not found");
        createText("|");
        return;
    }

    const randomTask = getRandomElement(currentArray);

    // Сохраняем выбранное задание
    currentTask = randomTask;

    // Выводим условие задания
    if (typeof currentTask === "object") {
        createText(`Your task: ${currentTask.question}`);
    } else {
        createText(`Your task: ${currentTask}`);
    }

    createText("|");
}


// ================================
// CLIPBOARD
// ================================

// Копирует текст в буфер обмена
async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log(`Текст успешно скопирован:\n\n"${text}"`);
    } catch {
        console.log("Ошибка копии текста");
        createText("ERROR: text not copying");
        createText("|");
    }
}


// Вставляет текст из буфера обмена
async function pasteText() {
    try {
        const text = await navigator.clipboard.readText();
        console.log(`Текст успешно вставлен:\n\n"${text}"`);
        return text;
    } catch {
        console.log("Ошибка вставки текста");
        createText("ERROR: text not pasting");
        createText("|");
    }
}


// ================================
// START GAME
// ================================

// Скрывает меню и показывает игровой экран
menuButton.addEventListener("click", () => {
    menuSection.style.display = "none";
    gameSection.style.display = "block";
});


// ================================
// COMMAND INPUT
// ================================

input.addEventListener("keydown", function(event) {
    // Обрабатываем ввод только при нажатии Enter
    if (event.key !== "Enter") {
        return;
    }

    // Получаем ввод, убираем пробелы по краям и переводим в нижний регистр
    userInput = input.value.trim().toLowerCase();

    // Показываем введённую команду в истории терминала
    createText(`user: ${userInput}`);

    // Очищаем поле ввода
    input.value = "";

    createText("|");


    // ================================
    // RADIO COMMANDS
    // ================================

    // Включает радио с начала
    if (userInput === "/radioplayon") {
        radio.play();

        console.log("Радио включено");
        createText("terminal: radio is on");
        createText("|");
    }

    // Ставит радио на паузу
    if (userInput === "/radioplaypause") {
        radio.pause();

        console.log("Радио на паузе");
        createText("terminal: radio is paused");
        createText("|");
    }

    // Выключает радио и сбрасывает позицию воспроизведения
    if (userInput === "/radioplayoff") {
        radio.pause();
        radio.currentTime = 0;

        console.log("Радио выключено");
        createText("terminal: radio is off");
        createText("|");
    }

    // Перезапускает воспроизведение
    if (userInput === "/radioplayrestart") {
        radio.pause();
        radio.currentTime = 0;
        radio.play();

        console.log("Радио перезапущено");
        createText("terminal: radio is restart");
        createText("|");
    }

    // Перематывает радио на две минуты вперёд
    if (userInput === "/radioplaytwominuteforward") {
        radio.currentTime += 120;

        console.log("Радио перемотано на две минуты вперед");
        createText("terminal: radio is two minute forward");
        createText("|");
    }

    // Перематывает радио на две минуты назад
    if (userInput === "/radioplaytwominuteback") {
        radio.currentTime = Math.max(0, radio.currentTime - 120);

        console.log("Радио перемотано на две минуты назад");
        createText("terminal: radio is two minute back");
        createText("|");
    }


    // ================================
    // HELP COMMAND
    // ================================

    // Показывает список команд
    if (userInput === "/help") {
        createText("All commands:");
        createText("|");

        for (const command of commands) {
            createText(command);
        }

        console.log("Все команды показаны");
    }


    // ================================
    // CLEAR COMMAND
    // ================================

    // Очищает историю терминала
    if (userInput === "/clear") {
        terminal.innerHTML = "";

        createText("terminal: terminal is cleared");
        createText("|");

        console.log("Терминал очищен");
    }


    // ================================
    // TIME COMMAND
    // ================================

    // Показывает текущее игровое время
    if (userInput === "/time") {
        createText(`terminal: time: ${String(time).padStart(2, "0")}:00`);

        console.log("Время показано");
        createText("|");
    }


    // ================================
    // SPECIFICATIONS COMMAND
    // ================================

    // Выводит характеристики терминала
    if (userInput === "/specifications") {
        createText("terminal:");
        createText("==================================================");
        createText("        TERRA-NET INDUSTRIAL TERMINAL v2.1        ");
        createText("==================================================");
        createText("MODEL:      XT-84 BUNKERSYSTEM");
        createText("MFR YEAR:   1984");
        createText("STORAGE:    160 KB; 5.25' MAGNETIC FLOPPY DISK");
        createText("MEMORY:     64 KB RAM");
        createText("DISPLAY:    12 CATHODE RAY TUBE GREEN PHOSPHOR");
        createText("AUDIO:      INTEGRATED AM/FM RADIO RECEIVER MODULE");
        createText("==================================================");
        createText("|");
    }


    // ================================
    // INSTRUCTIONS COMMAND
    // ================================

    // Показывает инструкции по прохождению игры
    if (userInput === "/instructions") {
        createText("terminal:");
        createText("=================================================================================");
        createText("      1. Enter help to see all available commands.");
        createText("      2. Complete tasks using the `task` command before 06:00 to win.");
        createText("      3. In total, you need to complete 5 tasks.");
        createText("      4. For each task, you will receive one digit of the code.");
        createText("      5. Once you have completed all 5 tasks, assemble the code.");
        createText("      6. Once the code has been built, enter it into the terminal.");
        createText("      7. This way, you will get a set of secret commands.");
        createText("=================================================================================");
        createText("|");
    }


    // ================================
    // TASK COMMANDS
    // ================================

    // Проверяем, пытается ли игрок запустить задание
    if (userInput.startsWith("/task")) {
        // Получаем номер задания из команды, например /task1 -> "1"
        const number = userInput.replace("/task", "");

        // Проверяем, что команда действительно существует
        if (!commands.has(userInput) ||
            !["1", "2", "3", "4", "5"].includes(number)) {
            createText("ERROR: command not found");
            createText("|");
        }

        // Не разрешаем повторно запускать выполненное задание
        else if (completedTasks.has(number)) {
            createText("ERROR: task already completed");
            createText("|");
        }

        // Не разрешаем запускать новое задание, пока предыдущее активно
        else if (userTask !== null) {
            createText("ERROR: finish your current task first");
            createText("|");
        }

        // Запускаем задание, если проверки пройдены
        else {
            randomTasks(number);

            // Сохраняем номер активного задания
            userTask = number;
        }
    }


    // ================================
    // ANSWER CHECKING
    // ================================

    // Проверяем ответы только тогда, когда игрок решает задание
    // и ввод не является командой
    if (userTask !== null && !userInput.startsWith("/")) {
        // В первой группе заданий ответы хранятся в объектах
        if (currentTask && typeof currentTask === "object") {

            // Неправильный ответ
            if (userInput !== currentTask.answer) {
                createText("ERROR: answer is wrong");
                createText("|");
            }

            // Правильный ответ
            else {
                createText("ANSWER IS CORRECT");
                createText("|");

                // Генерируем цифру секретного кода
                const codeDigit = randomNumber(0, 9);

                createText(`Number from secret code: ${codeDigit}`);
                createText("|");

                // Запоминаем выполненное задание
                completedTasks.add(userTask);

                // Меняем цвет соответствующего пункта списка
                if (userTask === "1") {
                    task1.style.color = "#0c573b";
                } else if (userTask === "2") {
                    task2.style.color = "#0c573b";
                } else if (userTask === "3") {
                    task3.style.color = "#0c573b";
                } else if (userTask === "4") {
                    task4.style.color = "#0c573b";
                } else if (userTask === "5") {
                    task5.style.color = "#0c573b";
                }

                // Сбрасываем активное задание
                userTask = null;
                currentTask = null;
            }
        } else {
            // В группах 2–5 пока находятся тестовые строки,
            // поэтому полноценная проверка ответов для них не реализована.
            createText("ERROR: this task type is not configured");
            createText("|");
        }
    }


    // ================================
    // UNKNOWN COMMANDS AND INPUT
    // ================================

    // Неизвестные команды со слешем
    if (userInput.startsWith("/") && !commands.has(userInput)) {
        createText("ERROR: Command not found");
        createText("|");
    }

    // Неизвестный обычный текст, если игрок не решает задание
    else if (
        !userInput.startsWith("/") &&
        userTask === null &&
        userInput !== "" &&
        !["68", "41", "27"].includes(userInput)
    ) {
        // Проверка выше исключает известные ответы первой группы,
        // чтобы они не воспринимались как неизвестные команды.
        // В дальнейшем это условие лучше заменить общей проверкой
        // после разделения обработки команд и ответов.
        if (!commands.has(userInput)) {
            createText("ERROR: Command not found");
            createText("|");
        }
    }


    // Очищаем переменную ввода после обработки команды
    userInput = "";
});