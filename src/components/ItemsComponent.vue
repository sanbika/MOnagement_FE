<style scoped>
table {
  border-collapse: collapse;
  width: 70%;
  font-family: Arial, sans-serif;
  caret-color: transparent;
}

th,
td {
  padding: 8px;
  text-align: center;
  caret-color: darkslategray;
}

th {
  background-color: #f4f4f4;
  border-bottom: 2px solid #ccc;
}

td {
  background-color: #fff;
}

select {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ddd;
}

input,
select {
  width: 100%;
  height: 100%;
  border: none;
  box-sizing: border-box;
  padding: 4px;
  text-align: center;
  font: inherit;
}

input:focus,
select:focus {
  outline: none;
  /* background-color: #f4f4f4; */
  width: 100%;
  height: 100%;
  border-bottom: 1px solid green;
}

.notification {
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px; /* Rounded corners for notifications */
  font-weight: bold;
  text-align: center;
  position: absolute; /* Position notification above the table */
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 300px;
}

.notification.success {
  background-color: #d4edda; /* Green background for success */
  color: #155724; /* Dark green text for success */
  border: 1px solid #c3e6cb; /* Green border for success */
}

.notification.error {
  background-color: #f8d7da; /* Red background for error */
  color: #721c24; /* Dark red text for error */
  border: 1px solid #f5c6cb; /* Red border for error */
}
</style>
<template>
  <!-- Notification -->
  <div v-if="notificationMessage" :class="['notification', notificationType]">
    {{ notificationMessage }}
  </div>
  <table>
    <thead>
      <tr>
        <th>
          <input type="checkbox" v-model="selectAll" @change="toggleAll" />
        </th>
        <th>Item</th>
        <th>Type</th>
        <th>Date</th>
        <th>Quantity</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>
          <input type="checkbox" :value="item.id" v-model="selectedIds" @change="emitSelection" />
        </td>
        <td>
          <input type="text" v-model="item.name" @blur="finishEditName(item.id, item.name)" />
        </td>
        <td @click="editingTypeItemId = item.id">
          <span v-if="editingTypeItemId !== item.id">{{ item.type.name }}</span>
          <select
            v-if="editingTypeItemId === item.id"
            @blur="finishEditType(item.id, $event.target.value)"
          >
            <option v-for="type in types" :value="type.id" :key="type.id">{{ type.name }}</option>
          </select>
        </td>
        <td @click="editingDateItemId = item.id">
          <span v-if="editingDateItemId !== item.id">{{ item.expirDate }}</span>
          <input
            v-if="editingDateItemId === item.id"
            type="date"
            v-model="item.expirDate"
            @blur="finishEditDate(item.id, $event.target.value)"
          />
        </td>
        <td>
          <input
            type="number"
            v-model="item.quantity"
            @change="finishEditQuantity(item.id, item.quantity)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({ items: Array, types: Array })
const emit = defineEmits(['update:selectedIds', 'updateItem'])
const selectedIds = ref([])
const editingTypeItemId = ref(null)
const editingDateItemId = ref(null)
// const editingNameItemId = ref(null)
// const editingQuantityItemId = ref(null)

// const originalValue = ref(null)

const selectAll = ref(false)

const notificationMessage = ref('')
const notificationType = ref('') // 'success' or 'error'

const showNotification = (status, message) => {
  // Show success notification
  notificationMessage.value = message
  notificationType.value = status
  setTimeout(() => {
    notificationMessage.value = ''
    notificationType.value = ''
  }, 2000) // Hide notification after 2 seconds
}

const emitSelection = () => {
  emit('update:selectedIds', selectedIds.value)
}

const emitUpdateItemField = (itemId, field, newValue) => {
  console.log(newValue)
  emit('updateItem', { itemId: itemId, field: field, newValue: newValue })
  showNotification('success', `${field} update successfully`)
}

const finishEditType = (itemId, typeId) => {
  editingTypeItemId.value = null
  emitUpdateItemField(itemId, 'type', typeId)
}

const finishEditDate = (itemId, date) => {
  editingDateItemId.value = null
  emitUpdateItemField(itemId, 'expirDate', date)
}

const finishEditName = (itemId, name) => {
  // editingNameItemId.value = null
  const originalValue = props.items.find((item) => item.id === itemId).name
  console.log(originalValue)
  console.log(name)
  if (originalValue != name) {
    console.log('in')
    emitUpdateItemField(itemId, 'name', name)
  }
}

const finishEditQuantity = (itemId, quantity) => {
  // editingQuantityItemId.value = null
  emitUpdateItemField(itemId, 'quantity', quantity)
}

const toggleAll = () => {
  if (selectAll.value) {
    // If selectAll is true, select all items
    selectedIds.value = props.items.map((item) => item.id)
  } else {
    // If selectAll is false, deselect all items
    selectedIds.value = []
  }
  emit('update:selectedIds', selectedIds.value)
}
</script>
