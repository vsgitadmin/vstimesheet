import { useState } from 'react';

const YearMonthSelector = ({ handleYearChange, handleMonthChange , year , month }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1,  label: 'January'   },
    { value: 2,  label: 'February'  },
    { value: 3,  label: 'March'     },
    { value: 4,  label: 'April'     },
    { value: 5,  label: 'May'       },
    { value: 6,  label: 'June'      },
    { value: 7,  label: 'July'      },
    { value: 8,  label: 'August'    },
    { value: 9,  label: 'September' },
    { value: 10, label: 'October'   },
    { value: 11, label: 'November'  },
    { value: 12, label: 'December'  },
  ];

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const onYearChange = e => {
    const y = e.target.value;
    setSelectedYear(y);
    handleYearChange(Number(y));
  };

  const onMonthChange = e => {
    const m = e.target.value;
    setSelectedMonth(m);
    handleMonthChange(Number(m));
  };

  return (
    <>
      <select
        value={selectedYear}
        className="year_select_dropdown"
        defaultValue={year}
        onChange={onYearChange}
      >
        <option value="" disabled>Select Year</option>
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select
        value={selectedMonth}
        className="year_select_dropdown"
        onChange={onMonthChange}
        defaultValue={month}
      >
        <option value="" disabled>Select Month</option>
        {months.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </>
  );
};

export default YearMonthSelector;
