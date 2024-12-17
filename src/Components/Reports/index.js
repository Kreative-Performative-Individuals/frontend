import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { Box, Button, Container, Typography } from "@mui/material";
import ReportsRow from "./ReportsRow";
import { connect } from "react-redux";
import {
  addReportToList,
  deleteReport,
  getReportList
} from "../../store/main/actions";
import { useNavigate } from "react-router-dom";
import "./style.scss";

const Reports = ({ getReportList, reports, addReportToList, deleteReport }) => {
  const navigate = useNavigate();

  const [reportsInView, setReportsInView] = useState([]);

  const defaultReports = [
    {
      reportName: "Consumption Report",
      components: [
        {
          type: "text",
          label: "Text",
          config: {
            text: "Consumption Report",
            machine: "Large Capacity Cutting Machine 2",
            operation: "working"
          },
          id: "6f813507-56b4-4f63-8533-767b3abfc0cf"
        },
        {
          type: "horizontalLine",
          label: "Horizontal Line",
          id: "f516be39-1ba7-4c35-8c06-6f72a1fe2686",
          config: {
            machine: "Large Capacity Cutting Machine 2",
            operation: "working"
          }
        },
        {
          type: "kpi",
          label: "Kpi",
          config: {
            kpi_name: "consumption_sum",
            text: "Large Capacity Cutting Machine 1 Consumption Sum",
            machine: "Large Capacity Cutting Machine 1",
            operation: "working"
          },
          id: "5a93d0d8-622e-4508-a2a3-0d0f3ce13b65"
        },
        {
          type: "chart",
          label: "Chart",
          config: {
            kpi_name: "consumption_sum",
            chartType: "line",
            machine: "Large Capacity Cutting Machine 1",
            operation: "working"
          },
          id: "adfbd293-52f1-49ec-8653-08a37ed02254"
        },
        {
          type: "horizontalLine",
          label: "Horizontal Line",
          id: "738b0677-0890-48ec-8378-9fe6b9b83992"
        },
        {
          type: "kpi",
          label: "Kpi",
          config: {
            kpi_name: "consumption_min",
            text: "Large Capacity Cutting Machine 1 Consumption Min",
            machine: "Large Capacity Cutting Machine 1",
            operation: "working"
          },
          id: "7c3dd4c9-4f15-48e2-bf5c-4ed0a19e4f7c"
        },
        {
          type: "chart",
          label: "Chart",
          config: {
            kpi_name: "consumption_min",
            chartType: "line",
            machine: "Large Capacity Cutting Machine 1",
            operation: "working"
          },
          id: "22bded4c-4005-49d7-b21a-417f14a46519"
        },
        {
          type: "horizontalLine",
          label: "Horizontal Line",
          id: "be41bcc2-7e65-4a98-91a7-f4995d8daf75"
        },
        {
          type: "kpi",
          label: "Kpi",
          config: {
            kpi_name: "consumption_max",
            text: "Large Capacity Cutting Machine 1 Consumption Max",
            machine: "Large Capacity Cutting Machine 1",
            operation: "working"
          },
          id: "46fa6e69-0ac1-4094-b3df-d5ce1996e08c"
        },
        {
          type: "chart",
          label: "Chart",
          config: {
            kpi_name: "consumption_max",
            chartType: "line",
            machine: "Large Capacity Cutting Machine 1",
            operation: "working"
          },
          id: "4c30c744-f503-4d59-853d-10863724175c"
        },
        {
          type: "horizontalLine",
          label: "Horizontal Line",
          id: "d9cd2a59-0b8c-457a-b7c4-8ac273281278"
        },
        {
          type: "kpi",
          label: "Kpi",
          config: {
            kpi_name: "consumption_avg",
            text: "Large Capacity Cutting Machine 1 Consumption Average",
            machine: "Large Capacity Cutting Machine 1",
            operation: "working"
          },
          id: "b9c038ac-f08d-43ac-8878-5bde8493d47b"
        },
        {
          type: "chart",
          label: "Chart",
          config: {
            kpi_name: "consumption_avg",
            chartType: "line",
            machine: "Large Capacity Cutting Machine 1",
            operation: "working"
          },
          id: "c90ec520-5eae-4aae-9d55-4643b9bd67ad"
        }
      ],
      reportId: "1f0ffdc9-e533-41d9-9837-1ac55ce763fa"
    }
  ];

  useEffect(() => {
    getReportList();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (reports && reports.length === 0) {
      setReportsInView(defaultReports);
      defaultReports.forEach((item) => addReportToList(item));
    } else {
      setReportsInView(reports);
    }
    // eslint-disable-next-line
  },[reports]);

  const handleAddReport = () => {
    navigate("/reports/new");
  };

  const handleView = reportId => {
    navigate(`/reports/view?reportId=${reportId}`);
  };
  const handleEdit = reportId => {
    navigate(`/reports/edit?reportId=${reportId}`);
  };
  const handleDelete = reportId => {
    deleteReport(reportId);
  };

  return (
    <Layout>
      <Box className="reports">
        <Container>
          <Box className="reportHeader">
            <Typography variant="h5" className="headerHeading">
              Reports
            </Typography>
            <Button variant="contained" onClick={handleAddReport}>
              Add New Report
            </Button>
          </Box>

          <Box>
            <div className="reportTemplateName">
              <div className="reportsRows">
                {reportsInView &&
                  reportsInView.map((report, index) =>
                    <ReportsRow
                      key={index}
                      report={report}
                      handleView={handleView}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                    />
                  )}
              </div>
            </div>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

const mapStatetoProps = ({ main }) => ({
  reports: main.reports
});

export default connect(mapStatetoProps, {
  getReportList,
  addReportToList,
  deleteReport
})(Reports);
