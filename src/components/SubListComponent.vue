<style scoped>
.sub-list {
  max-height: 45%;
  display: flex;
  flex-direction: column;
}

.header-container {
  position: sticky; /* ensure the headline remain fixed when scroll the contents */
  top: 0; /* ensure the headline remain fixed when scroll the contents */
  display: flex;
  align-items: center;
  justify-content: space-between; /* Ensures header and input are on opposite sides */
  padding: 0 10px; /* Add padding for spacing */
  background-color: #ddd; /* Optional: background color to match header */
  border-radius: 12px;
  transition: background-color 0.3s;
}

.header-container:hover {
  background-color: #d4d4d4;
}

.list-header {
  cursor: default;
}

.list-input {
  width: 80px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  right: 2px;
}

.list-content {
  width: 100%;
  flex-grow: 1;
  overflow: auto;
}

.list-content > table {
  width: 100%;
}

table td {
  width: 33%;
  align-content: left;
}

tr td:nth-of-type(3) {
  text-align: center;
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
        :max="items.length"
        class="list-input"
        placeholder="Number of records"
        @click.stop
      />
    </div>

    <div class="list-content" v-show="isVisible">
      <table>
        <tr v-for="item in visibleItems" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.type.name }}</td>
          <td>{{ displayValue(item) }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'

// Props from the ListComponent
const props = defineProps({
  title: String,
  items: Array,
  displayValue: Function
})

// Reactive variable for list visibility
const isVisible = ref(true)
// const recordLimit = ref(props.items.length)
const recordLimit = ref(1)

// Method to toggle the list vibility
const toggleList = () => {
  isVisible.value = !isVisible.value
}

// Computed property for filtering items based on record limit
const visibleItems = computed(() => {
  // Ensure recordLimit is within valid bounds
  const limit = Math.max(1, Math.min(recordLimit.value, props.items.length))
  return props.items.slice(0, limit)
})

// Initialize recordLimit with a default value and watch for changes
watch(
  () => props.items.length,
  (newLength) => {
    // Update recordLimit if items are provided and adjust accordingly
    if (recordLimit.value < newLength) {
      recordLimit.value = newLength
    }
  },
  { immediate: true }
)
// Initialize recordLimit correctly after data is fetched
// onMounted(() => {
//   if (props.items.length > 0) {
//     recordLimit.value = props.items.length
//   }
// })
</script>
