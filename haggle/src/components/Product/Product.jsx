import { Box, Typography } from "@mui/material";
import ProdImg from "../ProductImage/ProductImage.tsx";

function ProductComp() {
  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <Typography variant="h5" component="h2" color="primary" gutterBottom>
        Grocery Basket Deal
      </Typography>
      <ProdImg />
    </Box>
  );
}

export default ProductComp;
