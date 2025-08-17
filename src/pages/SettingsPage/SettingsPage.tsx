import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Restore as RestoreIcon,
  Edit as EditIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Storage as StorageIcon
} from '@mui/icons-material';
import { PageContainer, PageHeader } from '../../components';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  avatar?: string;
}

interface NotificationData {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  emailUpdates: boolean;
  weeklyReports: boolean;
  securityAlerts: boolean;
}

interface SecurityData {
  password: string;
  confirmPassword: string;
  twoFactorAuth: boolean;
  loginAlerts: boolean;
}

interface SectionSettings {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  order: number;
}

interface StrategySettings {
  showSectionNumbers: boolean;
  showTableOfContents: boolean;
  showPageNumbers: boolean;
  sections: SectionSettings[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const SettingsPage: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<SectionSettings | null>(null);

  // Form states
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    company: 'SpatialSense Ltd',
    jobTitle: 'Solutions Architect',
    avatar: ''
  });

  const [notificationData, setNotificationData] = useState<NotificationData>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    emailUpdates: true,
    weeklyReports: false,
    securityAlerts: true
  });

  const [securityData, setSecurityData] = useState<SecurityData>({
    password: '',
    confirmPassword: '',
    twoFactorAuth: false,
    loginAlerts: true
  });

  const [strategySettings, setStrategySettings] = useState<StrategySettings>({
    showSectionNumbers: true,
    showTableOfContents: true,
    showPageNumbers: true,
    sections: []
  });

  // Load initial data
  useEffect(() => {
    loadStrategySections();
  }, []);

  const loadStrategySections = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockSections: SectionSettings[] = [
        { id: '1', title: 'Executive Summary', description: 'High-level overview of the project', enabled: true, order: 1 },
        { id: '2', title: 'Market Analysis', description: 'Market trends and competitive landscape', enabled: true, order: 2 },
        { id: '3', title: 'Technical Assessment', description: 'Technical requirements and implementation details', enabled: true, order: 3 },
        { id: '4', title: 'Recommendations', description: 'Strategic recommendations and next steps', enabled: true, order: 4 },
        { id: '5', title: 'Budget & Timeline', description: 'Cost estimates and project timeline', enabled: false, order: 5 }
      ];
      setStrategySettings(prev => ({ ...prev, sections: mockSections }));
      setIsLoading(false);
    }, 1000);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleProfileSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleNotificationSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleSecuritySubmit = async () => {
    if (securityData.password && securityData.password !== securityData.confirmPassword) {
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (securityData.password) {
        setSecurityData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleStrategySettingsSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const resetStrategySettings = () => {
    setStrategySettings({
      showSectionNumbers: true,
      showTableOfContents: true,
      showPageNumbers: true,
      sections: strategySettings.sections.map(section => ({ ...section, enabled: true }))
    });
  };

  const openSectionModal = (section: SectionSettings) => {
    setCurrentSection(section);
    setShowModal(true);
  };

  const saveSectionSettings = () => {
    if (currentSection) {
      setStrategySettings(prev => ({
        ...prev,
        sections: prev.sections.map(section =>
          section.id === currentSection.id ? currentSection : section
        )
      }));
    }
    setShowModal(false);
    setCurrentSection(null);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        subtitle="Manage your account preferences and application settings"
      />

      <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab icon={<PersonIcon />} label="Profile" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<SecurityIcon />} label="Security" />
            <Tab icon={<SettingsIcon />} label="Strategy Settings" />
          </Tabs>
        </Box>

        <Box sx={{ flexGrow: 1, p: 3 }}>
          {/* Profile Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: 'primary.main',
                        fontSize: '3rem'
                      }}
                    >
                      {profileData.firstName.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      {profileData.firstName} {profileData.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {profileData.jobTitle}
                    </Typography>
                    <Chip label={profileData.company} variant="outlined" />
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      sx={{ mt: 2, display: 'block', mx: 'auto' }}
                    >
                      Change Photo
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 12, md: 8 }}>
                <Card>
                  <CardHeader title="Personal Information" />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Company"
                          value={profileData.company}
                          onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Job Title"
                          value={profileData.jobTitle}
                          onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleProfileSubmit}
                        disabled={isLoading}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </Paper>

      {/* Section Configuration Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Section Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Section Title"
              value={currentSection?.title || ''}
              onChange={(e) => setCurrentSection(prev => prev ? { ...prev, title: e.target.value } : null)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={currentSection?.description || ''}
              onChange={(e) => setCurrentSection(prev => prev ? { ...prev, description: e.target.value } : null)}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={currentSection?.enabled || false}
                  onChange={(e) => setCurrentSection(prev => prev ? { ...prev, enabled: e.target.checked } : null)}
                />
              }
              label="Enable this section"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveSectionSettings}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default SettingsPage;