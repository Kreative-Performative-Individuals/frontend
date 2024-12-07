// Function to convert Machine list API response into JSON
const machineColumnNames = [ "asset_id", "name", "type", "capacity", "installation_date", "location", "status", "description"];

function transformMachineList(apiResponse) {
  // Map each machine's data to the respective column names
  return apiResponse.map(machine => {
    const machineObject = {};
    machineColumnNames.forEach((column, index) => {
      machineObject[column] = machine[index];
    });
    return machineObject;
  });
}

function getLast24Hours() {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - (24 * 60 * 60 * 1000));
  const formatDate = (date) => {
      const yy = date.getFullYear().toString();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const mi = String(date.getMinutes()).padStart(2, '0');
      const ss = String(date.getSeconds()).padStart(2, '0');
      return `${yy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  };
  const initDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  return { init_date: initDate, end_date: formattedEndDate };
}


export { transformMachineList, getLast24Hours };
