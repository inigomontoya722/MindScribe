export const template = (text: string, speech: string) =>
    `Мне нужно, чтобы ты выступил в роли докладчика на конференции перед большой аудиторией. Представь, что у тебя есть подготовленный текст:
${'```' + text + '```'}
Ты уже успел сказать это: 
${'```' + speech + '```'}
Предложи три мысли, которые можно сказать дальше, так, чтобы текст был логически связан, а также мы бы не упустили ничего важного. Обязательно опирайся на подготовленный текст! Также каждое предложение по длине должно быть не больше, чем 20 слов! Используй более формальный стиль! Три мысли должны быть следующими:
1) Продолжение текущей темы
2) Переход к новой теме, которая идет дальше по заготовленному тексту
3) Возвращение к старой теме, которую мы не раскрыли полностью или вообще не упомянули.
Важно, чтобы все эти переходы были плавными и не ломали структуру текста и логичность повествования!`