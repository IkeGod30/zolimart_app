import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { initialMarketState } from './store/marketSlice';
import { makeStore } from './store/index';

// jsdom can't decode images, so stand in for the canvas downscaling.
vi.mock('./lib/image', () => ({
  imageFileToDataUrl: async (file: File) => `data:image/jpeg;name=${file.name}`,
}));

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

const photoFiles = (...names: string[]) =>
  names.map((name) => new File(['x'], name, { type: 'image/jpeg' }));

async function addPhotos(...names: string[]) {
  const before = screen.queryAllByRole('button', { name: /remove photo/i }).length;
  fireEvent.change(screen.getByLabelText('Add photos'), {
    target: { files: photoFiles(...names) },
  });
  await waitFor(() =>
    expect(screen.getAllByRole('button', { name: /remove photo/i })).toHaveLength(
      before + names.length
    )
  );
}

test('a seller lists an item and a buyer bargains it down to a deal', async () => {
  const store = renderApp();

  // Seller fills in the listing, but with only 2 photos it's refused.
  fireEvent.click(screen.getByRole('tab', { name: 'Sell' }));
  fireEvent.change(screen.getByLabelText(/item name/i), { target: { value: 'Desk Lamp' } });
  fireEvent.change(screen.getByLabelText(/seller name/i), { target: { value: 'Tony' } });
  fireEvent.change(screen.getByLabelText(/asking price/i), { target: { value: '40' } });
  fireEvent.change(screen.getByLabelText(/minimum price/i), { target: { value: '30' } });
  await addPhotos('front.jpg', 'side.jpg');
  fireEvent.click(screen.getByRole('button', { name: /list item/i }));
  expect(screen.getByText(/1 more needed/i)).toBeInTheDocument();
  expect(store.getState().market.listings[0].title).not.toBe('Desk Lamp');

  // A third photo lets it through.
  await addPhotos('back.jpg');
  fireEvent.click(screen.getByRole('button', { name: /list item/i }));
  expect(store.getState().market.listings[0]).toMatchObject({
    title: 'Desk Lamp',
    askingPrice: 40,
    minimumPrice: 30,
    photos: [
      { url: 'data:image/jpeg;name=front.jpg' },
      { url: 'data:image/jpeg;name=side.jpg' },
      { url: 'data:image/jpeg;name=back.jpg' },
    ],
  });

  // Buyer clicks the item and sees its details and all three photos.
  fireEvent.click(screen.getByRole('tab', { name: 'Shop' }));
  fireEvent.click(screen.getByRole('button', { name: /view details for desk lamp/i }));
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByText('Item details')).toBeInTheDocument();
  expect(within(dialog).getByRole('img', { name: /photo 1 of 3/i })).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Show photo 3 of 3' }));
  expect(within(dialog).getByRole('img', { name: /photo 3 of 3/i })).toHaveAttribute(
    'src',
    'data:image/jpeg;name=back.jpg'
  );

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
