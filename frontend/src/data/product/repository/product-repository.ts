import type { ProductRemoteSource } from "../source/product-remote.ts"
import ProductModel from "../model/product-model.ts"
import ProductListParam from "../param/product-list-param.ts"
import type { Product } from "../../../types/product.ts"

const INITIAL_FALLBACK_PRODUCTS: Product[] = [
    { id: 1, name: "Pulpen", price: 5000 },
    { id: 2, name: "Buku Tulis", price: 12000 },
    { id: 3, name: "Spidol", price: 8000 },
    { id: 4, name: "Penggaris", price: 6000 },
    { id: 5, name: "Penghapus", price: 3000 },
]

const STORAGE_KEY = "manajemen_produk_storage_v1"

function getStoredProducts(): Product[] {
    if (typeof window === "undefined" || !window.localStorage) {
        return INITIAL_FALLBACK_PRODUCTS
    }
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FALLBACK_PRODUCTS))
        return INITIAL_FALLBACK_PRODUCTS
    }
    try {
        return JSON.parse(data)
    } catch {
        return INITIAL_FALLBACK_PRODUCTS
    }
}

function saveStoredProducts(products: Product[]) {
    if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    }
}

// Maps remote payloads into validated application models with local fallback.
export default function ProductRepository(source: ProductRemoteSource) {
    const {
        getProductListRemote,
        getProductByIdRemote,
        createProductRemote,
        updateProductRemote,
        deleteProductRemote,
    } = source

    async function getProductList(
        param = new ProductListParam(),
    ): Promise<ProductModel[]> {
        try {
            const response = await getProductListRemote(param)
            // The endpoint contract returns a direct array of products.
            if (!Array.isArray(response)) {
                throw new TypeError(
                    "Contoh ini mengharapkan response API berupa array produk.",
                )
            }

            const products = response.map((item) => ProductModel.fromResponse(item))
            const ids = products.map((product) => product.getId())
            if (new Set(ids).size !== ids.length) {
                throw new TypeError("ID produk dari API harus unik.")
            }

            // Sync successfully retrieved products to local storage
            saveStoredProducts(products.map((p) => p.toJSON()))
            return products
        } catch (error) {
            if (error instanceof TypeError) {
                throw error
            }
            // Offline / connection error: Fallback to local storage
            const local = getStoredProducts()
            const query = param.toQueryString()
            const q = new URLSearchParams(query).get("q")?.toLowerCase().trim()
            const filtered = q
                ? local.filter((p) => p.name.toLowerCase().includes(q))
                : local

            return filtered.map((item) => new ProductModel(item))
        }
    }

    async function getProductById(id: number): Promise<ProductModel | null> {
        if (getProductByIdRemote) {
            try {
                const response = await getProductByIdRemote(id)
                return ProductModel.fromResponse(response)
            } catch {
                // fallback to local storage
            }
        }

        const local = getStoredProducts()
        const found = local.find((p) => p.id === id)
        return found ? new ProductModel(found) : null
    }

    async function createProduct(data: {
        name: string
        price: number
    }): Promise<ProductModel> {
        if (createProductRemote) {
            try {
                const response = await createProductRemote(data)
                const created = ProductModel.fromResponse(response)
                const local = getStoredProducts()
                saveStoredProducts([...local, created.toJSON()])
                return created
            } catch {
                // fallback
            }
        }

        const local = getStoredProducts()
        const nextId =
            local.length > 0 ? Math.max(...local.map((p) => p.id)) + 1 : 1
        const created = new ProductModel({ id: nextId, ...data })
        saveStoredProducts([...local, created.toJSON()])
        return created
    }

    async function updateProduct(
        id: number,
        data: { name: string; price: number },
    ): Promise<ProductModel> {
        if (updateProductRemote) {
            try {
                const response = await updateProductRemote(id, data)
                const updated = ProductModel.fromResponse(response)
                const local = getStoredProducts()
                saveStoredProducts(
                    local.map((p) => (p.id === id ? updated.toJSON() : p)),
                )
                return updated
            } catch {
                // fallback
            }
        }

        const local = getStoredProducts()
        const updated = new ProductModel({ id, ...data })
        saveStoredProducts(
            local.map((p) => (p.id === id ? updated.toJSON() : p)),
        )
        return updated
    }

    async function deleteProduct(id: number): Promise<boolean> {
        if (deleteProductRemote) {
            try {
                await deleteProductRemote(id)
                const local = getStoredProducts()
                saveStoredProducts(local.filter((p) => p.id !== id))
                return true
            } catch {
                // fallback
            }
        }

        const local = getStoredProducts()
        saveStoredProducts(local.filter((p) => p.id !== id))
        return true
    }

    return {
        getProductList,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
    }
}
