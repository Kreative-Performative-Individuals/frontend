import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { callKpiEngine, truncateToFiveDecimals } from '../../../constants/_helper';

const KpiComponent = ({ component, startDate, endDate }) => {

    const [response, setResponse] = useState({});
    const { kpi_name, text, machine, operation } = component.config;
    const payload = { "name": kpi_name, "machines": [machine], "operations": [operation], "time_aggregation": "sum", "start_date": startDate, "end_date": endDate, "step": 2 }
    async function handleRequest() {
        const { data } = await callKpiEngine(payload);
        setResponse(data)
    }
    useEffect(() => {
        handleRequest();
        // eslint-disable-next-line
    }, [])

  return (
    <div key={component.id} style={{ margin: "1rem 0" }} className="page-break">
        <Stack direction="row" style={{ alignItems: "center", fontSize: "18px" }}>
            <div variant="h6" component="div">
                <b>{text}</b>:
            </div>
            <div style={{ marginLeft: "10px" }} >
                {truncateToFiveDecimals(response.value)}
            </div>
        </Stack>
        <p style={{ fontSize: "16px", marginTop: "2px", fontStyle: "italic", color: "#A9A9A9" }}>{response.message}</p>
    </div>
  )
}

export default KpiComponent;