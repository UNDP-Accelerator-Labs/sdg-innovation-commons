import ConfirmEmailClient from './client'

export default async function ConfirmEmailPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params 
  return <ConfirmEmailClient token={token} />
}