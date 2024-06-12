import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedConversation: null,
  messages: [],
  unreadCounts: {},
};

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setUnreadCounts: (state, action) => {
      state.unreadCounts = action.payload;
    },
    clearUnreadCount: (state, action) => {
      const conversationId = action.payload;
      if (state.unreadCounts[conversationId]) {
        state.unreadCounts[conversationId] = 0;
      }
    },
  },
});

export const {
  setSelectedConversation,
  setMessages,
  setUnreadCounts,
  clearUnreadCount,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;
