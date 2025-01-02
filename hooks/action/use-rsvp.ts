'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';

interface RSVPData {
  weddingId: string;
  guestSlug: string;
  attendance: string;
  komentar: string;
}

export function useRSVP() {
  const [loading, setLoading] = useState(false);

  const submitRSVP = async (data: RSVPData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal mengirimkan RSVP');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Terima Kasih!',
        text: 'RSVP Anda telah berhasil dikirimkan.',
        confirmButtonColor: '#10B981',
        background: '#FFF',
        customClass: {
          popup: 'rounded-lg shadow-xl border border-gray-100',
          title: 'text-2xl font-semibold text-gray-800',
          confirmButton: 'px-6 py-2 rounded-lg text-white font-medium'
        }
      });

      return true;
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error instanceof Error ? error.message : 'Gagal mengirimkan RSVP',
        confirmButtonColor: '#EF4444',
        background: '#FFF',
        customClass: {
          popup: 'rounded-lg shadow-xl border border-gray-100',
          title: 'text-2xl font-semibold text-gray-800',
          confirmButton: 'px-6 py-2 rounded-lg text-white font-medium'
        }
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitRSVP, loading };
}