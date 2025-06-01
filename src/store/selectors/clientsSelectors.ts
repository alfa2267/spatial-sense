import { RootState } from '../index';
import { Client } from '../../types/domains/client.types';

export const selectAllClients = (state: RootState) => state.clients.clients;

export const getClientsStatus = (state: RootState) => state.clients.status;

export const getClientsError = (state: RootState) => state.clients.error;

export const selectClientById = (state: RootState, clientId: string) =>
  state.clients.clients.find((client: Client) => client.id === clientId);

export const selectClientsByStatus = (state: RootState, status: string) =>
  state.clients.clients.filter((client: Client) => client.status === status);

export const selectClientsBySearchTerm = (state: RootState, searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  return state.clients.clients.filter(
    (client: Client) =>
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.company?.toLowerCase().includes(term) ||
      client.phone?.includes(term)
  );
};
