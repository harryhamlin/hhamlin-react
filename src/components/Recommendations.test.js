import React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Recommendations from './Recommendations';

const answer = {
  blocks: [{ text: 'Try Prolog for light-roast filter coffee.', citations: [1] }],
  sources: [{ id: 1, title: 'Prolog', url: 'https://prologcoffee.com/' }], searchUsed: true,
};
beforeEach(() => { global.fetch = jest.fn(); });
afterEach(() => { jest.restoreAllMocks(); });
const open = () => {
  render(<Recommendations activeList="coffee" />);
  fireEvent.click(screen.getByRole('button', { name: /Recommend something to me/ }));
};

test('asks the backend, displays linked citations, and supplies history for follow-ups', async () => {
  fetch.mockResolvedValue({ ok: true, json: async () => answer });
  open();
  fireEvent.change(screen.getByLabelText('What are you looking for?'), { target: { value: 'Which coffee bar?' } });
  fireEvent.click(screen.getByRole('button', { name: 'Ask Claude' }));
  await screen.findByText('Try Prolog for light-roast filter coffee.');
  expect(screen.getByRole('link', { name: 'Source 1: Prolog' })).toHaveAttribute('href', 'https://prologcoffee.com/');
  const first = JSON.parse(fetch.mock.calls[0][1].body);
  expect(first).toEqual({ question: 'Which coffee bar?', activeList: 'coffee', history: [] });
  expect(fetch.mock.calls[0][1].headers).toEqual({ 'Content-Type': 'application/json' });
  fireEvent.change(screen.getByLabelText('Ask a follow-up'), { target: { value: 'And a pastry?' } });
  fireEvent.click(screen.getByRole('button', { name: 'Ask Claude' }));
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  expect(JSON.parse(fetch.mock.calls[1][1].body).history).toEqual([
    { role: 'user', content: 'Which coffee bar?' },
    { role: 'assistant', content: 'Try Prolog for light-roast filter coffee.' },
  ]);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Ask Claude' })).not.toBeEnabled());
});

test('failed requests preserve the question so it can be retried', async () => {
  fetch.mockResolvedValue({ ok: false, json: async () => ({ error: 'Recommendations are not available yet.' }) });
  open();
  const input = screen.getByLabelText('What are you looking for?');
  fireEvent.change(input, { target: { value: 'Lunch near the lakes?' } });
  fireEvent.click(screen.getByRole('button', { name: 'Ask Claude' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Recommendations are not available yet.');
  expect(input).toHaveValue('Lunch near the lakes?');
  expect(screen.getByRole('button', { name: 'Ask Claude' })).toBeEnabled();
});

test('a pending query can be cancelled and unsafe source URLs never become links', async () => {
  fetch.mockImplementation((url, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }));
  open();
  fireEvent.change(screen.getByLabelText('What are you looking for?'), { target: { value: 'Plan my day' } });
  fireEvent.click(screen.getByRole('button', { name: 'Ask Claude' }));
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Cancel' })));
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Ask Claude' })).toBeEnabled();
  fetch.mockResolvedValue({ ok: true, json: async () => ({ ...answer, sources: [{ id: 1, title: 'Bad link', url: 'javascript:alert(1)' }] }) });
  fireEvent.click(screen.getByRole('button', { name: 'Ask Claude' }));
  await screen.findByText('Try Prolog for light-roast filter coffee.');
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});
