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

tr>td:first-child>input {
  width: auto;
  padding: 0;
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

tr:hover .header-btn>i,
tr.focused .header-btn>i {
  color: white;
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

/* DIfferent parts with subtype view */
.container {
  display: flex;
  flex-direction: row;
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
    <!-- Display Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" />
            </th>
            <th>Item</th>
            <th>
              <div class="type-header-container">
                <span>Subtype</span>
                <button class="add-btn header-btn" @click.stop="clickAddTypeBtn">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </th>
            <th>Exp. Date</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <!-- Item Id checkbox  -->
            <td>
              <input type="checkbox" :value="item.id" v-model="selectedIds" />
            </td>
            <!-- Item name -->
            <td @click="beforeUpdate(item.id, 'name')">
              <input type="text" v-model="item.name" @blur="update(item.id, 'name', item.name)" />
            </td>
            <!-- Item subtype -->
            <td @click="beforeUpdate(item.id, 'sub_type_id')">
              <select v-model="item.subType.id" @change="update(item.id, 'sub_type_id', $event.target.value)">
                <option v-for="subType in subTypes" :value="subType.id" :key="subType.id">
                  {{ subType.name }}
                </option>
              </select>
            </td>
            <!-- Item Expiration Date -->
            <td @click="beforeUpdate(item.id, 'expiryDate')">
              <span v-show="editingDateItemId !== item.id">{{ item.expiryDate }}</span>
              <input ref="dateTag" v-if="editingDateItemId === item.id" type="date" v-model="item.expirDate"
                @blur="update(item.id, 'expiryDate', $event.target.value)" />
            </td>
            <!-- Item Quantity -->
            <td @click="beforeUpdate(item.id, 'quantity')">
              <input type="number" v-model="item.quantity" @blur="update(item.id, 'quantity', item.quantity)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Buttons -->
    <div class="buttons">
      <button class="remove-btn" @click="removeItems" v-if="hasSelectedItems">
        <i class="bi bi-trash-fill"></i>
      </button>
      <button class="add-btn" @click="clickAddBtn"><i class="bi bi-plus"></i></button>
    </div>
    <!-- Add Item Modal -->
    <AddItemModal v-model:isVisible="isModalVisible" :types="subTypes" @postAddItemRequest="postAddItemRequest">
    </AddItemModal>
    <!-- Add Type Modal -->
    <!-- <AddTypeModal v-model:isVisible="isTypeModalVisible" @postAddTypeRequest="postAddTypeRequest"></AddTypeModal> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { itemService, subTypeService } from '@/services/api.js'
import AddItemModal from '@/components/AddItemModal.vue'
// import AddTypeModal from '@/components/AddTypeModal.vue'

const items = ref([])
const subTypes = ref([])

// checkboxs
const selectedIds = ref([]) // selected checkboxes
const selectAll = ref(false)

// process toggleAll when checkbox on table head is changed
watch(selectAll, (value) => {
  if (value) {
    selectedIds.value = items.value.map((i) => i.id)
  } else {
    selectedIds.value = []
  }
})

// fetch data
const getItems = async () => {
  items.value = await itemService.getItems()
  // console.log('fetched items ', items.value)
}

const getSubTypes = async () => {
  subTypes.value = await subTypeService.getSubTypes()
  // console.log('fetched subTypes ', subTypes.value)
}

// Create a new item
// modal
const isModalVisible = ref(false)

// Methods to handle button actions
const clickAddBtn = () => {
  isModalVisible.value = true
}

const postAddItemRequest = async (item) => {
  const status = await itemService.createItem(item)
  // update current page's data immediately
  getItems()
  // , getExpireList(), getTobuyList()

  // show notification
  if (status === 200) {
    showNotification('success', 'created successfully')
  } else {
    showNotification('fail', 'failed to create')
  }
}

// Delete selected Items
// 不能在async()里传入值，除非在上面@click调用时也指定传入的值，否则会被当成默认click event的传值

// Computed property to check if there are selected items
const hasSelectedItems = computed(() => selectedIds.value.length > 0)

const removeItems = async () => {
  const itemIds = selectedIds.value
  const status = await itemService.deleteItems(itemIds)

  // update current page's data immediately
  getItems()
  selectedIds.value = []

  // show notification
  if (status === 200) {
    showNotification('success', 'removed successfully')
  } else {
    showNotification('fail', 'failed to remove')
  }
}

// update items
const dateTag = ref(null)
const editingTypeItemId = ref(null)
const editingDateItemId = ref(null)
let oldValue
// create focus in select/input date html tag
// (this is to ensure @blur works well, otherwise some style problem will be caused)
const beforeUpdate = (itemId, field) => {
  // record the old value before update
  oldValue = items.value.filter((item) => item.id === itemId)[0][field]
  oldValue = oldValue.id // because item['type'] = {id:, name:,}, but only need to pass id to api
  if (field === 'expiryDate') {
    editingDateItemId.value = itemId
    // selectTag.value is an array with only 1 element (if use v-show, the array will have the same length of items list)
    nextTick(() => {
      dateTag.value[0].focus()
    })
  }
}

const update = async (itemId, field, newValue) => {
  if (oldValue != newValue) {
    const status = await itemService.updateItem(itemId, {
      [field]: newValue
    })
    // update current list
    getItems()

    // show notification
    if (status === 200) {
      showNotification('success', `${field} update successfully`)
    } else {
      showNotification('fail', `failed to update ${field}`)
    }
  }

  // cancel the selection style of a record
  editingTypeItemId.value = null
  editingDateItemId.value = null
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
  getItems(), getSubTypes()
})
</script>
