import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingCart,
  Trash2,
  Move,
  Plus,
  ChevronRight,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Artwork, WallPlacement } from "./types";
import { ARTWORKS } from "./data";

interface AppProps {
  initialProducts?: Artwork[];
  onCheckout?: (placedItems: WallPlacement[]) => void;
}

export default function App({ initialProducts = [], onCheckout }: AppProps) {
  const [placedArtworks, setPlacedArtworks] = useState<WallPlacement[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [wallColor, setWallColor] = useState("#f9f7f5");
  const wallRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [filterType, setFilterType] = useState<string>("All");

  const wallColors = [
    { name: "Paper", color: "#f9f7f5" },
    { name: "Gallery White", color: "#ffffff" },
    { name: "Stone", color: "#dfddd9" },
    { name: "Warm Clay", color: "#d9cfc1" },
    { name: "Midnight", color: "#1a1a1a" },
  ];

  const addToWall = (artwork: Artwork, x: number, y: number) => {
    const newPlacement: WallPlacement = {
      id: Math.random().toString(36).slice(2, 11),
      artwork,
      x,
      y,
      rotation: (Math.random() - 0.5) * 2,
      selectedSizeIndex: 0,
    };

    setPlacedArtworks((prev) => [...prev, newPlacement]);
  };

  const removeFromWall = (id: string) => {
    setPlacedArtworks((prev) => prev.filter((item) => item.id !== id));
  };

  const setPosition = (id: string, x: number, y: number) => {
    setPlacedArtworks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x, y } : item)),
    );
  };

  const updateSelectedSize = (id: string, direction: 1 | -1) => {
    setPlacedArtworks((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const sizes = item.artwork.sizes || [];

        if (sizes.length === 0) return item;

        const maxIndex = sizes.length - 1;
        const nextIndex = Math.max(
          0,
          Math.min(maxIndex, item.selectedSizeIndex + direction),
        );

        return {
          ...item,
          selectedSizeIndex: nextIndex,
        };
      }),
    );
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [filterType]);

  const calculateTotal = () => {
    return Math.round(
      placedArtworks.reduce((sum, item) => {
        const selectedSize = item.artwork.sizes?.[item.selectedSizeIndex];
        return sum + (selectedSize?.price || item.artwork.price);
      }, 0),
    );
  };

  const artworks = initialProducts.length > 0 ? initialProducts : ARTWORKS;
  const filteredArtworks =
    filterType === "All"
      ? artworks
      : artworks.filter((artwork) => artwork.type === filterType);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden select-none">
      {/* Header */}
      <header className="h-20 px-10 flex justify-between items-center border-b border-stone-200 bg-white/50 backdrop-blur-md z-50">
        <div className="flex flex-col">
          <h1 className="text-2xl italic tracking-tight text-gallery-ink serif leading-none">
            Gallery Wall Visualizer
          </h1>
          <p className="text-[11px] uppercase tracking-[0.05em] font-medium text-[#666]">
            Curated Space Visualizer
          </p>
        </div>

        <nav className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium items-center">
          <button
            onClick={() => setFilterType("Canvas Print")}
            className={`transition-opacity ${
              filterType === "Canvas Print"
                ? "opacity-100 font-bold"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            Canvas Prints
          </button>

          <button
            onClick={() => setFilterType("Paper Print")}
            className={`transition-opacity ${
              filterType === "Paper Print"
                ? "opacity-100 font-bold"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            Paper Prints
          </button>

          <button
            onClick={() => setFilterType("All")}
            className={`transition-opacity ${
              filterType === "All"
                ? "opacity-100 font-bold"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            All
          </button>

          <div className="relative ml-4 px-3 py-1 bg-black text-white rounded-full text-[10px]">
            Wall: {placedArtworks.length.toString().padStart(2, "0")}
          </div>
        </nav>

        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-none text-xs uppercase tracking-widest font-bold border border-black"
          >
            <ShoppingCart size={14} />
            Checkout ({placedArtworks.length})
          </motion.button>
        </div>
      </header>

      {/* Main Experience */}
      <main className="flex-1 relative bg-gallery-bg overflow-hidden flex flex-col">
        {/* Wall Controls */}
        <div className="absolute top-8 left-10 z-30 flex flex-col gap-4">
          {placedArtworks.length > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setPlacedArtworks([])}
              className="bg-white/80 backdrop-blur-md px-4 py-2 border border-black/5 shadow-xl text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-stone-100 text-gallery-ink transition-colors"
            >
              <Trash2 size={12} />
              Clear Composition
            </motion.button>
          )}

          <div className="flex gap-4 items-center">
            <div className="flex gap-1.5">
              {wallColors.slice(0, 3).map((wc) => (
                <button
                  key={wc.name}
                  onClick={() => setWallColor(wc.color)}
                  aria-label="Set Wall Color"
                  title="Set Wall Color"
                  className={`w-3 h-3 rounded-full transition-all ${wallColor === wc.color ? "ring-2 ring-offset-2 ring-stone-400 scale-110" : ""}`}
                  style={{ backgroundColor: wc.color }}
                />
              ))}
            </div>
            <span className="text-[11px] uppercase tracking-[0.05em] text-[#666] font-medium">
              Wall Texture:{" "}
              {wallColors.find((c) => c.color === wallColor)?.name || "Custom"}
            </span>
          </div>
        </div>

        {/* The Wall Area */}
        <div
          ref={wallRef}
          style={{
            backgroundImage:
              "linear-gradient(180deg, #EBE9E4 0%, #D8D4CE 100%)",
          }}
          className="flex-1 relative flex items-center justify-center p-12 border-b-2 border-wall-border transition-colors duration-500"
        >
          <motion.div
            animate={{ backgroundColor: wallColor }}
            className="relative w-full max-w-6xl aspect-[21/9] shadow-[inset_0_2px_15px_rgba(0,0,0,0.05),0_30px_60px_-12px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden flex items-center justify-center"
          >
            {/* Wall Content */}
            <AnimatePresence>
              {placedArtworks.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 text-gallery-ink italic"
                >
                  <Plus size={48} strokeWidth={1} />
                  <p className="text-xl">Drag artwork here to visualize</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Placed Items */}
            {placedArtworks.map((item) => {
              const selectedSize = item.artwork.sizes?.[item.selectedSizeIndex];
              const isSmallestSize = item.selectedSizeIndex === 0;
              const isLargestSize =
                item.selectedSizeIndex === item.artwork.sizes.length - 1;
              return (
                <motion.div
                  key={item.id}
                  drag
                  dragMomentum={false}
                  onDragEnd={(_, info) => {
                    setPosition(
                      item.id,
                      item.x + info.offset.x,
                      item.y + info.offset.y,
                    );
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: item.x,
                    y: item.y,
                    rotate: item.rotation,
                  }}
                  className="absolute group"
                  style={{
                    width:
                      item.artwork.sizes?.[item.selectedSizeIndex]?.widthCm *
                        2.5 || 120,

                    height:
                      item.artwork.sizes?.[item.selectedSizeIndex]?.heightCm *
                        2.5 || 160,

                    zIndex: 10,
                  }}
                >
                  <div className="relative w-full h-full shadow-[0_10px_30px_rgba(0,0,0,0.25)] border-[12px] border-black bg-white overflow-hidden transition-transform group-hover:scale-[1.02]">
                    <img
                      src={item.artwork.imageUrl}
                      alt={item.artwork.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {/* Item Toolbar */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => removeFromWall(item.id)}
                        className="p-1.5 bg-white rounded-none text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div
                        className="p-1.5 bg-white rounded-none text-gallery-ink cursor-move"
                        title="Drag to move"
                      >
                        <Move size={14} />
                      </div>
                      <button
                        onClick={() => updateSelectedSize(item.id, 1)}
                        disabled={isLargestSize}
                        className="p-1.5 bg-white rounded-none text-gallery-ink hover:bg-stone-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Larger Size"
                      >
                        <ZoomIn size={14} />
                      </button>
                      <button
                        onClick={() => updateSelectedSize(item.id, -1)}
                        disabled={isSmallestSize}
                        className="p-1.5 bg-white rounded-none text-gallery-ink hover:bg-stone-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Smaller Size"
                      >
                        <ZoomOut size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-[calc(100%+8px)] left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <p className="text-[10px] font-bold uppercase tracking-tighter">
                      {item.artwork.title}
                    </p>
                    <div className="flex flex-col items-center gap-0.5">
                      <p className="text-[10px] font-medium italic">
                        {selectedSize?.formattedPrice ||
                          `$${selectedSize?.price || 0}`}
                      </p>

                      <p className="text-[8px] opacity-50 uppercase tracking-widest leading-none">
                        {selectedSize?.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Scale Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur rounded-full text-[10px] uppercase tracking-widest opacity-40">
            <span>Visualized at 1:10 scale</span>
          </div>

          <AnimatePresence>
            {showInstructions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 text-gallery-ink p-10 border border-dashed border-[#A19D97] shadow-2xl z-40 text-center max-w-sm pointer-events-none"
              >
                <div className="mb-4 inline-flex items-center justify-center p-3 opacity-20">
                  <Move />
                </div>
                <h4 className="serif text-xl italic mb-3">Artistic Flair</h4>
                <p className="text-[10px] uppercase tracking-[0.15em] leading-relaxed opacity-60">
                  Drag art here to
                  <br />
                  create a group
                </p>
                <button
                  onMouseEnter={() => setShowInstructions(false)}
                  className="mt-8 text-[9px] uppercase tracking-[0.1em] font-bold pointer-events-auto border-b border-black/20"
                >
                  Begin Session
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Checkout Floating Summary (replacing scale indicator style) */}
          <div className="absolute bottom-10 right-10 flex items-center gap-8 z-30">
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.05em] text-[#666] mb-1 font-medium">
                Set Total
              </p>
              <p className="serif text-3xl italic leading-none font-light">
                ${calculateTotal()}.00
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#333" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCartOpen(true)}
              className="bg-black text-white px-10 py-5 uppercase text-xs tracking-[0.15em] font-bold shadow-xl border border-black"
            >
              Checkout Collection
            </motion.button>
          </div>
        </div>

        {/* Carousel Bottom Bar (Shelf) */}
        <div className="h-[260px] bg-white/80 backdrop-blur-[10px] border-t border-stone-300 relative z-20 flex items-center px-8 gap-6">
          <div className="flex flex-col w-40 shrink-0 h-full justify-center">
            <h2 className="serif italic text-xl leading-tight mb-2">
              Print Carousel
            </h2>

            {/* Filter UI */}
            <div className="flex flex-wrap gap-2 mt-1">
              {["All", "Paper Print", "Canvas Print"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`text-[8px] uppercase tracking-widest px-2 py-1 border transition-all ${
                    filterType === type
                      ? "bg-black text-white border-black"
                      : "border-stone-200 hover:border-black/20 text-stone-500"
                  }`}
                >
                  {type === "All" ? "View All" : type.split(" ")[0]}
                </button>
              ))}
            </div>

            <p className="text-[10px] text-[#666] uppercase tracking-[0.05em] leading-relaxed mt-4 opacity-70">
              Scroll through the collection and drag art to your wall.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-1 h-full overflow-hidden relative">
            <button
              onClick={() => scrollCarousel("left")}
              className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center cursor-pointer hover:bg-stone-50 hover:scale-110 active:scale-95 transition-all shrink-0 bg-white shadow-md z-30"
              aria-label="Scroll Left"
            >
              <ChevronLeft size={18} className="text-gallery-ink" />
            </button>

            <div
              ref={carouselRef}
              className="flex-1 overflow-x-auto flex flex-row items-start gap-10 py-6 scroll-smooth no-scrollbar px-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredArtworks.map((artwork) => (
                  <motion.div
                    key={artwork.id}
                    //layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    whileDrag={{ zIndex: 9999, scale: 1.05 }}
                    className="relative flex-shrink-0 w-48 cursor-grab active:cursor-grabbing group"
                    drag
                    dragElastic={0}
                    dragMomentum={false}
                    dragSnapToOrigin
                    //dragConstraints={wallRef}
                    onDragStart={() => setShowInstructions(false)}
                    onDragEnd={(_, info) => {
                      const rect = wallRef.current?.getBoundingClientRect();
                      if (!rect) return;

                      const dropX = info.point.x;
                      const dropY = info.point.y;

                      const isInsideWall =
                        dropX >= rect.left &&
                        dropX <= rect.right &&
                        dropY >= rect.top &&
                        dropY <= rect.bottom;

                      if (isInsideWall) {
                        const x = dropX - rect.left - rect.width / 2;
                        const y = dropY - rect.top - rect.height / 2;

                        addToWall(artwork, x, y);
                      }
                    }}
                  >
                    <div className="relative aspect-square bg-white border border-stone-200 p-2 shadow-sm mb-2 group-hover:shadow-md transition-shadow">
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover pointer-events-none"
                        referrerPolicy="no-referrer"
                        draggable={false}
                      />
                      <div className="absolute top-3 right-3 bg-white/90 px-1 py-0.5 text-[7px] font-bold uppercase border border-black/5">
                        {artwork.type}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                        {artwork.title}
                      </h3>
                      <div className="flex flex-col gap-0.5 text-[9px] text-stone-400 font-medium italic">
                        <span>
                          Starting at{" "}
                          {artwork.sizes?.[0]?.formattedPrice ||
                            `$${artwork.sizes?.[0]?.price || artwork.price}`}
                        </span>

                        <span className="opacity-70">
                          Smallest size:{" "}
                          {artwork.sizes?.[0]?.label || "Size varies"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button
              onClick={() => scrollCarousel("right")}
              className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center cursor-pointer hover:bg-stone-50 hover:scale-110 active:scale-95 transition-all shrink-0 bg-white shadow-md z-30"
              aria-label="Scroll Right"
            >
              <ChevronRight size={18} className="text-gallery-ink" />
            </button>
          </div>
        </div>
      </main>

      {/* Info Sidebar (Optional toggle would be better, but we show as static overlay for now) */}
      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-end p-6 pointer-events-none"
          >
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="relative w-full max-w-md bg-gallery-bg h-full shadow-2xl rounded-3xl overflow-hidden flex flex-col pointer-events-auto border-l border-white/20"
            >
              <div className="p-8 border-b border-black/5 flex justify-between items-center bg-white/50">
                <h2 className="text-2xl tracking-tight">
                  Your Wall Collection
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Open cart"
                  title="Open cart"
                  className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {placedArtworks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-40 italic">
                    <p>No items added yet</p>
                  </div>
                ) : (
                  placedArtworks.map((item) => {
                    const selectedSize =
                      item.artwork.sizes[item.selectedSizeIndex];

                    return (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-white p-1 shadow-sm rounded-sm">
                          <img
                            src={item.artwork.imageUrl}
                            alt={item.artwork.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold uppercase leading-none mb-0.5">
                            {item.artwork.title}
                          </h4>
                          <p className="text-[9px] opacity-40 italic mb-1">
                            {item.artwork.type} by {item.artwork.artist}
                          </p>
                          <div className="flex flex-col gap-0.5 mt-1">
                            <p className="text-[8px] opacity-50 uppercase tracking-widest">
                              {selectedSize?.label}
                            </p>

                            <p className="text-[10px] italic opacity-80">
                              {selectedSize?.formattedPrice ||
                                `$${selectedSize?.price || 0}`}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromWall(item.id)}
                          aria-label="Remove artwork"
                          title="Remove artwork"
                          className="text-red-400 p-2 hover:bg-red-50 rounded-full transition-colors border border-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-8 bg-white border-t border-black/5 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">
                    Total Value
                  </span>
                  <span className="text-3xl font-light">
                    ${calculateTotal()}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (onCheckout) {
                      onCheckout(placedArtworks);
                    }
                  }}
                  disabled={placedArtworks.length === 0}
                  className="w-full bg-black text-white py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-medium hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed border border-black"
                >
                  Complete Checkout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
