import { EditTwoTone, DeleteTwoTone } from "@mui/icons-material";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  ButtonGroup,
  Button,
  CircularProgress,
  Box,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  AllVmObjectsQuery,
  useAllVmObjectsQuery,
  useLockoutVmMutation,
} from "../../api/generated/graphql";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const createVmObjectData = (
  vmObject: AllVmObjectsQuery["vmObjects"][0]
): {
  id: AllVmObjectsQuery["vmObjects"][0]["ID"];
  name: AllVmObjectsQuery["vmObjects"][0]["Name"];
  identifier: AllVmObjectsQuery["vmObjects"][0]["Identifier"];
  ipAddresses: AllVmObjectsQuery["vmObjects"][0]["IPAddresses"];
  team: AllVmObjectsQuery["vmObjects"][0]["VmObjectToTeam"];
} => {
  return {
    id: vmObject.ID,
    name: vmObject.Name,
    identifier: vmObject.Identifier,
    ipAddresses: vmObject.IPAddresses,
    team: vmObject.VmObjectToTeam,
  };
};

enum FilterType {
  IP_ADDRESS,
  NAME,
  COMPETITION,
  TEAM,
  ID,
}

enum FilterMode {
  TEXT,
  REGEX,
}

export const LockoutForm: React.FC = (): React.ReactElement => {
  const {
    data: allVmObjectsData,
    loading: allVmObjectsLoading,
    error: allVmObjectsError,
    refetch: refetchVmObjects,
  } = useAllVmObjectsQuery({
    fetchPolicy: "no-cache",
  });
  const [
    lockoutVm,
    { data: lockoutVmData, loading: lockoutVmLoading, error: lockoutVmError },
  ] = useLockoutVmMutation();
  const [filterType, setFilterType] = useState<FilterType>(FilterType.NAME);
  const [filterMode, setFilterMode] = useState<FilterMode>(FilterMode.TEXT);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (allVmObjectsError)
      enqueueSnackbar(`Couldn't get vm objects: ${allVmObjectsError.message}`, {
        variant: "error",
      });
  }, [allVmObjectsError, enqueueSnackbar]);

  useEffect(() => {
    if (lockoutVmError)
      enqueueSnackbar(
        `Couldn't update vm object lockout: ${lockoutVmError.message}`,
        {
          variant: "error",
        }
      );
  }, [lockoutVmError, enqueueSnackbar]);

  useEffect(() => {
    if (lockoutVmLoading)
      enqueueSnackbar("Updating vm object lockout...", {
        variant: "info",
        autoHideDuration: 2500,
      });
    else if (lockoutVmData?.lockoutVm) {
      enqueueSnackbar("Successfully updated vm object lockout!", {
        variant: "success",
      });
      refetchVmObjects();
    }
  }, [lockoutVmLoading, lockoutVmData, refetchVmObjects, enqueueSnackbar]);

  // const handleDeleteVmObject = (vmObjectId: string) => {
  //   resetDeleteModal();
  //   deleteVmObject({
  //     variables: {
  //       vmObjectId,
  //     },
  //   });
  // };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <FormControl
          variant="outlined"
          sx={{
            minWidth: "25%",
            flex: "2",
          }}
        >
          <InputLabel id="filter-type-select-label">Filter Type</InputLabel>
          <Select
            labelId="filter-type-select-label"
            id="filter-type-select"
            value={filterType}
            label="Filter Type"
            onChange={(e) => setFilterType(e.target.value as FilterType)}
          >
            <MenuItem value={FilterType.ID}>ID</MenuItem>
            <MenuItem value={FilterType.NAME}>Name</MenuItem>
            <MenuItem value={FilterType.IP_ADDRESS}>IP Address</MenuItem>
            <MenuItem value={FilterType.TEAM}>Team</MenuItem>
            <MenuItem value={FilterType.COMPETITION}>Competition</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Filter Regex"
          id="outlined-start-adornment"
          sx={{ m: 1, width: "25ch", minWidth: "25%", flex: "6" }}
          InputProps={{
            startAdornment: <InputAdornment position="start"></InputAdornment>,
          }}
        />

        <FormControl
          variant="outlined"
          sx={{
            minWidth: "15%",
            flex: "1",
          }}
        >
          <InputLabel id="filter-mode-select-label">Filter Mode</InputLabel>
          <Select
            labelId="filter-mode-select-label"
            id="filter-mode-select"
            value={filterMode}
            label="Filter Type"
            onChange={(e) => setFilterMode(e.target.value as FilterMode)}
          >
            <MenuItem value={FilterMode.TEXT}>Text</MenuItem>
            <MenuItem value={FilterMode.REGEX}>Regex</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Divider />
      <TableContainer component={Paper}>
        <Table sx={{ width: "100%" }} aria-label="vm objects table">
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Identifier</TableCell>
              <TableCell align="center">IP Addresses</TableCell>
              <TableCell align="center">Team</TableCell>
              <TableCell align="center">Competition</TableCell>
              <TableCell align="right">Controls</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allVmObjectsData?.vmObjects.map(createVmObjectData).map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.identifier}</TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {row.ipAddresses.map((ip) => (
                      <Typography
                        key={ip}
                        variant="caption"
                        component="code"
                        sx={{
                          mb: 1,
                        }}
                      >
                        {ip}
                      </Typography>
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={
                      row.team
                        ? row.team.Name || `Team ${row.team?.TeamNumber}`
                        : "N/A"
                    }
                    color={row.team ? "primary" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={row.team ? row.team.TeamToCompetition.Name : "N/A"}
                    color={row.team ? "secondary" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <ButtonGroup size="small">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate(`/admin/vm-object/${row.id}`)}
                    >
                      <EditTwoTone />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        // setDeleteModalData({
                        //   objectName: row.name,
                        //   isOpen: true,
                        //   onClose: resetDeleteModal,
                        //   onSubmit: () => handleDeleteVmObject(row.id),
                        // });
                      }}
                    >
                      <DeleteTwoTone />
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            )) ?? (
              <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                No Vm Objects Found
              </TableCell>
            )}
            {allVmObjectsLoading && (
              <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                <CircularProgress />
              </TableCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
