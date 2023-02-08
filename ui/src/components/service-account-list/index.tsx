import {
  EditTwoTone,
  DeleteTwoTone,
  CheckTwoTone,
  BlockTwoTone,
} from "@mui/icons-material";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ButtonGroup,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import {
  useDeleteServiceAccountMutation,
  useListServiceAccountsQuery,
} from "../../api/generated/graphql";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

export const ServiceAccountList: React.FC<{
  setDeleteModalData: (data: {
    objectName: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
  }) => void;
  resetDeleteModal: () => void;
}> = ({ setDeleteModalData, resetDeleteModal }): React.ReactElement => {
  const {
    data: listServiceAccountsData,
    loading: listServiceAccountsLoading,
    error: listServiceAccountsError,
    refetch: refetchProviders,
  } = useListServiceAccountsQuery({
    fetchPolicy: "no-cache",
  });
  const [
    deleteServiceAccount,
    {
      data: deleteServiceAccountData,
      loading: deleteServiceAccountLoading,
      error: deleteServiceAccountError,
    },
  ] = useDeleteServiceAccountMutation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (listServiceAccountsError)
      enqueueSnackbar(
        `Couldn't get service accounts: ${listServiceAccountsError.message}`,
        {
          variant: "error",
        }
      );
  }, [listServiceAccountsError, enqueueSnackbar]);

  useEffect(() => {
    if (deleteServiceAccountError)
      enqueueSnackbar(
        `Couldn't delete service account: ${deleteServiceAccountError.message}`,
        {
          variant: "error",
        }
      );
  }, [deleteServiceAccountError, enqueueSnackbar]);

  useEffect(() => {
    if (deleteServiceAccountLoading)
      enqueueSnackbar("Deleteing service account...", {
        variant: "info",
        autoHideDuration: 2500,
      });
    else if (deleteServiceAccountData?.deleteServiceAccount) {
      enqueueSnackbar("Successfully deleted service account!", {
        variant: "success",
      });
      refetchProviders();
    }
  }, [
    deleteServiceAccountLoading,
    deleteServiceAccountData,
    refetchProviders,
    enqueueSnackbar,
  ]);

  const handleDeleteProvider = (id: string) => {
    resetDeleteModal();
    deleteServiceAccount({
      variables: {
        id,
      },
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: "100%" }} aria-label="providers table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="center">Display Name</TableCell>
            <TableCell align="center">API Key</TableCell>
            <TableCell align="center">Active?</TableCell>
            <TableCell align="right">Controls</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listServiceAccountsData?.serviceAccounts.map((serviceAccount) => (
            <TableRow
              key={serviceAccount.ID}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {serviceAccount.ID}
              </TableCell>
              <TableCell align="center">{serviceAccount.DisplayName}</TableCell>
              <TableCell align="center">
                <Typography
                  variant="caption"
                  component="code"
                  sx={{
                    mb: 1,
                  }}
                >
                  {serviceAccount.ApiKey}
                </Typography>
              </TableCell>
              <TableCell align="center">
                {serviceAccount.Active ? (
                  <CheckTwoTone color="success" />
                ) : (
                  <BlockTwoTone color="error" />
                )}
              </TableCell>
              <TableCell align="right">
                <ButtonGroup size="small">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      navigate(`/admin/service-account/${serviceAccount.ID}`)
                    }
                  >
                    <EditTwoTone />
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setDeleteModalData({
                        objectName: serviceAccount.DisplayName,
                        isOpen: true,
                        onClose: resetDeleteModal,
                        onSubmit: () => handleDeleteProvider(serviceAccount.ID),
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
              No Providers Found
            </TableCell>
          )}
          {listServiceAccountsLoading && (
            <TableCell colSpan={5} sx={{ textAlign: "center" }}>
              <CircularProgress />
            </TableCell>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
