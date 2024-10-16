<template>
  <DisplayTableComponent
    :heads="['Item', 'Subtype', 'Exp. Date', 'Quantity']"
    :editable-heads="['Item', 'Subtype', 'expirDate', 'Quantity']"
    :field-map="{
      Item: 'name',
      Subtype: 'subType',
      'Exp. Date': 'expiryDate',
      Quantity: 'quantity'
    }"
    :head-config="{ Item: 'text', Subtype: 'select', 'Exp. Date': 'date', Quantity: 'number' }"
    :rows="items"
    :options="subTypes"
  />
</template>
<script setup>
import DisplayTableComponent from '@/components/DisplayTableComponent.vue'
import { ref, onMounted } from 'vue'
import { itemService, subTypeService } from '@/services/api.js'

const items = ref([])
const subTypes = ref([])

// fetch data
const getItems = async () => {
  items.value = await itemService.getItems()
  console.log('fetched items ', items.value)
}
const getSubTypes = async () => {
  subTypes.value = await subTypeService.getSubTypes()
  console.log('fetched subTypes ', subTypes.value)
}

onMounted(() => {
  getItems(), getSubTypes()
})
</script>
