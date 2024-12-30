
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Users } from 'lucide-react'
import Swal from 'sweetalert2'
import { Wedding } from '@/types/wedding';


interface PageProps {
  params: {
    id: string
  }
}

export default function EditGuest({ params }: PageProps) {
  const [loading, setLoading] = useState(false)
  const [weddings, setWeddings] = useState<Wedding[]>([])
  const [formData, setFormData] = useState({
    weddingId: '',
    name: '',
    email: '',
    slug: '',
  })

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

  const router = useRouter()
  const { id } = params // Ambil ID dari params
  // Fetch weddings owned by the user
  useEffect(() => {
    async function fetchGuests() {
      if (!id) return
      try {
        setLoading(true)
        const response = await fetch(`/api/guests/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch Guests details')
        }
        const data = await response.json()
        setFormData({
          weddingId: data.weddingId || '',
          name: data.name || '',
          email: data.email || '',
          slug: data.slug || '',
        })
      } catch (error) {
        console.error('Error fetching guests:', error)
        Swal.fire('Error', 'Failed to fetch guest data', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchGuests()
  }, [id])

  async function UpdateGuestWeddings(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/guests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add Guest details');
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Guest details Updated successfully',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      }).then(() => {
        router.push('/admin/guests')
      })
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to add guest details', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Edit</h1>
          <p className="text-gray-600">Edit guest details to the system</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Update Guest Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={UpdateGuestWeddings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="weddingId">Wedding</Label>
                  <select
                    id="weddingId"
                    name="weddingId"
                    value={formData.weddingId}
                    onChange={(e) => setFormData({ ...formData, weddingId: e.target.value })}
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
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Enter guest email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="wedding-url-slug"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full"
                  pattern="[a-z0-9-]+"
                  title="Only lowercase letters, numbers, and hyphens are allowed"
                />
                <p className="text-sm text-gray-500">
                  This will be used in the wedding invitation URL
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
                  'Add Guest Details'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
