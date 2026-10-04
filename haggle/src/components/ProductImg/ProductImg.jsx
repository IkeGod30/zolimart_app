import { Box } from "@mui/material";
import basket from "../assets/voucher.jpg";

export default function ProductImg() {
  return (
    <Box
      component="img"
      src={basket}
      alt="Basket of assorted grocery items"
      sx={{
        display: "block",
        width: "100%",
        aspectRatio: "16 / 9",
        objectFit: "cover",
      }}
    />
  );
}
