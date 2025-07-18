import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { GET_TRIP_BY_ID } from "../../../../graphql/queries";
import LoaderExternal from "../../../../components/LoadingExternal";
import { ErrorMessage } from "../../../../components/ErrorMessage";

function ImageGrid() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const router = useRouter();
  const { program_id } = router.query;

  const { data, loading, error } = useQuery(GET_TRIP_BY_ID, {
    variables: { id: program_id },
    skip: !program_id,
  });

  if (loading) return <LoaderExternal/>;
  if (error) return <ErrorMessage/>

  const trip = data?.trip;
  const galleryImages =trip?.galleryImages
    


  return (
    <div className="bigbox wrapper py-[40px]">
      <div className="flex justify-between items-center w-full mb-6">
        <div className="flex xl:justify-center items-center gap-[20px] lg:gap-[10px]">
          <button className="flex items-center justify-center gap-2 p-[6px] md:p-[12px] rounded-[8px]">
            <svg width="18" height="20" fill="none" viewBox="0 0 18 20">
              <path d="M14.593 1.32206C15.693..." stroke="#475467" strokeWidth="1.5" />
            </svg>
            <p className="text-[#475467]">حفظ</p>
          </button>
          <button className="flex items-center justify-center gap-2 p-[6px] md:p-[12px] rounded-[8px]">
            <svg width="20" height="22" fill="none" viewBox="0 0 20 22">
              <path d="M5.21669 9.90704C4.97455..." stroke="#475467" strokeWidth="1.5" />
            </svg>
            <p className="text-[#475467]">مشاركة</p>
          </button>
        </div>
        <Link href="javascript:history.back()" className="text-[#475467] flex justify-end gap-[8px]">
          رجوع
          <Image src="/icons/arrow.png" height={20} width={20} alt="رجوع" />
        </Link>
      </div>

      {galleryImages?.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد صور متاحة لهذه الرحلة.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages?.map((img) => (
            <div key={img.id} className="relative h-[300px] rounded-[12px] overflow-hidden">
              <Image
                src={
                  img.picture
                    ? `${baseUrl}/media/${img?.picture}`
                    : "/images/fallback.jpg"
                }
                alt={img.title || "صورة من الرحلة"}
                fill
                className="object-cover hover:opacity-[0.9] transition-opacity"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageGrid;
