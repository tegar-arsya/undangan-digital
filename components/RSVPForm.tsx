'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function RSVPForm({ weddingId }: { weddingId: string }) {
  const [name, setName] = useState('')
  const [attendance, setAttendance] = useState('yes')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weddingId,
          name,
          attendance: attendance === 'yes',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit RSVP')
      }

      alert('RSVP submitted successfully!')
      setName('')
      setAttendance('yes')
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      alert('Failed to submit RSVP. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <h2 className="text-2xl font-bold">RSVP</h2>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <RadioGroup value={attendance} onValueChange={setAttendance}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="yes" />
          <Label htmlFor="yes">Yes, I will be there</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="no" />
          <Label htmlFor="no">No, I cant make it</Label>
        </div>
      </RadioGroup>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
      </Button>
    </form>
  )
}