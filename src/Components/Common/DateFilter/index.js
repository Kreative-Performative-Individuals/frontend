import { FormControl } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import DatePicker from "react-datepicker";
import "./style.scss";
import "react-datepicker/dist/react-datepicker.css";

const DateFilter = ({
  startDate,
  endDate,
  selectedDate,
  selectedMonth,
  onDateDayChange,
  onDateMonthChange,
  onDateRangeChange
}) => {
  return (
    <Box className="filter">
      <Box sx={{ minWidth: 200, backgroundColor: "#fff" }}>
        <FormControl fullWidth style={{ height: "100%" }}>
          <DatePicker
            selected={null}
            onChange={onDateRangeChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            maxDate={new Date()}
            placeholderText="Select Range"
          />
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 120, backgroundColor: "#fff" }}>
        <FormControl fullWidth style={{ height: "100%" }}>
          <DatePicker
            selected={selectedMonth}
            onChange={onDateMonthChange}
            showMonthYearPicker
            dateFormat="MM/yyyy"
            maxDate={new Date()}
            placeholderText="Select Month"
          />
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 120, backgroundColor: "#fff" }}>
        <FormControl fullWidth style={{ height: "100%" }}>
          <DatePicker
            selected={selectedDate}
            onChange={onDateDayChange}
            maxDate={new Date()}
            placeholderText="Select Date"
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default DateFilter;
