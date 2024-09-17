<style scoped>
.navbar {
  background-color: #3c3d4a;
  color: white;
  padding: 1rem;
}

.navbar-container {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
}

.nav-links {
  list-style: none;
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding-bottom: 0.2rem;
  border-bottom: 1.5px solid transparent;
  transition: border-bottom 0.3s ease;
}

.nav-links a:focus,
.nav-links a:hover {
  border-bottom: 1.5px solid white;
}
</style>
<template>
  <nav class="navbar">
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
  </nav>
</template>
