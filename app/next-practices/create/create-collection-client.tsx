"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { Button } from "@/app/ui/components/Button"
import { useRouter, useSearchParams } from "next/navigation"
import TiptapEditor from "@/app/ui/components/Editor/TiptapEditor"
import { CheckCircle2, Upload } from "lucide-react"
import { useSharedState } from "@/app/ui/components/SharedState/Context"

interface Collection {
  id: string
  slug: string
  title: string
  description: string
  content: string
  mainImage?: string
  sections?: any[]
  boards?: string[]
}

interface Board {
  id: string
  title: string
  description?: string
}

const STORAGE_KEY = "collections"
const RESERVED_SLUGS = ["create", "edit", "list", "admin", "api"]

export default function CreateCollectionClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams?.get("edit")

  const [step, setStep] = useState<number>(1)
  const [isEditing, setIsEditing] = useState(!!editId)
  const [collectionId, setCollectionId] = useState<number | null>(null) // Track collection ID to prevent duplication
  const [slug, setSlug] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [mainImage, setMainImage] = useState("")
  const [slugExists, setSlugExists] = useState<boolean | null>(null)
  const [checkingSlug, setCheckingSlug] = useState(false)
  const [originalSlug, setOriginalSlug] = useState<string | null>(null)
  const [slugCheckError, setSlugCheckError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [publishMessage, setPublishMessage] = useState<string | null>(null)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [autosaveStatus, setAutosaveStatus] = useState("")
  const [apiError, setApiError] = useState("")
  const [sectionsList, setSectionsList] = useState<any[]>([])
  const [collectionStatus, setCollectionStatus] = useState<string | null>(null)
  const [isRejected, setIsRejected] = useState(false)
  const [collectionCreatorUuid, setCollectionCreatorUuid] = useState<string | null>(null)
  const [isUnauthorized, setIsUnauthorized] = useState(false)
  const [existingHighlights, setExistingHighlights] = useState<any>(null)
  // Fetch public/published boards only from API
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBoards, setSelectedBoards] = useState<string[]>([])
  const [availableBoards, setAvailableBoards] = useState<Board[]>([])

  // External resources state
  const [externalResources, setExternalResources] = useState<Array<{title: string; description: string; url: string}>>([])
  const [newResourceTitle, setNewResourceTitle] = useState("")
  const [newResourceDescription, setNewResourceDescription] = useState("")
  const [newResourceUrl, setNewResourceUrl] = useState("")
  const [editingResourceIndex, setEditingResourceIndex] = useState<number | null>(null)
  const [showResourceForm, setShowResourceForm] = useState(false)

  const { sharedState } = useSharedState()
  const session = sharedState?.session || null
  const isAdmin = session?.rights >= 4

  const [imagePreviewUrl, setImagePreviewUrl] = useState("")
  const [uploadsInProgress, setUploadsInProgress] = useState<boolean>(false)
  const [mainImageUploadProgress, setMainImageUploadProgress] = useState<number | null>(null)
  const [itemUploadProgress, setItemUploadProgress] = useState<Record<string, number>>({})

  // Prevent unloading/navigating away while uploads are in progress
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (uploadsInProgress) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
      return undefined
    }
    if (typeof window !== 'undefined') {
      if (uploadsInProgress) window.addEventListener('beforeunload', handler)
      else window.removeEventListener('beforeunload', handler)
    }
    return () => { if (typeof window !== 'undefined') window.removeEventListener('beforeunload', handler) }
  }, [uploadsInProgress])

  useEffect(() => {
    // Load collection for editing from server by slug (editId is expected to be slug)
    if (!editId) return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`/api/collections?slug=${encodeURIComponent(editId)}`)
        if (!mounted) return
        if (res.ok) {
          const data = await res.json()
          console.log('Loaded collection for edit:', data)
          
          // Check if collection is rejected
          const status = data.highlights?.status || null
          setCollectionStatus(status)
          setIsRejected(status === 'rejected')
          
          // Store existing highlights to preserve them
          setExistingHighlights(data.highlights || null)
          
          // Check authorization - user must be creator or admin
          const creatorUuid = data.highlights?.creator_uuid || null
          setCollectionCreatorUuid(creatorUuid)
          
          const isCreator = session?.uuid && creatorUuid === session.uuid
          const isAdmin = session?.rights >= 4
          
          if (!isCreator && !isAdmin) {
            setIsUnauthorized(true)
            // Redirect to unauthorized page after a brief delay
            setTimeout(() => {
              router.push('/unauthorized')
            }, 1000)
            return
          }
          
          setCollectionId(data.id || null) // Capture collection ID
          setSlug(data.slug || "")
          setTitle(data.title || "")
          setDescription(data.description || "")
          setContent(data.content || "")
          setMainImage(data.main_image || "")
          setImagePreviewUrl(data.main_image || "")
          setSectionsList(data.sections || [])
          setSelectedBoards((data.boards || []).map((b: any) => String(b)))
          setExternalResources(data.external_resources || [])
          setOriginalSlug(data.slug || null)
        } else {
          console.warn('Could not load collection for edit:', editId)
        }
      } catch (e) {
        console.error('Failed to load collection for edit', e)
      }
    })()
    return () => { mounted = false }
  }, [editId, session, router])

  // server-backed slug availability check (debounced). Respects reserved slugs and the original slug when editing.
  useEffect(() => {
    const doCheck = async (value: string) => {
      setSlugCheckError(null)
      if (!value.trim()) {
        setSlugExists(null)
        setCheckingSlug(false)
        return
      }

      const normalized = value.trim().toLowerCase()
      if (RESERVED_SLUGS.includes(normalized)) {
        setSlugExists(true)
        setCheckingSlug(false)
        return
      }

      // if editing and slug is unchanged, it's available
      if (originalSlug && originalSlug === normalized) {
        setSlugExists(false)
        setCheckingSlug(false)
        return
      }

      try {
        const res = await fetch(`/api/collections?slug=${encodeURIComponent(normalized)}`)
        if (res.ok) {
          const data = await res.json()
          // server returns collection if exists
          setSlugExists(!!data && Object.keys(data).length > 0)
        } else if (res.status === 404) {
          setSlugExists(false)
        } else {
          // non-OK response - treat as unknown but surface error
          setSlugCheckError('Could not verify slug availability')
          setSlugExists(null)
        }
      } catch (e) {
        console.error('Slug check failed', e)
        setSlugCheckError('Could not verify slug availability')
        setSlugExists(null)
      } finally {
        setCheckingSlug(false)
      }
    }

    setCheckingSlug(true)
    const timer = setTimeout(() => doCheck(slug), 350)
    return () => {
      clearTimeout(timer)
      setCheckingSlug(false)
    }
  }, [slug, originalSlug])

  // Helper to perform a server save (used by autosave and explicit save). Returns true if ok.
  const autosaveToServer = async (): Promise<boolean> => {
    // Do not autosave unless required fields are present and slug is available
    if (!slug.trim() || !title.trim() || slugExists === true || mainImage.trim() === "") return false
    if (isRejected) return false
    try {
      setAutosaveStatus('Saving...')
      
      // When saving changes to a published collection, change status to draft
      // so changes don't go live until user explicitly clicks "Update Live Page"
      let modifiedHighlights = existingHighlights;
      if (isEditing && existingHighlights && (existingHighlights.status === 'published' || existingHighlights.published === true)) {
        modifiedHighlights = {
          ...existingHighlights,
          status: 'draft',
          published: false,
          awaiting_review: false,
          // Preserve creator information
          submitted_by: existingHighlights.submitted_by,
          creator_uuid: existingHighlights.creator_uuid,
        };
      }
      
      const payload = {
        ...(collectionId && { id: collectionId }), // Include ID if we have it to update instead of create
        slug: slug.trim(),
        title: title.trim(),
        description,
        content: content || null,
        main_image: mainImage || null,
        sections: sectionsList || [],
        // Use modified highlights that set status to draft for published collections
        ...(modifiedHighlights && { highlights: modifiedHighlights }),
        boards: selectedBoards.map((id) => Number(id)).filter((n) => Number.isFinite(n)),
        external_resources: externalResources,
      }

      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        if (res.status === 400) {
          setApiError(data?.message || data?.error || 'Validation error saving collection')
        } else if (res.status === 401) {
          setApiError('Unauthorized: please sign in')
        } else {
          setApiError(data?.message || data?.error || 'Failed to save to server')
        }
        setAutosaveStatus('Failed')
        return false
      }

      // success - capture collection ID from response
      const data = await res.json().catch(() => ({}))
      if (data?.id && !collectionId) {
        setCollectionId(data.id) // Store ID after first save
        setIsEditing(true) // Now we're editing an existing collection
      }
      setApiError("")
      setAutosaveStatus('Saved')
      // clear saved indicator after a short delay
      setTimeout(() => setAutosaveStatus(''), 2000)
      return true
    } catch (e) {
      console.error('Autosave failed', e)
      setApiError('Failed to save to server')
      setAutosaveStatus('Failed')
      return false
    }
  }

  // Autosave disabled - users must explicitly click Save
  // useEffect(() => {
  //   // Require slug, title and main image AND require slug availability check to have completed and returned available
  //   const fieldsReady = slug.trim() !== '' && title.trim() !== '' && mainImage.trim() !== '' && slugExists === false && checkingSlug === false
  //   if (!fieldsReady) return
  //   const timer = setTimeout(() => {
  //     void autosaveToServer()
  //   }, 2000)
  //   return () => clearTimeout(timer)
  // // include checkingSlug so autosave waits for the completion of slug check
  // }, [slug, title, description, content, mainImage, JSON.stringify(sectionsList), selectedBoards.join(','), slugExists, checkingSlug])

  // determine if user can proceed: slug and title present, slug not taken, and main image provided
  const canProceed = slug.trim() !== "" && title.trim() !== "" && slugExists !== true && mainImage.trim() !== ""

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (isRejected) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setApiError('Image file too large. Maximum size is 10MB.')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setApiError('Please select a valid image file.')
      return
    }

    const doUpload = async () => {
      setUploadsInProgress(true)
      setMainImageUploadProgress(0)
      setApiError('')
      
      try {
        // Create FormData for server upload
        const formData = new FormData()
        formData.append('file', file)
        
        // Upload to our server endpoint which handles Azure upload
        const uploadUrl = '/api/uploads/server'
        
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          let errorData: any = {}
          try {
            errorData = JSON.parse(errorText)
          } catch {
            // Failed to parse as JSON, use text
          }
          throw new Error(errorData.error || `Server upload failed: ${response.status} - ${errorText}`)
        }
        
        const data = await response.json()
        
        if (!data.blobUrl) {
          throw new Error('No blob URL received from server')
        }
        
        // Simulate progress for better UX
        setMainImageUploadProgress(25)
        await new Promise(resolve => setTimeout(resolve, 100))
        setMainImageUploadProgress(50)
        await new Promise(resolve => setTimeout(resolve, 100))
        setMainImageUploadProgress(75)
        await new Promise(resolve => setTimeout(resolve, 100))
        setMainImageUploadProgress(100)
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Set the uploaded image
        setMainImage(data.blobUrl)
        setImagePreviewUrl(data.blobUrl)
        setMainImageUploadProgress(null)
        
      } catch (e) {
        console.error('Azure upload failed:', e)
        const errorMessage = e instanceof Error ? e.message : 'Unknown upload error'
        setApiError(`Image upload failed: ${errorMessage}. Please try again.`)
        setMainImageUploadProgress(null)
      } finally {
        setUploadsInProgress(false)
      }
    }
    void doUpload()
  }

  const handleItemImageUpload = (sectionIdx: number, itemIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (isRejected) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setApiError('Image file too large. Maximum size is 10MB.')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setApiError('Please select a valid image file.')
      return
    }

    const doUpload = async () => {
      setUploadsInProgress(true)
      const id = `${sectionIdx}-${itemIdx}`
      setItemUploadProgress((p) => ({ ...p, [id]: 0 }))
      setApiError('')
      
      try {
        // Create FormData for server upload
        const formData = new FormData()
        formData.append('file', file)
        
        // Upload to our server endpoint
        const uploadUrl = '/api/uploads/server'
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          let errorData: any = {}
          try {
            errorData = JSON.parse(errorText)
          } catch {
            // Failed to parse as JSON, use text
          }
          throw new Error(errorData.error || `Server upload failed: ${response.status} - ${errorText}`)
        }
        
        const data = await response.json()
        
        if (!data.blobUrl) {
          throw new Error('No blob URL received from server')
        }
        
        // Simulate progress for UX
        setItemUploadProgress((p) => ({ ...p, [id]: 25 }))
        await new Promise(resolve => setTimeout(resolve, 50))
        setItemUploadProgress((p) => ({ ...p, [id]: 50 }))
        await new Promise(resolve => setTimeout(resolve, 50))
        setItemUploadProgress((p) => ({ ...p, [id]: 75 }))
        await new Promise(resolve => setTimeout(resolve, 50))
        setItemUploadProgress((p) => ({ ...p, [id]: 100 }))
        await new Promise(resolve => setTimeout(resolve, 50))
        
        // Update the section with uploaded image
        const newSections = [...sectionsList]
        newSections[sectionIdx].items[itemIdx].src = data.blobUrl
        setSectionsList(newSections)
        setItemUploadProgress((p) => {
          const np = { ...p }
          delete np[id]
          return np
        })
      } catch (e) {
        console.error('Image upload failed:', e)
        const errorMessage = e instanceof Error ? e.message : 'Unknown upload error'
        setApiError(`Image upload failed: ${errorMessage}. Please try again.`)
        // Clear the progress indicator on error
        setItemUploadProgress((p) => {
          const np = { ...p }
          delete np[id]
          return np
        })
      } finally {
        setUploadsInProgress(false)
      }
    }
    void doUpload()
  }

  const handleSaveBasics = async () => {
    if(isRejected) return
    if (uploadsInProgress) return setApiError('Uploads in progress, please wait')
    if (!canProceed) return
    setSaving(true)
    const ok = await autosaveToServer()
    setSaving(false)
    if (ok) setStep(2)
  }

  const handleSaveBasicsWithValidation = () => {
    if(isRejected) return
    // Placeholder for validation logic
    if (!canProceed) {
      // give a clearer message depending on what is missing
      if (!slug.trim() || !title.trim()) {
        setApiError('Slug and title are required.')
      } else if (slugExists === true) {
        setApiError('Slug is already taken. Choose another one.')
      } else if (!mainImage.trim()) {
        setApiError('Please upload a main image for the collection.')
      } else {
        setApiError('Please fill in all required fields.')
      }
      return
    }
    setApiError("")
    handleSaveBasics()
  }

  // Save changes without submitting for review or changing publish status
  const handleSaveChanges = async () => {
    if(isRejected) return
    if (saving) return
    if (uploadsInProgress) return setPublishError('Uploads in progress, please wait')
    setPublishMessage(null)
    setPublishError(null)
    setSaving(true)
    try {
      // When saving changes to a published collection, change status to draft
      // so changes don't go live until user explicitly clicks "Update Live Page"
      let modifiedHighlights = existingHighlights;
      if (isEditing && existingHighlights && (existingHighlights.status === 'published' || existingHighlights.published === true)) {
        modifiedHighlights = {
          ...existingHighlights,
          status: 'draft',
          published: false,
          awaiting_review: false,
          // Preserve creator information
          submitted_by: existingHighlights.submitted_by,
          creator_uuid: existingHighlights.creator_uuid,
        };
      }
      
      const payload = {
        ...(collectionId && { id: collectionId }), // Include ID to ensure we update the right collection
        slug: slug.trim(),
        title: title.trim(),
        description,
        content: content || null,
        main_image: mainImage || null,
        sections: sectionsList || [],
        // Use modified highlights that set status to draft for published collections
        ...(modifiedHighlights && { highlights: modifiedHighlights }),
        boards: selectedBoards.map((id) => Number(id)).filter((n) => Number.isFinite(n)),
        external_resources: externalResources,
        // Don't trigger review or publish - just save
      }
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      setSaving(false)
      if (!res.ok) {
        setPublishError(data?.message || data?.error || 'Failed to save changes')
        return
      }
      
      // Update local state to reflect the new draft status
      if (collectionStatus === 'published') {
        setCollectionStatus('draft')
        setPublishMessage('Changes saved as draft. Click "Update Live Page" to publish changes.')
      } else {
        setPublishMessage('Changes saved successfully!')
      }
      
      // Update existing highlights to reflect new status
      if (data?.highlights) {
        setExistingHighlights(data.highlights)
      }
      
      // Clear message after a delay
      setTimeout(() => setPublishMessage(null), 5000)
    } catch (e) {
      console.error('Save changes failed', e)
      setSaving(false)
      setPublishError('Failed to save changes')
    }
  }

  // Publish handler: explicit save + feedback + redirect
  const handleSubmitForReview = async () => {
    if(isRejected) return
    if (saving) return
    if (uploadsInProgress) return setPublishError('Uploads in progress, please wait')
    setPublishMessage(null)
    setPublishError(null)
    setSaving(true)
    try {
      const payload = {
        ...(collectionId && { id: collectionId }), // Include ID to ensure we update the right collection
        slug: slug.trim(),
        title: title.trim(),
        description,
        content: content || null,
        main_image: mainImage || null,
        sections: sectionsList || [],
        // Preserve existing highlights when editing, but they'll be updated by submit_for_review flag
        ...(existingHighlights && { highlights: existingHighlights }),
        boards: selectedBoards.map((id) => Number(id)).filter((n) => Number.isFinite(n)),
        external_resources: externalResources,
        // Explicitly request admin review/notification
        submit_for_review: true,
      }
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      setSaving(false)
      if (!res.ok) {
        setPublishError(data?.message || data?.error || 'Failed to submit for review')
        return
      }
      // server indicates needs_review true and may have returned slug
      if (data?.needs_review) {
        setPublishMessage('Collection submitted for review. An admin will review it shortly.')
      } else {
        setPublishMessage('Collection saved.')
      }
      // redirect to preview page after a short delay
      setTimeout(() => {
        try { window.location.href = `/next-practices/${data?.slug || slug}` } catch (e) { router.push(`/next-practices/${data?.slug || slug}`) }
      }, 1200)
    } catch (e) {
      console.error('Submit for review failed', e)
      setSaving(false)
      setPublishError('Failed to submit for review')
    }
  }

  // Admin publish handler: direct publish without review
  const handleAdminPublish = async () => {
    if(isRejected) return
    if (saving) return
    if (uploadsInProgress) return setPublishError('Uploads in progress, please wait')
    
    // Client-side admin check for better UX
    if (!isAdmin) {
      setPublishError('You do not have permission to publish collections directly. Please submit for review instead.')
      return
    }
    
    setPublishMessage(null)
    setPublishError(null)
    setSaving(true)
    try {
      const payload = {
        ...(collectionId && { id: collectionId }), // Include ID to ensure we update the right collection
        slug: slug.trim(),
        title: title.trim(),
        description,
        content: content || null,
        main_image: mainImage || null,
        sections: sectionsList || [],
        // For admin publish, set as published directly
        highlights: {
          ...(existingHighlights || {}),
          published: true,
          status: "published",
          submitted_by: session?.name || session?.uuid || null,
          creator_uuid: session?.uuid || null,
          published_at: new Date().toISOString()
        },
        boards: selectedBoards.map((id) => Number(id)).filter((n) => Number.isFinite(n)),
        external_resources: externalResources,
        // No review needed for admin
        admin_publish: true,
      }
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      setSaving(false)
      if (!res.ok) {
        // Handle specific error messages from backend validation
        if (res.status === 403) {
          setPublishError('You do not have administrator privileges to publish collections directly.')
        } else {
          setPublishError(data?.message || data?.error || 'Failed to publish collection')
        }
        return
      }
      setPublishMessage('Collection published successfully!')
      // redirect to preview page after a short delay
      setTimeout(() => {
        try { window.location.href = `/next-practices/${data?.slug || slug}` } catch (e) { router.push(`/next-practices/${data?.slug || slug}`) }
      }, 1200)
    } catch (e) {
      console.error('Admin publish failed', e)
      setSaving(false)
      setPublishError('Failed to publish collection')
    }
  }

  const handlePreview = () => {
    if (!slug.trim()) {
      alert("Enter a slug to preview")
      return
    }
    // open preview in a new tab/window
    try {
      window.open(`/next-practices/${slug}`, '_blank')
    } catch (e) {
      router.push(`/next-practices/${slug}`)
    }
  }

  const addSection = () => {
    setSectionsList([...sectionsList, { title: "", items: [] }])
  }

  const updateSection = (idx: number, section: any) => {
    const newSections = [...sectionsList]
    newSections[idx] = section
    setSectionsList(newSections)
  }

  const removeSection = (idx: number) => {
    const newSections = [...sectionsList]
    newSections.splice(idx, 1)
    setSectionsList(newSections)
  }

  const addItemToSection = (sectionIdx: number, type?: string) => {
    const newSections = [...sectionsList]
    newSections[sectionIdx].items = [
      ...(newSections[sectionIdx].items || []),
      { type: type || "txt", txt: "", items: [], src: "" },
    ]
    setSectionsList(newSections)
  }

  const updateItemInSection = (sectionIdx: number, itemIdx: number, item: any) => {
    const newSections = [...sectionsList]
    newSections[sectionIdx].items[itemIdx] = item
    setSectionsList(newSections)
  }

  const removeItemFromSection = (sectionIdx: number, itemIdx: number) => {
    const newSections = [...sectionsList]
    newSections[sectionIdx].items.splice(itemIdx, 1)
    setSectionsList(newSections)
  }

  const moveSectionUp = (idx: number) => {
    if (idx === 0) return
    const newSections = [...sectionsList]
    const temp = newSections[idx]
    newSections[idx] = newSections[idx - 1]
    newSections[idx - 1] = temp
    setSectionsList(newSections)
  }

  const moveSectionDown = (idx: number) => {
    if (idx === sectionsList.length - 1) return
    const newSections = [...sectionsList]
    const temp = newSections[idx]
    newSections[idx] = newSections[idx + 1]
    newSections[idx + 1] = temp
    setSectionsList(newSections)
  }

  const moveExternalResourceUp = (idx: number) => {
    if (idx === 0) return
    const newResources = [...externalResources]
    const temp = newResources[idx]
    newResources[idx] = newResources[idx - 1]
    newResources[idx - 1] = temp
    setExternalResources(newResources)
  }

  const moveExternalResourceDown = (idx: number) => {
    if (idx === externalResources.length - 1) return
    const newResources = [...externalResources]
    const temp = newResources[idx]
    newResources[idx] = newResources[idx + 1]
    newResources[idx + 1] = temp
    setExternalResources(newResources)
  }

  // Fetch published boards from API. Always loads 10 most recent published boards.
  // When searching, searches title and description in the database.
  const fetchAvailableBoards = async (q?: string) => {
    try {
      const trimmed = (q || "").trim()
      // Always fetch published boards only, limit to 10, ordered by most recent (DESC)
      // Include page=1 to ensure the limit is applied by the API
      let url = "/api/pinboards?space=published&limit=10&page=1"
      if (trimmed && trimmed.length >= 2) {
        // Search title and description in database
        url = `/api/pinboards?space=published&search=${encodeURIComponent(trimmed)}&limit=10&page=1`
      }
      const res = await fetch(url)
      if (res.ok) {
        const result = await res.json()
        // API returns {count, data} for multiple boards
        const data = result?.data || result || []
        const boards = (Array.isArray(data) ? data : []).map((b: any) => ({ 
          ...b, 
          id: String(b.pinboard_id || b.id) // Use pinboard_id as the primary ID, fallback to id
        }))
        setAvailableBoards(boards)
      } else {
        setAvailableBoards([])
      }
    } catch (e) {
      console.error('Board search failed', e)
      setAvailableBoards([])
    }
  }

  // Load initial boards on mount
  useEffect(() => {
    fetchAvailableBoards("")
  }, [])

  // Fetch boards when search term changes
  useEffect(() => {
    // Always fetch public boards. If query is short, this will load the default first 10.
    fetchAvailableBoards(searchTerm)
  }, [searchTerm])

  // Show unauthorized message while redirecting
  if (isUnauthorized) {
    return (
      <div className="max-w-6xl mx-auto py-10">
        <div className="mb-8 border-2 border-red-600 bg-red-50 p-6 rounded">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">!</span>
            </div>
            <h2 className="text-xl font-bold text-red-800">Unauthorized Access</h2>
          </div>
          <p className="text-red-800 mb-4">
            You don't have permission to edit this collection. Only the creator or administrators can edit collections.
          </p>
          <p className="text-red-600 text-sm">Redirecting to unauthorized page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* Rejected Collection Warning */}
      {isRejected && (
        <div className="mb-8 border-2 border-red-600 bg-red-50 p-6 rounded">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">!</span>
            </div>
            <h2 className="text-xl font-bold text-red-800">Collection Rejected</h2>
          </div>
          <p className="text-red-800 mb-4">
            This collection has been rejected by an administrator and cannot be edited. 
            Please review the feedback comments and create a new collection with the necessary improvements.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => router.push(`/next-practices/${editId}`)}
              className="text-red-600"
            >
              View Feedback
            </Button>
            <Button 
              onClick={() => router.push('/next-practices/create')}
            >
              Create New Collection
            </Button>
          </div>
        </div>
      )}
      
      {/* Page Header */}
      {!isRejected && (
        <div className="mb-3">
          <div className="mb-0 inline-block px-2">
            <h1 className="text-4xl mb-2 font-bold">
              <>{isEditing ? "Edit" : "Create"} </>
              <span className="slanted-bg yellow">
                <span>Collection</span>
              </span>
            </h1>
          </div>
          <p className="text-gray-700 max-w-2xl">
            Build a curated collection of content and boards to showcase solutions for sustainable development goals
          </p>
        </div>
      )}

      <div className="font-space-mono">
        {/* Step Indicator - IMPROVED ALIGNMENT */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Collection Details", completed: step > 1 },
              { num: 2, label: "Review & Publish", completed: false },
            ].map((s, idx, arr) => (
              <div key={s.num} className="flex items-center flex-1 last:flex-none">
                {/* Step Circle and Label */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center h-14 w-14 rounded-full border-[3px] font-bold text-xl transition-all ${
                      step >= s.num
                        ? "bg-[#0072bc] border-[#0072bc] text-white shadow-lg"
                        : "bg-white border-gray-300 text-gray-500"
                    }`}
                  >
                    {s.completed ? <CheckCircle2 className="h-7 w-7" /> : s.num}
                  </div>
                  <p
                    className={`mt-3 text-sm font-bold text-center whitespace-nowrap ${
                      step >= s.num ? "text-black" : "text-gray-500"
                    }`}
                  >
                    {s.label}
                  </p>
                </div>

                {/* Connector Line - only between steps */}
                {idx < arr.length - 1 && (
                  <div className="flex-1 mx-6 relative">
                    <div className="h-1 w-full bg-gray-200 rounded-full" />
                    <div
                      className={`absolute top-0 left-0 h-1 rounded-full transition-all duration-500 ${
                        step > s.num ? "bg-[#0072bc] w-full" : "bg-[#0072bc] w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {apiError && (
          <div className="mb-8 border-2 border-red-500 bg-red-50 p-4 rounded">
            <p className="text-red-800 font-semibold">Error: {apiError}</p>
          </div>
        )}
        
        {/* Rejected Collection Form Overlay */}
        {isRejected && (
          <div className="mb-8 border-2 border-red-600 bg-red-50 p-6 rounded">
            <p className="text-red-800 font-semibold mb-4">
              This collection has been rejected and cannot be edited. Please create a new collection.
            </p>
          </div>
        )}

        {/* Step 1: Collection Details and Content */}
        {step === 1 && (
          <div className="space-y-8 border-[1px] border-black border-solid bg-white p-8">
            {/* Collection Basics Card */}
            <div className="px-4 border-2 border-black bg-white">
              <div className="border-b-2 border-black bg-[#f9f9f9] px-6 py-2">
                <h2 className="text-2xl font-bold">Basic Information</h2>
                <p className="text-sm text-gray-700">
                    <strong>Tip:</strong> Create a unique slug, compelling title, and choose a representative image that
                    will be used as the collection's thumbnail.
                  </p>
              </div>
              <div className="py-8 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-bold text-gray-900 mb-2">Collection Slug *</label>
                    <p className="text-xs text-gray-600 mb-3">{isEditing ? 'Slug cannot be changed when editing' : 'URL-friendly name (e.g., circular-economy)'}</p>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      placeholder="circular-economy"
                      disabled={isRejected || isEditing}
                      className={`w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-[#0072bc] focus:ring-offset-2 font-mono text-sm ${isRejected || isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                    <div className="mt-2 min-h-5">
                      <span className="inline-block px-2 py-0.5 text-xs rounded font-semibold mr-2">
                        {checkingSlug ? 'Checking…' : slugExists === null ? 'Unknown' : slugExists ? 'Taken' : 'Available'}
                      </span>
                      {checkingSlug && <p className="text-xs text-gray-600 inline">Checking availability...</p>}
                      {slugExists && <p className="text-xs text-red-600 font-semibold inline ml-2">This slug is already in use</p>}
                      {slugExists === false && slug && (
                        <p className="text-xs text-green-600 font-semibold inline ml-2">Available ✓</p>
                      )}
                       {slugCheckError && <p className="text-xs text-red-600 font-semibold">{slugCheckError}</p>}
                     </div>
                   </div>

                  <div>
                    <label className="block font-bold text-gray-900 mb-2">Collection Title *</label>
                    <p className="text-xs text-gray-600 mb-3">The main heading for your collection</p>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Circular Economy Solutions"
                      disabled={isRejected}
                      className={`w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-[#0072bc] ${isRejected ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>

                {/* Main Image Upload */}
                <div>
                  <label className="block font-bold text-gray-900 mb-2">Main Image *</label>
                  <p className="text-xs text-gray-600 mb-3">This image will be displayed as the collection thumbnail</p>
                  <div className="border-2 border-dashed border-[#0072bc] p-8 rounded bg-blue-50 text-center cursor-pointer hover:bg-blue-100 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadsInProgress || isRejected}
                    />
                    <label htmlFor="image-upload" className={`flex flex-col items-center gap-3 ${isRejected ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                      <Upload className={`h-8 w-8 ${isRejected ? 'text-gray-400' : 'text-[#0072bc]'}`} />
                      <div>
                        <p className={`font-bold ${isRejected ? 'text-gray-400' : 'text-[#0072bc]'}`}>
                          {isRejected ? 'Upload disabled - Collection rejected' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-600">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </label>
                  </div>
                  {imagePreviewUrl && (
                    <div className="mt-4">
                      <p className="text-sm font-bold mb-2">Preview:</p>
                      <div className="flex items-start gap-4">
                        <div className="w-auto">
                          <img
                            src={imagePreviewUrl || "/placeholder.svg"}
                            alt="Preview"
                            className="h-32 w-auto object-cover border-2 border-black rounded"
                          />
                          {mainImageUploadProgress !== null && (
                            <div className="mt-2 w-48">
                              <div className="h-2 bg-gray-200 rounded">
                                <div className="h-2 bg-[#0072bc] rounded" style={{ width: `${mainImageUploadProgress}%` }} />
                              </div>
                              <p className="text-xs text-gray-600 mt-1">Uploading: {mainImageUploadProgress}%</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              if (!isRejected) {
                                setMainImage("")
                                setImagePreviewUrl("")
                              }
                            }}
                            className={`text-sm font-bold mt-2 ${isRejected ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-800'}`}
                            disabled={uploadsInProgress || isRejected}
                          >
                            Remove Image
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="border-2 border-black bg-white">
              <div className="border-b-2 border-black bg-[#f9f9f9] px-6 py-4">
                <h2 className="text-2xl font-bold">Collection Description</h2>
                <p className="text-sm text-gray-600">
                  Brief overview of what your collection covers and its impact
                </p>
              </div>
              <div className="py-4">
                <div className={`border-2 border-black bg-white ${isRejected ? 'pointer-events-none opacity-60' : ''}`}>
                  <TiptapEditor 
                    initialContent={description || ''} 
                    onChange={(html) => !isRejected && setDescription(html)} 
                    editable={!isRejected}
                  />
                </div>
              </div>
            </div>

            {/* Sections Card */}
            <div className="border-2 border-black bg-white">
              <div className="border-b-2 border-black bg-[#f9f9f9] px-6 py-4">
                <div className='flex items-center justify-between'>
                <h2 className="text-2xl font-bold">Content Sections</h2>
                <button
                  onClick={addSection}
                  disabled={isRejected}
                  className={`detach px-4 py-2 font-bold text-black transition ${isRejected ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:bg-yellow-400'}`}
                >
                  <span className="relative z-10">+ Add Section</span>
                </button>
                </div>
                <p className="text-sm text-gray-600">
                  Organize your content into sections to structure the collection body
                </p>
              </div>
              
              <div className="py-8 space-y-6">
                {sectionsList.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center">
                    <p className="text-gray-600">No sections yet. Add one to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sectionsList.map((sec, idx) => (
                      <div key={idx} className="border-2 border-gray-300 rounded p-4 bg-gray-50">
                        <div className="flex gap-2 mb-4">
                          {/* Reorder buttons */}
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => moveSectionUp(idx)}
                              disabled={isRejected || idx === 0}
                              className={`px-2 py-1 border-2 border-gray-400 text-gray-700 font-bold rounded text-xs ${isRejected || idx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                              title="Move up"
                            >
                              ▲
                            </button>
                            <button
                              onClick={() => moveSectionDown(idx)}
                              disabled={isRejected || idx === sectionsList.length - 1}
                              className={`px-2 py-1 border-2 border-gray-400 text-gray-700 font-bold rounded text-xs ${isRejected || idx === sectionsList.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                              title="Move down"
                            >
                              ▼
                            </button>
                          </div>
                          <input
                            className={`flex-1 border-2 border-black py-2 font-bold ${isRejected ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            placeholder="Section title"
                            value={sec.title || ""}
                            onChange={(e) => !isRejected && updateSection(idx, { ...sec, title: e.target.value })}
                            disabled={isRejected}
                          />
                          <button
                            onClick={() => removeSection(idx)}
                            disabled={isRejected}
                            className={`px-3 py-2 border-2 border-red-500 text-red-600 font-bold rounded ${isRejected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'}`}
                          >
                            Delete
                          </button>
                        </div>
                        <div className="space-y-3">
                          {sec.items &&
                            sec.items.map((item: any, itemIdx: number) => (
                              <div key={itemIdx} className="bg-white border-2 border-gray-300 py-3 rounded space-y-2">
                                {item.type === "txt" && (
                                  <div>
                                    <TiptapEditor
                                      initialContent={item.txt || ""}
                                      onChange={(html) => !isRejected && updateItemInSection(idx, itemIdx, { ...item, txt: html })}
                                      editable={!isRejected}
                                    />
                                  </div>
                                )}
                                {item.type === "list" && (
                                  <div className="space-y-2">
                                    {item.items &&
                                      item.items.map((li: any, liIdx: number) => (
                                        <input
                                          key={liIdx}
                                          type="text"
                                          value={li}
                                          onChange={(e) => {
                                            if (!isRejected) {
                                              const newList = [...item.items]
                                              newList[liIdx] = e.target.value
                                              updateItemInSection(idx, itemIdx, { ...item, items: newList })
                                            }
                                          }}
                                          placeholder="List item"
                                          disabled={isRejected}
                                          className={`w-full border-2 border-black p-2 ${isRejected ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        />
                                      ))}
                                    <button
                                      onClick={() => {
                                        if (!isRejected) {
                                          const newList = [...(item.items || []), ""]
                                          updateItemInSection(idx, itemIdx, { ...item, items: newList })
                                        }
                                      }}
                                      disabled={isRejected}
                                      className={`text-sm font-bold ${isRejected ? 'text-gray-400 cursor-not-allowed' : 'text-[#0072bc]'}`}
                                    >
                                      + Add item
                                    </button>
                                  </div>
                                )}
                                {item.type === "img" && (
                                  <div>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleItemImageUpload(idx, itemIdx, e)}
                                      className={`w-full border-2 border-black p-2 ${isRejected ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                      disabled={uploadsInProgress || isRejected}
                                    />
                                    {(() => {
                                      const id = `${idx}-${itemIdx}`
                                      const progress = itemUploadProgress[id]
                                      return (
                                        <div className="mt-2">
                                          {progress !== undefined ? (
                                            <div className="w-64">
                                              <div className="h-2 bg-gray-200 rounded">
                                                <div className="h-2 bg-[#0072bc] rounded" style={{ width: `${progress}%` }} />
                                              </div>
                                              <p className="text-xs text-gray-600 mt-1">Uploading: {progress}%</p>
                                            </div>
                                          ) : item.src ? (
                                            <img
                                              src={item.src || "/placeholder.svg"}
                                              alt="Section"
                                              className="mt-2 h-20 w-auto object-cover border-2 border-black rounded"
                                            />
                                          ) : null}
                                        </div>
                                      )
                                    })()}
                                  </div>
                                )}
                                <div className="flex gap-2 pt-2 border-t-2 border-gray-300">
                                  <button
                                    onClick={() => !isRejected && addItemToSection(idx, "txt")}
                                    disabled={isRejected}
                                    className={`text-xs px-2 py-1 border font-bold rounded ${isRejected ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' : 'bg-blue-100 border-[#0072bc] text-[#0072bc]'}`}
                                  >
                                    Text
                                  </button>
                                  <button
                                    onClick={() => !isRejected && addItemToSection(idx, "list")}
                                    disabled={isRejected}
                                    className={`text-xs px-2 py-1 border font-bold rounded ${isRejected ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' : 'bg-blue-100 border-[#0072bc] text-[#0072bc]'}`}
                                  >
                                    List
                                  </button>
                                  <button
                                    onClick={() => !isRejected && addItemToSection(idx, "img")}
                                    disabled={isRejected}
                                    className={`text-xs px-2 py-1 border font-bold rounded ${isRejected ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' : 'bg-blue-100 border-[#0072bc] text-[#0072bc]'}`}
                                  >
                                    Image
                                  </button>
                                  <button
                                    onClick={() => !isRejected && removeItemFromSection(idx, itemIdx)}
                                    disabled={isRejected}
                                    className={`text-xs ml-auto px-2 py-1 border font-bold rounded ${isRejected ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' : 'bg-red-100 border-red-500 text-red-600'}`}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          <button 
                            onClick={() => !isRejected && addItemToSection(idx)} 
                            disabled={isRejected}
                            className={`text-sm font-bold ${isRejected ? 'text-gray-400 cursor-not-allowed' : 'text-[#0072bc]'}`}
                          >
                            + Add item to section
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2">Community Curated Boards</label>
              <p className="text-sm text-gray-600 mb-4">
                Only public boards can be added to collections. Search public boards by title (min 2 chars).
              </p>
              {/* Search Input */}
              <div className="mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => !isRejected && setSearchTerm(e.target.value)}
                  placeholder="Search public boards by title (min 2 chars)"
                  disabled={isRejected}
                  className={`w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-[#0072bc] ${isRejected ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </div>

              {/* Selected Boards Display */}
              {selectedBoards.length > 0 && (
                <div className="mb-4 p-3 bg-[#d2f960] border-2 border-black rounded">
                  <p className="text-xs font-bold text-gray-700 mb-2">SELECTED BOARDS ({selectedBoards.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBoards.map((boardId) => {
                      const board = availableBoards.find((b) => String(b.id) === String(boardId))
                      return (
                        <div
                          key={boardId}
                          className="flex items-center gap-2 bg-white border border-black px-3 py-1 rounded"
                        >
                          <span className="text-sm font-semibold">{board?.title || "Board"}</span>
                          <button
                            type="button"
                            onClick={() => !isRejected && setSelectedBoards(selectedBoards.filter((id) => id !== boardId))}
                            disabled={isRejected}
                            className={`font-bold ${isRejected ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-800'}`}
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Available Boards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableBoards.map((board) => (
                  <label
                    key={String(board.id)}
                    className={`p-1 border-2 cursor-pointer rounded transition ${
                      selectedBoards.includes(String(board.id))
                        ? "border-black bg-[#d2f960]"
                        : "border-black bg-white hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBoards.includes(String(board.id))}
                      onChange={(e) => {
                        if (!isRejected) {
                          if (e.target.checked) {
                            setSelectedBoards([...selectedBoards, String(board.id)])
                          } else {
                            setSelectedBoards(selectedBoards.filter((id) => id !== String(board.id)))
                          }
                        }
                      }}
                      disabled={isRejected}
                      className={`mr-2 border-1 border-black border-solid ${isRejected ? 'cursor-not-allowed' : ''}`}
                    />
                    <span className="font-semibold text-gray-900">{board.title}</span>
                  </label>
                ))}
                {availableBoards.length === 0 && (
                  <div className="col-span-full text-center py-6 border-2 border-gray-300 rounded">
                    <p className="text-sm text-gray-600">No boards found</p>
                  </div>
                )}
              </div>
            </div>

            {/* External Resources Section */}
            <div className="border-2 border-black bg-white">
              <div className="border-b-2 border-black bg-[#f9f9f9] px-6 py-4">
                <div className='flex items-center justify-between'>
                  <h2 className="text-2xl font-bold">External Resources</h2>
                  <button
                    onClick={() => {
                      if (isRejected) return
                      setShowResourceForm(true)
                      setEditingResourceIndex(null)
                      setNewResourceTitle('')
                      setNewResourceDescription('')
                      setNewResourceUrl('')
                      // Scroll to form (optional)
                      setTimeout(() => {
                        document.getElementById('external-resource-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                      }, 100)
                    }}
                    disabled={isRejected}
                    className={`detach px-4 py-2 font-bold text-black transition ${isRejected ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:bg-yellow-400'}`}
                  >
                    <span className="relative z-10">+ Add Resource</span>
                  </button>
                </div>
                <p className="text-sm text-gray-600">Add links to external toolkits, resources, or related materials</p>
              </div>
              <div className="p-6 space-y-4">
                {/* Add/Edit External Resource Form */}
                {showResourceForm && (
                <div id="external-resource-form" className="border-2 border-gray-300 p-4 rounded bg-gray-50 space-y-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Title *</label>
                    <input
                      type="text"
                      value={newResourceTitle}
                      onChange={(e) => !isRejected && setNewResourceTitle(e.target.value)}
                      placeholder="Resource title"
                      disabled={isRejected}
                      maxLength={500}
                      className={`w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-[#0072bc] ${isRejected ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Description</label>
                    <textarea
                      value={newResourceDescription}
                      onChange={(e) => !isRejected && setNewResourceDescription(e.target.value)}
                      placeholder="Brief description of the resource"
                      disabled={isRejected}
                      rows={2}
                      className={`w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-[#0072bc] ${isRejected ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">URL *</label>
                    <input
                      type="url"
                      value={newResourceUrl}
                      onChange={(e) => !isRejected && setNewResourceUrl(e.target.value)}
                      placeholder="https://example.com"
                      disabled={isRejected}
                      maxLength={2000}
                      className={`w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-[#0072bc] ${isRejected ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="detach px-4 py-2 font-bold transition hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        if (isRejected) return
                        if (!newResourceTitle.trim() || !newResourceUrl.trim()) {
                          alert('Title and URL are required')
                          return
                        }
                        try {
                          new URL(newResourceUrl)
                        } catch {
                          alert('Please enter a valid URL')
                          return
                        }
                        
                        if (editingResourceIndex !== null) {
                          // Update existing resource
                          const updated = [...externalResources]
                          updated[editingResourceIndex] = {
                            title: newResourceTitle.trim(),
                            description: newResourceDescription.trim(),
                            url: newResourceUrl.trim(),
                          }
                          setExternalResources(updated)
                          setEditingResourceIndex(null)
                        } else {
                          // Add new resource
                          setExternalResources([
                            ...externalResources,
                            {
                              title: newResourceTitle.trim(),
                              description: newResourceDescription.trim(),
                              url: newResourceUrl.trim(),
                            },
                          ])
                        }
                        setNewResourceTitle('')
                        setNewResourceDescription('')
                        setNewResourceUrl('')
                        setShowResourceForm(false)
                      }}
                      disabled={isRejected || !newResourceTitle.trim() || !newResourceUrl.trim()}
                    >
                      <span className="relative z-10">{editingResourceIndex !== null ? 'Update Resource' : 'Add Resource'}</span>
                    </button>
                    <button
                      className={`detach px-4 py-2 font-bold transition border-2 border-black bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                      onClick={() => {
                        setEditingResourceIndex(null)
                        setNewResourceTitle('')
                        setNewResourceDescription('')
                        setNewResourceUrl('')
                        setShowResourceForm(false)
                      }}
                      disabled={isRejected}
                    >
                      <span className="relative z-10">Cancel</span>
                    </button>
                  </div>
                </div>
                )}

                {/* List of External Resources */}
                {externalResources.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-700 mb-3">ADDED RESOURCES ({externalResources.length})</p>
                    {externalResources.map((resource, index) => (
                      <div
                        key={index}
                        className="border-2 border-black p-3 rounded bg-white flex justify-between items-start"
                      >
                        {/* Reorder buttons */}
                        <div className="flex flex-col gap-1 mr-3">
                          <button
                            type="button"
                            onClick={() => moveExternalResourceUp(index)}
                            disabled={isRejected || index === 0}
                            className={`px-2 py-1 border-2 border-gray-400 text-gray-700 font-bold rounded text-xs ${isRejected || index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                            title="Move up"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => moveExternalResourceDown(index)}
                            disabled={isRejected || index === externalResources.length - 1}
                            className={`px-2 py-1 border-2 border-gray-400 text-gray-700 font-bold rounded text-xs ${isRejected || index === externalResources.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                            title="Move down"
                          >
                            ▼
                          </button>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm">{resource.title}</h4>
                          {resource.description && (
                            <p className="text-xs text-gray-600 mt-1">{resource.description}</p>
                          )}
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                          >
                            {resource.url}
                          </a>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            type="button"
                            onClick={() => {
                              if (isRejected) return
                              setNewResourceTitle(resource.title)
                              setNewResourceDescription(resource.description)
                              setNewResourceUrl(resource.url)
                              setEditingResourceIndex(index)
                              setShowResourceForm(true)
                              setTimeout(() => {
                                document.getElementById('external-resource-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                              }, 100)
                            }}
                            disabled={isRejected}
                            className={`text-sm px-2 py-1 border border-black rounded ${isRejected ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (isRejected) return
                              setExternalResources(externalResources.filter((_, i) => i !== index))
                              if (editingResourceIndex === index) {
                                setEditingResourceIndex(null)
                                setNewResourceTitle('')
                                setNewResourceDescription('')
                                setNewResourceUrl('')
                              }
                            }}
                            disabled={isRejected}
                            className={`text-sm px-2 py-1 border border-black rounded ${isRejected ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center">
                    <p className="text-gray-600">No external resources yet. Click "+ Add Resource" to get started.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex py-5 gap-4 justify-between">
              <Button
                onClick={() => { if (!uploadsInProgress) router.push("/") }}
                disabled={uploadsInProgress || isRejected}
              >
                <span className="relative z-10">Cancel</span>
              </Button>
              <Button
                onClick={handleSaveBasicsWithValidation}
                disabled={!canProceed || saving || uploadsInProgress || isRejected}
              >
                <span className="relative z-10">{isRejected ? "Cannot Edit Rejected Collection" : saving ? "Saving..." : "Save & Continue"}</span>
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Review & Publish */}
        {step === 2 && (
          <div className="space-y-8  border-2 border-black border-solid bg-white p-8">
            <div className="border-2 border-black bg-white">
              <div className="border-b-2 border-black bg-[#f9f9f9] px-6 py-4">
                <h2 className="text-2xl font-bold">Review Your Collection</h2>
              </div>
              <div className="p-8 space-y-6">
                {publishMessage && (
                  <div className="mb-4 border-2 border-green-500 bg-green-50 p-3 rounded">
                    <p className="text-green-800 font-semibold">{publishMessage}</p>
                  </div>
                )}
                {publishError && (
                  <div className="mb-4 border-2 border-red-500 bg-red-50 p-3 rounded">
                    <p className="text-red-800 font-semibold">{publishError}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-600 font-bold mb-1">Slug</p>
                    <p className="font-mono text-sm border-2 border-black p-2 bg-gray-50">{slug}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-bold mb-1">Title</p>
                    <p className="font-bold border-2 border-black p-2 bg-gray-50">{title}</p>
                  </div>
                </div>
                {imagePreviewUrl && (
                  <div>
                    <p className="text-xs text-gray-600 font-bold mb-2">Main Image</p>
                    <img
                      src={imagePreviewUrl || "/placeholder.svg"}
                      alt="Collection"
                      className="h-40 w-auto object-cover border-2 border-black rounded"
                    />
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-600 font-bold mb-2">Description Preview</p>
                  <div
                    className="border-2 border-black p-4 bg-gray-50 text-sm"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </div>
                {/* Sections Preview */}
                <div>
                  <p className="text-xs text-gray-600 font-bold mb-2">Sections</p>
                  <div className="space-y-4">
                    {sectionsList.map((s, si) => (
                      <div key={si} className="p-4 border rounded bg-white">
                        {s.title && <p className="font-bold mb-2">{s.title}</p>}
                        <div className="space-y-2">
                          {(s.items || []).map((it: any, ii: number) => (
                            <div key={ii}>
                              {it.type === 'txt' && (
                                <div className="prose text-sm" dangerouslySetInnerHTML={{ __html: it.txt || '' }} />
                              )}
                              {it.type === 'list' && (
                                <ul className="list-disc pl-6 text-sm">
                                  {(it.items || []).map((li: string, lidx: number) => (
                                    <li key={lidx}>{li}</li>
                                  ))}
                                </ul>
                              )}
                              {it.type === 'img' && it.src && (
                                <img src={it.src} alt="section" className="max-w-xs h-auto border" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected boards preview */}
                <div>
                  <p className="text-xs text-gray-600 font-bold mb-2">Boards</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBoards.map((bid) => {
                      const b = availableBoards.find((bb) => String(bb.id) === String(bid))
                      return (
                        <span key={bid} className="px-3 py-1 bg-gray-100 border rounded text-sm font-semibold">{b?.title || 'Board'}</span>
                      )
                    })}
                  </div>
                </div>
                <div className="flex justify-between gap-4 py-5">
                  <Button
                    onClick={() => setStep(1)}
                    disabled={uploadsInProgress || isRejected}
                  >
                    <span className="relative z-10">← Back</span>
                  </Button>
                  <Button
                    onClick={handlePreview}
                    disabled={uploadsInProgress || isRejected}
                  >
                    <span className="relative z-10">Preview</span>
                  </Button>
                  
                  {/* Show appropriate buttons based on edit mode and status */}
                  {isEditing && collectionStatus === 'published' ? (
                    // Editing a published collection
                    <>
                      <Button
                        onClick={handleSaveChanges}
                        disabled={saving || uploadsInProgress || isRejected}
                        // className="bg-blue-600 hover:bg-blue-700"
                      >
                        <span className="relative z-10">{isRejected ? "Cannot Save Rejected Collection" : saving ? "Saving..." : uploadsInProgress ? 'Uploads in progress...' : 'Save Changes'}</span>
                      </Button>
                      {/* Allow both admins and creators to update live page */}
                      {(isAdmin || (session?.uuid && collectionCreatorUuid === session.uuid)) && (
                        <Button
                          onClick={handleAdminPublish}
                          disabled={saving || uploadsInProgress || isRejected}
                        >
                          <span className="relative z-10">{isRejected ? "Cannot Update" : saving ? "Updating..." : uploadsInProgress ? 'Uploads in progress...' : 'Update Live Page'}</span>
                        </Button>
                      )}
                    </>
                  ) : isAdmin ? (
                    // Admin creating or editing draft - show both options
                    <>
                      <Button
                        onClick={handleSaveChanges}
                        disabled={saving || uploadsInProgress || isRejected}
                        // className="bg-blue-600 hover:bg-blue-700"
                      >
                        <span className="relative z-10">{isRejected ? "Cannot Save" : saving ? "Saving..." : uploadsInProgress ? 'Uploads in progress...' : isEditing ? 'Save Changes' : 'Save Draft'}</span>
                      </Button>
                      <Button
                        onClick={handleAdminPublish}
                        disabled={saving || uploadsInProgress || isRejected}
                      >
                        <span className="relative z-10">{isRejected ? "Cannot Publish" : saving ? "Publishing..." : uploadsInProgress ? 'Uploads in progress...' : 'Publish Now'}</span>
                      </Button>
                    </>
                  ) : (
                    // Regular users - save or submit for review
                    <>
                      <Button
                        onClick={handleSaveChanges}
                        disabled={saving || uploadsInProgress || isRejected}
                        // className="bg-blue-600 hover:bg-blue-700"
                      >
                        <span className="relative z-10">{isRejected ? "Cannot Save" : saving ? "Saving..." : uploadsInProgress ? 'Uploads in progress...' : isEditing ? 'Save Changes' : 'Save Draft'}</span>
                      </Button>
                      {(!isEditing || collectionStatus === 'draft') && (
                        <Button
                          onClick={handleSubmitForReview}
                          disabled={saving || uploadsInProgress || isRejected}
                        >
                          <span className="relative z-10">{isRejected ? "Cannot Submit" : saving ? "Submitting..." : uploadsInProgress ? 'Uploads in progress...' : 'Submit for Review'}</span>
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Upload progress banner */}
        {/* {uploadsInProgress && (
          <div className="fixed left-4 right-4 bottom-6 z-50">
            <div className="mx-auto max-w-3xl bg-yellow-100 border-2 border-yellow-400 p-3 rounded shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Uploads in progress — please wait</div>
                <div className="text-xs text-gray-700">Do not close this window</div>
              </div>
              <div className="mt-2 space-y-2">
                {mainImageUploadProgress !== null && (
                  <div>
                    <div className="h-2 bg-gray-200 rounded">
                      <div className="h-2 bg-[#0072bc] rounded" style={{ width: `${mainImageUploadProgress}%` }} />
                    </div>
                    <p className="text-xs text-gray-700 mt-1">Main image: {mainImageUploadProgress}%</p>
                  </div>
                )}
                {Object.keys(itemUploadProgress).map((k) => (
                  <div key={k}>
                    <div className="h-2 bg-gray-200 rounded">
                      <div className="h-2 bg-[#0072bc] rounded" style={{ width: `${itemUploadProgress[k]}%` }} />
                    </div>
                    <p className="text-xs text-gray-700 mt-1">Item {k}: {itemUploadProgress[k]}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}
