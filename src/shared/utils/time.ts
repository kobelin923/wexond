export const getTimePeriod = (hours: number, format: 24 | 12) => {
  if (format === 12) {
    return hours > 12 ? ' PM' : ' AM';
  }
  return '';
};

export const formatTime = (
  date?: Date,
  timeUnit: 24 | 12 = 24,
  minutes: boolean = true,
) => {
  if (date == null) date = new Date();

  let hours = date.getHours();
  const timePeriod = getTimePeriod(hours, timeUnit);

  if (timeUnit === 12 && hours > 12) {
    hours -= 12;
  }

  const mins = minutes
    ? date
        .getMinutes()
        .toString()
        .padStart(2, '0')
    : '';

  return `${hours.toString().padStart(2, '0')}${
    mins ? ':' : ''
  }${mins}${timePeriod}`;
};

export const getDayIndex = (date: Date) =>
  date.getDay() === 0 ? 6 : date.getDay() - 1;

const getOperator = (condition: string) => {
  const operators = ['=', '<', '>'];

  for (let i = 0; i < operators.length; i++) {
    if (condition.indexOf(operators[i]) !== -1) {
      return operators[i];
    }
  }

  return null;
};

export const getConditionsTime = (time: number, conditions: any) => {
  if (typeof conditions === 'object') {
    const keys = Object.keys(conditions);

    for (let i = 0; i < keys.length; i++) {
      const condition = keys[i].replace('x', time.toString());
      const operator = getOperator(condition);
      const parts = condition.split(operator);

      if (operator != null) {
        const firstSide = parseInt(parts[0], 10);
        const secondSide = parseInt(parts[1], 10);

        if (
          (operator === '<' && firstSide < secondSide) ||
          (operator === '>' && firstSide > secondSide) ||
          (operator === '=' && firstSide === secondSide)
        ) {
          return conditions[keys[i]];
        }
      }
    }
  }

  return conditions;
};

export const getTimeOffset = (dictionary: any, date: Date) => {
  const { dateAndTime } = dictionary;
  const currentdate = new Date();
  const diff = new Date(currentdate.getTime() - date.getTime());

  const hours = diff.getHours() - 1;
  const minutes = diff.getMinutes();
  let value = hours;
  let showHours = true;

  if (hours === 0) {
    if (minutes <= 1) {
      return `${dateAndTime.oneMinute} ${dateAndTime.ago}`;
    }

    showHours = false;
    value = minutes;
  } else if (hours === 1) {
    return `${dateAndTime.oneHour} ${dateAndTime.ago}`;
  }

  return `${value} ${getConditionsTime(
    value,
    showHours ? dateAndTime.hours : dateAndTime.minutes,
  )} ${dateAndTime.ago}`;
};

export const formatDate = (dictionary: any, date: Date) => {
  const { dateAndTime } = dictionary;
  const currentDate = new Date();

  let prefix = '';

  if (date.getDate() === currentDate.getDate()) {
    prefix = `${dateAndTime.today} - `;
  } else if (date.getDate() === currentDate.getDate() - 1) {
    prefix = `${dateAndTime.yesterday} - `;
  }

  const dayName = dateAndTime.days[getDayIndex(date)];
  const monthName = dateAndTime.months[date.getMonth()];

  return `${prefix}${dayName}, ${monthName} ${date.getDate()}, ${date.getFullYear()}`;
};
