'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Users } from 'lucide-react'
import Swal from 'sweetalert2'
import { Wedding } from '@/types/wedding';

export default function GuestWeddings() {
  const [loading, setLoading] = useState(false)
  const [weddings, setWeddings] = useState<Wedding[]>([])
  const formRef = useRef(null)
  const router = useRouter()

  // Fetch weddings owned by the user
  useEffect(() => {
    async function fetchWeddings() {
      try {
        const response = await fetch('/api/weddings')
        if (!response.ok) {
          throw new Error('Failed to fetch weddings')
        }
        const data = await response.json()
        setWeddings(data)
      } catch (error) {
        console.error('Error fetching weddings:', error)
        Swal.fire('Error', 'Failed to fetch wedding data', 'error')
      }
    }

    fetchWeddings()
  }, [])

  async function AddGuestWeddings(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const weddingId = formData.get('weddingId') as string;

    if (!weddingId) {
      Swal.fire('Error', 'Please select a wedding', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/photo-weddings', {
        method: 'POST',
        body: formData, // Send formData directly
      });

      if (!response.ok) {
        throw new Error('Failed to add Guest details');
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'photo wedding details added successfully',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      }).then(() => {
        router.push('/admin/photo-wedding')
      })
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to add guest details', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wedding photo Management</h1>
          <p className="text-gray-600">Add new Background details to the system</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              New wedding Photo Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={AddGuestWeddings} ref={formRef} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="weddingId">Wedding</Label>
                  <select
                    id="weddingId"
                    name="weddingId"
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="" disabled selected>Select a wedding</option>
                    {weddings.map((wedding) => (
                      <option key={wedding.id} value={wedding.id}>
                        {`${wedding.brideName} & ${wedding.groomName}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter guest name"
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photoUrl">photoUrl</Label>
                  <Input
                    id="photoUrl"
                    name="photoUrl"
                    type="file"
                    accept="image/*"
                    multiple
                    required
                    className="w-full"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Supported formats: JPEG, PNG
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Processing...
                  </span>
                ) : (
                  'Add Photo Wedding'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
