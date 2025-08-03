// src/components/trip/TripPlannerForm.js - SON ve DOĞRU VERSİYON
import React, { useState, useEffect } from 'react';
import { generateTripPlan, saveTrip } from '../../services/tripService';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/button';
import Input from '../common/input';

const TripPlannerForm = ({ onTripCreated }) => {
  const { userProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startPosition: '',
    endPosition: '',
    startDate: '',
    endDate: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);

  // Hata Ayıklama: generatedPlan state'i değiştiğinde konsola yazdır
  useEffect(() => {
    if (generatedPlan) {
      console.log("STATE GÜNCELLENDİ, YENİ PLAN:", JSON.stringify(generatedPlan, null, 2));
    }
  }, [generatedPlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setSuccessMessage('');
    setGeneratedPlan(null); // Önceki planı temizle

    try {
      const promptData = {
        userId: userProfile?.id || userProfile?.username,
        name: formData.name,
        description: formData.description,
        startPosition: formData.startPosition,
        endPosition: formData.endPosition,
        startDate: formData.startDate,
        endDate: formData.endDate
      };

      const response = await generateTripPlan(promptData);
      
      // HATA AYIKLAMA ADIMI: Gelen veriyi ham haliyle konsola yazdır
      console.log("API'DAN GELEN HAM YANIT:", JSON.stringify(response.data, null, 2));

      setGeneratedPlan(response.data);
      setSuccessMessage('Rota planınız başarıyla oluşturuldu! Kaydetmek için "Planı Kaydet" butonuna tıklayın.');

    } catch (err) {
      console.error('Plan oluşturma hatası:', err);
      setError(err.response?.data?.error || 'Plan oluşturulurken bir hata oluştu.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!generatedPlan || !generatedPlan.daily_plan) return;

    setIsSaving(true);
    setError(null);

    try {
      const tripWithLocations = {
        trip: {
          user_id: generatedPlan.trip.user_id,
          name: generatedPlan.trip.name,
          description: generatedPlan.trip.description,
          start_date: new Date(generatedPlan.trip.start_date).toISOString(),
          end_date: new Date(generatedPlan.trip.end_date).toISOString(),
          start_position: generatedPlan.trip.start_position,
          end_position: generatedPlan.trip.end_position
        },
        locations: generatedPlan.daily_plan
          .filter(day => day && day.location) // Güvenlik kontrolü
          .map((day) => ({
            name: day.location.name,
            address: day.location.address,
            site_url: day.location.site_url,
            latitude: parseFloat(day.location.latitude) || 0,
            longitude: parseFloat(day.location.longitude) || 0,
            // DÜZELTME: 'notes' alanı 'day.location' içinden doğru şekilde okunuyor.
            notes: day.location.notes || "" 
          }))
      };

      await saveTrip(tripWithLocations);
      
      setSuccessMessage('Planınız başarıyla kaydedildi!');
      setGeneratedPlan(null);
      setFormData({ name: '', description: '', startPosition: '', endPosition: '', startDate: '', endDate: '' });

      if (onTripCreated) onTripCreated();

    } catch (err) {
      console.error('Plan kaydetme hatası:', err);
      setError(err.response?.data?.error || 'Plan kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>AI ile Kamp Rotası Planla</h3>
      {error && <div style={styles.errorMessage}>{error}</div>}
      {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

      <form onSubmit={handleGeneratePlan} style={styles.form}>
        <Input id="name" label="Gezi Adı" name="name" value={formData.name} onChange={handleChange} placeholder="Örn: Ege Sahilleri Kamp Turu" required disabled={isGenerating || isSaving}/>
        <Input id="description" label="Açıklama" name="description" value={formData.description} onChange={handleChange} placeholder="Örn: Doğa içinde sakin bir kamp deneyimi" disabled={isGenerating || isSaving}/>
        <Input id="startPosition" label="Başlangıç Konumu" name="startPosition" value={formData.startPosition} onChange={handleChange} placeholder="Örn: İstanbul" required disabled={isGenerating || isSaving}/>
        <Input id="endPosition" label="Bitiş Konumu" name="endPosition" value={formData.endPosition} onChange={handleChange} placeholder="Örn: Antalya" required disabled={isGenerating || isSaving}/>
        <Input id="startDate" label="Başlangıç Tarihi" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required disabled={isGenerating || isSaving}/>
        <Input id="endDate" label="Bitiş Tarihi" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required disabled={isGenerating || isSaving}/>

        <div style={styles.buttonContainer}>
          <Button type="submit" disabled={isGenerating || isSaving}>
            {isGenerating ? 'Plan Oluşturuluyor...' : 'AI ile Plan Oluştur'}
          </Button>
          {generatedPlan && (
            <Button type="button" variant="secondary" onClick={handleSavePlan} disabled={isSaving}>
              {isSaving ? 'Kaydediliyor...' : 'Planı Kaydet'}
            </Button>
          )}
        </div>
      </form>

      {/* Generated Plan Preview */}
      {generatedPlan && generatedPlan.trip && (
        <div style={styles.planPreview}>
          <h4>Oluşturulan Plan Önizlemesi</h4>
          <div style={styles.planDetails}>
            <h5>{generatedPlan.trip.name}</h5>
            <p><strong>Açıklama:</strong> {generatedPlan.trip.description}</p>
            <p><strong>Tarih:</strong> {new Date(generatedPlan.trip.start_date).toLocaleDateString()} - {new Date(generatedPlan.trip.end_date).toLocaleDateString()}</p>
            <p><strong>Toplam Gün:</strong> {generatedPlan.trip.total_days}</p>
            
            <h6>Günlük Plan:</h6>
            {generatedPlan.daily_plan && generatedPlan.daily_plan.map((day, index) => {
              // DÜZELTME: Güvenlik kontrolü hala yerinde, ancak artık başarılı olmalı.
              if (!day || !day.location) {
                return (
                  <div key={index} style={styles.dayPlan}>
                    <strong style={{color: 'red'}}>Gün {day?.day || index + 1}: Konum bilgisi işlenirken bir hata oluştu.</strong>
                  </div>
                );
              }
              
              return (
                <div key={index} style={styles.dayPlan}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Gün {day.day || index + 1}: {day.location.name}
                  </strong>
                  <p style={styles.detailText}><strong>Adres:</strong> {day.location.address || 'Belirtilmemiş'}</p>
                  <p style={styles.detailText}><strong>Koordinatlar:</strong> {day.location.latitude}, {day.location.longitude}</p>
                  {day.location.site_url && day.location.site_url !== "Henüz bilinmiyor" && (
                    <p style={styles.detailText}>
                      <strong>Web Sitesi:</strong> 
                      <a href={day.location.site_url} target="_blank" rel="noopener noreferrer" style={styles.link}>Ziyaret Et</a>
                    </p>
                  )}
                  {/* DÜZELTME: 'notes' alanı 'day.location' içinden doğru şekilde okunuyor. */}
                  {day.location.notes && <p style={{ marginTop: '0.5rem' }}><strong>Notlar:</strong> {day.location.notes}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Styles objesi aynı kalabilir
const styles = {
  container: { backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' },
  title: { textAlign: 'center', marginBottom: '1.5rem', color: '#3a3a3a', fontFamily: "'Nunito', sans-serif" },
  form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  buttonContainer: { marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' },
  errorMessage: { color: '#d32f2f', backgroundColor: '#ffebee', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' },
  successMessage: { color: '#2e7d32', backgroundColor: '#e8f5e9', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' },
  planPreview: { marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' },
  planDetails: { marginTop: '1rem' },
  dayPlan: { backgroundColor: 'white', padding: '1rem', margin: '0.75rem 0', borderRadius: '6px', borderLeft: '4px solid #5c8d89' },
  detailText: { margin: '0.25rem 0', fontSize: '0.9em', color: '#555' },
  link: { color: '#007bff', textDecoration: 'none', marginLeft: '0.5rem' }
};

export default TripPlannerForm;