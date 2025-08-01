
// src/pages/MyTripsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { getMyTrips, deleteTrip } from '../services/tripService';
import { Link } from 'react-router-dom';
import Button from '../components/common/button';

const MyTripsPage = () => {
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTrips = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getMyTrips();
            setTrips(response.data || []);
        } catch (err) {
            setError('Geziler yüklenirken bir hata oluştu.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    const handleDelete = async (tripId) => {
        if (window.confirm('Bu geziyi silmek istediğinizden emin misiniz?')) {
            try {
                await deleteTrip(tripId);
                // Geziyi state'ten kaldırarak UI'ı anında güncelle
                setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
            } catch (err) {
                alert('Gezi silinirken bir hata oluştu.');
            }
        }
    };

    if (isLoading) return <div style={styles.centered}>Geziler Yükleniyor...</div>;
    if (error) return <div style={styles.centered}>{error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gezilerim</h1>
            {trips.length === 0 ? (
                <div style={styles.centered}>
                    <p>Henüz planlanmış bir geziniz yok.</p>
                    <Link to="/dashboard">
                        <Button>Hemen Bir Gezi Planla</Button>
                    </Link>
                </div>
            ) : (
                <div style={styles.tripList}>
                    {trips.map(trip => (
                        <div key={trip.id} style={styles.tripCard}>
                            <h3>{trip.destination}</h3>
                            <p>Tarihler: {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                            <Button variant="secondary" onClick={() => handleDelete(trip.id)}>Sil</Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' },
    title: { textAlign: 'center', marginBottom: '2rem', fontFamily: "'Nunito', sans-serif" },
    centered: { textAlign: 'center', marginTop: '4rem' },
    tripList: { display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' },
    tripCard: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
};

export default MyTripsPage;