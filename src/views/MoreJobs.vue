<template>
  <div class="filter-container">
      <h2>Filter Jobs</h2>
      <SelectRoot v-model="value">
        <SelectTrigger class="custom-select-trigger">
          <SelectValue class="custom-select-value" placeholder="Country" />
          <SelectIcon class="custom-select-icon" />
        </SelectTrigger>
        <SelectPortal>
          <SelectContent 
            class="custom-select-content" 
            position="popper"
          >
          <SelectViewport class="custom-select-viewport">
            <SelectItem
              v-for="option in options"
              :key="option"
              :value="option"
              class="custom-select-item"
            >
            <SelectItemText class="custom-select-item-text">{{ option }}</SelectItemText>
            <SelectItemIndicator class="custom-select-indicator" />
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
  </div>
  <div class="more-jobs-container">
    <div class="job-listing">
      <JobItem
        v-for="job in jobs"
        :key="job.external_id"
        :external_id="job.external_id"
        :title="job.title"
        :country="job.country"
        :city="job.location"
        :type="job.remote_work_model_type || 'N/A'"
        :salary="job.salary_min_yearly ? `€${job.salary_min_yearly} - €${job.salary_max_yearly}` : 'N/A'"
        :posted="job.external_created_at"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import JobItem from './JobItem.vue';

import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from 'reka-ui'

const value = ref()
const options = ['Netherlands', 'Germany', 'France', 'Belgium', 'Spain', 'Italy'];

const jobs = ref([]);
const countries = ref([]);
const types = ref([]);
const selectedCountry = ref('');
const selectedType = ref('');
const countryOptions = ref([]);
const typeOptions = ref([]);

const fetchJobs = async () => {
  try {
    const authToken = import.meta.env.VITE_AUTH_TOKEN;
    const host = import.meta.env.VITE_HOST;
    const response = await axios.get(`${host}/indeed?limit=10&order=external_created_at.desc`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    jobs.value = response.data;
    countries.value = [...new Set(jobs.value.map(job => job.country))];
    types.value = [...new Set(jobs.value.map(job => job.remote_work_model_type))];
    countryOptions.value = countries.value.map(country => ({ label: country, value: country }));
    typeOptions.value = types.value.map(type => ({ label: type, value: type }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }
};

const filterJobs = () => {
  // Implement filtering logic here
};

onMounted(fetchJobs);

watch(selectedCountry, filterJobs);
watch(selectedType, filterJobs);
</script>

<style>
.custom-select-trigger {
  width: 100%;
  padding: 8px 12px;
  cursor: pointer;
  display:inline-flex;
}

.custom-select-value {
  flex-grow: 1;
  font-family: 'Playfair Display', serif;
}

.custom-select-icon {
  margin-left: 8px;
  color: var(--min-cream);
}

.custom-select-content {
  background-color: white;
  margin-top: 4px;
  width: 250px;
  font-family: 'Playfair Display', serif; 
}

.custom-select-item {
  padding: 8px 12px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  outline: none;
}

.custom-select-item:hover {
  background-color: var(--tiffany-blue);
}
</style>
