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

/* Select and Options */
select {
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
  text-align: center;
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

/* Buttons */
.type-header-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  position: relative;
}

.header-btn {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  font-size: 15px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s;
  position: absolute;
  right: 0;
  top: -2px;
}

.buttons {
  position: fixed;
  bottom: 30px;
  /* distance to the parent box, 30px far from the bottom */
  right: 30px;
  /* distance to the parent box, 30px far from the bottom */
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
  <div class="container">


    <!-- Notification -->
    <div v-if="notificationMessage" :class="['notification', notificationType]">
      {{ notificationMessage }}
    </div>
    <!-- Table -->
    <div class="table-container">
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
          <tr v-for="subtype in subTypes" :key="subtype.id" :class="{ focused: focusStatus === subtype.id }">
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
    <!-- Buttons -->
    <div class="buttons">
      <button class="remove-btn" @click="removeSubTypes" v-if="hasSelectedSubTypes">
        <i class="bi bi-trash-fill"></i>
      </button>
      <button class="add-btn" @click="clickAddBtn"><i class="bi bi-plus"></i></button>
    </div>
    <!-- Add Item Modal -->
    <AddSubTypeModal v-model:isVisible="isModalVisible" :types="types" :subTypes="subTypes"
      @postAddSubTypeRequest="postAddSubTypeRequest">
    </AddSubTypeModal>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { subTypeService, typeService } from '@/services/api.js'
import AddSubTypeModal from '@/components/AddSubTypeModal.vue';

// get data
const subTypes = ref([])
const types = ref([])

const getSubTypes = async () => {
  subTypes.value = await subTypeService.getSubTypesWithCount()
  console.log('fetched subtypes', subTypes.value)
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

//create
const isModalVisible = ref(false)

// Methods to handle button actions
const clickAddBtn = () => {
  isModalVisible.value = true
}

const postAddSubTypeRequest = async (subType) => {
  console.log(subType)
  const status = await subTypeService.createSubType(subType)
  // update current page's data immediately
  getSubTypes()

  // show notification
  if (status === 200) {
    showNotification('success', 'created successfully')
  } else {
    showNotification('fail', 'failed to create')
  }
}
// mounted
onMounted(() => {
  getSubTypes(), getTypes()
})
</script>
