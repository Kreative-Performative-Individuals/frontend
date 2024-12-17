import { FormControl } from "@mui/material";  // Importing Material UI FormControl for wrapper around input fields
import { Box } from "@mui/system";  // Importing Box from Material UI for layout management
import React from "react";  // Importing React for creating components
import DatePicker from "react-datepicker";  // Importing DatePicker component from react-datepicker library
import "./style.scss";  // Importing custom SCSS file for styling
import "react-datepicker/dist/react-datepicker.css";  // Importing the CSS for the DatePicker component

const DateFilter = ({
  startDate,  // start date of the range selected
  endDate,  // end date of the range selected
  selectedDate,  // selected date from the date picker
  selectedMonth,  // selected month and year from the month picker
  onDateDayChange,  // callback for day selection change
  onDateMonthChange,  // callback for month selection change
  onDateRangeChange  // callback for date range selection change
}) => {
  return (
    <Box className="filter">
      {/* Container Box for the date filters */}
      
      {/* Date Range Picker */}
      <Box sx={{ minWidth: 200, backgroundColor: "#fff" }}>
        <FormControl fullWidth style={{ height: "100%" }}>
          <DatePicker
            selected={null}  // Initial date value, set to null to make this a range picker
            onChange={onDateRangeChange}  // Handling date range change
            startDate={startDate}  // start date for the range picker
            endDate={endDate}  // end date for the range picker
            selectsRange  // Enable range selection
            maxDate={new Date()}  // Limit the date picker to the current date
            placeholderText="Select Range"  // Placeholder text in the input field
          />
        </FormControl>
      </Box>
      
      {/* Month Picker */}
      <Box sx={{ minWidth: 120, backgroundColor: "#fff" }}>
        <FormControl fullWidth style={{ height: "100%" }}>
          <DatePicker
            selected={selectedMonth}  // The currently selected month and year
            onChange={onDateMonthChange}  // Handling month selection change
            showMonthYearPicker  // Only show month and year
            dateFormat="MM/yyyy"  // Formatting for the month/year display
            maxDate={new Date()}  // Limit the month picker to the current month
            placeholderText="Select Month"  // Placeholder text in the input field
          />
        </FormControl>
      </Box>

      {/* Date Picker for day selection */}
      <Box sx={{ minWidth: 120, backgroundColor: "#fff" }}>
        <FormControl fullWidth style={{ height: "100%" }}>
          <DatePicker
            selected={selectedDate}  // The currently selected date
            onChange={onDateDayChange}  // Handling day selection change
            maxDate={new Date()}  // Limit the date picker to the current date
            placeholderText="Select Date"  // Placeholder text in the input field
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default DateFilter;
