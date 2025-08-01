import React, { useState } from 'react';

// Servisler ve özel bileşenleri import ediyoruz
import { createTrip } from '../../services/tripService';
import Button from '../common/button';
import Input from '../common/input';

/**
 * Kullanıcının yeni bir gezi planı oluşturmasını sağlayan form bileşeni.
 * @param {object} props
 * @param {function} [props.onTripCreated] - Gezi başarıyla oluşturulduktan sonra çağrılacak opsiyonel bir fonksiyon.
 */
const TripPlannerForm = ({ onTripCreated }) => {
  // Form verilerini tek bir state nesnesinde tutmak daha düzenlidir.
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
  });

  // API isteğinin durumunu ve sonuçlarını yönetmek için state'ler.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Tüm input'lardaki değişiklikleri yöneten tek bir fonksiyon.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form gönderildiğinde çalışacak asenkron fonksiyon.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle.

    // Yeni bir istek başlatırken eski mesajları temizle.
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      // tripService'i kullanarak veriyi backend'e gönder.
      await createTrip(formData);

      // Başarılı olursa:
      setSuccessMessage('Harika! Yeni gezin başarıyla planlandı.');
      setFormData({ destination: '', startDate: '', endDate: '' }); // Formu temizle.

      // Eğer dışarıdan bir fonksiyon verildiyse onu çağır (örneğin gezi listesini yenilemek için).
      if (onTripCreated) {
        onTripCreated();
      }

    } catch (err) {
      // Hata olursa:
      console.error('Gezi oluşturma hatası:', err);
      setError(err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');

    } finally {
      // Sonuç ne olursa olsun, yüklenme durumunu sonlandır.
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Yeni Bir Macera Planla</h3>

      {/* Hata veya başarı mesajlarını koşullu olarak render et */}
      {error && <p style={styles.errorMessage}>{error}</p>}
      {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <Input
          id="destination"
          label="Nereye Gidiyorsun?"
          name="destination" // Bu isim, handleChange fonksiyonu için kritik.
          value={formData.destination}
          onChange={handleChange}
          placeholder="Örn: Fethiye, Kelebekler Vadisi"
          required
          disabled={isLoading}
        />
        <Input
          id="startDate"
          label="Başlangıç Tarihi"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        <Input
          id="endDate"
          label="Dönüş Tarihi"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          required
          disabled={isLoading}
        />

        <div style={styles.buttonContainer}>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Planlanıyor...' : 'Geziyi Planla'}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Estetik ve Kullanıcı Dostu Stiller
const styles = {
  container: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#3a3a3a',
    fontFamily: "'Nunito', sans-serif",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  buttonContainer: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'flex-end', // Butonu sağa yasla
  },
  errorMessage: {
    color: '#d32f2f',
    backgroundColor: '#ffebee',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
  },
  successMessage: {
    color: '#2e7d32',
    backgroundColor: '#e8f5e9',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
  },
};

export default TripPlannerForm;