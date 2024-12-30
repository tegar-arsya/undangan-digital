import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

interface Wedding {
    id: string;
    brideName: string;
    groomName: string;
    date: string;
    location: string;
  }
  
export function useWeddings(initialWeddings: Wedding[]) {
  const [weddings, setWeddings] = useState(initialWeddings)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/weddings/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to delete the wedding')
        }

        setWeddings(weddings.filter(wedding => wedding.id !== id))
        Swal.fire(
          'Deleted!',
          'The wedding has been deleted.',
          'success'
        )
        router.refresh()
      } catch (error) {
        console.error('Error deleting wedding:', error)
        Swal.fire(
          'Error!',
          error instanceof Error ? error.message : 'Failed to delete the wedding.',
          'error'
        )
      }
    }
  }

  return { weddings, handleDelete }
}

