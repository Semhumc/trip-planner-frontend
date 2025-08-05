// src/components/trip/TripPlannerForm.js
// AÇIKLAMA: Bu, bileşenin son halidir. İki kartlı modern bir düzene sahiptir.
// Plan önizlemesi, daha iyi okunabilirlik için "Etiket: Değer" yapısını kullanır.

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

// Yardımcı Bileşen: "Etiket: Değer" satırlarını oluşturur.
const DetailRow = ({ label, children }) => (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={styles.detailValue}>{children}</span>
    </div>
);

// Örnek Plan Bileşeni: Yeni "DetailRow" yapısını kullanır.
const SamplePlanPreview = () => (
    <div style={styles.planContainer}>
      <h4 style={styles.title}>Örnek Plan Görünümü</h4>
      <p style={styles.sampleDescription}>
        Sol taraftaki formu doldurarak kendi rotanızı oluşturun. Oluşturduğunuz plan burada görünecektir.
      </p>
      <div style={styles.dayPlan}>
        <strong style={styles.dayTitle}>Gün 1</strong>
        <DetailRow label="Tarih:">01.09.2025</DetailRow>
        <DetailRow label="Kamp Alanı:">Ölüdeniz Doğa Kamp, Fethiye</DetailRow>
        <hr style={styles.divider} />
        <DetailRow label="Adres:">Kelebekler Vadisi Yolu, Ölüdeniz/Fethiye/Muğla</DetailRow>
      </div>
      <div style={styles.dayPlan}>
        <strong style={styles.dayTitle}>Gün 2</strong>
        <DetailRow label="Tarih:">02.09.2025</DetailRow>
        <DetailRow label="Kamp Alanı:">Kaş Kamping, Kaş</DetailRow>
        <hr style={styles.divider} />
        <DetailRow label="Adres:">Andifli Mahallesi, Kaş/Antalya</DetailRow>
        <DetailRow label="Web Sitesi:"><a href="#!" style={styles.link} onClick={(e) => e.preventDefault()}>Ziyaret Et</a></DetailRow>
      </div>
    </div>
);

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
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setSuccessMessage('');
    setGeneratedPlan(null);
    try {
      const promptData = {
        userId: userProfile?.id || userProfile?.username,
        ...formData
      };
      const response = await generateTripPlan(promptData);
      setGeneratedPlan(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Plan oluşturulurken bir hata oluştu.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!generatedPlan || !generatedPlan.trip) return;
    setIsSaving(true);
    setError(null);
    try {
        const tripWithLocations = {
            trip: generatedPlan.trip,
            locations: generatedPlan.daily_plan
        };
        await saveTrip(tripWithLocations);
        setSuccessMessage('Planınız başarıyla kaydedildi!');
        setGeneratedPlan(null);
        setFormData({
            name: '', description: '', startPosition: '', endPosition: '',
            startDate: getFormattedToday(), endDate: getFormattedToday()
        });
        if(onTripCreated) onTripCreated();
    } catch (err) {
        setError(err.response?.data?.error || 'Plan kaydedilirken bir hata oluştu.');
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.cardsContainer}>
        {/* Sol Kart: Form Alanı */}
        <div style={styles.card}>
          <h3 style={styles.title}>AI ile Rota Planla</h3>
          {error && <div style={styles.errorMessage}>{error}</div>}
          {successMessage && !generatedPlan && <div style={styles.successMessage}>{successMessage}</div>}
          <form onSubmit={handleGeneratePlan} style={styles.form}>
            <Input id="name" label="Gezi Adı" name="name" value={formData.name} onChange={handleChange} placeholder="Örn: Ege Sahilleri Kamp Turu" required disabled={isGenerating || isSaving}/>
            <Input id="description" label="Açıklama" name="description" value={formData.description} onChange={handleChange} placeholder="Örn: Doğa içinde sakin bir kamp deneyimi" disabled={isGenerating || isSaving}/>
            <Select id="startPosition" label="Başlangıç Konumu" name="startPosition" value={formData.startPosition} onChange={handleChange} options={TURKISH_CITIES} disabled={isGenerating || isSaving} />
            <Select id="endPosition" label="Bitiş Konumu" name="endPosition" value={formData.endPosition} onChange={handleChange} options={TURKISH_CITIES} disabled={isGenerating || isSaving} />
            <Input id="startDate" label="Başlangıç Tarihi" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required disabled={isGenerating || isSaving}/>
            <Input id="endDate" label="Bitiş Tarihi" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required disabled={isGenerating || isSaving}/>
            <div style={styles.buttonContainer}>
              <Button type="submit" disabled={isGenerating || isSaving}>
                {isGenerating ? 'Plan Oluşturuluyor...' : 'AI ile Plan Oluştur'}
              </Button>
            </div>
          </form>
        </div>

        {/* Sağ Kart: Plan Önizleme Alanı */}
        <div style={styles.card}>
          {generatedPlan && generatedPlan.trip ? (
            <div style={styles.planContainer}>
              <h4 style={styles.title}>Oluşturulan Plan</h4>
              <div style={styles.dailyPlanContainer}>
                {generatedPlan.daily_plan?.map((day, index) => {
                  if (!day) return null;
                  const nameParts = day.name.split(' - ');
                  const location = nameParts[0] || '';
                  const campsite = nameParts.length > 1 ? nameParts[1] : (location || 'Belirtilmemiş');
                  const startDate = new Date(generatedPlan.trip.start_date);
                  startDate.setDate(startDate.getDate() + index); 
                  const formattedDate = startDate.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                  
                  return (
                    <div key={index} style={styles.dayPlan}>
                      <strong style={styles.dayTitle}>Gün {day.day || index + 1}</strong>
                      <DetailRow label="Tarih:">{formattedDate}</DetailRow>
                      <DetailRow label="Kamp Alanı:">{campsite}, {location}</DetailRow>
                      <hr style={styles.divider} />
                      <DetailRow label="Adres:">{day.address || 'Belirtilmemiş'}</DetailRow>
                      {day.site_url && day.site_url.startsWith('http') && (
                        <DetailRow label="Web Sitesi:">
                          <a href={day.site_url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                            Ziyaret Et
                          </a>
                        </DetailRow>
                      )}
                    </div>
                  );
                })}
              </div>
              <Button type="button" variant="secondary" onClick={handleSavePlan} disabled={isSaving} style={{width: '100%', marginTop: '1.5rem'}}>
                {isSaving ? 'Kaydediliyor...' : 'Bu Planı Kaydet'}
              </Button>
            </div>
          ) : (
            <SamplePlanPreview />
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { width: '100%', minHeight: '100vh', padding: '2rem', backgroundColor: '#eef2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' },
  cardsContainer: { display: 'flex', flexDirection: 'row', gap: '2rem', width: '100%', maxWidth: '1600px' },
  card: { flex: 1, backgroundColor: '#ffffff', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)', minHeight: '80vh', display: 'flex', flexDirection: 'column' },
  title: { textAlign: 'center', marginBottom: '2rem', color: '#2c3e50', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '1.8rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.5rem', flexGrow: 1 },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontWeight: '600', color: '#34495e' },
  select: { padding: '0.85rem', border: '1px solid #dcdfe2', borderRadius: '8px', fontSize: '1rem', backgroundColor: '#fff' },
  buttonContainer: { marginTop: 'auto', display: 'flex' },
  planContainer: { display: 'flex', flexDirection: 'column', height: '100%' },
  dailyPlanContainer: { overflowY: 'auto', flexGrow: 1, paddingRight: '10px' },
  dayPlan: { backgroundColor: '#f8f9fa', padding: '1.5rem', margin: '1rem 0', borderRadius: '12px', border: '1px solid #e9ecef' },
  dayTitle: { display: 'block', color: '#16a085', fontSize: '1.4rem', marginBottom: '1rem', fontWeight: 700 },
  detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.6rem 0', borderBottom: '1px solid #f0f2f1' },
  detailLabel: { fontWeight: '600', color: '#34495e', marginRight: '1rem' },
  detailValue: { textAlign: 'right', color: '#2c3e50', wordBreak: 'break-word' },
  divider: { border: 0, height: '1px', backgroundColor: '#e0e4e7', margin: '0.5rem 0' },
  link: { color: '#2980b9', textDecoration: 'none', fontWeight: '500' },
  samplePlanContainer: { textAlign: 'left', paddingTop: '1rem' },
  sampleDescription: { color: '#555', lineHeight: 1.6, marginBottom: '2rem', textAlign: 'center' },
  errorMessage: { color: '#c0392b', backgroundColor: '#fbe9e7', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1.5rem' },
  successMessage: { color: '#27ae60', backgroundColor: '#e8f5e9', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1.5rem' },
};

export default TripPlannerForm;