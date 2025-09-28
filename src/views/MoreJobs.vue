<template>
  <div class="filter-container">
    <h2>Filter Jobs</h2>
    <SelectRoot v-model="selectedCountry">
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
              v-for="option in countryOptions"
              :key="option.label"
              :value="option.value"
              class="custom-select-item"
            >
              <SelectItemText class="custom-select-item-text">{{ option.label }}</SelectItemText>
              <SelectItemIndicator class="custom-select-indicator" />
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
    <SelectRoot v-model="selectedSearchTerm">
      <SelectTrigger class="custom-select-trigger">
        <SelectValue class="custom-select-value" placeholder="Search Term" />
        <SelectIcon class="custom-select-icon" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent 
          class="custom-select-content" 
          position="popper"
        >
          <SelectViewport class="custom-select-viewport">
            <SelectItem
              v-for="option in searchTermOptions"
              :key="option.label"
              :value="option.value"
              class="custom-select-item"
            >
              <SelectItemText class="custom-select-item-text">{{ option.label }}</SelectItemText>
              <SelectItemIndicator class="custom-select-indicator" />
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
    <button class="inverted" @click="selectedCountry = ''; selectedSearchTerm = ''">Clear filter</button>  
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
        :company="job.company"
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

const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
  
const jobs = ref([]);
const countries = ref([]);
const searchTerms = ref([]);
const countryOptions = ref([]);
const searchTermOptions = ref([]);
const selectedCountry = ref('');
const selectedSearchTerm = ref('');

const fetchJobs = async () => {
  try {
    const authToken = import.meta.env.VITE_AUTH_TOKEN;
    const host = import.meta.env.VITE_HOST;
    let url = `${host}/indeed?limit=50&order=external_created_at.desc`;

    if (selectedCountry.value) {
      url += `&country=eq.${selectedCountry.value}`;
    }

    if (selectedSearchTerm.value) {
      url += `&search_term=eq.${selectedSearchTerm.value}`;
    }

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    jobs.value = response.data;
    countries.value = [...new Set(jobs.value.map(job => job.country))];
    countryOptions.value = countries.value.map(country => ({ label: countryNames.of(country), value: country }));
    searchTerms.value = [...new Set(jobs.value.map(job => job.search_term))];
    searchTermOptions.value = searchTerms.value.map(search_term => ({ label: search_term, value: search_term }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }
};

onMounted(fetchJobs);

watch(selectedCountry, fetchJobs);
watch(selectedSearchTerm, fetchJobs);
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

.filter-container button {
  margin-top: 20px;
}
</style>
