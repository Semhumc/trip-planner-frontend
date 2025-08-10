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

// Yardımcı Bileşen: "Etiket: Değer" satırlarını oluşturur
const DetailRow = ({ label, children }) => (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={styles.detailValue}>{children}</span>
    </div>
);

// YENİ: Tek bir tema kartı bileşeni
const ThemeCard = ({ themeData, isSelected, onSelect, onSave, isSaving }) => {
  if (!themeData || !themeData.trip) return null;

  return (
    <div style={{
      ...styles.themeCard,
      borderColor: isSelected ? '#5c8d89' : '#e9ecef',
      backgroundColor: isSelected ? '#f8fffe' : '#fff'
    }}>
      {/* Tema Başlığı */}
      <div style={styles.themeHeader}>
        <h3 style={styles.themeTitle}>{themeData.theme}</h3>
        <p style={styles.themeDescription}>{themeData.description}</p>
      </div>

      {/* Plan Detayları */}
      <div style={styles.themePlanDetails}>
        <div style={styles.tripInfo}>
          <DetailRow label="Plan:">{themeData.trip.name}</DetailRow>
          <DetailRow label="Süre:">{themeData.trip.total_days} gün</DetailRow>
          <DetailRow label="Rota:">{themeData.trip.start_position} → {themeData.trip.end_position}</DetailRow>
        </div>

        {/* Günlük Planlar Preview */}
        <div style={styles.dailyPlansPreview}>
          <h4 style={styles.dailyPlansTitle}>Günlük Plan ({themeData.daily_plan?.length || 0} konum)</h4>
          <div style={styles.dailyPlansList}>
            {themeData.daily_plan?.slice(0, 2).map((day, index) => {
              const campsite = day.name?.split(' - ')[0] || day.name || 'Kamp Alanı';
              const startDate = new Date(themeData.trip.start_date);
              startDate.setDate(startDate.getDate() + index);
              const formattedDate = startDate.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
              
              return (
                <div key={index} style={styles.dayPreview}>
                  <span style={styles.dayNumber}>Gün {day.day || index + 1}</span>
                  <span style={styles.dayLocation}>{campsite}</span>
                  <span style={styles.dayDate}>{formattedDate}</span>
                </div>
              );
            })}
            {themeData.daily_plan?.length > 2 && (
              <div style={styles.moreLocations}>
                +{themeData.daily_plan.length - 2} lokasyon daha...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kart Aksiyonları */}
      <div style={styles.cardActions}>
        <Button 
          variant="secondary" 
          onClick={() => onSelect(themeData)}
          style={isSelected ? styles.selectedButton : {}}
        >
          {isSelected ? '✓ Seçildi' : 'Seç'}
        </Button>
        {isSelected && (
          <Button 
            variant="primary" 
            onClick={() => onSave(themeData)}
            disabled={isSaving}
          >
            {isSaving ? 'Kaydediliyor...' : 'Bu Temayı Kaydet'}
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
  const [tripOptions, setTripOptions] = useState([]); // YENİ: 3 tema seçeneği
  const [selectedTheme, setSelectedTheme] = useState(null); // YENİ: Seçilen tema

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
      
      // YENİ: Backend'den 3 tema seçeneği geldiğini varsayıyoruz
      if (response.data.trip_options && Array.isArray(response.data.trip_options)) {
        setTripOptions(response.data.trip_options);
      } else {
        // Eski format için fallback (tek plan)
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
      // Options kısmını ignore ederek sadece seçilen temayı kaydet
      const tripWithLocations = {
        trip: themeData.trip,
        locations: themeData.daily_plan || []
      };
      
      await saveTrip(tripWithLocations);
      setSuccessMessage('Plan başarıyla kaydedildi!');
      
      // Form'u reset et
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
      {/* FORM ALANI - ÜST */}
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

      {/* TEMA KARTLARI ALANI - ALT */}
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
                onSave={handleSaveTheme}
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
  
  // FORM SEKSİYONU STİLLERİ
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

  // TEMA SEKSİYONU STİLLERİ
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

  // TEMA KARTI STİLLERİ
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
  dailyPlansPreview: {
    backgroundColor: '#f0f8ff',
    padding: '1rem',
    borderRadius: '8px'
  },
  dailyPlansTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '0.75rem'
  },
  dailyPlansList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  dayPreview: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #e9ecef'
  },
  dayNumber: {
    fontWeight: '600',
    color: '#5c8d89',
    minWidth: '50px'
  },
  dayLocation: {
    flex: 1,
    color: '#2c3e50',
    textAlign: 'center'
  },
  dayDate: {
    color: '#6c757d',
    minWidth: '60px',
    textAlign: 'right'
  },
  moreLocations: {
    color: '#6c757d',
    fontSize: '0.8rem',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingTop: '0.5rem'
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

  // DETAY ROW STİLLERİ
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

  // MESAJ STİLLERİ
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