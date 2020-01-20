import React, { Component } from 'react'
import indexStyles from './calender.less'
import { CURRENTDATE, initMonthDayNumber, weekOfMonth } from '../../components/constant'

export default class CalenderComponent extends Component {

  state = {
    current_year: CURRENTDATE.getFullYear(),
    current_month: CURRENTDATE.getMonth(),
    current_day: CURRENTDATE.getDate(),
    select_year: CURRENTDATE.getFullYear(),
    select_month: CURRENTDATE.getMonth(),
    select_day: CURRENTDATE.getDate(),
    history_year: undefined,
    history_month: undefined,
    history_day: undefined,
    date_num_array: [], // 当前月有多少天的数组
  }

  // 初始化数据
  getInitDatas = () => {
    this.setState({
      current_year: CURRENTDATE.getFullYear(),
      current_month: CURRENTDATE.getMonth(),
      current_day: CURRENTDATE.getDate(),
      select_year: CURRENTDATE.getFullYear(),
      select_month: CURRENTDATE.getMonth(),
      select_day: CURRENTDATE.getDate(),
      history_year: undefined,
      history_month: undefined,
      history_day: undefined,
      date_num_array: []
    })
  }

  /**
 * 默认的属性
 */
  getDefaultProps() {
    return {
      row_number: 6,
      col_number: 7
    }
  }

  /**
 * 组件将要挂载
 * 设置月份数组以及计算出每月的第一天星期几
 */
  componentWillMount() {
    let date_num_array = initMonthDayNumber(this.state.current_year)
    let first_day = weekOfMonth(CURRENTDATE.getFullYear(), CURRENTDATE.getMonth());
    this.setState({ date_num_array: date_num_array, first_day: first_day });
  }

  /**
   * 日期选择
   * @param s_day
   */
  handleSselectCurrentDays(e, s_day) {
    e && e.stopPropagation()
    let { select_year, select_month } = this.state;
    this.setState({
      history_year: select_year,
      history_month: select_month,
      history_day: s_day,
      select_day: s_day,
    }, () => {
      this.props.onSelectDate && this.props.onSelectDate(select_year, select_month + 1, s_day);
    });
  }


  /**
   * 前一个月
   */
  previousMonth = () => {
    let { current_year, current_month, current_day,
      select_year, select_month, select_day, date_num_array, first_day } = this.state;

    if (select_month === 0) {
      select_year = select_year - 1;
      select_month = 11;
      date_num_array = initMonthDayNumber(select_year);
    } else {
      select_month = select_month - 1;
    }

    first_day = weekOfMonth(select_year, select_month);
    if (current_year === select_year &&
      current_month === select_month) {
      select_day = current_day;
    } else {
      select_day = current_day;
    }
    this.setState({
      select_year: select_year,
      select_month: select_month,
      select_day: select_day,
      history_day: select_day,
      history_month: select_month,
      history_year: select_year,
      date_num_array: date_num_array,
      first_day: first_day,
    })
  }

  // 渲染当前的日期面板
  renderCurrentMonthDatePanel = () => {
    let { row_number, col_number, tags } = this.getDefaultProps();
    let { current_year, current_month, current_day,
      select_year, select_month, select_day,
      history_year, history_month, history_day,
      date_num_array, first_day } = this.state;
    let month_day = date_num_array[select_month],
      // 计算下一月份 应该显示多少天
      n_day = row_number * col_number - first_day - month_day,
      previous_month_days = undefined,
      previous_days = [], // 上个月应该显示的天数
      current_days = [], // 当前的天数
      next_days = [], // 下个月应该显示的天数
      total_days = [], // 总天数（从上个月，这个月，下个月，三个数组的总和）
      previous_month = undefined;

    if (select_month === 0) { // 表示是一月 但是取值都要取上个月的
      previous_month = 11;
    } else {
      previous_month = select_month - 1;
    }

    // 是将上个月显示的天数得到
    previous_month_days = date_num_array[previous_month];
    // 因为为0的时候表示星期天
    // first_day == 0 ? first_day = 7 : first_day
    for (let i = 0; i < first_day; i++) {
      // let previous_link = (<li className="item-gray" key={'previous' + i}>
      //   <a href="javascript:;">{previous_month_days - (first_day - i) + 1}</a>
      // </li>);
      let previous_link = (<div className={indexStyles.date_wrapper}><span key={'previous' + i} className={indexStyles.item_gray}>{previous_month_days - (first_day - i) + 1}</span></div>);
      previous_days.push(previous_link);
    }

    let currentClassName = '',
      currentText = '';
    for (let i = 0; i < month_day; i++) {

      // 今天样式
      if (current_year == select_year && current_month == select_month && current_day == (i + 1)) {
        currentClassName = `${indexStyles.item_current}`;
        // currentText = '今天';
        currentText = i + 1;
      } else if (history_year == select_year && history_month == select_month && history_day == (i + 1)) {
        currentClassName = `${indexStyles.item_history}`;
        // currentText = '今天';
        currentText = i + 1;
      }
      else {
        currentText = i + 1;

        // 判断选择样式与历史样式是否相等，相等激活
        if (select_year == history_year && select_month == history_month && history_day == (i + 1)) {
          currentClassName = 'item_active';
        } else {
          currentClassName = '';
        }
      }

      // 添加tag样式
      if (tags && tags.length > 0) {
        for (let j = 0; j < tags.length; j++) {
          if ((i + 1) === tags[j]) {
            currentClassName += 'item_tag';
            break;
          }
        }
      }

      // let current_link = (<li className={currentClassName} key={'current' + i}>
      //   <a href="javascript:;" onClick={this.selectDate.bind(this, i + 1)}>
      //     {currentText}
      //   </a>
      // </li>);
      let current_link = (<div className={indexStyles.date_wrapper}><span onClick={(e) => { this.handleSselectCurrentDays(e, i + 1) }} className={currentClassName} key={'current' + i}>{currentText}</span></div>);
      current_days.push(current_link);
    }

    // 下一个月应该显示的天数
    for (let i = 0; i < n_day; i++) {
      // let next_link = (<li className="item-gray" key={'next' + i}>
      //   <a href="javascript:;">{i + 1}</a>
      // </li>);
      let next_link = (<div className={indexStyles.date_wrapper}><span key={'next' + i} className={indexStyles.item_gray}>{i + 1}</span></div>);
      next_days.push(next_link);
    }

    total_days = previous_days.concat(current_days, next_days);

    let ul_list = [];
    if (total_days.length > 0) {
      for (let i = 0; i < row_number; i++) {
        let li_list = [],
          start_index = i * col_number,
          end_index = (i + 1) * col_number;
        for (let j = start_index; j < end_index; j++) {
          li_list.push(total_days[j]);
        }
        ul_list.push(li_list);
      }
    }
    return ul_list
  }


  render() {
    let ul_list = this.renderCurrentMonthDatePanel()
    return (
      <div>
        <div className={indexStyles.wrapper}>
          {/* 实验看下输出内容是什么 */}
          <div style={{ marginTop: '50px', color: 'tomato', fontWeight: 900, fontSize: '32px' }}>
            {`当前点击的日期是：${this.state.currentSelectDates || ''}号`}
          </div>
          <div className={indexStyles.wrapper_container}>
            <div className={indexStyles.calendar_panel}>
              {/* Input输入框 */}
              <div className={indexStyles.calendar_input_wrap}>
                <input placeholder="请选择日期" />
              </div>
              {/* 日期内容 */}
              <div className={indexStyles.calendar_date_panel}>
                {/* 日期头部 */}
                <div className={indexStyles.calendar_header}>
                  <div style={{ position: 'relative' }}>
                    <a onClick={this.previousMonth} className={`${indexStyles.year_btn} ${indexStyles.prev_year_btn}`} role="button" title="上一年"></a>
                    <span>{`${this.state.select_year} 年 ${this.state.select_month + 1} 月`}</span>
                    <a className={`${indexStyles.year_btn} ${indexStyles.newt_year_btn}`} role="buttom" title="下一年"></a>
                  </div>
                </div>
                {/* date面板 */}
                <div>
                  <div className={indexStyles.calendar_body}>
                    <div className={indexStyles.c_body_head}>
                      <span>日</span>
                      <span>一</span>
                      <span>二</span>
                      <span>三</span>
                      <span>四</span>
                      <span>五</span>
                      <span>六</span>
                    </div>
                    <div className={indexStyles.c_body_content}>
                      {
                        ul_list && ul_list.map((u, index) => {
                          return (<div key={'ul' + index} className={indexStyles.c_content_row}>{u}</div>);
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CalenderComponent.defaultProps = {
  current_year: '', // 当前的年份
  current_month: '', // 当前的月份
  current_day: '', // 当前的天份
  select_year: '', // 选择的年份
  select_month: '', // 选择的月份
  select_day: '', // 选择的天数
  history_day: '', // 历史的天数
  history_month: '', // 历史的月份
  history_year: '', // 历史的年份
}
