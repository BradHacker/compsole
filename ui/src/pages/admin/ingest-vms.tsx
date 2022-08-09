import { Save } from "@mui/icons-material";
import {
  Container,
  TextField,
  Typography,
  Divider,
  Skeleton,
  Autocomplete,
  Fab,
  CircularProgress,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ListCompetitionsQuery,
  useListCompetitionsQuery,
} from "../../api/generated/graphql";

export const IngestVMs: React.FC = (): React.ReactElement => {
  const {
    data: listCompetitionsData,
    loading: listCompetitionsLoading,
    error: listCompetitionsError,
  } = useListCompetitionsQuery();
  const [selectedCompetition, setSelectedCompetition] =
    useState<ListCompetitionsQuery["competitions"][0]>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return (
    <Container component="main" sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Ingest VMs</Typography>
      </Box>
      <Divider
        sx={{
          my: 2,
        }}
      />
      <Box
        component="form"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& .MuiTextField-root": {
            m: 1,
            minWidth: "40%",
            flexGrow: 1,
          },
        }}
        noValidate
        autoComplete="off"
      >
        <Autocomplete
          options={listCompetitionsData?.competitions ?? []}
          getOptionLabel={(c) => `${c.Name} (${c.CompetitionToProvider})`}
          renderInput={(params) => (
            <TextField {...params} label="Competition" />
          )}
          onChange={(event, value) => {
            setSelectedCompetition(
              value as ListCompetitionsQuery["competitions"][0]
            );
          }}
          isOptionEqualToValue={(option, value) => option.ID === value.ID}
          value={selectedCompetition}
          sx={{
            m: 1,
            minWidth: "50%",
            flexGrow: 1,
            "& .MuiTextField-root": {
              m: 0,
              minWidth: "40%",
              flexGrow: 1,
            },
          }}
        />
      </Box>
    </Container>
  );
};
