import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  Flame, 
  Database, 
  RefreshCw, 
  Search, 
  Filter, 
  Image as ImageIcon,
  Tag,
  AlertCircle,
  PackageCheck,
  PackageX,
  Layers,
  Award,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { ProductVisual } from './ProductVisual';

const AVAILABLE_IMAGE_PRESETS = [
  { label: 'Kala Masala / Dark Gravy', value: '/products/kala-masala.jpg' },
  { label: 'Kanda Lasun / Kolhapuri Red', value: '/products/kanda-lasun.jpg' },
  { label: 'Shengdana / Solapur Peanut', value: '/products/shengdana-peanuts.jpg' },
  { label: 'Vada Pav Lasun / Coconut Red', value: '/products/vada-pav-lasun.jpg' },
  { label: 'Til / White Sesame', value: '/products/til-sesame.jpg' },
  { label: 'Javas / Flaxseed Roasted', value: '/products/javas-flaxseed.jpg' },
  { label: 'Thecha / Spicy Green Chilli', value: '/products/thecha-green.jpg' },
  { label: 'Karale / Niger Seed Black', value: '/products/karale-niger.jpg' },
  { label: 'Metkut / Golden Roasted Pulses', value: '/products/metkut-rice.jpg' },
  { label: 'Mango Pickle / Ambyache Lonche', value: '/products/mango-pickle.jpg' },
  { label: 'Lemon Pickle / Limbache Lonche', value: '/products/lemon-pickle.jpg' },
  { label: 'Chilli Pickle / Hirvi Mirchi', value: '/products/chilli-pickle.jpg' },
  { label: 'Panchamrut / Sweet Zesty Relish', value: '/products/panchamrut.jpg' }
];

export const AdminCatalogManager: React.FC = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    seedCatalog, 
    isSyncingCatalog, 
    showToast 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'products' | 'categories'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);

  // Form State for Product
  const [formData, setFormData] = useState<Partial<Product>>({
    nameMr: '',
    nameEn: '',
    taglineMr: '',
    taglineEn: '',
    descriptionMr: '',
    descriptionEn: '',
    category: 'masala',
    spiceLevel: 3,
    badgeMr: '',
    badgeEn: '',
    imageUrl: '/products/kala-masala.jpg',
    regionOriginMr: '',
    regionOriginEn: '',
    rating: 4.9,
    reviewCount: 150,
    isBestSeller: false,
    isRegionalSpecialty: true,
    ingredientsMr: [],
    ingredientsEn: [],
    pairingRecommendationsMr: [],
    pairingRecommendationsEn: [],
    sizes: [
      { size: '100g', grams: 100, price: 90, originalPrice: 110, inStock: true },
      { size: '250g', grams: 250, price: 180, originalPrice: 220, inStock: true },
      { size: '500g', grams: 500, price: 340, originalPrice: 420, inStock: true },
      { size: '1kg', grams: 1000, price: 650, originalPrice: 800, inStock: true }
    ],
    nutritionFacts: {
      calories: '310 kcal / 100g',
      protein: '11.0g',
      healthyFats: '14.0g',
      fiber: '21.0g'
    }
  });

  // Stringified inputs for easy array editing
  const [ingredientsMrText, setIngredientsMrText] = useState('');
  const [ingredientsEnText, setIngredientsEnText] = useState('');
  const [pairingsMrText, setPairingsMrText] = useState('');
  const [pairingsEnText, setPairingsEnText] = useState('');

  // Category Form State
  const [categoryFormData, setCategoryFormData] = useState<Partial<ProductCategory>>({
    id: '',
    nameMr: '',
    nameEn: '',
    descriptionMr: '',
    descriptionEn: '',
    icon: 'Flame',
    sortOrder: 1
  });

  const openNewProductModal = () => {
    setEditingProduct(null);
    setFormData({
      id: `prod-${Date.now()}`,
      nameMr: '',
      nameEn: '',
      taglineMr: '',
      taglineEn: '',
      descriptionMr: '',
      descriptionEn: '',
      category: 'masala',
      spiceLevel: 4,
      badgeMr: 'अस्सल घरगुती',
      badgeEn: 'Heritage Special',
      imageUrl: '/products/kala-masala.jpg',
      regionOriginMr: 'महाराष्ट्र',
      regionOriginEn: 'Maharashtra',
      rating: 4.95,
      reviewCount: 120,
      isBestSeller: false,
      isRegionalSpecialty: true,
      sizes: [
        { size: '100g', grams: 100, price: 95, originalPrice: 120, inStock: true },
        { size: '250g', grams: 250, price: 190, originalPrice: 240, inStock: true },
        { size: '500g', grams: 500, price: 360, originalPrice: 450, inStock: true },
        { size: '1kg', grams: 1000, price: 680, originalPrice: 850, inStock: true }
      ],
      nutritionFacts: {
        calories: '315 kcal / 100g',
        protein: '11.5g',
        healthyFats: '14.2g',
        fiber: '22.0g'
      }
    });
    setIngredientsMrText('धने, जिरे, लवंग, दालचिनी, दगडफूल');
    setIngredientsEnText('Coriander Seeds, Cumin, Cloves, Cinnamon, Stone Flower');
    setPairingsMrText('मटकी उसळ, रस्सा, शेव भाजी');
    setPairingsEnText('Sprouted Lentil Usal, Rustic Gravy, Shev Bhaji');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({ ...prod });
    setIngredientsMrText(prod.ingredientsMr ? prod.ingredientsMr.join(', ') : '');
    setIngredientsEnText(prod.ingredientsEn ? prod.ingredientsEn.join(', ') : '');
    setPairingsMrText(prod.pairingRecommendationsMr ? prod.pairingRecommendationsMr.join(', ') : '');
    setPairingsEnText(prod.pairingRecommendationsEn ? prod.pairingRecommendationsEn.join(', ') : '');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameEn || !formData.nameMr) {
      showToast('Please enter both English and Marathi product names');
      return;
    }

    const cleanedProduct: Product = {
      id: editingProduct?.id || formData.id || `prod-${Date.now()}`,
      nameMr: formData.nameMr || '',
      nameEn: formData.nameEn || '',
      taglineMr: formData.taglineMr || '',
      taglineEn: formData.taglineEn || '',
      descriptionMr: formData.descriptionMr || '',
      descriptionEn: formData.descriptionEn || '',
      category: formData.category || 'masala',
      spiceLevel: Number(formData.spiceLevel) || 3,
      badgeMr: formData.badgeMr || '',
      badgeEn: formData.badgeEn || '',
      rating: Number(formData.rating) || 4.9,
      reviewCount: Number(formData.reviewCount) || 100,
      imageUrl: formData.imageUrl || '/products/kala-masala.jpg',
      regionOriginMr: formData.regionOriginMr || '',
      regionOriginEn: formData.regionOriginEn || '',
      isBestSeller: Boolean(formData.isBestSeller),
      isRegionalSpecialty: Boolean(formData.isRegionalSpecialty),
      ingredientsMr: ingredientsMrText.split(',').map(s => s.trim()).filter(Boolean),
      ingredientsEn: ingredientsEnText.split(',').map(s => s.trim()).filter(Boolean),
      pairingRecommendationsMr: pairingsMrText.split(',').map(s => s.trim()).filter(Boolean),
      pairingRecommendationsEn: pairingsEnText.split(',').map(s => s.trim()).filter(Boolean),
      nutritionFacts: formData.nutritionFacts || {
        calories: '310 kcal / 100g',
        protein: '11.0g',
        healthyFats: '14.0g',
        fiber: '21.0g'
      },
      sizes: formData.sizes && formData.sizes.length > 0 ? formData.sizes : [
        { size: '250g', grams: 250, price: 180, originalPrice: 220, inStock: true },
        { size: '500g', grams: 500, price: 340, originalPrice: 420, inStock: true }
      ]
    };

    if (editingProduct) {
      await updateProduct(cleanedProduct);
    } else {
      await addProduct(cleanedProduct);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProductConfirm = async () => {
    if (!productToDelete) return;
    await deleteProduct(productToDelete.id);
    setProductToDelete(null);
  };

  const handleToggleStock = async (prod: Product, sizeIndex: number) => {
    const updatedSizes = [...prod.sizes];
    updatedSizes[sizeIndex] = {
      ...updatedSizes[sizeIndex],
      inStock: !updatedSizes[sizeIndex].inStock
    };
    await updateProduct({
      ...prod,
      sizes: updatedSizes
    });
  };

  // Category Handlers
  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setCategoryFormData({
      id: '',
      nameMr: '',
      nameEn: '',
      descriptionMr: '',
      descriptionEn: '',
      icon: 'Flame',
      sortOrder: (categories.length + 1)
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: ProductCategory) => {
    setEditingCategory(cat);
    setCategoryFormData({ ...cat });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.nameEn || !categoryFormData.nameMr) {
      showToast('Please provide both Marathi and English category names');
      return;
    }

    const catId = editingCategory?.id || (categoryFormData.id ? categoryFormData.id.trim().toLowerCase().replace(/\s+/g, '-') : `cat-${Date.now()}`);
    const cleanedCategory: ProductCategory = {
      id: catId,
      nameMr: categoryFormData.nameMr || '',
      nameEn: categoryFormData.nameEn || '',
      descriptionMr: categoryFormData.descriptionMr || '',
      descriptionEn: categoryFormData.descriptionEn || '',
      icon: categoryFormData.icon || 'Tag',
      sortOrder: Number(categoryFormData.sortOrder) || 1
    };

    if (editingCategory) {
      await updateCategory(cleanedCategory);
    } else {
      await addCategory(cleanedCategory);
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!categoryToDelete) return;
    await deleteCategory(categoryToDelete.id);
    setCategoryToDelete(null);
  };

  // Filtered products list
  const filteredProducts = products.filter(p => {
    if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.nameEn.toLowerCase().includes(q) ||
      p.nameMr.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.regionOriginEn && p.regionOriginEn.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                <Database className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  Catalog & Product Management • वस्तू व मसाले व्यवस्थापन
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Add, edit, delete, or toggle availability for products, masales, and categories in real-time.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={seedCatalog}
              disabled={isSyncingCatalog}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/80 transition-colors disabled:opacity-50"
              title="Push all default catalog products to Cloud Firestore database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCatalog ? 'animate-spin text-amber-500' : ''}`} />
              {isSyncingCatalog ? 'Syncing...' : 'Sync All to Database'}
            </button>

            {activeSubTab === 'products' ? (
              <button
                onClick={openNewProductModal}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New Product / Masala
              </button>
            ) : (
              <button
                onClick={openNewCategoryModal}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New Category
              </button>
            )}
          </div>
        </div>

        {/* Tab switcher: Products vs Categories */}
        <div className="flex items-center gap-2 mt-5 border-b border-stone-200 dark:border-stone-800 pb-3">
          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === 'products'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Products & Masales ({products.length})
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === 'categories'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Categories ({categories.length})
          </button>
        </div>

        {/* Search & Category Filter (Products Tab Only) */}
        {activeSubTab === 'products' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search products by title, spice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                All ({products.length})
              </button>
              {categories.map((c) => {
                const count = products.filter(p => p.category === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategoryFilter(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === c.id
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {c.nameEn} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* PRODUCTS LIST VIEW */}
      {activeSubTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            return (
              <div
                key={product.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-amber-400/60 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shrink-0 bg-stone-100 dark:bg-stone-800">
                      <img 
                        src={product.imageUrl} 
                        alt={product.nameEn} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40 uppercase">
                          {product.category}
                        </span>
                        {product.isBestSeller && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                            ★ Bestseller
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate mt-1">
                        {product.nameEn}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium truncate">
                        {product.nameMr}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mb-3">
                    {product.descriptionEn}
                  </p>

                  {/* Sizes & Stock status */}
                  <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-2.5 mb-3 border border-stone-100 dark:border-stone-800">
                    <div className="text-[10px] font-bold uppercase text-stone-400 mb-1 flex items-center justify-between">
                      <span>Available Sizes & Prices</span>
                      <span>Stock Toggle</span>
                    </div>
                    <div className="space-y-1.5">
                      {product.sizes.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-stone-800 dark:text-stone-200">
                            {s.size} <span className="text-stone-400">({s.grams}g)</span>:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-700 dark:text-amber-400">₹{s.price}</span>
                            <button
                              onClick={() => handleToggleStock(product, idx)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                                s.inStock
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 hover:bg-rose-200'
                              }`}
                            >
                              {s.inStock ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[11px] text-stone-400">
                    Spice: {product.spiceLevel}/5
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditProductModal(product)}
                      className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="Edit Product"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setProductToDelete(product)}
                      className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CATEGORIES LIST VIEW */}
      {activeSubTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat.id).length;

            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-amber-400/60 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                      <Tag className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {count} Products
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {cat.nameEn}
                  </h3>
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">
                    {cat.nameMr}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                    {cat.descriptionEn || cat.descriptionMr || 'No description provided.'}
                  </p>
                  <div className="text-[11px] text-stone-400 mt-2">
                    ID Slug: <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded-sm">{cat.id}</code>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100 dark:border-stone-800 mt-4">
                  <button
                    onClick={() => openEditCategoryModal(cat)}
                    className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    title="Edit Category"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCategoryToDelete(cat)}
                    className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PRODUCT CREATE / EDIT MODAL */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    <Flame className="w-5 h-5" />
                  </span>
                  <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                    {editingProduct ? 'Edit Product / Masala' : 'Add New Product or Masala'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Product Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder="e.g. Authentic Malvani Fish & Veg Masala"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Product Name (मराठी) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nameMr}
                      onChange={(e) => setFormData({ ...formData, nameMr: e.target.value })}
                      placeholder="e.g. अस्सल मालवणी मसाला"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Category & Spice Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nameEn} ({c.nameMr})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Spice Level (1 Mild - 5 Fiery)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={formData.spiceLevel}
                      onChange={(e) => setFormData({ ...formData, spiceLevel: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Image Selection */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Product Real Photo / Texture
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    >
                      {AVAILABLE_IMAGE_PRESETS.map((preset) => (
                        <option key={preset.value} value={preset.value}>
                          {preset.label} ({preset.value})
                        </option>
                      ))}
                    </select>
                    {formData.imageUrl && (
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-stone-300 shrink-0">
                        <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Or enter custom image URL / path"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full mt-1.5 px-3 py-1.5 text-[11px] rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono"
                  />
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Description (English)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      placeholder="Culinary background, preparation and aroma notes..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Description (मराठी)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.descriptionMr}
                      onChange={(e) => setFormData({ ...formData, descriptionMr: e.target.value })}
                      placeholder="पारंपरिक पद्धत, चव आणि माहिती..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Ingredients & Pairings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Ingredients (English, comma separated)
                    </label>
                    <input
                      type="text"
                      value={ingredientsEnText}
                      onChange={(e) => setIngredientsEnText(e.target.value)}
                      placeholder="Coriander, Cumin, Pepper, Cloves"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      घटक साहित्य (मराठी, स्वल्पविरामाने वेगळे करा)
                    </label>
                    <input
                      type="text"
                      value={ingredientsMrText}
                      onChange={(e) => setIngredientsMrText(e.target.value)}
                      placeholder="धने, जिरे, काळी मिरी, लवंग"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>

                {/* Region Origin & Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Origin Region (English)
                    </label>
                    <input
                      type="text"
                      value={formData.regionOriginEn}
                      onChange={(e) => setFormData({ ...formData, regionOriginEn: e.target.value })}
                      placeholder="e.g. Konkan / Kolhapur"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      मूळ ठिकाण (मराठी)
                    </label>
                    <input
                      type="text"
                      value={formData.regionOriginMr}
                      onChange={(e) => setFormData({ ...formData, regionOriginMr: e.target.value })}
                      placeholder="उदा. सिंधुदुर्ग व मालवण"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isBestSeller}
                        onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                        className="rounded-sm text-amber-600"
                      />
                      Bestseller
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isRegionalSpecialty}
                        onChange={(e) => setFormData({ ...formData, isRegionalSpecialty: e.target.checked })}
                        className="rounded-sm text-amber-600"
                      />
                      Regional
                    </label>
                  </div>
                </div>

                {/* Submit & Cancel */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-xs"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CATEGORY CREATE / EDIT MODAL */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    <Layers className="w-5 h-5" />
                  </span>
                  <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Category ID (Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingCategory)}
                    value={categoryFormData.id}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, id: e.target.value })}
                    placeholder="e.g. masala or regional-curries"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 disabled:opacity-60"
                  />
                  <p className="text-[10px] text-stone-400 mt-0.5">Short URL slug used to link products to this category.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Category Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryFormData.nameEn}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, nameEn: e.target.value })}
                      placeholder="e.g. Authentic Masalas & Blends"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Category Name (मराठी) *
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryFormData.nameMr}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, nameMr: e.target.value })}
                      placeholder="उदा. अस्सल मसाले"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={categoryFormData.descriptionEn}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, descriptionEn: e.target.value })}
                    placeholder="Brief description for customer filter banner..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Description (मराठी)
                  </label>
                  <textarea
                    rows={2}
                    value={categoryFormData.descriptionMr}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, descriptionMr: e.target.value })}
                    placeholder="मराठीत संक्षिप्त माहिती..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-xs"
                  >
                    {editingCategory ? 'Save Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM DELETE PRODUCT MODAL */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  Delete Product?
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Are you sure you want to delete <span className="font-bold text-stone-700 dark:text-stone-300">{productToDelete.nameEn}</span>? This will remove it from the online store.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setProductToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProductConfirm}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-xs"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM DELETE CATEGORY MODAL */}
      <AnimatePresence>
        {categoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  Delete Category?
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Are you sure you want to delete <span className="font-bold text-stone-700 dark:text-stone-300">{categoryToDelete.nameEn}</span>? Products assigned to it will remain in database.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setCategoryToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCategoryConfirm}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-xs"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
