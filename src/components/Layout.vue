<template>
  <div>
    <main>
      <div class="homepage">
        <div class="grid-container">
          <div class="search-container">
            <span>
              <a href="#" @click="$router.push({ name: 'home' })">
                Theridiid
              </a>
              <input type="text" placeholder="looking for a job..." />
              <button>search</button>
            </span>
          </div>
          <router-view></router-view>
        </div>
        <footer class="footer">
          <p>&copy; 2025 Theridiid</p>
        </footer>
      </div>
    </main>
  </div>
</template>
