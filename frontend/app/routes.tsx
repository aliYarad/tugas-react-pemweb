import { Route, Routes } from "react-router"
import RootPage from "./page"
import PageLayout from "../src/components/templates/PageLayout"
import ProductsPage from "./products/page"
import ProductDetailPage from "../src/components/pages/ProductDetailPage"
import NotFoundPage from "../src/components/pages/NotFoundPage"
import SettingsPage from "../src/components/pages/SettingsPage"

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<PageLayout />}>
                <Route index element={<RootPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}
