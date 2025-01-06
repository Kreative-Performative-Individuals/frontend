import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import CustomKPIForm from "./CustomKPIForm";
import axios from "axios";
import { kbUrl, kpiEngineUrl } from "../../constants/apiRoutes";
import { connect } from "react-redux";
import { getKpiClassInstance } from "../../store/main/actions";
import { getLocal } from "../../constants/localstorage";  

const CustomKPI = ({ getKpiClassInstance, kpiClassInstane }) => {
  const [formValues, setFormValues] = useState({
    label: "",
    description: "",
    unit_of_measure: "",
    human_readable_formula: "",
    superclass: "",
  });

  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [smoView, setSmoView] = useState(false); // State to track if the user is an SMO (Specialized Manufacturing Owner)
  const [kpiList, setKpiList] = useState([]);
  const [kpiToDelete, setKpiToDelete] = useState(null); // Track selected KPI for deletion

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.label) {
      newErrors.label = "KPI Name is required.";
    }

    if (!formValues.unit_of_measure) {
      newErrors.unit_of_measure = "Unit of Measure is required.";
    }

    if (!formValues.human_readable_formula) {
      newErrors.human_readable_formula = "Human Readable Formula is required.";
    }

    if (!formValues.superclass) {
      newErrors.superclass = "KPI category is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCustomKPI = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(`${kpiEngineUrl}/kpi/custom`, formValues);
      const message = response.data["message"];
      const code = Number(response.data["status"]);

      setBanner({
        open: true,
        message: message,
        severity: code === 200 ? "success" : "error",
      });

      // Refresh the KPI list
      getKpiClassInstance({ label: "kpi" });
    } catch (error) {
      console.error("Error creating custom KPI:", error);
      setBanner({
        open: true,
        message: "There was an error creating the Custom KPI.",
        severity: "error",
      });
    }
  };

  const handleDeleteKPI = async () => {
    if (!kpiToDelete) {
      setBanner({
        open: true,
        message: "Please select a KPI to delete.",
        severity: "error",
      });
      return;
    }

    try {
      const response = await axios.get(`${kbUrl}/remove_kpi`, {params: {kpi_label: kpiToDelete}}
      );
      const message = response.data["message"];
      const code = Number(response.data["status"]);

      setBanner({
        open: true,
        message: message,
        severity: code === 200 ? "success" : "error",
      });

      // Refresh the KPI list
      getKpiClassInstance({ label: "kpi" });
    } catch (error) {
      console.error("Error deleting KPI:", error);
      setBanner({
        open: true,
        message: "There was an error deleting the KPI.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    setKpiList(kpiClassInstane || []);
  }, [kpiClassInstane]);

  useEffect(() => {
    getKpiClassInstance({ label: "kpi" });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const user = getLocal("authUser"); 
    const userData = JSON.parse(user); 
    if (userData && userData.email.includes("smo")) { 
        setSmoView(true); 
    }
  }, []);

  return (
    <Layout>
      <div className="reportTemplatePage">
        <Box className="reportComponentsSection">
          <Typography variant="h4" gutterBottom>
            Build your own formula!
          </Typography>
          <CustomKPIForm handleSetFormula={(value) => setFormValues({ ...formValues, human_readable_formula: value })} />
        </Box>

        <Box className="selectComponentsSection">
          <Stack spacing={2}>
            <Typography variant="h5" style={{ marginBottom: "15px" }}>
              Manage KPIs
            </Typography>
            <Box style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <TextField
                id="kpi-name"
                label="KPI Name"
                name="label"
                value={formValues.label}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
                error={!!errors.label}
                helperText={errors.label}
              />
              <FormControl fullWidth required error={!!errors.category} variant="outlined">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="superclass"
                  value={formValues.superclass}
                  onChange={handleChange}
                  label="Category"
                >
                  <MenuItem value="kpi">General</MenuItem>
                  <MenuItem value="energy_kpi">Energy</MenuItem>
                  {smoView && (
                    <MenuItem value="financial_kpi">Financial</MenuItem>
                  )}
                  <MenuItem value="production_kpi">Production</MenuItem>
                  <MenuItem value="machine_usage_kpi">Machine Usage</MenuItem>
                </Select>
                {errors.category && <Typography color="error">{errors.category}</Typography>}
              </FormControl>
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
                error={!!errors.unit_of_measure}
                helperText={errors.unit_of_measure}
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
                error={!!errors.human_readable_formula}
                helperText={errors.human_readable_formula}
              />
              <Button variant="contained" onClick={handleCreateCustomKPI}>
                Create Custom KPI
              </Button>
            </Box>
            <Autocomplete
              options={kpiList}
              value={kpiToDelete}
              onChange={(event, newValue) => setKpiToDelete(newValue)}
              renderInput={(params) => <TextField {...params} label="Select a KPI" variant="outlined" fullWidth />}
            />
            <Button variant="contained" color="error" onClick={handleDeleteKPI}>
              Delete KPI
            </Button>

          </Stack>
        </Box>
      </div>

      {banner.open && (
        <Box position="fixed" top="90%" left="15%" transform="translate(-50%, -50%)" zIndex={9999} width="60%">
          <Alert
            severity={banner.severity}
            onClose={() => setBanner({ ...banner, open: false })}
            sx={{ width: "100%" }}
          >
            {banner.message}
          </Alert>
        </Box>
      )}
    </Layout>
  );
};

const mapStateToProps = ({ main }) => ({
  kpiClassInstane: main.kpiClassInstane?.instances || [],
  loading: main.loading,
});

export default connect(mapStateToProps, { getKpiClassInstance })(CustomKPI);
