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
        setUserName(userData.name);
        return;
      }

      // Handle check-in response
      setMonthlyCount(userData.monthlyCheckins || 0);
      setUserName(userData.name);

      if (userData.checkedInNow) {
        // Successfully checked in just now
        setStatus('success');
        setMessage(`Dobrodošli, ${userData.name}!`);
      } else if (userData.hasRecentCheckin && userData.cooldownRemaining) {
        // Has recent check-in, still in cooldown
        setStatus('error');
        setMessage(`${userData.name}, možete ponovo da se prijavite za ${userData.cooldownRemaining}`);
      } else if (userData.hasRecentCheckin) {
        // Has recent check-in but cooldown info not available
        setStatus('error');
        setMessage(`${userData.name}, već ste se prijavili. Pokušajte ponovo kasnije.`);
      } else {
        // Success - no specific check-in created but showing stats
        setStatus('success');
        setMessage(`Dobrodošli, ${userData.name}!`);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Greška pri povezivanju sa serverom');
    }
  };

  return (
    <div className={styles.container}>
      {/* Background orbs */}
      <div className={styles.orbContainer}>
        <div className={`${styles.orb} ${styles.orb1}`}></div>
        <div className={`${styles.orb} ${styles.orb2}`}></div>
        {(status === 'error' || status === 'no-membership') && (
          <div className={`${styles.orb} ${styles.orb3}`}></div>
        )}
      </div>

      {status === 'loading' && (
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p className={styles.loadingText}>Proveravanje...</p>
        </div>
      )}

      {status === 'success' && (
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <div className={styles.successCircle}>
              <div className={styles.checkmark}></div>
            </div>
          </div>
          <h1 className={styles.title}>{message}</h1>
          <p className={styles.subtitle}>Uspešno ste se prijavili</p>
          <div className={styles.statsCard}>
            <span className={styles.statNumber}>{monthlyCount}</span>
            <span className={styles.statLabel}>treninga ovog meseca</span>
          </div>
          <button
            className={styles.actionButton}
            onClick={() => window.location.href = 'kbkprincip://home'}
          >
            Vrati se u aplikaciju
          </button>
        </div>
      )}

      {status === 'no-membership' && (
        <div className={styles.noMembershipContainer}>
          <div className={styles.errorIcon}>
            <div className={styles.errorCircle}>
              <div className={styles.xmark}></div>
            </div>
          </div>
          <h1 className={styles.title}>Članarina nije aktivna</h1>
          <p className={styles.subtitle}>{userName ? `${userName}, ` : ''}molimo Vas obnovite članarinu</p>
          <div className={styles.warningStatsCard}>
            <div className={styles.warningIcon}>⚠️</div>
            <div className={styles.warningText}>
              Vaša članarina je istekla.<br />
              Obnovite je da nastavite treniranje.
            </div>
          </div>
          <button
            className={styles.actionButton}
            onClick={() => window.location.href = 'kbkprincip://membership'}
          >
            Obnovi članarinu
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <div className={styles.errorCircle}>
              <div className={styles.xmark}></div>
            </div>
          </div>
          <h1 className={styles.title}>Greška</h1>
          <p className={styles.subtitle}>{message}</p>
          <button
            className={styles.actionButton}
            onClick={() => window.location.href = 'kbkprincip://home'}
          >
            Vrati se u aplikaciju
          </button>
        </div>
      )}
    </div>
  );
}

export default function CheckInPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p className={styles.loadingText}>Učitavanje...</p>
        </div>
      </div>
    }>
      <CheckInContent />
    </Suspense>
  );
}