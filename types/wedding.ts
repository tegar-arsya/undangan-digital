export interface Wedding {
    id: string
    brideName: string
    groomName: string
    date: string
    time: string
    location: string
    slug: string
  }
  
  export interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
  export interface Background {
    id: string;
    weddingId: string;
    name: string;
    gambar: string;
  }
  
  export interface Guest {
    id: string
    weddingId: string
    name: string
    email: string
    slug: string
  }

  export interface WeddingPhoto {
    id: string;
    weddingId: string;
    name: string;
    photoUrl: string;
  }