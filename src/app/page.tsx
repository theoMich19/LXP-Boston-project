import AdressSearchInput from "@/components/search/search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {


  return (
    <Card className={`flex gap-4 p-6 container mx-auto`}>
      <Input className="max-w-[30%]" />
      <AdressSearchInput />
      <Button>Rechercher</Button>
    </Card>
  )
}
