import { useEffect, useState } from "react";
import { Alert, AppBar, Box, Container, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SellPage from "./pages/SellPage";
import ShopPage from "./pages/ShopPage";
import { useSaveFailed } from "./store/hooks";

type View = "shop" | "sell";

// The tab lives in the URL hash so a refresh or shared link keeps it.
const viewFromHash = (): View => (window.location.hash === "#sell" ? "sell" : "shop");

const App = () => {
  const [view, setView] = useState<View>(viewFromHash);
  const saveFailed = useSaveFailed();

  useEffect(() => {
    const onHashChange = () => setView(viewFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function changeView(next: View) {
    setView(next);
    window.history.replaceState(null, "", next === "sell" ? "#sell" : "#");
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <StorefrontIcon />
          <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
            ZoliMart
          </Typography>
          <Typography
            variant="body2"
            sx={{ opacity: 0.8, display: { xs: "none", sm: "block" }, flexGrow: 1 }}
          >
            The Bargain App
          </Typography>
          <Box sx={{ flexGrow: { xs: 1, sm: 0 } }} />
          <Tabs
            value={view}
            onChange={(_, next: View) => changeView(next)}
            textColor="inherit"
            TabIndicatorProps={{ sx: { bgcolor: "common.white" } }}
          >
            <Tab label="Shop" value="shop" />
            <Tab label="Sell" value="sell" />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ py: 4 }}>
        {saveFailed && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            This browser's storage is full, so recent changes will be lost when you reload.
            Remove some listings on the Sell tab to free up space.
          </Alert>
        )}
        {view === "shop" ? <ShopPage /> : <SellPage />}
      </Container>
    </Box>
  );
};

export default App;
