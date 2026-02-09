"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Upload,
  Check,
  MoreHorizontal,
  Share2,
  Trash2,
  FolderPlus,
} from "lucide-react";
import { ImageIcon } from "lucide-react";
import Link from "next/link";

interface Album {
  id: number;
  title: string;
  thumbnail: string | null;
  eventDate: string | null;
  photoCount: number;
}

interface Photo {
  id: number;
  url: string;
  caption: string | null;
  liked: boolean;
  createdAt: string;
  albumId?: number | null;
}

export function GalleryView() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );
  const [showAddAlbumModal, setShowAddAlbumModal] = useState(false);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [newPhotoCaption, setNewPhotoCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Multi-select mode
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set());
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAlbumSheet, setShowAlbumSheet] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Prevent body scroll when any modal is open
  useEffect(() => {
    const isAnyModalOpen =
      showMoreMenu ||
      showAlbumSheet ||
      showAddAlbumModal ||
      showAddPhotoModal ||
      selectedPhotoIndex !== null;
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [
    showMoreMenu,
    showAlbumSheet,
    showAddAlbumModal,
    showAddPhotoModal,
    selectedPhotoIndex,
  ]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [albumsRes, photosRes] = await Promise.all([
        fetch("/api/albums?mode=dating"),
        fetch("/api/photos?mode=dating"),
      ]);
      const albumsData = await albumsRes.json();
      const photosData = await photosRes.json();
      setAlbums(Array.isArray(albumsData) ? albumsData : []);
      setPhotos(Array.isArray(photosData) ? photosData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrev = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const toggleLike = async (id: number) => {
    const photo = photos.find((p) => p.id === id);
    if (!photo) return;

    try {
      await fetch("/api/photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, liked: !photo.liked }),
      });
      setPhotos(
        photos.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p)),
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const createAlbum = async () => {
    if (!newAlbumTitle.trim()) return;

    try {
      const res = await fetch("/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newAlbumTitle,
          mode: "dating",
        }),
      });
      const newAlbum = await res.json();
      setAlbums([newAlbum, ...albums]);
      setNewAlbumTitle("");
      setShowAddAlbumModal(false);
    } catch (error) {
      console.error("Error creating album:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const { url } = await uploadRes.json();

      const photoRes = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          caption: newPhotoCaption || null,
          mode: "dating",
        }),
      });
      const newPhoto = await photoRes.json();
      setPhotos([newPhoto, ...photos]);

      setShowAddPhotoModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setNewPhotoCaption("");
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setUploading(false);
    }
  };

  const closePhotoModal = () => {
    setShowAddPhotoModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setNewPhotoCaption("");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  // Multi-select functions
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedPhotos(new Set());
    setShowMoreMenu(false);
  };

  const togglePhotoSelection = (photoId: number) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const handlePhotoClick = (photo: Photo, index: number) => {
    if (isSelectMode) {
      togglePhotoSelection(photo.id);
    } else {
      setSelectedPhotoIndex(index);
    }
  };

  const movePhotosToAlbum = async (albumId: number) => {
    if (selectedPhotos.size === 0) return;

    try {
      const promises = Array.from(selectedPhotos).map((photoId) =>
        fetch("/api/photos", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: photoId, albumId }),
        }),
      );
      await Promise.all(promises);

      // Update local state
      setPhotos(
        photos.map((p) => (selectedPhotos.has(p.id) ? { ...p, albumId } : p)),
      );

      // Update album photo counts
      await fetchData();

      setShowAlbumSheet(false);
      setShowMoreMenu(false);
      setIsSelectMode(false);
      setSelectedPhotos(new Set());
    } catch (error) {
      console.error("Error moving photos:", error);
    }
  };

  const deleteSelectedPhotos = async () => {
    if (selectedPhotos.size === 0) return;

    if (!confirm(`${selectedPhotos.size}장의 사진을 삭제하시겠습니까?`)) return;

    try {
      const promises = Array.from(selectedPhotos).map((photoId) =>
        fetch("/api/photos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: photoId }),
        }),
      );
      await Promise.all(promises);

      setPhotos(photos.filter((p) => !selectedPhotos.has(p.id)));
      setIsSelectMode(false);
      setSelectedPhotos(new Set());
    } catch (error) {
      console.error("Error deleting photos:", error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between px-5 h-14 max-w-md mx-auto">
          {isSelectMode ? (
            <>
              <button
                onClick={toggleSelectMode}
                className="text-[15px] text-[#8B95A1]"
                data-testid="button-cancel-select"
              >
                취소
              </button>
              <h1 className="text-[17px] font-bold text-[#191F28]">
                {selectedPhotos.size > 0
                  ? `${selectedPhotos.size}장 선택됨`
                  : "항목 선택"}
              </h1>
              <button
                onClick={() => setShowMoreMenu(true)}
                className="p-2 -mr-2 rounded-full hover:bg-[#F2F4F6]"
                data-testid="button-more-menu"
                disabled={selectedPhotos.size === 0}
              >
                <MoreHorizontal
                  className={`w-6 h-6 ${selectedPhotos.size > 0 ? "text-[#191F28]" : "text-[#D1D6DB]"}`}
                />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/dating"
                className="p-2 -ml-2 rounded-full hover:bg-[#F2F4F6]"
                data-testid="button-back"
              >
                <ChevronLeft className="w-6 h-6 text-[#191F28]" />
              </Link>
              <h1 className="text-[17px] font-bold text-[#191F28]">갤러리</h1>
              <button
                onClick={toggleSelectMode}
                className="text-[15px] text-pink-500 font-medium"
                data-testid="button-select-mode"
              >
                선택
              </button>
            </>
          )}
        </div>
      </header>

      <div className="px-5 py-5 max-w-md mx-auto pb-36">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[17px] font-bold text-[#191F28]">앨범</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
            <button
              onClick={() => setShowAddAlbumModal(true)}
              className="flex-shrink-0 w-28 h-36 bg-[#F2F4F6] rounded-[16px] flex flex-col items-center justify-center gap-2 hover:bg-[#E5E8EB] transition-colors"
              data-testid="button-add-album"
            >
              <div className="w-10 h-10 rounded-full bg-[#D1D6DB] flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="text-[12px] text-[#8B95A1]">앨범 추가</span>
            </button>

            {isLoading ? (
              <div className="flex-shrink-0 w-28 h-36 bg-[#F2F4F6] rounded-[16px] animate-pulse" />
            ) : albums.length === 0 ? (
              <div className="flex-shrink-0 w-full py-4 text-center text-[#8B95A1] text-[13px]">
                앨범을 추가해보세요
              </div>
            ) : (
              albums.map((album) => (
                <Link
                  key={album.id}
                  href={`/dating/gallery/album/${album.id}`}
                  className="flex-shrink-0 w-28 rounded-[16px] overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  data-testid={`album-card-${album.id}`}
                >
                  <div className="relative h-24 bg-gradient-to-br from-pink-100 to-purple-100">
                    {album.thumbnail ? (
                      <img
                        src={album.thumbnail}
                        alt={album.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-pink-300" />
                      </div>
                    )}
                  </div>
                  <div className="bg-white p-2">
                    <p className="text-[13px] font-medium text-[#191F28] truncate">
                      {album.title}
                    </p>
                    <p className="text-[11px] text-[#8B95A1]">
                      {album.photoCount}장
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[17px] font-bold text-[#191F28]">모든 사진</h3>
            <span className="text-[13px] text-[#8B95A1]">
              {photos.length}장
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-3 gap-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-[#F2F4F6] rounded-[4px] animate-pulse"
                />
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-50 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-pink-300" />
              </div>
              <p className="text-[#8B95A1] text-[14px]">아직 사진이 없어요</p>
              <p className="text-[#B0B8C1] text-[12px] mt-1">
                사진을 추가해서 추억을 남겨보세요
              </p>
              <button
                onClick={() => setShowAddPhotoModal(true)}
                className="mt-4 px-6 py-3 bg-pink-500 text-white rounded-full text-[14px] font-medium flex items-center gap-2 mx-auto hover:bg-pink-600 transition-colors"
                data-testid="button-add-photo-empty"
              >
                <Upload className="w-4 h-4" />
                사진 추가하기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => handlePhotoClick(photo, index)}
                  className="relative aspect-square overflow-hidden rounded-[4px] group"
                  data-testid={`photo-item-${photo.id}`}
                >
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  {isSelectMode && (
                    <div
                      className={`absolute inset-0 ${selectedPhotos.has(photo.id) ? "bg-black/20" : ""}`}
                    >
                      <div
                        className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedPhotos.has(photo.id)
                            ? "bg-pink-500 border-pink-500"
                            : "bg-white/80 border-white"
                        }`}
                      >
                        {selectedPhotos.has(photo.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  )}
                  {!isSelectMode && photo.liked && (
                    <div className="absolute top-1 right-1">
                      <Heart className="w-4 h-4 text-pink-500" fill="#ec4899" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selection Mode Bottom Bar */}
      {isSelectMode && selectedPhotos.size > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-[#E5E8EB] z-40">
          <div className="flex justify-around items-center h-16 max-w-md mx-auto px-5">
            <button
              onClick={() => alert("공유 기능은 준비 중입니다")}
              className="flex flex-col items-center gap-1 text-[#B0B8C1]"
              data-testid="button-share-photos"
            >
              <Share2 className="w-6 h-6" />
              <span className="text-[10px]">공유</span>
            </button>
            <div className="flex-1 text-center">
              <span className="text-[14px] font-medium text-[#191F28]">
                {selectedPhotos.size}장의 사진이 선택됨
              </span>
            </div>
            <button
              onClick={deleteSelectedPhotos}
              className="flex flex-col items-center gap-1 text-red-500"
              data-testid="button-delete-photos"
            >
              <Trash2 className="w-6 h-6" />
              <span className="text-[10px]">삭제</span>
            </button>
          </div>
        </div>
      )}

      {/* FAB - Add Photo Button */}
      {!isSelectMode && photos.length > 0 && (
        <button
          onClick={() => setShowAddPhotoModal(true)}
          className="fixed bottom-24 right-5 w-14 h-14 bg-pink-500 hover:bg-pink-600 rounded-full shadow-lg flex items-center justify-center z-40 transition-colors"
          data-testid="button-add-photo-fab"
        >
          <Plus className="w-7 h-7 text-white" />
        </button>
      )}

      {/* Photo Viewer */}
      {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20"
            data-testid="button-close-viewer"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {selectedPhotoIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20"
              data-testid="button-prev-photo"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          {selectedPhotoIndex < photos.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20"
              data-testid="button-next-photo"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}

          <img
            src={photos[selectedPhotoIndex].url}
            alt=""
            className="max-w-full max-h-full object-contain"
          />

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <span className="text-white text-[13px]">
                {formatDate(photos[selectedPhotoIndex].createdAt)}
              </span>
              <button
                onClick={() => toggleLike(photos[selectedPhotoIndex].id)}
                className="p-2 rounded-full hover:bg-white/10"
                data-testid="button-toggle-like"
              >
                <Heart
                  className={`w-6 h-6 ${photos[selectedPhotoIndex].liked ? "text-pink-500" : "text-white"}`}
                  fill={photos[selectedPhotoIndex].liked ? "#ec4899" : "none"}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* More Menu Modal */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
          onClick={() => setShowMoreMenu(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-t-[24px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[#D1D6DB] rounded-full mx-auto mt-3" />
            <div className="py-4">
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  setShowAlbumSheet(true);
                }}
                className="w-full px-5 py-4 flex items-center gap-4 hover:bg-[#F2F4F6] transition-colors"
                data-testid="button-add-to-album"
              >
                <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
                  <FolderPlus className="w-5 h-5 text-pink-500" />
                </div>
                <span className="text-[15px] text-[#191F28]">앨범에 추가</span>
              </button>
              <button
                onClick={() => alert("공유 기능은 준비 중입니다")}
                className="w-full px-5 py-4 flex items-center gap-4 hover:bg-[#F2F4F6] transition-colors"
                data-testid="button-share-menu"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-[#B0B8C1]" />
                </div>
                <span className="text-[15px] text-[#B0B8C1]">
                  공유하기 (준비중)
                </span>
              </button>
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  deleteSelectedPhotos();
                }}
                className="w-full px-5 py-4 flex items-center gap-4 hover:bg-[#F2F4F6] transition-colors"
                data-testid="button-delete-menu"
              >
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <span className="text-[15px] text-red-500">삭제하기</span>
              </button>
            </div>
            <button
              onClick={() => setShowMoreMenu(false)}
              className="w-full py-4 text-[15px] text-[#8B95A1] border-t border-[#E5E8EB]"
              data-testid="button-close-more-menu"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* Album Selection Bottom Sheet */}
      {showAlbumSheet && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 flex items-end justify-center"
          onClick={() => setShowAlbumSheet(false)}
        >
          <div
            className="bg-[#1C1C1E] w-full max-w-md rounded-t-[24px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#38383A]">
              <button
                onClick={() => setShowAlbumSheet(false)}
                className="w-8 h-8 flex items-center justify-center"
                data-testid="button-close-album-sheet"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <span className="text-[17px] font-bold text-white">
                앨범에 추가
              </span>
              <button
                onClick={() => {
                  setShowAlbumSheet(false);
                  setShowAddAlbumModal(true);
                }}
                className="w-8 h-8 flex items-center justify-center"
                data-testid="button-create-album-sheet"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {albums.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-[#8B8B8D] text-[14px]">앨범이 없습니다</p>
                  <button
                    onClick={() => {
                      setShowAlbumSheet(false);
                      setShowAddAlbumModal(true);
                    }}
                    className="mt-4 px-6 py-3 bg-pink-500 text-white rounded-full text-[14px] font-medium"
                    data-testid="button-create-first-album"
                  >
                    첫 앨범 만들기
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {albums.map((album) => (
                    <button
                      key={album.id}
                      onClick={() => movePhotosToAlbum(album.id)}
                      className="flex flex-col items-start"
                      data-testid={`album-select-${album.id}`}
                    >
                      <div className="w-full aspect-square rounded-[12px] bg-[#38383A] overflow-hidden mb-2">
                        {album.thumbnail ? (
                          <img
                            src={album.thumbnail}
                            alt={album.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-[#8B8B8D]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[13px] text-white truncate w-full">
                        {album.title}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Album Modal */}
      {showAddAlbumModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-5"
          onClick={() => setShowAddAlbumModal(false)}
        >
          <div
            className="bg-white rounded-[24px] w-full max-w-sm p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[17px] font-bold text-[#191F28] mb-4">
              새 앨범 만들기
            </h3>
            <input
              type="text"
              value={newAlbumTitle}
              onChange={(e) => setNewAlbumTitle(e.target.value)}
              placeholder="앨범 이름"
              className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-300 mb-4"
              data-testid="input-album-title"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddAlbumModal(false)}
                className="flex-1 py-3 bg-[#F2F4F6] text-[#4E5968] font-medium rounded-[12px]"
                data-testid="button-cancel-album"
              >
                취소
              </button>
              <button
                onClick={createAlbum}
                disabled={!newAlbumTitle.trim()}
                className="flex-1 py-3 bg-pink-500 disabled:bg-[#E5E8EB] text-white font-medium rounded-[12px]"
                data-testid="button-create-album"
              >
                만들기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showAddPhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-5"
          onClick={closePhotoModal}
        >
          <div
            className="bg-white rounded-[24px] w-full max-w-sm p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[17px] font-bold text-[#191F28] mb-4">
              사진 추가하기
            </h3>

            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-48 bg-[#F2F4F6] rounded-[16px] cursor-pointer hover:bg-[#E5E8EB] transition-colors mb-4">
                <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mb-3">
                  <Upload className="w-7 h-7 text-pink-500" />
                </div>
                <p className="text-[14px] text-[#4E5968] font-medium">
                  사진 선택하기
                </p>
                <p className="text-[12px] text-[#8B95A1] mt-1">
                  탭하여 갤러리에서 선택
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                  data-testid="input-photo-file"
                />
              </label>
            ) : (
              <div className="relative mb-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-[16px]"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center"
                  data-testid="button-remove-preview"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}

            <input
              type="text"
              value={newPhotoCaption}
              onChange={(e) => setNewPhotoCaption(e.target.value)}
              placeholder="사진 설명 (선택사항)"
              className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-300 mb-4"
              data-testid="input-photo-caption"
            />

            <div className="flex gap-3">
              <button
                onClick={closePhotoModal}
                className="flex-1 py-3 bg-[#F2F4F6] text-[#4E5968] font-medium rounded-[12px]"
                data-testid="button-cancel-photo-upload"
              >
                취소
              </button>
              <button
                onClick={uploadPhoto}
                disabled={!selectedFile || uploading}
                className="flex-1 py-3 bg-pink-500 disabled:bg-[#E5E8EB] text-white font-medium rounded-[12px] flex items-center justify-center gap-2"
                data-testid="button-confirm-photo-upload"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    업로드 중...
                  </>
                ) : (
                  "업로드"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-20" />
    </>
  );
}
