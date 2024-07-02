import CabinCard from "@/components/CabinCard";
import { getCabins } from "@/lib/data-service";

async function CabinList() {
  const cabins = await getCabins();
  if (!cabins.length) {
    return <p>No cabins found.</p>;
  }
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {cabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
