// 当天的日期
export const CURRENTDATE = new Date()

/**
 * 判断是否是闰年
 * @param {String} year 
 * @return {Boolean} true 表示是闰年 false 表示是平年
 */
export const isLeapYear = function (year) {
  let flag = false
  if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
    flag = true
  }
  return flag
}

/**
 * 计算当前月份的天数
 * @param {String} year 年份
 */
export const initMonthDayNumber = function(year) {
  let date_array = [];

  for (var i = 0; i < 12; i++) {
    switch (i + 1) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        date_array.push(31);
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        date_array.push(30);
        break;
      case 2:
        if (isLeapYear(year)) {
          date_array.push(29);
        } else {
          date_array.push(28);
        }
        break;
      default:
        break;
    }
  }

  return date_array;
}

/**
 * 计算出每月的第一天星期几
 */
export const weekOfMonth = function () {
  let y = CURRENTDATE.getFullYear()
  let m = CURRENTDATE.getMonth()
  let myDate = new Date(y, m, '01').getDay()
  return myDate
}