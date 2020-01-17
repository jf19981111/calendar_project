# 关于react项目中日历插件

- 思路: （当前面板）
1. 需要计算对应每一年的天数，其中需要根据年份来判断 2月份的天数 是 28 | 29
2. 计算出这个月的第一天是星期几，来决定前面应该会有多少上个月的空格以及根据天数来判断月后应该有多少天来弥补

- 渲染思路：
1. 分别需要存有上个月、当前月、下个月所对应的天数的数组

```js
    /**
     * 默认的属性
     */
    getDefaultProps() {
        return {
            row_number : 6,
            col_number : 7
        }
    },

    /**
     * 给月份数组附上每月天数
     * @param year 年份
     * @private
     */
    _initMonthDayNumber(year) {
        let _date_array = [];

        for (var i = 0; i < 12; i++) {
            switch (i + 1) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    _date_array.push(31);
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    _date_array.push(30);
                    break;
                case 2:
                    if (H.isLeapYear(year)) {
                        _date_array.push(29);
                    } else {
                        _date_array.push(28);
                    }
                    break;
                default:
                    break;
            }
        }

        return _date_array;
    },

    /**
     * 组件将要挂载
     * 设置月份数组以及计算出每月的第一天星期几
     */
    componentWillMount() {
        let date_num_array = this._initMonthDayNumber(this.state.current_year),
            first_day = H.weekOfMonth();

        this.setState({date_num_array : date_num_array, first_day : first_day});
    },

    /**
     * 日期选择
     * @param s_day
     */
    selectDate(s_day) {
        let { select_year, select_month} = this.state;
        this.setState({
            history_year : select_year,
            history_month : select_month,
            history_day : s_day,
            select_day : s_day
        }, () => {
            this.props.onSelectDate(select_year, select_month + 1, s_day);
        });
    },

    /**
     * 前一个月
     */
    previousMonth() {
        let { current_year, current_month, current_day,
            select_year, select_month, select_day, date_num_array, first_day} = this.state;

        if (select_month === 0) {
            select_year = +select_year - 1;
            select_month = 11;
            date_num_array = this._initMonthDayNumber(select_year);
        } else {
            select_month = +select_month - 1;
        }

        first_day = H.weekOfMonth(new Date(select_year, select_month));

        if (current_year === select_year &&
            current_month === select_month) {
            select_day = current_day;
        } else {
            select_day = undefined;
        }

        this.setState({
            select_year : select_year,
            select_month : select_month,
            select_day : select_day,
            date_num_array : date_num_array,
            first_day : first_day
        })
    },

    /**
     * 之后一个月
     */
    nextMonth() {
        let { current_year, current_month, current_day,
            select_year, select_month, select_day, date_num_array, first_day} = this.state;

        if (select_month === 11) {
            select_year = +select_year + 1;
            select_month = 0;
            date_num_array = this._initMonthDayNumber(select_year);
        } else {
            select_month = +select_month + 1;
        }

        first_day = H.weekOfMonth(new Date(select_year, select_month));

        if (current_year === select_year &&
            current_month === select_month) {
            select_day = current_day;
        } else {
            select_day = undefined;
        }

        this.setState({
            select_year : select_year,
            select_month : select_month,
            select_day : select_day,
            date_num_array : date_num_array,
            first_day : first_day
        })
    },

// state


        let { row_number, col_number, tags } = this.props;
        let { current_year, current_month, current_day,
            select_year, select_month, select_day,
            history_year, history_month, history_day,
            date_num_array, first_day} = this.state;

        let month_day = date_num_array[select_month],
            n_day = row_number * col_number - first_day - month_day,
            previous_month_days = undefined,
            previous_days = [],
            current_days = [],
            next_days = [],
            total_days = [],
            previous_month = undefined;

        if (select_month === 0) {
            previous_month = 11;
        } else {
            previous_month = select_month - 1;
        }

        previous_month_days = date_num_array[previous_month];
        for (let i = 0; i < first_day; i++) {
            let previous_link = (<li className="item-gray" key={'previous'+i}>
                <a href="javascript:;">{previous_month_days - (first_day - i) + 1}</a>
            </li>);
            previous_days.push(previous_link);
        }

        let currentClassName = '',
            currentText = '';
        for (let i = 0; i < month_day; i++) {

            // 今天样式
            if (current_year == select_year && current_month == select_month && current_day == (i + 1)) {
                currentClassName = 'item-current';
                currentText = '今天';
            } else {
                currentText = i + 1;

                // 判断选择样式与历史样式是否相等，相等激活
                if (select_year == history_year && select_month == history_month && history_day == (i + 1)) {
                    currentClassName = 'item-active';
                } else {
                    currentClassName = '';
                }
            }

            // 添加tag样式
            if (tags.length > 0) {
                for (let j = 0; j < tags.length; j++) {
                    if ((i + 1) === tags[j]) {
                        currentClassName += 'item-tag';
                        break;
                    }
                }
            }

            let current_link = (<li className={currentClassName} key={'current'+i}>
                <a href="javascript:;" onClick={this.selectDate.bind(this, i + 1)}>
                    {currentText}
                </a>
            </li>);
            current_days.push(current_link);
        }

        for (let i = 0; i < n_day; i++) {
            let next_link = (<li className="item-gray" key={'next'+i}>
                <a href="javascript:;">{i + 1}</a>
            </li>);
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