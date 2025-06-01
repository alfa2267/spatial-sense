import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO } from '../types/domains/invoice.types';
import { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice } from '../services/api';

export const useInvoices = (params?: { clientId?: string; status?: string }) => {
  return useQuery<Invoice[], Error>({
    queryKey: ['invoices', params],
    queryFn: () => getInvoices(params),
  });
};

export const useInvoice = (id: string) => {
  return useQuery<Invoice, Error>({
    queryKey: ['invoices', id],
    queryFn: () => getInvoice(id),
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Invoice, Error, CreateInvoiceDTO>({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Invoice, Error, { id: string; data: UpdateInvoiceDTO }>({
    mutationFn: ({ id, data }) => updateInvoice(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', id] });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};
