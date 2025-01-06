import React, { useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Divider,
  Typography
} from "@mui/material";
import {
  getMachineList,
  save_filter_machine_list
} from "../../store/main/actions";
import { connect } from "react-redux";

const MachineForm = ({
    open, 
    onClose,
    getMachineList,
    machines,
    save_filter_machine_list,
    selectedMachines,
    setSelectedMachines
}) => {
//   const [open, setOpen] = useState(false);
  

  useEffect(() => {
    getMachineList();
    // eslint-disable-next-line
  }, []);

  // Group machines by type
  const groupedMachines = machines.reduce((groups, machine) => {
    const { type } = machine;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(machine);
    return groups;
  }, {});

  // Group selected machines by type
  const groupedSelectedMachines = selectedMachines.reduce((groups, machine) => {
    const { type } = machine;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(machine);
    return groups;
  }, {});

  // Function to handle selecting a machine
  const toggleSelect = machine => {
    setSelectedMachines(prev => {
      if (prev.some(item => item.asset_id === machine.asset_id)) {
        return prev.filter(item => item.asset_id !== machine.asset_id);
      } else {
        return [...prev, machine];
      }
    });
  };

  // Select all machines of a specific type
  const selectAllOfType = type => {
    setSelectedMachines(prev => {
      const machinesOfType = groupedMachines[type];
      const alreadySelected = prev.map(item => item.asset_id);
      const newSelection = machinesOfType.filter(
        machine => !alreadySelected.includes(machine.asset_id)
      );
      return [...prev, ...newSelection];
    });
  };

  // Clear all selected machines of a specific type
  const clearAllOfType = type => {
    setSelectedMachines(prev => prev.filter(item => item.type !== type));
  };

  // Select all machines
  const selectAll = () => {
    setSelectedMachines(machines);
  };

  // Clear all selected machines
  const clearAll = () => {
    setSelectedMachines([]);
  };

  const handleClose = () => onClose(false);

  const handleSelectFiltering = () => {
    save_filter_machine_list(groupedSelectedMachines);
    handleClose();
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            backgroundColor: "white",
            padding: 2,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              paddingBottom: 2
            }}
          >
            <h2>Select Machines</h2>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            {/* Left section for available machines */}
            <Box sx={{ width: "45%", paddingRight: 2 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: 2 }}
              >
                Machines List
              </Typography>
              <List sx={{ overflowY: "auto", maxHeight: "500px" }}>
                {Object.keys(groupedMachines).map(type =>
                  <div key={type}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <p style={{ fontWeight: "bold" }}>
                        {type.replace("_", " ").toUpperCase()}
                      </p>
                      <Box>
                        <Button
                          variant="text"
                          onClick={() => clearAllOfType(type)}
                        >
                          Clear All
                        </Button>
                        <Button
                          variant="text"
                          onClick={() => selectAllOfType(type)}
                          sx={{ marginRight: 1 }}
                        >
                          Select All
                        </Button>
                      </Box>
                    </Box>
                    {groupedMachines[type].map(machine =>
                      <ListItem
                        key={machine.asset_id}
                        button
                        onClick={() => toggleSelect(machine)}
                        sx={{ padding: 0 }}
                      >
                        <Checkbox
                          checked={selectedMachines.some(
                            item => item.asset_id === machine.asset_id
                          )}
                        />
                        <ListItemText primary={machine.name} />
                      </ListItem>
                    )}
                  </div>
                )}
              </List>
            </Box>

            {/* Divider between the lists */}
            <Divider orientation="vertical" flexItem sx={{ marginRight: 2 }} />

            {/* Right section for selected machines */}
            <Box sx={{ width: "45%" }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: 2 }}
              >
                Selected Machines
              </Typography>
              <List sx={{ overflowY: "auto", maxHeight: "500px" }}>
                {Object.keys(groupedSelectedMachines).map(type =>
                  <div key={type}>
                    <p style={{ fontWeight: "bold" }}>
                      {type.replace("_", " ").toUpperCase()}
                    </p>
                    {groupedSelectedMachines[type].map(machine =>
                      <ListItem key={machine.asset_id} sx={{ padding: 0 }}>
                        <ListItemText primary={machine.name} />
                      </ListItem>
                    )}
                  </div>
                )}
              </List>
            </Box>
          </Box>

          {/* Bottom section with select all and clear all button */}
          <Box
            sx={{
              width: "100%",
              paddingTop: 2,
              display: "flex",
              justifyContent: "space-between",
              gap: 2
            }}
          >
            <Button
              variant="contained"
              onClick={selectAll}
              fullWidth
              color="secondary"
            >
              Select All Machines
            </Button>
            <Button
              variant="contained"
              onClick={clearAll}
              fullWidth
              color="error"
            >
              Clear All Machines
            </Button>
            <Button
              variant="contained"
              onClick={handleSelectFiltering}
              fullWidth
              color="success"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

const mapStatetoProps = ({ main }) => ({
  machines: main.machines,
  loading: main.loading
});

export default connect(mapStatetoProps, { getMachineList, save_filter_machine_list })(MachineForm);
