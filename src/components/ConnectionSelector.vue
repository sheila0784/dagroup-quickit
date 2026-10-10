<script setup>
import Card from 'primevue/card'
import Message from 'primevue/message'
import { onMounted, ref } from 'vue'
import Select from 'primevue/select'
import Button from 'primevue/button'

const connections = ref([])
const selected = ref(null)
const loadingList = ref(true)
const testing = ref(false)
const message = ref('')
const connected = ref(false)

onMounted(async () => {
  try {
    const response = await fetch('/api/connections')

    if (!response.ok) {
      throw new Error('Could not load connections. Check the backend.')
    }

    connections.value = await response.json()
  } catch (error) {
    message.value = error.message
  } finally {
    loadingList.value = false
  }
})

function clearResult() {
  connected.value = false
  message.value = ''
}

async function testConnection() {
  if (!selected.value) return

  testing.value = true
  connected.value = false
  message.value = 'Connecting…'

  try {
    const id = encodeURIComponent(selected.value.id)
    const response = await fetch(`/api/test?id=${id}`)
    const result = await response.json()

    if (!response.ok || !result.connected) {
      throw new Error(result.error || 'Could not connect.')
    }

    connected.value = true
    message.value = `Connected successfully to ${result.database}`
  } catch (error) {
    message.value = error.message
  } finally {
    testing.value = false
  }
}
</script>

<template>
  <main class="dagroup-page">
    <header class="dagroup-header">
      <img src="/dagroup-logo.png" alt="DaGroup" class="dagroup-logo" />

      <div>
        <p class="dagroup-eyebrow">DAGROUP</p>
        <h1>Database connections</h1>
        <p class="dagroup-description">Choose a server and check your database connection.</p>
      </div>
    </header>

    <Card class="dagroup-card">
      <template #title>Select a connection</template>

      <template #subtitle> Available connections are loaded from your server settings. </template>

      <template #content>
        <div class="dagroup-field">
          <label for="connection">Database connection</label>

          <Select
            v-model="selected"
            inputId="connection"
            :options="connections"
            optionLabel="name"
            placeholder="Choose a connection"
            :loading="loadingList"
            :disabled="loadingList || testing"
            class="dagroup-select"
            @change="clearResult"
          />
        </div>

        <dl v-if="selected" class="dagroup-details">
          <div>
            <dt>Server</dt>
            <dd>{{ selected.server }}</dd>
          </div>

          <div>
            <dt>Database</dt>
            <dd>{{ selected.database }}</dd>
          </div>

          <!-- <div>
            <dt>SQL login</dt>
            <dd>{{ selected.user }}</dd>
          </div> -->
        </dl>

        <div class="dagroup-actions">
          <Button
            :label="testing ? 'Connecting…' : 'Test connection'"
            :loading="testing"
            :disabled="!selected || testing"
            @click="testConnection"
          />
        </div>

        <div aria-live="polite">
          <Message
            v-if="message"
            :severity="testing ? 'info' : connected ? 'success' : 'error'"
            :closable="false"
            class="dagroup-feedback"
          >
            {{ message }}
          </Message>
        </div>
      </template>
    </Card>

    <p class="dagroup-footer">DaGroup · Database connection settings</p>
  </main>
</template>
