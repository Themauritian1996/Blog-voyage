import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trip, CONTINENTS, HomePageContent } from '../types';
import { PlusIcon, EditIcon, CheckIcon } from './icons';
import Modal from './Modal';
import { toBase64 } from '../utils/fileUtils';

interface HomePageProps {
  trips: Trip[];
  homeContent: HomePageContent;
  onAddTrip: (newTrip: Omit<Trip, 'id' | 'photos' | 'videos'>) => void;
  onUpdateHomeContent: (newContent: HomePageContent) => void;
}

const HomePage: React.FC<HomePageProps> = ({ trips, homeContent, onAddTrip, onUpdateHomeContent }) => {
  const [isAddTripModalOpen, setIsAddTripModalOpen] = useState(false);
  const [newTripData, setNewTripData] = useState({ country: '', continent: '', countryCode: '', quote: '', coverImage: '' });

  const [isEditingHero, setIsEditingHero] = useState(false);
  const [editedHomeContent, setEditedHomeContent] = useState(homeContent);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tripsByContinent = trips.reduce((acc, trip) => {
    (acc[trip.continent] = acc[trip.continent] || []).push(trip);
    return acc;
  }, {} as Record<string, Trip[]>);

  const handleAddTripSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTripData.country && newTripData.continent) {
        let coverImageBase64 = '';
        const fileInput = (e.target as HTMLFormElement).coverImage.files[0];
        if (fileInput) {
            coverImageBase64 = await toBase64(fileInput);
        }
        onAddTrip({ ...newTripData, coverImage: coverImageBase64 });
        setIsAddTripModalOpen(false);
        setNewTripData({ country: '', continent: '', countryCode: '', quote: '', coverImage: '' });
    }
  };

  const handleHeroEdit = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target.type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const base64 = await toBase64(file);
        setEditedHomeContent(prev => ({ ...prev, backgroundImage: base64 }));
      }
    } else {
      setEditedHomeContent(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const saveHeroChanges = () => {
    onUpdateHomeContent(editedHomeContent);
    setIsEditingHero(false);
  };
  
  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative h-[60vh] flex items-center justify-center text-white text-center bg-cover bg-center group"
        style={{ backgroundImage: `url('${editedHomeContent.backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 p-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
          {isEditingHero ? (
              <input 
                type="text"
                name="title"
                value={editedHomeContent.title}
                onChange={handleHeroEdit}
                className="text-4xl md:text-6xl font-extrabold mb-2 bg-transparent border-b-2 border-white/50 text-center focus:outline-none focus:border-white"
              />
          ) : (
            <h1 className="text-4xl md:text-6xl font-extrabold mb-2">
              {homeContent.title}
            </h1>
          )}
          {isEditingHero ? (
               <input
                 type="text"
                 name="subtitle"
                 value={editedHomeContent.subtitle}
                 onChange={handleHeroEdit}
                 className="text-lg md:text-xl font-sans bg-transparent border-b-2 border-white/50 text-center w-full mt-2 focus:outline-none focus:border-white"
               />
          ) : (
            <p className="text-lg md:text-xl font-sans">
              {homeContent.subtitle}
            </p>
          )}
          {isEditingHero && (
            <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-full text-sm">
                Change Background
            </button>
          )}
           <input type="file" ref={fileInputRef} onChange={handleHeroEdit} className="hidden" accept="image/*"/>
        </div>
        <div className="absolute top-4 right-4 z-20">
            {isEditingHero ? (
                 <button onClick={saveHeroChanges} className="bg-sky-600/80 hover:bg-sky-500 text-white p-2 rounded-full shadow-lg">
                    <CheckIcon className="w-6 h-6" />
                </button>
            ) : (
                 <button onClick={() => setIsEditingHero(true)} className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <EditIcon className="w-6 h-6" />
                </button>
            )}
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Travel Logs</h2>
            <button
                onClick={() => setIsAddTripModalOpen(true)}
                className="flex items-center gap-2 bg-sky-700 text-white font-bold py-2 px-4 rounded-full hover:bg-sky-800 transition-transform transform hover:scale-105 shadow-md">
                <PlusIcon className="w-5 h-5"/>
                Add a New Trip
            </button>
        </div>

        {CONTINENTS.map(continent =>
            tripsByContinent[continent] ? (
            <div key={continent} className="mb-12">
                <h3 className="text-2xl font-bold border-b-2 border-amber-400 pb-2 mb-6">{continent}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {tripsByContinent[continent].map(trip => (
                    <Link to={`/trip/${trip.id}`} key={trip.id} className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-transparent hover:border-amber-400">
                    <div className="relative">
                        <img src={trip.coverImage} alt={trip.country} className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all"></div>
                    </div>
                    <div className="p-4">
                        <h4 className="text-xl font-bold text-slate-800">{trip.country}</h4>
                    </div>
                    </Link>
                ))}
                </div>
            </div>
            ) : null
        )}
        </div>
        
        {/* Add Trip Modal */}
        <Modal isOpen={isAddTripModalOpen} onClose={() => setIsAddTripModalOpen(false)} title="Add a New Trip">
            <form onSubmit={handleAddTripSubmit}>
                <div className="space-y-4">
                     <div>
                        <label htmlFor="country" className="block text-sm font-medium text-slate-700">Country</label>
                        <input type="text" id="country" value={newTripData.country} onChange={e => setNewTripData({...newTripData, country: e.target.value})} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
                    </div>
                    <div>
                        <label htmlFor="continent" className="block text-sm font-medium text-slate-700">Continent</label>
                        <select id="continent" value={newTripData.continent} onChange={e => setNewTripData({...newTripData, continent: e.target.value})} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500">
                           <option value="">Select a continent</option>
                           {CONTINENTS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="countryCode" className="block text-sm font-medium text-slate-700">Country Code (2 letters, e.g., JP)</label>
                        <input type="text" id="countryCode" value={newTripData.countryCode} onChange={e => setNewTripData({...newTripData, countryCode: e.target.value.toUpperCase()})} maxLength={2} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
                    </div>
                     <div>
                        <label htmlFor="quote" className="block text-sm font-medium text-slate-700">Quote</label>
                        <textarea id="quote" value={newTripData.quote} onChange={e => setNewTripData({...newTripData, quote: e.target.value})} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"></textarea>
                    </div>
                    <div>
                        <label htmlFor="coverImage" className="block text-sm font-medium text-slate-700">Cover Image</label>
                        <input type="file" id="coverImage" name="coverImage" accept="image/*" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"/>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button type="submit" className="bg-sky-700 text-white font-bold py-2 px-6 rounded-full hover:bg-sky-800 transition-colors">Add Trip</button>
                </div>
            </form>
        </Modal>
    </div>
    );
};

export default HomePage;