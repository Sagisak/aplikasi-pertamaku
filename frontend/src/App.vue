<script setup>
import { ref, onMounted } from 'vue';
import CommentSection from './components/CommentSection.vue';

const userId = ref('');
const users = ref(null);
const oldEmail = ref('');
const newEmail = ref('');
const emailUserId = ref('');
const token = ref(''); // Retrieve token from local storage
const successMessage = ref(''); // Reactive variable for success message

// Fetch the token when the component is mounted
const fetchToken = async () => {
  try {
    const response = await fetch('api/user/token');
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('authToken', data.token); // Store token securely
      token.value = data.token; // You can still keep it in a ref for immediate use
    } else {
      console.error('Failed to fetch token:', response.status);
    }
  } catch (error) {
    console.error('Error fetching token:', error);
  }
};

// Get the token from localStorage when needed
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Fetch user info
const getUser = async () => {
  const response = await fetch(`api/user/${userId.value}`, {
    headers: {
      'Authorization': getToken(), // Include the token for this request
    },
  });

  if (response.ok) {
    const data = await response.json();
    users.value = data.user;
  } else {
    console.error('Failed to fetch user data:', response.status);
  }
};

// Change email
const changeEmail = async () => {
  const response = await fetch(`api/user/${emailUserId.value}/change-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getToken(), // Include the token in the request
    },
    body: JSON.stringify({
      oldEmail: oldEmail.value,
      newEmail: newEmail.value,
    }),
  });

  if (response.ok) {
    successMessage.value = 'Email updated successfully to ' + newEmail.value; // Update success message
    // Optionally, clear the email input fields
    oldEmail.value = '';
    newEmail.value = '';
  } else {
    console.error('Failed to change email:', response.status);
    successMessage.value = ''; // Clear success message if there's an error
  }
};

// Fetch the token when the component is mounted
onMounted(() => {
  fetchToken();
});
</script>

<template>
  <div id="app">
    <h1>User Dashboard</h1>
    <div>
      <input v-model="userId" placeholder="Enter User ID" />
      <button @click="getUser">Get User Info</button>
    </div>
    <div v-if="users">
      <template v-for="user in users">
        <h2>{{ user.name }}</h2>
        <hr />
      </template>
    </div>
    <CommentSection />
    <form @submit.prevent="changeEmail">
      <h3>Change Email</h3>
      <input v-model="emailUserId" placeholder="User ID for Email Change" />
      <input v-model="oldEmail" placeholder="Old Email" />
      <input v-model="newEmail" placeholder="New Email" />
      <button type="submit">Submit</button>
    </form>
    <div v-if="successMessage" style="color: green; margin-top: 10px;">
      {{ successMessage }} <!-- Display success message -->
    </div>
  </div>
</template>
