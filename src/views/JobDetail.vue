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

<script>
import axios from 'axios';

export default {
  data() {
    return {
      job: {}
    };
  },
  async created() {
    const jobId = this.$route.params.id;
    try {
      const authToken = import.meta.env.VITE_AUTH_TOKEN;
      const host = import.meta.env.VITE_HOST;
      const response = await axios.get(`${host}/indeed?external_id=eq.${jobId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      this.job = response.data[0];
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  },
  computed: {
    formattedPosted() {
      const date = new Date(this.job.external_created_at * 1000);
      return date.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' });
    }
  }
};
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
