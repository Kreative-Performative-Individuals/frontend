import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import { Accordion, AccordionSummary, AccordionDetails, Box, Stack, Button, Typography, TextField, MenuItem, Select, InputLabel, FormControl, Chip } from '@mui/material';
import Layout from '../Layout';
import { getKpiClassInstance, addReportToList, getMachineList, getSingleReport } from '../../store/main/actions';

import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// Import MUI icons for chart types
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';

import "./style.scss";

const AddReport = ({ getKpiClassInstance, kpiClassInstane, addReportToList, getMachineList, machines, getSingleReport, singleReport }) => {
  
  const [components, setComponents] = useState([]);
  const [reportName, setReportName] = useState("");
  const [reportId, setReportId] = useState(uuidv4());
  const [editView, setEditView] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  
  const componentTypes = [
    { type: "text", label: "Text", config: { text: "" } },
    { type: "kpi", label: "Kpi", config: { kpi_name: "", text: "", machine: "", operation: "" } },
    { type: "chart", label: "Chart", config: { kpi_name: "", chartType: "", machine: "", operation: "" } },
    { type: "horizontalLine", label: "Horizontal Line"}
  ];

  const addComponent = (component) => {
    setComponents((prev) => ([...prev, {...component, id: uuidv4() }]))
  }

  const handleRemoveComponent = (index) => {
    setComponents(components.filter((_, i) => i !== index));
  };
  
  const handleUpdateText = (id, newText) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id
          ? { ...component, config: { ...component.config, text: newText } }
          : component
      )
    );
  };
  const handleSelectKpi = (id, newKpi) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id
          ? { ...component, config: { ...component.config, kpi_name: newKpi } }
          : component
      )
    );
  };
  const handleSelectMachine = (id, newKpi) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id
          ? { ...component, config: { ...component.config, machine: newKpi } }
          : component
      )
    );
  };
  const handleSelectOperation = (id, newKpi) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id
          ? { ...component, config: { ...component.config, operation: newKpi } }
          : component
      )
    );
  };
  const handleChartUpdate = (id, chartType) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id
          ? { ...component, config: { ...component.config, chartType: chartType } }
          : component
      )
    );
  };

  useEffect(() => {
    getKpiClassInstance({label: "kpi"});
    getMachineList();
    if (location.pathname === "/reports/edit") {
      const queryParams = new URLSearchParams(location.search); // Parse the URL query parameters
      setEditView(true);
      setReportId(queryParams.get("reportId"));
      getSingleReport(queryParams.get("reportId"));
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
      if (editView && reportId) {
        setComponents(singleReport.components)
        setReportName(singleReport.reportName)
      }
      // eslint-disable-next-line
  }, [singleReport, editView])

  const machineList = machines.map((item) => item.name);

  const saveTemplate = () => {
    if (components.length !== 0) {
      if (reportName) {
        addReportToList({ reportName, components, reportId: reportId });
        navigate("/reports");
      } else {
        alert("Report Name Empty")
      }
    } else {
      alert("No Components Added")
    }
  }

  return (
    <Layout>
      <div className="reportTemplatePage">
        <Box className="reportComponentsSection">
          <Stack spacing={2} className="reportComponentsContainer">
            {components && components.map((component, i) => (
              <Box key={i} className='reportSingleComponent'>
                <Box className="cross"><CloseIcon fontSize='small' onClick={() => handleRemoveComponent(i)} /></Box>
                
                {/* If Component is text */}
                {component.type === "text" && (
                  <Accordion style={{ width: "100%" }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                      <Typography>{component.label}</Typography>
                      <Typography style={{ fontWeight: "700" }}>{component.config.text && ` - ${component.config.text}` }</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        label="Label"
                        variant="outlined"
                        fullWidth
                        value={component.config.text}
                        onChange={(e) => handleUpdateText(component.id, e.target.value)}
                      />
                    </AccordionDetails>
                  </Accordion>
                )}
                
                {/* If Component is text */}
                {component.type === "horizontalLine" && (
                  <Accordion style={{ width: "100%" }}>
                    <AccordionSummary >
                      <Typography>{component.label}</Typography>
                    </AccordionSummary>
                  </Accordion>
                )}
                
                {/* If Component is kpi */}
                {component.type === "kpi" && (
                  <Accordion style={{ width: "100%" }}>
                    <AccordionSummary className='accordianHead' expandIcon={<ExpandMoreIcon />} >
                      <Typography>{component.label}</Typography>
                      <Typography style={{ fontWeight: "700" }}>{component.config.text && ` - ${component.config.text}` }</Typography>
                      {component.config.kpi_name && <Chip style={{ marginLeft: "20px" }} label={component.config.kpi_name && `${component.config.kpi_name}`} />}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack direction="row" gap={"2rem"} >
                        <TextField
                          label="Label"
                          variant="outlined"
                          fullWidth
                          value={component.config.text}
                          onChange={(e) => handleUpdateText(component.id, e.target.value)}
                        />
                        <FormControl fullWidth>
                          <InputLabel id="report-kpi-label">Selct KPI</InputLabel>
                          <Select labelId="report-kpi-label" id="report-kpi" label="Select KPI" MenuProps={{ PaperProps: {
                              style: {
                                maxHeight: 250,
                                overflowY: 'auto',
                              }
                            }}}
                            value={component.config.kpi_name}
                            onChange={(e) => handleSelectKpi(component.id, e.target.value)}
                          >
                            {kpiClassInstane && kpiClassInstane.sort((a, b) => a.localeCompare(b)).map((kpi, i) => (
                              <MenuItem value={kpi} key={i}>{kpi}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                      <Stack direction="row" gap={"2rem"} style={{ marginTop: "2rem" }} >
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="machine-select-label">Machine</InputLabel>
                          <Select
                            labelId="machine-select-label"
                            id="machine-select"
                            MenuProps={{ PaperProps: {
                              style: {
                                maxHeight: 350,
                                overflowY: 'auto',
                              }
                            }}}
                            value={component.config.machine}
                            onChange={(e) => handleSelectMachine(component.id, e.target.value)}
                            label="Machine"
                          >
                            {machineList.map((machine, i) => (
                              <MenuItem key={i} value={machine}>{machine}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="operation-select-label">Operation</InputLabel>
                          <Select
                            labelId="operation-select-label"
                            id="operation-select"
                            value={component.config.operation}
                            onChange={(e) => handleSelectOperation(component.id, e.target.value)}
                            label="Operation"
                          >
                            <MenuItem value="working">Working</MenuItem>
                            <MenuItem value="offline">Offline</MenuItem>
                            <MenuItem value="idle">Idle</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                )}
                
                {/* If Component is chart */}
                {component.type === "chart" && (
                  <Accordion style={{ width: "100%" }}>
                    <AccordionSummary className='accordianHead' expandIcon={<ExpandMoreIcon />} >
                      <Typography>{component.label}</Typography>
                      {component.config.kpi_name && <Chip style={{ marginLeft: "20px" }} label={component.config.kpi_name && `${component.config.kpi_name}`} />}
                      <Box style={{ marginLeft: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {component.config.chartType && 
                          component.config.chartType === "line" ? <TimelineIcon />
                          : component.config.chartType === "bar" ?  <BarChartIcon />
                          : component.config.chartType === "stacked" ?  <StackedBarChartIcon />
                          : component.config.chartType === "pie" ?  <PieChartIcon />
                          : component.config.chartType === "radar" ?  <ScatterPlotIcon />
                          : component.config.chartType === "polar" ?  <DonutSmallIcon />
                          : ""
                        }

                      </Box>
                      {/* <Typography style={{ fontWeight: "700" }}>{component.config.text && ` - ${component.config.text}` }</Typography> */}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack direction="row" gap={"2rem"} alignItems="center" >
                        <FormControl fullWidth>
                          <InputLabel id="report-kpi-label">Selct KPI</InputLabel>
                          <Select labelId="report-kpi-label" id="report-kpi" label="Select KPI" MenuProps={{ PaperProps: {
                              style: {
                                maxHeight: 250,
                                overflowY: 'auto',
                              }
                            }}}
                            value={component.config.kpi_name}
                            onChange={(e) => handleSelectKpi(component.id, e.target.value)}
                          >
                            {kpiClassInstane && kpiClassInstane.sort((a, b) => a.localeCompare(b)).map((kpi, i) => (
                              <MenuItem value={kpi} key={i}>{kpi}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Box className="FiltersContainer">
                            <Typography>Select Chart Type</Typography>
                            <Box className="Filters">
                              <Button title='Line Chart' className={`chartFilterButton left ${component.config.chartType === "line" && "active"}`} onClick={() => handleChartUpdate(component.id, "line")} ><TimelineIcon /></Button>
                              <Button title='Bar Chart' className={`chartFilterButton ${component.config.chartType === "bar" && "active"}`} onClick={() => handleChartUpdate(component.id, "bar")} ><BarChartIcon /></Button>
                              <Button title='Stacked Bar Chart' className={`chartFilterButton ${component.config.chartType === "stacked" && "active"}`}  onClick={() => handleChartUpdate(component.id, "stacked")} ><StackedBarChartIcon /></Button>
                              <Button title='Pie Chart' className={`chartFilterButton ${component.config.chartType === "pie" && "active"}`} onClick={() => handleChartUpdate(component.id, "pie")} ><PieChartIcon /></Button>
                              <Button title='Radar Chart' className={`chartFilterButton ${component.config.chartType === "radar" && "active"}`} onClick={() => handleChartUpdate(component.id, "radar")} ><ScatterPlotIcon /></Button>
                              <Button title='Polar Chart' className={`chartFilterButton right ${component.config.chartType === "polar" && "active"}`} onClick={() => handleChartUpdate(component.id, "polar")} ><DonutSmallIcon /></Button>
                            </Box>
                        </Box>
                      </Stack>
                      <Stack direction="row" gap={"2rem"} style={{ marginTop: "2rem" }} >
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="machine-select-label">Machine</InputLabel>
                          <Select
                            labelId="machine-select-label"
                            id="machine-select"
                            MenuProps={{ PaperProps: {
                              style: {
                                maxHeight: 350,
                                overflowY: 'auto',
                              }
                            }}}
                            value={component.config.machine}
                            onChange={(e) => handleSelectMachine(component.id, e.target.value)}
                            label="Machine"
                          >
                            {machineList.map((machine, i) => (
                              <MenuItem key={i} value={machine}>{machine}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="operation-select-label">Operation</InputLabel>
                          <Select
                            labelId="operation-select-label"
                            id="operation-select"
                            value={component.config.operation}
                            onChange={(e) => handleSelectOperation(component.id, e.target.value)}
                            label="Operation"
                          >
                            <MenuItem value="working">Working</MenuItem>
                            <MenuItem value="offline">Offline</MenuItem>
                            <MenuItem value="idle">Idle</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                )}


              </Box>
            ))}

            {components.length === 0 && <Typography>No Components Added</Typography>}

          </Stack>
        </Box>
        <Box className="selectComponentsSection">

          <Stack spacing={2}>
            <Typography variant='h5' style={{ marginBottom: "15px" }}>Add a Component</Typography>
            {componentTypes.map((component, i) => (
              <Button key={i} variant='outlined' onClick={() => addComponent(component)} >{component.label}</Button>
            ))}
            <Typography variant='h6'>Report Name</Typography>
            <Box style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <TextField id="report-name" label="Report Name" variant="outlined" fullWidth
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
              <Button variant='contained' onClick={saveTemplate} >Save Template</Button>
            </Box>
          </Stack>
        </Box>
      </div>
    </Layout>
  );
};

const mapStatetoProps = ({ main }) => ({
  kpiClassInstane: main.kpiClassInstane.instances,
  singleReport: main.singleReport,
  machines: main.machines,
  loading: main.loading
});

export default connect(mapStatetoProps, { getKpiClassInstance, addReportToList, getMachineList, getSingleReport })(AddReport);
