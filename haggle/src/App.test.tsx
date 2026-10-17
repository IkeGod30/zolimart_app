import { fireEvent, render, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { initialMarketState } from './store/marketSlice';
import { makeStore } from './store/index';

function renderApp() {
  window.location.hash = '';
  const store = makeStore(initialMarketState);
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  return store;
}

test('shows the demo listings in the shop', () => {
  renderApp();
  expect(screen.getByText('Grocery Basket Deal')).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /make an offer/i })).toHaveLength(20);
  for (const img of screen.getAllByRole('img')) {
    expect(img).toHaveAttribute('src', expect.stringMatching(/^\/images\/.+\.jpg$/));
  }
});

test('a seller lists an item and a buyer bargains it down to a deal', () => {
  const store = renderApp();

  // Seller lists an item.
  fireEvent.click(screen.getByRole('tab', { name: 'Sell' }));
  fireEvent.change(screen.getByLabelText(/item name/i), { target: { value: 'Desk Lamp' } });
  fireEvent.change(screen.getByLabelText(/seller name/i), { target: { value: 'Tony' } });
  fireEvent.change(screen.getByLabelText(/asking price/i), { target: { value: '40' } });
  fireEvent.change(screen.getByLabelText(/minimum price/i), { target: { value: '30' } });
  fireEvent.click(screen.getByRole('button', { name: /list item/i }));
  expect(store.getState().market.listings[0]).toMatchObject({
    title: 'Desk Lamp',
    askingPrice: 40,
    minimumPrice: 30,
  });

  // Buyer finds it and opens the bargain dialog.
  fireEvent.click(screen.getByRole('tab', { name: 'Shop' }));
  const card = screen.getByText('Desk Lamp').closest('.MuiCard-root') as HTMLElement;
  fireEvent.click(within(card).getByRole('button', { name: /make an offer/i }));
  const dialog = screen.getByRole('dialog');

  // A lowball offer is turned down.
  fireEvent.change(within(dialog).getByLabelText(/your offer/i), { target: { value: '20' } });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Offer' }));
  expect(within(dialog).getByText(/too low for the seller/i)).toBeInTheDocument();

  // An in-range offer gets a counter, which the buyer accepts.
  fireEvent.change(within(dialog).getByLabelText(/your offer/i), { target: { value: '32' } });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Offer' }));
  expect(within(dialog).getByText(/seller counters at/i)).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole('button', { name: /^accept/i }));
  expect(within(dialog).getByText(/deal!/i)).toBeInTheDocument();

  const sold = store.getState().market.listings[0].soldPrice!;
  expect(sold).toBeGreaterThanOrEqual(30);
  expect(sold).toBeLessThan(40);
}, 30_000); // MUI renders slowly under jsdom
