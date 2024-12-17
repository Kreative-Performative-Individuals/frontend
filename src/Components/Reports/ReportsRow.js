import { Button } from "@mui/material";
import React from "react";

const ReportsRow = ({ report, handleView, handleEdit, handleDelete }) => {

  return (
    <div className="reportTemplateContainer">
        <div className='reportName' >{report.reportName}</div>
        <div className="reportActions">
          <Button variant="contained" onClick={() => handleView(report.reportId)} >View</Button>
          <Button variant="contained" onClick={() => handleEdit(report.reportId)} >Edit</Button>
          <Button variant="contained" onClick={() => handleDelete(report.reportId)} >Delete</Button>
        </div>
    </div>
  );
};

export default ReportsRow;
