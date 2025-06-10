<template>
  <div class="job-item">
    <div class="job-view">
      <h2>{{ title }}</h2>
    </div>
    <div class="job-details">
      <span>{{ country }}</span>
      <span>{{ city }}</span>
      <span>{{ type }}</span>
    </div>
    <span>{{ salary }}</span>
    <span>{{ formattedPosted }}</span>
    <button @click="$router.push({ name: 'JobDetail', params: { id: external_id } })">details</button>
  </div>
</template>

<script>
export default {
  props: {
    external_id: String,
    title: String,
    country: String,
    city: String,
    type: String,
    salary: String,
    posted: {
      type: Number,
      required: true
    }
  },
  computed: {
    formattedPosted() {
      const date = new Date(this.posted * 1000);
      return date.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' });
    }
  }
};
</script>

<style scoped>
.job-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.job-item button {
  align-self: flex-end;
}

.job-details {
  display: flex;
  gap: 10px;
}

.job-view {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
