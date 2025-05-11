const uk = {
    save: 'Зберегти',
    selectSingle: 'Оберіть дату',
    selectMultiple: 'Оберіть дати',
    selectRange: 'Оберіть період',
    notAccordingToDateFormat: (inputFormat: string) =>
        `Дата має бути у форматі ${inputFormat}`,
    mustBeHigherThan: (date: string) => `Дата має бути пізнішою за ${date}`,
    mustBeLowerThan: (date: string) => `Дата має бути ранішою за ${date}`,
    mustBeBetween: (startDate: string, endDate: string) =>
        `Дата має бути між ${startDate} та ${endDate}`,
    dateIsDisabled: 'Цю дату не можна вибрати',
    previous: 'Назад',
    next: 'Далі',
    typeInDate: 'Введіть дату',
    pickDateFromCalendar: 'Оберіть дату з календаря',
    close: 'Закрити',
    hour: 'Година',
    minute: 'Хвилина',
    year: 'Рік',
    month: 'Місяць',
    day: 'День',
};

export default uk;
