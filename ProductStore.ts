import { defineStore } from 'pinia';

export const useProductstore = defineStore({
	id: 'productsStore',
	state: () => ({
		products: new Map(),
	}),
	getters: { },
	actions: { },
});

export default useProductstore;
