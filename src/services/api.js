import axios from 'axios'

const baseURL = 'http://localhost:8080/api/'

const itemAPI = axios.create({
  baseURL: baseURL + 'item',
  headers: {
    'Content-Type': 'application/json'
  }
})

const typeAPI = axios.create({
  baseURL: baseURL + 'type',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const itemService = {
  // Get all items
  async fetchItems() {
    try {
      const response = await itemAPI.get()
      return response.data
    } catch (error) {
      throw new Error('Error fecthcing items ' + error.message)
    }
  },

  // // Get an item
  // async getItemById(itemId) {
  //   try {
  //     const response = await itemAPI.get('/find', { params: { id: itemId } })
  //     return response.data
  //   } catch (error) {
  //     throw new Error('Error fecthcing an item' + error.message)
  //   }
  // },

  // Create an item
  async createItem(itemData) {
    try {
      const response = await itemAPI.post('/add', itemData)
      return response.status
    } catch (error) {
      return error.response.status
      // throw new Error('Error creating item' + error.message)
    }
  },

  // Update an item
  async updateItem(itemId, updateData) {
    try {
      const response = await itemAPI.patch('/update', updateData, {
        params: { id: itemId }
      })
      return response.status
    } catch (error) {
      return error.response.status
      // throw new Error('Error updating an item' + error.message)
    }
  },

  // // Delete an item
  // async deleteItem(itemId) {
  //   try {
  //     const response = await itemAPI.delete('/delete', {
  //       params: { id: itemId }
  //     })
  //     if (response.status === 200) {
  //       return true
  //     } else {
  //       throw new Error('Unexpected status code' + response.status)
  //     }
  //   } catch (error) {
  //     throw new Error('Error deleting an item' + error.message)
  //   }
  // },

  // Delete items
  async deleteItems(itemIds) {
    try {
      const response = await itemAPI.delete('/delete/multiple', { data: { ids: itemIds } })
      return response.status
    } catch (error) {
      return error.response.status
      // throw new Error('Error deleting an item' + error.message)
    }
  },

  // Get expire items
  async getExpireItems(date) {
    try {
      const response = await itemAPI.get('/expire', {
        params: { date: date }
      })
      return response.data
    } catch (error) {
      throw new Error('Error getting expire items' + error.message)
    }
  },

  // Get to buy items
  async getToBuyItems(quantity) {
    try {
      const response = await itemAPI.get('/tobuy', {
        params: {
          quantity: quantity
        }
      })
      return response.data
    } catch (error) {
      throw new Error('Error getting to-buy items' + error.message)
    }
  }
}

export const typeService = {
  // Get all types
  async getTypes() {
    try {
      const response = await typeAPI.get()
      return response.data
    } catch (error) {
      throw new Error('Error fecthcing types' + error.message)
    }
  },

  // Get a single type by id
  async getType(typeId) {
    try {
      const response = await typeAPI.get({ params: { id: typeId } })
      return response.data
    } catch (error) {
      throw new Error('Error fecthcing this type' + error.message)
    }
  },

  // Create a type
  async createType(typeData) {
    try {
      await typeAPI.post('/add', typeData)
    } catch (error) {
      throw new Error('Error creating this type' + error.message)
    }
  },

  // Delete a type
  async deleteTyp(typeId) {
    try {
      await typeAPI.delete('/delete', {
        params: {
          id: typeId
        }
      })
    } catch (error) {
      throw new Error('Error deleting this type' + error.message)
    }
  },

  // Update a type
  async updateType(typeId, typeData) {
    try {
      await typeAPI.patch('/update', typeData, { params: { id: typeId } })
    } catch (error) {
      throw new Error('Error updating this type' + error.message)
    }
  }
}
