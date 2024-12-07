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

export { transformMachineList };
