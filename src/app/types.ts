export interface LayoutProps {
  children: React.ReactNode
}

export interface PageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
} 
