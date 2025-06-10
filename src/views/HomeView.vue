<script>
import axios from 'axios';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import JobItem from './JobItem.vue';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default {
  components: {
    Line,
    JobItem
  },
  async created() {
    try {
      this.isLoading = true;
      const authToken = import.meta.env.VITE_AUTH_TOKEN;
      const host = import.meta.env.VITE_HOST;
      const jobsResponse = await axios.get(`${host}/indeed?limit=5&order=external_created_at.desc`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      this.jobs = jobsResponse.data;

      const chartResponse = await axios.get(`${host}/indeed_jobs_grouped_by_year_month`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const chartData = chartResponse.data;
      const labels = chartData.map(item => new Date(item.month).toLocaleDateString('en-US', {
        month: 'numeric',
        year: 'numeric'
      }));

      const data = chartData.map(item => item.job_count);

      this.chartData.labels = labels;
      this.chartData.datasets[0].data = data;
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
    }
  },
  data() {
    return {
      jobs: [],
      isLoading: false,
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Jobs Posted',
            backgroundColor: '#70abab',
            data: []
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: {
              font: {
                family: "'Playfair Display', serif"
              }
            }
          }
        }
      }
    };
  },
};
</script>

<template>
  <div class="table-container">
    <div class="chart-container">
      <Line v-if="!isLoading" :data="chartData" :options="chartOptions"></Line>
    </div>
    <div class="job-listing">
      <JobItem
        v-for="job in jobs"
        :external_id="job.external_id"
        :title="job.title"
        :country="job.country"
        :city="job.location"
        :type="job.remote_work_model_type || 'N/A'"
        :salary="job.salary_min_yearly ? `€${job.salary_min_yearly} - €${job.salary_max_yearly}` : 'N/A'"
        :posted="job.external_created_at"
      />
      <button class="view-more-jobs" @click="$router.push({ name: 'MoreJobs' })">more jobs</button>
    </div>
  </div>
  <div class="info-container">
    <h2>Theridiid, <br/> the spider in the web</h2>
    <p>
      Jobs move fast — they’re posted, filled, and gone in the blink of an eye. At Theridiid, we spin a wide-reaching digital web to catch those opportunities before they vanish.
Like the spider in the web, we stay alert, scanning the air for new openings across the web — no matter how fleeting. The minute a job appears, we’ve got it.
    </p>
  </div>
</template>
