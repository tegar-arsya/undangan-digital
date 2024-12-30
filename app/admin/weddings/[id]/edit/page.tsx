'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import Swal from 'sweetalert2'

// Tambahkan interface params
interface PageProps {
  params: {
    id: string
  }
}

export default function EditWedding({ params }: PageProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    date: '',
    time: '',
    location: '',
    slug: '',
  })
  
  const router = useRouter()
  const { id } = params // Ambil ID dari params

  useEffect(() => {
    async function fetchWeddingDetails() {
      if (!id) return

      try {
        setLoading(true)
        const response = await fetch(`/api/weddings/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch wedding details')
        }

        const data = await response.json()
        
        // Format date untuk input type="date"
        const formattedDate = data.date ? new Date(data.date).toISOString().split('T')[0] : ''
        
        setFormData({
          brideName: data.brideName || '',
          groomName: data.groomName || '',
          date: formattedDate,
          time: data.time || '',
          location: data.location || '',
          slug: data.slug || '',
        })
      } catch (error) {
        console.error('Error fetching wedding details:', error)
        Swal.fire('Error', 'Failed to load wedding details', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchWeddingDetails()
  }, [id])

  async function updateWeddingDetails(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/weddings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update wedding details')
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Wedding details updated successfully',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      }).then(() => {
        router.push('/admin/weddings')
      })
    } catch (error) {
      console.error('Error updating wedding:', error)
      Swal.fire('Error', 'Failed to update wedding details', 'error')
    } finally {
      setLoading(false)
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Wedding Details</h1>
          <p className="text-gray-600">Update wedding details in the system</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Edit Wedding Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateWeddingDetails} className="space-y-6">
              {/* Form fields remain the same */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bridename">Bride Name</Label>
                  <Input
                    id="bridename"
                    name="bridename"
                    value={formData.brideName}
                    onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                    placeholder="Enter bride's name"
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomname">Groom Name</Label>
                  <Input
                    id="groomname"
                    name="groomname"
                    value={formData.groomName}
                    onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                    placeholder="Enter groom's name"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Wedding Date
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Wedding Time
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Venue Location
                </Label>
                <Textarea
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter wedding venue details"
                  required
                  className="w-full min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="wedding-url-slug"
                  required
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
                  'Update Wedding Details'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}