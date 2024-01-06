<template>
  <div>
    <h1>Env vars</h1>
    <p>varFromDotCompose: <code>{{ varFromDotCompose }}</code></p>
    <p>varFromDotEnv: <code>{{ varFromDotEnv }}</code></p>
    <p>varFromSysEnv: <code>{{ varFromSysEnv }}</code></p>
    <Tutorial/>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data: () => ({
    varFromDotCompose: process.env.varFromDotCompose,
    varFromDotEnv: process.env.varFromDotEnv,
    varFromSysEnv: process.env.varFromSysEnv,
  })
}
</script>
