'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import Swal from 'sweetalert2'

export default function AdminPriceList() {
  const [loading, setLoading] = useState(false)
  const formRef = useRef(null)
  const router = useRouter()

  async function addPriceItem(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const newItem = {
      brideName: formData.get('bridename') as string,
      groomName: formData.get('groomname') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      location: formData.get('location') as string,
      slug: formData.get('slug') as string,
    }

    try {
      const response = await fetch('/api/weddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error('Failed to add wedding details');
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Wedding details added successfully',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      }).then(() => {
        router.push('/admin/weddings')
      })
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to add wedding details', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wedding Management</h1>
          <p className="text-gray-600">Add new wedding details to the system</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              New Wedding Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addPriceItem} ref={formRef} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bride_name">Bride Name</Label>
                  <Input
                    id="bridename"
                    name="bridename"
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
                  'Add Wedding Details'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}