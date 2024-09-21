<style scoped>
.container {
  display: flex;
  flex-direction: row;
}

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

/* Notification */
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

/* Buttons */
.buttons {
  position: fixed;
  bottom: 30px;
  /* distance to the parent box, 30px far from the bottom */
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* distance between items in this container */
  caret-color: transparent;
}

.buttons>button {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s;
}

.add-btn {
  background-color: #2c2c34;
}

.add-btn:hover {
  background-color: #53535f;
}

.remove-btn {
  background-color: red;
}

.remove-btn:hover {
  background-color: darkred;
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
          <th>Type</th>
          <th># of Subtypes</th>
          <th># of Items</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="type in types" :key="type.id" :class="{ focused: focusStatus === type.id }">
          <td @click="beforeUpdate(type.id, 'name')">
            <input type="text" v-model="type.name" @blur="update(type.id, 'name', type.name)" />
          </td>
          <td>{{ type.sumSubTypesQuantity }}</td>
          <td>{{ type.sumItemsQuantity }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Buttons -->
  <div class="buttons">
    <button class="remove-btn" @click="removeTypes" v-if="hasSelectedItems">
      <i class="bi bi-trash-fill"></i>
    </button>
    <button class="add-btn" @click="clickAddBtn"><i class="bi bi-plus"></i></button>
  </div>
  <!-- Add Type Modal -->
  <AddTypeModal v-model:isVisible="isModalVisible" @postAddTypeRequest="postAddTypeRequest">
  </AddTypeModal>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { typeService } from '@/services/api.js'
import AddTypeModal from '@/components/AddTypeModal.vue'

// get data
const types = ref([])

const getTypes = async () => {
  types.value = await typeService.getTypesWithCount()
  // console.log(types.value)
}

// updates
let oldValue
const focusStatus = ref('') // td focus styles

const beforeUpdate = (id, field) => {
  oldValue = types.value.filter((type) => type.id === id)[0][field]
  focusStatus.value = id
}

const update = async (id, field, newValue) => {
  if (oldValue != newValue) {
    const status = await typeService.updateType(id, {
      [field]: newValue
    })

    // update current list
    getTypes()

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

// create
const isModalVisible = ref(false)

// Methods to handle button actions
const clickAddBtn = () => {
  isModalVisible.value = true
}

const postAddTypeRequest = async (type) => {
  const status = await typeService.createType(type)
  // update current page's data immediately
  getTypes()

  // show notification
  if (status === 200) {
    showNotification('success', 'created successfully')
  } else {
    showNotification('fail', 'failed to create')
  }
}

// mounted
onMounted(() => {
  getTypes()
})
</script>
