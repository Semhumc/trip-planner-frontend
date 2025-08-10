// src/components/trip/TripPlannerForm.js - 3 TEMA KARTI LAYOUT
import React, { useState } from 'react';
import { generateTripPlan, saveTrip } from '../../services/tripService';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/button';
import Input from '../common/input';

const TURKISH_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
  'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
  'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
  'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Isparta', 'Mersin',
  'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli',
  'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
  'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak',
  'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan',
  'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

const Select = ({ id, label, name, value, onChange, disabled, options }) => (
  <div style={styles.inputGroup}>
    <label htmlFor={id} style={styles.label}>{label}</label>
    <select id={id} name={name} value={value} onChange={onChange} disabled={disabled} style={styles.select} required>
      <option value="" disabled>Lütfen bir şehir seçin...</option>
      {options.map(option => (<option key={option} value={option}>{option}</option>))}
    </select>
  </div>
);

const DetailRow = ({ label, children }) => (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={styles.detailValue}>{children}</span>
    </div>
);

const ThemeCard = ({ themeData, isSelected, onSelect, onSave, isSaving }) => {
  const [showAllDays, setShowAllDays] = useState(false);
  
  if (!themeData || !themeData.trip) return null;

  const formatDate = (dateString, dayOffset = 0) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + dayOffset);
    return date.toLocaleDateString('tr-TR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getLocationAddress = (location) => {
    if (location.address) return location.address;
    if (location.coordinates) {
      return `${location.coordinates.lat.toFixed(4)}, ${location.coordinates.lng.toFixed(4)}`;
    }
    return 'Adres bilgisi mevcut değil';
  };
  
  // YENİ: Web sitesini almak için birleştirilmiş fonksiyon
  const getLocationWebsite = (location) => {
    if (location.website) return location.website;
    if (location.web_site) return location.web_site;
    return null;
  };

  const displayedDays = showAllDays ? themeData.daily_plan : themeData.daily_plan?.slice(0, 3);

  return (
    <div style={{
      ...styles.themeCard,
      borderColor: isSelected ? '#5c8d89' : '#e9ecef',
      backgroundColor: isSelected ? '#f8fffe' : '#fff'
    }}>
      <div style={styles.themeHeader}>
        <h3 style={styles.themeTitle}>{themeData.theme}</h3>
        <p style={styles.themeDescription}>{themeData.description}</p>
      </div>

      <div style={styles.themePlanDetails}>
        <div style={styles.tripInfo}>
          <DetailRow label="Plan:">{themeData.trip.name}</DetailRow>
          <DetailRow label="Süre:">{themeData.trip.total_days} gün</DetailRow>
          <DetailRow label="Rota:">{themeData.trip.start_position} → {themeData.trip.end_position}</DetailRow>
        </div>

        <div style={styles.detailedDailyPlans}>
          <div style={styles.dailyPlansHeader}>
            <h4 style={styles.dailyPlansTitle}>
              📅 Günlük Detaylı Plan ({themeData.daily_plan?.length || 0} gün)
            </h4>
            {themeData.daily_plan?.length > 3 && (
              <button
                style={styles.toggleButton}
                onClick={() => setShowAllDays(!showAllDays)}
              >
                {showAllDays ? 'Daha Az Göster' : 'Tümünü Göster'}
              </button>
            )}
          </div>

          <div style={styles.daysContainer}>
            {displayedDays?.map((day, index) => {
              const dayNum = day.day || index + 1;
              const dayDate = formatDate(themeData.trip.start_date, index);
              const campsite = day.name?.split(' - ')[0] || day.name || 'Kamp Alanı';
              
              return (
                <div key={index} style={styles.detailedDayCard}>
                  <div style={styles.dayCardHeader}>
                    <div style={styles.dayNumberBadge}>Gün {dayNum}</div>
                    <div style={styles.dayDateInfo}>{dayDate}</div>
                  </div>

                  <div style={styles.dayLocationSection}>
                    <div style={styles.locationInfoGrid}>
                      {/* GÜNCELLENDİ: Emoji eklendi */}
                      <div style={styles.locationInfoRow}>
                        <span style={styles.locationLabel}>🏕️ Kamp Alanı:</span>
                        <span style={styles.locationValue}>{campsite}</span>
                      </div>
                      <div style={styles.locationInfoRow}>
                        <span style={styles.locationLabel}>📍 Adres:</span>
                        <span style={styles.locationValue}>{getLocationAddress(day)}</span>
                      </div>
                      {/* YENİ: Web sitesi bölümü eklendi */}
                      {getLocationWebsite(day) && (
                        <div style={styles.locationInfoRow}>
                          <span style={styles.locationLabel}>🌐 Web Sitesi:</span>
                          <a 
                            href={getLocationWebsite(day)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={styles.websiteLink}
                          >
                            {getLocationWebsite(day).replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {day.activities && day.activities.length > 0 && (
                    <div style={styles.activitiesSection}>
                      {/* GÜNCELLENDİ: Emoji ve stil */}
                      <div style={styles.activitiesTitle}>🎯 Aktiviteler:</div>
                      <div style={styles.activitiesList}>
                        {day.activities.slice(0, 3).map((activity, actIndex) => (
                          <div key={actIndex} style={styles.activityItem}>
                            • {activity}
                          </div>
                        ))}
                        {day.activities.length > 3 && (
                          <div style={styles.moreActivities}>
                            +{day.activities.length - 3} aktivite daha...
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {day.notes && (
                    <div style={styles.notesSection}>
                      {/* GÜNCELLENDİ: Emoji ve stil */}
                      <div style={styles.notesTitle}>📝 Notlar:</div>
                      <div style={styles.notesContent}>
                        {day.notes.length > 100 ? `${day.notes.substring(0, 100)}...` : day.notes}
                      </div>
                    </div>
                  )}

                  {day.coordinates && (
                    <div style={styles.coordinatesSection}>
                      <button
                        style={styles.mapButton}
                        onClick={() => {
                          const { lat, lng } = day.coordinates;
                          window.open(`https.www.google.com/maps?q=${lat},${lng}`, '_blank');
                        }}
                      >
                        🗺️ Haritada Göster
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!showAllDays && themeData.daily_plan?.length > 3 && (
            <div style={styles.hiddenDaysInfo}>
              ... ve {themeData.daily_plan.length - 3} gün daha
            </div>
          )}
        </div>
      </div>

      <div style={styles.cardActions}>
        <Button 
          variant="secondary" 
          onClick={() => onSelect(themeData)}
          style={isSelected ? styles.selectedButton : {}}
        >
          {isSelected ? '✓ Seçildi' : 'Bu Temayı Seç'}
        </Button>
        {isSelected && (
          <Button 
            variant="primary" 
            onClick={() => handleSaveTheme(themeData)}
            disabled={isSaving}
          >
            {isSaving ? 'Kaydediliyor...' : 'Planı Kaydet'}
          </Button>
        )}
      </div>
    </div>
  );
};

const TripPlannerForm = ({ onTripCreated }) => {
  const { userProfile } = useAuth();

  const getFormattedToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startPosition: '',
    endPosition: '',
    startDate: getFormattedToday(),
    endDate: getFormattedToday(),
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [tripOptions, setTripOptions] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setSuccessMessage('');
    setTripOptions([]);
    setSelectedTheme(null);
    
    try {
      const promptData = {
        userId: userProfile?.id || userProfile?.username,
        ...formData
      };
      
      const response = await generateTripPlan(promptData);
      
      if (response.data.trip_options && Array.isArray(response.data.trip_options)) {
        setTripOptions(response.data.trip_options);
      } else {
        setTripOptions([{
          theme: "Genel Kamp Rotası",
          description: "Oluşturulan kamp rotası",
          trip: response.data.trip,
          daily_plan: response.data.daily_plan
        }]);
      }
      
    } catch (err) {
      setError(err.response?.data?.error || 'Plan oluşturulurken bir hata oluştu.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleThemeSelect = (themeData) => {
    setSelectedTheme(themeData);
    setError(null);
  };

  const handleSaveTheme = async (themeData) => {
    if (!themeData || !themeData.trip) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      const tripWithLocations = {
        trip: themeData.trip,
        locations: themeData.daily_plan || []
      };
      
      await saveTrip(tripWithLocations);
      setSuccessMessage('Plan başarıyla kaydedildi!');
      
      setTripOptions([]);
      setSelectedTheme(null);
      setFormData({
        name: '', description: '', startPosition: '', endPosition: '',
        startDate: getFormattedToday(), endDate: getFormattedToday()
      });
      
      if (onTripCreated) onTripCreated();
      
    } catch (err) {
      setError(err.response?.data?.error || 'Plan kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.formSection}>
        <div style={styles.formCard}>
          <h3 style={styles.title}>AI ile Kamp Rotası Planla</h3>
          
          {error && <div style={styles.errorMessage}>{error}</div>}
          {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
          
          <form onSubmit={handleGeneratePlan} style={styles.form}>
            <div style={styles.formGrid}>
              <Input 
                id="name" label="Gezi Adı" name="name" value={formData.name} 
                onChange={handleChange} placeholder="Örn: Ege Sahilleri Kamp Turu" 
                required disabled={isGenerating || isSaving}
              />
              <Input 
                id="description" label="Açıklama" name="description" value={formData.description} 
                onChange={handleChange} placeholder="Örn: Doğa içinde sakin bir kamp deneyimi" 
                disabled={isGenerating || isSaving}
              />
              <Select 
                id="startPosition" label="Başlangıç Konumu" name="startPosition" 
                value={formData.startPosition} onChange={handleChange} options={TURKISH_CITIES} 
                disabled={isGenerating || isSaving} 
              />
              <Select 
                id="endPosition" label="Bitiş Konumu" name="endPosition" 
                value={formData.endPosition} onChange={handleChange} options={TURKISH_CITIES} 
                disabled={isGenerating || isSaving} 
              />
              <Input 
                id="startDate" label="Başlangıç Tarihi" name="startDate" type="date" 
                value={formData.startDate} onChange={handleChange} 
                required disabled={isGenerating || isSaving}
              />
              <Input 
                id="endDate" label="Bitiş Tarihi" name="endDate" type="date" 
                value={formData.endDate} onChange={handleChange} 
                required disabled={isGenerating || isSaving}
              />
            </div>
            
            <div style={styles.generateButtonContainer}>
              <Button type="submit" disabled={isGenerating || isSaving}>
                {isGenerating ? 'Rotalar Oluşturuluyor...' : '🚀 3 Farklı Rota Seçeneği Oluştur'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {tripOptions.length > 0 && (
        <div style={styles.themesSection}>
          <h3 style={styles.themesTitle}>Size Özel 3 Rota Seçeneği</h3>
          <p style={styles.themesSubtitle}>
            Aşağıdaki rotalardan birini seçin ve kaydedin. Her rota farklı bir tema ve deneyim sunuyor.
          </p>
          
          <div style={styles.themesGrid}>
            {tripOptions.map((themeData, index) => (
              <ThemeCard
                key={index}
                themeData={themeData}
                isSelected={selectedTheme === themeData}
                onSelect={handleThemeSelect}
                isSaving={isSaving}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageWrapper: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  
  formSection: {
    padding: '2rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e9ecef'
  },
  formCard: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#2c3e50',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: '1.8rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '600',
    color: '#34495e'
  },
  select: {
    padding: '0.85rem',
    border: '1px solid #dcdfe2',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: '#fff'
  },
  generateButtonContainer: {
    textAlign: 'center',
    marginTop: '1rem'
  },

  themesSection: {
    padding: '3rem 2rem',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  themesTitle: {
    textAlign: 'center',
    fontSize: '1.8rem',
    color: '#2c3e50',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    marginBottom: '0.5rem'
  },
  themesSubtitle: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '1.1rem',
    marginBottom: '3rem',
    lineHeight: '1.5'
  },
  themesGrid: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    alignItems: 'stretch',
    flexWrap: 'wrap'
  },

  themeCard: {
    flex: '1',
    minWidth: '350px',
    maxWidth: '400px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '2px solid #e9ecef',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column'
  },
  themeHeader: {
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  themeTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '0.5rem',
    fontFamily: "'Nunito', sans-serif"
  },
  themeDescription: {
    color: '#6c757d',
    fontSize: '0.9rem',
    lineHeight: '1.4',
    margin: 0
  },
  themePlanDetails: {
    flex: 1,
    marginBottom: '1.5rem'
  },
  tripInfo: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem'
  },
  cardActions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center'
  },
  selectedButton: {
    backgroundColor: '#d4edda',
    color: '#155724',
    borderColor: '#c3e6cb'
  },

  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '0.4rem 0',
    fontSize: '0.9rem'
  },
  detailLabel: {
    fontWeight: '600',
    color: '#495057',
    marginRight: '1rem',
    minWidth: '60px'
  },
  detailValue: {
    color: '#2c3e50',
    textAlign: 'right',
    wordBreak: 'break-word'
  },

  detailedDailyPlans: {
    backgroundColor: '#f8fffe',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #e8f5f4'
  },
  dailyPlansHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  dailyPlansTitle: {
    fontSize: '1rem',
    fontWeight: '700', // GÜNCELLENDİ
    color: '#2c3e50',
    marginBottom: '0.75rem'
  },
  toggleButton: {
    backgroundColor: '#5c8d89',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  daysContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  detailedDayCard: {
    backgroundColor: '#fff',
    border: '1px solid #e9ecef',
    borderRadius: '10px',
    padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  dayCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '2px solid #f8f9fa'
  },
  dayNumberBadge: {
    backgroundColor: '#5c8d89',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '700'
  },
  dayDateInfo: {
    color: '#6c757d',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  dayLocationSection: {
    marginBottom: '1rem'
  },
  locationInfoGrid: { // YENİ
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  locationInfoRow: { // YENİ
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: '0.9rem'
  },
  locationLabel: { // GÜNCELLENDİ
    fontWeight: 'bold',
    color: '#495057',
    marginRight: '0.5rem',
    minWidth: '100px',
    flexShrink: 0
  },
  locationValue: { // YENİ
    color: '#2c3e50',
    wordBreak: 'break-word'
  },
  websiteLink: { // YENİ
    color: '#007bff',
    textDecoration: 'none',
    wordBreak: 'break-all'
  },
  activitiesSection: {
    marginBottom: '1rem',
    backgroundColor: '#f0f8ff',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #e6f3ff'
  },
  activitiesTitle: {
    fontSize: '0.95rem',
    fontWeight: 'bold', // GÜNCELLENDİ
    color: '#2c3e50',
    marginBottom: '0.75rem'
  },
  activitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  activityItem: {
    fontSize: '0.9rem',
    color: '#495057',
    paddingLeft: '0.5rem'
  },
  moreActivities: {
    fontSize: '0.8rem',
    color: '#6c757d',
    fontStyle: 'italic',
    paddingLeft: '0.5rem'
  },
  notesSection: {
    marginBottom: '1rem',
    backgroundColor: '#fff3cd',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #ffeaa7'
  },
  notesTitle: {
    fontSize: '0.95rem',
    fontWeight: 'bold', // GÜNCELLENDİ
    color: '#856404',
    marginBottom: '0.5rem'
  },
  notesContent: {
    fontSize: '0.9rem',
    color: '#856404',
    lineHeight: '1.4',
    fontStyle: 'italic'
  },
  coordinatesSection: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  mapButton: {
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  hiddenDaysInfo: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px'
  },

  errorMessage: {
    color: '#721c24',
    backgroundColor: '#f8d7da',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '1.5rem',
    border: '1px solid #f5c6cb'
  },
  successMessage: {
    color: '#155724',
    backgroundColor: '#d4edda',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '1.5rem',
    border: '1px solid #c3e6cb'
  }
};

export default TripPlannerForm;