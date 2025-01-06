import React, { useState } from "react";
import Layout from "../Layout";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import CustomKPIForm from "./CustomKPIForm";
import axios from "axios";
import { kpiEngineUrl } from "../../constants/apiRoutes";

const CustomKPI = () => {
  const [formValues, setFormValues] = useState({
    label: "",
    description: "",
    unit_of_measure: "",
    human_readable_formula: ""
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSetFormula = (value) => {
    setFormValues({ ...formValues, human_readable_formula: value });
  }

  const handleCreateCustomKPI = async () => {
    const data = await axios.post(`${kpiEngineUrl}/kpi/custom`, formValues);
    console.log(data)
    alert(`API Payload: \n ${JSON.stringify(formValues)}`)
  }

  return (
    <Layout>
      <div className="reportTemplatePage">
        <Box className="reportComponentsSection">
          <CustomKPIForm handleSetFormula={handleSetFormula} />
        </Box>

        <Box className="selectComponentsSection">
          <Stack spacing={2}>
            <Typography variant="h5" style={{ marginBottom: "15px" }}>
              Add a Custom KPI
            </Typography>
            {/* <Typography variant="h6">KPI Name</Typography> */}
            <Box
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <TextField
                id="kpi-name"
                label="KPI Name"
                name="label"
                value={formValues.label}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
              />
              <TextField
                label="Description"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={2}
              />
              <TextField
                label="Unit of Measure"
                name="unit_of_measure"
                value={formValues.unit_of_measure}
                onChange={handleChange}
                variant="outlined"
                required
              />
              <TextField
                label="Human Readable Formula"
                name="human_readable_formula"
                value={formValues.human_readable_formula}
                onChange={handleChange}
                variant="outlined"
                required
                multiline
                rows={4}
              />
              <Button variant="contained" onClick={handleCreateCustomKPI}>Create Custom KPI</Button>
            </Box>
          </Stack>
        </Box>
      </div>
    </Layout>
  );
};

export default CustomKPI;
