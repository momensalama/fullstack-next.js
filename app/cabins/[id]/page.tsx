import Cabin from "@/components/Cabin";
import Reservation from "@/components/Reservation";
import Spinner from "@/components/Spinner";
import { getCabin, getCabins } from "@/lib/data-service";
import { Suspense } from "react";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const cabin = await getCabin(params.id);

  return {
    title: `Cabin ${cabin.name}`,
    description: cabin.description,
    image: cabin.image,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const cabin = await getCabin(params.id);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />
      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
