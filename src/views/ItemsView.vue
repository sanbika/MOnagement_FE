<style scoped>
@import url(../assets/notification.css);
</style>
<template>
  <!-- Notification -->
  <div v-if="notificationMessage" :class="['notification', notificationType]">
    {{ notificationMessage }}
  </div>
  <!-- Display Table -->
  <DisplayTableComponent
    :heads="['Item', 'Subtype', 'Exp. Date', 'Quantity']"
    :editable-heads="['Item', 'Subtype', 'Exp. Date', 'Quantity']"
    :field-map="{
      Item: 'name',
      Subtype: 'subType',
      'Exp. Date': 'expiryDate',
      Quantity: 'quantity'
    }"
    :head-config="{ Item: 'text', Subtype: 'select', 'Exp. Date': 'date', Quantity: 'number' }"
    :rows="items"
    :options="subTypes"
    @create="showAddModal"
    @update="updateItem"
    @delete="deleteItems"
  />
  <!-- Add Item Modal -->
  <AddModal
    v-model:isVisible="isModalVisible"
    :options="subTypes"
    :title="'Add a New Item'"
    :fields="['name', 'subType', 'expiryDate', 'quantity']"
    :field-display="{
      name: 'Item Name',
      subType: 'Item SubType',
      expiryDate: 'Expiry Date',
      quantity: 'Quantity'
    }"
    :field-config="{
      name: 'text',
      subType: 'select',
      expiryDate: 'date',
      quantity: 'number'
    }"
    @emitAddRequest="createItem"
  ></AddModal>
</template>
<script setup>
import DisplayTableComponent from '@/components/DisplayTableComponent.vue'
// import AddItemModal from '@/components/AddItemModal.vue'
import AddModal from '@/components/AddModal.vue'
import { ref, onMounted } from 'vue'
import { itemService, subTypeService } from '@/services/api.js'

const items = ref([])
const subTypes = ref([])

// fetch data
const getItems = async () => {
  items.value = await itemService.getItems()
  // console.log('fetched items ', items.value)
}
const getSubTypes = async () => {
  subTypes.value = await subTypeService.getSubTypes()
  // console.log('fetched subTypes ', subTypes.value)
}

// notification
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

// create data
const isModalVisible = ref(false)
const showAddModal = () => {
  isModalVisible.value = true
}

const createItem = async (item) => {
  const status = await itemService.createItem(item)
  // update current page's data immediately
  getItems()
  // show notification
  if (status === 200) {
    showNotification('success', 'created successfully')
  } else {
    showNotification('fail', 'failed to create')
  }
}

// update data
const updateItem = async (id, field, newValue) => {
  // console.log(field)
  // console.log(newValue)
  const status = await itemService.updateItem(id, {
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

// delete data
const deleteItems = async (ids) => {
  const status = await itemService.deleteItems(ids)

  // update current page's data immediately
  getItems()

  // show notification
  if (status === 200) {
    showNotification('success', 'removed successfully')
  } else {
    showNotification('fail', 'failed to remove')
  }
}

onMounted(() => {
  getItems(), getSubTypes()
})
</script>
