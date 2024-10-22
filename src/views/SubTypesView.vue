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
    :heads="['Subtype', 'Belong to', '# of Items']"
    :editable-heads="['Subtype', 'Belong to']"
    :head-config="{ Subtype: 'text', 'Belong to': 'select' }"
    :field-map="{
      Subtype: 'name',
      'Belong to': 'type',
      '# of Items': 'sumItemsQuantity'
    }"
    :rows="subTypes"
    :options="types"
    @create="showAddModal"
    @update="updateSubType"
    @delete="deleteSubTypes"
  />
  <!-- Add SubType Modal -->
  <AddSubTypeModal
    v-model:isVisible="isModalVisible"
    :types="types"
    :subTypes="subTypes"
    @postAddSubTypeRequest="createSubType"
  >
  </AddSubTypeModal>
</template>
<script setup>
import DisplayTableComponent from '@/components/DisplayTableComponent.vue'
import AddSubTypeModal from '@/components/AddSubTypeModal.vue'
import { ref, onMounted } from 'vue'
import { subTypeService, typeService } from '@/services/api.js'

// get data
const subTypes = ref([])
const types = ref([])

const getSubTypes = async () => {
  subTypes.value = await subTypeService.getSubTypesWithCount()
  // console.log('fetched subtypes', subTypes.value)
}

const getTypes = async () => {
  types.value = await typeService.getTypes()
  // console.log('types', types.value)
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

const createSubType = async (subType) => {
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

// update data
const updateSubType = async (id, field, newValue) => {
  const status = await subTypeService.updateSubType(id, { [field]: newValue })
  // update current list
  getSubTypes()

  // show notification
  if (status === 200) {
    showNotification('success', `${field} update successfully`)
  } else {
    showNotification('fail', `failed to update ${field}`)
  }
}

// delete data
const deleteSubTypes = async (ids) => {
  const status = await subTypeService.deleteSubTypes(ids)
  // update current page's data immediately
  getSubTypes()
  // show notification
  if (status === 200) {
    showNotification('success', 'removed successfully')
  } else {
    showNotification('fail', 'failed to remove')
  }
}

onMounted(() => {
  getTypes(), getSubTypes()
})
</script>
