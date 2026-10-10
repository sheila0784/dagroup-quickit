<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'

const server = 'fodsserver'
const database = 'pos4_ice'
const user = 'sa'

const loading = ref(false)
const message = ref('')
const connected = ref(false)

async function testConnection() {
  loading.value = true
  connected.value = false
  message.value = 'Connecting…'

  try {
    const response = await fetch('/api/test')
    const result = await response.json()

    if (!response.ok || !result.connected) {
      throw new Error(result.error || 'Could not connect.')
    }

    connected.value = true
    message.value = 'Connected successfully'
  } catch (error) {
    message.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="connection">
    <h2>1. Check your connection</h2>

    <dl class="details">
      <div>
        <dt>Server</dt>
        <dd>{{ server }}</dd>
      </div>

      <div>
        <dt>Database</dt>
        <dd>{{ database }}</dd>
      </div>

      <div>
        <dt>SQL login</dt>
        <dd>{{ user }}</dd>
      </div>
    </dl>

    <Button
      class="test-button"
      :label="loading ? 'Connecting…' : 'Test connection'"
      :loading="loading"
      :disabled="loading"
      @click="testConnection"
    />

    <p
      v-if="message"
      class="status"
      :class="{ success: connected, error: !connected && !loading }"
      role="status"
      aria-live="polite"
    >
      {{ message }}
    </p>

    <p class="hint">Start here to make sure the database is available.</p>
  </section>
</template>

<style scoped>
.connection {
  padding: 14px;
  background: white;
  color: #19392f;
  font-family: 'Segoe UI', Arial, sans-serif;
}

h2 {
  margin: 0 0 20px;
  font-size: 19px;
}

.details {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin: 0 0 24px;
}

dt {
  margin-bottom: 7px;
  color: #74847c;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

dd {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
}

.test-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 17px;
  border: 1px solid #bfd2c8;
  border-radius: 9px;
  background: #206f55;
  color: white;
  font:
    600 14px 'Segoe UI',
    Arial,
    sans-serif;
  cursor: pointer;
}

.test-button:disabled {
  opacity: 0.65;
  cursor: wait;
}

.status {
  margin: 13px 0 0;
  font-size: 13px;
}

.success {
  color: #207456;
}

.error {
  color: #b13a34;
}

.hint {
  margin-top: 18px;
  color: #687c70;
  font-size: 12px;
}
</style>
