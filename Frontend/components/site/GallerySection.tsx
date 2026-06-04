import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EyeIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { generateGalleryItems, getUniqueCategories, formatTitle, type GalleryItem } from "../../data/galleryData";

const galleryItems = generateGalleryItems("http://localhost:8080/Gallary/");

interface ModalState {
  isOpen: boolean;
  items: GalleryItem[];        // All images shown in modal (related + same category)
  currentIndex: number;
}

export default function GallerySection({ raisedShadow, insetShadow }: { raisedShadow?: string; insetShadow?: string }) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    items: [],
    currentIndex: 0,
  });

  // ====================== TABS ======================
  const galleryTabs = useMemo(() => {
    const catMap = new Map<string, { label: string; count: number }>();
    catMap.set("all", { label: "All", count: galleryItems.length });

    galleryItems.forEach((item) => {
      if (!catMap.has(item.category)) {
        catMap.set(item.category, { label: formatTitle(item.category), count: 0 });
      }
      catMap.get(item.category)!.count++;
    });

    return Array.from(catMap.entries()).map(([id, data]) => ({
      id,
      label: data.label,
      count: data.count,
    }));
  }, []);

  // ====================== MIXED GALLERY (All Tab) ======================
  const mixedGallery = useMemo(() => {
    if (activeTab !== "all") return galleryItems.filter((i) => i.category === activeTab);

    // Group by category
    const grouped = galleryItems.reduce<Record<string, GalleryItem[]>>((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    const categories = Object.keys(grouped);
    if (categories.length === 0) return [];

    // Interleave categories round-robin style for balanced distribution
    const result: GalleryItem[] = [];
    let maxLen = Math.max(...Object.values(grouped).map(arr => arr.length));

    for (let i = 0; i < maxLen; i++) {
      for (const cat of categories) {
        if (grouped[cat][i]) {
          result.push(grouped[cat][i]);
        }
      }
    }
    return result;
  }, [activeTab]);

  // ====================== RELATED IMAGES LOGIC ======================
  const getRelatedImages = useCallback((clickedItem: GalleryItem): GalleryItem[] => {
    // Same category first
    let related = galleryItems.filter((item) => item.category === clickedItem.category);

    // Optional: Add items with similar tags if you extend GalleryItem with tags
    // For now, we keep it simple and clean (same category + clicked item prioritized)

    // Ensure clicked item is in the list and move it to index 0 for initial focus
    const withoutClicked = related.filter((item) => item.id !== clickedItem.id);
    return [clickedItem, ...withoutClicked];
  }, []);

  const handleImageClick = (clickedItem: GalleryItem) => {
    const relatedItems = getRelatedImages(clickedItem);
    const currentIndex = relatedItems.findIndex((item) => item.id === clickedItem.id);

    setModalState({
      isOpen: true,
      items: relatedItems,
      currentIndex: Math.max(0, currentIndex),
    });
  };

  // ====================== MODAL CONTROLS ======================
  const closeModal = () => {
    setModalState({ isOpen: false, items: [], currentIndex: 0 });
  };

  const goToIndex = (index: number) => {
    setModalState((prev) => ({
      ...prev,
      currentIndex: (index + prev.items.length) % prev.items.length,
    }));
  };

  const nextImage = () => goToIndex(modalState.currentIndex + 1);
  const prevImage = () => goToIndex(modalState.currentIndex - 1);

  // Keyboard + Scroll lock
  // useEffect(() => {
  //   if (!modalState.isOpen) return;

  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === "ArrowLeft") prevImage();
  //     if (e.key === "ArrowRight") nextImage();
  //     if (e.key === "Escape") closeModal();
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   document.body.style.overflow = "hidden";

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //     document.body.style.overflow = "unset";
  //   };
  // }, [modalState.isOpen]);
  useEffect(() => {
    if (!modalState.isOpen) return;

    const interval = setInterval(() => {
      nextImage();
    }, 3000); // 3 sec me auto change (change kar sakte ho)

    return () => clearInterval(interval);
  }, [modalState.isOpen, modalState.currentIndex]);

  const currentImage = modalState.isOpen ? modalState.items[modalState.currentIndex] : null;

  return (
    <section className="py-20  bg-[#f3efff]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-3xl  bg-[#f3efff] shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] mb-6"
          >
            <EyeIcon className="w-6 h-6 text-violet-600" />
            <span className="font-semibold text-violet-700">Learning Experience</span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Explore Our Learning Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get a glimpse of our interactive classrooms, student projects, and success stories
          </p>
        </div>

        {/* Tabs */}
        {galleryTabs.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {galleryTabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 rounded-3xl font-semibold text-sm flex items-center gap-3 transition-all duration-300
                  ${activeTab === tab.id
                    ? ` bg-[#f3efff] text-violet-700 ${insetShadow}`
                    : ` bg-[#f3efff] text-gray-700 hover:text-gray-900 ${raisedShadow}`
                  }`}
              >
                {tab.label}
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${activeTab === tab.id ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-600"}`}>
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {mixedGallery.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -30 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ y: -12, scale: 1.03 }}
                onClick={() => handleImageClick(item)}
                className={`group relative rounded-3xl overflow-hidden  bg-[#f3efff] ${raisedShadow} cursor-pointer`}
              >
                <div className="relative aspect-video overflow-hidden rounded-t-3xl bg-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  <div className="absolute top-5 left-5">
                    <span className="px-4 py-1.5 text-xs font-semibold rounded-2xl bg-white/90 backdrop-blur shadow-inner text-gray-800">
                      {item.badge}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-7">
                  <h3 className="font-semibold text-xl text-gray-800 mb-3 line-clamp-2 group-hover:text-violet-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-[15px] leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ====================== IMPROVED MODAL ====================== */}
        <AnimatePresence>
          {modalState.isOpen && currentImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-6"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`relative w-full max-w-6xl  bg-[#f3efff] rounded-3xl overflow-hidden ${raisedShadow}`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Controls */}
                <div className="absolute top-12 left-6 z-20 flex items-center gap-3">
                  <span className="px-4 py-2 rounded-2xl bg-black/60 backdrop-blur text-white text-sm font-semibold">
                    {modalState.currentIndex + 1} / {modalState.items.length}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium bg-white/80 rounded-xl text-gray-700">
                    {currentImage.category}
                  </span>
                </div>

                <button
                  onClick={closeModal}
                  className={`absolute top-12 right-6 z-20 p-1 rounded-2xl  bg-[#f3efff] ${raisedShadow} hover:scale-110 active:${insetShadow} transition-all`}
                >
                  <XMarkIcon className="w-6 h-6 text-gray-700" />
                </button>

                {/* Main Image Area */}
                <div className="relative bg-black flex items-center justify-center min-h-[60vh] md:min-h-[70vh]">
                  <motion.img
                    key={currentImage.id}
                    src={currentImage.image}
                    alt={currentImage.title}
                    className="max-h-[75vh] w-auto max-w-full object-contain"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                    loading="lazy"
                  />

                  {/* Navigation Arrows */}
                  {modalState.items.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className={`absolute left-6 top-1/2 -translate-y-1/2 p-1 rounded-2xl  bg-[#f3efff]/90 backdrop-blur ${raisedShadow} hover:scale-110 active:${insetShadow}`}
                      >
                        <ChevronLeftIcon className="w-7 h-7 text-gray-700" />
                      </button>
                      <button
                        onClick={nextImage}
                        className={`absolute right-6 top-1/2 -translate-y-1/2 p-1 rounded-2xl  bg-[#f3efff]/90 backdrop-blur ${raisedShadow} hover:scale-110 active:${insetShadow}`}
                      >
                        <ChevronRightIcon className="w-7 h-7 text-gray-700" />
                      </button>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 border-t border-gray-200">
                  <h3 className="text-3xl font-bold text-gray-800 mb-3">{currentImage.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{currentImage.description}</p>
                </div>

                {/* Thumbnail Strip */}
                {modalState.items.length > 1 && (
                  <div className="px-8 pb-8 overflow-x-auto">
                    <div className="flex gap-3 pb-2">
                      {modalState.items.map((item, idx) => (
                        <motion.button
                          key={item.id}
                          onClick={() => goToIndex(idx)}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${idx === modalState.currentIndex
                            ? "border-violet-600 shadow-lg"
                            : "border-transparent hover:border-gray-300"
                            }`}
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {idx === modalState.currentIndex && (
                            <div className="absolute inset-0 bg-violet-600/20" />
                          )}
                          <div className="absolute bottom-1 right-1 text-[10px] bg-black/70 text-white px-1.5 rounded">
                            {item.badge}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}