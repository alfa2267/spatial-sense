import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Client } from '../../types/domains/client.types';
import { getClients, createClient, updateClient, deleteClient } from '../../services/api';

interface ClientsState {
  clients: Client[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Normalize various address shapes to a single string as required by `Client.address`
function formatAddress(address: unknown): string {
  if (!address) return '';
  if (typeof address === 'string') return address;
  if (typeof address === 'object') {
    const obj = address as Record<string, string | undefined>;
    const { street, city, state, postalCode, country, ...rest } = obj;
    const parts = [street, city, state, postalCode, country, ...Object.values(rest)];
    return parts.filter(Boolean).join(', ');
  }
  return String(address);
}

const initialState: ClientsState = {
  clients: [],
  status: 'idle',
  error: null,
};

export const fetchClients = createAsyncThunk('clients/fetchClients', async () => {
  const response = await getClients();
  return response;
});

export const addNewClient = createAsyncThunk(
  'clients/addNewClient',
  async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await createClient(client);
    return response;
  }
);

export const updateExistingClient = createAsyncThunk(
  'clients/updateClient',
  async (client: { id: string; changes: Partial<Client> }) => {
    const response = await updateClient(client.id, client.changes);
    return response;
  }
);

export const removeClient = createAsyncThunk(
  'clients/deleteClient',
  async (clientId: string) => {
    await deleteClient(clientId);
    return clientId;
  }
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clientAdded: {
      reducer(state, action: PayloadAction<Client>) {
        state.clients.push(action.payload);
      },
      prepare(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {
        return {
          payload: {
            ...client,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      },
    },
    clientUpdated: (state, action: PayloadAction<{ id: string; changes: Partial<Client> }>) => {
      const { id, changes } = action.payload;
      const existingClient = state.clients.find(client => client.id === id);
      if (existingClient) {
        Object.assign(existingClient, { ...changes, updatedAt: new Date().toISOString() });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clients = action.payload.map(client => ({
          ...client,
          address: formatAddress((client as any).address),
        }));
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch clients';
      })
      .addCase(addNewClient.fulfilled, (state, action) => {
        const client = {
          ...action.payload,
          address: formatAddress((action.payload as any).address),
        } as Client;
        state.clients.push(client);
      })
      .addCase(updateExistingClient.fulfilled, (state, action) => {
        const { id } = action.payload;
        const existingClient = state.clients.find(client => client.id === id);
        if (existingClient) {
          const maybeAddress = (action.payload as any).address;
          const normalized = {
            ...action.payload,
            ...(maybeAddress !== undefined ? { address: formatAddress(maybeAddress) } : {}),
          } as Partial<Client> & { updatedAt?: string };
          Object.assign(existingClient, normalized);
        }
      })
      .addCase(removeClient.fulfilled, (state, action) => {
        const clientId = action.payload;
        state.clients = state.clients.filter(client => client.id !== clientId);
      });
  },
});

export const { clientAdded, clientUpdated } = clientsSlice.actions;

export default clientsSlice.reducer;

export const selectAllClients = (state: { clients: ClientsState }) => state.clients.clients;
export const getClientsStatus = (state: { clients: ClientsState }) => state.clients.status;
export const getClientsError = (state: { clients: ClientsState }) => state.clients.error;

export const selectClientById = (state: { clients: ClientsState }, clientId: string) =>
  state.clients.clients.find(client => client.id === clientId);
