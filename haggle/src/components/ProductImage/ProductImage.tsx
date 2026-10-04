import { useReducer, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Box,
  InputAdornment,
} from "@mui/material";
import OfferCount from "../OfferCount/OfferCount";
import ProductImg from "../ProductImg/ProductImg";

const ASKING_PRICE = 45;
const MAX_OFFERS = 5;

type BargainStatus = "idle" | "countered" | "accepted" | "limit";

interface BargainState {
  offerCount: number;
  lastOffer: number | null;
  counterOffer: number | null;
  status: BargainStatus;
  errorMsg: string | null;
}

type BargainAction =
  | { type: "SUBMIT_OFFER"; payload: number }
  | { type: "ACCEPT_COUNTER" }
  | { type: "RESTART" };

// The seller's discount off the asking price shrinks as the buyer's offer
// gets closer to it, and the result is always clamped between the buyer's
// offer and the asking price so the counter can never undercut the buyer.
function getCounterOffer(offer: number, asking: number): number {
  const ratio = offer / asking;
  let discount: number;
  if (ratio >= 0.9) discount = 0.02;
  else if (ratio >= 0.7) discount = 0.05;
  else if (ratio >= 0.5) discount = 0.1;
  else if (ratio >= 0.3) discount = 0.2;
  else discount = 0.3;

  const rawCounter = asking * (1 - discount);
  const counter = Math.min(asking, Math.max(rawCounter, offer));
  return Math.round(counter * 100) / 100;
}

const initialState: BargainState = {
  offerCount: 0,
  lastOffer: null,
  counterOffer: null,
  status: "idle",
  errorMsg: null,
};

function bargainReducer(state: BargainState, action: BargainAction): BargainState {
  switch (action.type) {
    case "SUBMIT_OFFER": {
      // Once the deal is done or the attempt limit is hit, further offers
      // are no-ops instead of silently continuing to count.
      if (state.status === "limit" || state.status === "accepted") return state;

      const offer = action.payload;

      if (Number.isNaN(offer) || offer <= 0) {
        return { ...state, errorMsg: "Enter an offer above $0." };
      }
      if (offer > ASKING_PRICE) {
        return {
          ...state,
          errorMsg: `Your offer can't be above the asking price of $${ASKING_PRICE}.`,
        };
      }

      // Only a valid, in-range offer counts as an attempt.
      const offerCount = state.offerCount + 1;

      if (offer === ASKING_PRICE) {
        return {
          ...state,
          offerCount,
          lastOffer: offer,
          counterOffer: ASKING_PRICE,
          status: "accepted",
          errorMsg: null,
        };
      }

      return {
        ...state,
        offerCount,
        lastOffer: offer,
        counterOffer: getCounterOffer(offer, ASKING_PRICE),
        status: offerCount >= MAX_OFFERS ? "limit" : "countered",
        errorMsg: null,
      };
    }
    case "ACCEPT_COUNTER":
      return state.counterOffer == null
        ? state
        : { ...state, status: "accepted", lastOffer: state.counterOffer };
    case "RESTART":
      return initialState;
    default:
      return state;
  }
}

const formatPrice = (value: number | null) => (value == null ? "—" : `$${value.toFixed(2)}`);

const ProdImg: React.FC = () => {
  const [state, dispatch] = useReducer(bargainReducer, initialState);
  const [offerInput, setOfferInput] = useState("");
  const { offerCount, lastOffer, counterOffer, status, errorMsg } = state;
  const isLocked = status === "accepted" || status === "limit";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: "SUBMIT_OFFER", payload: parseFloat(offerInput) });
    setOfferInput("");
  }

  function handleAccept() {
    dispatch({ type: "ACCEPT_COUNTER" });
  }

  function handleRestart() {
    dispatch({ type: "RESTART" });
    setOfferInput("");
  }

  return (
    <Card
      component="form"
      onSubmit={handleSubmit}
      variant="outlined"
      sx={{ width: "23rem", maxWidth: "100%", margin: "0 auto", borderRadius: 2 }}
    >
      <ProductImg />
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontStyle: "italic" }}>
          Basket of assorted items
        </Typography>

        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography>
            <Box component="span" sx={{ color: "text.secondary", fontWeight: "bold" }}>
              Asking price:
            </Box>{" "}
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {formatPrice(ASKING_PRICE)}
            </Box>
          </Typography>
          <Typography>
            <Box component="span" sx={{ color: "text.secondary", fontWeight: "bold" }}>
              Your last offer:
            </Box>{" "}
            {formatPrice(lastOffer)}
          </Typography>
          <Typography>
            <Box component="span" sx={{ color: "text.secondary", fontWeight: "bold" }}>
              Counter offer:
            </Box>{" "}
            <Box component="span" sx={{ fontWeight: "bold", color: "success.main" }}>
              {formatPrice(counterOffer)}
            </Box>
          </Typography>
        </Stack>

        {/* aria-live so screen reader users hear the result without a blocking alert() */}
        <Box aria-live="polite">
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}
          {status === "countered" && (
            <Alert severity="info" sx={{ mb: 2 }}>
              The seller counters at {formatPrice(counterOffer)}. Accept it or submit a new offer.
            </Alert>
          )}
          {status === "accepted" && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Deal! Final price {formatPrice(lastOffer)}.
            </Alert>
          )}
          {status === "limit" && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              You've used all {MAX_OFFERS} offers. Restart to try again.
            </Alert>
          )}
        </Box>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <TextField
            label="Your offer"
            type="number"
            size="small"
            fullWidth
            value={offerInput}
            onChange={(e) => setOfferInput(e.target.value)}
            disabled={isLocked}
            inputProps={{ min: 1, step: "0.01" }}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLocked || offerInput.trim() === ""}
          >
            Submit
          </Button>
        </Stack>

        {status === "countered" && (
          <Button onClick={handleAccept} variant="outlined" fullWidth sx={{ mb: 2 }}>
            Accept Counter Offer
          </Button>
        )}

        {isLocked && (
          <Button onClick={handleRestart} variant="outlined" fullWidth sx={{ mb: 2 }}>
            {status === "accepted" ? "Start a New Bargain" : "Restart Bargain"}
          </Button>
        )}

        <OfferCount count={offerCount} totalCount={MAX_OFFERS} />
      </CardContent>
    </Card>
  );
};

export default ProdImg;
