import { useState } from 'react';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  FileDownload as DownloadIcon,
  Edit as EditIcon,
  Description as FileIcon,
  Assignment as ContractIcon,
  CheckCircle as CheckIcon,
  AccountTree as PlanIcon,
  FileUpload as ImportIcon,
} from '@mui/icons-material';
import { 
  PageContainer, 
  PageHeader, 
  FilterBar, 
  DataCard, 
  EmptyState,
  StatusChip 
} from '../../components';
import { useAppDispatch } from '../../store/store';
import { addNotification } from '../../store/slices/notificationsSlice';

// Mock data types
interface Report {
  id: string;
  title: string;
  type: 'proposal' | 'assessment' | 'plan';
  status: 'draft' | 'completed' | 'in_review';
  createdAt: string;
  updatedAt: string;
  client?: string;
}

const ReportsPage = () => {
  const [reports] = useState<Report[]>([
    {
      id: '1',
      title: 'Client Assessment Report',
      type: 'assessment',
      status: 'completed',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      client: 'Tech Corp Solutions',
    },
    {
      id: '2', 
      title: 'Implementation Proposal',
      type: 'proposal',
      status: 'in_review',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-22',
      client: 'Luxury Properties Ltd',
    }
  ]);

  const [createMenuAnchor, setCreateMenuAnchor] = useState<null | HTMLElement>(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const dispatch = useAppDispatch();

  const handleCreateReport = (type: string) => {
    console.log(`Creating ${type} report`);
    dispatch(addNotification({
      title: `Created new ${type} report`,
      read: false,
      createdAt: new Date().toISOString(),
    }));
    setCreateMenuAnchor(null);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`);
    dispatch(addNotification({
      title: `Exported reports as ${format.toUpperCase()}`,
      read: false,
      createdAt: new Date().toISOString(),
    }));
    setExportMenuAnchor(null);
  };

  const handleTemplateEditor = () => {
    console.log('Opening template editor');
    dispatch(addNotification({
      title: 'Opened template editor',
      read: false,
      createdAt: new Date().toISOString(),
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'proposal': return <ContractIcon />;
      case 'assessment': return <CheckIcon />;
      case 'plan': return <PlanIcon />;
      default: return <FileIcon />;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.client?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Quick stats
  const stats = [
    { title: 'Total Reports', value: reports.length.toString(), color: '#0d6efd' },
    { title: 'Completed', value: reports.filter(r => r.status === 'completed').length.toString(), color: '#198754' },
    { title: 'In Review', value: reports.filter(r => r.status === 'in_review').length.toString(), color: '#ffc107' },
    { title: 'Drafts', value: reports.filter(r => r.status === 'draft').length.toString(), color: '#6c757d' },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Reports"
        actions={[
          {
            label: 'Create Report',
            onClick: (event: any) => setCreateMenuAnchor(event.currentTarget),
            icon: <AddIcon />,
          },
          {
            label: 'Export',
            onClick: (event: any) => setExportMenuAnchor(event.currentTarget),
            icon: <DownloadIcon />,
            variant: 'outlined',
          },
          {
            label: 'Template Editor',
            onClick: (event) => { handleTemplateEditor(); },
            icon: <EditIcon />,
            variant: 'outlined',
          },
        ]}
      />

      {/* Quick Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {stats.map((stat, index) => (
          <Card key={index} sx={{ textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: stat.color, fontWeight: 'bold' }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search reports..."
        filters={[
          {
            id: 'type',
            label: 'Type',
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
              { value: 'all', label: 'All Types' },
              { value: 'proposal', label: 'Proposals' },
              { value: 'assessment', label: 'Assessments' },
              { value: 'plan', label: 'Plans' },
            ],
          },
          {
            id: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'all', label: 'All Statuses' },
              { value: 'completed', label: 'Completed' },
              { value: 'in_review', label: 'In Review' },
              { value: 'draft', label: 'Draft' },
            ],
          },
        ]}
        resultCount={filteredReports.length}
        resultLabel={filteredReports.length === 1 ? 'report' : 'reports'}
      />

      {/* Reports Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        {filteredReports.map((report) => (
          <DataCard
            key={report.id}
            title={report.title}
            subtitle={report.client || 'No client assigned'}
            onClick={() => console.log('View report:', report.id)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getTypeIcon(report.type)}
                <Chip 
                  label={report.type} 
                  size="small" 
                  variant="outlined" 
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>
              <StatusChip status={report.status as any} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Updated: {new Date(report.updatedAt).toLocaleDateString()}
              </Typography>
              <Button size="small" color="primary">
                View
              </Button>
            </Box>
          </DataCard>
        ))}
      </Box>

      {filteredReports.length === 0 && (
        <Box sx={{ mt: 4 }}>
          <EmptyState
            title="No Reports Found"
            description="Create your first report to get started"
            actionLabel="Create Report"
            onAction={(event: any) => setCreateMenuAnchor(event.currentTarget)}
            icon={<FileIcon />}
          />
        </Box>
      )}

      {/* Create Report Menu */}
      <Menu
        anchorEl={createMenuAnchor}
        open={Boolean(createMenuAnchor)}
        onClose={() => setCreateMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleCreateReport('proposal')}>
          <ContractIcon sx={{ mr: 1 }} />
          New Proposal
        </MenuItem>
        <MenuItem onClick={() => handleCreateReport('assessment')}>
          <CheckIcon sx={{ mr: 1 }} />
          New Assessment
        </MenuItem>
        <MenuItem onClick={() => handleCreateReport('plan')}>
          <PlanIcon sx={{ mr: 1 }} />
          New Implementation Plan
        </MenuItem>
        <MenuItem onClick={() => handleCreateReport('import')}>
          <ImportIcon sx={{ mr: 1 }} />
          Import Report
        </MenuItem>
      </Menu>

      {/* Export Menu */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={() => setExportMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleExport('pdf')}>PDF</MenuItem>
        <MenuItem onClick={() => handleExport('excel')}>Excel</MenuItem>
        <MenuItem onClick={() => handleExport('csv')}>CSV</MenuItem>
      </Menu>
    </PageContainer>
  );
};

export default ReportsPage;