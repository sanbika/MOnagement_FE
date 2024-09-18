<style scoped>
.table-container {
  width: 50%;
  margin: 2rem;
  padding: 1rem;
  background-color: transparent;
  border-radius: 12px;
  overflow: hidden;
}

table {
  border-collapse: collapse;
  width: 100%;
  font-family: Arial, sans-serif;
  font-size: 0.9rem;
  caret-color: transparent;
}

th,
td {
  padding: 12px 16px;
  text-align: center;
  color: white;
  border-bottom: 1px solid white;
}

th {
  font-weight: bold;
}

td input {
  background-color: transparent;
  border: none;
  width: 100%;
  text-align: center;
  padding: 4px;
  color: white;
  caret-color: #3c3d4a;
}

td input:focus {
  outline: none;
  border-bottom: 1px solid #3c3d4a;
}

tr:hover,
tr.focused {
  background-color: white;
  transition: background-color 0.3s;
}

tr:hover *,
tr.focused * {
  color: #3c3d4a;
}

.notification {
  padding: 10px;
  margin: 10px;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  position: fixed;
  top: 10px;
  left: 50%;
  max-width: 300px;
  /* Limit the width */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.notification.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.notification.fail {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Below are different from typesview */
select {
  text-align: center;
  background-color: transparent;
  border-radius: 4px;
  border: 1px solid #ddd;
  border: none;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 4px;
  color: white;
  appearance: none;
}

option {
  color: #3c3d4a;
  /* Option text color after clicking */
  background-color: white;
  /* Optional: Background color for options */
}

select:focus {
  outline: none;
  border-bottom: 1px solid #3c3d4a;
  color: #3c3d4a;
}
</style>
<template>
  <div class="table-container">
    <!-- Notification -->
    <div v-if="notificationMessage" :class="['notification', notificationType]">
      {{ notificationMessage }}
    </div>
    <!-- Display Table -->
    <table>
      <thead>
        <tr>
          <th>Subtype</th>
          <th>Belong to</th>
          <th># of Items</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="subtype in subtypes" :key="subtype.id" :class="{ focused: focusStatus === subtype.id }">
          <td @click="beforeUpdate(subtype.id, 'name')">
            <input type="text" v-model="subtype.name" @blur="update(subtype.id, 'name', subtype.name)" />
          </td>
          <td @click="beforeUpdate(subtype.id, 'type_id')">
            <select v-model="subtype.type_id" @change="update(subtype.id, 'type_id', $event.target.value)">
              <option v-for="type in types" :value="type.id" :key="type.id">
                {{ type.name }}
              </option>
            </select>
          </td>
          <td>{{ subtype.sumItemsQuantity }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { subTypeService, typeService } from '@/services/api.js'

// get data
const subtypes = ref([])
const types = ref([])

const getSubTypes = async () => {
  subtypes.value = await subTypeService.getSubTypesWithCount()
  // console.log('fetched subtypes', subtypes.value)
}

const getTypes = async () => {
  types.value = await typeService.getTypesWithCount()
  // console.log('types', types.value)
}

// updates
let oldValue
const focusStatus = ref('') // td focus styles

const beforeUpdate = (id, field) => {
  console.log('id is ', id, 'field is ', field)
  oldValue = subtypes.value.filter((type) => type.id === id)[0][field]
  console.log('old Value is ', oldValue)
  focusStatus.value = id
}

const update = async (id, field, newValue) => {
  console.log('in update')
  if (oldValue != newValue) {
    console.log('invoke api')
    const status = await subTypeService.updateSubType(id, {
      [field]: newValue
    })

    // update current list
    getSubTypes()

    // show notification
    if (status === 200) {
      showNotification('success', `${field} update successfully`)
    } else {
      showNotification('fail', `failed to update ${field}`)
    }
  }
  // reset tr style
  focusStatus.value = null
}

// notification
const notificationMessage = ref('')
const notificationType = ref('') // 'success' or 'fail'

const showNotification = (status, message) => {
  notificationMessage.value = message
  notificationType.value = status

  // Hide notification after 2 seconds
  setTimeout(() => {
    notificationMessage.value = ''
    notificationType.value = ''
  }, 2000)
}
// mounted
onMounted(() => {
  getSubTypes(), getTypes()
})
</script>
