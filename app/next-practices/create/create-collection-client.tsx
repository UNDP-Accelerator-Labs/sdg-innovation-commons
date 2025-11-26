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
  // We do NOT fetch or show private boards. availableBoards is derived only from public search results.
  const [searchResults, setSearchResults] = useState<Board[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBoards, setSelectedBoards] = useState<string[]>([])
  const [availableBoards, setAvailableBoards] = useState<Board[]>([])

  const { sharedState } = useSharedState()
  const session = sharedState?.session || null

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
          
          setSlug(data.slug || "")
          setTitle(data.title || "")
          setDescription(data.description || "")
          setContent(data.content || "")
          setMainImage(data.main_image || "")
          setImagePreviewUrl(data.main_image || "")
          setSectionsList(data.sections || [])
          setSelectedBoards((data.boards || []).map((b: any) => String(b)))
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
      const payload = {
        slug: slug.trim(),
        title: title.trim(),
        description,
        content: content || null,
        main_image: mainImage || null,
        sections: sectionsList || [],
        // Preserve existing highlights when editing, don't overwrite with null
        ...(existingHighlights && { highlights: existingHighlights }),
        boards: selectedBoards.map((id) => Number(id)).filter((n) => Number.isFinite(n)),
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

      // success
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

  // Debounced autosave: save when relevant fields change
  useEffect(() => {
    // Require slug, title and main image AND require slug availability check to have completed and returned available
    const fieldsReady = slug.trim() !== '' && title.trim() !== '' && mainImage.trim() !== '' && slugExists === false && checkingSlug === false
    if (!fieldsReady) return
    const timer = setTimeout(() => {
      void autosaveToServer()
    }, 2000)
    return () => clearTimeout(timer)
  // include checkingSlug so autosave waits for the completion of slug check
  }, [slug, title, description, content, mainImage, JSON.stringify(sectionsList), selectedBoards.join(','), slugExists, checkingSlug])

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
        // Request SAS URL from server
        const q = new URL('/api/uploads/azure/sas', window.location.origin)
        q.searchParams.set('filename', file.name)
        q.searchParams.set('contentType', file.type)
        q.searchParams.set('container', 'sdgcommons')
        
        const res = await fetch(q.toString())
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to get upload URL')
        }
        
        const data = await res.json()
        const uploadUrl = data.uploadUrl
        
        // Upload with progress using XHR
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open('PUT', uploadUrl)
          xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob')
          if (file.type) xhr.setRequestHeader('Content-Type', file.type)
          
          xhr.upload.onprogress = (ev) => {
            if (ev.lengthComputable) {
              const pct = Math.round((ev.loaded / ev.total) * 100)
              setMainImageUploadProgress(pct)
            }
          }
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setMainImage(data.blobUrl)
              setImagePreviewUrl(data.blobUrl)
              setMainImageUploadProgress(null)
              resolve()
            } else {
              reject(new Error(`Upload failed with status: ${xhr.status}`))
            }
          }
          
          xhr.onerror = () => reject(new Error('Network error during upload'))
          xhr.ontimeout = () => reject(new Error('Upload timed out'))
          xhr.timeout = 30000 // 30 second timeout
          xhr.send(file)
        })
        
        console.log('Image uploaded successfully to:', data.blobUrl)
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
        const q = new URL('/api/uploads/azure/sas', window.location.origin)
        q.searchParams.set('filename', file.name)
        q.searchParams.set('contentType', file.type)
        q.searchParams.set('container', 'sdgcommons')
        
        const res = await fetch(q.toString())
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to get upload URL')
        }
        
        const data = await res.json()
        const uploadUrl = data.uploadUrl
        
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open('PUT', uploadUrl)
          xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob')
          if (file.type) xhr.setRequestHeader('Content-Type', file.type)
          
          xhr.upload.onprogress = (ev) => {
            if (ev.lengthComputable) {
              const pct = Math.round((ev.loaded / ev.total) * 100)
              setItemUploadProgress((p) => ({ ...p, [id]: pct }))
            }
          }
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const newSections = [...sectionsList]
              newSections[sectionIdx].items[itemIdx].src = data.blobUrl
              setSectionsList(newSections)
              setItemUploadProgress((p) => {
                const np = { ...p }
                delete np[id]
                return np
              })
              resolve()
            } else {
              reject(new Error(`Upload failed with status: ${xhr.status}`))
            }
          }
          
          xhr.onerror = () => reject(new Error('Network error during upload'))
          xhr.ontimeout = () => reject(new Error('Upload timed out'))
          xhr.timeout = 30000 // 30 second timeout
          xhr.send(file)
        })
        
        console.log('Section image uploaded successfully to:', data.blobUrl)
      } catch (e) {
        console.error('Azure section image upload failed:', e)
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
        slug: slug.trim(),
        title: title.trim(),
        description,
        content: content || null,
        main_image: mainImage || null,
        sections: sectionsList || [],
        // Preserve existing highlights when editing, but they'll be updated by submit_for_review flag
        ...(existingHighlights && { highlights: existingHighlights }),
        boards: selectedBoards.map((id) => Number(id)).filter((n) => Number.isFinite(n)),
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

  // Fetch public boards. If q is absent or shorter than 2 chars, load the default first 10 public boards.
  const fetchAvailableBoards = async (q?: string) => {
    try {
      const trimmed = (q || "").trim()
      let url = "/api/boards"
      if (!trimmed || trimmed.length < 2) {
        // load first 10 public boards by default
        url = "/api/boards?limit=10"
      } else {
        url = `/api/boards?q=${encodeURIComponent(trimmed)}`
      }
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
         const d = (data || []).map((b: any) => ({ ...b, id: String(b.id) }))
        setAvailableBoards(d)
        // normalize ids to strings and only keep public boards
        setSearchResults(d)
      } else {
        setSearchResults([])
      }
    } catch (e) {
      console.error('Board search failed', e)
      setSearchResults([])
    }
  }

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
          <div className="space-y-8 border-2 border-black border-solid bg-white p-8">
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
                    <p className="text-xs text-gray-600 mb-3">URL-friendly name (e.g., circular-economy)</p>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      placeholder="circular-economy"
                      disabled={isRejected}
                      className={`w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-[#0072bc] focus:ring-offset-2 font-mono text-sm ${isRejected ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                <span className="relative z-10">{isRejected ? "Cannot Edit Rejected Collection" : saving ? "Saving..." : "Next: Review"}</span>
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
                    <span className="relative z-10"> Preview</span>
                  </Button>
                  <Button
                    onClick={handleSubmitForReview}
                    disabled={saving || uploadsInProgress || isRejected}
                  >
                    <span className="relative z-10">{isRejected ? "Cannot Submit Rejected Collection" : saving ? "Submitting..." : uploadsInProgress ? 'Uploads in progress...' : 'Submit for review'}</span>
                  </Button>
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
