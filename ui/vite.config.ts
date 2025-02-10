import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import codegen from 'vite-plugin-graphql-codegen'

export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), { ...codegen(), apply: 'serve' }],
})
