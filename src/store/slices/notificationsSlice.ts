import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationItem {
  id: string;
  title: string;
  read?: boolean;
  createdAt: string;
}

interface NotificationsState {
  items: NotificationItem[];
}

const initialState: NotificationsState = {
  items: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<NotificationItem[]>) {
      state.items = action.payload;
    },
    addNotification(state, action: PayloadAction<Omit<NotificationItem, 'id'>>) {
      const id = `n-${Date.now()}`;
      state.items.unshift({ id, ...action.payload });
    },
    markRead(state, action: PayloadAction<string>) {
      const n = state.items.find(i => i.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead(state) {
      state.items.forEach(i => { i.read = true; });
    },
  },
});

export const { setNotifications, addNotification, markRead, markAllRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
