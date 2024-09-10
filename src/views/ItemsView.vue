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
  border-bottom: 2px solid #ccc;
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
  margin: 10px 0;
  border-radius: 4px;
  /* Rounded corners for notifications */
  font-weight: bold;
  text-align: center;
  position: absolute;
  /* Position notification above the table */
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 300px;
}

.notification.success {
  background-color: #d4edda;
  /* Green background for success */
  color: #155724;
  /* Dark green text for success */
  border: 1px solid #c3e6cb;
  /* Green border for success */
}

.notification.error {
  background-color: #f8d7da;
  /* Red background for error */
  color: #721c24;
  /* Dark red text for error */
  border: 1px solid #f5c6cb;
  /* Red border for error */
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
            <th>Type</th>
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
            <td>
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
              >
                <option v-for="type in types" :value="type.id" :key="type.id">
                  {{ type.name }}
                </option>
              </select>
            </td>
            <!-- Item Expiration Date -->
            <td @click="beforeUpdateItem(item.id, 'date')">
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
            <td>
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
      <button class="add-btn" @click="addItem"><i class="bi bi-plus"></i></button>
    </div>
    <!-- Add Item Modal -->
    <AddItemModal
      v-model:isVisible="isModalVisible"
      :types="types"
      @postAddItemRequest="postAddItemRequest"
    >
    </AddItemModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { itemService, typeService } from '@/services/api.js'
import AddItemModal from '@/components/AddItemModal.vue'
import SubListComponent from '@/components/SubListComponent.vue'

let items = ref([])
let expireList = ref([])
let toBuyList = ref([])
let types = ref([])

const selectedIds = ref([]) // selected checkboxes
const selectAll = ref(false)

const notificationMessage = ref('')
const notificationType = ref('') // 'success' or 'error'

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
  // console.log(types.value)
}

function getDate() {
  const now = new Date(2024, 2, 12)
  // const oneWeekAgo = new Date(now)
  // oneWeekAgo.setDate(now.getDate() - 7)
  // oneWeekAgo.setHours(0, 0, 0, 0)
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = now.getDate()

  return `${year}-${month}-${day}`
}

const isModalVisible = ref(false)

// Computed property to check if there are selected items
const hasSelectedItems = computed(() => selectedIds.value.length > 0)

// Methods to handle button actions
const addItem = () => {
  isModalVisible.value = true
}

const postAddItemRequest = async (item) => {
  await itemService.createItem(item)
  // update current page's data immediately
  getItems(), getExpireList(), getTobuyList()
}

// 不能在async()里传入值，除非在上面@click调用时也指定传入的值，否则会被当成默认click event的传值
const removeItems = async () => {
  const itemIds = selectedIds.value
  await itemService.deleteItems(itemIds)

  // update current page's data immediately
  getItems(), getExpireList(), getTobuyList()
}

// update items
const selectTag = ref(null)
const dateTag = ref(null)
const editingTypeItemId = ref(null)
const editingDateItemId = ref(null)

const beforeUpdateItem = (itemId, field) => {
  if (field === 'type') {
    editingTypeItemId.value = itemId
    nextTick(() => {
      console.log(selectTag.value[0])
      selectTag.value[0].focus()
    })
  }
  if (field === 'date') {
    editingDateItemId.value = itemId
    nextTick(() => {
      dateTag.value[0].focus(() => {
        console.log('focus')
      })
    })
  }
}

const updateItem = async (itemId, field, newValue) => {
  await itemService.updateItem(itemId, {
    [field]: newValue
  })

  getItems(), getExpireList(), getTobuyList()

  editingTypeItemId.value = null
  editingDateItemId.value = null
}

// mounted
onMounted(() => {
  getItems(), getExpireList(), getTobuyList(), getTypes()
})
// Methods to get tobuy item list and almost expire item list
// const toBuyList = computed(() => {
//   return items.value.filter((item) => item.quantity < 2)
// })

// const expireList = computed(() => {
//   // calculate the date that are 1 week ago
// const now = new Date()
// const oneWeekAgo = new Date(now)
// oneWeekAgo.setDate(now.getDate() - 7)
// oneWeekAgo.setHours(0, 0, 0, 0)

//   // filter items based on the computed date
//   const filterdItems = items.value.filter((item) => {
//     const [year, month, day] = item.date.split('-').map(Number)
//     // month start from 0 in date object
//     const itemDate = new Date(year, month - 1, day)
//     itemDate.setHours(0, 0, 0, 0)
//     return itemDate <= oneWeekAgo
//   })

//   // sort the filtered items by date in ascending order
//   return filterdItems.sort((a, b) => {
//     const [yearA, monthA, dayA] = a.date.split('-').map(Number)
//     const [yearB, monthB, dayB] = b.date.split('-').map(Number)

//     const dateA = new Date(yearA, monthA - 1, dayA)
//     const dateB = new Date(yearB, monthB - 1, dayB)

//     return dateA - dateB
//   })
// })
</script>
