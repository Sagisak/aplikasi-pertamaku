<script setup>
import { ref } from 'vue';
import CommentSection from './components/CommentSection.vue';

const userId = ref('');
const users = ref(null);
const oldEmail = ref('');
const newEmail = ref('');
const emailUserId = ref('');
const token = ref(''); // Store the token

const getUser = async () => {
  const response = await fetch(`http://localhost:3000/api/user/${userId.value}`);

  if (response.ok) {
    const data = await response.json();
    users.value = data.user;
    token.value = data.token; // Store the retrieved token
  } else {
    console.error('Failed to fetch user data:', response.status);
  }
};

const changeEmail = async () => {
  await fetch(`http://localhost:3000/api/user/${emailUserId.value}/change-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token.value, // Include the token in the request
    },
    body: JSON.stringify({
      oldEmail: oldEmail.value,
      newEmail: newEmail.value,
    }),
  });
};
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
      <input v-model="oldEmail" placeholder="Old Email" /> <!-- New input for Old Email -->
      <input v-model="newEmail" placeholder="New Email" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>
