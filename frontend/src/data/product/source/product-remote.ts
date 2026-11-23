import ProductListParam from "../param/product-list-param.ts"

export type ProductRemoteSource = {
    getProductListRemote: (param?: ProductListParam) => Promise<unknown>
    getProductByIdRemote?: (id: number) => Promise<unknown>
    createProductRemote?: (data: { name: string; price: number }) => Promise<unknown>
    updateProductRemote?: (id: number, data: { name: string; price: number }) => Promise<unknown>
    deleteProductRemote?: (id: number) => Promise<unknown>
}

type ProductRemoteOptions = {
    baseUrl?: string
    fetchImpl?: typeof fetch
}

// Sends HTTP requests and returns the unvalidated JSON payload.
export default function ProductRemote({
    baseUrl = "",
    fetchImpl = fetch,
}: ProductRemoteOptions = {}): ProductRemoteSource {
    function getUrl(path: string = "/products") {
        if (!baseUrl.trim()) {
            throw new Error(
                "Isi VITE_API_BASE_URL di .env.local terlebih dahulu.",
            )
        }

        const cleanBase = baseUrl.replace(/\/+$/, "")
        const cleanPath = path.startsWith("/") ? path : `/${path}`
        const url = new URL(`${cleanBase}${cleanPath}`)
        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("URL API harus menggunakan http atau https.")
        }
        return url
    }

    async function getProductListRemote(
        param = new ProductListParam(),
    ): Promise<unknown> {
        const url = getUrl("/products")
        url.search = param.toQueryString()

        const response = await fetchImpl(url, {
            method: "GET",
            headers: { Accept: "application/json" },
        })

        if (!response.ok) {
            throw new Error(`Gagal memuat produk (HTTP ${response.status}).`)
        }

        return response.json()
    }

    async function getProductByIdRemote(id: number): Promise<unknown> {
        const url = getUrl(`/products/${id}`)
        const response = await fetchImpl(url, {
            method: "GET",
            headers: { Accept: "application/json" },
        })

        if (response.status === 404) return null
        if (!response.ok) {
            throw new Error(`Gagal memuat detail produk (HTTP ${response.status}).`)
        }

        return response.json()
    }

    async function createProductRemote(data: { name: string; price: number }): Promise<unknown> {
        const url = getUrl("/products")
        const response = await fetchImpl(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error(`Gagal menambahkan produk (HTTP ${response.status}).`)
        }

        return response.json()
    }

    async function updateProductRemote(
        id: number,
        data: { name: string; price: number },
    ): Promise<unknown> {
        const url = getUrl(`/products/${id}`)
        const response = await fetchImpl(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error(`Gagal memperbarui produk (HTTP ${response.status}).`)
        }

        return response.json()
    }

    async function deleteProductRemote(id: number): Promise<unknown> {
        const url = getUrl(`/products/${id}`)
        const response = await fetchImpl(url, {
            method: "DELETE",
            headers: { Accept: "application/json" },
        })

        if (!response.ok) {
            throw new Error(`Gagal menghapus produk (HTTP ${response.status}).`)
        }

        if (response.status === 204) return null
        return response.json().catch(() => null)
    }

    return {
        getProductListRemote,
        getProductByIdRemote,
        createProductRemote,
        updateProductRemote,
        deleteProductRemote,
    }
}
