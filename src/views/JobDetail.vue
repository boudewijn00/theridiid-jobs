<template>
  <div class="table-container">
    <div class="job-listing">
      <div class="job-detail">
          <h1>{{ job.title }}</h1>
          <p>Company: {{ job.company }}</p>
          <p>Location: {{ job.location }}</p>
          <p>Type: {{ job.remote_work_model_type || 'N/A' }}</p>
          <p>Salary: {{ job.salary_min_yearly ? `€${job.salary_min_yearly} - €${job.salary_max_yearly}` : 'N/A' }}</p>
          <div class="job-snippet">
            <p>{{ job.snippet }}</p>
          </div>
      </div>
    </div>
  </div>
  <div class="info-container">
    <p><strong>Posted on:</strong> {{ formattedPosted }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const job = ref({});

const route = useRoute();

const formattedPosted = computed(() => {
  const date = new Date(job.value.external_created_at * 1000);
  return date.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' });
});

onMounted(async () => {
  const jobId = route.params.id;
  try {
    const authToken = import.meta.env.VITE_AUTH_TOKEN;
    const host = import.meta.env.VITE_HOST;
    const response = await axios.get(`${host}/indeed?external_id=eq.${jobId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    job.value = response.data[0];
  } catch (error) {
    console.error('Error fetching job details:', error);
  }
});
</script>

<style scoped>
.job-detail {
  padding: 20px;
  background-color: white;
}

.job-snippet {
  margin-top: 10px;
}
</style>
