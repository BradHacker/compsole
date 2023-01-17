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
} from "@mui/material";
import React, { useEffect } from "react";
import {
  AllVmObjectsQuery,
  useAllVmObjectsQuery,
  useDeleteVmObjectMutation,
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

export const VmObjectList: React.FC<{
  setDeleteModalData: (data: {
    objectName: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
  }) => void;
  resetDeleteModal: () => void;
}> = ({ setDeleteModalData, resetDeleteModal }): React.ReactElement => {
  const {
    data: allVmObjectsData,
    loading: allVmObjectsLoading,
    error: allVmObjectsError,
    refetch: refetchVmObjects,
  } = useAllVmObjectsQuery({
    fetchPolicy: "no-cache",
  });
  const [
    deleteVmObject,
    {
      data: deleteVmObjectData,
      loading: deleteVmObjectLoading,
      error: deleteVmObjectError,
    },
  ] = useDeleteVmObjectMutation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (allVmObjectsError)
      enqueueSnackbar(`Couldn't get vm objects: ${allVmObjectsError.message}`, {
        variant: "error",
      });
  }, [allVmObjectsError, enqueueSnackbar]);

  useEffect(() => {
    if (deleteVmObjectError)
      enqueueSnackbar(
        `Couldn't delete vm object: ${deleteVmObjectError.message}`,
        {
          variant: "error",
        }
      );
  }, [deleteVmObjectError, enqueueSnackbar]);

  useEffect(() => {
    if (deleteVmObjectLoading)
      enqueueSnackbar("Deleteing vm object...", {
        variant: "info",
        autoHideDuration: 2500,
      });
    else if (deleteVmObjectData?.deleteVmObject) {
      enqueueSnackbar("Successfully deleted vm object!", {
        variant: "success",
      });
      refetchVmObjects();
    }
  }, [
    deleteVmObjectLoading,
    deleteVmObjectData,
    refetchVmObjects,
    enqueueSnackbar,
  ]);

  const handleDeleteVmObject = (vmObjectId: string) => {
    resetDeleteModal();
    deleteVmObject({
      variables: {
        vmObjectId,
      },
    });
  };

  return (
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
                      setDeleteModalData({
                        objectName: row.name,
                        isOpen: true,
                        onClose: resetDeleteModal,
                        onSubmit: () => handleDeleteVmObject(row.id),
                      });
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
  );
};
