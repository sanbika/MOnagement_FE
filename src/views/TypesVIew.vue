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
    :heads="['Type', '# of Subtypes', '# of Items']"
    :editable-heads="['Type']"
    :head-config="{ Type: 'text' }"
    :field-map="{
      Type: 'name',
      '# of Subtypes': 'sumSubTypesQuantity',
      '# of Items': 'sumItemsQuantity'
    }"
    :rows="types"
    @create="showAddModal"
    @update="updateType"
    @delete="deleteTypes"
  />
  <!-- Add Type Modal -->
  <AddTypeModal v-model:isVisible="isModalVisible" @postAddTypeRequest="createType"> </AddTypeModal>
</template>
<script setup>
import DisplayTableComponent from '@/components/DisplayTableComponent.vue'
import AddTypeModal from '@/components/AddTypeModal.vue'
import { ref, onMounted } from 'vue'
import { typeService } from '@/services/api.js'

// get data
const types = ref([])

const getTypes = async () => {
  types.value = await typeService.getTypesWithCount()
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

// create data
const isModalVisible = ref(false)
const showAddModal = () => {
  isModalVisible.value = true
}

const createType = async (type) => {
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

// update data
const updateType = async (id, field, newValue) => {
  const status = await typeService.updateType(id, { [field]: newValue })
  // update current list
  getTypes()

  // show notification
  if (status === 200) {
    showNotification('success', `${field} update successfully`)
  } else {
    showNotification('fail', `failed to update ${field}`)
  }
}

// delete data
const deleteTypes = async (ids) => {
  const status = await typeService.deleteTypes(ids)
  // update current page's data immediately
  getTypes()
  // show notification
  if (status === 200) {
    showNotification('success', 'removed successfully')
  } else {
    showNotification('fail', 'failed to remove')
  }
}

onMounted(() => {
  getTypes()
})
</script>
