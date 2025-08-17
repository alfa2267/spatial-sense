import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, { 
  Node, 
  Edge, 
  addEdge, 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  ConnectionMode,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { saveFloorPlanEditor, loadFloorPlanEditor } from '../../services/api';

// Custom Room Node Component
const RoomNode = ({ data }: { data: any }) => {
  return (
    <div className="room-node">
      <div className="room-header">
        <span className="room-icon">{data.icon}</span>
        <span className="room-name">{data.label}</span>
      </div>
      <div className="room-info">
        <div className="room-size">{data.size}</div>
        <div className="room-devices">{data.deviceCount} devices</div>
      </div>
    </div>
  );
};

// Custom Device Node Component
const DeviceNode = ({ data }: { data: any }) => {
  return (
    <div className="device-node">
      <div className="device-icon" style={{ color: data.color }}>
        {data.icon}
      </div>
      <div className="device-name">{data.label}</div>
      <div className="device-status">
        <span className={`status-dot ${data.online ? 'online' : 'offline'}`}></span>
        {data.online ? 'Online' : 'Offline'}
      </div>
    </div>
  );
};

// Node types
const nodeTypes = {
  room: RoomNode,
  device: DeviceNode,
};

// Device library
const SMART_DEVICES = [
  { type: 'smart-bulb', name: 'Smart Bulb', icon: '💡', color: '#ffc107' },
  { type: 'camera', name: 'Security Camera', icon: '📹', color: '#dc3545' },
  { type: 'thermostat', name: 'Thermostat', icon: '🌡️', color: '#0d6efd' },
  { type: 'sensor', name: 'Door Sensor', icon: '🚪', color: '#28a745' },
  { type: 'speaker', name: 'Smart Speaker', icon: '🔊', color: '#6f42c1' },
  { type: 'outlet', name: 'Smart Outlet', icon: '🔌', color: '#fd7e14' },
];

const FloorPlanEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [message, setMessage] = useState('Ready to import floor plan');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await loadFloorPlanEditor();
        if (savedData) {
          setNodes(savedData.nodes || []);
          setEdges(savedData.edges || []);
          setBackgroundImage(savedData.backgroundImage || null);
          showMessage('Floor plan loaded from storage');
        }
      } catch (error) {
        console.error('Failed to load saved floor plan:', error);
      }
    };

    loadSavedData();
  }, []);

  // Auto-save when nodes, edges, or background changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await saveFloorPlanEditor({
          nodes,
          edges,
          backgroundImage: backgroundImage || undefined
        });
      } catch (error) {
        console.error('Failed to save floor plan:', error);
      }
    };

    // Only save if there's actual data to save
    if (nodes.length > 0 || edges.length > 0 || backgroundImage) {
      saveData();
    }
  }, [nodes, edges, backgroundImage]);

  // Roboflow API configuration
  const ROBOFLOW_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual API key
  const ROBOFLOW_MODEL = "floor-plan_-room-detection/2";

  // Connect nodes
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // Show message
  const showMessage = (msg: string, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage('Ready'), duration);
  };

  // Upload and analyze floor plan
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show background image
    const imageUrl = URL.createObjectURL(file);
    setBackgroundImage(imageUrl);
    
    setIsAnalyzing(true);
    showMessage('Analyzing floor plan with AI...', 5000);

    try {
      // Roboflow API call
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`https://detect.roboflow.com/${ROBOFLOW_MODEL}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ROBOFLOW_API_KEY}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const result = await response.json();
      
      // Convert detections to React-Flow nodes
      const detectedRooms = result.predictions?.map((prediction: any, index: number) => {
        const roomTypes = {
          'kitchen': { icon: '🍳', name: 'Kitchen' },
          'bedroom': { icon: '🛏️', name: 'Bedroom' },
          'bathroom': { icon: '🚿', name: 'Bathroom' },
          'living': { icon: '🛋️', name: 'Living Room' },
          'dining': { icon: '🍽️', name: 'Dining Room' },
        };

        const roomType = roomTypes[prediction.class as keyof typeof roomTypes] || { icon: '📦', name: 'Room' };
        
        return {
          id: `room-${index}`,
          type: 'room',
          position: { 
            x: prediction.x - prediction.width / 2, 
            y: prediction.y - prediction.height / 2 
          },
          data: {
            label: `${roomType.name} ${index + 1}`,
            icon: roomType.icon,
            size: `${Math.round(prediction.width)}×${Math.round(prediction.height)}`,
            deviceCount: 0,
            confidence: prediction.confidence
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        };
      }) || [];

      setNodes(detectedRooms);
      showMessage(`Detected ${detectedRooms.length} rooms successfully!`);
      
    } catch (error) {
      console.error('Room detection failed:', error);
      showMessage('Room detection failed. You can add rooms manually.');
      
      // Add a sample room if detection fails
      setNodes([{
        id: 'room-1',
        type: 'room',
        position: { x: 200, y: 100 },
        data: {
          label: 'Sample Room',
          icon: '🏠',
          size: '200×150',
          deviceCount: 0
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add device to canvas
  const addDevice = (deviceType: string) => {
    const device = SMART_DEVICES.find(d => d.type === deviceType);
    if (!device) return;

    const newDevice = {
      id: `device-${Date.now()}`,
      type: 'device',
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      data: {
        label: device.name,
        icon: device.icon,
        color: device.color,
        online: Math.random() > 0.3, // Random online status
        deviceType: device.type
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    setNodes((nds) => [...nds, newDevice]);
    showMessage(`${device.name} added to floor plan`);
  };

  // Add manual room
  const addRoom = () => {
    const roomIcons = ['🛏️', '🍳', '🛋️', '🚿', '🏢', '📚'];
    const randomIcon = roomIcons[Math.floor(Math.random() * roomIcons.length)];
    
    const newRoom = {
      id: `room-${Date.now()}`,
      type: 'room',
      position: { x: 150, y: 150 },
      data: {
        label: 'New Room',
        icon: randomIcon,
        size: '150×120',
        deviceCount: 0
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    setNodes((nds) => [...nds, newRoom]);
    showMessage('Room added manually');
  };

  // Clear canvas
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleConfirmClear = async () => {
    setNodes([]);
    setEdges([]);
    setBackgroundImage(null);
    
    // Clear saved data as well
    try {
      await saveFloorPlanEditor({ nodes: [], edges: [] });
    } catch (error) {
      console.error('Failed to clear saved floor plan:', error);
    }
    
    showMessage('Canvas cleared');
    setConfirmOpen(false);
  };

  const clearCanvas = () => {
    handleConfirmOpen();
  };

  return (
    <div className="floor-plan-app">
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Clear Canvas
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to clear all rooms and devices? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmClear} color="error" autoFocus>
            Clear All
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-section">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          
          <button 
            className="btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? '🔄 Analyzing...' : '📁 Import Floor Plan'}
          </button>
          
          <button className="btn-secondary" onClick={addRoom}>
            🏠 Add Room
          </button>
          
          <button className="btn-danger" onClick={clearCanvas}>
            🗑️ Clear
          </button>
        </div>
        
        <div className="status">
          <span>{message}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* React-Flow Canvas */}
        <div className="flow-container">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            style={{
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              opacity: backgroundImage ? 0.3 : 1
            }}
          >
            <Background color="#f1f1f1" gap={20} />
            <Controls />
            <MiniMap 
              nodeColor="#0d6efd"
              maskColor="rgba(255, 255, 255, 0.2)"
              style={{ background: '#f8f9fa' }}
            />
          </ReactFlow>
        </div>

        {/* Device Library */}
        <div className="device-library">
          <h3>Smart Devices</h3>
          <p className="library-hint">Click to add devices to your floor plan</p>
          
          <div className="device-grid">
            {SMART_DEVICES.map((device) => (
              <div
                key={device.type}
                className="device-card"
                onClick={() => addDevice(device.type)}
              >
                <div className="device-card-icon" style={{ color: device.color }}>
                  {device.icon}
                </div>
                <div className="device-card-name">{device.name}</div>
              </div>
            ))}
          </div>
          
          <div className="library-stats">
            <div className="stat">
              <span className="stat-number">{nodes.filter(n => n.type === 'room').length}</span>
              <span className="stat-label">Rooms</span>
            </div>
            <div className="stat">
              <span className="stat-number">{nodes.filter(n => n.type === 'device').length}</span>
              <span className="stat-label">Devices</span>
            </div>
            <div className="stat">
              <span className="stat-number">{edges.length}</span>
              <span className="stat-label">Connections</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .floor-plan-app {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8f9fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          background: white;
          border-bottom: 1px solid #e9ecef;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .toolbar-section {
          display: flex;
          gap: 12px;
        }

        .btn-primary, .btn-secondary, .btn-danger {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .btn-primary {
          background: #0d6efd;
          color: white;
        }

        .btn-primary:hover {
          background: #0b5ed7;
        }

        .btn-primary:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #5c636a;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        .status {
          font-size: 14px;
          color: #6c757d;
          font-weight: 500;
        }

        .main-content {
          flex: 1;
          display: flex;
          margin: 20px;
          gap: 20px;
        }

        .flow-container {
          flex: 1;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .device-library {
          width: 280px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .device-library h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 18px;
        }

        .library-hint {
          margin: 0 0 20px 0;
          color: #6c757d;
          font-size: 13px;
        }

        .device-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .device-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 8px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
        }

        .device-card:hover {
          border-color: #0d6efd;
          background: #f8f9ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .device-card-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .device-card-name {
          font-size: 12px;
          color: #6c757d;
          text-align: center;
          font-weight: 500;
        }

        .library-stats {
          display: flex;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 20px;
          font-weight: 600;
          color: #0d6efd;
        }

        .stat-label {
          font-size: 11px;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Custom Node Styles */
        :global(.room-node) {
          background: white;
          border: 2px solid #0d6efd;
          border-radius: 8px;
          padding: 12px;
          min-width: 140px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        :global(.room-header) {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        :global(.room-icon) {
          font-size: 18px;
        }

        :global(.room-name) {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        :global(.room-info) {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        :global(.room-size) {
          font-size: 12px;
          color: #6c757d;
        }

        :global(.room-devices) {
          font-size: 11px;
          color: #28a745;
          font-weight: 500;
        }

        :global(.device-node) {
          background: white;
          border: 2px solid #28a745;
          border-radius: 8px;
          padding: 10px;
          min-width: 120px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        :global(.device-icon) {
          font-size: 20px;
          margin-bottom: 6px;
        }

        :global(.device-name) {
          font-size: 12px;
          font-weight: 600;
          color: #333;
          margin-bottom: 6px;
        }

        :global(.device-status) {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 10px;
          color: #6c757d;
        }

        :global(.status-dot) {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #dc3545;
        }

        :global(.status-dot.online) {
          background: #28a745;
        }
      `}</style>
    </div>
  );
};

export default FloorPlanEditor;