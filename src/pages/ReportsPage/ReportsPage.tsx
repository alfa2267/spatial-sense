<div className="row mb-4">
    <div className="col-md-12">
        <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Reports</h2>
            <div className="d-flex align-items-center">
                <div className="btn-group me-2">
                    <button className="btn btn-primary" id="createReportBtn">
                        <i className="fas fa-plus me-2"></i>Create Report
                    </button>
                    <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                        <span className="visually-hidden">Toggle Dropdown</span>
                    </button>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#" id="newProposalBtn"><i className="fas fa-file-contract me-2"></i>New Proposal</a></li>
                        <li><a className="dropdown-item" href="#" id="newAssessmentBtn"><i className="fas fa-clipboard-check me-2"></i>New Assessment</a></li>
                        <li><a className="dropdown-item" href="#" id="newPlanBtn"><i className="fas fa-project-diagram me-2"></i>New Implementation Plan</a></li>
                        <li><hr className="dropdown-divider"></li>
                        <li><a className="dropdown-item" href="#" id="importReportBtn"><i className="fas fa-file-import me-2"></i>Import Report</a></li>
                    </ul>
                </div>
                <div className="btn-group">
                    <button type="button" className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fas fa-download me-2"></i>Export
                    </button>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item export-option" href="#" data-type="pdf">PDF</a></li>
                        <li><a className="dropdown-item export-option" href="#" data-type="excel">Excel</a></li>
                        <li><a className="dropdown-item export-option" href="#" data-type="csv">CSV</a></li>
                    </ul>
                </div>
                <button type="button" className="btn btn-outline-primary ms-2" id="templateEditorBtn">
                    <i className="fas fa-edit me-2"></i>Template Editor
                </button>
            </div>
        </div>
    </div>
</div>

{/* Quick Stats */}
<div className="row mb-4">
    <div className="col-md-3">
        <div className="card bg-primary text-white">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="card-title mb-0">Total Reports</h6>
                        <h2 className="mb-0" id="totalReports">0</h2>
                    </div>
                    <i className="fas fa-file-alt fa-2x opacity-50"></i>
                </div>
            </div>
        </div>
    </div>
    <div className="col-md-3">
        <div className="card bg-success text-white">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="card-title mb-0">Completed</h6>
                        <h2 className="mb-0" id="completedReports">0</h2>
                    </div>
                    <i className="fas fa-check-circle fa-2x opacity-50"></i>
                </div>
            </div>
        </div>
    </div>
    <div className="col-md-3">
        <div className="card bg-warning text-dark">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="card-title mb-0">In Progress</h6>
                        <h2 className="mb-0" id="inProgressReports">0</h2>
                    </div>
                    <i className="fas fa-spinner fa-2x opacity-50"></i>
                </div>
            </div>
        </div>
    </div>
    <div className="col-md-3">
        <div className="card bg-info text-white">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="card-title mb-0">Templates</h6>
                        <h2 className="mb-0" id="totalTemplates">3</h2>
                    </div>
                    <i className="fas fa-clipboard-list fa-2x opacity-50"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<div className="row">
    <div className="col-md-4 mb-4">
        <div className="dashboard-card h-100">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title">Sarah Johnson</h5>
                    <span className="badge bg-success">Completed</span>
                </div>
                <p className="text-muted small">3-bed Victorian, Kensington</p>
                <p className="card-text">Comprehensive home automation report with energy efficiency recommendations and implementation plan.</p>
                <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Last updated: 15 May 2023</small>
                    <div>
                        <button className="btn btn-sm btn-outline-primary me-1">
                            <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                            <i className="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="col-md-4 mb-4">
        <div className="dashboard-card h-100">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title">Marcus Chen</h5>
                    <span className="badge bg-warning">Draft</span>
                </div>
                <p className="text-muted small">Modern Apartment, Shoreditch</p>
                <p className="card-text">Initial assessment and proposed smart home solutions for a modern apartment setup.</p>
                <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Last updated: 28 May 2023</small>
                    <div>
                        <button className="btn btn-sm btn-outline-primary me-1">
                            <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                            <i className="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="col-md-4 mb-4">
        <div className="dashboard-card h-100">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title">Emma Wilson</h5>
                    <span className="badge bg-success">Completed</span>
                </div>
                <p className="text-muted small">Penthouse, Canary Wharf</p>
                <p className="card-text">Luxury home automation system design with premium audio-visual integration.</p>
                <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Last updated: 10 Apr 2023</small>
                    <div>
                        <button className="btn btn-sm btn-outline-primary me-1">
                            <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                            <i className="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div className="row">
    <div className="col-md-8">
        <div className="dashboard-card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Reports</h5>
                <div className="input-group" style={{width: "300px"}}>
                    <span className="input-group-text"><i className="fas fa-search"></i></span>
                    <input type="text" className="form-control" id="reportSearch" placeholder="Search reports..." />
                </div>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Report Title</th>
                                <th>Client</th>
                                <th>Type</th>
                                <th>Last Updated</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="reportsList">
                            {/* Reports will be loaded here dynamically */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
    <div className="col-md-4">
     
        
        {/* Recent Activity */}
        <div className="dashboard-card">
            <div className="card-header">
                <h5 className="mb-0">Recent Activity</h5>
            </div>
            <div className="card-body p-0">
                <div className="list-group list-group-flush" id="recentActivity">
                    {/* Activity items will be loaded here */}
                    <div className="list-group-item">
                        <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">New Report Created</h6>
                            <small>Just now</small>
                        </div>
                        <p className="mb-1">Proposal for Sarah Johnson</p>
                        <small className="text-muted">By You</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

{/* New Report Modal */}
<div className="modal fade" id="reportModal" tabIndex="-1" aria-labelledby="reportModalLabel" aria-hidden="true">
    <div className="modal-dialog modal-lg">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="reportModalLabel">Create New Report</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <form id="reportForm">
                    <input type="hidden" id="reportId" />
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="clientSelect" className="form-label">Client</label>
                            <select className="form-select" id="clientSelect" required>
                                <option value="" selected disabled>Select a client</option>
                                {/* Will be populated dynamically */}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="projectSelect" className="form-label">Project (Optional)</label>
                            <select className="form-select" id="projectSelect">
                                <option value="" selected>Select a project (optional)</option>
                                {/* Will be populated dynamically */}
                            </select>
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="reportTitle" className="form-label">Report Title</label>
                        <input type="text" className="form-control" id="reportTitle" placeholder="e.g., Home Automation Proposal for [Client]" required />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Select Template</label>
                        <div className="row g-3" id="templateSelection">
                            <div className="col-md-4 template-option" data-template="proposal">
                                <div className="card h-100 template-card">
                                    <div className="card-body text-center">
                                        <div className="template-icon mb-3">
                                            <i className="fas fa-file-contract fa-3x text-primary"></i>
                                        </div>
                                        <h5>Proposal</h5>
                                        <p className="text-muted small">Create a professional client proposal</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 template-option" data-template="assessment">
                                <div className="card h-100 template-card">
                                    <div className="card-body text-center">
                                        <div className="template-icon mb-3">
                                            <i className="fas fa-clipboard-check fa-3x text-success"></i>
                                        </div>
                                        <h5>Assessment</h5>
                                        <p className="text-muted small">Property assessment report</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 template-option" data-template="implementation">
                                <div className="card h-100 template-card">
                                    <div className="card-body text-center">
                                        <div className="template-icon mb-3">
                                            <i className="fas fa-project-diagram fa-3x text-info"></i>
                                        </div>
                                        <h5>Implementation</h5>
                                        <p className="text-muted small">Project implementation plan</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="reportDescription" className="form-label">Description (Optional)</label>
                        <textarea className="form-control" id="reportDescription" rows={2}></textarea>
                    </div>
                    
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="reportStatus" className="form-label">Status</label>
                            <select className="form-select" id="reportStatus">
                                <option value="draft">Draft</option>
                                <option value="in_progress">In Progress</option>
                                <option value="pending_review">Pending Review</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="reportDueDate" className="form-label">Due Date (Optional)</label>
                            <input type="date" className="form-control" id="reportDueDate" />
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Attachments</label>
                        <div className="dropzone border rounded p-3 text-center" id="fileDropzone">
                            <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-2"></i>
                            <p className="text-muted mb-1">Drag & drop files here or click to browse</p>
                            <p className="small text-muted mb-0">Supports JPG, PNG, PDF, DOCX (Max 10MB)</p>
                            <input type="file" id="fileUpload" className="d-none" multiple />
                        </div>
                        <div id="filePreview" className="mt-2">
                            {/* File previews will appear here */}
                        </div>
                    </div>
                    
                    {/* Signature Section */}
                    <div className="mb-3">
                        <label className="form-label">Client Signature</label>
                        <div className="border rounded p-3 text-center">
                            <canvas id="signatureCanvas" className="signature-canvas" width="100%" height="200"></canvas>
                            <div className="mt-2">
                                <button type="button" className="btn btn-sm btn-outline-danger me-2" id="clearSignature">
                                    <i className="fas fa-eraser me-1"></i> Clear
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-success" id="saveSignature">
                                    <i className="fas fa-save me-1"></i> Save Signature
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="reportDescription" className="form-label">Description</label>
                        <textarea className="form-control" id="reportDescription" rows={3}></textarea>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Sections to Include</label>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="executive" id="sectionExec" defaultChecked />
                            <label className="form-check-label" htmlFor="sectionExec">
                                Executive Summary
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="current" id="sectionCurrent" defaultChecked />
                            <label className="form-check-label" htmlFor="sectionCurrent">
                                Current Assessment
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="recommendations" id="sectionRecs" defaultChecked />
                            <label className="form-check-label" htmlFor="sectionRecs">
                                Recommendations
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="timeline" id="sectionTimeline" />
                            <label className="form-check-label" htmlFor="sectionTimeline">
                                Implementation Timeline
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="budget" id="sectionBudget" />
                            <label className="form-check-label" htmlFor="sectionBudget">
                                Budget & ROI
                            </label>
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" id="createReportBtn">
                    <i className="fas fa-magic me-2"></i>Generate Report
                </button>
            </div>
        </div>
    </div>
</div>
