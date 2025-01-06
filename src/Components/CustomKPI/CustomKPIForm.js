import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Select,
  MenuItem,
  Button,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { getKpiClassInstance } from "../../store/main/actions";
import { connect } from "react-redux";
import Autocomplete from '@mui/material/Autocomplete';

const operations = ["+", "-", "*", "/", "**"];
const aggregationFunctions = ["sum", "mean", "std", "var", "max", "min"];

const CustomKPIForm = ({ handleSetFormula, getKpiClassInstance, kpiClassInstane }) => {
  const [rows, setRows] = useState([
    { type: "kpi", value: "", operation: "", isGrouped: false },
  ]);
  const [kpiList, setKpiList] = useState([]);
  const [aggregation, setAggregation] = useState(""); // Store selected aggregation type

  const handleAddRow = (type) => {
    const newRow =
      type === "custom"
        ? { type: "custom", value: "", operation: "", isGrouped: false }
        : { type: "kpi", value: "", operation: "", isGrouped: false };
    setRows([...rows, newRow]);

    // Automatically select the first aggregation if adding a custom row
    if (type === "custom" && !aggregation) {
      setAggregation(aggregationFunctions[0]);
    }
  };

  const handleRemoveRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const toggleGroup = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].isGrouped = !updatedRows[index].isGrouped;
    setRows(updatedRows);
  };

  const handleReRender = () => {
    let formula = "";
    let isOpen = false;

    rows.forEach((row, index) => {
      // Open parenthesis if this row is grouped and it's not already open
      if (row.isGrouped && !isOpen) {
        formula += "(";
        isOpen = true;
      }

      formula += row.value;

      // Check if this row is not the last in the group
      const nextRow = rows[index + 1];
      if (nextRow && nextRow.isGrouped) {
        formula += " ";
      }

      // If we reach the end of the group, close the parenthesis
      if (isOpen && (!nextRow || !nextRow.isGrouped)) {
        formula += ")";
        isOpen = false;
      }

      // Add operation if this is not the last row
      if (index < rows.length - 1) {
        formula += ` ${row.operation} `;
      }
    });

    // Wrap the whole formula with the selected aggregation function
    if (aggregation) {
      formula = `${aggregation}(${formula.trim()})`;
    }

    handleSetFormula(formula.trim());
  };

  useEffect(() => {
    handleReRender();
    // eslint-disable-next-line
  }, [rows, aggregation]);

  useEffect(() => {
    setKpiList(kpiClassInstane || []);
    // eslint-disable-next-line
  }, [kpiClassInstane]);

  useEffect(() => {
    getKpiClassInstance({ label: "kpi" });
    // eslint-disable-next-line
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        {/* Aggregation Dropdown */}
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Choose the machine-operation aggregation function
          </Typography>
          <Select
            value={aggregation}
            onChange={(e) => setAggregation(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Select Aggregation
            </MenuItem>
            {aggregationFunctions.map((agg) => (
              <MenuItem key={agg} value={agg}>
                {agg}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ mt: 4 }}>
          {rows.map((row, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              {/* Hide Group in Parentheses for the last added row */}
              {index !== rows.length - 1 && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={row.isGrouped}
                      onChange={() => toggleGroup(index)}
                      color="primary"
                    />
                  }
                  label="Group in Parentheses"
                />
              )}

              {row.type === "kpi" ? (
                <Autocomplete
                  value={row.value}
                  onChange={(event, newValue) => handleRowChange(index, "value", newValue)}
                  options={kpiList}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select KPI"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                  fullWidth
                  disableClearable
                />
              ) : (
                <TextField
                  type="number"
                  placeholder="Enter a custom number"
                  value={row.value}
                  onChange={(e) => handleRowChange(index, "value", e.target.value)}
                  fullWidth
                />
              )}

              {/* Show operation only if this is not the last row */}
              {index < rows.length - 1 && (
                <Select
                  value={row.operation}
                  onChange={(e) => handleRowChange(index, "operation", e.target.value)}
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Select Operation
                  </MenuItem>
                  {operations.map((op) => (
                    <MenuItem key={op} value={op}>
                      {op}
                    </MenuItem>
                  ))}
                </Select>
              )}

              {/* Button or Placeholder for Alignment */}
              {rows.length > 1 ? (
                <IconButton
                  onClick={() => handleRemoveRow(index)}
                  color="error"
                  disabled={rows.length === 1}
                >
                  <Remove />
                </IconButton>
              ) : (
                <Box sx={{ width: 40, height: 40 }} /> // Placeholder for alignment
              )}
            </Box>
          ))}

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => handleAddRow("kpi")}
              startIcon={<Add />}
            >
              Add KPI
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleAddRow("custom")}
              startIcon={<Add />}
            >
              Add Custom Number
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

const mapStatetoProps = ({ main }) => ({
  kpiClassInstane: main.kpiClassInstane?.instances || [],
  loading: main.loading,
});

export default connect(mapStatetoProps, { getKpiClassInstance })(CustomKPIForm);
