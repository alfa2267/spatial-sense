export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
  location: string;
  lastSeen: string;
  batteryLevel?: number;
  signalStrength?: number;
  metadata?: Record<string, any>;
  /** Firmware version of the device */
  firmwareVersion?: string;
  /** Additional notes about the device */
  notes?: string;
  /** ISO timestamp of when the device was created */
  createdAt: string;
  /** ISO timestamp of when the device was last updated */
  updatedAt: string;
}

/**
 * Data required to create a new device
 */
export type CreateDeviceDTO = Omit<Device, 'id' | 'lastSeen'>;

/**
 * Data required to update an existing device
 */
export type UpdateDeviceDTO = Partial<Omit<Device, 'id' | 'createdAt' | 'updatedAt'>>;
