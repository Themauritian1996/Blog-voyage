import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import TripPage from './components/TripPage';
import { Trip, HomePageContent } from './types';
import Header from './components/Header';
import { INITIAL_TRIPS, INITIAL_HOME_CONTENT } from './constants';

const App: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    const savedTrips = localStorage.getItem('wanderlust_trips');
    return savedTrips ? JSON.parse(savedTrips) : INITIAL_TRIPS;
  });

  const [homeContent, setHomeContent] = useState<HomePageContent>(() => {
    const savedHomeContent = localStorage.getItem('wanderlust_home_content');
    return savedHomeContent ? JSON.parse(savedHomeContent) : INITIAL_HOME_CONTENT;
  });

  useEffect(() => {
    localStorage.setItem('wanderlust_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('wanderlust_home_content', JSON.stringify(homeContent));
  }, [homeContent]);

  const handleAddTrip = (newTrip: Omit<Trip, 'id' | 'photos' | 'videos'>) => {
    const tripWithId: Trip = {
      ...newTrip,
      id: newTrip.country.toLowerCase().replace(/\s+/g, '-'),
      photos: [],
      videos: [],
    };
    setTrips(prev => [...prev, tripWithId]);
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(prev => prev.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip));
  };
  
  const handleUpdateHomeContent = (newContent: HomePageContent) => {
    setHomeContent(newContent);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-serif">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={
            <HomePage 
              trips={trips} 
              homeContent={homeContent}
              onAddTrip={handleAddTrip}
              onUpdateHomeContent={handleUpdateHomeContent}
            />} 
          />
          <Route path="/trip/:tripId" element={
            <TripPage 
              trips={trips} 
              onUpdateTrip={handleUpdateTrip}
            />} 
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;