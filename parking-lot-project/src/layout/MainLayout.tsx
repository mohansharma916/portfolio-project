import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Parking Management System</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {" "}
        <Outlet />{" "}
      </Container>
    </Box>
  );
}
