import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Trip, Photo, Video, MediaItem } from '../types';
import Lightbox from './Lightbox';
import Modal from './Modal';
import { CameraIcon, VideoIcon, ArrowLeftIcon, PlusIcon, EditIcon, CheckIcon, TrashIcon } from './icons';
import { toBase64 } from '../utils/fileUtils';

interface TripPageProps {
  trips: Trip[];
  onUpdateTrip: (updatedTrip: Trip) => void;
}

const TripPage: React.FC<TripPageProps> = ({ trips, onUpdateTrip }) => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [lightboxState, setLightboxState] = useState<{isOpen: boolean, currentIndex: number}>({isOpen: false, currentIndex: 0});
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrip, setEditedTrip] = useState<Trip | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);
  const [newMedia, setNewMedia] = useState<{type: 'photo' | 'video', url: string, caption: string, file?: File}>({type: 'photo', url: '', caption: ''});


  useEffect(() => {
    const currentTrip = trips.find(t => t.id === tripId);
    if (currentTrip) {
      setTrip(currentTrip);
      setEditedTrip(currentTrip);
    } else if (trips.length > 0) {
      navigate('/');
    }
  }, [tripId, trips, navigate]);
  
  if (!trip || !editedTrip) {
    return <div className="text-center p-8">Loading trip...</div>;
  }
  
  const handleEditChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
     if (e.target.type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const base64 = await toBase64(file);
        setEditedTrip(prev => prev ? { ...prev, coverImage: base64 } : null);
      }
    } else {
        setEditedTrip(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const saveChanges = () => {
    if (editedTrip) {
      onUpdateTrip(editedTrip);
      setIsEditing(false);
    }
  };
  
  const handleAddMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(newMedia.type === 'photo' && newMedia.file) {
        const src = await toBase64(newMedia.file);
        const newPhoto: Photo = { id: Date.now().toString(), src, caption: newMedia.caption };
        onUpdateTrip({ ...trip, photos: [...trip.photos, newPhoto]});
    } else if (newMedia.type === 'video' && newMedia.url) {
        // Basic validation for youtube url and convert to embeddable format
        const embedUrl = newMedia.url.replace("watch?v=", "embed/");
        const newVideo: Video = { id: Date.now().toString(), url: embedUrl, caption: newMedia.caption };
        onUpdateTrip({ ...trip, videos: [...trip.videos, newVideo]});
    }
    setIsAddMediaModalOpen(false);
    setNewMedia({type: 'photo', url: '', caption: ''});
  };

  const deleteMedia = (id: string) => {
    const updatedPhotos = trip.photos.filter(p => p.id !== id);
    const updatedVideos = trip.videos.filter(v => v.id !== id);
    onUpdateTrip({...trip, photos: updatedPhotos, videos: updatedVideos});
  };

  const openLightbox = (index: number) => setLightboxState({ isOpen: true, currentIndex: index });
  const closeLightbox = () => setLightboxState({ isOpen: false, currentIndex: 0 });
  
  const allMedia: MediaItem[] = [...trip.photos, ...trip.videos];
  
  const lightboxNext = () => setLightboxState(prev => ({ ...prev, currentIndex: (prev.currentIndex + 1) % allMedia.length }));
  const lightboxPrev = () => setLightboxState(prev => ({ ...prev, currentIndex: (prev.currentIndex - 1 + allMedia.length) % allMedia.length }));
  const currentMedia = allMedia[lightboxState.currentIndex];

  return (
    <div className="pb-12">
       <div 
        className="relative h-[50vh] flex items-center justify-center text-white text-center bg-cover bg-center group"
        style={{ backgroundImage: `url('${editedTrip.coverImage}')` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 p-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
           {isEditing ? (
              <input type="text" name="country" value={editedTrip.country} onChange={handleEditChange} className="text-4xl md:text-6xl font-extrabold mb-2 bg-transparent border-b-2 border-white/50 text-center focus:outline-none focus:border-white"/>
           ) : (
            <h1 className="text-4xl md:text-6xl font-extrabold mb-2">{trip.country}</h1>
           )}
           {isEditing ? (
             <textarea name="quote" value={editedTrip.quote} onChange={handleEditChange} rows={2} className="text-lg md:text-xl font-sans italic bg-transparent border-2 border-white/50 rounded-md text-center w-full mt-2 focus:outline-none focus:border-white p-2"/>
           ) : (
             <p className="text-lg md:text-xl font-sans italic">"{trip.quote}"</p>
           )}
           {isEditing && (
              <button onClick={() => coverFileInputRef.current?.click()} className="mt-4 bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-full text-sm">
                  Change Cover
              </button>
           )}
            <input type="file" ref={coverFileInputRef} onChange={handleEditChange} className="hidden" accept="image/*"/>
        </div>
        <div className="absolute top-4 right-4 z-20">
            {isEditing ? (
                <button onClick={saveChanges} className="bg-sky-600/80 hover:bg-sky-500 text-white p-2 rounded-full shadow-lg">
                    <CheckIcon className="w-6 h-6" />
                </button>
            ) : (
                <button onClick={() => setIsEditing(true)} className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <EditIcon className="w-6 h-6" />
                </button>
            )}
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto p-4 md:p-8">
         <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 text-sky-700 hover:text-sky-900 font-bold transition-colors">
                <ArrowLeftIcon className="w-5 h-5"/>
                Back to Travel Logs
            </Link>
        </div>
        
        <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold flex items-center gap-3"><CameraIcon className="w-8 h-8"/>Memories</h2>
                <button onClick={() => setIsAddMediaModalOpen(true)} className="flex items-center gap-2 bg-amber-500 text-white font-bold py-2 px-4 rounded-full hover:bg-amber-600 transition-transform transform hover:scale-105 shadow">
                    <PlusIcon className="w-5 h-5"/> Add Photo/Video
                </button>
            </div>
            {(allMedia.length > 0) ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {allMedia.map((item, index) => (
                        <div key={item.id} className="relative group">
                             <div className="cursor-pointer" onClick={() => openLightbox(index)}>
                                {'src' in item ? (
                                    <img src={item.src} alt={item.caption} className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"/>
                                ) : (
                                    <div className="w-full h-48 bg-black rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center">
                                        <VideoIcon className="w-16 h-16 text-white/50"/>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <p className="text-white text-center p-2 text-sm font-bold" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>{item.caption}</p>
                                </div>
                             </div>
                             <button onClick={() => deleteMedia(item.id)} className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 hover:scale-110">
                                <TrashIcon className="w-4 h-4"/>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-slate-500 font-sans text-center py-8 bg-slate-100 rounded-lg">No photos or videos added yet. Click 'Add Photo/Video' to start building your gallery.</p>
            )}
        </div>
      </div>
      
      {currentMedia && (
         <Lightbox isOpen={lightboxState.isOpen} onClose={closeLightbox} item={currentMedia} onNext={lightboxNext} onPrev={lightboxPrev} hasNext={allMedia.length > 1} hasPrev={allMedia.length > 1} />
      )}
      
      <Modal isOpen={isAddMediaModalOpen} onClose={() => setIsAddMediaModalOpen(false)} title="Add a New Memory">
        <form onSubmit={handleAddMediaSubmit}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Type</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <button type="button" onClick={() => setNewMedia({...newMedia, type:'photo'})} className={`px-4 py-2 border rounded-l-md w-full ${newMedia.type === 'photo' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white'}`}>Photo</button>
                        <button type="button" onClick={() => setNewMedia({...newMedia, type:'video'})} className={`px-4 py-2 border rounded-r-md w-full ${newMedia.type === 'video' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white'}`}>Video</button>
                    </div>
                </div>
                {newMedia.type === 'photo' ? (
                    <div>
                         <label htmlFor="photoFile" className="block text-sm font-medium text-slate-700">Photo File</label>
                         <input type="file" id="photoFile" onChange={e => setNewMedia({...newMedia, file: e.target.files?.[0]})} required accept="image/*" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"/>
                    </div>
                ) : (
                     <div>
                        <label htmlFor="videoUrl" className="block text-sm font-medium text-slate-700">YouTube URL</label>
                        <input type="text" id="videoUrl" value={newMedia.url} onChange={e => setNewMedia({...newMedia, url: e.target.value})} required placeholder="https://www.youtube.com/watch?v=..." className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
                    </div>
                )}
                 <div>
                    <label htmlFor="caption" className="block text-sm font-medium text-slate-700">Caption</label>
                    <input type="text" id="caption" value={newMedia.caption} onChange={e => setNewMedia({...newMedia, caption: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
                </div>
            </div>
             <div className="mt-6 flex justify-end">
                <button type="submit" className="bg-sky-700 text-white font-bold py-2 px-6 rounded-full hover:bg-sky-800 transition-colors">Add Memory</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default TripPage;