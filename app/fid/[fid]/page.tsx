import ClientPage from "@/app/client-page";

export default function Page({ params }: { params: { fid: string } }) {
  return <ClientPage fid={params.fid} />;
} 