import { useState } from 'react';
import { Grid, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ClientList } from './ClientList';
import { ClientDetails } from './ClientDetails';
import { ClientForm } from './ClientForm';
import { useClients } from '../../hooks/useClients';
import { Client } from '../../types/domains/client.types';
import { 
  PageContainer, 
  PageHeader, 
  FilterBar, 
  LoadingOverlay 
} from '../../components';

const ClientsPage = () => {
  const {
    filteredClients,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    addClient,
    updateClient,
    deleteClient,
  } = useClients();

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleEditClient = () => {
    if (selectedClient) {
      setEditingClient(selectedClient);
      setIsFormOpen(true);
    }
  };

  const handleDeleteClient = async () => {
    if (selectedClient && window.confirm(`Are you sure you want to delete ${selectedClient.name}?`)) {
      try {
        setIsSubmitting(true);
        await deleteClient(selectedClient.id);
        setSelectedClient(null);
      } catch (error) {
        console.error('Error deleting client:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFormSubmit = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      
      if (editingClient) {
        await updateClient({ id: editingClient.id, data: clientData });
      } else {
        const newClient = await addClient(clientData);
        setSelectedClient(newClient);
      }
      
      setIsFormOpen(false);
      setEditingClient(null);
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNote = (note: string) => {
    if (selectedClient) {
      const updatedNotes = selectedClient.notes 
        ? `${selectedClient.notes}\n\n--- ${new Date().toLocaleDateString()} ---\n${note}`
        : note;
      
      updateClient({ 
        id: selectedClient.id, 
        data: { notes: updatedNotes } 
      }).then(() => {
        // Update the selected client with the new notes
        setSelectedClient(prev => prev ? { ...prev, notes: updatedNotes } : null);
      });
    }
  };

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Clients" />
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading clients: {error.message}
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Clients"
        subtitle="Manage your client relationships and information"
        actions={[
          {
            label: 'Add Client',
            onClick: handleAddClient,
            icon: <AddIcon />,
            disabled: isSubmitting,
          },
        ]}
        loading={loading}
      />

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search clients..."
        filters={[
          {
            id: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'lead', label: 'Lead' },
            ],
          },
          {
            id: 'sort',
            label: 'Sort By',
            value: sortBy,
            onChange: setSortBy,
            options: [
              { value: 'name-asc', label: 'Name (A-Z)' },
              { value: 'name-desc', label: 'Name (Z-A)' },
              { value: 'date-asc', label: 'Oldest First' },
              { value: 'date-desc', label: 'Newest First' },
            ],
          },
        ]}
        resultCount={filteredClients.length}
        resultLabel={filteredClients.length === 1 ? 'client' : 'clients'}
        loading={loading}
      />

      {/* Main Content */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ClientList
            clients={filteredClients}
            selectedClient={selectedClient}
            onSelectClient={handleSelectClient}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <ClientDetails
            client={selectedClient}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
            onAddNote={handleAddNote}
          />
        </Grid>
      </Grid>

      {/* Add Client Form */}
      <ClientForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingClient(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingClient}
        loading={isSubmitting}
      />

      <LoadingOverlay
        loading={isSubmitting}
        variant="overlay"
      />
    </PageContainer>
  );
};

export default ClientsPage;
