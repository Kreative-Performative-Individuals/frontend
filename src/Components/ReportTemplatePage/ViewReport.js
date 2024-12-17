import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { Box, Button, FormControl } from '@mui/material';
import { getSingleReport } from '../../store/main/actions';
import Layout from '../Layout';
import "./style.scss";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    RadialLinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend,
    RadarController 
} from 'chart.js';
import KpiComponent from './Components/KPI';
import ChartComponent from './Components/Chart';
import { usePDF } from 'react-to-pdf';
import { formatDate } from '../../constants/_helper';

ChartJS.register(
  CategoryScale, // Category scale for the x-axis
  BarElement, // For rendering bar charts
  LinearScale, // Linear scale for the y-axis
  PointElement, // Point elements for line charts
  RadialLinearScale, // For radar chart scales
  LineElement, // Line elements for line charts
  Title, // Title plugin
  Tooltip, // Tooltip plugin for displaying tooltips
  Legend, // Legend plugin for displaying chart legend
  RadarController // Radar chart controller for radar charts
);

const ViewReport = ({ getSingleReport, singleReport }) => {
  
  const location = useLocation(); // Get the current URL location
  const queryParams = new URLSearchParams(location.search); // Parse the URL query parameters
  const reportId = queryParams.get("reportId");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [viewReport, setViewReport] = useState(false);
  const [reportDetails, setReportDetails] = useState({
    reportName: ""
  });

  const today = new Date();
  const { toPDF, targetRef } = usePDF({filename: `${formatDate(startDate).substring(0, 10)} - ${formatDate(endDate).substring(0, 10)} ${reportDetails?.reportName}.pdf`});

  const handleViewReport = () => {
    if (startDate && endDate) {
      setViewReport(true);
    } else {
      alert("Please select report date range.")
    }
  };

  const onDateRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    getSingleReport(reportId);
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setReportDetails(singleReport);
    // eslint-disable-next-line
  }, [singleReport])

  const renderComponent = (component) => {
    switch (component.type) {
      case "text":
        return (
          <div key={component.id}  className="page-break">
            <p style={{ margin: "1rem 0", fontSize: "20px" }} >
              <b>{component.config.text}</b>
            </p>
          </div>
        );
      
      case "horizontalLine":
        return <hr />

      case "kpi":
        return <KpiComponent component={component} startDate={startDate} endDate={endDate} />

      case "chart":
        return <ChartComponent component={component} startDate={startDate} endDate={endDate} />

      default:
        return null;
    }
  };


  const handleDownloadReport = () => {
    if (startDate && endDate) {
      toPDF();
    } else {
      alert("Please select report date range.")
    }
  }


  return (
    <Layout>
      <Box className="viewReport">
        <h1>{reportDetails && reportDetails.reportName}</h1>
        
        <div className='reportHeadSelector'>
          <div className='reportRange'>
            <div className='heading'>Select Report Range: </div>
            <FormControl style={{ height: "100%", marginRight: "2rem" }}>
              <DatePicker
                selected={null} 
                onChange={onDateRangeChange} 
                startDate={startDate} 
                endDate={endDate} 
                selectsRange 
                maxDate={today} 
                placeholderText="Select Range" 
              />
            </FormControl>
            <Button variant='outlined' onClick={() => {setStartDate((new Date()).setDate(today.getDate() - 1)); setEndDate(today);}} >Today</Button>
            <Button variant='outlined' onClick={() => {setStartDate((new Date()).setDate(today.getDate() - 7)); setEndDate(today);}} >1 Week</Button>
            <Button variant='outlined' onClick={() => {setStartDate((new Date()).setDate(today.getDate() - 30)); setEndDate(today);}} >1 Month</Button>
          </div>

          
          <div className='reportButtons'>
            <Button variant='contained' onClick={handleViewReport} >View Report</Button>
            {viewReport && <Button variant='contained' onClick={handleDownloadReport} >Download</Button>}
          </div>

        </div>

        {viewReport && (
          <Box style={{ width: "60%", marginTop: "2rem" }} >
            <Box padding={5} style={{ backgroundColor: "#fff" }} ref={targetRef} >
              <div style={{ pageBreakAfter: 'always' }}>
                <div style={{ textAlign: "center" }}>
                  <h1>{reportDetails.reportName}</h1>
                  <h4 style={{ marginTop: "-15px" }}>Report Range {` - ${formatDate(startDate).substring(0, 10)} - ${formatDate(endDate).substring(0, 10)}`}</h4>
                </div>
                {reportDetails && reportDetails?.components.map((component) => renderComponent(component))}
              </div>
            </Box>
          </Box>
        )}

      </Box>
    </Layout>
  );
};

const mapStatetoProps = ({ main }) => ({
  singleReport: main.singleReport,
  loading: main.loading
});

export default connect(mapStatetoProps, { getSingleReport })(ViewReport);
