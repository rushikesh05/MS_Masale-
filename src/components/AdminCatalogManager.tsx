import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
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
  ChevronDown,
  UploadCloud,
  Copy,
  ExternalLink,
  ShoppingBag,
  SlidersHorizontal,
  CheckCircle2,
  Gift,
  Wand2,
  Eye,
  RotateCcw,
  Camera,
  Store
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory, ProductSize, BogoOfferConfig } from '../types';
import { ProductVisual } from './ProductVisual';
import { compressImage, uploadImageToServer, removeBackgroundClient } from '../utils/imageOptimizer';
import { DEFAULT_BOGO_CONFIG } from '../lib/firestoreService';
import { BogoBanner } from './BogoBanner';

export interface ImagePresetItem {
  id: string;
  labelEn: string;
  labelMr: string;
  value: string;
  category: string;
  sizeLabel: string;
}

export const AVAILABLE_IMAGE_PRESETS: ImagePresetItem[] = [
  { 
    id: 'kanda-lasun', 
    labelEn: 'Kanda Lasun Masala', 
    labelMr: 'कांदा लसूण मसाला', 
    value: '/products/kanda-lasun.jpg', 
    category: 'masala', 
    sizeLabel: '500g Standup Pouch' 
  },
  { 
    id: 'shengdana-peanuts', 
    labelEn: 'Roasted Shengdana Chutney', 
    labelMr: 'खमंग शेंगदाणा चटणी', 
    value: '/products/shengdana-peanuts.jpg', 
    category: 'chutney', 
    sizeLabel: '500g Standup Pouch' 
  },
  { 
    id: 'vada-pav-lasun', 
    labelEn: 'Vada Pav Lasun Coconut Chutney', 
    labelMr: 'वडापाव लसूण खोबरे चटणी', 
    value: '/products/vada-pav-lasun.jpg', 
    category: 'chutney', 
    sizeLabel: '500g Standup Pouch' 
  },
  { 
    id: 'kala-masala', 
    labelEn: 'Roasted Kala Masala', 
    labelMr: 'पारंपरिक काळा मसाला', 
    value: '/products/kala-masala.jpg', 
    category: 'masala', 
    sizeLabel: '500g Standup Pouch' 
  },
  { 
    id: 'til-sesame', 
    labelEn: 'Gavran Til (Sesame) Chutney', 
    labelMr: 'गावरान तीळ चटणी', 
    value: '/products/til-sesame.jpg', 
    category: 'chutney', 
    sizeLabel: '500g Standup Pouch' 
  },
  { 
    id: 'javas-flaxseed', 
    labelEn: 'Omega-3 Roasted Javas Chutney', 
    labelMr: 'खमंग जवस चटणी', 
    value: '/products/javas-flaxseed.jpg', 
    category: 'chutney', 
    sizeLabel: '500g Standup Pouch' 
  },
  { 
    id: 'thecha-green', 
    labelEn: 'Hirvi Mirchi Thecha', 
    labelMr: 'झणझणीत मिरची ठेचा', 
    value: '/products/thecha-green.jpg', 
    category: 'thecha', 
    sizeLabel: '500g Standup Pouch' 
  },
  { 
    id: 'karale-niger', 
    labelEn: 'Gavran Karale (Niger Seed) Chutney', 
    labelMr: 'गावरान कारळे चटणी', 
    value: '/products/karale-niger.jpg', 
    category: 'chutney', 
    sizeLabel: '500g Standup Pouch' 
  },
  { 
    id: 'metkut-rice', 
    labelEn: 'Paushtik 12-Grain Metkut Powder', 
    labelMr: 'पौष्टिक पारंपरिक मेतकूट', 
    value: '/products/metkut-rice.jpg', 
    category: 'metkut', 
    sizeLabel: '500g Standup Pouch' 
  },
  { 
    id: 'mango-pickle', 
    labelEn: 'Gavran Ambyache Lonche (Mango Pickle)', 
    labelMr: 'गावरान आंब्याचे लोणचे', 
    value: '/products/mango-pickle.jpg', 
    category: 'pickle', 
    sizeLabel: '500g Glass Jar' 
  },
  { 
    id: 'lemon-pickle', 
    labelEn: 'Chatpatit Limbache Lonche (Lemon Pickle)', 
    labelMr: 'चटपटीत लिंबाचे लोणचे', 
    value: '/products/lemon-pickle.jpg', 
    category: 'pickle', 
    sizeLabel: '500g Glass Jar' 
  },
  { 
    id: 'chilli-pickle', 
    labelEn: 'Hirvi Mirchi Lonche (Green Chilli Pickle)', 
    labelMr: 'हिरवी मिरची लोणचे', 
    value: '/products/chilli-pickle.jpg', 
    category: 'pickle', 
    sizeLabel: '500g Glass Jar' 
  },
  { 
    id: 'garlic-pickle', 
    labelEn: 'Lasun Mirchi Lonche (Garlic Pickle)', 
    labelMr: 'लसूण मिरची लोणचे', 
    value: '/products/garlic-pickle.jpg', 
    category: 'pickle', 
    sizeLabel: '500g Glass Jar' 
  },
  { 
    id: 'panchamrut', 
    labelEn: 'Panchamrut Sweet Relish', 
    labelMr: 'पारंपरिक पंचामृत', 
    value: '/products/panchamrut.jpg', 
    category: 'relish', 
    sizeLabel: '500g Glass Jar' 
  }
];

export interface UploadedImageItem {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  size?: string;
}

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
    showToast,
    bogoConfig,
    updateBogoConfig,
    resetBogoConfig,
    setRole
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'products' | 'categories' | 'images' | 'bogo'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

  // BOGO Offer Configuration Form State
  const [bogoForm, setBogoForm] = useState<BogoOfferConfig>(() => bogoConfig || DEFAULT_BOGO_CONFIG);
  const [isSavingBogo, setIsSavingBogo] = useState<boolean>(false);
  const [isProcessingBogoImage, setIsProcessingBogoImage] = useState<boolean>(false);
  const [bogoImagePickerMode, setBogoImagePickerMode] = useState<'upload' | 'presets' | 'url'>('upload');
  const [bogoPreviewLang, setBogoPreviewLang] = useState<'en' | 'mr'>('en');
  const bogoFileInputRef = useRef<HTMLInputElement | null>(null);

  // Keep bogoForm in sync with remote bogoConfig
  useEffect(() => {
    if (bogoConfig) {
      setBogoForm(bogoConfig);
    }
  }, [bogoConfig]);

  // Media & Uploaded Images
  const [uploadedImages, setUploadedImages] = useState<UploadedImageItem[]>(() => {
    try {
      const saved = localStorage.getItem('ms_admin_uploaded_images_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);

  // Uploading state & real-time progress
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  // Modal State for Products
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Modal State for Categories
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);

  // Image source picker tabs in Product Modal
  const [imagePickerTab, setImagePickerTab] = useState<'presets' | 'upload' | 'url'>('presets');

  // Product Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    nameMr: '',
    nameEn: '',
    taglineMr: '',
    taglineEn: '',
    descriptionMr: '',
    descriptionEn: '',
    category: 'masala',
    badgeMr: '',
    badgeEn: '',
    imageUrl: '/products/kanda-lasun.jpg',
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

  // Stringified inputs for array fields
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
    icon: 'Tag',
    sortOrder: 1
  });

  // Open New Product Form
  const openNewProductModal = (prefillImage?: string) => {
    setEditingProduct(null);
    setFormData({
      nameMr: '',
      nameEn: '',
      taglineMr: '',
      taglineEn: '',
      descriptionMr: '',
      descriptionEn: '',
      category: categories[0]?.id || 'masala',
      badgeMr: '१००% शुद्ध',
      badgeEn: 'Pure & Natural',
      imageUrl: prefillImage || '/products/kanda-lasun.jpg',
      regionOriginMr: 'स्थानिक',
      regionOriginEn: 'Local Origin',
      rating: 4.9,
      reviewCount: 120,
      isBestSeller: false,
      isRegionalSpecialty: true,
      sizes: [
        { size: '100g', grams: 100, price: 90, originalPrice: 110, inStock: true },
        { size: '250g', grams: 250, price: 180, originalPrice: 220, inStock: true },
        { size: '500g', grams: 500, price: 340, originalPrice: 420, inStock: true },
        { size: '1kg', grams: 1000, price: 650, originalPrice: 800, inStock: true }
      ]
    });
    setIngredientsMrText('धने, जिरे, लवंग, तमालपत्र, सुके खोबरे');
    setIngredientsEnText('Coriander, Cumin, Cloves, Bay Leaf, Dry Coconut');
    setPairingsMrText('मिसळ, भाजी, रस्सा, भात');
    setPairingsEnText('Misal, Curries, Rassa, Steamed Rice');
    setIsProductModalOpen(true);
  };

  // Open Edit Product Form
  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [
        { size: '250g', grams: 250, price: 180, originalPrice: 220, inStock: true },
        { size: '500g', grams: 500, price: 340, originalPrice: 420, inStock: true }
      ]
    });
    setIngredientsMrText((product.ingredientsMr || []).join(', '));
    setIngredientsEnText((product.ingredientsEn || []).join(', '));
    setPairingsMrText((product.pairingRecommendationsMr || []).join(', '));
    setPairingsEnText((product.pairingRecommendationsEn || []).join(', '));
    setIsProductModalOpen(true);
  };

  // Handle High-Efficiency Image Upload with Client Compression & Server API
  const handleFileUpload = async (file: File, isForGallery: boolean = false) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)');
      return;
    }

    setIsUploadingImage(true);
    setUploadProgressText('Compressing & optimizing photo...');

    try {
      // 1. Client-side compression to WebP/JPEG max 1000px, 85% quality
      const compressed = await compressImage(file, 1000, 1000, 0.85);

      setUploadProgressText('Uploading high-speed product image...');

      // 2. Upload to server API (falls back to compressed data URL if offline)
      const uploadResult = await uploadImageToServer(compressed.dataUrl, file.name);
      const finalUrl = uploadResult.url;
      const reportedSize = `${uploadResult.sizeKb || compressed.sizeKb} KB`;

      const newItem: UploadedImageItem = {
        id: `img-${Date.now()}`,
        name: file.name,
        url: finalUrl,
        uploadedAt: new Date().toLocaleDateString(),
        size: reportedSize
      };

      const updated = [newItem, ...uploadedImages];
      setUploadedImages(updated);
      try {
        localStorage.setItem('ms_admin_uploaded_images_v2', JSON.stringify(updated.slice(0, 30)));
      } catch {
        // LocalStorage quota fallback
      }

      if (!isForGallery) {
        setFormData(prev => ({ ...prev, imageUrl: finalUrl }));
      }

      showToast(`Image uploaded & optimized successfully (${reportedSize})!`);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      showToast('Failed to process image. Please try another file.');
    } finally {
      setIsUploadingImage(false);
      setUploadProgressText('');
      // Always reset inputs so selecting the same or another file immediately fires onChange!
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
    }
  };

  // Product Size Modifier
  const handleSizeChange = (index: number, field: keyof ProductSize, val: string | number | boolean) => {
    const currentSizes = [...(formData.sizes || [])];
    if (!currentSizes[index]) return;
    currentSizes[index] = {
      ...currentSizes[index],
      [field]: val
    };
    setFormData({ ...formData, sizes: currentSizes });
  };

  const handleAddSizeTier = () => {
    const currentSizes = [...(formData.sizes || [])];
    currentSizes.push({
      size: '250g',
      grams: 250,
      price: 180,
      originalPrice: 220,
      inStock: true
    });
    setFormData({ ...formData, sizes: currentSizes });
  };

  const handleRemoveSizeTier = (index: number) => {
    const currentSizes = (formData.sizes || []).filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: currentSizes });
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nameEn || !formData.nameMr) {
      showToast('Please provide both English and Marathi product names');
      return;
    }

    const cleanedProduct: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      nameMr: formData.nameMr.trim(),
      nameEn: formData.nameEn.trim(),
      taglineMr: formData.taglineMr || '',
      taglineEn: formData.taglineEn || '',
      descriptionMr: formData.descriptionMr || '',
      descriptionEn: formData.descriptionEn || '',
      category: formData.category || 'masala',
      spiceLevel: editingProduct?.spiceLevel || 3,
      badgeMr: formData.badgeMr || '',
      badgeEn: formData.badgeEn || '',
      rating: Number(formData.rating) || 4.9,
      reviewCount: Number(formData.reviewCount) || 100,
      imageUrl: formData.imageUrl || '/products/kanda-lasun.jpg',
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

  // Delete Product
  const handleDeleteProductConfirm = async () => {
    if (!productToDelete) return;
    await deleteProduct(productToDelete.id);
    setProductToDelete(null);
  };

  // In-line Quick Stock Toggle
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
      icon: 'Tag',
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
    if (stockStatusFilter === 'in_stock') {
      const hasStock = p.sizes.some(s => s.inStock);
      if (!hasStock) return false;
    } else if (stockStatusFilter === 'out_of_stock') {
      const allOut = p.sizes.every(s => !s.inStock);
      if (!allOut) return false;
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

  // BOGO Handler Functions
  const handleBogoImageUpload = async (file: File) => {
    try {
      setIsProcessingBogoImage(true);
      showToast('Optimizing, removing background & updating 3D packaging image...');

      // 1. Compress image
      const compressed = await compressImage(file, 1000, 1000, 0.9);

      // 2. Automatically remove white/solid background to make 3D transparent
      let transparentDataUrl = compressed.dataUrl;
      try {
        transparentDataUrl = await removeBackgroundClient(compressed.dataUrl);
      } catch (err) {
        console.warn('Background removal fallback:', err);
      }

      let finalUrl = transparentDataUrl;

      // 3. Upload to server if available
      try {
        const uploadRes = await uploadImageToServer(
          transparentDataUrl, 
          file.name.replace(/\.[^/.]+$/, "") + "-bogo-transparent.png"
        );
        if (uploadRes.url) {
          finalUrl = uploadRes.url;
        }
      } catch (err) {
        console.warn('Image server upload fallback:', err);
      }

      setBogoForm(prev => ({ ...prev, imageUrl: finalUrl }));
      showToast('🎉 3D Transparent packaging image prepared! Click Save to apply.');
    } catch (err) {
      console.error('BOGO image upload error:', err);
      showToast('❌ Failed to process image. Please try another file.');
    } finally {
      setIsProcessingBogoImage(false);
      if (bogoFileInputRef.current) {
        bogoFileInputRef.current.value = '';
      }
    }
  };

  const handleMakeCurrentImageTransparent = async () => {
    if (!bogoForm.imageUrl) return;
    try {
      setIsProcessingBogoImage(true);
      showToast('Removing background and generating 3D cut-out...');
      const transparentUrl = await removeBackgroundClient(bogoForm.imageUrl);
      setBogoForm(prev => ({ ...prev, imageUrl: transparentUrl }));
      showToast('✨ Background removed! Image is now 3D transparent.');
    } catch (err) {
      console.error('Failed to remove background:', err);
      showToast('Could not auto-remove background from this image source.');
    } finally {
      setIsProcessingBogoImage(false);
    }
  };

  const handleAutoFillFromProduct = (productId: string) => {
    const selected = products.find(p => p.id === productId);
    if (!selected) return;

    setBogoForm(prev => ({
      ...prev,
      productId: selected.id,
      titleEn: `BUY 1 GET 1 FREE (BOGO)!`,
      titleMr: `१ वर १ मोफत ऑफर (BOGO)!`,
      descriptionEn: `Special Festive Offer on ${selected.nameEn} (${selected.nameMr}): Buy 1 pack & get 1 pack 100% FREE!`,
      descriptionMr: `खास ऑफर ${selected.nameMr} (${selected.nameEn}) वर: १ पॅक विकत घ्या आणि १ पॅक १००% मोफत मिळवा!`,
      badgeEn: selected.badgeEn || 'Special Festive Offer',
      badgeMr: selected.badgeMr || 'खास सणासुदीची ऑफर',
      tagEn: `${selected.nameEn} (BOGO)`,
      tagMr: `${selected.nameMr} (BOGO)`,
      imageUrl: selected.imageUrl || prev.imageUrl,
    }));

    showToast(`✨ Auto-filled BOGO details from "${selected.nameEn}"!`);
  };

  const handleSaveBogoOffer = async () => {
    try {
      setIsSavingBogo(true);
      await updateBogoConfig(bogoForm);
      showToast('🎉 BOGO Offer & Banner saved to Cloud Firestore!');
    } catch (err) {
      console.error('Error saving BOGO offer:', err);
      showToast('❌ Failed to save BOGO offer to database.');
    } finally {
      setIsSavingBogo(false);
    }
  };

  const handleResetBogoOffer = async () => {
    if (window.confirm('Reset BOGO offer to default authentic Peanut & Garlic Chutney configuration?')) {
      await resetBogoConfig();
      setBogoForm(DEFAULT_BOGO_CONFIG);
      showToast('Reset to default Peanut & Garlic Chutney offer.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Real-time Database Status */}
      <div className="bg-white dark:bg-stone-900 border border-amber-200/80 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                <Database className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                    Catalog & Real-time Database Management
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Firebase Firestore Connected</span>
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Full CRUD: Add products, upload images, update prices & sizes, delete, or sync changes directly with Firebase Firestore.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setRole('customer')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-amber-300 dark:border-stone-700 bg-amber-50 dark:bg-stone-800 text-amber-900 dark:text-amber-300 hover:bg-amber-100 transition-colors cursor-pointer shadow-2xs"
              title="Return to customer store view"
            >
              <Store className="w-3.5 h-3.5 text-amber-700" />
              <span>View Storefront</span>
            </button>

            <button
              onClick={seedCatalog}
              disabled={isSyncingCatalog}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/80 transition-colors disabled:opacity-50 cursor-pointer"
              title="Push all default catalog products to Cloud Firestore database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCatalog ? 'animate-spin text-amber-500' : 'text-amber-600'}`} />
              {isSyncingCatalog ? 'Syncing Firebase...' : 'Re-seed / Sync to Firebase'}
            </button>

            {activeSubTab === 'products' && (
              <button
                onClick={() => openNewProductModal()}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            )}

            {activeSubTab === 'bogo' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetBogoOffer}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors cursor-pointer"
                  title="Reset to default Peanut & Garlic Chutney configuration"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
                <button
                  onClick={handleSaveBogoOffer}
                  disabled={isSavingBogo}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSavingBogo ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Save BOGO Offer</span>
                </button>
              </div>
            )}

            {activeSubTab === 'categories' && (
              <button
                onClick={openNewCategoryModal}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            )}

            {activeSubTab === 'images' && (
              <button
                onClick={() => galleryFileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition-colors cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                Upload New Image
              </button>
            )}
            <input
              type="file"
              ref={galleryFileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0], true);
                  e.target.value = '';
                }
              }}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Tab switcher: Products vs BOGO vs Images vs Categories */}
        <div className="flex items-center gap-2 mt-5 border-b border-stone-200 dark:border-stone-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'products'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Products & Masales ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('bogo')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'bogo'
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-xs'
                : 'text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200/80 dark:border-amber-800/60'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            <span>BOGO Banner & Offer</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
              bogoForm.isActive !== false ? 'bg-amber-400 text-stone-950' : 'bg-stone-400 text-white'
            }`}>
              {bogoForm.isActive !== false ? 'ACTIVE' : 'PAUSED'}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('images')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'images'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Images & Media Gallery ({AVAILABLE_IMAGE_PRESETS.length + uploadedImages.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('categories')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'categories'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categories ({categories.length})</span>
          </button>
        </div>

        {/* Search & Filters Bar (Products Tab Only) */}
        {activeSubTab === 'products' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search products by English or Marathi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                All ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {cat.nameEn}
                </button>
              ))}

              <div className="h-4 w-px bg-stone-200 dark:bg-stone-700 mx-1 shrink-0" />

              {/* Stock status filter */}
              <button
                onClick={() => setStockStatusFilter('all')}
                className={`px-2.5 py-1 text-[11px] rounded-md font-medium cursor-pointer ${
                  stockStatusFilter === 'all' ? 'bg-stone-200 text-stone-800 font-bold' : 'text-stone-500'
                }`}
              >
                All Stock
              </button>
              <button
                onClick={() => setStockStatusFilter('in_stock')}
                className={`px-2.5 py-1 text-[11px] rounded-md font-medium cursor-pointer ${
                  stockStatusFilter === 'in_stock' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-stone-500'
                }`}
              >
                In Stock
              </button>
              <button
                onClick={() => setStockStatusFilter('out_of_stock')}
                className={`px-2.5 py-1 text-[11px] rounded-md font-medium cursor-pointer ${
                  stockStatusFilter === 'out_of_stock' ? 'bg-rose-100 text-rose-800 font-bold' : 'text-stone-500'
                }`}
              >
                Out of Stock
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: PRODUCTS LIST VIEW (CRUD) */}
      {activeSubTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            const hasAnyInStock = product.sizes.some(s => s.inStock);

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-amber-400/60 transition-all group"
              >
                <div>
                  {/* Top visual & category tag */}
                  <div className="flex gap-3 mb-3">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shrink-0 border border-stone-200 relative flex items-center justify-center">
                      <ProductVisual
                        product={product}
                        aspectRatio="card"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                          {product.category}
                        </span>
                        {product.isBestSeller && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500 text-white flex items-center gap-0.5">
                            <Award className="w-2.5 h-2.5" /> Best
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm mt-1 leading-snug line-clamp-1">
                        {product.nameEn}
                      </h3>
                      <div className="text-xs font-semibold text-amber-800 dark:text-amber-400 line-clamp-1">
                        {product.nameMr}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-2">
                        <span>★ {product.rating}</span>
                        <span>•</span>
                        <span className="truncate">{product.regionOriginEn || 'Natural'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sizes & Stock status matrix */}
                  <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-3 mb-3 border border-stone-100 dark:border-stone-800">
                    <div className="text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-2 flex items-center justify-between">
                      <span>Available Sizes & Prices</span>
                      <span className="text-amber-700 dark:text-amber-400 font-normal">Click status to toggle</span>
                    </div>
                    <div className="space-y-1.5">
                      {product.sizes.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                          <span className="font-medium text-stone-700 dark:text-stone-300">
                            {s.size} ({s.grams}g)
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 dark:text-stone-100">₹{s.price}</span>
                            <button
                              onClick={() => handleToggleStock(product, idx)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                                s.inStock
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 hover:bg-rose-200'
                              }`}
                              title="Click to toggle in stock / out of stock in Firebase"
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
                  <span className={`text-[11px] font-semibold ${hasAnyInStock ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {hasAnyInStock ? 'Available for Customers' : 'Currently Unavailable'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditProductModal(product)}
                      className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setProductToDelete(product)}
                      className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
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

      {/* SUB-TAB 2: IMAGES & MEDIA GALLERY */}
      {activeSubTab === 'images' && (
        <div className="space-y-6">
          {/* Upload Dropzone */}
          <div 
            onClick={() => galleryFileInputRef.current?.click()}
            className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 rounded-3xl p-8 text-center cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              Upload New Product Image
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Click to select or drag and drop JPG, PNG, or WebP photo from your computer or phone.
            </p>
          </div>

          {/* Preset Images Grid */}
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base mb-3 font-serif flex items-center gap-2">
              <span>Product Packaging Photos ({AVAILABLE_IMAGE_PRESETS.length})</span>
              <span className="text-xs font-normal text-stone-500">Standard 500g pouch & jar photos</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {AVAILABLE_IMAGE_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between group hover:border-amber-400 transition-all"
                >
                  <div className="aspect-square bg-stone-100 dark:bg-stone-800 overflow-hidden relative">
                    <img
                      src={preset.value}
                      alt={preset.labelEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/70 text-white backdrop-blur-xs">
                      {preset.sizeLabel}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <div className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                      {preset.labelEn}
                    </div>
                    <div className="text-xs font-semibold text-amber-800 dark:text-amber-400 mt-0.5">
                      {preset.labelMr}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono mt-1 truncate">
                      {preset.value}
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(preset.value);
                          showToast('Image path copied to clipboard!');
                        }}
                        className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                        title="Copy Image Path"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                      <button
                        onClick={() => {
                          openNewProductModal(preset.value);
                          setActiveSubTab('products');
                        }}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Use in Product</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Uploaded User Images Section */}
          {uploadedImages.length > 0 && (
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base mb-3 font-serif">
                User Uploaded Media ({uploadedImages.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {uploadedImages.map((img) => (
                  <div
                    key={img.id}
                    className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div className="aspect-square bg-stone-100 dark:bg-stone-800 overflow-hidden relative">
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3.5">
                      <div className="font-bold text-stone-900 dark:text-stone-100 text-xs truncate">
                        {img.name}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        Uploaded: {img.uploadedAt} • {img.size || 'Web'}
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800">
                        <button
                          onClick={() => {
                            openNewProductModal(img.url);
                            setActiveSubTab('products');
                          }}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Use in Product</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: CATEGORIES LIST VIEW */}
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
                    className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCategoryToDelete(cat)}
                    className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
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

      {/* SUB-TAB 4: BOGO BANNER & OFFER MANAGEMENT */}
      {activeSubTab === 'bogo' && (
        <div className="space-y-6">
          {/* Header Card & Status Switch */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-rose-950/30 border-2 border-amber-300/80 dark:border-amber-700/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-amber-500 text-stone-950 shadow-md">
                <Gift className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                    BOGO (Buy 1 Get 1 Free) Banner & Featured Product
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                    bogoForm.isActive !== false 
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300' 
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}>
                    {bogoForm.isActive !== false ? '● Live on Store' : '○ Paused'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 max-w-2xl leading-relaxed">
                  Customize the featured promotional product, 3D packaging image, and bilingual Marathi & English descriptions anytime. Any updates are saved directly to Cloud Firestore and sync across all customer devices.
                </p>
              </div>
            </div>

            {/* Status & Save Controls */}
            <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
              <label className="flex items-center gap-2 cursor-pointer select-none bg-white dark:bg-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 shadow-xs">
                <input
                  type="checkbox"
                  checked={bogoForm.isActive !== false}
                  onChange={(e) => setBogoForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  {bogoForm.isActive !== false ? 'Offer Active' : 'Offer Paused'}
                </span>
              </label>

              <button
                type="button"
                onClick={handleSaveBogoOffer}
                disabled={isSavingBogo}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-102 active:scale-98"
              >
                {isSavingBogo ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Save All Changes</span>
              </button>
            </div>
          </div>

          {/* Section 1: Associated Product & Quick Auto-Fill */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <span>1. Linked Promotional Product</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Choose which product from your catalog receives the Buy 1 Get 1 Free offer.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleAutoFillFromProduct(bogoForm.productId || 'prod-shengdana-chutney')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 text-xs font-bold transition-colors cursor-pointer"
                title="Automatically populate title, Marathi/English description, and packaging photo from selected product"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto-fill details from selected product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Select Product from Catalog
                </label>
                <select
                  value={bogoForm.productId || 'prod-shengdana-chutney'}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setBogoForm(prev => ({ ...prev, productId: newId }));
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nameEn} ({p.nameMr}) — ₹{p.sizes?.[0]?.price || 165}
                    </option>
                  ))}
                </select>
              </div>

              {/* Linked Product Quick Card */}
              {(() => {
                const linked = products.find(p => p.id === (bogoForm.productId || 'prod-shengdana-chutney')) || products[0];
                if (!linked) return null;
                return (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-stone-700 overflow-hidden shrink-0 border border-stone-200 dark:border-stone-600 flex items-center justify-center">
                      <img src={linked.imageUrl} alt={linked.nameEn} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {linked.nameEn}
                      </div>
                      <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 truncate">
                        {linked.nameMr}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        Starting from ₹{linked.sizes?.[0]?.price || 165} • ID: <code className="bg-stone-200/70 dark:bg-stone-700 px-1 rounded-xs">{linked.id}</code>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Section 2: Product Image & 3D Packaging Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: 3D Image Showcase Preview */}
            <div className="lg:col-span-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-stone-100 dark:border-stone-800 pb-2">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>3D Packaging Showcase</span>
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    Transparent 3D Preview
                  </span>
                </div>

                {/* 3D Floating Stage with Radial Glow and Perspective */}
                <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-b from-stone-900 via-stone-800 to-stone-950 p-6 flex flex-col items-center justify-center overflow-hidden select-none [perspective:1000px] border border-stone-700/60 shadow-inner">
                  {/* Subtle Grid / Backdrop */}
                  <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
                  
                  {/* Luminous Warm Light Spot */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-radial from-amber-400/30 via-orange-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />

                  {/* 3D Animated Floating Product Pouch/Jar */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotateY: [-5, 6, -5],
                      rotateZ: [-1, 2, -1]
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="relative z-10 w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center filter drop-shadow-[0_18px_25px_rgba(0,0,0,0.6)]"
                  >
                    <img
                      src={bogoForm.imageUrl || '/products/peanut-garlic-pouch-transparent.png'}
                      alt="BOGO Product Packaging"
                      className="max-h-full max-w-full object-contain pointer-events-none"
                    />
                  </motion.div>

                  {/* Ground Contact Shadow */}
                  <motion.div
                    animate={{
                      scale: [1, 0.78, 1],
                      opacity: [0.6, 0.3, 0.6]
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="w-28 h-3.5 rounded-[100%] bg-black/60 blur-md mx-auto -mt-2 pointer-events-none"
                  />

                  {/* Floating Tag */}
                  <div className="mt-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 uppercase tracking-wide shadow-lg border border-white/60">
                      <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                      <span>{bogoForm.tagEn || 'Peanut & Garlic (BOGO)'}</span>
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono mt-2 truncate text-center">
                  Path: {bogoForm.imageUrl}
                </div>
              </div>

              {/* Background Removal Action */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 mt-3 space-y-2">
                <button
                  type="button"
                  onClick={handleMakeCurrentImageTransparent}
                  disabled={isProcessingBogoImage}
                  className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                  title="Automatically remove white background to create a clean 3D transparent packaging cutout"
                >
                  {isProcessingBogoImage ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>Make Background Transparent (3D Cutout)</span>
                </button>
              </div>
            </div>

            {/* Right: Image Selector (Upload, Presets, URL) */}
            <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>2. Select or Upload Packaging Image</span>
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Upload an image or select an existing packaging photo.
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setBogoImagePickerMode('upload')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                      bogoImagePickerMode === 'upload' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs' : 'text-stone-500'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setBogoImagePickerMode('presets')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                      bogoImagePickerMode === 'presets' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs' : 'text-stone-500'
                    }`}
                  >
                    Presets ({AVAILABLE_IMAGE_PRESETS.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBogoImagePickerMode('url')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                      bogoImagePickerMode === 'url' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs' : 'text-stone-500'
                    }`}
                  >
                    Custom URL
                  </button>
                </div>
              </div>

              {/* Mode A: Upload File */}
              {bogoImagePickerMode === 'upload' && (
                <div className="space-y-3">
                  <input
                    ref={bogoFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleBogoImageUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="bogo-admin-file-picker"
                  />

                  <div
                    onClick={() => bogoFileInputRef.current?.click()}
                    className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 dark:bg-amber-950/10 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-amber-50/70"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto mb-2.5">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {isProcessingBogoImage ? 'Processing & removing background...' : 'Click to Upload Packaging Photo'}
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                      Accepts JPG, PNG, or WebP. Automatic background removal and 3D cutout will be applied.
                    </p>
                  </div>
                </div>
              )}

              {/* Mode B: Presets */}
              {bogoImagePickerMode === 'presets' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-1">
                    {/* Authentic Transparent Pouch option */}
                    <button
                      type="button"
                      onClick={() => {
                        setBogoForm(prev => ({ ...prev, imageUrl: '/products/peanut-garlic-pouch-transparent.png' }));
                        showToast('Selected authentic 3D Peanut & Garlic transparent pouch!');
                      }}
                      className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        bogoForm.imageUrl === '/products/peanut-garlic-pouch-transparent.png'
                          ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 ring-2 ring-amber-500'
                          : 'border-stone-200 dark:border-stone-700 hover:border-amber-400 bg-white dark:bg-stone-800'
                      }`}
                    >
                      <div className="aspect-square bg-stone-900 rounded-lg overflow-hidden flex items-center justify-center p-1.5 mb-1.5">
                        <img src="/products/peanut-garlic-pouch-transparent.png" alt="Transparent Pouch" className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 truncate">
                        Peanut & Garlic (3D)
                      </div>
                      <div className="text-[9px] text-stone-500">Transparent Pouch</div>
                    </button>

                    {AVAILABLE_IMAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setBogoForm(prev => ({ ...prev, imageUrl: preset.value }));
                          showToast(`Selected "${preset.labelEn}"!`);
                        }}
                        className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          bogoForm.imageUrl === preset.value
                            ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 ring-2 ring-amber-500'
                            : 'border-stone-200 dark:border-stone-700 hover:border-amber-400 bg-white dark:bg-stone-800'
                        }`}
                      >
                        <div className="aspect-square bg-stone-100 dark:bg-stone-700 rounded-lg overflow-hidden flex items-center justify-center p-1 mb-1.5">
                          <img src={preset.value} alt={preset.labelEn} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[11px] font-bold text-stone-800 dark:text-stone-200 truncate">
                          {preset.labelEn}
                        </div>
                        <div className="text-[9px] text-stone-500 truncate">{preset.labelMr}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mode C: Custom URL */}
              {bogoImagePickerMode === 'url' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    Direct Image URL
                  </label>
                  <input
                    type="url"
                    value={bogoForm.imageUrl}
                    onChange={(e) => setBogoForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/chutney-jar.png"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  <p className="text-[11px] text-stone-500">
                    Paste a direct PNG link. For best 3D floating effect, use an image with a transparent background.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Promotional Copy & Descriptions (English & Marathi - Just Like Other Products) */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span>3. Product Title, Descriptions & Badges (मराठी आणि English)</span>
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Just like catalog products, update the Marathi and English copy displayed on the customer banner.
              </p>
            </div>

            {/* Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Offer Headline (English) *
                </label>
                <input
                  type="text"
                  required
                  value={bogoForm.titleEn}
                  onChange={(e) => setBogoForm(prev => ({ ...prev, titleEn: e.target.value }))}
                  placeholder="BUY 1 GET 1 FREE (BOGO)!"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Offer Headline (मराठी) *
                </label>
                <input
                  type="text"
                  required
                  value={bogoForm.titleMr}
                  onChange={(e) => setBogoForm(prev => ({ ...prev, titleMr: e.target.value }))}
                  placeholder="१ वर १ मोफत ऑफर (BOGO)!"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-bold"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Offer & Product Description (English) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={bogoForm.descriptionEn}
                  onChange={(e) => setBogoForm(prev => ({ ...prev, descriptionEn: e.target.value }))}
                  placeholder="Special Offer on Peanut and Garlic Chutney: Buy 1 jar & get 1 jar 100% FREE!"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Offer & Product Description (मराठी) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={bogoForm.descriptionMr}
                  onChange={(e) => setBogoForm(prev => ({ ...prev, descriptionMr: e.target.value }))}
                  placeholder="खास ऑफर शेंगदाणा आणि लसूण चटणी वर: १ पॅक विकत घ्या आणि १ पॅक १००% मोफत मिळवा!"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Badges & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Top Badge (English / मराठी)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={bogoForm.badgeEn}
                    onChange={(e) => setBogoForm(prev => ({ ...prev, badgeEn: e.target.value }))}
                    placeholder="Special Festive Offer"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    value={bogoForm.badgeMr}
                    onChange={(e) => setBogoForm(prev => ({ ...prev, badgeMr: e.target.value }))}
                    placeholder="खास सणासुदीची ऑफर"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  3D Pill Tag (English / मराठी)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={bogoForm.tagEn}
                    onChange={(e) => setBogoForm(prev => ({ ...prev, tagEn: e.target.value }))}
                    placeholder="Peanut & Garlic (BOGO)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    value={bogoForm.tagMr}
                    onChange={(e) => setBogoForm(prev => ({ ...prev, tagMr: e.target.value }))}
                    placeholder="शेंगदाणा आणि लसूण चटणी (BOGO)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={bogoForm.couponCode}
                  onChange={(e) => setBogoForm(prev => ({ ...prev, couponCode: e.target.value.toUpperCase() }))}
                  placeholder="BOGO-FREE"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 font-mono font-bold tracking-wider"
                />
              </div>
            </div>

            {/* Save Buttons Row */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={handleResetBogoOffer}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Reset to Default Peanut & Garlic
              </button>
              <button
                type="button"
                onClick={handleSaveBogoOffer}
                disabled={isSavingBogo}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-102"
              >
                {isSavingBogo ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Save BOGO Configuration to Database</span>
              </button>
            </div>
          </div>

          {/* Section 4: Live Customer Store Preview */}
          <div className="bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-600" />
                  <span>4. Live Customer Store Banner Preview</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  This is exactly how the BOGO banner appears on customer devices in real-time.
                </p>
              </div>

              {/* Language Switcher for Preview */}
              <div className="flex items-center gap-1 bg-white dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => setBogoPreviewLang('en')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    bogoPreviewLang === 'en' ? 'bg-amber-500 text-white' : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  English Preview
                </button>
                <button
                  type="button"
                  onClick={() => setBogoPreviewLang('mr')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    bogoPreviewLang === 'mr' ? 'bg-amber-500 text-white' : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  मराठी Preview
                </button>
              </div>
            </div>

            {/* Embedded Live BogoBanner */}
            <div className="pt-2">
              <BogoBanner
                language={bogoPreviewLang}
                customImageUrl={bogoForm.imageUrl}
                onClaimOffer={() => showToast('Preview mode: "Claim Offer" clicked')}
                onExploreAll={() => showToast('Preview mode: "Explore All" clicked')}
              />
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    <ShoppingBag className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                      {editingProduct ? 'Edit Product & Pricing' : 'Add New Product or Masala'}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Updates are saved in real-time to Firebase Firestore.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
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
                      placeholder="e.g. Special Kanda Lasun Masala"
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
                      placeholder="उदा. स्पेशल कांदा लसूण मसाला"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Category & Tagline */}
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
                      Origin Region (मूळ ठिकाण)
                    </label>
                    <input
                      type="text"
                      value={formData.regionOriginEn}
                      onChange={(e) => setFormData({ ...formData, regionOriginEn: e.target.value, regionOriginMr: e.target.value })}
                      placeholder="e.g. Western Ghats / Konkan / Deccan"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* IMAGE SELECTION & UPLOAD SECTION */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/80 border border-amber-200/70 dark:border-stone-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                      Product Packaging Photo (चित्र निवडा किंवा अपलोड करा)
                    </label>
                    <div className="flex items-center gap-1 bg-white dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-700 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setImagePickerTab('presets')}
                        className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                          imagePickerTab === 'presets' ? 'bg-amber-500 text-white' : 'text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        Standard Presets (14)
                      </button>
                      <button
                        type="button"
                        onClick={() => setImagePickerTab('upload')}
                        className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                          imagePickerTab === 'upload' ? 'bg-amber-500 text-white' : 'text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setImagePickerTab('url')}
                        className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                          imagePickerTab === 'url' ? 'bg-amber-500 text-white' : 'text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        Custom URL
                      </button>
                    </div>
                  </div>

                  {/* Option 1: Preset Visual Grid */}
                  {imagePickerTab === 'presets' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 max-h-48 overflow-y-auto p-1">
                        {AVAILABLE_IMAGE_PRESETS.map((preset) => (
                          <button
                            type="button"
                            key={preset.id}
                            onClick={() => setFormData({ ...formData, imageUrl: preset.value })}
                            className={`rounded-xl overflow-hidden border-2 text-left transition-all p-1 bg-white dark:bg-stone-900 cursor-pointer ${
                              formData.imageUrl === preset.value
                                ? 'border-amber-600 ring-2 ring-amber-400'
                                : 'border-stone-200 dark:border-stone-700 opacity-80 hover:opacity-100'
                            }`}
                          >
                            <div className="aspect-square rounded-lg overflow-hidden mb-1">
                              <img src={preset.value} alt={preset.labelEn} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-[10px] font-bold text-stone-900 dark:text-stone-100 truncate">
                              {preset.labelEn}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Option 2: Upload from Device */}
                  {imagePickerTab === 'upload' && (
                    <div className="space-y-2">
                      <div
                        onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingOver(true);
                        }}
                        onDragLeave={() => setIsDraggingOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingOver(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleFileUpload(e.dataTransfer.files[0], false);
                          }
                        }}
                        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                          isDraggingOver 
                            ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 ring-2 ring-amber-400' 
                            : isUploadingImage
                            ? 'border-amber-400 bg-amber-50/30 dark:bg-amber-950/10 opacity-80 cursor-wait'
                            : 'border-amber-300 hover:border-amber-500 bg-white dark:bg-stone-900'
                        }`}
                      >
                        {isUploadingImage ? (
                          <div className="flex flex-col items-center justify-center py-2">
                            <div className="w-8 h-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin mb-2" />
                            <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                              {uploadProgressText || 'Processing image...'}
                            </span>
                            <span className="text-[10px] text-stone-400 mt-1">
                              Compressing to high-efficiency WebP format
                            </span>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-7 h-7 mx-auto text-amber-600 mb-1.5" />
                            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                              Click or Drag & Drop photo here
                            </span>
                            <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                              Supports JPG, PNG, WebP • Auto-optimized for instant customer loading
                            </span>
                            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-[10px] font-semibold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              Fast Real-time Firestore Sync
                            </span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0], false);
                          }
                          e.target.value = '';
                        }}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  )}

                  {/* Option 3: Custom URL input */}
                  {imagePickerTab === 'url' && (
                    <div>
                      <input
                        type="text"
                        placeholder="https://example.com/product.jpg or /products/kala-masala.jpg"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-mono"
                      />
                    </div>
                  )}

                  {/* Selected Preview Bar */}
                  <div className="flex items-center justify-between gap-3 bg-white dark:bg-stone-900 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-300 dark:border-stone-700 shrink-0 bg-stone-100">
                        {formData.imageUrl && (
                          <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          Selected Packaging Photo
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono truncate max-w-xs">
                          {formData.imageUrl}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SIZES & PRICING CONFIGURATION */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                        Packaging Sizes & Pricing (वजन व किमती)
                      </label>
                      <p className="text-[10px] text-stone-500">Configure prices and stock availability per size.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSizeTier}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950 dark:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Size
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(formData.sizes || []).map((sizeObj, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-12 gap-2 items-center bg-white dark:bg-stone-900 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs"
                      >
                        <div className="col-span-3">
                          <label className="text-[10px] text-stone-400 block mb-0.5">Size Label</label>
                          <input
                            type="text"
                            value={sizeObj.size}
                            onChange={(e) => handleSizeChange(idx, 'size', e.target.value)}
                            placeholder="e.g. 500g"
                            className="w-full px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] text-stone-400 block mb-0.5">Grams</label>
                          <input
                            type="number"
                            value={sizeObj.grams}
                            onChange={(e) => handleSizeChange(idx, 'grams', Number(e.target.value))}
                            className="w-full px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] text-stone-400 block mb-0.5">Selling (₹)</label>
                          <input
                            type="number"
                            value={sizeObj.price}
                            onChange={(e) => handleSizeChange(idx, 'price', Number(e.target.value))}
                            className="w-full px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold text-amber-700"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] text-stone-400 block mb-0.5">MRP (₹)</label>
                          <input
                            type="number"
                            value={sizeObj.originalPrice || sizeObj.price}
                            onChange={(e) => handleSizeChange(idx, 'originalPrice', Number(e.target.value))}
                            className="w-full px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                          />
                        </div>
                        <div className="col-span-2 flex items-center justify-center pt-3">
                          <button
                            type="button"
                            onClick={() => handleSizeChange(idx, 'inStock', !sizeObj.inStock)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                              sizeObj.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {sizeObj.inStock ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </div>
                        <div className="col-span-1 flex items-center justify-center pt-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveSizeTier(idx)}
                            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                            title="Remove size"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Description (English)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      placeholder="Culinary notes, traditional recipe background..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Description (मराठी)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.descriptionMr}
                      onChange={(e) => setFormData({ ...formData, descriptionMr: e.target.value })}
                      placeholder="पारंपरिक पद्धत, चव आणि माहिती..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Ingredients */}
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

                {/* Bestseller & Regional Checkboxes */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="rounded-md text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>Highlight as Bestseller (लोकप्रिय)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isRegionalSpecialty}
                      onChange={(e) => setFormData({ ...formData, isRegionalSpecialty: e.target.checked })}
                      className="rounded-md text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>Regional Specialty (स्थानिक वैशिष्ट्य)</span>
                  </label>
                </div>

                {/* Submit & Cancel */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingProduct ? 'Save to Firebase' : 'Create & Sync to Firebase'}</span>
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
                  className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
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
                      placeholder="e.g. Special Masalas & Blends"
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
                      placeholder="उदा. स्पेशल मसाले"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-xs cursor-pointer"
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
                  Delete Product from Firebase?
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Are you sure you want to delete <span className="font-bold text-stone-700 dark:text-stone-300">{productToDelete.nameEn}</span>? This change will reflect in real-time across the storefront.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setProductToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProductConfirm}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-xs cursor-pointer"
                >
                  Yes, Delete from Firebase
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
                  Are you sure you want to delete <span className="font-bold text-stone-700 dark:text-stone-300">{categoryToDelete.nameEn}</span>?
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setCategoryToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCategoryConfirm}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-xs cursor-pointer"
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
