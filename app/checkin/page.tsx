'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './checkin.module.css';

function CheckInContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-membership'>('loading');
  const [message, setMessage] = useState('');
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const qrCode = searchParams.get('code');
    if (qrCode) {
      checkIn(qrCode);
    } else {
      setStatus('error');
      setMessage('Nevažeći QR kod');
    }
  }, [searchParams]);

  const checkIn = async (qrCode: string) => {
    try {
      // First get user data from QR code
      const userResponse = await fetch(`/api/checkin/validate?code=${qrCode}`);
      const userData = await userResponse.json();

      if (!userResponse.ok) {
        setStatus('error');
        setMessage(userData.error || 'Greška pri čekiranju');
        return;
      }

      setUserName(userData.name);

      // Check membership status
      if (!userData.membershipActive) {
        setStatus('no-membership');
        setMessage('Vaša članarina nije aktivna');
        return;
      }

      // Record attendance
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}` // Token from QR validation
        },
        body: JSON.stringify({ qrCode })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(`Dobrodošli, ${userData.name}!`);
        setMonthlyCount(data.attendance?.monthlyTotal || 0);
      } else {
        if (response.status === 403 && data.error?.includes('članarina')) {
          setStatus('no-membership');
          setMessage(data.error);
        } else {
          setStatus('error');
          setMessage(data.error || 'Greška pri čekiranju');
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage('Greška pri povezivanju sa serverom');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundPattern}></div>

      {status === 'loading' && (
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Proveravanje...</p>
        </div>
      )}

      {status === 'success' && (
        <div className={styles.successContainer}>
          <div className={styles.checkmarkCircle}>
            <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className={styles.checkmarkCircleOutline} cx="26" cy="26" r="25" fill="none"/>
              <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          <h1 className={styles.successTitle}>{message}</h1>
          <p className={styles.successSubtitle}>Uspešno ste se prijavili</p>
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{monthlyCount}</span>
              <span className={styles.statLabel}>treninga ovog meseca</span>
            </div>
          </div>
          <div className={styles.motivationalText}>
            Samo tako nastavi! 💪
          </div>
        </div>
      )}

      {status === 'no-membership' && (
        <div className={styles.errorContainer}>
          <div className={styles.errorCircle}>
            <svg className={styles.xmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className={styles.xmarkCircleOutline} cx="26" cy="26" r="25" fill="none"/>
              <path className={styles.xmarkX} fill="none" d="M16 16 L36 36 M36 16 L16 36"/>
            </svg>
          </div>
          <h1 className={styles.errorTitle}>Članarina nije aktivna</h1>
          <p className={styles.errorSubtitle}>{userName ? `${userName}, ` : ''}molimo Vas obnovite članarinu</p>
          <div className={styles.actionContainer}>
            <button className={styles.primaryButton} onClick={() => window.location.href = '/membership'}>
              Obnovi članarinu
            </button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.errorContainer}>
          <div className={styles.errorCircle}>
            <svg className={styles.xmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className={styles.xmarkCircleOutline} cx="26" cy="26" r="25" fill="none"/>
              <path className={styles.xmarkX} fill="none" d="M16 16 L36 36 M36 16 L16 36"/>
            </svg>
          </div>
          <h1 className={styles.errorTitle}>Greška</h1>
          <p className={styles.errorSubtitle}>{message}</p>
        </div>
      )}
    </div>
  );
}

export default function CheckInPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.backgroundPattern}></div>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Učitavanje...</p>
        </div>
      </div>
    }>
      <CheckInContent />
    </Suspense>
  );
}