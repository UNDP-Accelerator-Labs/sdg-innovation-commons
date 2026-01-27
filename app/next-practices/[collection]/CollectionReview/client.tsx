"use client"
import { useEffect, useState } from "react"
import clsx from "clsx"
import { useSharedState } from "@/app/ui/components/SharedState/Context"
import Modal from "@/app/ui/components/Modal"
import { Button } from "@/app/ui/components/Button"
import { CheckCircle, AlertCircle, Clock, MessageSquare } from "lucide-react"

interface Props {
  slug: string
  highlights: any
  creatorName?: string | null | undefined
}

interface CommentItem {
  by?: string
  comment?: string
  at?: string
}

export default function CollectionReview({ slug, highlights: _highlights, creatorName: _creatorName }: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [highlights, setHighlights] = useState<any>(_highlights)
  const [creatorName, setCreatorName] = useState<string | null | undefined>(_creatorName)
  const [comments, setComments] = useState<CommentItem[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [busy, setBusy] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null)
  const [confirmComment, setConfirmComment] = useState("")
  const [hasReviewData, setHasReviewData] = useState(false)

  const { sharedState } = useSharedState()
  const uuid = sharedState?.session?.uuid || null

  const fetchMeta = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/collections?slug=${encodeURIComponent(slug)}`)
      if (!res.ok) {
        if (res.status === 404) {
          setError("Collection not found")
        } else {
          setError("Failed to load collection")
        }
        setLoading(false)
        return null
      }
      const data = await res.json()
      setHighlights(data.highlights || null)
      setCreatorName(data.creator_name || data.creatorName || null)
      return data
    } catch (e) {
      console.error("Failed to load collection meta", e)
      setError("Failed to load collection")
      return null
    } finally {
      setLoading(false)
    }
  }

  const checkAdmin = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/check")
      if (!res.ok) {
        setIsAdmin(false)
        return false
      }
      const data = await res.json().catch(() => ({}))
      const rights = Number(data?.rights || 0)
      const isAdminNow = rights >= 4
      setIsAdmin(isAdminNow)
      return isAdminNow
    } catch (e) {
      setIsAdmin(false)
      return false
    }
  }

  useEffect(() => {
    let mounted = true

    const init = async () => {
      setLoading(true)
      setError(null)

      const [adminResult, meta] = await Promise.all([checkAdmin(), fetchMeta()])

      const fetchedHighlights = meta?.highlights ?? highlights
      const currentComments = Array.isArray(fetchedHighlights?.comments) ? fetchedHighlights.comments : []
      if (!mounted) return
      setComments(currentComments)

      const computedHasReview = Boolean(
        (fetchedHighlights &&
          (fetchedHighlights.published === false ||
            fetchedHighlights.creator_uuid === uuid ||
            (currentComments && currentComments.length > 0))) ||
          adminResult,
      )
      if (mounted) setHasReviewData(computedHasReview)
      if (mounted) setLoading(false)
    }

    void init()

    return () => {
      mounted = false
    }
  }, [slug])

  const doAction = async (action: "approve" | "reject" | "comment") => {
    if (busy) return

    if (action === "approve" || action === "reject") {
      setConfirmAction(action)
      setConfirmComment("")
      setConfirmOpen(true)
      return
    }

    setBusy(true)
    setStatusMessage(null)
    try {
      const body: any = { slug, action }
      if (commentText && commentText.trim()) body.comment = commentText.trim()

      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        if (res.status === 401) {
          setStatusMessage("Unauthorized: you are not permitted to perform this action.")
        } else {
          const data = await res.json().catch(() => ({}))
          setStatusMessage(data?.error || "Server error performing action")
        }
        setBusy(false)
        return
      }

      setStatusMessage("Comment added")
      setCommentText("")
      await fetchMeta()
    } catch (e) {
      console.error("Admin action failed", e)
      setStatusMessage("Failed to perform action")
    } finally {
      setBusy(false)
      setTimeout(() => setStatusMessage(null), 4000)
    }
  }

  const confirmSubmit = async () => {
    if (!confirmAction) return
    setBusy(true)
    setStatusMessage(null)
    try {
      const body: any = { slug, action: confirmAction }
      if (confirmComment && confirmComment.trim()) body.comment = confirmComment.trim()

      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        if (res.status === 401) {
          setStatusMessage("Unauthorized: you are not permitted to perform this action.")
        } else {
          const data = await res.json().catch(() => ({}))
          setStatusMessage(data?.error || "Server error performing action")
        }
        setBusy(false)
        return
      }

      setStatusMessage(`${confirmAction === "approve" ? "Approved" : "Rejected"}`)
      setConfirmOpen(false)
      setConfirmAction(null)
      setConfirmComment("")
      await fetchMeta()
    } catch (e) {
      console.error("Admin action failed", e)
      setStatusMessage("Failed to perform action")
    } finally {
      setBusy(false)
      setTimeout(() => setStatusMessage(null), 4000)
    }
  }

  if (loading) return null

  if (!hasReviewData) return null

  const getStatusColor = () => {
    if (highlights?.status === 'rejected') return "bg-red-50 border-red-200"
    if (highlights?.status === 'published' || highlights?.published) return "bg-green-50 border-green-200"
    if (highlights?.awaiting_review || highlights?.status === 'awaiting_review') return "bg-yellow-50 border-yellow-200"
    if (highlights?.published === false) return "bg-yellow-50 border-yellow-200"
    return "bg-blue-50 border-blue-200"
  }

  const getStatusIcon = () => {
    if (highlights?.status === 'rejected') return <AlertCircle className="w-5 h-5 text-red-600" />
    if (highlights?.status === 'published' || highlights?.published) return <CheckCircle className="w-5 h-5 text-green-600" />
    if (highlights?.awaiting_review || highlights?.status === 'awaiting_review') return <Clock className="w-5 h-5 text-yellow-600" />
    if (highlights?.published === false) return <Clock className="w-5 h-5 text-yellow-600" />
    return <AlertCircle className="w-5 h-5 text-blue-600" />
  }

  const getStatusText = () => {
    if(highlights?.status) {
      return highlights.status.split('_')
        .filter(Boolean)
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    }
    if(highlights?.awaiting_review) return "Awaiting Review";
    if (highlights?.published) return "Published"
    if (highlights?.published === false) return "Unpublished / Draft"
    return "Awaiting Review"
  }

  const isRejected = () => highlights?.status === 'rejected'

  return (
    <div className="inner xxl:px-[80px] xxl:w-[1440px] mx-auto w-[375px] px-[20px] md:w-[744px] lg:w-[992px] lg:px-[80px] xl:w-[1200px] xl:px-[40px]">
      <div className="border-2 border-black bg-white mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-3xl font-bold mb-4">Review & Audit</h3>
            <div className="space-y-3">
              <p className="text-base text-gray-700">
                <span className="font-semibold">Creator:</span> {creatorName || "Unknown"}
              </p>

              {/* <div className={clsx("border-2 border-black p-2 flex items-center gap-3", getStatusColor())}>
                {getStatusIcon()}
                <div>
                  <p className="font-bold text-lg">{getStatusText()}</p>
                  {highlights?.published_at && (
                    <p className="text-sm text-gray-600">
                      Published: {new Date(highlights.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  {highlights?.rejected_at && (
                    <p className="text-sm text-red-600">
                      Rejected: {new Date(highlights.rejected_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div> */}
            </div>
          </div>

          {comments && comments.length > 0 && (
            <div className="border-2 border-black p-4 bg-yellow-50 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <p className="text-4xl font-bold text-blue-600">{comments.length}</p>
              </div>
              <p className="text-sm font-semibold text-gray-700">Comments</p>
            </div>
          )}
        </div>
      </div>

      {comments && comments.length > 0 && (
        <div className="mb-8">
          <h4 className="text-base font-bold mb-4">Feedback & Comments</h4>
          <div className="space-y-4">
            {comments.map((c, i) => (
              <div key={i} className="border-2 border-black p-6 bg-white hover:bg-gray-50 transition">
                <div className="flex items-start justify-between mb-3 pb-3 border-b-2 border-black">
                  <div className="font-bold text-sm">{c.by || "Admin"}</div>
                  <div className="text-sm text-gray-600">
                    {c.at
                      ? new Date(c.at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-gray-800">{c.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(isAdmin || uuid === highlights?.creator_id) && (
        <div className="border-2 border-black py-4 bg-white">
          {/* <h4 className="text-xl font-bold mb-6">Admin Actions</h4> */}

          {isRejected() && !isAdmin && (
            <div className="mb-6 border-2 border-red-600 bg-red-50 p-4 rounded">
              <p className="text-red-800 font-semibold">This collection has been rejected and cannot be edited or commented on. Please create a new collection or contact an administrator.</p>
            </div>
          )}

          {(!isRejected() || isAdmin) && (
            <div className="mb-6">
              <label className="block font-bold text-lg mb-3">Add Comment (Optional)</label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write feedback or notes about this collection..."
                className="w-full border-2 border-black p-4 min-h-[120px] font-base focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          )}

          {statusMessage && (
            <div className="mb-6 border-2 border-green-600 bg-green-50 p-4 rounded">
              <p className="text-green-800 font-semibold">{statusMessage}</p>
            </div>
          )}

          {(!isRejected() || isAdmin) && (
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => doAction("comment")}
                disabled={busy || (commentText.length === 0)}
                className={clsx(
                  "detach relative px-6 py-3 font-bold text-base",
                  busy ? "opacity-50 cursor-not-allowed" : "",
                )}
              >
                <span className="relative z-10">Add Comment</span>
              </button>
              {isAdmin && (
                <>
                  <button
                    onClick={() => doAction("reject")}
                    disabled={busy || highlights?.status === 'rejected'}
                    className={clsx(
                      "detach relative px-6 py-3 font-bold text-base text-red-700",
                      (busy || highlights?.status === 'rejected') ? "opacity-50 cursor-not-allowed" : "",
                    )}
                  >
                    <span className="relative z-10">
                      {highlights?.status === 'rejected' ? 'Already Rejected' : 'Reject'}
                    </span>
                  </button>
                  <button
                    onClick={() => doAction("approve")}
                    disabled={busy || highlights?.status === 'published' || highlights?.published}
                    className={clsx(
                      "detach relative px-6 py-3 font-bold text-base",
                      (busy || highlights?.status === 'published' || highlights?.published) ? "opacity-50 cursor-not-allowed" : "",
                    )}
                  >
                    <span className="relative z-10">
                      {highlights?.status === 'published' || highlights?.published ? 'Already Published' : 'Approve & Publish'}
                    </span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!confirmOpen}
        onClose={() => {
          if (!busy) {
            setConfirmOpen(false)
            setConfirmAction(null)
            setConfirmComment("")
          }
        }}
        title={confirmAction === "approve" ? "Confirm Approve & Publish" : "Confirm Reject"}
      >
        <p className="text-base text-gray-700 mb-6">
          This action cannot be undone. Are you sure you want to{" "}
          {confirmAction === "approve" ? "approve and publish" : "reject"} this collection?
        </p>
        {confirmAction === "reject" && (
          <div className="mb-6">
            <label className="block text-base font-bold mb-3">Optional reason / note to creator</label>
            <textarea
              value={confirmComment}
              onChange={(e) => setConfirmComment(e.target.value)}
              className="w-full p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        )}
        <div className="mt-8 flex gap-4 justify-end">
          <Button
            onClick={() => {
              if (!busy) {
                setConfirmOpen(false)
                setConfirmAction(null)
                setConfirmComment("")
              }
            }}
            className="detach relative px-6 py-3"
            disabled={busy}
          >
            <span className="relative z-10">Cancel</span>
          </Button>
          <Button
            onClick={confirmSubmit}
            disabled={busy}
            className={clsx(
              "detach relative px-6 py-3 font-bold",
              confirmAction === "approve" ? "" : "",
            )}
          >
            <span className="relative z-10">
              {busy ? "Working..." : confirmAction === "approve" ? "Confirm Publish" : "Confirm Reject"}
            </span>
          </Button>
        </div>
      </Modal>
    </div>
  )
}
