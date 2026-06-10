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
  onRequestProducts?: () => void;
}

export default function App({
  initialProducts = [],
  onCheckout,
  onRequestProducts,
}: AppProps) {
  const [placedArtworks, setPlacedArtworks] = useState<WallPlacement[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [wallColor, setWallColor] = useState("#f9f7f5");
  const wallRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const [hasStartedDesigning, setHasStartedDesigning] = useState(false);

  const wallColors = [
    { name: "Paper", color: "#f9f7f5" },
    { name: "Gallery White", color: "#ffffff" },
    { name: "Stone", color: "#dfddd9" },
    { name: "Warm Clay", color: "#d9cfc1" },
    { name: "Midnight", color: "#1a1a1a" },
  ];

  const ASSET_BASE =
    "https://cdn.jsdelivr.net/gh/Jexto-33e/wall-visualizer@main/dist";

  const roomScenes = [
    {
      name: "Room1",
      image: `${ASSET_BASE}/room-scenes/Room1.jpg`,
    },
    {
      name: "Room2",
      image: `${ASSET_BASE}/room-scenes/Room2.jpg`,
    },
    {
      name: "Room5",
      image: `${ASSET_BASE}/room-scenes/Room5.jpg`,
    },
    {
      name: "Room6",
      image: `${ASSET_BASE}/room-scenes/Room6.jpg`,
    },
    {
      name: "Room7",
      image: `${ASSET_BASE}/room-scenes/Room7.jpg`,
    },
    {
      name: "Room8",
      image: `${ASSET_BASE}/room-scenes/Room8.jpg`,
    },
    {
      name: "Room9",
      image: `${ASSET_BASE}/room-scenes/Room9.jpg`,
    },
    {
      name: "Room10",
      image: `${ASSET_BASE}/room-scenes/Room10.jpg`,
    },
  ];

  const [selectedRoomScene, setSelectedRoomScene] = useState<string | null>(
    null,
  );

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

  const artworks = hasStartedDesigning ? initialProducts : [];

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
    <div className="w-full h-full min-h-[850px] flex flex-col overflow-hidden select-none">
      {/* Header */}
      <header className="h-20 px-10 flex justify-between items-center border-b border-stone-200 bg-white/50 backdrop-blur-md z-50">
        <div className="flex flex-col">
          <h1 className="text-2xl italic tracking-tight text-gallery-ink serif leading-none">
            Gallery Wall Visualizer
          </h1>
          <br></br>
          <p className="text-[11px] uppercase tracking-[0.05em] font-medium text-[#666]">
            Curated Space Visualizer
          </p>
          <br></br>
          {/* here was the VERSION COMMENT FOR TESTING */}
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

          <div
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
            }}
            className="relative ml-4 px-4 py-1.5 rounded-full text-[10px]"
          >
            Wall: {placedArtworks.length.toString().padStart(2, "0")}
          </div>
        </nav>

        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "1px solid #000000",
            }}
            className="flex items-center gap-3 px-8 py-3 rounded-none text-xs uppercase tracking-widest font-bold"
          >
            <ShoppingCart size={14} />
            Checkout ({placedArtworks.length})
          </motion.button>
        </div>
      </header>

      {/* Main Experience */}
      <main className="flex-1 relative bg-gallery-bg overflow-hidden flex flex-col">
        {/* The Wall Area */}
        <div
          ref={wallRef}
          style={{
            backgroundImage:
              "linear-gradient(180deg, #EBE9E4 0%, #D8D4CE 100%)",
          }}
          className="flex-1 relative flex items-center justify-center p-12 border-b-2 border-wall-border transition-colors duration-500"
        >
          <div
            style={{
              backgroundColor: "rgba(250, 247, 241, 0.88)",
              color: "#1A1A1A",
              border: "1px solid rgba(0,0,0,0.06)",
              backdropFilter: "blur(12px)",
            }}
            className="absolute top-8 left-8 z-40 w-60 p-5 shadow-xl" // CHECK WIDTH AGAIN JUST IN CASE FOR LEFT PANNEL
          >
            <p className="text-[9px] uppercase tracking-[0.18em] font-bold mb-3">
              Wall Color
            </p>

            <div className="flex gap-2 mb-10">
              {wallColors.map((wc) => (
                <button
                  key={wc.name}
                  onClick={() => {
                    setWallColor(wc.color);
                    setSelectedRoomScene(null);
                  }}
                  title={wc.name}
                  style={{
                    backgroundColor: wc.color,
                    border:
                      wallColor === wc.color && !selectedRoomScene
                        ? "2px solid #000"
                        : "1px solid rgba(0,0,0,0.15)",
                  }}
                  className="w-7 h-7 rounded-full"
                />
              ))}
            </div>

            <p className="text-[9px] uppercase tracking-[0.18em] font-bold mb-3">
              Room Scene
            </p>

            <div className="grid grid-cols-2 gap-3 mb-10">
              {roomScenes.map((scene) => (
                <button
                  key={scene.name}
                  onClick={() => {
                    setSelectedRoomScene(scene.image);
                  }}
                  style={{
                    border:
                      selectedRoomScene === scene.image
                        ? "2px solid #000"
                        : "1px solid rgba(0,0,0,0.12)",
                  }}
                  className="h-14 overflow-hidden"
                  title={scene.name}
                >
                  <img
                    src={scene.image}
                    alt={scene.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setPlacedArtworks([]);
                setSelectedRoomScene(null);
                setWallColor(wallColors[0].color);
              }}
              style={{
                backgroundColor: "#000000",
                color: "#F5EFE6",
                border: "1px solid #000000",
              }}
              className="mt-6 w-full py-3 text-[8px] uppercase tracking-[0.16em] font-bold"
            >
              Clear Wall
            </button>
          </div>
          <motion.div
            animate={{
              backgroundColor: selectedRoomScene ? "transparent" : wallColor,
            }}
            style={{
              backgroundImage: selectedRoomScene
                ? `url(${selectedRoomScene})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="relative w-full max-w-6xl aspect-[21/9] shadow-[inset_0_2px_15px_rgba(0,0,0,0.05),0_30px_60px_-12px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden flex items-center justify-center"
          >
            {/* Wall Content */}
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
                  <div
                    className="relative w-full h-full bg-white overflow-hidden transition-transform group-hover:scale-[1.01]"
                    style={{
                      boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
                    }}
                  >
                    <img
                      src={item.artwork.imageUrl}
                      alt={item.artwork.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {/* Item Toolbar */}
                    <div
                      style={{
                        backgroundColor: "rgba(245, 240, 232, 0.3)",
                      }}
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                    >
                      <button
                        onClick={() => removeFromWall(item.id)}
                        title="Remove"
                        style={{
                          backgroundColor: "rgba(245, 240, 232, 0.72)",
                          backdropFilter: "blur(8px)",
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-[#8B3A3A] hover:scale-105 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                      <div
                        title="Drag to move"
                        style={{
                          backgroundColor: "rgba(245, 240, 232, 0.72)",
                          backdropFilter: "blur(8px)",
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-[#333] hover:scale-105 transition-all"
                      >
                        <Move size={13} />
                      </div>
                      <button
                        onClick={() => updateSelectedSize(item.id, 1)}
                        disabled={isLargestSize}
                        style={{
                          backgroundColor: "rgba(245, 240, 232, 0.72)",
                          backdropFilter: "blur(8px)",
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-[#333] hover:scale-105 transition-all"
                        title="Larger Size"
                      >
                        <ZoomIn size={13} />
                      </button>
                      <button
                        onClick={() => updateSelectedSize(item.id, -1)}
                        disabled={isSmallestSize}
                        style={{
                          backgroundColor: "rgba(245, 240, 232, 0.72)",
                          backdropFilter: "blur(8px)",
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-[#333] hover:scale-105 transition-all"
                        title="Smaller Size"
                      >
                        <ZoomOut size={13} />
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
                style={{
                  backgroundColor: "rgba(250, 247, 241, 0.86)",
                  color: "#2A211C",
                  border: "1px dashed rgba(42,33,28,0.35)",
                  backdropFilter: "blur(8px)",
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 shadow-2xl z-40 text-center max-w-sm pointer-events-none"
              >
                <p className="serif text-xl italic mb-4 leading-snug">
                  Drag print here to begin creating your space
                </p>

                <button
                  onClick={() => {
                    setShowInstructions(false);
                    setHasStartedDesigning(true);
                    onRequestProducts?.();
                  }}
                  style={{
                    backgroundColor: "#000000",
                    color: "#F5EFE6",
                    border: "1px solid #000000",
                  }}
                  className="mt-3 px-6 py-3 text-[9px] uppercase tracking-[0.18em] font-bold pointer-events-auto"
                >
                  Begin Designing
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Checkout Floating Summary (replacing scale indicator style) */}
          <div
            style={{
              backgroundColor: "rgba(245, 240, 232, 0.92)",
              color: "#111111",
              border: "1px solid rgba(0,0,0,0.08)",
              backdropFilter: "blur(10px)",
            }}
            className="absolute bottom-10 right-10 z-30 flex items-stetch shadow-xl"
          >
            <div
              style={{
                borderRight: "1px solid rgba(0,0,0,0.12)",
              }}
              className="px-10 py-6 text-right"
            >
              <p className="text-[9px] uppercase tracking-[0.16em] opacity-60 mb-1 font-bold">
                Set Total
              </p>
              <p className="serif text-3xl italic leading-none font-light">
                ${calculateTotal()}.00
              </p>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                backgroundColor: "transparent",
                color: "#111111",
                border: "none",
              }}
              className="px-12 py-8 uppercase text-xs tracking-[0.15em] font-bold"
            >
              Checkout Collection
            </button>
          </div>
        </div>

        {/* Carousel Bottom Bar (Shelf) */}
        <div className="h-[240px] bg-white/80 backdrop-blur-[10px] border-t border-stone-300 relative z-20 flex items-center px-8 gap-6">
          <div
            className="flex flex-col w-44 shrink-0 h-full justify-center"
            style={{
              color: "#1A1A1A",
            }}
          >
            <h2 className="serif italic text-xl leading-tight mb-4">
              Print Carousel
            </h2>

            {/* Filter UI */}
            <div className="flex flex-wrap gap-2 mt-1 mb-4">
              {["All", "Paper Print", "Canvas Print"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  style={{
                    backgroundColor:
                      filterType === type ? "#000000" : "#FFFFFF",
                    color: filterType === type ? "#FFFFFF" : "#666666",
                    border:
                      filterType === type
                        ? "1px solid #000000"
                        : "1px solid #D6D3D1",
                  }}
                  className="text-[8px] uppercase tracking-widest px-2 py-2 transition-all"
                >
                  {type === "All" ? "View All" : type.split(" ")[0]}
                </button>
              ))}
            </div>

            <p className="text-[10px] text-[#666] uppercase tracking-[0.05em] leading-relaxed mt-2 opacity-70">
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
              className="flex-1 overflow-x-auto flex flex-row items-center gap-10 py-6 scroll-smooth no-scrollbar px-4"
            >
              {!hasStartedDesigning && (
                <div
                  style={{
                    color: "#6B625B",
                    border: "1px dashed rgba(0,0,0,0.18)",
                    backgroundColor: "rgba(245,240,232,0.45)",
                  }}
                  className="w-full h-32 flex items-center justify-center text-[10px] uppercase tracking-[0.16em]"
                >
                  Click Begin Designing to load the collection
                </div>
              )}

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
                    className="relative flex-shrink-0 w-35 cursor-grab active:cursor-grabbing group"
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
                      const dropY = info.point.y - window.scrollY;

                      console.log("DROP TEST FIXED:", {
                        dropX,
                        dropY,
                        scrollY: window.scrollY,
                        wallRect: rect,
                      });

                      const isInsideWall =
                        dropX >= rect.left &&
                        dropX <= rect.right &&
                        dropY >= rect.top &&
                        dropY <= rect.bottom;

                      console.log("INSIDE WALL FIXED?", isInsideWall);

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
              style={{
                backgroundColor: "#F7F6F3",
                color: "#1A1A1A",
              }}
              className="relative w-full max-w-md bg-gallery-bg h-full shadow-2xl rounded-3xl overflow-hidden flex flex-col pointer-events-auto border-l border-white/20"
            >
              <div
                style={{
                  padding: "32px 40px",
                }}
                className="border-b border-black/5 flex justify-between items-center bg-white/50"
              >
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

              <div
                style={{
                  padding: "32px 40px",
                }}
                className="bg-white border-t border-black/5 space-y-6"
              >
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
                  style={{
                    backgroundColor:
                      placedArtworks.length === 0 ? "#000000" : "#000000",
                    color: "#ffffff",
                    border: "1px solid #000000",
                    opacity: placedArtworks.length === 0 ? 0.35 : 1,
                    cursor:
                      placedArtworks.length === 0 ? "not-allowed" : "pointer",
                  }}
                  className="w-full py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-medium shadow-lg"
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
