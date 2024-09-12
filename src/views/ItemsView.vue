<style scoped>
.container {
  display: flex;
  flex-direction: row;
}

.table {
  flex: 1;
  width: 70vw;
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
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

.lists {
  display: flex;
  flex-direction: column;
  margin: 20px;
  width: 20vw;
  height: 100vh;
  gap: 5vh;
  caret-color: transparent;
}

.buttons > button {
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
  background-color: green;
}

.add-btn:hover {
  background-color: darkgreen;
}

.remove-btn {
  background-color: red;
}

.remove-btn:hover {
  background-color: darkred;
}

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
}

th {
  background-color: #f4f4f4;
  /* border-bottom: 2px solid #ccc; */
  border-radius: 10px;
}

td {
  background-color: #fff;
  caret-color: darkslategray;
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
  margin: 10px;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  position: fixed;
  top: 10px;
  left: 50%;
  max-width: 300px; /* Limit the width */
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

.type-header-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.type-header-container > button {
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
}
</style>

<template>
  <div class="container">
    <!-- Notification -->
    <div v-if="notificationMessage" :class="['notification', notificationType]">
      {{ notificationMessage }}
    </div>
    <!-- Side Lists -->
    <div class="lists">
      <!-- Expire List -->
      <SubListComponent
        title="To Expire"
        :items="expireList"
        :display-value="(i) => i.expirDate"
      ></SubListComponent>

      <!-- To Buy List -->
      <SubListComponent
        title="To Buy"
        :items="toBuyList"
        :display-value="(i) => i.quantity"
      ></SubListComponent>
    </div>
    <!-- Display Table -->
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @change="toggleAll" />
            </th>
            <th>Item</th>
            <th>
              <div class="type-header-container">
                <span>Type</span
                ><button class="add-btn" @click.stop="clickAddTypeBtn">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </th>
            <th>Date</th>
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
            <td @click="beforeUpdateItem(item.id, 'name')">
              <input
                type="text"
                v-model="item.name"
                @blur="updateItem(item.id, 'name', item.name)"
              />
            </td>
            <!-- Item type -->
            <td @click="beforeUpdateItem(item.id, 'type')">
              <span v-show="editingTypeItemId !== item.id">{{ item.type.name }}</span>
              <select
                ref="selectTag"
                v-if="editingTypeItemId === item.id"
                v-model="item.type.id"
                @blur="updateItem(item.id, 'type', $event.target.value)"
                @click.stop
              >
                <option v-for="type in types" :value="type.id" :key="type.id">
                  {{ type.name }}
                </option>
              </select>
            </td>
            <!-- Item Expiration Date -->
            <td @click="beforeUpdateItem(item.id, 'expirDate')">
              <span v-show="editingDateItemId !== item.id">{{ item.expirDate }}</span>
              <input
                ref="dateTag"
                v-if="editingDateItemId === item.id"
                type="date"
                v-model="item.expirDate"
                @blur="updateItem(item.id, 'expirDate', $event.target.value)"
              />
            </td>
            <!-- Item Quantity -->
            <td @click="beforeUpdateItem(item.id, 'quantity')">
              <input
                type="number"
                v-model="item.quantity"
                @blur="updateItem(item.id, 'quantity', item.quantity)"
              />
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
    <AddItemModal
      v-model:isVisible="isModalVisible"
      :types="types"
      @postAddItemRequest="postAddItemRequest"
    >
    </AddItemModal>
    <!-- Add Type Modal -->
    <AddTypeModal
      v-model:isVisible="isTypeModalVisible"
      @postAddTypeRequest="postAddTypeRequest"
    ></AddTypeModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { itemService, typeService } from '@/services/api.js'
import AddItemModal from '@/components/AddItemModal.vue'
import SubListComponent from '@/components/SubListComponent.vue'
import AddTypeModal from '@/components/AddTypeModal.vue'

const items = ref([])
const expireList = ref([])
const toBuyList = ref([])
const types = ref([])

const selectedIds = ref([]) // selected checkboxes
const selectAll = ref(false)

// fetch data
const getItems = async () => {
  items.value = await itemService.fetchItems()
}
const getExpireList = async () => {
  expireList.value = await itemService.getExpireItems(getDate())
}
const getTobuyList = async () => {
  toBuyList.value = await itemService.getToBuyItems(15)
}
const getTypes = async () => {
  types.value = await typeService.getTypes()
}

// get current date and transfer to required format
const getDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  // month start from 0 in JS
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = now.getDate()

  return `${year}-${month}-${day}`
}

const isModalVisible = ref(false)

// Computed property to check if there are selected items
const hasSelectedItems = computed(() => selectedIds.value.length > 0)

// Methods to handle button actions
const clickAddBtn = () => {
  isModalVisible.value = true
}

// Create a new item
const postAddItemRequest = async (item) => {
  const status = await itemService.createItem(item)
  // update current page's data immediately
  getItems(), getExpireList(), getTobuyList()

  // show notification
  if (status === 200) {
    showNotification('success', 'created successfully')
  } else {
    showNotification('fail', 'failed to create')
  }
}

// Delete selected Items
// 不能在async()里传入值，除非在上面@click调用时也指定传入的值，否则会被当成默认click event的传值
const removeItems = async () => {
  const itemIds = selectedIds.value
  const status = await itemService.deleteItems(itemIds)

  // update current page's data immediately
  getItems(), getExpireList(), getTobuyList()

  // show notification
  if (status === 200) {
    showNotification('success', 'removed successfully')
  } else {
    showNotification('fail', 'failed to remove')
  }
}

// update items
const selectTag = ref(null)
const dateTag = ref(null)
const editingTypeItemId = ref(null)
const editingDateItemId = ref(null)
let oldValue
// create focus in select/input date html tag
// (this is to ensure @blur works well, otherwise some style problem will be caused)
const beforeUpdateItem = (itemId, field) => {
  // record the old value before update
  oldValue = items.value.filter((item) => item.id === itemId)[0][field]

  if (field === 'type') {
    oldValue = oldValue.id // because item['type'] = {id:, name:,}, but only need to pass id to api
    editingTypeItemId.value = itemId
    // nextTick is called after the DOM has updated
    nextTick(() => {
      // selectTag.value is an array with only 1 element (if use v-show, the array will have the same length of items list)
      selectTag.value[0].focus()
    })
  }
  if (field === 'expirDate') {
    editingDateItemId.value = itemId
    nextTick(() => {
      dateTag.value[0].focus()
    })
  }
}

const updateItem = async (itemId, field, newValue) => {
  if (oldValue != newValue) {
    const status = await itemService.updateItem(itemId, {
      [field]: newValue
    })
    // update current list
    getItems(), getExpireList(), getTobuyList()

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

// add type
const isTypeModalVisible = ref(false)

const clickAddTypeBtn = () => {
  isTypeModalVisible.value = true
}

const postAddTypeRequest = async (type) => {
  const status = await typeService.createType(type)
  //update type list
  getTypes()
  // show notification
  if (status === 200) {
    showNotification('success', 'created a new type successfully')
  } else {
    showNotification('fail', 'failed to create a new type')
  }
}
// mounted
onMounted(() => {
  getItems(), getExpireList(), getTobuyList(), getTypes()
})
</script>
