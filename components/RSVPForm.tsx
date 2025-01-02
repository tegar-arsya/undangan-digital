'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useRSVP } from '@/hooks/action/use-rsvp';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartIcon } from 'lucide-react';

interface RSVPFormProps {
  weddingId: string;
  guestSlug: string;
}

export default function RSVPForm({ weddingId, guestSlug }: RSVPFormProps) {
  const [attendance, setAttendance] = useState('yes');
  const [komentar, setKomentar] = useState('');
  const { submitRSVP, loading } = useRSVP();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitRSVP({
      weddingId,
      guestSlug,
      attendance,
      komentar
    });

    if (success) {
      setAttendance('yes');
      setKomentar('');
    }
  };

  return (
    <Card className="max-w-md mx-auto bg-white shadow-lg rounded-xl border border-gray-100">
      <CardHeader className="space-y-1 text-center bg-gradient-to-r from-rose-50 to-pink-50 rounded-t-xl pb-4">
        <div className="mx-auto bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
          <HeartIcon className="w-6 h-6 text-rose-500" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">RSVP</CardTitle>
        <p className="text-sm text-gray-600">Harap beri tahu kami jika Anda dapat hadir</p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700 block">
            Apakah Anda akan hadir?
            </label>
            <RadioGroup
              value={attendance}
              onValueChange={setAttendance}
              className="grid grid-cols-2 gap-4"
            >
              <div className="relative">
                <RadioGroupItem
                  value="yes"
                  id="yes"
                  className="peer sr-only"
                />
                <label
                  htmlFor="yes"
                  className="flex flex-col items-center justify-between rounded-lg border-2 border-gray-200 p-4 hover:border-rose-400 peer-checked:border-rose-500 peer-checked:bg-rose-50 cursor-pointer transition-all"
                >
                  <span className="text-sm font-medium">Ya, saya akan berada di sana</span>
                </label>
              </div>
              <div className="relative">
                <RadioGroupItem
                  value="no"
                  id="no"
                  className="peer sr-only"
                />
                <label
                  htmlFor="no"
                  className="flex flex-col items-center justify-between rounded-lg border-2 border-gray-200 p-4 hover:border-gray-400 peer-checked:border-gray-500 peer-checked:bg-gray-50 cursor-pointer transition-all"
                >
                  <span className="text-sm font-medium">Maaf, saya tidak bisa hadir</span>
                </label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <label htmlFor="komentar" className="text-sm font-medium text-gray-700 block">
            Tinggalkan Pesan (Opsional)
            </label>
            <Textarea
              id="komentar"
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              placeholder="Share your wishes or message..."
              className="min-h-[100px] resize-none border-gray-200 focus:border-rose-500 focus:ring-rose-500"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </div>
            ) : (
              'Submit RSVP'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}