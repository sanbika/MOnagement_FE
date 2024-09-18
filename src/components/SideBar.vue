<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* Shadow for depth */
  gap: 1rem; /* Reduced gap for better spacing */
  margin: 0;
  background: #3c3d4a;
}
</style>
<template>
  <div class="sidebar-container">
    <!-- Expire List -->
    <SubListComponent
      title="To Expire"
      :headers="['Item', 'Expiry Date', 'Quantity']"
      :columns="[(item) => item.name, (item) => item.expiryDate, (item) => item.quantity]"
      :data="expireList"
    ></SubListComponent>

    <!-- To Buy List -->
    <SubListComponent
      title="To Buy"
      :headers="['Subtype', 'Quantity']"
      :columns="[(record) => record.name, (record) => record.sum]"
      :data="toBuyList"
    ></SubListComponent>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { itemService, subTypeService } from '@/services/api.js'
import SubListComponent from '@/components/SubListComponent.vue'

const expireList = ref([])
const toBuyList = ref([])

// console.log(expireList.value)
// console.log(toBuyList.value)

// get current date and transfer to required format
const getDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  // month start from 0 in JS
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = now.getDate()

  return `${year}-${month}-${day}`
}

const getExpireList = async () => {
  const result = await itemService.getExpireItems(getDate())
  expireList.value = result
}
const getTobuyList = async () => {
  const result = await subTypeService.getToBuySubTypes(30)
  // console.log('result', result)
  toBuyList.value = result
}

// mounted
onMounted(() => {
  getExpireList(), getTobuyList()
})
</script>
