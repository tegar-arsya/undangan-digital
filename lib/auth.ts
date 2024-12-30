import jwt from 'jsonwebtoken'

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    return decoded.userId
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

