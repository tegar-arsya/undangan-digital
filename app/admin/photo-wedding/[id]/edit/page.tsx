'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ImageIcon } from 'lucide-react'
import Swal from 'sweetalert2'
import { Wedding } from '@/types/wedding'
import { WeddingPhoto } from '@/types/weddingphoto'

export default function EditPhotoWeddings({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false)
  const [weddings, setWeddings] = useState<Wedding[]>([])
  const [photowedding, setPhotowedding] = useState<WeddingPhoto | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const [weddingsResponse, photoweddingResponse] = await Promise.all([
          fetch('/api/weddings'),
          fetch(`/api/photo-weddings/${params.id}`)
        ])

        if (!weddingsResponse.ok) {
          throw new Error(`Failed to fetch weddings: ${weddingsResponse.statusText}`)
        }
        if (!photoweddingResponse.ok) {
          throw new Error(`Failed to fetch Photo wedding: ${photoweddingResponse.statusText}`)
        }

        const weddingsData = await weddingsResponse.json()
        const photoweddingData = await photoweddingResponse.json()

        setWeddings(weddingsData)
        setPhotowedding(photoweddingData)
      } catch (error) {
        console.error('Error fetching data:', error)
        Swal.fire('Error', `Failed to fetch data: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      }
    }

    fetchData()
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(formRef.current as HTMLFormElement)

    try {
      const response = await fetch(`/api/photo-weddings/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update Photo wedding details')
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Photo Wedding details updated successfully',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      }).then(() => {
        router.push('/admin/photo-wedding')
      })
    } catch (error) {
      console.error('Error updating Photo wedding:', error)
      Swal.fire('Error', `Failed to update Photo wedding details: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!photowedding) {
    return <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin text-4xl">⏳</div>
  </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Wedding Photo</h1>
          <p className="text-gray-600">Update Wedding Photo details</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-primary" />
              Edit Photo Wedding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="weddingId">Wedding</Label>
                  <select
                    id="weddingId"
                    name="weddingId"
                    required
                    className="w-full border rounded px-3 py-2"
                    defaultValue={photowedding.weddingId}
                  >
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
                    placeholder="Enter background name"
                    required
                    className="w-full"
                    defaultValue={photowedding.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gambar">Gambar</Label>
                  <Input
                    id="gambar"
                    multiple
                    name="gambar"
                    type="file"
                    accept="image/*"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Image</Label>
                  <div className="relative w-full h-48">
                    <Image 
                      src={photowedding.gambar} 
                      alt="Current background" 
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Supported formats: JPEG, PNG. Leave empty to keep the current image.
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
                  'Update Background'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

