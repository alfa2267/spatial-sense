import React, { useState, useEffect } from 'react';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
}

interface NotificationData {
  emailNotifications: string;
  smsNotifications: string;
  pushNotifications: boolean;
}

interface SecurityData {
  password: string;
  confirmPassword: string;
  twoFactorAuth: boolean;
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

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<SectionSettings | null>(null);

  // Form states
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: ''
  });

  const [notificationData, setNotificationData] = useState<NotificationData>({
    emailNotifications: '',
    smsNotifications: '',
    pushNotifications: false
  });

  const [securityData, setSecurityData] = useState<SecurityData>({
    password: '',
    confirmPassword: '',
    twoFactorAuth: false
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
        { id: '1', title: 'Executive Summary', description: 'High-level overview', enabled: true, order: 1 },
        { id: '2', title: 'Market Analysis', description: 'Market trends and insights', enabled: true, order: 2 },
        { id: '3', title: 'Competitive Analysis', description: 'Competitor landscape', enabled: true, order: 3 },
        { id: '4', title: 'Recommendations', description: 'Strategic recommendations', enabled: true, order: 4 }
      ];
      setStrategySettings(prev => ({ ...prev, sections: mockSections }));
      setIsLoading(false);
    }, 1000);
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Profile updated successfully!');
      setIsLoading(false);
    }, 1000);
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Notification settings updated successfully!');
      setIsLoading(false);
    }, 1000);
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (securityData.password && securityData.password !== securityData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (securityData.password) {
        setSecurityData({ password: '', confirmPassword: '', twoFactorAuth: securityData.twoFactorAuth });
      }
      alert('Security settings updated successfully!');
      setIsLoading(false);
    }, 1000);
  };

  const handleStrategySettingsSubmit = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Strategy settings saved successfully!');
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Profile Information</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleProfileSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.company}
                    onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.jobTitle}
                    onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  />
                </div>
                <div className="text-end">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'strategy-settings':
        return (
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Strategy Report Settings</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={resetStrategySettings}>
                <i className="fas fa-undo me-1"></i>Reset to Defaults
              </button>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                Configure which sections should be included in your strategy reports.
              </div>
              
              <div className="sortable-sections mb-4">
                <div className="list-group">
                  {isLoading ? (
                    <div className="text-center p-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    strategySettings.sections.map((section) => (
                      <div key={section.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{section.title}</h6>
                          <small className="text-muted">{section.description}</small>
                        </div>
                        <div>
                          <div className="form-check form-switch me-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={section.enabled}
                              onChange={(e) => {
                                setStrategySettings(prev => ({
                                  ...prev,
                                  sections: prev.sections.map(s =>
                                    s.id === section.id ? { ...s, enabled: e.target.checked } : s
                                  )
                                }));
                              }}
                            />
                          </div>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openSectionModal(section)}
                          >
                            Configure
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="border-top pt-3 mt-3">
                <h6>Additional Options</h6>
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={strategySettings.showSectionNumbers}
                    onChange={(e) => setStrategySettings(prev => ({ ...prev, showSectionNumbers: e.target.checked }))}
                  />
                  <label className="form-check-label">Show section numbers</label>
                </div>
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={strategySettings.showTableOfContents}
                    onChange={(e) => setStrategySettings(prev => ({ ...prev, showTableOfContents: e.target.checked }))}
                  />
                  <label className="form-check-label">Include table of contents</label>
                </div>
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={strategySettings.showPageNumbers}
                    onChange={(e) => setStrategySettings(prev => ({ ...prev, showPageNumbers: e.target.checked }))}
                  />
                  <label className="form-check-label">Show page numbers</label>
                </div>
              </div>
              
              <div className="text-end mt-4">
                <button type="button" className="btn btn-primary" onClick={handleStrategySettingsSubmit} disabled={isLoading}>
                  <i className="fas fa-save me-1"></i>
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Notifications</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleNotificationSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email Notifications</label>
                    <input
                      type="email"
                      className="form-control"
                      value={notificationData.emailNotifications}
                      onChange={(e) => setNotificationData(prev => ({ ...prev, emailNotifications: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">SMS Notifications</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={notificationData.smsNotifications}
                      onChange={(e) => setNotificationData(prev => ({ ...prev, smsNotifications: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={notificationData.pushNotifications}
                      onChange={(e) => setNotificationData(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                    />
                    <label className="form-check-label">Push Notifications</label>
                  </div>
                </div>
                <div className="text-end">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Security</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSecuritySubmit}>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={securityData.password}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={securityData.twoFactorAuth}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                    />
                    <label className="form-check-label">Two-Factor Authentication</label>
                  </div>
                </div>
                <div className="text-end">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Settings</h5>
            </div>
            <div className="list-group list-group-flush">
              <button
                className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => handleTabClick('profile')}
              >
                <i className="fas fa-user me-2"></i>Profile
              </button>
              <button
                className={`list-group-item list-group-item-action ${activeTab === 'strategy-settings' ? 'active' : ''}`}
                onClick={() => handleTabClick('strategy-settings')}
              >
                <i className="fas fa-cogs me-2"></i>Strategy Settings
              </button>
              <button
                className={`list-group-item list-group-item-action ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => handleTabClick('notifications')}
              >
                <i className="fas fa-bell me-2"></i>Notifications
              </button>
              <button
                className={`list-group-item list-group-item-action ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => handleTabClick('security')}
              >
                <i className="fas fa-shield-alt me-2"></i>Security
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-9">
          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Modal for section configuration */}
      {showModal && currentSection && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Section Settings</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Section Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentSection.title}
                    onChange={(e) => setCurrentSection(prev => prev ? { ...prev, title: e.target.value } : null)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={currentSection.description}
                    onChange={(e) => setCurrentSection(prev => prev ? { ...prev, description: e.target.value } : null)}
                  ></textarea>
                </div>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={currentSection.enabled}
                    onChange={(e) => setCurrentSection(prev => prev ? { ...prev, enabled: e.target.checked } : null)}
                  />
                  <label className="form-check-label">Enable this section</label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveSectionSettings}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default Settings;