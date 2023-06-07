import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
    alias: {
      util: 'rollup-plugin-node-polyfills/polyfills/util'
    }
  },
	optimizeDeps: {
    esbuildOptions: {
      plugins: [
            NodeGlobalsPolyfillPlugin({
                process: true,
                buffer: true
            }),
            NodeModulesPolyfillPlugin()
      ]
    }
  },
	server: {
    port: 5173,
		proxy: {
			'/auth': {
				target: process.env.PROXYSERVER,
				changeOrigin: true,
			},
		},
	}
});
