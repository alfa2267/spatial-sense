<div class="row mb-4">
    <div class="col-md-12">
        <div class="d-flex justify-content-between align-items-center">
            <h2 class="mb-0">Reports</h2>
            <div class="d-flex align-items-center">
                <div class="btn-group me-2">
                    <button class="btn btn-primary" id="createReportBtn">
                        <i class="fas fa-plus me-2"></i>Create Report
                    </button>
                    <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="visually-hidden">Toggle Dropdown</span>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" id="newProposalBtn"><i class="fas fa-file-contract me-2"></i>New Proposal</a></li>
                        <li><a class="dropdown-item" href="#" id="newAssessmentBtn"><i class="fas fa-clipboard-check me-2"></i>New Assessment</a></li>
                        <li><a class="dropdown-item" href="#" id="newPlanBtn"><i class="fas fa-project-diagram me-2"></i>New Implementation Plan</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" id="importReportBtn"><i class="fas fa-file-import me-2"></i>Import Report</a></li>
                    </ul>
                </div>
                <div class="btn-group">
                    <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-download me-2"></i>Export
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item export-option" href="#" data-type="pdf">PDF</a></li>
                        <li><a class="dropdown-item export-option" href="#" data-type="excel">Excel</a></li>
                        <li><a class="dropdown-item export-option" href="#" data-type="csv">CSV</a></li>
                    </ul>
                </div>
                <button type="button" class="btn btn-outline-primary ms-2" id="templateEditorBtn">
                    <i class="fas fa-edit me-2"></i>Template Editor
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Quick Stats -->
<div class="row mb-4">
    <div class="col-md-3">
        <div class="card bg-primary text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="card-title mb-0">Total Reports</h6>
                        <h2 class="mb-0" id="totalReports">0</h2>
                    </div>
                    <i class="fas fa-file-alt fa-2x opacity-50"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-success text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="card-title mb-0">Completed</h6>
                        <h2 class="mb-0" id="completedReports">0</h2>
                    </div>
                    <i class="fas fa-check-circle fa-2x opacity-50"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-warning text-dark">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="card-title mb-0">In Progress</h6>
                        <h2 class="mb-0" id="inProgressReports">0</h2>
                    </div>
                    <i class="fas fa-spinner fa-2x opacity-50"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-info text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="card-title mb-0">Templates</h6>
                        <h2 class="mb-0" id="totalTemplates">3</h2>
                    </div>
                    <i class="fas fa-clipboard-list fa-2x opacity-50"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-4 mb-4">
        <div class="dashboard-card h-100">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <h5 class="card-title">Sarah Johnson</h5>
                    <span class="badge bg-success">Completed</span>
                </div>
                <p class="text-muted small">3-bed Victorian, Kensington</p>
                <p class="card-text">Comprehensive home automation report with energy efficiency recommendations and implementation plan.</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">Last updated: 15 May 2023</small>
                    <div>
                        <button class="btn btn-sm btn-outline-primary me-1">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-4 mb-4">
        <div class="dashboard-card h-100">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <h5 class="card-title">Marcus Chen</h5>
                    <span class="badge bg-warning">Draft</span>
                </div>
                <p class="text-muted small">Modern Apartment, Shoreditch</p>
                <p class="card-text">Initial assessment and proposed smart home solutions for a modern apartment setup.</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">Last updated: 28 May 2023</small>
                    <div>
                        <button class="btn btn-sm btn-outline-primary me-1">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-4 mb-4">
        <div class="dashboard-card h-100">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <h5 class="card-title">Emma Wilson</h5>
                    <span class="badge bg-success">Completed</span>
                </div>
                <p class="text-muted small">Penthouse, Canary Wharf</p>
                <p class="card-text">Luxury home automation system design with premium audio-visual integration.</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">Last updated: 10 Apr 2023</small>
                    <div>
                        <button class="btn btn-sm btn-outline-primary me-1">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-8">
        <div class="dashboard-card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Recent Reports</h5>
                <div class="input-group" style="width: 300px;">
                    <span class="input-group-text"><i class="fas fa-search"></i></span>
                    <input type="text" class="form-control" id="reportSearch" placeholder="Search reports...">
                </div>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
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
                            <!-- Reports will be loaded here dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-md-4">
     
        
        <!-- Recent Activity -->
        <div class="dashboard-card">
            <div class="card-header">
                <h5 class="mb-0">Recent Activity</h5>
            </div>
            <div class="card-body p-0">
                <div class="list-group list-group-flush" id="recentActivity">
                    <!-- Activity items will be loaded here -->
                    <div class="list-group-item">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">New Report Created</h6>
                            <small>Just now</small>
                        </div>
                        <p class="mb-1">Proposal for Sarah Johnson</p>
                        <small class="text-muted">By You</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- New Report Modal -->
<div class="modal fade" id="reportModal" tabindex="-1" aria-labelledby="reportModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="reportModalLabel">Create New Report</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="reportForm">
                    <input type="hidden" id="reportId">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="clientSelect" class="form-label">Client</label>
                            <select class="form-select" id="clientSelect" required>
                                <option value="" selected disabled>Select a client</option>
                                <!-- Will be populated dynamically -->
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="projectSelect" class="form-label">Project (Optional)</label>
                            <select class="form-select" id="projectSelect">
                                <option value="" selected>Select a project (optional)</option>
                                <!-- Will be populated dynamically -->
                            </select>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="reportTitle" class="form-label">Report Title</label>
                        <input type="text" class="form-control" id="reportTitle" placeholder="e.g., Home Automation Proposal for [Client]" required>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Select Template</label>
                        <div class="row g-3" id="templateSelection">
                            <div class="col-md-4 template-option" data-template="proposal">
                                <div class="card h-100 template-card">
                                    <div class="card-body text-center">
                                        <div class="template-icon mb-3">
                                            <i class="fas fa-file-contract fa-3x text-primary"></i>
                                        </div>
                                        <h5>Proposal</h5>
                                        <p class="text-muted small">Create a professional client proposal</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 template-option" data-template="assessment">
                                <div class="card h-100 template-card">
                                    <div class="card-body text-center">
                                        <div class="template-icon mb-3">
                                            <i class="fas fa-clipboard-check fa-3x text-success"></i>
                                        </div>
                                        <h5>Assessment</h5>
                                        <p class="text-muted small">Property assessment report</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 template-option" data-template="implementation">
                                <div class="card h-100 template-card">
                                    <div class="card-body text-center">
                                        <div class="template-icon mb-3">
                                            <i class="fas fa-project-diagram fa-3x text-info"></i>
                                        </div>
                                        <h5>Implementation</h5>
                                        <p class="text-muted small">Project implementation plan</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="reportDescription" class="form-label">Description (Optional)</label>
                        <textarea class="form-control" id="reportDescription" rows="2"></textarea>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="reportStatus" class="form-label">Status</label>
                            <select class="form-select" id="reportStatus">
                                <option value="draft">Draft</option>
                                <option value="in_progress">In Progress</option>
                                <option value="pending_review">Pending Review</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="reportDueDate" class="form-label">Due Date (Optional)</label>
                            <input type="date" class="form-control" id="reportDueDate">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Attachments</label>
                        <div class="dropzone border rounded p-3 text-center" id="fileDropzone">
                            <i class="fas fa-cloud-upload-alt fa-3x text-muted mb-2"></i>
                            <p class="text-muted mb-1">Drag & drop files here or click to browse</p>
                            <p class="small text-muted mb-0">Supports JPG, PNG, PDF, DOCX (Max 10MB)</p>
                            <input type="file" id="fileUpload" class="d-none" multiple>
                        </div>
                        <div id="filePreview" class="mt-2">
                            <!-- File previews will appear here -->
                        </div>
                    </div>
                    
                    <!-- Signature Section -->
                    <div class="mb-3">
                        <label class="form-label">Client Signature</label>
                        <div class="border rounded p-3 text-center">
                            <canvas id="signatureCanvas" class="signature-canvas" width="100%" height="200"></canvas>
                            <div class="mt-2">
                                <button type="button" class="btn btn-sm btn-outline-danger me-2" id="clearSignature">
                                    <i class="fas fa-eraser me-1"></i> Clear
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-success" id="saveSignature">
                                    <i class="fas fa-save me-1"></i> Save Signature
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="reportDescription" class="form-label">Description</label>
                        <textarea class="form-control" id="reportDescription" rows="3"></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Sections to Include</label>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="executive" id="sectionExec" checked>
                            <label class="form-check-label" for="sectionExec">
                                Executive Summary
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="current" id="sectionCurrent" checked>
                            <label class="form-check-label" for="sectionCurrent">
                                Current Assessment
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="recommendations" id="sectionRecs" checked>
                            <label class="form-check-label" for="sectionRecs">
                                Recommendations
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="timeline" id="sectionTimeline">
                            <label class="form-check-label" for="sectionTimeline">
                                Implementation Timeline
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="budget" id="sectionBudget">
                            <label class="form-check-label" for="sectionBudget">
                                Budget & ROI
                            </label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="createReportBtn">
                    <i class="fas fa-magic me-2"></i>Generate Report
                </button>
            </div>
        </div>
    </div>
</div>
