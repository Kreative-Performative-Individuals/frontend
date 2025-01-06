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
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { getKpiClassInstance } from "../../store/main/actions";
import { connect } from "react-redux";

const operations = ["+", "-", "*", "/", "**"];

const CustomKPIForm = ({ handleSetFormula, getKpiClassInstance, kpiClassInstane }) => {

  const [rows, setRows] = useState([
    { type: "kpi", value: "", operation: "", endOfFormula: false },
  ]);

  const [kpiList, setKpiList] = useState([]);

  const handleAddRow = (type) => {
    const newRow =
      type === "custom"
        ? { type: "custom", value: "", operation: "", endOfFormula: false }
        : { type: "kpi", value: "", operation: "", endOfFormula: false };
    setRows([...rows, newRow]);
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

  const handleEndOfFormulaChange = (index, checked) => {
    const updatedRows = [...rows];
    updatedRows[index].endOfFormula = checked;

    if (checked) {
      updatedRows[index].operation = "";
    }

    setRows(updatedRows);
  };

  const handleReRender = () => {
    const formula = rows
      .map((row) =>
        row.endOfFormula
          ? row.value
          : `${row.value} ${row.operation || ""}`
      )
      .join(" ")
      .trim();
    handleSetFormula(formula);
  };

  
  const isEndOfFormulaChecked = rows.some((row) => row.endOfFormula);
  
  useEffect(() => {
    handleReRender();
    // eslint-disable-next-line
  }, [rows]);
  
    useEffect(() => {
        setKpiList(kpiClassInstane);
        // eslint-disable-next-line
    }, [kpiClassInstane]);

  useEffect(() => {
    getKpiClassInstance({label: "kpi"});
    // eslint-disable-next-line
  }, [])
  
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
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
              {row.type === "kpi" ? (
                <Select
                  value={row.value}
                  onChange={(e) =>
                    handleRowChange(index, "value", e.target.value)
                  }
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Select KPI
                  </MenuItem>
                  {kpiList && kpiList.map((kpi) => (
                    <MenuItem key={kpi} value={kpi}>
                      {kpi}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <TextField
                  type="number"
                  placeholder="Enter a custom number"
                  value={row.value}
                  onChange={(e) =>
                    handleRowChange(index, "value", e.target.value)
                  }
                  fullWidth
                />
              )}

              {!row.endOfFormula && (
                <Select
                  value={row.operation}
                  onChange={(e) =>
                    handleRowChange(index, "operation", e.target.value)
                  }
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

              <FormControlLabel
                control={
                  <Checkbox
                    checked={row.endOfFormula}
                    onChange={(e) =>
                      handleEndOfFormulaChange(index, e.target.checked)
                    }
                  />
                }
                label="End of Formula"
              />

              <IconButton
                onClick={() => handleRemoveRow(index)}
                color="error"
                disabled={rows.length === 1}
              >
                <Remove />
              </IconButton>
            </Box>
          ))}

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => handleAddRow("kpi")}
              startIcon={<Add />}
              disabled={isEndOfFormulaChecked}
            >
              Add KPI
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleAddRow("custom")}
              startIcon={<Add />}
              disabled={isEndOfFormulaChecked}
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
    kpiClassInstane: main.kpiClassInstane.instances,
    loading: main.loading
  });

export default connect(mapStatetoProps, {getKpiClassInstance})(CustomKPIForm);
