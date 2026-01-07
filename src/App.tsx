
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductProvider } from "./contexts/ProductContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Catalog from "./pages/Catalog";
import About from "./pages/About";
import Delivery from "./pages/Delivery";
import Promotions from "./pages/Promotions";
import FAQ from "./pages/FAQ";
import Admin from "./pages/Admin";
import AdminTexts from "./pages/AdminTexts";
import AdminBot from "./pages/AdminBot";
import AdminAnalytics from "./pages/AdminAnalytics";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/about" element={<About />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="/admin/texts" element={<ProtectedRoute><AdminTexts /></ProtectedRoute>} />
              <Route path="/admin/bot" element={<ProtectedRoute><AdminBot /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;