import type { ProductRemoteSource } from "../source/product-remote.ts"
import ProductModel from "../model/product-model.ts"
import ProductListParam from "../param/product-list-param.ts"
// Maps API responses into validated application models. Product data is owned by the backend.
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
        const response = await getProductListRemote(param)
        // The endpoint contract returns a direct array of products.
        if (!Array.isArray(response)) {
            throw new TypeError(
                "API harus mengembalikan array produk secara langsung.",
            )
        }

        const products = response.map((item) => ProductModel.fromResponse(item))
        const ids = products.map((product) => product.getId())
        if (new Set(ids).size !== ids.length) {
            throw new TypeError("ID produk dari API harus unik.")
        }
        return products
    }

    async function getProductById(id: number): Promise<ProductModel | null> {
        if (!getProductByIdRemote) throw new Error("Endpoint detail produk belum tersedia.")
        const response = await getProductByIdRemote(id)
        return response === null ? null : ProductModel.fromResponse(response)
    }

    async function createProduct(data: {
        name: string
        price: number
    }): Promise<ProductModel> {
        if (!createProductRemote) throw new Error("Endpoint tambah produk belum tersedia.")
        const response = await createProductRemote(data)
        return ProductModel.fromResponse(response)
    }

    async function updateProduct(
        id: number,
        data: { name: string; price: number },
    ): Promise<ProductModel> {
        if (!updateProductRemote) throw new Error("Endpoint ubah produk belum tersedia.")
        const response = await updateProductRemote(id, data)
        return ProductModel.fromResponse(response)
    }

    async function deleteProduct(id: number): Promise<boolean> {
        if (!deleteProductRemote) throw new Error("Endpoint hapus produk belum tersedia.")
        await deleteProductRemote(id)
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
