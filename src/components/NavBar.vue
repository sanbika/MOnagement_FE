<style scoped>
.navbar-container {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  background: linear-gradient(to right, #3c3d4a, rgba(60, 61, 74, 0.7));
  color: white;
  padding: 1rem;
}

.nav-links {
  list-style: none;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  font-size: 24px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding-bottom: 0.2rem;
  border-bottom: 2px solid transparent;
  transition: border-bottom 0.3s ease;
}

.nav-links a:focus,
.nav-links a:hover {
  border-bottom: 2px solid white;
}
</style>
<template>
  <div class="navbar-container">
    <ul class="nav-links">
      <li>
        <router-link to="/types">Types</router-link>
      </li>
      <li>
        <router-link to="/subtypes">Subtypes</router-link>
      </li>
      <li>
        <router-link to="/items">Items</router-link>
      </li>
    </ul>
  </div>
</template>
