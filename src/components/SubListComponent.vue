<style scoped>
.sub-list {
  max-height: 45%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Ensure rounded corners are visible */
  background-color: #2c2c34;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header-container {
  position: sticky; /* ensure the headline remain fixed when scroll the contents */
  top: 0; /* ensure the headline remain fixed when scroll the contents */
  display: flex;
  align-items: center;
  justify-content: space-between; /* Ensures header and input are on opposite sides */
  padding: 0 1rem; /* Add padding for spacing */
  background-color: #4f5061; /* Match the navbar color */
  color: #ffffff;
  border-radius: 12px;
  border-bottom: 2px solid #3c3d4a; /* Bottom border for emphasis */
  transition: background-color 0.3s;
}

.header-container:hover {
  background-color: #3c3d4a; /* Darker shade on hover */
}

.list-header {
  font-size: 1.2rem;
  cursor: default;
}

.list-input {
  width: 80px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #ffffff;
  color: #333; /* Dark text color for input */
}

.list-content {
  flex-grow: 1;
  overflow: auto; /* Vertical scrolling for content */
}

.list-content > table {
  width: 100%;
  border-collapse: collapse; /* Remove gaps between cells */
}

.list-content th,
.list-content td {
  padding: 0.75rem;
  text-align: center;
  width: 30%;
  color: #ddd;
}

.list-content th {
  border-bottom: 1px solid; /* Light border for row separation */
}
</style>
<template>
  <div class="sub-list">
    <div class="header-container" @click="toggleList">
      <h2 class="list-header">{{ title }}</h2>
      <input
        type="number"
        v-model.number="recordLimit"
        min="1"
        :max="data.length"
        class="list-input"
        placeholder="Number of records"
        @click.stop
      />
    </div>

    <div class="list-content" v-show="isVisible">
      <table>
        <!-- Dynamic headers -->
        <thead>
          <th v-for="(header, index) in headers" :key="index">
            {{ header }}
          </th>
        </thead>
        <!-- Dynamic rows -->
        <tbody>
          <tr v-for="record in visibleData" :key="record.id">
            <td v-for="(displayFunction, index) in columns" :key="index">
              {{ displayFunction(record) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'

// Props from the ListComponent
const props = defineProps({
  title: String,
  headers: Array, //(e.g., ["Name", "Type", "Value"])
  columns: Array, //(e.g., [(item) => item.name])
  data: Array
})

// Reactive variable for list visibility
const isVisible = ref(true)
const recordLimit = ref(1)

// Method to toggle the list vibility
const toggleList = () => {
  isVisible.value = !isVisible.value
}

// Computed property for filtering items based on record limit
const visibleData = computed(() => {
  // Ensure recordLimit is within valid bounds
  const limit = Math.max(1, Math.min(recordLimit.value, props.data.length))
  return props.data.slice(0, limit)
})

// Initialize recordLimit with a default value and watch for changes
watch(
  () => props.data.length,
  (newLength) => {
    // Update recordLimit if items are provided and adjust accordingly
    if (recordLimit.value < newLength) {
      recordLimit.value = newLength
    }
  },
  { immediate: true }
)
</script>
