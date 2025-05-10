import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; 

// Get all available topics
export const getTopics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/topics/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
};

// Subscribe a user or check existing subscription
export const subscribeUser = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/subscribe/`, { email });
    return response.data;
  } catch (error) {
    console.error('Error subscribing user:', error);
    throw error;
  }
};

// Update user's selected topics
export const updateUserTopics = async (email, topicIds) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/subscriber-topics/${encodeURIComponent(email)}/`,
      { topic_ids: topicIds }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user topics:', error);
    throw error;
  }
};

// Update user's email address
export const updateUserEmail = async (currentEmail, newEmail) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/update-email/${encodeURIComponent(currentEmail)}/`,
      { new_email: newEmail }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};

// Get user's current topics
export const getUserTopics = async (email) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/subscriber-topics/${encodeURIComponent(email)}/`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user topics:', error);
    throw error;
  }
};