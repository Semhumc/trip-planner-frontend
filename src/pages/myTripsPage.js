import React, { useState, useEffect, useCallback } from 'react';
import { getMyTrips, deleteTrip } from '../services/tripService';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import Button from '../components/common/button';

const MyTripsPage = () => {
    const { userProfile } = useAuth();
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTrips = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // userProfile'dan user_id'yi al
            const userId = userProfile?.id || userProfile?.username;
            if (!userId) {
                setError('Kullanıcı bilgileri bulunamadı.');
                return;
            }

            const response = await getMyTrips(userId);
            setTrips(response.data?.trips || []);
        } catch (err) {
            setError('Geziler yüklenirken bir hata oluştu.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [userProfile]);

    useEffect(() => {
        if (userProfile) {
            fetchTrips();
        }
    }, [fetchTrips, userProfile]);

    const handleDelete = async (tripId) => {
        if (window.confirm('Bu geziyi silmek istediğinizden emin misiniz?')) {
            try {
                await deleteTrip(tripId);
                // Geziyi state'ten kaldırarak UI'ı anında güncelle
                setTrips(prevTrips => prevTrips.filter(trip => trip.trip.id !== tripId));
            } catch (err) {
                alert('Gezi silinirken bir hata oluştu.');
                console.error(err);
            }
        }
    };

    const handleViewDetails = (trip) => {
        // Trip detaylarını göstermek için modal açabilir veya ayrı sayfaya yönlendirebilirsiniz
        console.log('Trip details:', trip);
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
                    {trips.map(tripData => (
                        <div key={tripData.trip.id} style={styles.tripCard}>
                            <div style={styles.tripHeader}>
                                <h3 style={styles.tripName}>{tripData.trip.name}</h3>
                                <span style={styles.tripDate}>
                                    {new Date(tripData.trip.start_date).toLocaleDateString()} - 
                                    {new Date(tripData.trip.end_date).toLocaleDateString()}
                                </span>
                            </div>
                            
                            {tripData.trip.description && (
                                <p style={styles.tripDescription}>{tripData.trip.description}</p>
                            )}
                            
                            <div style={styles.tripRoute}>
                                <span><strong>Başlangıç:</strong> {tripData.trip.start_position || 'Belirtilmemiş'}</span>
                                <span><strong>Bitiş:</strong> {tripData.trip.end_position || 'Belirtilmemiş'}</span>
                            </div>

                            {tripData.locations && tripData.locations.length > 0 && (
                                <div style={styles.locationsSection}>
                                    <h4>Konumlar ({tripData.locations.length})</h4>
                                    <div style={styles.locationsList}>
                                        {tripData.locations.slice(0, 3).map((location, index) => (
                                            <span key={location.id} style={styles.locationItem}>
                                                {location.name}
                                                {index < Math.min(tripData.locations.length, 3) - 1 && ', '}
                                            </span>
                                        ))}
                                        {tripData.locations.length > 3 && (
                                            <span style={styles.moreLocations}>
                                                ve {tripData.locations.length - 3} tane daha...
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div style={styles.tripActions}>
                                <Button 
                                    variant="secondary" 
                                    onClick={() => handleViewDetails(tripData)}
                                >
                                    Detayları Gör
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    onClick={() => handleDelete(tripData.trip.id)}
                                    style={styles.deleteButton}
                                >
                                    Sil
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { 
        maxWidth: '1000px', 
        margin: '2rem auto', 
        padding: '0 1rem' 
    },
    title: { 
        textAlign: 'center', 
        marginBottom: '2rem', 
        fontFamily: "'Nunito', sans-serif" 
    },
    centered: { 
        textAlign: 'center', 
        marginTop: '4rem' 
    },
    tripList: { 
        display: 'grid', 
        gap: '1.5rem', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' 
    },
    tripCard: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    tripHeader: {
        marginBottom: '1rem',
    },
    tripName: {
        margin: '0 0 0.5rem 0',
        color: '#3a3a3a',
        fontSize: '1.25rem',
    },
    tripDate: {
        color: '#6c757d',
        fontSize: '0.9rem',
        fontWeight: '500',
    },
    tripDescription: {
        color: '#555',
        margin: '0.5rem 0 1rem 0',
        fontSize: '0.95rem',
        lineHeight: '1.4',
    },
    tripRoute: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        marginBottom: '1rem',
        fontSize: '0.9rem',
        color: '#666',
    },
    locationsSection: {
        marginBottom: '1rem',
    },
    locationsList: {
        fontSize: '0.9rem',
        color: '#555',
    },
    locationItem: {
        color: '#5c8d89',
        fontWeight: '500',
    },
    moreLocations: {
        color: '#888',
        fontStyle: 'italic',
    },
    tripActions: {
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'flex-end',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #f0f0f0',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: 'white',
    }
};

export default MyTripsPage;